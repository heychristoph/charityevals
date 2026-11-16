/// <reference types="node" />
// The MCP server against the repo's real library, built as /data/library.json holds it (src/lib/open-data.ts):
// published models, bulk imports as their browser stand-ins (generated/bulk-summaries.json), the simulations. Its
// figures must be the site's: the same as a library built the way the pages build it (src/lib/data.ts).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assumptionValues, buildLibrary } from "../../src/engine/model";
import { renderLibraryProse } from "../../src/engine/prose";
import { charityFigure, rankings } from "./figures";
import { libraryFrom, type LibraryInput } from "./library";
import { handleMcp } from "./server";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(join(root, p), "utf8"));
const walk = (d: string): string[] =>
  readdirSync(join(root, d)).flatMap((f) => {
    const p = join(d, f);
    return statSync(join(root, p)).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
  });

const owners = read("owners.json") as { id: string; published?: boolean }[];
const hidden = new Set(owners.filter((o) => o.published === false).map((o) => o.id));
const shown = (m: { owner?: string }) => !hidden.has(m.owner ?? "");
const handBuilt = walk("models").filter((p) => !p.startsWith("models/grants/")).map(read);
const assumptions = read("assumptions/default.json");
const facts = walk("facts").map(read);
const charities = walk("charities").map(read);
const distributions = read("generated/distributions.json");

// As src/lib/open-data.ts libraryJson writes it.
const input: LibraryInput = {
  models: [...handBuilt, ...read("generated/bulk-summaries.json")].filter(shown),
  assumptions,
  facts,
  charities,
  owners: owners.filter((o) => o.published !== false),
  options: { distributions },
};
const text = JSON.stringify(input);
const loaded = libraryFrom(JSON.parse(text));

describe("MCP server on the real library", () => {
  it("fits in one static asset (Workers serve files up to 25 MiB)", () => {
    expect(text.length).toBeLessThan(25 * 1024 * 1024);
    expect(loaded.lib.errors).toEqual([]);
  });

  it("ranks every charity at the site's figures, at the defaults and under a value set", () => {
    // The pages' library: every model file in full, validated (src/lib/data.ts).
    const site = buildLibrary([...handBuilt, ...walk("models/grants").map(read)], assumptions, facts, charities, owners, { distributions });
    expect(site.errors).toEqual([]);
    renderLibraryProse(site);
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

  it("answers each tool, within the size cap, without unpublished evaluators", async () => {
    const calls: [string, Record<string, unknown>][] = [
      ["search_charities", { query: "malaria" }],
      ["search_charities", { cause: "animal-welfare", limit: 25 }],
      ["get_model", { id: "against-malaria-foundation" }],
      ["get_model", { id: "givedirectly" }],
      ["run_model", { id: "givedirectly", values: { set: "ai-concerned", discount_rate: 0.02 } }],
      ["compare", { ids: ["against-malaria-foundation", "givedirectly", "the-humane-league"] }],
      ["rank", { limit: 100 }],
      ["rank", { cause: "climate", values: { set: "longtermist" } }],
      ["list_assumptions", {}],
    ];
    // Their names may appear as a charity's (Founders Pledge is one), never as a model's evaluator.
    const names = owners.filter((o) => hidden.has(o.id)).map((o) => (o as { name?: string }).name!);
    const hiddenModels = handBuilt.filter((m) => !shown(m)).map((m) => m.id as string);
    for (const [name, args] of calls) {
      const res = await handleMcp(new Request("https://charityevals.org/mcp", { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }) }), async () => loaded);
      const body = (await res.json()) as { result: { isError?: boolean; content: { text: string }[]; structuredContent: Record<string, unknown> } };
      expect(body.result.isError, `${name}: ${body.result.content[0].text}`).toBeUndefined();
      const out = body.result.content[0].text;
      expect(out.length).toBeLessThan(60_000);
      for (const n of names) expect(out).not.toMatch(new RegExp(`"evaluator":"${n}"|"attribution":"${n}`));
      for (const id of hiddenModels) expect(out).not.toContain(`"${id}"`);
      expect(out).toMatch(/"licences?":/);
    }
  });
});
