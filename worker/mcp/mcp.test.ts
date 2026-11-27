import { describe, expect, it } from "vitest";
import { nextCount } from "./budget";
import { precompute, StoredFigures } from "./catalogue";
import { answerIds, getModelAnswer } from "./detail";
import { fixture } from "./fixture";
import { cachedLoader, libraryFrom, LoadError, type Loaded } from "./library";
import { handleMcp, MAX_ANSWER, type RateLimiter } from "./server";
import type { Budget, Context } from "./tools";

/** The server as deployed: the build's files (through JSON, as the worker reads them) and the library. */
function contexts(budget?: Budget) {
  const loaded = libraryFrom(fixture());
  const pre = precompute(loaded.lib);
  const answers = Object.fromEntries(answerIds(pre.catalogue).map((id) => [id, getModelAnswer(loaded.lib, pre.catalogue, new StoredFigures(pre.scenarios.default), loaded.defaults, id)]));
  const results = JSON.parse(JSON.stringify(pre));
  const stored: Context = { results: async () => results, library: async () => loaded, answer: async (id) => (id in answers ? JSON.parse(JSON.stringify(answers[id])) : undefined), budget };
  // Without the build's files: everything computed from the library.
  const live: Context = { results: async () => undefined, library: async () => libraryFrom(fixture()) as Loaded, budget };
  return { loaded, stored, live };
}
const { stored } = contexts();

const post = (body: unknown, headers: Record<string, string> = {}, limiter?: RateLimiter, ctx: Context = stored) =>
  handleMcp(new Request("https://charityevals.org/mcp", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) }), ctx, limiter);

let n = 0;
async function rpc(method: string, params?: unknown, ctx: Context = stored) {
  const res = await post({ jsonrpc: "2.0", id: ++n, method, params }, {}, undefined, ctx);
  expect(res.status).toBe(200);
  return (await res.json()) as { result?: any; error?: { code: number; message: string } };
}

/** A tool's answer: its JSON, or its error message. */
async function call(name: string, args: Record<string, unknown> = {}, ctx: Context = stored) {
  const { result, error } = await rpc("tools/call", { name, arguments: args }, ctx);
  if (error) throw new Error(error.message);
  if (result.isError) return { error: result.content[0].text as string, out: undefined as any };
  expect(JSON.parse(result.content[0].text)).toEqual(result.structuredContent);
  return { out: result.structuredContent as any, error: undefined };
}

