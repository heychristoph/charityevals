// The normalization invariants (docs/normalization.md section 3) over the built library, as an
// allowlist that only shrinks: a violation not in src/engine/normalization-allowlist.json fails, and
// so does an allowlisted one that no longer occurs (delete it from the list). The full report:
// npx tsx scripts/normalization-audit.ts (--write-allowlist rewrites the list after a fix).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assumptionValues, buildLibrary, headline, toCommon } from "./model";
import { applyWaivers, checkAll, inv10, inv11, inv13, inv14, inv15, inv16, inv17, inv18, inv2b, inv2c, inv2d, inv3, inv5, inv5b, inv6, inv7, inv9b, keyOf, type Allowlist, type Waivers } from "./invariants";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const assumptions = read(join(root, "assumptions/default.json"));
const lib = buildLibrary(walk(join(root, "models")).map(read), assumptions,
  walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
const allowlist: Allowlist = read(join(import.meta.dirname, "normalization-allowlist.json"));
const waivers: Waivers = read(join(import.meta.dirname, "normalization-waivers.json"));
const { reports, stale } = applyWaivers(checkAll(lib), waivers);


describe("normalization invariants", () => {
  it("builds the library without errors", () => expect(lib.errors).toEqual([]));

  it("every waiver still matches a flag (stale ones must go)", () => expect(stale).toEqual([]));

  it("allowlists only invariants that exist", () => {
    const ids = new Set(reports.map((r) => r.id));
    expect(Object.keys(allowlist).filter((k) => !ids.has(k))).toEqual([]);
  });

  for (const r of reports) {
    if (r.status === "not checked") continue;
    const allowed = new Set(allowlist[r.id] ?? []);
    const found = new Set(r.violations.map(keyOf));

    it(`${r.id}: no new violations (${r.title})`, () => {
      const fresh = r.violations.filter((v) => !allowed.has(keyOf(v))).map((v) => `${keyOf(v)}: ${v.detail}`);
      expect(fresh, `new ${r.id} violations; fix them (see npx tsx scripts/normalization-audit.ts)`).toEqual([]);
    });

    it(`${r.id}: every allowlisted violation still occurs (the list only shrinks)`, () => {
      const gone = [...allowed].filter((k) => !found.has(k));
      expect(gone, `fixed: remove these from src/engine/normalization-allowlist.json`).toEqual([]);
    });
  }
});

// The checks themselves, on tiny models, so a check that silently stops finding anything is caught.
describe("invariant checks", () => {
  const base = {
    id: "base", name: "Base", kind: "charity", cause: "global-health",
    rows: [{ id: "x", label: "x", value: 2, kind: "observed", explainer: "Test input." }, { id: "out", label: "out", formula: "x" }],
    output: { row: "out", unit: "uov", label: "UoV per $" },
  };
  const animal = {
    id: "hens", name: "Hens", kind: "charity", cause: "animal-welfare",
    rows: [{ id: "x", label: "SADs", value: 3, kind: "observed", explainer: "Test input." }, { id: "out", label: "out", formula: "x" }],
    output: { row: "out", unit: "sad", label: "SADs per $" },
  };

  it("INV-2c flags an evaluator's own conversion that moves our headline, not one that cancels or reads the shared fact", () => {
    const facts = [read(join(root, "facts/cash.json")), read(join(root, "facts/moral_weights.json"))];
    const rows = (benchmark: object, back: string) => [
      { id: "uov", label: "Units of value per dollar", value: 0.03, kind: "observed", explainer: "Test input." },
      { id: "gd", label: "Units of value per dollar given to GiveDirectly", ...benchmark },
      { id: "multiple", label: "Multiple of cash", formula: "uov / gd" },
      { id: "deaths", label: "Deaths averted per dollar", value: 0.0001, kind: "observed", explainer: "Test input." },
      { id: "death_value", label: "Value of averting an under-5 death (units of value)", value: 120, kind: "judgment", explainer: "Test input." },
      { id: "out", label: "out", formula: `multiple * ${back} + deaths * ${back === "gd" ? "death_value" : "@moral_weights.uov_per_death_under5"}` },
    ];
    const literal = { value: 0.0034, kind: "observed", explainer: "Test input." };
    const own = { ...base, id: "own", rows: rows(literal, "0.00335") };
    const cancels = { ...base, id: "cancels", rows: rows(literal, "gd") };
    const shared = { ...base, id: "shared", rows: rows({ formula: "@cash.uov_per_dollar", published: 0.0034, explainer: "Changed for consistency." }, "@cash.uov_per_dollar") };
    const l = buildLibrary([base, own, cancels, shared], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } }, facts);
    expect(l.errors).toEqual([]);
    expect(inv2c(l).violations.map(keyOf).sort()).toEqual(["cancels death_value", "own gd"]);
  });

  it("INV-2d flags a constant next to a shared assumption, not a shared fact or a constant inside its own function", () => {
    const facts = [read(join(root, "facts/moral_weights.json"))];
    const m = (id: string, formula: string) => ({ ...base, id, rows: [base.rows[0], { id: "out", label: "out", formula }] });
    const l = buildLibrary([base, m("staff", "x * 8 * $life_value_multiplier"), m("scaled", "x * 0.005 * $discount_rate / 0.04"), m("years", "x * pv_annuity_due(1, $discount_rate, 5)"),
      m("shared", "x * @moral_weights.uov_per_death_under5 * $life_value_multiplier"), m("ln", "x * ln(2) * $uov_per_ln_consumption")], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } }, facts);
    expect(l.errors).toEqual([]);
    expect(inv2d(l).violations.map(keyOf).sort()).toEqual(["scaled out 0.005 $discount_rate", "scaled out 0.04 $discount_rate", "staff out 8 $life_value_multiplier", "years out 5 $discount_rate"]);
  });

  it("INV-13 flags a concept stated as its own literal, copied or different, not one read from the shared fact", () => {
    const facts = [read(join(root, "facts/givewell_shared.json"))];
    const m = (id: string, share: object) => ({ ...base, id, rows: [{ id: "share", label: "Multiplier for resource sharing within households", ...share }, { id: "out", label: "out", formula: "share" }] });
    const lit = (value: number) => ({ value, kind: "estimate", explainer: "Test input." });
    const l = buildLibrary([base, m("other", lit(3)), m("copy", lit(2)), m("shared", { formula: "@givewell_shared.resource_sharing_multiplier" })], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } }, facts);
    expect(l.errors).toEqual([]);
    expect(inv13(l).violations.map(keyOf).sort()).toEqual(["copy resource-sharing share", "other resource-sharing share"]);
  });

  it("INV-14 flags the same literal under the same label in five models, not four, a round number, or a scenario's own value", () => {
    const m = (id: string, label: string, value: number) => ({ ...base, id, owner: "givewell", rows: [{ id: "a", label, value, kind: "estimate", explainer: "Test input." }, { id: "out", label: "out", formula: "a" }] });
    const many = (prefix: string, n: number, label: string, value: number) => Array.from({ length: n }, (_, i) => m(`${prefix}${i}`, label, value));
    const l = buildLibrary([base, ...many("five", 5, "House adjustment for widgets (Kenya)", 0.137), ...many("four", 4, "Another house figure", 0.211),
      ...many("round", 5, "Some halving", 0.5), ...many("bar", 5, "Value of the 8x bar", 8)], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } }, [], [], read(join(root, "owners.json")));
    expect(l.errors).toEqual([]);
    expect(inv14(l).violations.map(keyOf).sort()).toEqual(["five0 a = 0.137", "five1 a = 0.137", "five2 a = 0.137", "five3 a = 0.137", "five4 a = 0.137"]);
  });

  it("INV-15 flags a ranked model more than ten times its peers' median unless its summary says why", () => {
    const owners = read(join(root, "owners.json"));
    const c = (id: string) => ({ id, name: id, cause: "global-health" });
    const m = (id: string, x: number, summary = "") => ({ ...base, id, charity: id, owner: "givewell", summary, rows: [{ id: "x", label: "x", value: x, kind: "observed", explainer: "Test input." }, { id: "out", label: "out", formula: "x" }] });
    const models = [m("a", 1), m("b", 1.2), m("c", 0.9), m("high", 20), m("explained", 30, "It is more than ten times its peers because it is a test.")];
    const l = buildLibrary(models, { ...assumptions, common: { ...assumptions.common, benchmark: "a" } }, [], models.map((x) => c(x.id)), owners);
    expect(l.errors).toEqual([]);
    expect(inv15(l).violations.map(keyOf)).toEqual(["high summary"]);
  });

  it("INV-16 flags a ranked value-of-information sheet found by its rows, and a bottom line from another country's column", () => {
    const owners = read(join(root, "owners.json"));
    const rows = (labels: string[], native = "Final estimate") => [...labels.map((label, i) => ({ id: `r${i}`, label, value: 1, kind: "estimate", explainer: "Test input." })),
      { id: "nat", label: native, formula: labels.map((_, i) => `r${i}`).join(" + ") || "1" }, { id: "out", label: "out", formula: "nat" }];
    const m = (id: string, name: string, r: object[]) => ({ ...base, id, name, charity: id, owner: "givewell", rows: r, output: { ...base.output, native: { row: "nat", unit: "x cash" } } });
    const models = [m("prog", "Nets in Chad", rows(["Nets"], "Final cost-effectiveness estimate (Chad)")),
      m("pilot", "Pilot follow-up", rows(["Weight on future funding bar scenario", "Probability that the decision changes"])),
      m("column", "Nets grant for Nigeria", rows(["Nets"], "Final cost-effectiveness estimate (Chad)"))];
    const l = buildLibrary(models, { ...assumptions, common: { ...assumptions.common, benchmark: "prog" } }, [], models.map((x) => ({ id: x.id, name: x.id, cause: "global-health" })), owners);
    expect(l.errors).toEqual([]);
    expect(inv16(l).violations.map(keyOf).sort()).toEqual(["column location", "pilot side sheet"]);
  });

  it("INV-17 passes deaths valued outside the WELLBYs, and flags deaths valued inside them", () => {
    const facts = [read(join(root, "facts/moral_weights.json"))];
    const w = (id: string, rows: object[]) => ({ ...base, id, sections: [{ id: "ours", title: "Ours", kind: "ours" }], rows, output: { row: "out", unit: "wellby", label: "WELLBYs per $" } });
    const wellbys = { id: "w", label: "WELLBYs", value: 0.01, kind: "estimate", explainer: "Test input." };
    const deaths = { id: "deaths", label: "Deaths averted per dollar", value: 0.0001, kind: "estimate", explainer: "Test input." };
    const good = w("good", [wellbys, deaths,
      { id: "uov_valued_outside_wellbys", section: "ours", label: "Deaths' value", formula: "deaths * @moral_weights.uov_per_death_under5 * $life_value_multiplier" },
      { id: "wellbys_from_uov", section: "ours", label: "WELLBYs from deaths", formula: "uov_valued_outside_wellbys / ($daly_per_wellby * $uov_per_daly)" },
      { id: "out", label: "out", section: "ours", formula: "w + wellbys_from_uov" }]);
    const inside = w("inside", [wellbys, deaths, { id: "out", label: "out", formula: "w + deaths * @moral_weights.uov_per_death_under5 * $life_value_multiplier / 0.13" }]);
    const l = buildLibrary([base, good, inside], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } }, facts);
    expect(l.errors).toEqual([]);
    expect(inv17(l).violations.map(keyOf)).toEqual(["inside deaths"]);
    expect(inv2b(l).violations.map(keyOf)).toEqual([]);
    // The deaths count their shared value whatever the WELLBY rate: the unit's conversion cancels it.
    const av = assumptionValues(assumptions);
    const m = l.models.get("good")!;
    const deathsPart = (a: Record<string, number>) => headline(l, m, a) - headline(l, m, a, { uov_valued_outside_wellbys: 0 });
    expect(deathsPart({ ...av, daly_per_wellby: av.daly_per_wellby * 3 })).toBeCloseTo(deathsPart(av), 9);
    expect(deathsPart(av)).toBeCloseTo((0.0001 * 116.25262 / av.uov_per_daly) * 1000, 6);
  });

  it("INV-18 wants every past average, and nothing else, to read the next-dollar slider", () => {
    const x = { id: "x", label: "Pledges won per dollar of past spending", value: 2, kind: "observed", explainer: "Test input." };
    const slider = { id: "marginal_vs_past_average", label: "Next dollar vs average", formula: "$marginal_vs_past_average", published: 1, explainer: "Changed for consistency: the evaluator publishes the average." };
    const m = (id: string, estimate_basis: string | undefined, rows: object[]) => ({ ...base, id, ...(estimate_basis ? { estimate_basis } : {}), rows });
    const good = m("good", "past_average", [x, slider, { id: "out", label: "out", formula: "x * marginal_vs_past_average" }]);
    const missed = m("missed", "past_average", [x, { id: "out", label: "out", formula: "x" }]);
    const twice = m("twice", "marginal", [x, slider, { id: "out", label: "out", formula: "x * marginal_vs_past_average" }]);
    const both = m("both", "past_average", [x, { ...slider, published: undefined }, { id: "out", label: "out", formula: "x * marginal_vs_past_average" }]);
    const unstated = m("unstated", undefined, [x, { id: "out", label: "out", formula: "x" }]);
    const l = buildLibrary([{ ...base, estimate_basis: "unit_cost" }, good, missed, twice, both, unstated], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } });
    expect(l.errors).toEqual([]);
    expect(inv18(l).violations.map(keyOf).sort()).toEqual([
      "both marginal_vs_past_average evaluator view", "missed $marginal_vs_past_average", "twice marginal_vs_past_average $marginal_vs_past_average", "unstated estimate_basis",
    ]);
    // On the site: every charity model says what its dollar is, and the slider's readers are exactly the past averages.
    const charities = [...lib.models.values()].filter((t) => t.kind === "charity");
    expect(charities.filter((t) => !t.estimate_basis).map((t) => t.id)).toEqual([]);
    const readers = charities.filter((t) => t.rows.some((r) => r.assumptionDeps.includes("marginal_vs_past_average"))).map((t) => t.id).sort();
    expect(readers).toEqual(charities.filter((t) => t.estimate_basis === "past_average").map((t) => t.id).sort());
  });

  it("INV-9b flags years of benefit summed at face value, not discounted ones or cost years", () => {
    const rows = (years: string) => [
      { id: "annual", label: "Benefit a year", value: 0.01, kind: "observed", explainer: "Test input." },
      { id: "years", label: "Number of years of benefit", value: 5, kind: "judgment", explainer: "Test input." },
      { id: "out", label: "out", formula: `annual * ${years}` },
    ];
    const flat = { ...base, id: "flat", rows: rows("years") };
    const discounted = { ...base, id: "discounted", rows: rows("pv_annuity_due(1, $discount_rate, years)") };
    const cost = { ...base, id: "cost", rows: rows("1 / years") };
    const l = buildLibrary([base, flat, discounted, cost], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } });
    expect(l.errors).toEqual([]);
    expect(inv9b(l).violations.map(keyOf)).toEqual(["flat years"]);
  });

  it("INV-5b flags an evaluator pin that no row reads", () => {
    const pinned = (id: string, formula: string) => ({ ...base, id, rows: [base.rows[0], { id: "out", label: "out", formula }], evaluator: { name: "HLI", assumptions: { life_value_multiplier: 1 } } });
    const l = buildLibrary([base, pinned("unread", "x"), pinned("read", "x * $life_value_multiplier")], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } });
    expect(l.errors).toEqual([]);
    expect(inv5b(l).violations.map(keyOf)).toEqual(["unread evaluator.assumptions.life_value_multiplier"]);
  });

  it("INV-2b flags a row reading a cross-cause rate", () => {
    const bad = { ...base, id: "bad", rows: [...base.rows.slice(0, 1), { id: "out", label: "out", formula: "x * $daly_per_wellby" }] };
    const l = buildLibrary([base, bad], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } });
    expect(l.errors).toEqual([]);
    expect(inv2b(l).violations.map(keyOf)).toEqual(["bad out $daly_per_wellby"]);
  });

  it("INV-3 flags a species step that isn't the shared template", () => {
    const facts = [read(join(root, "facts/welfare_ranges.json")), read(join(root, "facts/aim_sads.json"))];
    const rows = (ced: string) => [
      { id: "sads_shrimp", label: "SADs", value: 3, kind: "observed", explainer: "Test input." },
      { id: "ced_shrimp", label: "ced", formula: ced },
      { id: "out", label: "out", formula: "ced_shrimp" },
    ];
    const good = { ...animal, id: "good", rows: rows("sads_shrimp / @aim_sads.shrimp_2025 * if($rp_species_weights, @welfare_ranges.shrimp_vs_chicken, @aim_sads.shrimp_2025 / @aim_sads.chicken_2024)"), output: { row: "out", unit: "ced", label: "x", species: ["shrimp"] } };
    const bad = { ...good, id: "bad", rows: rows("sads_shrimp * @welfare_ranges.shrimp_vs_chicken * 2") };
    // A second SAD version must divide by its own version's weight (chickens have a 2024 and a 2025 weight).
    const v2024 = (w: string) => [
      ...good.rows.slice(0, 2),
      { id: "sads_chicken", label: "SADs (2025)", value: 2, kind: "observed", explainer: "Test input." },
      { id: "ced_chicken", label: "ced (2025)", formula: "sads_chicken / @aim_sads.chicken_2025 * if($rp_species_weights, @welfare_ranges.chicken_vs_chicken, @aim_sads.chicken_2025 / @aim_sads.chicken_2024)" },
      { id: "sads_chicken_2024", label: "SADs (2024)", value: 1, kind: "observed", explainer: "Test input." },
      { id: "ced_chicken_2024", label: "ced (2024)", formula: `sads_chicken_2024 / @aim_sads.chicken_${w} * if($rp_species_weights, @welfare_ranges.chicken_vs_chicken, @aim_sads.chicken_${w} / @aim_sads.chicken_2024)` },
      { id: "out", label: "out", formula: "ced_shrimp + ced_chicken + ced_chicken_2024" },
    ];
    const output2 = { ...good.output, species: ["shrimp", "chicken"] };
    const mixed = { ...good, id: "mixed", rows: v2024("2024"), output: output2 };
    const mismatched = { ...good, id: "mismatched", rows: v2024("2025"), output: output2 };
    const l = buildLibrary([base, good, bad, mixed, mismatched], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } }, facts);
    expect(l.errors).toEqual([]);
    expect(inv3(l).violations.map(keyOf)).toEqual(["bad ced_shrimp", "mismatched ced_chicken_2024"]);
  });

  // An evaluator's model: native row `x_cash` (with `expected`), our staff-pay step after it.
  const sheet = (id: string, opts: { pins?: Record<string, number>; nativeExpected?: boolean; outSection?: string; discount?: boolean } = {}) => ({
    id, name: id, kind: "charity", cause: "global-health",
    sections: [{ id: "cea", title: "CEA" }, { id: "staff_pay", title: "Staff pay", kind: "ours" }],
    rows: [
      { id: "x", label: "x", value: 2, kind: "observed", explainer: "Test input.", section: "cea" },
      { id: "x_cash", label: "x cash", section: "cea", formula: opts.discount ? "x / (1 + $discount_rate)" : "if($resource_shares, x, x)", ...(opts.nativeExpected === false ? {} : { expected: opts.discount ? 2 / 1.04 : 2 }) },
      { id: "share", label: "share", value: 0.9, kind: "judgment", explainer: "Test input.", section: "staff_pay" },
      { id: "out", label: "out", section: opts.outSection ?? "staff_pay", formula: "x_cash * share" },
    ],
    output: { row: "out", unit: "uov", label: "UoV per $", native: { row: "x_cash", unit: "multiples of cash transfers" } },
    evaluator: { name: "GiveWell", assumptions: { resource_shares: 0, ...(opts.pins ?? {}) } },
  });

  it("INV-5 flags an unpinned rate or toggle inside the evaluator's rows", () => {
    const models = [base, sheet("good", { discount: true, pins: { discount_rate: 0.04 } }), sheet("unpinned", { discount: true })];
    const toggle = { ...sheet("toggle"), evaluator: { name: "GiveWell", assumptions: {} } };
    const l = buildLibrary([...models, toggle], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } });
    expect(l.errors).toEqual([]);
    expect(inv5(l).violations.map(keyOf)).toEqual(["unpinned $discount_rate", "toggle $resource_shares"]);
  });

  it("INV-6 flags a native row with no `expected` on it or its direct inputs", () => {
    const l = buildLibrary([base, sheet("good"), sheet("bad", { nativeExpected: false })], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } });
    expect(l.errors).toEqual([]);
    expect(inv6(l).violations.map(keyOf)).toEqual(["bad model"]);
  });

  it("INV-7 flags one of our steps in an evaluator section, and a missing native row", () => {
    const { native: _n, ...noNative } = sheet("none").output;
    const l = buildLibrary([base, sheet("good"), sheet("bad", { outSection: "cea" }), { ...sheet("none"), output: noNative }], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } });
    expect(l.errors).toEqual([]);
    expect(inv7(l).violations.map(keyOf)).toEqual(["bad out", "none output.native"]);
  });

  it("INV-10 flags a non-animal model that moves with the animal weight", () => {
    const bad = { ...base, id: "bad", rows: [...base.rows.slice(0, 1), { id: "out", label: "out", formula: "x * $chicken_vs_person" }] };
    const l = buildLibrary([base, bad, animal], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } });
    expect(l.errors).toEqual([]);
    expect(inv10(l).violations.map(keyOf)).toEqual(["bad $chicken_vs_person independent"]);
  });
});

