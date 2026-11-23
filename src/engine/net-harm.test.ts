// A net harm shows as a negative result (docs/normalization.md 2.22): the lint allows it, its simulation is
// stored in the result's order, the reader's risk and the plausible range run the right way, the tornado
// measures it, and figures carry a minus sign.
import { describe, expect, it } from "vitest";
import { assumptionValues, buildLibrary, headline, plausibleRange } from "./model";
import { simulate } from "./montecarlo";
import { flags, sensitivity } from "./sensitivity";
import { lintModel } from "./lint";
import { filled, load, templateFiles } from "./test-library";
import { formatYears } from "../lib/format";
import { METRICS, figureIn } from "../lib/metric";

const assumptions = {
  groups: [{ id: "g", title: "G" }],
  rows: [
    { id: "uov_per_daly", section: "g", label: "healthy year", value: 1, kind: "judgment", explainer: "x" },
    { id: "risk_quantile", section: "g", label: "risk", format: "percent", value: 0.5, slider: { low: 0.05, high: 0.95, linear: true }, kind: "judgment", explainer: "x" },
  ],
  units: { u: { label: "u", short: "u", to_common: "1" } },
  common: { unit: "u", benchmark: "none" },
};
const input = (id: string, value: object | number) => ({ id, label: id, value, kind: "observed", explainer: "Test input." });
const model = (id: string, sign: string) => ({ id, name: id, kind: "charity", cause: "global-health", output: { row: "out", unit: "u", label: "per $" },
  rows: [input("a", { low: 1, best: 4, high: 16 }), input("b", { low: 1, best: 9, high: 81 }), { id: "out", label: "out", formula: `${sign}a * b` }] });

describe("net harm", () => {
  const base = buildLibrary([model("good", ""), model("harm", "0 - ")], assumptions);
  const good = simulate(base, base.models.get("good")!, 4000)!;
  const harm = simulate(base, base.models.get("harm")!, 4000)!;
  const lib = buildLibrary([model("good", ""), model("harm", "0 - ")], assumptions, [], [], [], { distributions: { good, harm } });
  const m = lib.models.get("harm")!;
  const av = assumptionValues(lib.assumptions);
  const best = headline(lib, m, av);

  it("stores the simulation in the result's order: the mirror of the same good", () => {
    expect(best).toBeLessThan(0);
    expect(harm.unstable).toBeUndefined();
    // Seeded by id, so the draws differ: the same shape within the noise.
    for (let i = 0; i < 19; i++) expect(Math.abs(Math.log(harm.q[i] / good.q[18 - i]))).toBeLessThan(0.1);
    expect(harm.q[0]).toBeGreaterThan(harm.q[18]);
    for (let i = 1; i < 19; i++) expect(best * harm.q[i]).toBeGreaterThanOrEqual(best * harm.q[i - 1]);
    expect(harm.zero).toBe(1);
  });
  it("counts more harm at a low risk and less at a high one; the range runs low to high", () => {
    const at = (q: number) => headline(lib, m, { ...av, risk_quantile: q });
    expect(at(0.05)).toBeLessThan(best);
    expect(at(0.95)).toBeGreaterThan(best);
    const r = plausibleRange(lib, m, best, av)!;
    expect(r.low).toBeLessThan(best);
    expect(r.high).toBeGreaterThan(best);
  });
  it("measures swings below zero as ratios, and flags a range through zero", () => {
    const s = sensitivity(lib, m, av);
    expect(s.swings.every((w) => Number.isFinite(w.logSwing))).toBe(true);
    expect(s.swings[0].id).toBe("b");
    expect(flags(lib, m, { low: -1, high: 2, judgment: 0, points: 0 }).map((f) => f.text)).toContain("The plausible range runs from harm to good");
    expect(flags(lib, m, { low: -1000, high: -1, judgment: 0, points: 0 }).map((f) => f.short)).toContain("wide range");
  });
  it("shows the figure with a minus sign, before any prefix", () => {
    expect(formatYears(-0.23)).toBe("−0.23");
    // Below a tenth either way, the site's precision ends.
    expect(formatYears(-0.0023)).toBe("> −0.1");
    expect(formatYears(0.0023)).toBe("<0.1");
    expect(figureIn(METRICS.find((x) => x.id === "dollars")!, 0.001).format(-3)).toBe("> −$0.1");
    expect(formatYears(-250)).toBe("−250");
    const dollars = METRICS.find((x) => x.id === "dollars")!;
    expect(figureIn(dollars, 2).format(-3)).toBe("−$6.0");
  });
  it("passes the lint: a bottom line below zero is not a finding", () => {
    const raw = filled(templateFiles()["rights-advocacy"]);
    const rows = (raw.rows as Record<string, unknown>[]).map((r) => (r.id === "unmodelled_benefits_adj" ? { ...r, formula: undefined, value: { low: -3, best: -2, high: -1 }, kind: "judgment" } : r));
    const { lib: l, models } = load({ ...raw, rows });
    expect(headline(l, models[0], assumptionValues(l.assumptions))).toBeLessThan(0);
    expect(lintModel(l, models[0]).map((f) => f.code)).not.toContain("non-positive");
  }, 60_000);
});
