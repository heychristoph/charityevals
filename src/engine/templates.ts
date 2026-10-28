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
  /** Row ids of the bottom line before and after the salary-sacrifice share. */
  perDollar: string;
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
    output,
    sections: SECTIONS,
    required: [...COMMON_REQUIRED, ...required, perDollar, output],
    bounds: { ...COMMON_BOUNDS, ...bounds },
  };
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
  "corporate-campaign": spec(
    "Corporate and producer welfare campaigns",
    "sad",
    "sads",
    ["animals_per_year", "sads_per_animal_year", "implementation_adj", "years_of_impact", "discounted_years"],
    { sads_per_animal_year: [0, 400] },
  ),
  "diet-change": spec(
    "Diet change and institutional meal replacement",
    "sad",
    "sads",
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

/** Families whose output is not in units of value: the unit and per-dollar prefix follow the
 * downstream outcome. A policy-research-meta model may report in sad or wellby instead of uov. */
export function allowedUnits(family: Family): string[] {
  return family === "policy-research-meta" ? ["uov", "sad", "wellby"] : [TEMPLATES[family].unit];
}

export function perDollarIds(family: Family, unit: string): { perDollar: string; output: string } {
  if (family !== "policy-research-meta") return { perDollar: TEMPLATES[family].perDollar, output: TEMPLATES[family].output };
  const prefix = unit === "sad" ? "sads" : unit === "wellby" ? "wellbys" : "uov";
  return { perDollar: `${prefix}_per_dollar`, output: `${prefix}_per_donor_dollar` };
}
