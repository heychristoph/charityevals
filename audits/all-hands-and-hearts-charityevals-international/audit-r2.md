# Audit: all-hands-and-hearts-charityevals-international, round 2
Result: 8.657e-5 daly/$ = 0.0866 years of healthy life per 1,000 dollars (combined range 0.0147-0.509); cause median 0.0754 (x1.15). Verdict: pass (no high findings).
Model-sha: b012d64d7bfeb0e6e61041e1423fc379eaab7f64da8534063f48d28913d96c52
Scope: unchanged from round 1 (year to 31 August 2025; Myanmar relief, Nepal, Philippines and Mexico school work; Afghanistan and Gaza now stated as after the year in the summary). The split with the US model is unchanged (same shared `intl_spend_share`).
Mechanical: lint 0 high / 0 medium / 0 low ("Findings (0)"), invariants none, normalization-audit none naming this model (INV-4 reports one violation in another model), check.ts "all models valid", simulation stable (5% / 50% / 95% = 0.34 / 1 / 3.0 x best guess). generated/ restored with `git checkout -- generated`.
Previous round: #1 (high) resolved: `baseline_consumption` = `@myanmar.gdp_per_capita_2024 * mmr_consumption_share_of_gdp * @survey_consumption.survey_to_na_world_median * rel_affected_share` (0.7 x 0.68 x 0.8 = 0.38, about $517 a year), the shared ratio now moves the model (it is in the tornado) and `rel_consumption_vs_gdp` is gone; the 0.7 (0.55-0.8) matches American Red Cross international's row of the same id. #2 (medium) resolved: the write-up's international figure is a live `data-figure` span. #3 resolved: `sch_cost_npl` is a `judgment`, explainer says it is our division of the campaign goal. #4 (rel_people overlap, wording only) not applied; still minor, see below. #5 (age mix) kept as a judgment, stated in the rows; deaths are about 3% of value, accepted. #6 resolved: explainer says the row is the template's canonical row kept for reading. #7 resolved: `sch_attribution_share` 0.7 (0.45-0.9) with the reason (paid local masons; US work 0.52). #8 resolved: the summary says Afghanistan and Gaza began after the year. Beneficiaries (MMR 0.78, NPL 0.12, PHL 0.08, MEX 0.02) match in the model and scripts/beneficiary-countries.ts; they sum to 1.00 and agree with the new result (Myanmar about three-quarters, as the summary and write-up say).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | rel_people | Round 1's wording point is still open: the 13K+ reach is from a report published after the year end while cost is to 31 August 2025. The low end of 9,000 covers it. | AR 2025 p. 19; round 1 #4 | Add one clause to the `rel_people` explainer that the count may include weeks after the year and the 9,000 low covers it. | none |
| 2 | low | normalization | share_under5, share_5_14_of_over5, share_15_49_of_over15 | Age mix is judged, not WHO GHE shares; kept on purpose and stated. Deaths are about 3% of value. | round 1 #5 | none required; take WHO GHE Myanmar shares if a shared `death_ages` fact is added. | under 1% |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| mmr_consumption_share_of_gdp | World Bank NE.CON.PRVT.ZS, Bangladesh | not re-fetched | The same judgment and anchor as the American Red Cross international model (checked in round 1 there); range 0.55-0.8 is the model's own judgment, both ends sensible. |
| @survey_consumption.survey_to_na_world_median | shared fact | read only | Names Myanmar in its explainer. |
| sch_cost_npl | https://allhandsandhearts.org/our-work/programs/nepal-flood-relief | verified as a basis (round 1 fetch) | $5 million for 20 schools is the stated goal; the row now says the division is ours. |
| Other rows | as round 1 | verified in round 1, unchanged | Annual report and accounts figures were not edited in 95fed69. |

## Drivers
1. `missing_data_discount` (shared slider, 0.5): thin branches, correct under Convention 12.
2. `uov_per_daly` (shared slider).
3. `value_delivered_per_person` ($40, 15-100, judgment; American Red Cross's $70 as the reference class): the Myanmar relief is about 78% of the result. Better: the partners' budgets per person.
4. `intl_spend_share` (shared judgment, 18%, 10-30%): moves the result in proportion.
5. `rel_counterfactual_adj`, `rel_attribution_share`, and now the split baseline (`rel_affected_share`, shared survey ratio, `mmr_consumption_share_of_gdp`): each a smaller, visible judgment or shared fact.

Plausibility: 0.0866 against the cause median 0.0754 and American Red Cross international 0.073; no gap needs a reason. The result moved less than 1% from round 1 (0.0863 to 0.0866), as the fixes (Myanmar baseline 0.40 x GDP per capita to 0.38, schools' credit 0.8 to 0.7) offset. Verdict: pass.
