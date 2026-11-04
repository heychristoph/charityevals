// The waterfall (src/engine/waterfall.ts) on every model: it starts at the evaluator's figure (or the
// model at the defaults), its steps chain (each starts where the last ended) and it ends exactly at the
// figure the page shows, at the defaults and at a reader's own settings.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assumptionValues, buildLibrary, comparable, headline, usedAssumptions } from "./model";
import { waterfall } from "./waterfall";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const lib = buildLibrary(walk(join(root, "models")).map(read), read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
const models = [...lib.models.values()].filter((m) => m.kind !== "template" && m.output && comparable(lib, m));
const close = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b), 1e-12);

describe("waterfall", () => {
  const settings = {
    defaults: assumptionValues(lib.assumptions),
    // A reader in the United States who discounts distance, counts unmeasured work at 30% and values a
    // healthy year at 3 doubled-income years.
    reader: assumptionValues(lib.assumptions, { home_country: 840, distance_discount: 0.5, missing_data_discount: 0.3, uov_per_daly: 3 }),
  };
  for (const [name, av] of Object.entries(settings))
    it(`chains to the figure shown for every model (${name})`, () => {
      const bad: string[] = [];
      for (const m of models) {
        const w = waterfall(lib, m, av)!;
        const shown = headline(lib, m, av);
        let at = w.startValue;
        for (const s of w.steps) {
          if (!close(s.from, at)) bad.push(`${m.id}: "${s.label}" starts at ${s.from}, not ${at}`);
          at = s.to;
        }
        if (!close(at, shown) || !close(w.end, shown)) bad.push(`${m.id}: ends at ${at}, shows ${shown}`);
        // The evaluator's figure is theirs whatever the reader sets: the evaluator view at the defaults.
        if (m.evaluator && !close(w.startValue, headline(lib, m, settings.defaults, {}, "evaluator"))) bad.push(`${m.id}: starts at ${w.startValue}, not the evaluator view`);
      }
      expect(bad.slice(0, 10)).toEqual([]);
    }, 300_000);

  it("names where each step lives", () => {
    const m = models.find((x) => x.evaluator && x.rows.some((r) => r.published !== undefined) && usedAssumptions(lib, x).includes("uov_per_daly"))!;
    const w = waterfall(lib, m, settings.reader)!;
    for (const s of w.steps) if (s.kind !== "other") expect(s.target).toBeDefined();
    expect(w.steps.some((s) => s.kind === "yours" && s.target?.type === "assumption")).toBe(true);
  });
});
