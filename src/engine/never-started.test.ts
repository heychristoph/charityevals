// Lives that never start (rows marked `never_started`, docs/normalization.md 2.25): what reads their good
// reads it through $never_started_weight in our view; the evaluator view counts none unless the model
// pins the weight.
import { describe, expect, it } from "vitest";
import { assumptionValues, buildLibrary, compute, headline, usedAssumptions } from "./model";

const assumptions = {
  groups: [{ id: "g", title: "G" }],
  rows: [
    { id: "uov_per_daly", section: "g", label: "healthy year", value: 1, kind: "judgment", explainer: "x" },
    { id: "side_effect_weight", section: "g", label: "Side effects count", format: "percent", value: { low: 0, best: 1, high: 1 }, kind: "judgment", explainer: "x" },
    { id: "never_started_weight", section: "g", label: "Lives that never start count", format: "percent", value: { low: 0, best: 0, high: 1 }, kind: "judgment", explainer: "x" },
  ],
  units: { u: { label: "u", short: "u", to_common: "1" } },
  common: { unit: "u", benchmark: "m" },
};
const input = (id: string, value: number, extra: object = {}) => ({ id, label: id, value, kind: "judgment", explainer: "Test input.", ...extra });
const model = (id: string, rows: object[], pins: Record<string, number> = {}) => ({ id, name: id, kind: "charity", cause: "global-health", rows, output: { row: "out", unit: "u", label: "per $" }, evaluator: { name: "E", assumptions: pins } });
const rows = [
  input("deaths", 10),
  input("future", 30, { never_started: true }),
  input("siblings", -4, { never_started: true, side_effect: "added" }),
  input("pain", 5),
  { id: "out", label: "out", formula: "deaths + future + siblings + pain" },
];
const lib = buildLibrary([model("m", rows), model("counted", rows, { never_started_weight: 1 })], assumptions);
const av = assumptionValues(lib.assumptions);
const at = (w: number, side = 1) => ({ ...av, never_started_weight: w, side_effect_weight: side });
const one = lib.models.get("m")!;

describe("lives that never start", () => {
  it("count nothing at the default, in full at 100%, and their suffering always", () => {
    expect(lib.errors).toEqual([]);
    expect(compute(lib, one, av).out).toBeCloseTo(15);
    expect(compute(lib, one, at(1)).out).toBeCloseTo(41);
    expect(compute(lib, one, at(0.5)).out).toBeCloseTo(28);
  });
  it("take both weights where the row is a side effect too", () => {
    expect(compute(lib, one, at(1, 0)).out).toBeCloseTo(45);
    expect(compute(lib, one, at(1, 0.5)).out).toBeCloseTo(43);
  });
  it("keep the rows' own values and never move the evaluator view", () => {
    expect(compute(lib, one, at(1)).future).toBe(30);
    expect(headline(lib, one, at(1), {}, "evaluator")).toBe(headline(lib, one, av, {}, "evaluator"));
    expect(headline(lib, one, at(1), {}, "evaluator")).toBeCloseTo(15 * 1000);
    expect(usedAssumptions(lib, one)).toContain("never_started_weight");
    expect(usedAssumptions(lib, one, "evaluator")).not.toContain("never_started_weight");
  });
  it("count in the evaluator view where the evaluator counted them (the model pins the weight)", () => {
    expect(headline(lib, lib.models.get("counted")!, av, {}, "evaluator")).toBeCloseTo(41 * 1000);
  });
  it("refuse a never-started row computed from another, and one marked as a factor", () => {
    const twice = model("t", [input("a", 1, { never_started: true }), { id: "b", label: "b", formula: "a * 2", never_started: true }, { id: "out", label: "out", formula: "1 + b" }]);
    expect(buildLibrary([twice], assumptions).errors.join()).toMatch(/weighted twice/);
    const factor = model("f", [input("a", 1.2, { never_started: true, side_effect: "factor" }), { id: "out", label: "out", formula: "2 * a" }]);
    expect(buildLibrary([factor], assumptions).errors.join()).toMatch(/is an amount/);
  });
  it("let a side effect read a never-started row: one weight of each kind", () => {
    const mixed = model("m", [input("a", 10, { never_started: true }), { id: "b", label: "b", formula: "a * 2", side_effect: "added" }, { id: "out", label: "out", formula: "1 + b" }]);
    const l = buildLibrary([mixed], assumptions);
    expect(l.errors).toEqual([]);
    expect(compute(l, l.models.get("m")!, at(0.5, 0.5)).out).toBeCloseTo(1 + 0.5 * (0.5 * 10 * 2));
  });
});
