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
//   V_before value of where shifted money would have gone = @meta.prior_vs_cash × GiveDirectly, live;
//            for an organisation filed under another cause, an ordinary charity of that cause: the same
//            multiple of GiveDirectly over #cause:global-health, times #cause:<cause> (priorDollarValue);
//            for one whose money goes to several causes, each cause's in its own mix (priorDollarValueMix)
//   net      new share × V + (1 − new share) × (V − V_before), on the path to the output (INV-12);
//            money all shifted (a grantmaker's) earns shifted_dollar_value = V − V_before; spending
//            research or advice changed (a judged share of the money it informed, the row
//            informed_money) is all shifted, with the evidence and missing-data steps:
//            informed_money_value, in place of net (money_moved, if the model also moves money gross)
//   sets     money to a second destination set takes the same rows prefixed `<set>_` (destinationSetRows)
//
// A result an evaluator already states as counterfactual value in "dollars of current effective
// donations" (CEARCH) is multiplied by V; money moved (gross) by `moved_dollar_net_value`.
//
// Every destination is read at the figure the site ranks its charity by: the charity's primary
// evaluator's programme- and location-weighted figure, `#owner:charity` (src/engine/ranking.ts
// evaluatorFigure), never one of its models alone (a median location sheet can be a fifth of it). A
// model read by its id (`#id`) only where its charity has no figure on the rankings. A cause's or area's
// charities on the rankings, equal weights, are `#cause:x` (ranking.ts causeFigure): money that goes to a
// cause with no recipient modelled.
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
/** The livelihoods charities on the rankings (`area: "livelihoods"`), for an organisation that moves money
 * to livelihoods charities (Better Futures Guide): `#cause:livelihoods`, equal weights, none of them having
 * a published share yet. */
export const LIVELIHOODS = "cause:livelihoods";
/** The Life You Can Save's own split of the money it moved in 2025 (facts/meta.json tlycs_moved_2025_*),
 * each charity at the figure the rankings show for it (`#owner:charity`), or at its model where it has no
 * figure on the rankings (Raising the Village); its climate charities without a model at the one climate
 * recipient modelled (Clean Air Task Force), their cause's average within the split. Its other charities
 * have no model here and drop out: they're valued at the average of these. A charity that gets a model
 * joins the list (its fact is kept). */
export const TLYCS_DESTINATIONS: [string, string][] = [
  ["against_malaria_foundation", "givewell:against-malaria-foundation"],
  ["carbon180", "charityevals:clean-air-task-force"],
  ["clean_air_task_force", "charityevals:clean-air-task-force"],
  ["development_media_international", "givewell:development-media-international"],
  ["evergreen_collaborative", "charityevals:clean-air-task-force"],
  ["evidence_action", "givewell:evidence-action"],
  ["gain", "charityevals:global-alliance-for-improved-nutrition"],
  ["givedirectly", GIVEDIRECTLY],
  ["helen_keller_intl", "givewell:helen-keller-intl"],
  ["innovations_for_poverty_action", "givewell:innovations-for-poverty-action"],
  ["iodine_global_network", "charityevals:iodine-global-network"],
  ["lafiya", "givewell:lafiya-nigeria"],
  ["malaria_consortium", "givewell:malaria-consortium"],
  ["new_incentives", "givewell:new-incentives"],
  ["one_acre_fund", "givewell:one-acre-fund"],
  ["raising_the_village", "raising-the-village-2024"],
  ["teaching_at_the_right_level_africa", "the-life-you-can-save:teaching-at-the-right-level-africa"],
  ["unlimit_health", "sogive:unlimit-health"],
  ["village_enterprise", "charityevals:village-enterprise"],
];

export type TemplateRow = { id: string; label: string; format: "small" | "percent"; formula: string; explainer: string };

