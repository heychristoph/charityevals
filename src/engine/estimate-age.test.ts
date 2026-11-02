// An estimate counts less by its age, in our view only (docs/normalization.md 2.11): one factor in
// modelConversion that the headline, the common result `#id` reads, sensitivity, uncertainty and the
// tree all share; never in the evaluator view.
import { describe, expect, it } from "vitest";
import { ageFactor, assumptionValues, bottomLine, buildLibrary, compute, dateInYears, estimateAge, headline, usedAssumptions } from "./model";
import { sensitivity } from "./sensitivity";
import { uncertainty } from "./uncertainty";
import { lookupFor, rootOf } from "./tree";
import { headlineExprOf } from "./model";
import { inv19, keyOf } from "./invariants";

const assumptions = {
  groups: [{ id: "g", title: "G" }],
  rows: [
    { id: "uov_per_daly", section: "g", label: "healthy year", value: { low: 1, best: 2, high: 4 }, kind: "judgment", explainer: "x" },
    { id: "estimate_age_discount", section: "g", label: "age", value: { low: 0, best: 0.05, high: 0.15 }, kind: "judgment", explainer: "x" },
  ],
  units: { u: { label: "u", short: "u", to_common: "1" } },
  common: { unit: "u", benchmark: "dest", estimate_age_as_of: "2026-07-02" },
};
const input = (id: string, value: number | object) => ({ id, label: id, value, kind: "judgment", explainer: "Test input." });
const model = (id: string, published: string | undefined, rows: object[], extra: object = {}) => ({
  id, name: id.toUpperCase(), kind: "charity", cause: "global-health", rows, output: { row: "out", unit: "u", label: "per $" },
  ...(published ? { source: { title: id, publisher: "E", url: "https://example.org", retrieved: "2026-11-02", published } } : {}), ...extra,
});
// Ten years old (mid-2016 to 2 July 2026), and a meta charity two years old that reads it live.
const dest = model("dest", "2016", [input("x", 3), { id: "out", label: "out", formula: "x" }], { evaluator: { name: "E", assumptions: {} } });
const meta = model("meta-org", "2024-07-02", [input("moved", { low: 5, best: 10, high: 20 }), { id: "out", label: "out", formula: "moved * #dest" }], { evaluator: { name: "E", assumptions: {} } });
const undated = model("undated", undefined, [input("x", 1), { id: "out", label: "out", formula: "x" }]);
const lib = buildLibrary([dest, meta, undated], assumptions);
const av = assumptionValues(lib.assumptions);
const at = (d: number) => ({ ...av, estimate_age_discount: d });

describe("an estimate's age", () => {
  it("counts from the middle of a year or month given alone, to the fixed date in the data", () => {
    expect(lib.errors).toEqual([]);
    expect(dateInYears("2016")).toBeCloseTo(2016 + 182 / 366, 9);
    expect(dateInYears("2016-05")).toBeCloseTo(2016 + (31 + 29 + 31 + 30 + 14) / 366, 9);
    expect(dateInYears("2016-13-01")).toBeNaN();
    expect(estimateAge(lib, lib.models.get("dest")!)).toBeCloseTo(10, 2);
    expect(estimateAge(lib, lib.models.get("meta-org")!)).toBeCloseTo(2, 2);
    expect(estimateAge(lib, lib.models.get("undated")!)).toBeUndefined();
    // A date the library can't read is an error; one after the as-of date is age 0.
    const bad = buildLibrary([{ ...dest, source: { ...dest.source!, published: "June 2016" } }], assumptions);
    expect(bad.errors.join()).toMatch(/isn't a date/);
    const future = buildLibrary([{ ...dest, source: { ...dest.source!, published: "2027-01-01" } }], assumptions);
    expect(estimateAge(future, future.models.get("dest")!)).toBe(0);
  });

  it("divides the headline and the common result by (1 + d)^age in our view, never the evaluator's", () => {
    const m = lib.models.get("dest")!;
    const age = estimateAge(lib, m)!;
    for (const d of [0.05, 0.15]) {
      expect(headline(lib, m, at(d)) / headline(lib, m, at(0))).toBeCloseTo((1 + d) ** -age, 12);
      expect(bottomLine(lib, m, at(d)).common / bottomLine(lib, m, at(0)).common).toBeCloseTo((1 + d) ** -age, 12);
      expect(ageFactor(lib, m, at(d))).toBeCloseTo((1 + d) ** -age, 12);
      expect(headline(lib, m, at(d), {}, "evaluator")).toBe(headline(lib, m, at(0), {}, "evaluator"));
    }
    expect(usedAssumptions(lib, m)).toContain("estimate_age_discount");
    expect(usedAssumptions(lib, m, "evaluator")).not.toContain("estimate_age_discount");
  });

  it("discounts a meta charity's destinations by their own age and its own estimate by its own, and neither in the evaluator view", () => {
    const m = lib.models.get("meta-org")!;
    const own = estimateAge(lib, m)!, theirs = estimateAge(lib, lib.models.get("dest")!)!;
    expect(headline(lib, m, at(0.1)) / headline(lib, m, at(0))).toBeCloseTo(1.1 ** -(own + theirs), 12);
    expect(headline(lib, m, at(0.1), {}, "evaluator")).toBe(headline(lib, m, at(0), {}, "evaluator"));
    expect(compute(lib, m, at(0.1), {}, "evaluator")["#dest"]).toBe(compute(lib, m, at(0), {}, "evaluator")["#dest"]);
  });

  it("is a lever in sensitivity and a driver of uncertainty in our view only", () => {
    const m = lib.models.get("meta-org")!;
    const swing = (v: "charityevals" | "evaluator") => sensitivity(lib, m, av, v).swings.find((s) => s.id === "estimate_age_discount");
    expect(swing("charityevals")!.atHigh).toBeLessThan(swing("charityevals")!.atLow);
    expect(swing("evaluator")).toBeUndefined();
    const driver = (v: "charityevals" | "evaluator") => uncertainty(lib, m, compute(lib, m, av, {}, v), av, v).drivers.find((d) => d.id === "estimate_age_discount");
    expect(driver("charityevals")!.share).toBeGreaterThan(0);
    expect(driver("evaluator")).toBeUndefined();
  });

  it("ends the tree in the headline, the age a named part of it", () => {
    for (const id of ["dest", "meta-org"]) {
      const m = lib.models.get(id)!;
      const values = compute(lib, m, av);
      const root = rootOf(m, lookupFor(lib, m, values, av, "charityevals"), headlineExprOf(lib, m, { type: "ref", scope: "row", name: "out" }));
      expect(root.value).toBeCloseTo(headline(lib, m, av), 12);
    }
  });

  it("isn't applied by a library without the slider (an old commit's)", () => {
    const old = buildLibrary([dest], { ...assumptions, rows: assumptions.rows.slice(0, 1) });
    const m = old.models.get("dest")!;
    expect(headline(old, m, assumptionValues(old.assumptions))).toBe(3 / 2 * 1000);
  });

  it("INV-19 flags a model without a date", () => {
    expect(inv19(lib).violations.map(keyOf)).toEqual(["undated source.published"]);
  });
});
