// The one way the site values money a meta charity moves (an evaluator, a fundraiser, an effective-
// giving or research organisation), docs/normalization.md 2.8. Every meta model carries these rows,
// word for word, in a section of its own (kind "ours"); INV-12 (src/engine/invariants.ts) checks it.
// scripts/moved-money.ts writes them into a model.
//
//   V        value of a dollar moved = Σ destination share × that destination's live result (#model),
//            the destinations being where the organisation's money actually goes (its own published
//            split where it has one, else the cause it works in: global health, livelihoods). The
//            across-causes mix (Giving What We Can's split, animals, longtermist causes at 0) was removed
//            on 2026-11-02: no model used it; an organisation moving money across causes would rebuild it.
//   V_before value of where shifted money would have gone = @meta.prior_vs_cash × GiveDirectly, live
//   net      new share × V + (1 − new share) × (V − V_before)
//
// A result an evaluator already states as counterfactual value in "dollars of current effective
// donations" (CEARCH) is multiplied by V; money moved (gross) by `moved_dollar_net_value`.
//
// Every destination is read at the figure the site ranks its charity by: the charity's primary
// evaluator's programme- and location-weighted figure, `#owner:charity` (src/engine/ranking.ts
// evaluatorFigure), never one of its models alone (a median location sheet can be a fifth of it). A
// model read by its id (`#id`) only where its charity has no figure on the rankings.
//
// GiveDirectly, two reads: money that goes to GiveDirectly is a destination like any other, at the
// figure the rankings show (#givewell:givedirectly, GiveWell's five-country aggregate, 0.00993 units of
// value per dollar at the defaults); where shifted money would otherwise have gone is the site's cash
// benchmark (#givedirectly, GiveWell's Kenya model, `common.benchmark`, 0.00792), times a judged multiple
// (docs/normalization.md 2.3 and 2.7). `@cash.uov_per_dollar` (0.00335) is a third thing: the benchmark
// old sheets divided by to state "multiples of cash", which cancels where it is used. No meta model reads it.

/** GiveDirectly as a destination: GiveWell's figure for the charity, as on the rankings. */
export const GIVEDIRECTLY = "givewell:givedirectly";
/** The site's cash benchmark (`common.benchmark`), where shifted money would otherwise have gone. */
export const CASH_BENCHMARK = "givedirectly";

export const MOVED_MONEY_SECTION = {
  id: "moved_money",
  title: "Value of a dollar moved (shared)",
  kind: "ours" as const,
  explainer:
    "charityevals' shared method for money a meta charity moves, the same rows in every such model (docs/normalization.md 2.8). A dollar moved is worth what the charities it reaches achieve, each at its live result on this site under your values; new money counts in full, shifted money only for the gain over where it would have gone.",
};

/** GiveWell's four Top Charities, each at GiveWell's figure for the charity, weighted by GiveWell's 2024 funding. */
export const GLOBAL_HEALTH_DESTINATIONS = ["givewell:against-malaria-foundation", "givewell:malaria-consortium", "givewell:helen-keller-intl", "givewell:new-incentives"];
/** Livelihoods charities with an evaluator's live model on the site, for an organisation that moves money
 * to livelihoods charities (Better Futures Guide). Equal weights: none of them has a published share yet.
 * Raising the Village has no figure on the rankings (GiveWell's sheet sizes a research grant), so its model. */
export const LIVELIHOODS_DESTINATIONS = [
  GIVEDIRECTLY, "raising-the-village-2024", "givewell:one-acre-fund",
];
/** The Life You Can Save's own split of the money it moved in 2025 (facts/meta.json tlycs_moved_2025_*),
 * each charity at the figure the rankings show for it (`#owner:charity`). A charity whose only model is
 * an unpublished evaluator's (Founders Pledge, Giving Green), or that has no figure on the rankings
 * (Raising the Village), at that model. Its other charities have no model here and drop out: they're
 * valued at the average of these. */
export const TLYCS_DESTINATIONS: [string, string][] = [
  ["against_malaria_foundation", "givewell:against-malaria-foundation"],
  ["clean_air_task_force", "charityevals:clean-air-task-force"],
  ["development_media_international", "givewell:development-media-international"],
  ["evidence_action", "givewell:evidence-action"],
  ["givedirectly", GIVEDIRECTLY],
  ["helen_keller_intl", "givewell:helen-keller-intl"],
  ["innovations_for_poverty_action", "givewell:innovations-for-poverty-action"],
  ["lafiya", "givewell:lafiya-nigeria"],
  ["malaria_consortium", "givewell:malaria-consortium"],
  ["new_incentives", "givewell:new-incentives"],
  ["one_acre_fund", "givewell:one-acre-fund"],
  ["raising_the_village", "raising-the-village-2024"],
  ["unlimit_health", "sogive:unlimit-health"],
];