const [amf, mc, hk, ni] = GLOBAL_HEALTH_DESTINATIONS;
const gh = `@meta.gw_weight_amf * #${amf} + @meta.gw_weight_smc * #${mc} + @meta.gw_weight_vas * #${hk} + @meta.gw_weight_ni * #${ni}`;
const lw = `#${LIVELIHOODS}`;
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
    explainer: "The livelihoods charities on the rankings, each at its figure there under your values, with equal weights (#cause:livelihoods: whichever the site ranks, so it follows new models).",
  },
  value_tlycs_recommended: {
    id: "value_tlycs_recommended", format: "small", formula: tl,
    label: "Value of a dollar to The Life You Can Save's recommended charities (its 2025 split, live), units of value",
    explainer: "The Life You Can Save's own published split of the money it moved in 2025, by charity, each charity at its figure on the rankings under your values (its programmes and locations weighted by funding; Evidence Action, for one: syphilis screening, iron and folic acid, deworming, in-line chlorination and Dispensers for Safe Water); a charity with no figure on the rankings (Raising the Village) at its model; Carbon180 and Evergreen Collaborative, climate charities without a model, at Clean Air Task Force's, the one climate recipient modelled. The 13 charities with a model here took $11.3 million of the $24.1 million; the rest (18 charities and its Rapid Response Fund, none modelled here) is valued at the average of these, so it drops out of the mix.",
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
  shifted_dollar_value: {
    id: "shifted_dollar_value", format: "small", formula: "moved_dollar_value - prior_dollar_value",
    label: "Value of a dollar all shifted (given anyway, now to a better use), units of value",
    explainer: "Money that would have been given or spent anyway counts only for the gain over where it would have gone: a grantmaker's grants, or spending that research or advice changed.",
  },
  informed_money_value: {
    id: "informed_money_value", format: "small", formula: "informed_money * shifted_dollar_value * evidence_adj * missing_data_adj",
    label: "Value of the spending its research or advice changed (all shifted money), units of value",
    explainer: "Spending its research or advice changed, at a judged share of the money it informed: all of it would have been spent anyway, so it counts for the gain over where it would have gone, discounted for weak evidence and for an outcome not measured for this charity (docs/normalization.md 2.8, 2.12).",
  },
};

/** The model's own row read by informed_money_value: the spending its research or advice changed (US$),
 * kept apart from `money_moved` (money moved gross, valued net), so an organisation with both (funds and
 * advice) needs no row of its own. All shifted, it brings in no donors' new money: the credit by share of
 * resources never reads it. */
export const INFORMED_MONEY = "informed_money";

/** Rows written only for research or advice that changes how money is spent (`informed`): all shifted. */
export const INFORMED_ROWS = ["shifted_dollar_value", "informed_money_value"] as const;

/** `prior_dollar_value` for an organisation filed under a cause other than global health (its model's
 * `cause`: Animal Charity Evaluators, 80,000 Hours): shifted money would have gone to an ordinary charity
 * of that cause, not to GiveDirectly, whose value per dollar in units of value is of another scale (an
 * animal charity's dollar is a thousandth of it, so shifted money would always be a loss). An ordinary
 * charity stands to its cause's charities on the rankings as GiveDirectly (times the shared multiple)
 * stands to global health's: in global health it is the shared row itself. */
export function priorDollarValue(cause: string): TemplateRow {
  if (cause === "global-health") return MOVED_MONEY_ROWS.prior_dollar_value;
  return {
    id: "prior_dollar_value", format: "small",
    formula: `@meta.prior_vs_cash * #${CASH_BENCHMARK} / #cause:global-health * #cause:${cause}`,
    label: "Value of a dollar where shifted money would otherwise have gone (our judgment: an ordinary charity of its cause, as 1× GiveDirectly is in global health), units of value",
    explainer: `Our judgment, the shared rule for an organisation that moves money within a cause other than global health (${cause}). Shifted money was going to be given anyway, to an ordinary charity of the same cause; it is credited only for the gain. An ordinary charity stands to its cause's charities on the rankings as GiveDirectly (GiveWell's model, times a shared multiple, 1×, from 0 to 3×) stands to global health's: GiveDirectly's live result over the global-health charities' (#cause:global-health), times the ${cause} charities' (#cause:${cause}), all live under your values.`,
  };
}

/** One cause's share of a cross-cause mover's money: the `@meta` fact holding it and the cause (or
 * area) it goes to, or several whose ranked charities are averaged (`avg(#cause:a, #cause:b)`). */