describe("MCP protocol", () => {
  it("initializes, echoing a supported protocol version and offering the newest otherwise", async () => {
    const { result } = await rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "t", version: "1" } });
    expect(result.protocolVersion).toBe("2025-06-18");
    expect(result.capabilities.tools).toBeDefined();
    expect(result.serverInfo.name).toBe("charityevals");
    expect((await rpc("initialize", { protocolVersion: "1999-01-01" })).result.protocolVersion).toBe("2025-11-25");
  });

  it("accepts notifications and client responses with 202 and no body", async () => {
    const res = await post({ jsonrpc: "2.0", method: "notifications/initialized" });
    expect(res.status).toBe(202);
    expect(await res.text()).toBe("");
    expect((await post({ jsonrpc: "2.0", id: 5, result: {} })).status).toBe(202);
  });

  it("lists the six tools, read-only, with input schemas", async () => {
    const { result } = await rpc("tools/list");
    expect(result.tools.map((t: { name: string }) => t.name)).toEqual(["search_charities", "get_model", "run_model", "compare", "rank", "list_assumptions"]);
    for (const t of result.tools) {
      expect(t.inputSchema.type).toBe("object");
      expect(t.annotations.readOnlyHint).toBe(true);
    }
  });

  it("answers errors the JSON-RPC way", async () => {
    expect((await rpc("nope")).error!.code).toBe(-32601);
    expect((await rpc("tools/call", { name: "nope" })).error!.code).toBe(-32602);
    const bad = await post("{not json");
    expect(bad.status).toBe(400);
    expect(((await bad.json()) as { error: { code: number } }).error.code).toBe(-32700);
    expect((await post({ jsonrpc: "2.0", id: 1, method: "ping" }, { "MCP-Protocol-Version": "1999-01-01" })).status).toBe(400);
    expect((await rpc("ping")).result).toEqual({});
  });

  it("answers a batch from older clients", async () => {
    const res = await post([{ jsonrpc: "2.0", id: 1, method: "ping" }, { jsonrpc: "2.0", method: "notifications/initialized" }, { jsonrpc: "2.0", id: 2, method: "tools/list" }]);
    const replies = (await res.json()) as { id: number }[];
    expect(replies.map((r) => r.id)).toEqual([1, 2]);
  });

  it("gives browsers a note, refuses an event stream, and allows any origin", async () => {
    const get = (accept: string) => handleMcp(new Request("https://charityevals.org/mcp", { headers: { Accept: accept } }), stored);
    const page = await get("text/html");
    expect(page.status).toBe(200);
    expect(page.headers.get("X-Robots-Tag")).toBe("noindex");
    expect(await page.text()).toContain("no authentication");
    expect((await get("text/event-stream")).status).toBe(405);
    const pre = await handleMcp(new Request("https://charityevals.org/mcp", { method: "OPTIONS" }), stored);
    expect(pre.status).toBe(204);
    expect(pre.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(pre.headers.get("Access-Control-Allow-Headers")).toContain("MCP-Protocol-Version");
    expect((await post({ jsonrpc: "2.0", id: 1, method: "ping" })).headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("limits requests per address where a limiter is bound", async () => {
    const seen: string[] = [];
    const limiter: RateLimiter = { limit: async ({ key }) => (seen.push(key), { success: seen.length < 2 }) };
    expect((await post({ jsonrpc: "2.0", id: 1, method: "ping" }, { "CF-Connecting-IP": "203.0.113.9" }, limiter)).status).toBe(200);
    expect((await post({ jsonrpc: "2.0", id: 1, method: "ping" }, { "CF-Connecting-IP": "203.0.113.9" }, limiter)).status).toBe(429);
    expect(seen).toEqual(["203.0.113.9", "203.0.113.9"]);
  });

  it("refuses oversized requests", async () => {
    expect((await post({ jsonrpc: "2.0", id: 1, method: "ping", params: { pad: "x".repeat(70_000) } })).status).toBe(413);
  });

  it("loads the library once, and again after a failure", async () => {
    let calls = 0;
    const get = cachedLoader(async () => {
      if (++calls === 1) throw new Error("not yet");
      return fixture();
    });
    await expect(get()).rejects.toThrow("not yet");
    const a = await get();
    expect(await get()).toBe(a);
    expect(calls).toBe(2);
  });

  it("says so when the library can't load", async () => {
    const res = await handleMcp(new Request("https://charityevals.org/mcp", { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "rank", arguments: {} } }) }), { results: () => Promise.reject(new LoadError("404")), library: () => Promise.reject(new LoadError("404")) });
    expect(((await res.json()) as { error: { code: number } }).error.code).toBe(-32603);
  });
});