// Climate (docs/normalization.md 2.5): a tonne of CO₂e reaches the scale through the deaths it causes,
// each valued as GiveWell's adult death. The unit's conversion reads assumptions plus one fixed row of
// the model (air_pollution_weight), so the shared figures it stands on are checked here against the
// facts they come from.
describe("climate conversion", () => {
  const fact = (k: string) => lib.facts.get(k)?.value;
  const row = (id: string) => assumptions.rows.find((r: { id: string }) => r.id === id);
  const W: Record<string, string> = { under5: "uov_per_death_under5", "5_14": "uov_per_death_age_5_14", "15_49": "uov_per_death_age_15_49", "50plus": "uov_per_death_age_50_74" };
  const mix = (k: string) => Object.entries(W).reduce((s, [b, w]) => s + (fact(`death_ages.${k}_share_${b}`) as number) * (fact(`moral_weights.${w}`) as number), 0);
  const heatDeathValue = () => mix("heat") * (1 + ((fact("climate.nondeath_damages_vs_deaths") as { best: number }).best));
  const airPollutionDeathValue = () => mix("air_pollution");

  it("the deaths-per-tonne assumption is Rethink Priorities' figure, range and all", () => {
    expect(row("deaths_per_tco2e").value).toEqual(fact("climate.deaths_per_tco2e"));
  });

  it("the climate unit values each death by age (GiveWell's moral weights by age over the ages of heat and air-pollution deaths), times the value-of-life slider", () => {
    expect(assumptions.units.tco2e_no_smoke).toBeUndefined();
    const to = assumptions.units.tco2e.to_common;
    expect(to).toMatch(/\* \$life_value_multiplier$/);
    expect(to).not.toMatch(/uov_per_death_over5/);
    for (const band of ["under5", "5_14", "15_49", "50plus"]) {
      expect(to).toContain(`@death_ages.heat_share_${band}`);
      expect(to).toContain(`@death_ages.air_pollution_share_${band}`);
    }
    // Each age mix is a whole: its shares add to 1.
    for (const k of ["heat", "air_pollution"])
      expect(["under5", "5_14", "15_49", "50plus"].reduce((s, b) => s + (fact(`death_ages.${k}_share_${b}`) as number), 0)).toBeCloseTo(1, 4);
  });

  it("the heat share is Rethink Priorities' heat deaths over heat and air-pollution deaths", () => {
    const heat = (fact("climate.deaths_per_tco2e_heat") as { best: number }).best;
    const air = (fact("climate.deaths_per_tco2e_air_pollution") as { best: number }).best;
    expect(row("climate_heat_share").value).toBeCloseTo(heat / (heat + air), 4);
  });

  it("heat deaths are discounted over the delay; air-pollution deaths scale with the model's air_pollution_weight row", () => {
    const l = { ...buildLibrary([], assumptions), facts: lib.facts };
    const av = assumptionValues(assumptions);
    const H = heatDeathValue(), AP = airPollutionDeathValue();
    const one = (w: number, a = av, extra = 0) => toCommon(l, "tco2e", a, { air_pollution_weight: w, extra_deaths_per_tco2e: extra }) / (a.deaths_per_tco2e * a.life_value_multiplier);
    const share = av.climate_heat_share, df = (1 + av.discount_rate) ** -av.climate_heat_death_delay;
    expect(one(1)).toBeCloseTo((1 - share) * AP + share * df * H, 9);
    expect(one(0)).toBeCloseTo(share * df * H, 9);
    expect(one(0, { ...av, discount_rate: 0 })).toBeCloseTo(share * H, 9);
    expect(one(0.25)).toBeCloseTo(share * df * H + 0.25 * (1 - share) * AP, 9);
    // Deaths an evaluator counts itself are added per tonne at the air-pollution value, not scaled by the climate rate.
    expect(one(0, av, 1e-4) - one(0)).toBeCloseTo((1e-4 * AP) / av.deaths_per_tco2e, 9);
    expect(toCommon(l, "tco2e", av)).toBeNaN();
  });

  it("a tco2e model must define air_pollution_weight in an ours section, reading no shared assumption", () => {
    const base = {
      id: "base", name: "Base", kind: "charity", cause: "climate",
      sections: [{ id: "conv", title: "Conversion", kind: "ours" }, { id: "eval", title: "Evaluator" }],
      rows: [{ id: "x", label: "x", value: 2, kind: "observed", explainer: "Test input." }, { id: "out", label: "out", formula: "x" },
        { id: "air_pollution_weight", section: "conv", label: "w", value: 0.5, kind: "judgment", explainer: "Test input." },
        { id: "extra_deaths_per_tco2e", section: "conv", label: "d", value: 0, kind: "judgment", explainer: "Test input." }],
      output: { row: "out", unit: "tco2e", label: "t CO₂e per $" },
    };
    const missing = { ...base, id: "missing", rows: [...base.rows.slice(0, 2), base.rows[3]] };
    const outside = { ...base, id: "outside", rows: [...base.rows.slice(0, 2), { ...base.rows[2], section: "eval" }, base.rows[3]] };
    const reads = { ...base, id: "reads", rows: [...base.rows.slice(0, 2), { id: "air_pollution_weight", section: "conv", label: "w", formula: "$discount_rate" }, base.rows[3]] };
    const l = buildLibrary([base, missing, outside, reads], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } }, walk(join(root, "facts")).map(read));
    expect(l.errors).toEqual(["missing: unit tco2e reads row air_pollution_weight, which the model doesn't define (docs/normalization.md 2.5)"]);
    expect(inv2b(l).violations.map(keyOf).sort()).toEqual(["outside air_pollution_weight section", "reads air_pollution_weight $discount_rate"]);
    const av = assumptionValues(assumptions);
    const df = (1 + av.discount_rate) ** -av.climate_heat_death_delay, h = av.climate_heat_share;
    expect(headline(l, l.models.get("base")!, av)).toBeCloseTo(2 * av.deaths_per_tco2e * (h * df * heatDeathValue() + (1 - h) * 0.5 * airPollutionDeathValue()) * av.life_value_multiplier / av.uov_per_daly * 1000, 9);
  });

  it("INV-10 flags a non-climate model that moves with the climate rate, and passes a climate model", () => {
    const base = {
      id: "base", name: "Base", kind: "charity", cause: "global-health",
      rows: [{ id: "x", label: "x", value: 2, kind: "observed", explainer: "Test input." }, { id: "out", label: "out", formula: "x" }],
      output: { row: "out", unit: "uov", label: "UoV per $" },
    };
    const bad = { ...base, id: "bad", rows: [...base.rows.slice(0, 1), { id: "out", label: "out", formula: "x * $deaths_per_tco2e" }] };
    const tonnes = { ...base, id: "tonnes", cause: "climate", rows: [...base.rows, { id: "air_pollution_weight", label: "w", value: 0.3, kind: "judgment", explainer: "Test input." }, { id: "extra_deaths_per_tco2e", label: "d", value: 0, kind: "judgment", explainer: "Test input." }], output: { row: "out", unit: "tco2e", label: "t CO₂e per $" } };
    const l = buildLibrary([base, bad, tonnes], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } });
    expect(l.errors).toEqual([]);
    expect(inv10(l).violations.map(keyOf)).toEqual(["bad $deaths_per_tco2e independent"]);
  });
});