export type CauseShare = [fact: string, cause: string | string[]];
const causeTerm = (c: string | string[]) => (Array.isArray(c) ? `avg(${c.map((x) => `#cause:${x}`).join(", ")})` : `#cause:${c}`);

/** `prior_dollar_value` for an organisation whose money goes to several causes (its own split,
 * `value_destinations`): an ordinary charity of each cause, weighted by the same shares,
 * Σ share × priorDollarValue(cause) / Σ share. In global health that cause's term is the shared row's
 * GiveDirectly (#cause:global-health cancels). */
export function priorDollarValueMix(shares: CauseShare[]): TemplateRow {
  const num = shares.map(([k, c]) => `@meta.${k} * ${causeTerm(c)}`).join(" + ");
  const den = shares.map(([k]) => `@meta.${k}`).join(" + ");
  return {
    id: "prior_dollar_value", format: "small",
    formula: `@meta.prior_vs_cash * #${CASH_BENCHMARK} / #cause:global-health * (${num}) / (${den})`,
    label: "Value of a dollar where shifted money would otherwise have gone (our judgment: an ordinary charity of each cause its money goes to, in its own mix), units of value",
    explainer: "Our judgment, the shared rule for an organisation whose money goes to several causes. Shifted money would have gone to an ordinary charity of the same cause: each cause's at the rule for a mover in that cause (GiveDirectly's live result, times a shared multiple, 1×, from 0 to 3×, over the global-health charities' on the rankings, times that cause's charities'), weighted by the organisation's own split, all live under your values.",
  };
}

/** The shares of a cause-split prior (`priorDollarValueMix`), or undefined if the formula isn't one. */
export function causeSplitShares(formula: string | undefined): CauseShare[] | undefined {
  if (!formula) return undefined;
  const pairs = [...formula.matchAll(/@meta\.([a-z0-9_]+)\s*\*\s*(#cause:[a-z0-9-]+|avg\((?:\s*#cause:[a-z0-9-]+\s*,?)+\))/g)].map(([, k, t]): CauseShare => {
    const cs = [...t.matchAll(/#cause:([a-z0-9-]+)/g)].map((x) => x[1]);
    return [k, t.startsWith("avg") ? cs : cs[0]];
  });
  return pairs.length && sameFormula(formula, priorDollarValueMix(pairs).formula) ? pairs : undefined;
}

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

/** A second destination set: money a model moves to other destinations than its main set (Ambitious
 * Impact: its founded charities, and the global health charities its effective giving organisations
 * fund). The set's rows are the main set's, word for word, with `<set>_` before every set row's id; the
 * model's own money rows take the prefix too (`<set>_money_moved` gross, `<set>_informed_money` changed).
 * Its destination is one of the shared single-cause rows, so shifted money is compared with GiveDirectly. */
export const SET_ROWS = ["moved_dollar_value", "prior_dollar_value", "moved_dollar_net_value", "shifted_dollar_value", "informed_money_value"] as const;
export const SET_DESTINATIONS = [GLOBAL_HEALTH_ONLY.formula, LIVELIHOODS_ONLY.formula, TLYCS_SPLIT.formula];
const setIds = ["moved_dollar_value", "prior_dollar_value", "shifted_dollar_value", INFORMED_MONEY];

/** The rows of destination set `set` whose destination is `destination` (a SET_DESTINATIONS formula). */
export function destinationSetRows(set: string, destination: string): TemplateRow[] {
  const prefix = (f: string) => f.replace(new RegExp(`\\b(${setIds.join("|")})\\b`, "g"), `${set}_$1`);
  const main: Record<string, TemplateRow> = { ...MOVED_MONEY_ROWS, moved_dollar_value: { ...GLOBAL_HEALTH_ONLY, formula: destination } };
  return SET_ROWS.map((id) => ({ ...main[id], id: `${set}_${id}`, formula: id === "moved_dollar_value" ? destination : prefix(main[id].formula) }));
}

/** The second destination sets a model's rows name (`<set>_<set row>`): set → the set rows it has. */
export function destinationSets(ids: Iterable<string>): Map<string, string[]> {
  const sets = new Map<string, string[]>();
  for (const id of ids)
    for (const base of SET_ROWS)
      if (id.length > base.length + 1 && id.endsWith(`_${base}`)) {
        const set = id.slice(0, -base.length - 1);
        sets.set(set, [...(sets.get(set) ?? []), base]);
      }
  return sets;
}

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
 * `moved_per_dollar` is the gross money moved (or influenced) per dollar of the organisation's cost; the
 * spending its research or advice changed (`informed_money`, all shifted) brings no new money and stays out. */
export const META_DONOR_COST_SHARE_FORMULA = "1 / (1 + if($resource_shares, salary_sacrifice + moved_per_dollar * new_money_share, 0))";

/** The career-change step, the mirror of staff salary sacrifice (docs/normalization.md 2.8): a programme
 * that moves people into high-impact jobs gets, per career changed, their forgone pay for the years they
 * stay, valued at the new employer's live result per dollar, times the share of changes the programme
 * caused. `career_employer_value` reads the employer's model (`#id`) or `moved_dollar_value`. No model
 * uses it yet. */
export const CAREER_CHANGE_FORMULA = "career_forgone_pay * career_years * career_employer_value * career_counterfactual_share";

const squash = (f: string) => f.replace(/\s+/g, "");
export const sameFormula = (a: string | undefined, b: string) => a !== undefined && squash(a) === squash(b);
