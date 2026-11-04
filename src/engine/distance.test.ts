// Lives near and far (docs/normalization.md 2.13): the reader's home country and a discount per step of
// distance weigh each model by where its beneficiaries are, in our view only, through the one factor in
// modelConversion the headline, `#id`, sensitivity, uncertainty and the tree share.
import { describe, expect, it } from "vitest";
import { assumptionValues, bottomLine, buildLibrary, distanceFactor, headline, headlineExprOf, usedAssumptions } from "./model";
import { sensitivity } from "./sensitivity";
import { uncertainty } from "./uncertainty";
import { childrenOf, lookupFor, rootOf } from "./tree";
import { compute } from "./model";
import { expectedDistanceWeight, inv20, keyOf } from "./invariants";
import { populationShare, regionPopulationShare, steps } from "./countries";

const assumptions = {
  groups: [{ id: "g", title: "G" }],
  rows: [
    { id: "uov_per_daly", section: "g", label: "healthy year", value: { low: 1, best: 2, high: 4 }, kind: "judgment", explainer: "x" },
    { id: "home_country", section: "g", label: "Where you live", control: "country", format: "integer", value: 0, kind: "judgment", explainer: "x" },
    { id: "distance_discount", section: "g", label: "step", value: { low: 0, best: 0, high: 0.9 }, kind: "judgment", explainer: "x" },
  ],
  units: { u: { label: "u", short: "u", to_common: "1" } },
  common: { unit: "u", benchmark: "kenya" },
};
const input = (id: string, value: number | object) => ({ id, label: id, value, kind: "judgment", explainer: "Test input." });
const model = (id: string, beneficiaries: unknown, rows: object[]) => ({
  id, name: id, kind: "charity", cause: "global-health", rows, output: { row: "out", unit: "u", label: "per $" }, evaluator: { name: "E", assumptions: {} },
  ...(beneficiaries === undefined ? {} : { beneficiaries }),
});
const kenya = model("kenya", { KEN: 1 }, [input("x", { low: 2, best: 3, high: 4 }), { id: "out", label: "out", formula: "x" }]);
const us = model("us", { USA: 1 }, [input("x", 3), { id: "out", label: "out", formula: "x" }]);
const split = model("split", { USA: 0.5, CAN: 0.25, KEN: 0.25 }, [input("x", 3), { id: "out", label: "out", formula: "x" }]);
const world = model("world", "world", [input("x", 3), { id: "out", label: "out", formula: "x" }]);
// A US charity valued partly at a Kenyan programme's result (a stand-in), and a charity moving money to Kenya.
const proxy = model("proxy", { USA: 1 }, [input("x", 1), { id: "out", label: "out", formula: "x + #kenya" }]);
const mover = model("mover", "destinations", [input("moved", 10), { id: "out", label: "out", formula: "moved * #kenya" }]);
const missing = model("missing", undefined, [input("x", 1), { id: "out", label: "out", formula: "x" }]);
const lib = buildLibrary([kenya, us, split, world, proxy, mover, missing], assumptions);
const av = assumptionValues(lib.assumptions);
const at = (home: number, d: number) => ({ ...av, home_country: home, distance_discount: d });
const m = (id: string) => lib.models.get(id)!;
// The headline is per $1,000 in healthy years: a unit of value per dollar is 1000 / $uov_per_daly of them.
const K = 500;
const ids = ["kenya", "us", "split", "world", "proxy", "mover"];

describe("lives near and far", () => {
  it("changes nothing with no home country, or at a discount of 0", () => {
    expect(lib.errors).toEqual([]);
    for (const id of ids) {
      const h = headline(lib, m(id), av);
      expect(headline(lib, m(id), at(0, 0.9))).toBe(h);
      expect(headline(lib, m(id), at(840, 0))).toBe(h);
      expect(distanceFactor(lib, m(id), at(0, 0.5))).toBe(1);
    }
  });

  it("counts a life at home in full, in the region by 1 − d, elsewhere by (1 − d)²", () => {
    const a = at(840, 0.5); // the United States: Canada is the same region (Northern America)
    expect(headline(lib, m("us"), a)).toBe(3 * K);
    expect(headline(lib, m("kenya"), a)).toBeCloseTo(0.75 * K, 9);
    expect(headline(lib, m("split"), a)).toBeCloseTo(3 * K * (0.5 + 0.25 * 0.5 + 0.25 * 0.25), 9);
    expect(steps(840, "CAN")).toBe(1);
    // A benefit spread by world population: the share in each step is the population's.
    const p = populationShare(840), r = regionPopulationShare(840);
    expect(headline(lib, m("world"), a)).toBeCloseTo(3 * K * (p + (r - p) * 0.5 + (1 - r) * 0.25), 9);
    expect(distanceFactor(lib, m("world"), a)).toBeCloseTo(expectedDistanceWeight("world", 840, 0.5), 12);
  });

  it("weighs a stand-in by the reader's model's own beneficiaries, and moved money by each destination's", () => {
    const a = at(840, 0.5);
    // The proxy reads Kenya's result unweighted and takes its own (US) weight: 1 + 3.
    expect(compute(lib, m("proxy"), a)["#kenya"]).toBe(bottomLine(lib, m("kenya"), av).common);
    expect(headline(lib, m("proxy"), a)).toBeCloseTo(headline(lib, m("proxy"), av), 12);
    // The money mover's good is done in Kenya: 10 × 3 × 0.25, its own factor 1.
    expect(distanceFactor(lib, m("mover"), a)).toBe(1);
    expect(headline(lib, m("mover"), a)).toBeCloseTo(7.5 * K, 9);
    expect(headline(lib, m("mover"), at(404, 0.5))).toBeCloseTo(30 * K, 9);
  });

  it("never applies in the evaluator view, destinations included", () => {
    for (const id of ids) expect(headline(lib, m(id), at(840, 0.5), {}, "evaluator")).toBe(headline(lib, m(id), av, {}, "evaluator"));
    expect(usedAssumptions(lib, m("kenya"), "evaluator")).not.toContain("distance_discount");
    expect(usedAssumptions(lib, m("kenya"))).toContain("home_country");
  });

  it("reaches sensitivity, uncertainty and the tree through the same factor", () => {
    const a = at(840, 0.5);
    const s = sensitivity(lib, m("kenya"), a);
    expect(s.central).toBeCloseTo(0.75 * K, 9);
    expect(s.swings.find((x) => x.id === "distance_discount")).toBeDefined();
    const u = (x: Record<string, number>) => uncertainty(lib, m("kenya"), compute(lib, m("kenya"), x), x, "charityevals").total;
    expect(u(a)).toBeGreaterThan(u(at(0, 0.5)));
    const look = lookupFor(lib, m("kenya"), compute(lib, m("kenya"), a), a, "charityevals");
    const root = rootOf(m("kenya"), look, headlineExprOf(lib, m("kenya"), { type: "ref", scope: "row", name: "out" }));
    expect(root.value).toBeCloseTo(0.75 * K, 9);
    const step = childrenOf(m("kenya"), root, look).find((c) => c.label === "For where the lives it helps are");
    expect(step?.value).toBeCloseTo(0.25, 12);
  });

  it("INV-20 flags a model with no beneficiaries", () => {
    expect(inv20(lib).violations.map(keyOf)).toEqual(["missing beneficiaries"]);
  });
});
