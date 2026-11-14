# Audit: rethink-priorities-charityevals-cross-cause, round 4 (scoped verification)
Result: 5.007e-5 uov/$ = 0.02504 years of healthy life per 1,000 dollars (combined range 2.4e-4–2.62), unchanged from before the change (0.0250368); global-health median 0.0652 (×0.38).
Verdict: **pass**
Model-sha: 4a9b2ea75cd8e88d41dc84f301c4d945c17022500b74143a4760438ba1335216
Scope: only the change to the money-moved rows (docs/normalization.md 2.8, `priorDollarValueMix` in src/engine/moved-money.ts, INV-12): `shifted_dollar_value`, `informed_money_value`, `moved_value`, the cause-split `prior_dollar_value`, removal of `new_money_share` and `moved_dollar_net_value`, deletion of the INV-12 waivers. Sources unchanged; nothing re-fetched; normalization-audit run by the orchestrator (0 violations).

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| - | - | - | No finding. | - |

## Checks of the change
- Shared rows: `npx tsx scripts/moved-money.ts own-split informed rp_cross_cause_share_global_health=global-health,rp_cross_cause_share_animal_welfare=animal-welfare,rp_cross_cause_share_ai=ai` prints `shifted_dollar_value` (`moved_dollar_value - prior_dollar_value`), `informed_money_value` (`money_moved * shifted_dollar_value * evidence_adj * missing_data_adj`) and `prior_dollar_value` formulas that match the model's word for word; only the labels and explainers of the prior are model-specific, and they agree with the shared text.
- Shares: the prior's three shares and cause figures are those of `value_destinations` (global-health, animal-welfare, ai; same divisor), so the cause mix is the same as before.
- `moved_value = informed_money_value * (1 + research_side_effects)`. Before, `total_adj` carried counterfactual_adj and attribution_share, both 1 in this model, so evidence_adj * missing_data_adj gives the same value. `total_adj` stays in use for `downstream_value * total_adj` in the main formula.
- Headline: `headlines.ts` gives 0.0250368, equal to the figure before the change.
- `audit-model.ts`: no high finding (one low, the wide joint range, which the summary already states). The tornado is unchanged in order and signs.
- Nothing dropped: grep finds no remaining reference to `new_money_share` or `moved_dollar_net_value`; both were unused. No row refers to a deleted id.
- Text: the summary (0.03 years per $1,000, 31% next dollar, shares 25/35/30) and the `moved_value` explainer still match the model. Line 62's "new money counts in full" is the shared section text and is correct for the method generally. No stale wording about the removed rows.
