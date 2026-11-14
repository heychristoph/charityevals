// `#model-id`: a formula reading another model's live result (docs/normalization.md 2.8), and INV-12,
// the one way to value money a meta charity moves.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse, refs } from "./expr";
import { formulaText } from "./derive";
import { assumptionValues, buildLibrary, compute, headline, modelResult, pickValue, usedAssumptions } from "./model";
import { sensitivity } from "./sensitivity";
import { uncertainty } from "./uncertainty";
import { lookupFor, rootOf, childrenOf } from "./tree";
import { inv12, keyOf } from "./invariants";
import { CASH_BENCHMARK, GLOBAL_HEALTH_DESTINATIONS, MOVED_MONEY_ROWS, GLOBAL_HEALTH_ONLY } from "./moved-money";

const assumptions = {
  groups: [{ id: "g", title: "G" }],
  rows: [
    { id: "w", section: "g", label: "weight", value: { low: 1, best: 2, high: 4 }, kind: "judgment", explainer: "x" },
    { id: "uov_per_daly", section: "g", label: "healthy year", value: { low: 1, best: 2, high: 4 }, kind: "judgment", explainer: "x" },
  ],
  units: {
    u: { label: "u", short: "u", to_common: "1" },
    v: { label: "v", short: "v", to_common: "$w" },
  },
  common: { unit: "u", benchmark: "dest" },
};
const input = (id: string, value: number | object) => ({ id, label: id, value, kind: "judgment", explainer: "Test input." });
const model = (id: string, rows: object[], unit = "u", extra: object = {}) => ({
  id, name: id.toUpperCase(), kind: "charity", cause: "global-health", rows, output: { row: "out", unit, label: "per $" }, ...extra,
});
// A destination in unit v (worth $w each), and a meta model reading it live.
const dest = model("dest", [input("x", 3), { id: "out", label: "out", formula: "x" }], "v");
const meta = model("meta-org", [input("moved", { low: 5, best: 10, high: 20 }), { id: "out", label: "out", formula: "moved * #dest" }], "u", {
  evaluator: { name: "E", assumptions: { w: 4 } },
});

