import { describe, expect, it } from "vitest";
import { fixture } from "./fixture";
import { cachedLoader, libraryFrom } from "./library";
import { handleMcp, MAX_ANSWER, type RateLimiter } from "./server";

const loaded = libraryFrom(fixture());
const load = async () => loaded;

const post = (body: unknown, headers: Record<string, string> = {}, limiter?: RateLimiter) =>
  handleMcp(new Request("https://charityevals.org/mcp", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) }), load, limiter);

let n = 0;
async function rpc(method: string, params?: unknown) {
  const res = await post({ jsonrpc: "2.0", id: ++n, method, params });
  expect(res.status).toBe(200);
  return (await res.json()) as { result?: any; error?: { code: number; message: string } };
}

/** A tool's answer: its JSON, or its error message. */
async function call(name: string, args: Record<string, unknown> = {}) {
  const { result, error } = await rpc("tools/call", { name, arguments: args });
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
    const get = (accept: string) => handleMcp(new Request("https://charityevals.org/mcp", { headers: { Accept: accept } }), load);
    const page = await get("text/html");
    expect(page.status).toBe(200);
    expect(await page.text()).toContain("no authentication");
    expect((await get("text/event-stream")).status).toBe(405);
    const pre = await handleMcp(new Request("https://charityevals.org/mcp", { method: "OPTIONS" }), load);
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
    const res = await handleMcp(new Request("https://charityevals.org/mcp", { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "rank", arguments: {} } }) }), () => Promise.reject(new Error("404")));
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
    expect(both.url).toBe("https://charityevals.org/cash?set=patient&values=uov_per_daly:4");
    // The share link's form works too.
    expect((await call("run_model", { id: "cash", values: "uov_per_daly:4" })).out.result).toBe(0.72);
  });

  it("run_model moves a value outside a slider's ends to the nearest end", async () => {
    const { out } = await call("run_model", { id: "cash", values: { discount_rate: 0.5 } });
    expect(out.values.applied.discount_rate).toBe(0.08);
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
    expect((await call("rank", { limit: 0 })).error).toContain("limit");
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
