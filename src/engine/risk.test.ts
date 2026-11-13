// The reader's risk ($risk_quantile, docs/normalization.md 2.18): each result counted at that share of
// its log-normal plausible range, 1 at 50%, never in the evaluator view.
import { describe, expect, it } from "vitest";
import { normInv } from "./expr";
import { assumptionValues, buildLibrary, bottomLine, headline, usedAssumptions } from "./model";

const assumptions = {
  groups: [{ id: "g", title: "G" }],
  rows: [
    { id: "uov_per_daly", section: "g", label: "healthy year", value: 1, kind: "judgment", explainer: "x" },
    { id: "risk_quantile", section: "g", label: "risk", format: "percent", value: 0.5, slider: { low: 0.05, high: 0.95, linear: true }, kind: "judgment", explainer: "x" },
  ],
  units: { u: { label: "u", short: "u", to_common: "1" } },
  common: { unit: "u", benchmark: "none" },
};
const model = (id: string) => ({ id, name: id, kind: "charity", cause: "global-health", rows: [{ id: "out", label: "out", value: 2, kind: "judgment", explainer: "x" }], output: { row: "out", unit: "u", label: "per $" }, evaluator: { name: "E", assumptions: {} } });
const S = 1.2;
const lib = buildLibrary([model("wide"), model("none")], assumptions, [], [], [], { spreads: { wide: S } });
const av = assumptionValues(lib.assumptions);
const at = (q: number) => ({ ...av, risk_quantile: q });
const m = (id: string) => lib.models.get(id)!;

describe("risk", () => {
  it("the normal quantile", () => {
    expect(normInv(0.5)).toBe(0);
    expect(normInv(0.05)).toBeCloseTo(-1.6448536, 6);
    expect(normInv(0.975)).toBeCloseTo(1.959964, 5);
  });
  it("counts the best guess at 50% and the range's ends at 5% and 95%", () => {
    expect(lib.errors).toEqual([]);
    const best = headline(lib, m("wide"), av);
    expect(headline(lib, m("wide"), at(0.05)) / best).toBeCloseTo(Math.exp(-S), 6);
    expect(headline(lib, m("wide"), at(0.95)) / best).toBeCloseTo(Math.exp(S), 6);
    expect(bottomLine(lib, m("wide"), at(0.05)).common / bottomLine(lib, m("wide"), av).common).toBeCloseTo(Math.exp(-S), 6);
  });
  it("moves nothing without a spread, and never the evaluator view", () => {
    expect(headline(lib, m("none"), at(0.05))).toBe(headline(lib, m("none"), av));
    expect(headline(lib, m("wide"), at(0.05), {}, "evaluator")).toBe(headline(lib, m("wide"), av, {}, "evaluator"));
    expect(usedAssumptions(lib, m("wide"))).toContain("risk_quantile");
    expect(usedAssumptions(lib, m("wide"), "evaluator")).not.toContain("risk_quantile");
  });
});