export type TemplateRow = { id: string; label: string; format: "small" | "percent"; formula: string; explainer: string };

const [amf, mc, hk, ni] = GLOBAL_HEALTH_DESTINATIONS;
const gh = `@meta.gw_weight_amf * #${amf} + @meta.gw_weight_smc * #${mc} + @meta.gw_weight_vas * #${hk} + @meta.gw_weight_ni * #${ni}`;
const lw = `avg(${LIVELIHOODS_DESTINATIONS.map((id) => `#${id}`).join(", ")})`;
const tl = `(${TLYCS_DESTINATIONS.map(([k, id]) => `@meta.tlycs_moved_2025_${k} * #${id}`).join(" + ")}) / (${TLYCS_DESTINATIONS.map(([k]) => `@meta.tlycs_moved_2025_${k}`).join(" + ")})`;

export const MOVED_MONEY_ROWS: Record<string, TemplateRow> = {
  value_global_health: {
    id: "value_global_health", format: "small", formula: gh,
    label: "Value of a dollar to global health and poverty charities (GiveWell's Top Charities, live), units of value",
    explainer: "GiveWell's four Top Charities (Against Malaria Foundation, Malaria Consortium, Helen Keller Intl, New Incentives), each at GiveWell's figure for the charity on the rankings (its programmes and locations weighted by funding) under your values, weighted by what GiveWell directed to each in 2024 (50%, 29%, 18%, 4%).",
  },
  value_livelihoods: {
    id: "value_livelihoods", format: "small", formula: lw,
    label: "Value of a dollar to livelihoods charities (live), units of value",
    explainer: "The livelihoods charities with an evaluator's model on this site, each at its figure on the rankings under your values, with equal weights: GiveDirectly, Raising the Village (not on the rankings: its model) and One Acre Fund (all GiveWell's).",
  },
  value_tlycs_recommended: {
    id: "value_tlycs_recommended", format: "small", formula: tl,
    label: "Value of a dollar to The Life You Can Save's recommended charities (its 2025 split, live), units of value",
    explainer: "The Life You Can Save's own published split of the money it moved in 2025, by charity, each charity at its figure on the rankings under your values (its programmes and locations weighted by funding; Evidence Action, for one: syphilis screening, iron and folic acid, deworming, in-line chlorination and Dispensers for Safe Water); a charity whose only model is an unpublished evaluator's, or with no figure on the rankings (Raising the Village), at that model. The 19 charities with a model here took $13.4 million of the $24.1 million; the rest (15 charities and its Rapid Response Fund, none modelled here) is valued at the average of these, so it drops out of the mix.",
  },
  prior_dollar_value: {
    id: "prior_dollar_value", format: "small", formula: `@meta.prior_vs_cash * #${CASH_BENCHMARK}`,
    label: "Value of a dollar where shifted money would otherwise have gone (our judgment: 1× GiveDirectly), units of value",
    explainer: "Our judgment. Shifted money was going to be given anyway; it is credited only for the gain. Where it would have gone is valued at GiveDirectly's live result (GiveWell's model), as Ambitious Impact does, times a shared multiple (1×, from 0 to 3×).",
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
 * and publishes no split: that destination alone. */
export const GLOBAL_HEALTH_ONLY: TemplateRow = {
  id: "moved_dollar_value", format: "small", formula: "value_global_health",
  label: "Value of a dollar moved, units of value",
  explainer: "This organisation moves money only to global health and poverty charities, so a dollar moved is valued at that destination alone (GiveWell's Top Charities, live).",
};
/** `moved_dollar_value` for an organisation that moves money to livelihoods charities (Better Futures Guide). */
export const LIVELIHOODS_ONLY: TemplateRow = {
  id: "moved_dollar_value", format: "small", formula: "value_livelihoods",
  label: "Value of a dollar moved, units of value",
  explainer: "This organisation recommends livelihoods charities, so a dollar moved is valued at the livelihoods charities the site models (live), not at GiveWell's health-focused Top Charities.",
};
/** `moved_dollar_value` for The Life You Can Save: its own published split. */
export const TLYCS_SPLIT: TemplateRow = {
  id: "moved_dollar_value", format: "small", formula: "value_tlycs_recommended",
  label: "Value of a dollar moved, units of value",
  explainer: "Valued by where this organisation's money actually went: its own published split by charity, each at its live result on this site.",
};

/** `moved_dollar_value` for an organisation that publishes where its money went (by recipient or cause):
 * the model's own row `value_destinations`, written by hand by the rule of normalization.md 2.8 ("Its own
 * split") and checked by `isDestinationMix`. */
export const OWN_SPLIT: TemplateRow = {
  id: "moved_dollar_value", format: "small", formula: "value_destinations",
  label: "Value of a dollar moved, units of value",
  explainer: "Valued by where this organisation's money went: its own published split, each recipient at its live result on this site (value_destinations).",
};

/** Formulas a meta model's `moved_dollar_value` may have. */
export const MOVED_DOLLAR_FORMULAS = [GLOBAL_HEALTH_ONLY.formula, LIVELIHOODS_ONLY.formula, TLYCS_SPLIT.formula, OWN_SPLIT.formula];

/** A `value_destinations` formula holds only the organisation's money by recipient or cause (`@meta.*`),
 * live results (`#id`, `#owner:charity`), the shared destination rows, `avg()`, 1 and arithmetic: no
 * typed value per dollar and no evaluator's multiplier. */
export function isDestinationMix(formula: string | undefined): boolean {
  if (!formula || !/#[a-z]/.test(formula)) return false;
  const rest = formula
    .replace(/@meta\.[a-z0-9_]+/g, " ")
    .replace(/#[a-z0-9:-]+/g, " ")
    .replace(/\b(value_global_health|value_livelihoods|avg)\b/g, " ")
    .replace(/\b1\b/g, " ");
  return /^[\s()+\-*/,]*$/.test(rest);
}

/** The success chance a not-yet-proven meta organisation's row reads in our view. */
export const SUCCESS_FACT = "meta.success_chance_new_org";

/** One success step for every not-yet-proven meta organisation (CEARCH, Better Futures Guide): an expected
 * value over both branches, benefits and costs alike. If it fails it still moves @meta.failure_money_share
 * of the money it would have moved, and spends for @meta.failure_years_run years before closing:
 *   success_adjustment = (p + (1 − p) × failure_money_share) / (p + (1 − p) × failure_cost_share)
 * applied to a benefit-cost ratio of the successful case. Better Futures Guide's sheet already takes this
 * expected value over its own rows (which read the same facts). */
export const SUCCESS_ADJUSTMENT_FORMULA =
  "(organisation_success + (1 - organisation_success) * failure_money_share) / (organisation_success + (1 - organisation_success) * failure_cost_share)";

/** A marginal dollar against an organisation's past average: the "Your values" slider read by every model
 * whose `estimate_basis` is `past_average` (The Life You Can Save's 3-year leverage ratio; climate,
 * animal and research models built on past budgets and past wins), the evaluator's 1 in `published`.
 * INV-18 checks that those models, and only those, read it. */
export const MARGINAL_ASSUMPTION = "marginal_vs_past_average";

/** Credit by share of resources (`$resource_shares`) for every meta model, one formula: when on, the
 * donors whose new money the organisation moves are co-contributors, alongside staff's forgone pay.
 * `moved_per_dollar` is the gross money moved (or influenced) per dollar of the organisation's cost. */
export const META_DONOR_COST_SHARE_FORMULA = "1 / (1 + if($resource_shares, salary_sacrifice + moved_per_dollar * new_money_share, 0))";

/** The career-change step, the mirror of staff salary sacrifice (docs/normalization.md 2.8): a programme
 * that moves people into high-impact jobs gets, per career changed, their forgone pay for the years they
 * stay, valued at the new employer's live result per dollar, times the share of changes the programme
 * caused. `career_employer_value` reads the employer's model (`#id`) or `moved_dollar_value`. No model
 * uses it yet. */
export const CAREER_CHANGE_FORMULA = "career_forgone_pay * career_years * career_employer_value * career_counterfactual_share";

const squash = (f: string) => f.replace(/\s+/g, "");
export const sameFormula = (a: string | undefined, b: string) => a !== undefined && squash(a) === squash(b);
