import { describe, expect, it } from "vitest";
import { lintModel } from "./lint";
import { filled, load as loadAll, templateFiles } from "./test-library";

const files = templateFiles();
const load = (raw: Record<string, unknown>) => {
  const { lib, models } = loadAll(raw);
  return { lib, m: models[0] };
};

describe("build-cea templates", () => {
  for (const [name, raw] of Object.entries(files)) {
    it(`${name}: skeleton loads and only its placeholders fail`, () => {
      const { lib, m } = load(raw);
      expect(lib.errors.filter((e) => e.startsWith(raw.id as string))).toEqual([]);
      const high = lintModel(lib, m).filter((f) => f.severity === "high");
      expect(high.length).toBeGreaterThan(0);
      expect(high.every((f) => f.code === "placeholder")).toBe(true);
    });
    it(`${name}: filled in, it passes`, () => {
      const { lib, m } = load(filled(raw));
      expect(lintModel(lib, m).filter((f) => f.severity === "high")).toEqual([]);
    });
  }
});

type Raw = Record<string, unknown>;
type Row = Record<string, unknown>;
const withRow = (raw: Raw, id: string, patch: Row) => ({ ...raw, rows: (raw.rows as Row[]).map((r) => (r.id === id ? { ...r, ...patch } : r)) });
const without = (raw: Raw, id: string) => ({ ...raw, rows: (raw.rows as Row[]).filter((r) => r.id !== id) });
const codes = (raw: Raw) => {
  const { lib, m } = load(raw);
  return lintModel(lib, m).filter((f) => f.severity !== "low").map((f) => `${f.code}:${f.row ?? ""}`);
};