describe("model references (#id)", () => {
  it("parses hyphenated ids as model refs, round-trips to text", () => {
    const n = parse("2 * #against-malaria-foundation - x");
    expect([...refs(n).models]).toEqual(["against-malaria-foundation"]);
    expect([...refs(n).rows]).toEqual(["x"]);
    expect(formulaText(n)).toBe("2 * #against-malaria-foundation - x");
  });

  const lib = buildLibrary([dest, meta], assumptions);
  const av = assumptionValues(lib.assumptions);

  it("reads the referenced model's result in common units, live under the reader's values", () => {
    expect(lib.errors).toEqual([]);
    expect(modelResult(lib, "dest", av)).toBe(6);
    expect(headline(lib, lib.models.get("meta-org")!, av)).toBeCloseTo(60 / 2 * 1000);
    expect(headline(lib, lib.models.get("meta-org")!, { ...av, w: 3 })).toBeCloseTo(90 / 2 * 1000);
    // Stored beside the rows, so the tree and uncertainty read the same number.
    expect(compute(lib, lib.models.get("meta-org")!, av)["#dest"]).toBe(6);
  });

  it("uses our view of the referenced model even in the evaluator view of the reader", () => {
    // The evaluator pins $w = 4 for meta-org's own rows; dest is still read at the reader's $w = 2.
    expect(compute(lib, lib.models.get("meta-org")!, av, {}, "evaluator").out).toBe(60);
  });

  it("can be overridden like an input (#id), for leverage", () => {
    expect(compute(lib, lib.models.get("meta-org")!, av, { "#dest": 1 }).out).toBe(10);
  });

  it("counts the referenced model's assumptions as the reader's, so sensitivity swings them", () => {
    const m = lib.models.get("meta-org")!;
    expect(usedAssumptions(lib, m)).toContain("w");
    const s = sensitivity(lib, m, av);
    expect(s.swings.find((x) => x.id === "w")).toMatchObject({ atLow: 15000, atHigh: 60000 });
    // moved 5–20, $w 1–4, a healthy year's value 1–4.
    expect(s.jointLow).toBeCloseTo(5 * 3 * 1 / 4 * 1000);
    expect(s.jointHigh).toBeCloseTo(20 * 3 * 4 / 1 * 1000);
    // Uncertainty and the tree read the stored value without failing.
    const vals = compute(lib, m, av);
    expect(uncertainty(lib, m, vals, av, "charityevals").result).toBe(60);
    // Through the reference, $w moves dest's result one for one, so it is a driver of meta-org's.
    const w = uncertainty(lib, m, vals, av, "charityevals").drivers.find((d) => d.key === "assumption:w");
    expect(w?.elasticity).toBeCloseTo(1, 2);
    const look = lookupFor(lib, m, vals, av, "charityevals");
    const root = rootOf(m, look);
    const kids = childrenOf(m, root, look);
    expect(kids.find((k) => k.type === "model")).toMatchObject({ refId: "dest", value: 6 });
  });

  it("reports unknown models, models without a common result, and cycles", () => {
    const unknown = model("a", [{ id: "out", label: "out", formula: "#nope" }]);
    const noUnit = { ...model("b", [input("out", 1)]), output: undefined };
    const readsB = model("c", [{ id: "out", label: "out", formula: "#b" }]);
    const x = model("x", [{ id: "out", label: "out", formula: "#y" }]);
    const y = model("y", [{ id: "out", label: "out", formula: "2 * #x" }]);
    const l = buildLibrary([dest, unknown, noUnit, readsB, x, y], assumptions);
    expect(l.errors).toContain("a.out: unknown model #nope");
    expect(l.errors).toContain("c.out: model #b has no result in common units");
    expect(l.errors.some((e) => /model reference cycle (x → y → x|y → x → y)/.test(e))).toBe(true);
    // At run time a cycle gives NaN, never a stack overflow.
    expect(Number.isNaN(headline(l, l.models.get("x")!, assumptionValues(l.assumptions)))).toBe(true);
  });

  it("reads a charity's programme-weighted figure from one evaluator (#owner:charity), live", () => {
    const owners = [{ id: "ev", name: "Ev", short: "E", url: "https://example.org", kind: "evaluator" }];
    const prog = (id: string, x: number, unit = "u") => ({ ...model(id, [input("x", x), { id: "out", label: "out", formula: "x" }], unit), charity: "multi", owner: "ev" });
    const charity = {
      id: "multi", name: "Multi", cause: "global-health",
      lines: [{ id: "a", label: "A", models: "^prog-a", dollars: 3 }, { id: "b", label: "B", models: "^prog-b", dollars: 1 }],
    };
    const other = { id: "other", name: "Other", cause: "global-health" };
    const mine = (x: object) => ({ ...x, charity: "other", owner: "ev" });
    const reader = mine(model("reader", [{ id: "out", label: "out", formula: "10 * #ev:multi" }]));
    const l = buildLibrary([mine(dest), prog("prog-a", 2), prog("prog-b", 4, "v"), reader], assumptions, [], [charity, other], owners);
    expect(l.errors).toEqual([]);
    const r = l.models.get("reader")!;
    // (3 × 2 + 1 × 4 × $w) / 4 units of value per dollar: 3.5 at $w = 2, 4.5 at $w = 3.
    expect(compute(l, r, av).out).toBeCloseTo(35);
    expect(compute(l, r, { ...av, w: 3 }).out).toBeCloseTo(45);
    expect(usedAssumptions(l, r)).toContain("w");
    const bad = mine(model("bad", [{ id: "out", label: "out", formula: "#ev:nobody + #ev:multi" }]));
    expect(buildLibrary([mine(dest), prog("prog-a", 2), bad], assumptions, [], [charity, other], owners).errors).toContain("bad.out: unknown evaluator or charity #ev:nobody");
  });

  describe("a cause's charities on the rankings (#cause:x)", () => {
    const owners = [{ id: "ev", name: "Ev", short: "E", url: "https://example.org", kind: "evaluator" }];
    const charity = (id: string, cause = "catastrophic-risk", area?: string) => ({ id, name: id, cause, ...(area ? { area } : {}) });
    const charities = [charity("a1"), charity("a2"), charity("a3"), charity("mover"), charity("d1", "global-health", "democracy"), charity("other", "global-health")];
    const of = (c: string, m: object) => ({ ...m, charity: c, owner: "ev" });
    const ranked = (id: string, c: string, x: number) => of(c, model(id, [input("x", x), { id: "out", label: "out", formula: "x" }]));
    // A money mover in the cause, valuing its unnamed recipients at the cause's average.
    const mover = of("mover", model("mover-m", [{ id: "out", label: "out", formula: "2 * #cause:catastrophic-risk" }], "u", { beneficiaries: "destinations" }));
    const reader = of("other", model("reader", [{ id: "out", label: "out", formula: "#cause:catastrophic-risk + #cause:democracy" }]));
    const base = [mine(dest), ranked("a1-m", "a1", 2), ranked("a2-m", "a2", 4), ranked("d1-m", "d1", 10), mover, reader];
    function mine(x: object) { return of("other", x); }

    it("is the equal-weight mean of the cause's (or area's) ranked charities, money movers left out", () => {
      const l = buildLibrary(base, assumptions, [], charities, owners);
      expect(l.errors).toEqual([]);
      expect(compute(l, l.models.get("reader")!, av).out).toBeCloseTo(3 + 10);
    });

    it("follows a model added to the cause", () => {
      const l = buildLibrary([...base, ranked("a3-m", "a3", 9)], assumptions, [], charities, owners);
      expect(compute(l, l.models.get("reader")!, av).out).toBeCloseTo(5 + 10);
    });

    it("leaves the reading model's own charity out, so a money mover never reads itself", () => {
      const l = buildLibrary(base, assumptions, [], charities, owners);
      expect(l.errors.filter((e) => e.includes("cycle"))).toEqual([]);
      expect(compute(l, l.models.get("mover-m")!, av).out).toBeCloseTo(2 * 3);
      // A ranked charity reading its own cause's average gets the others'.
      const own = of("a1", model("a1-m", [{ id: "out", label: "out", formula: "#cause:catastrophic-risk" }]));
      const l2 = buildLibrary([mine(dest), own, ranked("a2-m", "a2", 4), ranked("a3-m", "a3", 8)], assumptions, [], charities, owners);
      expect(l2.errors).toEqual([]);
      expect(compute(l2, l2.models.get("a1-m")!, av).out).toBeCloseTo(6);
    });

    it("reports a cycle through two charities' averages, an unknown cause and an empty one", () => {
      const reads = (id: string, c: string) => of(c, model(id, [{ id: "out", label: "out", formula: "#cause:catastrophic-risk" }]));
      const l = buildLibrary([mine(dest), reads("a1-m", "a1"), reads("a2-m", "a2")], assumptions, [], charities, owners);
      expect(l.errors.some((e) => /model reference cycle (a1-m → a2-m → a1-m|a2-m → a1-m → a2-m)/.test(e))).toBe(true);
      expect(Number.isNaN(headline(l, l.models.get("a1-m")!, av))).toBe(true);
      const bad = mine(model("bad", [{ id: "out", label: "out", formula: "#cause:nowhere + #cause:climate" }]));
      const errors = buildLibrary([mine(dest), bad], assumptions, [], charities, owners).errors;
      expect(errors).toContain("bad.out: unknown cause or area #cause:nowhere");
      expect(errors).toContain("bad.out: no charity on the rankings in #cause:climate");
    });
  });

  it("resolves references against another library for a model rebuilt on its own (a bulk page)", () => {
    const alone = buildLibrary([meta], assumptions, [], [], [], { models: lib.models });
    expect(alone.errors.filter((e) => e.includes("#"))).toEqual([]);
    // Computed with the site's library, as the page does.
    expect(compute(lib, alone.models.get("meta-org")!, av).out).toBe(60);
  });
});

