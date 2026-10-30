import { describe, expect, it } from "vitest";
import { parse, evaluate, refs, ExprError } from "./expr";
import { buildLibrary, assumptionValues, compute, bottomLine, factUsage, headline } from "./model";
import { sensitivity } from "./sensitivity";

const ev = (src: string, rows: Record<string, number> = {}, a: Record<string, number> = {}, f: Record<string, number> = {}) =>
  evaluate(parse(src), (scope, n) => (scope === "row" ? rows : scope === "assumption" ? a : f)[n]);

describe("expressions", () => {
  it("follows operator precedence", () => {
    expect(ev("1 + 2 * 3")).toBe(7);
    expect(ev("2 ^ 3 ^ 2")).toBe(512);
    expect(ev("-2 ^ 2")).toBe(-4);
    expect(ev("(1 + 2) * 3")).toBe(9);
  });
  it("reads percentages, refs and assumptions", () => {
    expect(ev("45%")).toBeCloseTo(0.45);
    expect(ev("x * $y", { x: 2 }, { y: 5 })).toBe(10);
    expect(ev("@kenya.ppp * 2", {}, {}, { "kenya.ppp": 3 })).toBe(6);
    expect(ev("if($on, 1, x)", { x: 7 }, { on: 0 })).toBe(7);
    expect(ev("if($on, 1, x)", { x: 7 }, { on: 1 })).toBe(1);
    const r = refs(parse("a + ln(b) * $c + @k.d"));
    expect([...r.rows]).toEqual(["a", "b"]);
    expect([...r.assumptions]).toEqual(["c"]);
    expect([...r.facts]).toEqual(["k.d"]);
  });
  it("matches ACE's NPV construction for fractional years", () => {
    // B + NPV(4%, B × 14) + 0, ACE cage-free cell B12
    expect(ev("pv_annuity_due(7864022, 0.04, 15)")).toBeCloseTo(90932653.11, 1);
    expect(ev("pv_annuity_due(100, 0, 2.5)")).toBeCloseTo(250);
  });
  it("rejects unknown functions and stray input", () => {
    expect(() => parse("eval(1)")).toThrow(ExprError);
    expect(() => parse("1 +")).toThrow(ExprError);
    expect(() => parse("a.b")).toThrow(ExprError);
  });
});

const assumptions = {
  groups: [{ id: "g", title: "G" }],
  rows: [
    { id: "w", section: "g", label: "weight", value: { low: 1, best: 2, high: 4 }, kind: "judgment", explainer: "x" },
    { id: "uov_per_daly", section: "g", label: "healthy year", value: { low: 1, best: 2, high: 4 }, kind: "judgment", explainer: "x" },
  ],
  units: {
    u: { label: "u", short: "u", to_common: "1" },
    v: { label: "v", short: "v", to_common: "$w" },
    d: { label: "d", short: "d", to_common: "$uov_per_daly" },
  },
  common: { unit: "u", benchmark: "base" },
};
const base = {
  id: "base", name: "Base", kind: "charity", cause: "global-health",
  rows: [
    { id: "a", label: "A", value: { low: 1, best: 2, high: 3 }, kind: "observed", explainer: "x" },
    { id: "b", label: "B", value: 10, kind: "judgment", explainer: "x" },
    { id: "out", label: "Out", formula: "a * b" },
  ],
  output: { row: "out", unit: "u", label: "out" },
};

