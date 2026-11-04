// Missing outcome data (docs/normalization.md 2.12): one rule for every model. An imported model's
// `missing_data.thin_share` is counted at $missing_data_discount in our view through the one factor in
// modelConversion the headline, `#id`, sensitivity, uncertainty and the tree share; charityevals' own
// builds carry the step in their missing_data_adj rows instead; the evaluator view never moves.
import { describe, expect, it } from "vitest";
import { assumptionValues, bottomLine, buildLibrary, compute, headline, headlineExprOf, missingDataFactor, usedAssumptions } from "./model";
import { sensitivity } from "./sensitivity";
import { uncertainty } from "./uncertainty";
import { childrenOf, lookupFor, rootOf } from "./tree";
import { inv21, keyOf } from "./invariants";

const assumptions = {
  groups: [{ id: "g", title: "G" }],
  rows: [
    { id: "uov_per_daly", section: "g", label: "healthy year", value: { low: 1, best: 2, high: 4 }, kind: "judgment", explainer: "x" },
    { id: "missing_data_discount", section: "g", label: "How much we count a programme whose results aren't measured", format: "percent", value: { low: 0.1, best: 0.5, high: 1 }, kind: "judgment", explainer: "x" },
  ],
  units: { u: { label: "u", short: "u", to_common: "1" } },
  common: { unit: "u", benchmark: "measured" },
};
const input = (id: string, value: number | object) => ({ id, label: id, value, kind: "judgment", explainer: "Test input." });
const imported = (id: string, thin: number | undefined, rows: object[], extra: object = {}) => ({
  id, name: id, kind: "charity", cause: "global-health", rows, output: { row: "out", unit: "u", label: "per $" }, evaluator: { name: "E", assumptions: {} }, beneficiaries: { KEN: 1 },
  ...(thin === undefined ? {} : { missing_data: { thin_share: thin, note: "Test classification." } }), ...extra,
});
const measured = imported("measured", 0, [input("x", { low: 2, best: 3, high: 4 }), { id: "out", label: "out", formula: "x" }]);
const thin = imported("thin", 1, [input("x", { low: 2, best: 3, high: 4 }), { id: "out", label: "out", formula: "x" }]);
const partly = imported("partly", 0.4, [input("x", 3), { id: "out", label: "out", formula: "x" }]);
const variant = { id: "partly-variant", name: "v", kind: "variant", cause: "global-health", extends: "partly", rows: [] };
// A thin model valued partly at a thin programme's result (a stand-in), and a charity moving money to it.
const proxy = imported("proxy", 1, [input("x", 1), { id: "out", label: "out", formula: "x + #thin" }]);
const mover = imported("mover", 0, [input("moved", 10), { id: "out", label: "out", formula: "moved * #thin" }], { beneficiaries: "destinations" });
// One of ours: the step is its marker row; no field.
const ours = {
  id: "ours", name: "ours", kind: "charity", cause: "global-health", owner: "charityevals", beneficiaries: { KEN: 1 },
  rows: [input("x", 3), { id: "missing_data_adj", label: "m", formula: "$missing_data_discount", explainer: "Thin." }, { id: "out", label: "out", formula: "x * missing_data_adj" }],
  output: { row: "out", unit: "u", label: "per $" },
};
const unclassified = imported("unclassified", undefined, [input("x", 1), { id: "out", label: "out", formula: "x" }]);
const lib = buildLibrary([measured, thin, partly, variant, proxy, mover, ours, unclassified], assumptions);
const av = assumptionValues(lib.assumptions);
const at = (d: number) => ({ ...av, missing_data_discount: d });
const m = (id: string) => lib.models.get(id)!;
const K = 500; // a unit of value per dollar is 500 healthy years per $1,000 at $uov_per_daly = 2

describe("missing outcome data", () => {
  it("counts the thin share at the slider: (1 − s) + s × d", () => {
    expect(lib.errors).toEqual([]);
    expect(headline(lib, m("measured"), av)).toBe(3 * K);
    expect(headline(lib, m("thin"), av)).toBeCloseTo(1.5 * K, 9);
    expect(headline(lib, m("partly"), av)).toBeCloseTo(3 * K * (0.6 + 0.4 * 0.5), 9);
    expect(headline(lib, m("partly-variant"), at(0.1))).toBeCloseTo(3 * K * (0.6 + 0.4 * 0.1), 9);
    expect(bottomLine(lib, m("thin"), av).common).toBeCloseTo(1.5, 12);
  });

  it("moves nothing at a slider of 1, and never in the evaluator view", () => {
    for (const id of ["measured", "thin", "partly", "partly-variant", "proxy", "mover", "ours"]) expect(missingDataFactor(lib, m(id), at(1))).toBe(1);
    // Our builds have no evaluator view; every import's stays put, destinations included.
    for (const id of ["measured", "thin", "partly", "partly-variant", "proxy", "mover"])
      expect(headline(lib, m(id), at(0.1), {}, "evaluator")).toBe(headline(lib, m(id), at(1), {}, "evaluator"));
    expect(headline(lib, m("thin"), at(1))).toBe(3 * K);
    expect(usedAssumptions(lib, m("thin"), "evaluator")).not.toContain("missing_data_discount");
    expect(usedAssumptions(lib, m("thin"))).toContain("missing_data_discount");
  });

  it("applies once: a stand-in is read at 1, a destination with its own step, our builds by their rows", () => {
    // The proxy reads the thin model's result in full and takes its own step: (1 + 3) × 0.5.
    expect(compute(lib, m("proxy"), av)["#thin"]).toBe(3);
    expect(headline(lib, m("proxy"), av)).toBeCloseTo(2 * K, 9);
    // The money mover's good is the destination's, step included: 10 × 3 × 0.5, its own factor 1.
    expect(headline(lib, m("mover"), av)).toBeCloseTo(15 * K, 9);
    // Ours: the marker only, no second factor.
    expect(missingDataFactor(lib, m("ours"), av)).toBe(1);
    expect(headline(lib, m("ours"), av)).toBeCloseTo(1.5 * K, 9);
  });

  it("reaches sensitivity, uncertainty and the tree through the same factor", () => {
    const s = sensitivity(lib, m("thin"), av);
    expect(s.central).toBeCloseTo(1.5 * K, 9);
    expect(s.swings.find((x) => x.id === "missing_data_discount")).toBeDefined();
    const u = (x: Record<string, number>) => uncertainty(lib, m("partly"), compute(lib, m("partly"), x), x, "charityevals").total;
    expect(u(av)).toBeGreaterThan(0);
    const look = lookupFor(lib, m("partly"), compute(lib, m("partly"), av), av, "charityevals");
    const root = rootOf(m("partly"), look, headlineExprOf(lib, m("partly"), { type: "ref", scope: "row", name: "out" }));
    expect(root.value).toBeCloseTo(3 * K * 0.8, 9);
    const step = childrenOf(m("partly"), root, look).find((c) => c.label === "For the part of the result that isn't measured");
    expect(step?.value).toBeCloseTo(0.8, 12);
  });

  it("INV-21 flags an imported model with no classification", () => {
    expect(inv21(lib).violations.map(keyOf)).toEqual(["unclassified missing_data"]);
  });
});
