// The data files (/data/*) and /llms-full.txt: the page's own figures, published models only, and a
// library.json that rebuilds the site's library.
import { describe, expect, it } from "vitest";
import { lib, rankable } from "./data";
import { assumptionValues, buildLibrary, headline } from "../engine/model";
import { renderLibraryProse } from "../engine/prose";
import { figureOf } from "./open-data";
import { GET as charitiesGet } from "../pages/data/charities.json";
import { GET as modelsGet } from "../pages/data/models.json";
import { GET as modelGet, getStaticPaths } from "../pages/data/models/[id].json";
import { GET as assumptionsGet } from "../pages/data/assumptions.json";
import { GET as factsGet } from "../pages/data/facts.json";
import { GET as libraryGet } from "../pages/data/library.json";
import { GET as resultsGet } from "../pages/data/results.csv";
import { GET as llmsFullGet } from "../pages/llms-full.txt";
import { GET as llmsGet } from "../pages/llms.txt";
import owners from "../../owners.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const call = (get: any, params: Record<string, string> = {}) => (get({ params }) as Response).text();
const hidden = new Set(owners.filter((o) => (o as { published?: boolean }).published === false).map((o) => o.id));

describe("data files", () => {
  it("index every published model at its page's figures, with its licence", async () => {
    const { models } = JSON.parse(await call(modelsGet));
    expect(models.length).toBe(rankable.length);
    expect(models.filter((m: { owner: string }) => hidden.has(m.owner))).toEqual([]);
    const gd = models.find((m: { id: string }) => m.id === lib.assumptions.common.benchmark);
    const f = figureOf(lib.models.get(gd.id)!);
    expect(gd.headline).toBeCloseTo(f.headline, 3);
    expect(gd.low).toBeLessThanOrEqual(gd.headline);
    expect(gd.high).toBeGreaterThanOrEqual(gd.headline);
    for (const m of models) expect(m.licence.name, m.id).toBeTruthy();
    const csv = (await call(resultsGet)).trim().split("\n");
    expect(csv.length).toBe(rankable.length + 1);
  });

  it("give each model in full: rows with their values at the defaults", async () => {
    expect(getStaticPaths().length).toBe(rankable.length);
    const id = lib.assumptions.common.benchmark;
    const m = JSON.parse(await call(modelGet, { id }));
    const row = m.rows.find((r: { id: string }) => r.id === lib.models.get(id)!.output!.row);
    expect(Number.isFinite(row.computed)).toBe(true);
    expect(m.rows.every((r: { node?: unknown; deps?: unknown }) => r.node === undefined && r.deps === undefined)).toBe(true);
    expect(m.licence.name).toBeTruthy();
    expect(m.depends_on.length).toBeGreaterThan(0);
    expect(m.story.steps.length).toBeGreaterThan(1);
  });

  it("carry the shared data and charities with their licence", async () => {
    const charities = JSON.parse(await call(charitiesGet));
    expect(charities.licence.name).toBe("CC BY 4.0");
    expect(charities.charities.every((c: { models: string[] }) => c.models.length > 0)).toBe(true);
    const a = JSON.parse(await call(assumptionsGet));
    expect(a.rows.length).toBe(lib.assumptions.rows.length);
    const f = JSON.parse(await call(factsGet));
    expect(f.facts.length).toBe(lib.facts.size);
  });

  it("library.json rebuilds the site's library, published models only", async () => {
    const raw = JSON.parse(await call(libraryGet));
    expect(Object.keys(raw)).toEqual(["models", "assumptions", "facts", "charities", "owners", "options"]);
    expect(raw.owners.some((o: { id: string }) => hidden.has(o.id))).toBe(false);
    // @ts-expect-error: the parsed file's values, in buildLibrary's order
    const rebuilt = buildLibrary(...Object.values(raw));
    expect(rebuilt.errors).toEqual([]);
    expect(renderLibraryProse(rebuilt)).toEqual([]);
    expect([...rebuilt.models.keys()].sort()).toEqual([...lib.models.keys()].sort());
    const av = assumptionValues(lib.assumptions);
    const diffs = rankable.flatMap((m) => {
      const a = headline(lib, m, av), b = headline(rebuilt, rebuilt.models.get(m.id)!, av);
      return Object.is(a, b) || Math.abs(a - b) <= 1e-9 * Math.abs(a) ? [] : [`${m.id}: ${a} vs ${b}`];
    });
    expect(diffs).toEqual([]);
  });

  it("llms-full.txt names every published charity and model", async () => {
    const text = await call(llmsFullGet);
    for (const m of rankable) expect(text, m.id).toContain(`/data/models/${m.id}.json`);
    expect(text).not.toContain("NaN");
    expect(await call(llmsGet)).toContain("https://charityevals.org/data/library.json");
  });
});