describe("MCP tools", () => {
  it("search_charities finds by name and cause, with figures, models, pages and licences", async () => {
    const { out } = await call("search_charities", { query: "bednet" });
    expect(out.results.map((r: { id: string }) => r.id)).toEqual(["nets"]);
    const [nets] = out.results;
    expect(nets.result).toBe(20);
    expect(nets.unit).toBe("years of healthy life per $1,000");
    expect(nets.url).toBe("https://charityevals.org/nets");
    expect(nets.models.map((m: { id: string }) => m.id)).toEqual(["nets-charityevals"]);
    expect(out.licences[0].name).toBe("CC BY 4.0");
    const animal = (await call("search_charities", { cause: "animal-welfare" })).out;
    expect(animal.results.map((r: { id: string }) => r.id)).toEqual(["hens"]);
    expect((await call("search_charities", { query: "zzz" })).out.results).toEqual([]);
    expect((await call("search_charities", { cause: "space" })).error).toContain("Causes: ");
  });

  it("get_model explains a model: figure, range, drivers, source, page and licence", async () => {
    const { out } = await call("get_model", { id: "cash" });
    expect(out.type).toBe("model");
    expect(out.result).toBe(1.44);
    // The simulated range: half to twice the best guess.
    expect([out.low, out.high]).toEqual([0.72, 2.88]);
    expect(out.summary).toBe("Cash transfers: 1.4 years of healthy life per $1,000.");
    expect(out.top_drivers.map((d: { id: string }) => d.id)).toContain("benefit");
    expect(out.top_drivers.find((d: { id: string }) => d.id === "benefit").explainer).toContain("Why");
    expect(out.assumptions_used).toEqual(expect.arrayContaining(["discount_rate", "uov_per_daly"]));
    expect(out.source.publisher).toBe("GiveWell");
    expect(out.url).toBe("https://charityevals.org/cash");
    expect(out.full_model).toBe("https://charityevals.org/data/models/cash.json");
    expect(out.licence.name).toBe("CC BY-NC-SA 3.0 US");
    expect(out.licence.attribution).toContain("GiveWell");
    // The model shares its charity's id: its answer also gives the charity's figure as ranked.
    expect(out.charity).toMatchObject({ id: "cash", as_ranked: { result: expect.any(Number) } });
  });

  it("get_model takes a charity id, and pages a variant under its charity", async () => {
    const { out } = await call("get_model", { id: "nets" });
    expect(out.charity.type).toBe("charity");
    expect(out.main_model.id).toBe("nets-charityevals");
    expect(out.licence.name).toBe("CC BY 4.0");
    const chad = (await call("get_model", { id: "nets-charityevals-chad" })).out;
    expect(chad.url).toBe("https://charityevals.org/nets/nets-charityevals-chad");
    expect(chad.result).toBeCloseTo(16.7, 5);
    // A range from the inputs' ends where the model has no simulation.
    expect(chad.low).toBeLessThan(chad.result);
    expect(chad.high).toBeGreaterThan(chad.result);
  });

  it("get_model gives a unit that doesn't convert as its own unit per dollar", async () => {
    const { out } = await call("get_model", { id: "widgetco-charityevals" });
    expect(out.result).toBe(7);
    expect(out.unit).toBe("widgets per dollar");
  });

  it("run_model takes values, a value set, or both, and links to the page at them", async () => {
    const own = (await call("run_model", { id: "cash", values: { discount_rate: 0.08 } })).out;
    expect(own.result).toBe(1.38);
    expect(own.at_defaults.result).toBe(1.44);
    expect(own.values).toEqual({ applied: { discount_rate: 0.08 } });
    expect(own.url).toBe("https://charityevals.org/cash?values=discount_rate:0.08");
    expect(own.licence.name).toBe("CC BY-NC-SA 3.0 US");
    const set = (await call("run_model", { id: "cash", values: { set: "patient" } })).out;
    expect(set.result).toBe(1.5);
    expect(set.url).toBe("https://charityevals.org/cash?set=patient");
    const both = (await call("run_model", { id: "cash", values: { set: "patient", uov_per_daly: 4 } })).out;
    expect(both.result).toBe(0.749);
    // Not exactly a value set any more: the link carries every changed value, as the site writes it.
    expect(both.url).toBe("https://charityevals.org/cash?values=discount_rate:1e-3,uov_per_daly:4");
    // The share link's form works too.
    expect((await call("run_model", { id: "cash", values: "uov_per_daly:4" })).out.result).toBe(0.72);
  });

  it("run_model takes any value the models can run on, past a slider's ends too, as the site does", async () => {
    const { out } = await call("run_model", { id: "cash", values: { discount_rate: 0.5, uov_per_daly: 40 } });
    expect(out.values.applied).toEqual({ discount_rate: 0.5, uov_per_daly: 40 });
    expect(out.result).toBe(0.0375);
    // At the default: nothing changed, no link values.
    const same = (await call("run_model", { id: "cash", values: { discount_rate: 0.04 } })).out;
    expect(same.values).toBe("defaults");
    expect(same.url).toBe("https://charityevals.org/cash?set=default");
    // Values the models can't run on: negative, a share above 100%, 0 on a log scale.
    expect((await call("run_model", { id: "cash", values: { uov_per_daly: -2 } })).error).toContain("negative");
    expect((await call("run_model", { id: "cash", values: { discount_rate: 1.5 } })).error).toContain("at most 1");
    expect((await call("run_model", { id: "cash", values: { uov_per_daly: 0 } })).error).toContain("can't be 0");
  });

  it("run_model explains bad ids and values", async () => {
    expect((await call("run_model", { id: "cassh" })).error).toContain("No charity or model");
    expect((await call("run_model", { id: "cash", values: { nope: 1 } })).error).toContain("No assumption \"nope\"");
    expect((await call("run_model", { id: "cash", values: { fixed_rate: 1 } })).error).toContain("fixed");
    expect((await call("run_model", { id: "cash", values: { derived_rate: 1 } })).error).toContain("derived");
    expect((await call("run_model", { id: "cash", values: { discount_rate: "lots" } })).error).toContain("number");
    expect((await call("run_model", { id: "cash", values: { set: "impatient" } })).error).toContain("patient");
    expect((await call("run_model", {})).error).toContain("id is required");
  });

  it("compare gives charities' figures as ranked and models' own, in the order asked", async () => {
    const { out } = await call("compare", { ids: ["nets", "nets-charityevals-chad", "hens"], values: { uov_per_daly: 1 } });
    expect(out.items.map((x: { type: string; id: string }) => `${x.type}:${x.id}`)).toEqual(["charity:nets", "model:nets-charityevals-chad", "charity:hens"]);
    expect(out.items[0].result).toBe(40);
    expect(out.items[2].result).toBe(10);
    expect(out.licences.map((l: { name: string }) => l.name)).toEqual(["CC BY 4.0"]);
    expect((await call("compare", { ids: Array(11).fill("cash") })).error).toContain("at most");
    expect((await call("compare", { ids: ["cash", "nope"] })).error).toContain("nope");
  });

  it("rank orders charities best first, within a cause, at the reader's values", async () => {
    const { out } = await call("rank", {});
    expect(out.rankings.map((r: { id: string }) => r.id)).toEqual(["nets", "hens", "cash"]);
    expect(out.rankings[0]).toMatchObject({ rank: 1, result: 20, evaluator: "charityevals", url: "https://charityevals.org/nets" });
    expect(out.total).toBe(3);
    expect(out.licences.map((l: { name: string }) => l.name)).toEqual(["CC BY 4.0", "CC BY-NC-SA 3.0 US"]);
    const health = (await call("rank", { cause: "global-health", limit: 1, values: { set: "patient" } })).out;
    expect(health.rankings.map((r: { id: string }) => r.id)).toEqual(["nets"]);
    expect(health.total).toBe(2);
    expect(health.page).toBe("https://charityevals.org/causes/global-health?set=patient");
    // An area has no page of its own: its ranking links to its cause's page.
    const malaria = (await call("rank", { cause: "malaria" })).out;
    expect(malaria.rankings.map((r: { id: string }) => r.id)).toEqual(["nets"]);
    expect(malaria.page).toBe("https://charityevals.org/causes/global-health");
    expect((await call("rank", { limit: 0 })).error).toContain("limit");
    expect((await call("rank", { limit: 500 })).error).toContain("limit");
  });

  it("list_assumptions lists what a reader can set, the value sets and the licence", async () => {
    const { out } = await call("list_assumptions");
    const ids = out.assumptions.map((a: { id: string }) => a.id);
    expect(ids).toEqual(["uov_per_daly", "discount_rate", "fixed_rate"]);
    expect(out.assumptions[1]).toMatchObject({ id: "discount_rate", group: "People", default: 0.04, low: 0.001, high: 0.08, settable: true });
    expect(out.assumptions[2].settable).toBe(false);
    expect(out.value_sets[0]).toMatchObject({ id: "patient", values: { discount_rate: 0.001 } });
    expect(out.licence.name).toBe("CC BY 4.0");
  });

  it("never shows an evaluator that asked not to be published", async () => {
    const answers = await Promise.all([
      call("search_charities", {}),
      call("get_model", { id: "cash" }),
      call("compare", { ids: ["cash"] }),
      call("rank", { limit: 100 }),
      call("list_assumptions"),
    ]);
    const text = JSON.stringify(answers);
    expect(text).not.toMatch(/founders|-fp\b|secret/i);
    expect((await call("search_charities", { query: "secret" })).out.results).toEqual([]);
    expect((await call("search_charities", { query: "founders pledge" })).out.results).toEqual([]);
    expect((await call("get_model", { id: "cash-fp" })).error).toContain("No charity or model");
    expect((await call("get_model", { id: "secret" })).error).toContain("No charity or model");
  });

  it("keeps every answer under the size cap", async () => {
    for (const [name, args] of [["search_charities", { limit: 25 }], ["rank", { limit: 100 }], ["list_assumptions", {}]] as const)
      expect(JSON.stringify((await call(name, args)).out).length).toBeLessThan(MAX_ANSWER);
  });
});