describe("lint", () => {
  const base = () => filled(files["corporate-campaign"]);

  it("flags a sourced input without a URL", () => {
    expect(codes(withRow(base(), "animals_per_year", { source: { title: "somewhere" } }))).toContain("source:animals_per_year");
  });
  it("flags magic numbers in formulas", () => {
    expect(codes(withRow(base(), "outcome_total", { formula: "animals_affected_per_year * discounted_years * sads_per_animal_year * total_adj * 0.7" }))).toContain("magic-number:outcome_total");
  });
  it("flags an adjustment that never reaches the result", () => {
    expect(codes(withRow(base(), "total_adj", { formula: "counterfactual_adj * attribution_share * implementation_adj" }))).toContain("unapplied:evidence_adj");
  });
  it("accepts a canonical adjustment kept as a summary of branch adjustments", () => {
    const raw = withRow(base(), "total_adj", { formula: "a_evidence_adj * counterfactual_adj * attribution_share * implementation_adj" });
    const rows = [...(raw.rows as Row[])];
    rows.splice(rows.findIndex((r) => r.id === "total_adj"), 0, { id: "a_evidence_adj", section: "adjustments", label: "Evidence adjustment, branch A", value: { low: 0.5, best: 0.7, high: 0.9 }, kind: "judgment", explainer: "Branch A's own evidence adjustment, with a rationale long enough to pass the lint check." });
    expect(codes({ ...raw, rows })).not.toContain("unapplied:evidence_adj");
  });
  it("flags out-of-bounds canonical values", () => {
    expect(codes(withRow(base(), "counterfactual_adj", { value: 1.4 }))).toContain("bounds:counterfactual_adj");
  });
  it("flags a judgment without a range", () => {
    expect(codes(withRow(base(), "evidence_adj", { value: 0.7 }))).toContain("range:evidence_adj");
  });
  it("flags a missing canonical row", () => {
    expect(codes(without(base(), "attribution_share_shared"))).toContain("required-row:attribution_share_shared");
  });

  // The site's one way (docs/normalization.md 2.7-2.11).
  const typed = (id: string, value: unknown, kind = "judgment") => ({ formula: undefined, value, kind, explainer: "Typed in by the builder, with a rationale long enough to pass the rationale check." });
  it("flags a won reform's own years instead of $win_years_counted", () => {
    expect(codes(withRow(base(), "years_of_impact", typed("years_of_impact", { low: 4, best: 15, high: 36 })))).toContain("shared:years_of_impact");
  });
  it("flags pledges kept not read from the shared fulfilment rate", () => {
    expect(codes(withRow(base(), "implementation_adj", typed("implementation_adj", { low: 0.6, best: 0.8, high: 0.95 })))).toContain("shared:implementation_adj");
  });
  it("accepts implementation_adj = 1 for observed switches only, not a typed rate", () => {
    expect(codes(withRow(base(), "implementation_adj", { formula: "1" }))).not.toContain("shared:implementation_adj");
    expect(codes(withRow(base(), "implementation_adj", { formula: "0.9" }))).toContain("shared:implementation_adj");
  });
  it("flags a SADs figure typed in instead of the shared per-change figure", () => {
    expect(codes(withRow(base(), "sads_per_animal_year", typed("sads_per_animal_year", 12, "estimate")))).toContain("shared:sads_per_animal_year");
  });
  it("flags a ced row whose SAD version isn't the figure's", () => {
    expect(codes(withRow(base(), "sads_per_animal_year", { formula: "@sad_factors.sads_per_broiler_bcc" }))).toContain("sad-version:ced_chicken");
  });
  it("flags a missing estimate_basis, and a past average without the next-dollar slider", () => {
    expect(codes({ ...base(), estimate_basis: undefined })).toContain("estimate-basis:");
    expect(codes(withRow(base(), "sads_per_donor_dollar", { formula: "sads_per_dollar * donor_cost_share" }))).toContain("estimate-basis:");
    expect(codes({ ...base(), estimate_basis: "unit_cost" })).toContain("estimate-basis:marginal_vs_past_average");
  });
  it("flags a model without the date it was built", () => {
    expect(codes({ ...base(), source: { publisher: "charityevals", title: "x", url: "https://charityevals.org/x", retrieved: "2026-01-01" } })).toContain("published:");
  });
  it("flags a typed currency rate", () => {
    const raw = base();
    const rows = [...(raw.rows as Row[]), { id: "fx_dkk_per_usd", section: "cost", label: "DKK per USD", value: 6.9, kind: "observed", source: { url: "https://example.org", retrieved: "2026-01-01", page: "1" }, explainer: "A typed rate." }];
    expect(codes({ ...raw, rows })).toContain("fx:fx_dkk_per_usd");
  });
  it("diet change: flags a meal figure rebuilt from a meat mix and a missing production response", () => {
    const d = filled(files["diet-change"]);
    expect(codes(withRow(d, "sads_per_meal", typed("sads_per_meal", 0.19, "estimate")))).toContain("shared:sads_per_meal");
    expect(codes(withRow(d, "production_response", typed("production_response", 1)))).toContain("shared:production_response");
  });
  it("wellbeing: flags a household size not read from the place's fact", () => {
    const w = filled(files.wellbeing);
    expect(codes(withRow(w, "household_size", typed("household_size", 5.3, "estimate")))).toContain("shared:household_size");
  });
  it("direct health: flags a death not valued at its age band", () => {
    const d = filled(files["direct-health"]);
    expect(codes(withRow(d, "value_per_death", { formula: "@moral_weights.uov_per_death_over5 * $life_value_multiplier" }))).toContain("age-band:value_per_death");
    expect(codes(withRow(d, "value_per_death", typed("value_per_death", 100)))).toContain("shared:uov_deaths");
  });

  // Missing data (docs/normalization.md 2.12): one marker per branch, the slider or 1 with a reason.
  const sev = (raw: Raw) => {
    const { lib, m } = load(raw);
    return lintModel(lib, m).filter((f) => f.severity !== "low").map((f) => `${f.severity} ${f.code}:${f.row ?? ""}`);
  };
  const measured = { formula: "1", explainer: "The charity's own count of doses delivered, monitored by an independent survey, meets the effect of trials of the same intervention delivered the same way." };
  it("missing data: a measured branch may be 1, with its reason", () => {
    const d = filled(files["direct-health"]);
    expect(codes(withRow(d, "missing_data_adj", measured)).filter((c) => c.startsWith("missing-data"))).toEqual([]);
    expect(codes(withRow(d, "missing_data_adj", { formula: "1", explainer: "Measured." }))).toContain("missing-data:missing_data_adj");
  });
  it("missing data: a branch whose reach or effect is all judgment reads the slider", () => {
    const d = withRow(filled(files["direct-health"]), "missing_data_adj", measured);
    const guessed = withRow(withRow(d, "people_reached", typed("people_reached", { low: 50000, best: 100000, high: 200000 })), "years_of_coverage", typed("years_of_coverage", { low: 1, best: 2, high: 3 }));
    expect(codes(guessed)).toContain("missing-data:missing_data_adj");
    const c = withRow(filled(files["corporate-campaign"]), "missing_data_adj", measured);
    expect(codes(c).filter((x) => x.startsWith("missing-data"))).toEqual([]);
  });
  it("missing data: the marker is the shared slider or 1, nothing else", () => {
    expect(codes(withRow(base(), "missing_data_adj", typed("missing_data_adj", { low: 0.3, best: 0.5, high: 0.8 })))).toContain("missing-data:missing_data_adj");
  });
  it("missing data: the proxy rows and borrowed medians are retired, medium only for models built before the rule", () => {
    const raw = base();
    const rows = [...(raw.rows as Row[]), { id: "proxy_peer_result", section: "adjustments", label: "Peers' result", formula: "#givedirectly", explainer: "The old proxy row." }];
    const borrowed = withRow(raw, "evidence_adj", { formula: "median(#givedirectly, #givedirectly)", value: undefined });
    expect(sev({ ...raw, rows })).toContain("high proxy:proxy_peer_result");
    expect(sev(borrowed)).toContain("high borrowed:evidence_adj");
    const old = { ...without(raw, "missing_data_adj"), source: { ...(raw.source as Row), published: "2026-11-01" } };
    expect(sev(withRow(old, "total_adj", { formula: "evidence_adj * counterfactual_adj * attribution_share * implementation_adj" }))).toContain("medium required-row:missing_data_adj");
    expect(sev(withRow(without(raw, "missing_data_adj"), "total_adj", { formula: "evidence_adj * counterfactual_adj * attribution_share * implementation_adj" }))).toContain("high required-row:missing_data_adj");
  });
});