describe("INV-11: evaluator-internal exchange rates", () => {
  const facts = walk(join(root, "facts")).map(read);
  const aim = (id: string, conv: Record<string, unknown>, death: Record<string, unknown>) => ({
    id, name: id, kind: "charity", cause: "global-health", owner: "ambitious-impact",
    rows: [
      { id: "doublings", label: "Years of doubled consumption", value: 10, kind: "estimate", explainer: "Test input." },
      { id: "to_dalys", label: "One year of doubled consumption to DALYs", ...conv },
      { id: "deaths", label: "Deaths averted", value: 0.1, kind: "estimate", explainer: "Test input." },
      { id: "per_death", label: "DALYs per death averted at age 0", ...death },
      { id: "out", label: "DALYs per $", formula: "doublings * to_dalys + deaths * per_death" },
    ],
    output: { row: "out", unit: "daly", label: "DALYs per $" },
    evaluator: { name: "Ambitious Impact", assumptions: { uov_per_daly: 2.3, uov_per_ln_consumption: 1 / Math.LN2, life_value_multiplier: 1 } },
  });
  const ours = aim("ours", { formula: "ln(2) * $uov_per_ln_consumption / $uov_per_daly" },
    { formula: "@moral_weights.uov_per_death_under5 * $life_value_multiplier / $uov_per_daly", published: 33.07, explainer: "Changed for consistency: AIM's own figure is 33.07." });
  const theirs = aim("theirs", { formula: "1 / $uov_per_daly" }, { value: 33.07, kind: "estimate", explainer: "AIM's figure." });
  const l = buildLibrary([ours, theirs], { ...assumptions, common: { ...assumptions.common, benchmark: "ours" } }, facts);

  it("flags AIM's own income-to-DALY rate and DALYs per death, and passes the shared ones", () => {
    expect(l.errors).toEqual([]);
    expect(inv11(l).violations.map(keyOf).sort()).toEqual(["theirs per_death death-value", "theirs to_dalys income-to-daly"]);
  });

  it("the shared versions move with the sliders; the evaluator view keeps AIM's numbers", () => {
    const av = assumptionValues(assumptions);
    const m = l.models.get("ours")!;
    const h = headline(l, m, av);
    expect(headline(l, m, { ...av, uov_per_ln_consumption: av.uov_per_ln_consumption * 1.5 })).toBeGreaterThan(h);
    expect(headline(l, m, { ...av, life_value_multiplier: 1.5 })).toBeGreaterThan(h);
    // Evaluator view: 10 / 2.3 + 0.1 * 33.07 DALYs per dollar.
    expect(headline(l, m, av, {}, "evaluator")).toBeCloseTo((10 / 2.3 + 0.1 * 33.07) * 1000, 6);
  });
});