/** Calls every tool makes, at the defaults, a value set and custom values. */
const CALLS: [string, Record<string, unknown>][] = [
  ["search_charities", {}],
  ["search_charities", { query: "bednet" }],
  ["get_model", { id: "cash" }],
  ["get_model", { id: "nets" }],
  ["get_model", { id: "widgetco" }],
  ["run_model", { id: "cash" }],
  ["run_model", { id: "nets-charityevals-chad", values: { set: "patient" } }],
  ["run_model", { id: "cash", values: { discount_rate: 0.08 } }],
  ["compare", { ids: ["nets", "hens", "widgetco", "cash"] }],
  ["compare", { ids: ["nets", "hens"], values: { set: "patient" } }],
  ["compare", { ids: ["nets", "hens"], values: { uov_per_daly: 3 } }],
  ["rank", {}],
  ["rank", { values: { set: "patient" } }],
  ["rank", { cause: "global-health", values: { discount_rate: 0.02 } }],
  ["list_assumptions", {}],
];

describe("precomputed answers", () => {
  it("are the answers computed from the library", async () => {
    const { stored, live } = contexts();
    for (const [name, args] of CALLS) expect((await call(name, args, stored)).out, `${name} ${JSON.stringify(args)}`).toEqual((await call(name, args, live)).out);
  });

  it("need no library for the defaults, the value sets and get_model", async () => {
    const { stored } = contexts();
    const noLibrary: Context = { ...stored, library: () => Promise.reject(new LoadError("not loaded")) };
    for (const [name, args] of CALLS.filter(([, a]) => !a.values || "set" in (a.values as object)))
      expect((await call(name, args, noLibrary)).error, `${name} ${JSON.stringify(args)}`).toBeUndefined();
    expect((await rpc("tools/call", { name: "rank", arguments: { values: { uov_per_daly: 3 } } }, noLibrary)).error!.code).toBe(-32603);
  });
});