describe("INV-12: money moved is valued one way", () => {
  const root = join(import.meta.dirname, "../..");
  const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
  const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
  });
  const realAssumptions = read(join(root, "assumptions/default.json"));
  const facts = walk(join(root, "facts")).map(read);
  // The destinations are charities' figures on the rankings (`#owner:charity`): the real models and charities.
  const destinations = walk(join(root, "models")).map(read);
  const charities = walk(join(root, "charities")).map(read);
  const owners = read(join(root, "owners.json"));
  const shared = (ids: (keyof typeof MOVED_MONEY_ROWS | "moved_dollar_value")[], _ghOnly = true) =>
    ids.map((id) => (id === "moved_dollar_value" ? GLOBAL_HEALTH_ONLY : MOVED_MONEY_ROWS[id])).map(({ id, label, formula }) => ({ id, label, formula }));
  const meta = (id: string, rows: object[]) => ({
    id, name: id, kind: "charity", cause: "global-health", charity: "giving-what-we-can", owner: "charityevals", rows,
    output: { row: "out", unit: "uov", label: "UoV per $", native: { row: "raised", unit: "dollars raised per dollar (gross)" } },
  });
  const raised = { id: "raised", label: "Dollars raised for effective charities per dollar received", value: 10, kind: "estimate", explainer: "Test input." };
  const good = meta("good", [raised, ...shared(["value_global_health", "moved_dollar_value", "prior_dollar_value", "new_money_share", "moved_dollar_net_value"], true), { id: "out", label: "out", formula: "raised * moved_dollar_net_value" }]);
  const own = meta("own", [raised, { id: "multiple", label: "Multiple of cash", value: 5, kind: "judgment", explainer: "Test input." }, { id: "out", label: "out", formula: "raised * 0.4 * multiple * @cash.uov_per_dollar" }]);
  const edited = meta("edited", [raised, ...shared(["value_global_health", "moved_dollar_value"], true).map((r) => (r.id === "value_global_health" ? { ...r, formula: "#against-malaria-foundation" } : r)), { id: "out", label: "out", formula: "raised * moved_dollar_value" }]);
  const success = meta("success", [raised, ...shared(["value_global_health", "moved_dollar_value"], true), { id: "p", label: "Probability of success", value: 0.6, kind: "judgment", explainer: "Test input." }, { id: "out", label: "out", formula: "raised * p * moved_dollar_value" }]);
  const career = { ...meta("career", [{ id: "careers", label: "Career changes per dollar", value: 0.001, kind: "estimate", explainer: "Test input." }, { id: "out", label: "out", formula: "careers * 50000 * #givedirectly" }]), output: { row: "out", unit: "uov", label: "UoV per $" } };
  const l = buildLibrary([...destinations, good, own, edited, success, career], realAssumptions, facts, charities, owners);

  it("flags a meta model with its own multiple, an edited shared row, its own success chance and a career change outside the method", () => {
    expect(l.errors).toEqual([]);
    expect(inv12(l).violations.filter((x) => ["good", "own", "edited", "success", "career"].includes(x.model)).map(keyOf).sort()).toEqual(["career career_change_value", "edited value_global_health formula", "own moved_dollar_value", "success p success"]);
  });

  it("values a dollar moved from the destinations' live results", () => {
    const m = l.models.get("good")!;
    const av = assumptionValues(l.assumptions);
    const v = compute(l, m, av);
    expect(v.moved_dollar_value).toBeGreaterThan(v[`#${CASH_BENCHMARK}`]);
    expect(v.moved_dollar_net_value).toBeCloseTo(0.5 * v.moved_dollar_value + 0.5 * (v.moved_dollar_value - v[`#${CASH_BENCHMARK}`]));
    // Each destination at its charity's figure on the rankings, never one of its location models alone.
    expect(GLOBAL_HEALTH_DESTINATIONS.every((d) => d.includes(":"))).toBe(true);
    const weights = ["gw_weight_amf", "gw_weight_smc", "gw_weight_vas", "gw_weight_ni"].map((k) => pickValue(l.facts.get(`meta.${k}`)!.value));
    expect(v.value_global_health).toBeCloseTo(GLOBAL_HEALTH_DESTINATIONS.reduce((s, d, i) => s + weights[i] * modelResult(l, d, av), 0));
    expect(modelResult(l, "givewell:helen-keller-intl", av)).toBeGreaterThan(modelResult(l, "helen-keller-vas", av));
    // Moving a slider the destinations read moves the meta model.
    expect(headline(l, m, { ...av, daly_per_child_death: av.daly_per_child_death * 2 })).toBeGreaterThan(headline(l, m, av));
  });
});
