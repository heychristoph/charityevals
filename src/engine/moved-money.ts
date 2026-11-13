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
// GiveDirectly: every meta model reads GiveDirectly's live result (#givedirectly, GiveWell's model,
// 0.00872 units of value per dollar at the defaults) wherever money would have gone or goes to cash.
// `@cash.uov_per_dollar` (0.00335) is a different thing: the benchmark old sheets divided by to state
// "multiples of cash", which cancels where it is used (docs/normalization.md 2.7). No meta model reads it.

export const MOVED_MONEY_SECTION = {
  id: "moved_money",
  title: "Value of a dollar moved (shared)",
  kind: "ours" as const,
  explainer:
    "charityevals' shared method for money a meta charity moves, the same rows in every such model (docs/normalization.md 2.8). A dollar moved is worth what the charities it reaches achieve, each at its live result on this site under your values; new money counts in full, shifted money only for the gain over where it would have gone.",
};

/** GiveWell's four Top Charities, read live, weighted by GiveWell's 2024 funding. */
export const GLOBAL_HEALTH_DESTINATIONS = ["against-malaria-foundation", "malaria-consortium-smc", "helen-keller-vas", "new-incentives"];
/** Livelihoods charities with an evaluator's live model on the site, for an organisation that moves money
 * to livelihoods charities (Better Futures Guide). Equal weights: none of them has a published share yet. */
export const LIVELIHOODS_DESTINATIONS = [
  // Founders Pledge's Bandhan and Village Enterprise models are out while FP's models aren't published (owners.json).
  "givedirectly", "raising-the-village-2024", "one-acre-fund-seedlings-2022",
];
/** The Life You Can Save's own split of the money it moved in 2025 (facts/meta.json tlycs_moved_2025_*),
 * each charity at its main model on the site (GiveDirectly at #givedirectly, as everywhere in meta
 * models), or, for a charity that runs several programmes, at its programme-weighted figure from the
 * rankings (`#owner:charity`: Evidence Action and Malaria Consortium, GiveWell's). Its other charities
 * have no model here and drop out: they're valued at the average of these. */
export const TLYCS_DESTINATIONS: [string, string][] = [
  ["against_malaria_foundation", "against-malaria-foundation"],
  ["carbon180", "carbon180-giving-green"],
  ["clean_air_task_force", "clean-air-task-force-founders-pledge"],
  ["development_media_international", "development-media-international-dmi"],
  ["evergreen_collaborative", "evergreen-collaborative-giving-green"],
  ["evidence_action", "givewell:evidence-action"],
  ["givedirectly", "givedirectly"],
  ["gain", "global-alliance-for-improved-nutrition-founders-pledge"],
  ["helen_keller_intl", "helen-keller-vas"],
  ["innovations_for_poverty_action", "innovations-for-poverty-action-ipa-m-e-msi-family-planning-outreach"],
  ["iodine_global_network", "iodine-global-network-founders-pledge"],
  ["lafiya", "lafiya-nigeria-2026"],
  ["malaria_consortium", "givewell:malaria-consortium"],
  ["new_incentives", "new-incentives"],
  ["one_acre_fund", "one-acre-fund-seedlings-2022"],
  ["raising_the_village", "raising-the-village-2024"],
  ["teaching_at_the_right_level_africa", "teaching-at-the-right-level-africa-founders-pledge"],
  ["unlimit_health", "unlimit-health-deworming-sogive-2022"],
  ["village_enterprise", "village-enterprise-founders-pledge"],
];

export type TemplateRow = { id: string; label: string; format: "small" | "percent"; formula: string; explainer: string };

const gh = `@meta.gw_weight_amf * #against-malaria-foundation + @meta.gw_weight_smc * #malaria-consortium-smc + @meta.gw_weight_vas * #helen-keller-vas + @meta.gw_weight_ni * #new-incentives`;
const lw = `avg(${LIVELIHOODS_DESTINATIONS.map((id) => `#${id}`).join(", ")})`;
const tl = `(${TLYCS_DESTINATIONS.map(([k, id]) => `@meta.tlycs_moved_2025_${k} * #${id}`).join(" + ")}) / (${TLYCS_DESTINATIONS.map(([k]) => `@meta.tlycs_moved_2025_${k}`).join(" + ")})`;

export const MOVED_MONEY_ROWS: Record<string, TemplateRow> = {
  value_global_health: {
    id: "value_global_health", format: "small", formula: gh,
    label: "Value of a dollar to global health and poverty charities (GiveWell's Top Charities, live), units of value",
    explainer: "GiveWell's four Top Charities (Against Malaria Foundation, Malaria Consortium's seasonal malaria chemoprevention, Helen Keller Intl's vitamin A, New Incentives), each at its result on this site under your values, weighted by what GiveWell directed to each in 2024 (50%, 29%, 18%, 4%).",
  },
  value_livelihoods: {
    id: "value_livelihoods", format: "small", formula: lw,
    label: "Value of a dollar to livelihoods charities (live), units of value",
    explainer: "The livelihoods charities with an evaluator's model on this site, each at its live result under your values, with equal weights: GiveDirectly, Raising the Village and One Acre Fund (all GiveWell's).",
  },
  value_tlycs_recommended: {
    id: "value_tlycs_recommended", format: "small", formula: tl,
    label: "Value of a dollar to The Life You Can Save's recommended charities (its 2025 split, live), units of value",
    explainer: "The Life You Can Save's own published split of the money it moved in 2025, by charity, each charity at its main model's live result on this site (GiveDirectly at GiveWell's model, as everywhere in meta models); Evidence Action and Malaria Consortium, which run several programmes, at GiveWell's programme-weighted figure for the charity, as on the rankings (Evidence Action: syphilis screening, iron and folic acid, deworming, in-line chlorination and Dispensers for Safe Water; Malaria Consortium: seasonal malaria chemoprevention over its locations, bed nets and vitamin A). The 19 charities with a model here took $13.4 million of the $24.1 million; the rest (15 charities and its Rapid Response Fund, none modelled here) is valued at the average of these, so it drops out of the mix.",
  },
  prior_dollar_value: {
    id: "prior_dollar_value", format: "small", formula: "@meta.prior_vs_cash * #givedirectly",
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

/** Formulas a meta model's `moved_dollar_value` may have. */
export const MOVED_DOLLAR_FORMULAS = [GLOBAL_HEALTH_ONLY.formula, LIVELIHOODS_ONLY.formula, TLYCS_SPLIT.formula];

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