describe("the daily budget for custom values", () => {
  it("counts each new calculation, not the defaults, value sets or a repeat", async () => {
    let taken = 0;
    const { stored } = contexts({ take: async () => (taken++, true) });
    await call("rank", {}, stored);
    await call("rank", { values: { set: "patient" } }, stored);
    await call("run_model", { id: "cash", values: { discount_rate: 0.03 } }, stored);
    await call("compare", { ids: ["cash", "nets"], values: { discount_rate: 0.03 } }, stored);
    expect(taken).toBe(1);
    await call("rank", { values: { discount_rate: 0.02 } }, stored);
    expect(taken).toBe(2);
  });

  it("refuses custom values once used up, while the defaults and value sets still answer", async () => {
    const { stored } = contexts({ take: async () => false });
    expect((await call("rank", { values: { discount_rate: 0.02 } }, stored)).error).toContain("quota");
    expect((await call("rank", { values: { set: "patient" } }, stored)).out.rankings.length).toBe(3);
    expect((await call("run_model", { id: "cash" }, stored)).out.result).toBe(1.44);
    // A budget that can't be reached counts as used up.
    const down = contexts({ take: () => Promise.reject(new Error("unreachable")) }).stored;
    expect((await call("run_model", { id: "cash", values: { discount_rate: 0.02 } }, down)).error).toContain("quota");
  });

  it("keeps only the last calculations per isolate", async () => {
    let taken = 0;
    const { stored } = contexts({ take: async () => (taken++, true) });
    for (let i = 1; i <= 9; i++) await call("rank", { values: { uov_per_daly: 1 + i / 10 } }, stored);
    await call("rank", { values: { uov_per_daly: 1.9 } }, stored);
    expect(taken).toBe(9);
    // The first was dropped to make room.
    await call("rank", { values: { uov_per_daly: 1.1 } }, stored);
    expect(taken).toBe(10);
  });

  it("counts a day's calculations up to the limit, and starts again the next day", () => {
    expect(nextCount(undefined, "2026-11-16", 2)).toEqual({ day: "2026-11-16", used: 1 });
    expect(nextCount({ day: "2026-11-16", used: 1 }, "2026-11-16", 2)).toEqual({ day: "2026-11-16", used: 2 });
    expect(nextCount({ day: "2026-11-16", used: 2 }, "2026-11-16", 2)).toBeUndefined();
    expect(nextCount({ day: "2026-11-16", used: 2 }, "2026-11-17", 2)).toEqual({ day: "2026-11-17", used: 1 });
  });
});
