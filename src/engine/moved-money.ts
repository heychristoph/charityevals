// The one way the site values money a meta charity moves (an evaluator, a fundraiser, an effective-
// giving or research organisation), docs/normalization.md 2.8. Every meta model carries these rows,
// word for word, in a section of its own (kind "ours"); INV-12 (src/engine/invariants.ts) checks it.
// scripts/moved-money.ts writes them into a model.
//
//   V        value of a dollar moved = Σ destination share × that destination's live result (#model)
//   V_before value of where shifted money would have gone = @meta.prior_vs_cash × GiveDirectly, live
//   net      new share × V + (1 − new share) × (V − V_before)
//
// A result an evaluator already states as counterfactual value in "dollars of current effective
// donations" (CEARCH) is multiplied by V; money moved (gross) by `moved_dollar_net_value`.

export const MOVED_MONEY_SECTION = {
  id: "moved_money",
  title: "Value of a dollar moved (shared)",
  kind: "ours" as const,
  explainer:
    "charityevals' shared method for money a meta charity moves, the same rows in every such model (docs/normalization.md 2.8). A dollar moved is worth what the charities it reaches achieve, each at its live result on this site under your values; new money counts in full, shifted money only for the gain over where it would have gone.",
};

/** GiveWell's four Top Charities, read live, weighted by GiveWell's 2024 funding. */
export const GLOBAL_HEALTH_DESTINATIONS = ["against-malaria-foundation", "malaria-consortium-smc", "helen-keller-vas", "new-incentives"];
/** Animal Charity Evaluators' ten Recommended Charities (November 2025), read live, equal weights. */
export const ANIMAL_DESTINATIONS = [
  "animal-welfare-observatory", "aquatic-life-institute", "ciftlik-hayvanlarini-koruma-dernegi", "dansk-vegetarisk-forening",
  "good-food-fund", "shrimp-welfare-project", "sinergia-animal", "sociedade-vegetariana-brasileira", "the-humane-league",
  "wild-animal-initiative",
];

export type TemplateRow = { id: string; label: string; format: "small" | "percent"; formula: string; explainer: string };

const gh = `@meta.gw_weight_amf * #against-malaria-foundation + @meta.gw_weight_smc * #malaria-consortium-smc + @meta.gw_weight_vas * #helen-keller-vas + @meta.gw_weight_ni * #new-incentives`;
const aw = `avg(${ANIMAL_DESTINATIONS.map((id) => `#${id}`).join(", ")})`;

export const MOVED_MONEY_ROWS: Record<string, TemplateRow> = {
  value_global_health: {
    id: "value_global_health", format: "small", formula: gh,
    label: "Value of a dollar to global health and poverty charities (GiveWell's Top Charities, live), units of value",
    explainer: "GiveWell's four Top Charities (Against Malaria Foundation, Malaria Consortium's seasonal malaria chemoprevention, Helen Keller Intl's vitamin A, New Incentives), each at its result on this site under your values, weighted by what GiveWell directed to each in 2024 (50%, 29%, 18%, 4%).",
  },
  value_animals: {
    id: "value_animals", format: "small", formula: aw,
    label: "Value of a dollar to animal charities (ACE's Recommended Charities, live), units of value",
    explainer: "Animal Charity Evaluators' ten Recommended Charities (November 2025), each at its result on this site under your values (species weights and the chicken slider included), with equal weights: ACE's Recommended Charity Fund spreads money across all of them and publishes no fixed split.",
  },
  value_longtermist: {
    id: "value_longtermist", format: "small", formula: "@meta.value_longtermist",
    label: "Value of a dollar to longtermist charities, units of value (not valued: 0)",
    explainer: "Said openly: the site has no model that puts reducing catastrophic risk on its scale, so this part of the money counts as nothing.",
  },
  moved_dollar_value: {
    id: "moved_dollar_value", format: "small",
    formula: "(@meta.dest_share_human * value_global_health + @meta.dest_share_animals * value_animals + @meta.dest_share_longtermist * value_longtermist) / (@meta.dest_share_human + @meta.dest_share_animals + @meta.dest_share_longtermist)",
    label: "Value of a dollar moved, units of value",
    explainer: "Where effective donations go when donors choose the cause (Giving What We Can, 2020–2022: about 60% human wellbeing, 10% animals, 10% longtermist causes, 20% unknown or several), each part at its live value. The unknown part is valued at the average of the known ones, so it drops out of the mix.",
  },
  prior_dollar_value: {
    id: "prior_dollar_value", format: "small", formula: "@meta.prior_vs_cash * #givedirectly",
    label: "Value of a dollar where shifted money would otherwise have gone, units of value",
    explainer: "Shifted money was going to be given anyway; it is credited only for the gain. Where it would have gone is valued at GiveDirectly's live result (GiveWell's model), as Ambitious Impact does, times a shared multiple (1×, from 0 to 3×).",
  },
  new_money_share: {
    id: "new_money_share", format: "percent", formula: "@meta.new_money_share",
    label: "Share of money moved that is new money",
    explainer: "The site's one figure for every meta charity: about half the money moved wouldn't otherwise have been given (Ambitious Impact's Effective Giving Incubation report), from 35% to 80%.",
  },
  moved_dollar_net_value: {
    id: "moved_dollar_net_value", format: "small",
    formula: "new_money_share * moved_dollar_value + (1 - new_money_share) * (moved_dollar_value - prior_dollar_value)",
    label: "Value of a dollar moved, net of where shifted money would have gone, units of value",
    explainer: "New money counts in full; shifted money counts for the gain over where it would have gone.",
  },
};

/** `moved_dollar_value` for an organisation that only moves money within global health and poverty
 * (The Life You Can Save, Better Futures Guide): that destination alone. */
export const GLOBAL_HEALTH_ONLY: TemplateRow = {
  id: "moved_dollar_value", format: "small", formula: "value_global_health",
  label: "Value of a dollar moved, units of value",
  explainer: "This organisation moves money only to global health and poverty charities, so a dollar moved is valued at that destination alone (GiveWell's Top Charities, live), not the across-causes mix.",
};

/** Formulas a meta model's `moved_dollar_value` may have. */
export const MOVED_DOLLAR_FORMULAS = [MOVED_MONEY_ROWS.moved_dollar_value.formula, GLOBAL_HEALTH_ONLY.formula];

/** The success chance a not-yet-proven meta organisation's row reads in our view. */
export const SUCCESS_FACT = "meta.success_chance_new_org";

/** The career-change step, the mirror of staff salary sacrifice (docs/normalization.md 2.8): a programme
 * that moves people into high-impact jobs gets, per career changed, their forgone pay for the years they
 * stay, valued at the new employer's live result per dollar, times the share of changes the programme
 * caused. `career_employer_value` reads the employer's model (`#id`) or `moved_dollar_value`. No model
 * uses it yet. */
export const CAREER_CHANGE_FORMULA = "career_forgone_pay * career_years * career_employer_value * career_counterfactual_share";

const squash = (f: string) => f.replace(/\s+/g, "");
export const sameFormula = (a: string | undefined, b: string) => a !== undefined && squash(a) === squash(b);
