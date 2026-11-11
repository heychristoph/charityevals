// Side effects (rows marked `side_effect`): what reads them reads them through $side_effect_weight in
// our view; the evaluator view counts them in full, so an evaluator's sheet still reproduces.
import { describe, expect, it } from "vitest";
import { assumptionValues, buildLibrary, compute, headline, usedAssumptions } from "./model";

const assumptions = {
  groups: [{ id: "g", title: "G" }],
  rows: [
    { id: "uov_per_daly", section: "g", label: "healthy year", value: 1, kind: "judgment", explainer: "x" },
    { id: "side_effect_weight", section: "g", label: "Side effects count", format: "percent", value: { low: 0, best: 1, high: 1 }, kind: "judgment", explainer: "x" },
  ],
  units: { u: { label: "u", short: "u", to_common: "1" } },
  common: { unit: "u", benchmark: "m" },
};
const input = (id: string, value: number, extra: object = {}) => ({ id, label: id, value, kind: "judgment", explainer: "Test input.", ...extra });
const model = (id: string, rows: object[]) => ({ id, name: id, kind: "charity", cause: "global-health", rows, output: { row: "out", unit: "u", label: "per $" }, evaluator: { name: "E", assumptions: {} } });
const m = model("m", [
  input("main", 10),
  input("spill", 0.2, { side_effect: "added" }),
  input("household", 1.5, { side_effect: "factor" }),
  { id: "out", label: "out", formula: "main * (1 + spill) * household", expected: 18 },
]);
const lib = buildLibrary([m], assumptions);
const av = assumptionValues(lib.assumptions);
const at = (w: number) => ({ ...av, side_effect_weight: w });
const one = lib.models.get("m")!;

describe("side effects", () => {
  it("count in full at the default and not at all at 0", () => {
    expect(lib.errors).toEqual([]);
    expect(compute(lib, one, av).out).toBeCloseTo(18);
    expect(compute(lib, one, at(0)).out).toBeCloseTo(10);
    expect(compute(lib, one, at(0.5)).out).toBeCloseTo(10 * 1.1 * 1.25);
  });
  it("keep the rows' own values and never move the evaluator view", () => {
    expect(compute(lib, one, at(0)).spill).toBe(0.2);
    expect(headline(lib, one, at(0), {}, "evaluator")).toBe(headline(lib, one, av, {}, "evaluator"));
    expect(usedAssumptions(lib, one)).toContain("side_effect_weight");
    expect(usedAssumptions(lib, one, "evaluator")).not.toContain("side_effect_weight");
  });
  it("refuse a side effect computed from another", () => {
    const twice = model("t", [input("a", 0.1, { side_effect: "added" }), { id: "b", label: "b", formula: "a * 2", side_effect: "added" }, { id: "out", label: "out", formula: "1 + b" }]);
    expect(buildLibrary([twice], assumptions).errors.join()).toMatch(/weighted twice/);
  });
});
