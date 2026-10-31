// The normalization invariants (docs/normalization.md section 3) over the built library, as an
// allowlist that only shrinks: a violation not in src/engine/normalization-allowlist.json fails, and
// so does an allowlisted one that no longer occurs (delete it from the list). The full report:
// npx tsx scripts/normalization-audit.ts (--write-allowlist rewrites the list after a fix).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assumptionValues, buildLibrary, headline, toCommon } from "./model";
import { applyWaivers, checkAll, inv10, inv11, inv2b, inv3, inv5, inv6, inv7, keyOf, type Allowlist, type Waivers } from "./invariants";

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

  it("INV-2b flags a row reading a cross-cause rate", () => {
    const bad = { ...base, id: "bad", rows: [...base.rows.slice(0, 1), { id: "out", label: "out", formula: "x * $uov_per_wellby" }] };
    const l = buildLibrary([base, bad], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } });
    expect(l.errors).toEqual([]);
    expect(inv2b(l).violations.map(keyOf)).toEqual(["bad out $uov_per_wellby"]);
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
    // A second SAD version must divide by its own version's weight.
    const v2024 = (w: string) => [
      ...good.rows.slice(0, 2),
      { id: "sads_shrimp_2024", label: "SADs (2024)", value: 1, kind: "observed", explainer: "Test input." },
      { id: "ced_shrimp_2024", label: "ced (2024)", formula: `sads_shrimp_2024 / @aim_sads.shrimp_${w} * if($rp_species_weights, @welfare_ranges.shrimp_vs_chicken, @aim_sads.shrimp_${w} / @aim_sads.chicken_2024)` },
      { id: "out", label: "out", formula: "ced_shrimp + ced_shrimp_2024" },
    ];
    const mixed = { ...good, id: "mixed", rows: v2024("2024") };
    const mismatched = { ...good, id: "mismatched", rows: v2024("2025") };
    const l = buildLibrary([base, good, bad, mixed, mismatched], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } }, facts);
    expect(l.errors).toEqual([]);
    expect(inv3(l).violations.map(keyOf)).toEqual(["bad ced_shrimp", "mismatched ced_shrimp_2024"]);
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

  it("the deaths-per-tonne assumption is Rethink Priorities' figure, range and all", () => {
    expect(row("deaths_per_tco2e").value).toEqual(fact("climate.deaths_per_tco2e"));
  });

  it("the climate unit converts at GiveWell's value of an adult's death, times the value-of-life slider", () => {
    expect(assumptions.units.tco2e_no_smoke).toBeUndefined();
    for (const u of ["tco2e"])
      expect(assumptions.units[u].to_common).toMatch(/^\$deaths_per_tco2e \* .* \* @moral_weights\.uov_per_death_over5 \* \$life_value_multiplier$/);
  });

  it("the heat share is Rethink Priorities' heat deaths over heat and air-pollution deaths", () => {
    const heat = (fact("climate.deaths_per_tco2e_heat") as { best: number }).best;
    const air = (fact("climate.deaths_per_tco2e_air_pollution") as { best: number }).best;
    expect(row("climate_heat_share").value).toBeCloseTo(heat / (heat + air), 4);
  });

  it("heat deaths are discounted over the delay; air-pollution deaths scale with the model's air_pollution_weight row", () => {
    const l = { ...buildLibrary([], assumptions), facts: lib.facts };
    const av = assumptionValues(assumptions);
    const death = fact("moral_weights.uov_per_death_over5") as number;
    const one = (w: number, a = av) => toCommon(l, "tco2e", a, { air_pollution_weight: w }) / (a.deaths_per_tco2e * death);
    const share = av.climate_heat_share, df = (1 + av.discount_rate) ** -av.climate_heat_death_delay;
    expect(one(1)).toBeCloseTo(1 - share + share * df, 9);
    expect(one(0)).toBeCloseTo(share * df, 9);
    expect(one(0, { ...av, discount_rate: 0 })).toBeCloseTo(share, 9);
    expect(one(0.25)).toBeCloseTo(share * df + 0.25 * (1 - share), 9);
    expect(toCommon(l, "tco2e", av)).toBeNaN();
  });

  it("a tco2e model must define air_pollution_weight in an ours section, reading no shared assumption", () => {
    const base = {
      id: "base", name: "Base", kind: "charity", cause: "climate",
      sections: [{ id: "conv", title: "Conversion", kind: "ours" }, { id: "eval", title: "Evaluator" }],
      rows: [{ id: "x", label: "x", value: 2, kind: "observed", explainer: "Test input." }, { id: "out", label: "out", formula: "x" },
        { id: "air_pollution_weight", section: "conv", label: "w", value: 0.5, kind: "judgment", explainer: "Test input." }],
      output: { row: "out", unit: "tco2e", label: "t CO₂e per $" },
    };
    const missing = { ...base, id: "missing", rows: base.rows.slice(0, 2) };
    const outside = { ...base, id: "outside", rows: [...base.rows.slice(0, 2), { ...base.rows[2], section: "eval" }] };
    const reads = { ...base, id: "reads", rows: [...base.rows.slice(0, 2), { id: "air_pollution_weight", section: "conv", label: "w", formula: "$discount_rate" }] };
    const l = buildLibrary([base, missing, outside, reads], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } }, walk(join(root, "facts")).map(read));
    expect(l.errors).toEqual(["missing: unit tco2e reads row air_pollution_weight, which the model doesn't define (docs/normalization.md 2.5)"]);
    expect(inv2b(l).violations.map(keyOf).sort()).toEqual(["outside air_pollution_weight section", "reads air_pollution_weight $discount_rate"]);
    const av = assumptionValues(assumptions);
    const df = (1 + av.discount_rate) ** -av.climate_heat_death_delay, h = av.climate_heat_share;
    expect(headline(l, l.models.get("base")!, av)).toBeCloseTo(2 * av.deaths_per_tco2e * (h * df + (1 - h) * 0.5) * (fact("moral_weights.uov_per_death_over5") as number) * av.life_value_multiplier / av.uov_per_daly * 1000, 9);
  });

  it("INV-10 flags a non-climate model that moves with the climate rate, and passes a climate model", () => {
    const base = {
      id: "base", name: "Base", kind: "charity", cause: "global-health",
      rows: [{ id: "x", label: "x", value: 2, kind: "observed", explainer: "Test input." }, { id: "out", label: "out", formula: "x" }],
      output: { row: "out", unit: "uov", label: "UoV per $" },
    };
    const bad = { ...base, id: "bad", rows: [...base.rows.slice(0, 1), { id: "out", label: "out", formula: "x * $deaths_per_tco2e" }] };
    const tonnes = { ...base, id: "tonnes", cause: "climate", rows: [...base.rows, { id: "air_pollution_weight", label: "w", value: 0.3, kind: "judgment", explainer: "Test input." }], output: { row: "out", unit: "tco2e", label: "t CO₂e per $" } };
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
