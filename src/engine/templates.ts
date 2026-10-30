// Template families for charityevals' own models (built with the build-cea skill). Every family
// shares one skeleton: cost → reach → effect per unit → adjustments → outcome → your dollar's share,
// with canonical row ids, so two models of the same family can be compared row by row and every
// model ends in a unit with an exchange rate to the common unit. The skeleton JSON files live in
// .claude/skills/build-cea/templates/<family>.json; this file is what the checks enforce.
import type { z } from "zod";
import type { TemplateFamily } from "./schema";

export type Family = z.infer<typeof TemplateFamily>;

export type TemplateSpec = {
  title: string;
  /** Output unit: a key of assumptions.units with a to_common formula. */
  unit: string;
  /** Row ids of the bottom line before and after the salary-sacrifice share (`donor`), and the
   * output: the donor row itself, or for animal families the species step's sum after it. */
  perDollar: string;
  donor: string;
  output: string;
  /** Section ids in the order the model must use them. */
  sections: string[];
  /** Rows every model of the family must have (canonical ids). */
  required: string[];
  /** Plausible bounds for canonical rows, checked on computed values. Outside: high-severity
   * finding, unless the explainer argues for it (then the auditor decides). */
  bounds: Record<string, [number, number]>;
};

/** Shared by every family. */
const SECTIONS = ["cost", "reach", "effect", "adjustments", "outcome", "donor"];
const COMMON_REQUIRED = [
  "program_spend",
  "overhead_ratio",
  "cost_total",
  "evidence_adj",
  "counterfactual_adj",
  "attribution_share_shared",
  "attribution_share",
  "total_adj",
  "outcome_total",
  "staff_cost_share",
  "salary_gap",
  "salary_sacrifice",
  "donor_cost_share",
];
const COMMON_BOUNDS: Record<string, [number, number]> = {
  overhead_ratio: [1, 2],
  evidence_adj: [0, 1.2],
  counterfactual_adj: [0, 1],
  attribution_share_shared: [0, 1],
  attribution_share: [0, 1],
  implementation_adj: [0, 1],
  leverage_funging_adj: [0.5, 1.5],
  unmodelled_benefits_adj: [-0.3, 0.6],
  staff_cost_share: [0, 1],
  salary_gap: [0, 0.8],
  donor_cost_share: [0, 1],
  persistence_years: [0, 50],
  years_of_impact: [0, 50],
};

const donor = (unit: string) => [`${unit}_per_dollar`, `${unit}_per_donor_dollar`] as const;

function spec(title: string, unit: string, prefix: string, required: string[], bounds: Record<string, [number, number]>): TemplateSpec {
  const [perDollar, output] = donor(prefix);
  return {
    title,
    unit,
    perDollar,
    donor: output,
    output,
    sections: SECTIONS,
    required: [...COMMON_REQUIRED, ...required, perDollar, output],
    bounds: { ...COMMON_BOUNDS, ...bounds },
  };
}

/** Animal families count Ambitious Impact's SADs (the shared per-change figures) and end in
 * chicken-equivalent pain days through the species step (docs/normalization.md 2.4). */
function animal(title: string, required: string[], bounds: Record<string, [number, number]>): TemplateSpec {
  const s = spec(title, "ced", "sads", required, bounds);
  return { ...s, output: "ced_per_donor_dollar", required: [...s.required, "ced_per_donor_dollar"] };
}

export const TEMPLATES: Record<Family, TemplateSpec> = {
  "direct-health": spec(
    "Direct health: deaths and illness averted",
    "uov",
    "uov",
    ["people_reached", "baseline_mortality_rate", "mortality_reduction", "deaths_averted_per_person", "share_under5", "deaths_averted", "uov_deaths", "uov_morbidity", "uov_income", "unmodelled_benefits_adj", "leverage_funging_adj"],
    { mortality_reduction: [0, 0.9], baseline_mortality_rate: [0, 0.2], share_under5: [0, 1], deaths_averted_per_person: [0, 0.05] },
  ),
  "cash-income": spec(
    "Cash transfers and income gains",
    "uov",
    "uov",
    ["people_reached", "baseline_consumption", "ln_gain_per_person", "spillover_ratio", "uov_consumption", "unmodelled_benefits_adj", "leverage_funging_adj"],
    { spillover_ratio: [0, 1.5], ln_gain_per_person: [0, 3] },
  ),
  wellbeing: spec(
    "Mental health and subjective wellbeing",
    "wellby",
    "wellbys",
    ["people_reached", "initial_effect_sd", "effect_duration_years", "wellbys_per_person", "household_multiplier", "implementation_adj"],
    { initial_effect_sd: [0, 1.5], effect_duration_years: [0, 20], wellbys_per_person: [0, 10], household_multiplier: [1, 3] },
  ),
  "corporate-campaign": animal(
    "Corporate and producer welfare campaigns",
    ["animals_per_year", "sads_per_animal_year", "implementation_adj", "years_of_impact", "discounted_years"],
    { sads_per_animal_year: [0, 400] },
  ),
  "diet-change": animal(
    "Diet change and institutional meal replacement",
    ["meals_replaced_per_year", "sads_per_meal", "production_response", "years_of_impact", "discounted_years", "implementation_adj"],
    { sads_per_meal: [0, 10], production_response: [0, 1] },
  ),
  "policy-research-meta": spec(
    "Policy, research and meta (value through other actors)",
    "uov",
    "uov",
    ["p_success", "downstream_value", "years_of_impact"],
    { p_success: [0, 1] },
  ),
};

/** A policy-research-meta model reports in its downstream unit: uov, wellby or ced (via SADs and the
 * species step, as the animal families). */
export function allowedUnits(family: Family): string[] {
  return family === "policy-research-meta" ? ["uov", "wellby", "ced"] : [TEMPLATES[family].unit];
}

export function perDollarIds(family: Family, unit: string): { perDollar: string; donor: string; output: string } {
  if (family !== "policy-research-meta") {
    const t = TEMPLATES[family];
    return { perDollar: t.perDollar, donor: t.donor, output: t.output };
  }
  const prefix = unit === "ced" ? "sads" : unit === "wellby" ? "wellbys" : "uov";
  return { perDollar: `${prefix}_per_dollar`, donor: `${prefix}_per_donor_dollar`, output: unit === "ced" ? "ced_per_donor_dollar" : `${prefix}_per_donor_dollar` };
}
