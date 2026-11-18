# Audit round 7 (scoped verification): Drug Policy Alliance

Scope: follow-up to round 6 (fix needed). New judged input `od_centres_cost_per_year` ($3m, $1.5m to $6m), new negative row `od_compliance_uov` subtracted in `od_uov`; `can_attribution_share_shared` explainer reworded. Headline -0.00444 to -0.00456 (`headlines.ts` prints -0.00456349). `check.ts` passes; `npx vitest run src/engine/normalization.test.ts` passes (88 of 88, INV-22 included).

Checked:
- Finding 1 (centres' running costs not netted): fixed. `od_compliance_uov` = -cost x (1 + od_other_multiple) x $uov_per_ln_consumption / (@public_funds.compliance_cost_payer_multiple x @united_states.ce_expenditure_per_person_2024) x od_discounted_years / campaign_years x od_credit_adj. This is the 2.21 pattern (dollars over the payers' consumption on the log scale), as in the Earthjustice and EDF compliance rows, with US survey consumption.
- Chain and units: `od_value_per_year` = od_deaths_per_year x value x od_discounted_years / campaign_years, and `od_deaths_per_year` already carries (1 + od_other_multiple); the cost row uses the same years factor, the same /campaign_years and the same multiple, so benefit and cost are per year of spending over the same counted years. It uses `od_credit_adj` (counterfactual, attribution share, period, implementation, missing data) and not `od_evidence_adj`, as 2.21 says (evidence is about the benefit). It is not scaled by `ue_od_other`, correct (that is a benefit side effect). Subtracted inside `od_uov`, which feeds the total.
- Mobiliser's share: `od_credit_adj` holds `od_attribution_share` = `od_attribution_share_shared * mobiliser_share`, so the cost halves with the mobiliser's share like the benefit. INV-22 test passes.
- Anchor: I fetched the CBS News page. It says OnPoint operates with about $19 million in annual funding from city, state and private funds, the city's multi-year contracts about $17 million in total. The $19m figure is real. It covers all of OnPoint, so the $3m for the two rooms (about 16%) is a stated judgment; the source note and explainer say no source gives the rooms alone, and the range ($1.5m to $6m) is wide enough. Honest.
- Double count: the cost is the operator's spending, not DPA's `cost_total`; the old 5% share no longer stands in for it. Not cut twice.
- Finding 2 (anchor for can_attribution_share_shared): fixed, "about five named campaigning groups, the c4 among them, an equal split of 20%". Finding 3 (the 501(c)(4)): fixed, named among the campaigners and the cost note kept; governors and legislatures under the mobiliser's share.
- Text: no comparison with other charities, no "effective altruism"; explainers short.

Findings:
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | od_centres_cost_per_year | Source note says funds are "city, state and private"; the CBS article also says the city's contracts are about $17m of the $19m, so the city funds most of it. The rooms' share may be city-paid. No effect on the formula (cost is valued regardless of payer). | Optional: add "the city funds most of it" to the source note. |

Verdict: pass
Model-sha: 8f0cd3705bffacf35093909c69cd28562eececf2756575eed1aeabf5bb1f6952
Rules: 0.3.9

Re-stamped (17 Nov 2026): the round's low findings fixed in wording (and, for the rainforest model, rows no longer read removed and the branch weights kept free of the mobiliser's share); no value changed at a 100% mobiliser share.

Re-stamped (17 Nov 2026), rule mobiliser-share-30: typed results in the model's text made placeholders or recomputed at the 30% mobiliser share, and wrong prose placeholders corrected; no row changes. Mechanical: headline -0.004563 → -0.001369 (+70%), 26 rows changed, against bc9e3979.
