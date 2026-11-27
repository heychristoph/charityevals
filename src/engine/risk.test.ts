// The reader's risk ($long_shot_value, docs/normalization.md 2.18): each result counted with every chance
// of reaching it raised to the power 2 − log10(setting), so 10 is the simulated average and 1 the most
// cautious; never in the evaluator view.
import { describe, expect, it } from "vitest";
import { QUANTILES, RISK_OFF, RISK_POWERS, assumptionValues, buildLibrary, bottomLine, headline, plausibleRange, usedAssumptions } from "./model";
import { simulate } from "./montecarlo";

const assumptions = {
  groups: [{ id: "g", title: "G" }],
  rows: [
    { id: "uov_per_daly", section: "g", label: "healthy year", value: 1, kind: "judgment", explainer: "x" },
    { id: "long_shot_value", section: "g", label: "risk", format: "number", value: 10, slider: { low: 1, high: 10 }, kind: "judgment", explainer: "x" },
  ],
  units: { u: { label: "u", short: "u", to_common: "1" } },
  common: { unit: "u", benchmark: "none" },
};
const model = (id: string) => ({ id, name: id, kind: "charity", cause: "global-health", rows: [{ id: "out", label: "out", value: 2, kind: "judgment", explainer: "x" }], output: { row: "out", unit: "u", label: "per $" }, evaluator: { name: "E", assumptions: {} } });
const Q = QUANTILES.map((p) => 0.5 + p);
// Risk-weighted results falling from 1.4 (the average) to 0.8 at the most cautious.
const RW = RISK_POWERS.map((a) => 1.4 - 0.6 * (a - 1));
const lib = buildLibrary([model("wide"), model("none")], assumptions, [], [], [], { distributions: { wide: { q: Q, mean: 1.4, zero: 0, rw: RW, middle: 1 } } });
const av = assumptionValues(lib.assumptions);
const at = (v: number) => ({ ...av, long_shot_value: v });
const m = (id: string) => lib.models.get(id)!;
const best = headline(lib, m("wide"), at(RISK_OFF));

describe("risk", () => {
  it("counts the average at 10 and the most cautious figure at 1, along the powers between", () => {
    expect(lib.errors).toEqual([]);
    expect(headline(lib, m("wide"), at(10)) / best).toBeCloseTo(1.4, 6);
    expect(headline(lib, m("wide"), at(1)) / best).toBeCloseTo(0.8, 6);
    // 10^0.5 ≈ 3.16 is the power 1.5, halfway.
    expect(headline(lib, m("wide"), at(10 ** 0.5)) / best).toBeCloseTo(1.1, 6);
    expect(bottomLine(lib, m("wide"), at(1)).common / bottomLine(lib, m("wide"), at(RISK_OFF)).common).toBeCloseTo(0.8, 6);
    // Past the slider's ends it holds.
    expect(headline(lib, m("wide"), at(20)) / best).toBeCloseTo(1.4, 6);
    expect(headline(lib, m("wide"), at(0.5)) / best).toBeCloseTo(0.8, 6);
  });
  it("leaves the plausible range where it is", () => {
    const r = plausibleRange(lib, m("wide"), headline(lib, m("wide"), at(1)), at(1))!;
    expect(r.low / best).toBeCloseTo(Q[0], 6);
    expect(r.high / best).toBeCloseTo(Q[18], 6);
  });
  it("moves nothing without a simulation, and never the evaluator view", () => {
    expect(headline(lib, m("none"), at(1))).toBe(headline(lib, m("none"), av));
    expect(headline(lib, m("wide"), at(1), {}, "evaluator")).toBe(headline(lib, m("wide"), av, {}, "evaluator"));
    expect(usedAssumptions(lib, m("wide"))).toContain("long_shot_value");
    expect(usedAssumptions(lib, m("wide"), "evaluator")).not.toContain("long_shot_value");
  });
});

describe("the risk-weighted results the simulation stores", () => {
  // A 1-in-10 chance of 10× an input, else nothing: the chance drawn as happens or doesn't.
  const shot = { ...model("shot"), rows: [{ id: "p", label: "chance", value: { low: 0.05, best: 0.1, high: 0.2 }, kind: "judgment", explainer: "x" }, { id: "out", label: "out", formula: "p" }] };
  it("start at the average and fall with each power", () => {
    const base = buildLibrary([shot], assumptions);
    const d = simulate(base, base.models.get("shot")!, 2000)!;
    expect(d.rw![0]).toBeCloseTo(d.mean, 3);
    for (let i = 1; i < d.rw!.length; i++) expect(d.rw![i]).toBeLessThanOrEqual(d.rw![i - 1]);
  });
});
