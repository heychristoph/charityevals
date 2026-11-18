/// <reference types="node" />
// The MCP server against the repo's real library, with the files the build writes (src/lib/mcp-data.ts):
// the precomputed figures and get_model answers from the pages' library (src/lib/data.ts: every model file
// in full), and /data/mcp-library.json (published models, bulk imports as their browser stand-ins,
// without the text no answer quotes) for custom values. Both must give the site's figures.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assumptionValues, buildLibrary } from "../../src/engine/model";
import { renderLibraryProse } from "../../src/engine/prose";
import { precompute, StoredFigures } from "./catalogue";
import { answerIds, getModelAnswer } from "./detail";
import { charityFigure, rankings } from "./figures";
import { libraryFrom, type LibraryInput } from "./library";
import { handleMcp } from "./server";
import { slimLibrary } from "./slim";
import type { Context } from "./tools";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(join(root, p), "utf8"));
const walk = (d: string): string[] =>
  readdirSync(join(root, d)).flatMap((f) => {
    const p = join(d, f);
    return statSync(join(root, p)).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
  });

const owners = read("owners.json") as { id: string; published?: boolean; name?: string }[];
const hidden = new Set(owners.filter((o) => o.published === false).map((o) => o.id));
const shown = (m: { owner?: string }) => !hidden.has(m.owner ?? "");
const handBuilt = walk("models").filter((p) => !p.startsWith("models/grants/")).map(read);
const assumptions = read("assumptions/default.json");
const facts = walk("facts").map(read);
const charities = walk("charities").map(read);
const distributions = read("generated/distributions.json");

// As src/lib/open-data.ts libraryJson writes it, and src/lib/mcp-data.ts slims it.
const full: LibraryInput = {
  models: [...handBuilt, ...read("generated/bulk-summaries.json")].filter(shown),
  assumptions,
  facts,
  charities,
  owners: owners.filter((o) => o.published !== false),
  options: { distributions },
};
const text = JSON.stringify(slimLibrary(full));
const loaded = libraryFrom(JSON.parse(text));

// The pages' library (src/lib/data.ts): every model file in full, validated, its text rendered.
const site = buildLibrary([...handBuilt, ...walk("models/grants").map(read)], assumptions, facts, charities, owners, { distributions });
renderLibraryProse(site);

describe("MCP server on the real library", () => {
  it("fits in one static asset (Workers serve files up to 25 MiB), and holds no errors", () => {
    expect(text.length).toBeLessThan(25 * 1024 * 1024);
    expect(loaded.lib.errors).toEqual([]);
    expect(site.errors).toEqual([]);
  });

  it("ranks every charity at the site's figures, at the defaults and under a value set", () => {
    for (const values of [{}, assumptions.presets.find((p: { id: string }) => p.id === "animal-focused").values]) {
      const ours = rankings(loaded.lib, assumptionValues(loaded.lib.assumptions, values));
      const theirs = assumptionValues(site.assumptions, values);
      expect(ours.length).toBeGreaterThan(100);
      for (const f of ours) {
        const t = charityFigure(site, f.charity.id, theirs)!;
        expect(f.primary).toBe(t.primary);
        expect(f.central).toBeCloseTo(t.central, 6);
        expect(f.low).toBeCloseTo(t.low, 6);
        expect(f.high).toBeCloseTo(t.high, 6);
      }
    }
  });

  it("never ranks a purely theoretical estimate, while its charity's page still shows it", () => {
    const theory = [...site.models.values()].filter((m) => m.theoretical);
    expect(theory.length).toBeGreaterThan(0);
    const ranked = rankings(site, assumptionValues(site.assumptions));
    for (const f of ranked) for (const e of f.evaluators) for (const p of e.programmes) expect(p.model.theoretical, `${f.charity.id}: ${p.model.id}`).toBeFalsy();
    for (const m of theory) expect(charityFigure(site, m.charity, assumptionValues(site.assumptions), false), m.charity).toBeDefined();
  });

  it("gives a charity with several evaluators the primary's figure and the range across all of them, as the rankings do", () => {
    const multi = rankings(loaded.lib, assumptionValues(loaded.lib.assumptions)).filter((f) => f.evaluators.length > 1);
    expect(multi.length).toBeGreaterThan(5);
    for (const f of multi) {
      expect(f.low).toBe(Math.min(...f.evaluators.map((e) => e.low)));
      expect(f.high).toBe(Math.max(...f.evaluators.map((e) => e.high)));
      expect(f.central).toBe(f.evaluators.find((e) => e.owner === f.primary)!.central);
    }
  });

  it("answers each tool from the build's files as it would compute them, within the size cap, without unpublished evaluators", async () => {
    // What the build writes, through JSON as the worker reads it.
    const pre = precompute(site);
    const results = JSON.parse(JSON.stringify(pre));
    expect(JSON.stringify(pre).length).toBeLessThan(5_000_000);
    const defaults = new StoredFigures(pre.scenarios.default);
    const av = assumptionValues(site.assumptions);
    const ids = answerIds(pre.catalogue);
    expect(ids.length).toBeGreaterThan(400);
    const stored: Context = { results: async () => results, library: async () => loaded, answer: async (id) => (ids.includes(id) ? JSON.parse(JSON.stringify(getModelAnswer(site, pre.catalogue, defaults, av, id))) : undefined) };
    const live: Context = { results: async () => undefined, library: async () => libraryFrom(JSON.parse(text)) };
    const call = async (ctx: Context, name: string, args: Record<string, unknown>) => {
      const res = await handleMcp(new Request("https://charityevals.org/mcp", { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }) }), ctx);
      const body = (await res.json()) as { result: { isError?: boolean; content: { text: string }[]; structuredContent: Record<string, unknown> } };
      expect(body.result.isError, `${name}: ${body.result.content[0].text}`).toBeUndefined();
      return body.result.content[0].text;
    };
    const calls: [string, Record<string, unknown>][] = [
      ["search_charities", { query: "malaria" }],
      ["search_charities", { cause: "animal-welfare", limit: 25 }],
      ["get_model", { id: "against-malaria-foundation" }],
      ["get_model", { id: "givedirectly" }],
      ["run_model", { id: "givedirectly", values: { set: "ai-concerned", discount_rate: 0.02 } }],
      ["run_model", { id: "the-humane-league", values: { set: "animal-focused" } }],
      ["compare", { ids: ["against-malaria-foundation", "givedirectly", "the-humane-league"] }],
      ["rank", { limit: 100 }],
      ["rank", { cause: "climate", values: { set: "longtermist" } }],
      ["list_assumptions", {}],
    ];
    const names = owners.filter((o) => hidden.has(o.id)).map((o) => o.name!);
    const hiddenModels = handBuilt.filter((m) => !shown(m)).map((m) => m.id as string);
    for (const [name, args] of calls) {
      const out = await call(stored, name, args);
      // get_model's answers quote text the slimmed library leaves out: only the build's have it.
      if (name !== "get_model") expect(JSON.parse(out), `${name} ${JSON.stringify(args)}`).toEqual(JSON.parse(await call(live, name, args)));
      expect(out.length).toBeLessThan(60_000);
      // Their names may appear as a charity's (Founders Pledge is one), never as a model's evaluator.
      for (const n of names) expect(out).not.toMatch(new RegExp(`"evaluator":"${n}"|"attribution":"${n}`));
      for (const id of hiddenModels) expect(out).not.toContain(`"${id}"`);
      expect(out).toMatch(/"licences?":/);
    }
  });
});