describe("models", () => {
  it("uses published values and pinned assumptions in the evaluator view", () => {
    const m2 = {
      ...base, id: "pub",
      evaluator: { name: "Them", assumptions: { w: 4 } },
      rows: [
        { id: "a", label: "A", value: 3, published: 2, kind: "judgment", explainer: "we think 3" },
        { id: "out", label: "Out", formula: "a * $w" },
      ],
    };
    const lib = buildLibrary([base, m2], assumptions);
    expect(lib.errors).toEqual([]);
    const av = assumptionValues(lib.assumptions);
    const m = lib.models.get("pub")!;
    expect(compute(lib, m, av).out).toBe(6);
    expect(compute(lib, m, av, {}, "evaluator").out).toBe(8);
  });
  it("reads models from before charities and owners existed (history pages read old commits)", () => {
    const legacy = { ...base, id: "old", org: { name: "Old Org", website: "https://example.org" } };
    const lib = buildLibrary([base, legacy], assumptions);
    expect(lib.errors).toEqual([]);
    expect(lib.models.has("old")).toBe(true);
  });
  it("reads shared facts and rejects unknown ones", () => {
    const facts = [{ id: "kenya", label: "Kenya", rows: [{ id: "ppp", label: "PPP", value: 2, kind: "observed", explainer: "x" }] }];
    const m2 = { ...base, id: "f", rows: [{ id: "out", label: "Out", formula: "@kenya.ppp * 5 + @kenya.nope" }] };
    expect(buildLibrary([base, m2], assumptions, facts).errors.join()).toMatch(/unknown fact @kenya.nope/);
    const ok = { ...base, id: "f", rows: [{ id: "out", label: "Out", formula: "@kenya.ppp * 5" }] };
    const lib = buildLibrary([base, ok], assumptions, facts);
    expect(compute(lib, lib.models.get("f")!, assumptionValues(lib.assumptions)).out).toBe(10);
  });
  it("inherits rows and applies overrides", () => {
    const child = { id: "child", name: "Child", kind: "variant", cause: "global-health", extends: "base", rows: [{ id: "b", value: 20 }] };
    const lib = buildLibrary([child, base], assumptions);
    expect(lib.errors).toEqual([]);
    const m = lib.models.get("child")!;
    expect(compute(lib, m, assumptionValues(lib.assumptions)).out).toBe(40);
    expect(m.byId.get("a")!.inheritedFrom).toBe("base");
    expect(m.byId.get("b")!.overridden).toEqual(["value"]);
    expect(m.chain).toEqual(["child", "base"]);
  });
  it("reports formula cycles, unknown refs and missing provenance", () => {
    const bad = {
      ...base, id: "bad",
      rows: [
        { id: "x", label: "X", formula: "y + 1" },
        { id: "y", label: "Y", formula: "x + $nope" },
        { id: "z", label: "Z", value: 1, kind: "observed" },
        { id: "out", label: "Out", formula: "x + missing" },
      ],
    };
    const errs = buildLibrary([base, bad], assumptions).errors.join("\n");
    expect(errs).toMatch(/cycle/);
    expect(errs).toMatch(/unknown assumption \$nope/);
    expect(errs).toMatch(/unknown row missing/);
    expect(errs).toMatch(/source or an explainer/);
  });
  it("converts units and computes joint bounds on the headline", () => {
    const animal = { ...base, id: "animal", output: { row: "out", unit: "v", label: "out" } };
    const lib = buildLibrary([base, animal], assumptions);
    const av = assumptionValues(lib.assumptions);
    expect(bottomLine(lib, lib.models.get("animal")!, av).common).toBe(40);
    // Years of healthy life per $1,000: 40 / uov_per_daly × 1000.
    expect(headline(lib, lib.models.get("animal")!, av)).toBeCloseTo(20_000);
    const s = sensitivity(lib, lib.models.get("animal")!, av);
    expect(s.jointLow).toBeCloseTo(2_500); // a=1, w=1, uov_per_daly=4
    expect(s.jointHigh).toBeCloseTo(120_000); // a=3, w=4, uov_per_daly=1
    expect(s.swings.map((x) => x.id).sort()).toEqual(["a", "uov_per_daly", "w"]);
    expect(s.pointInputs).toEqual(["b"]);
  });
  it("never swings a healthy year's value where the headline cancels it", () => {
    const daly = { ...base, id: "daly", output: { row: "out", unit: "d", label: "out" } };
    const lib = buildLibrary([base, daly], assumptions);
    const av = assumptionValues(lib.assumptions);
    const m = lib.models.get("daly")!;
    expect(headline(lib, m, av)).toBe(20_000);
    expect(headline(lib, m, { ...av, uov_per_daly: 4 })).toBe(20_000);
    const s = sensitivity(lib, m, av);
    expect(s.swings.map((x) => x.id)).toEqual(["a"]);
    expect([s.jointLow, s.jointHigh]).toEqual([10_000, 30_000]);
    // Edits are held where the reader put them, and not swung.
    const e = sensitivity(lib, m, av, "charityevals", { a: 5 });
    expect([e.central, e.jointLow, e.jointHigh]).toEqual([50_000, 50_000, 50_000]);
  });
});

describe("shared facts", () => {
  it("lists the models that read each fact, when more than one does", () => {
    const facts = [{ id: "k", label: "K", rows: [
      { id: "a", label: "A", value: 2, kind: "observed", explainer: "x" },
      { id: "b", label: "B", value: 3, kind: "observed", explainer: "x" },
    ] }];
    const reads = (id: string, formula: string) => ({ ...base, id, rows: [{ id: "out", label: "Out", formula }] });
    const lib = buildLibrary([base, reads("y", "@k.a * @k.a"), reads("x", "@k.a + @k.b")], assumptions, facts);
    expect(lib.errors).toEqual([]);
    expect(factUsage(lib)).toEqual({ "k.a": ["x", "y"] });
  });
});
