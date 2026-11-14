# Audit: electoral-reform-society-charityevals, round 3 (verification round)
Result: 4.912e-5 daly/$ = 0.0491 years of healthy life per 1,000 dollars, unchanged from round 2. Verdict: pass.
Model-sha: af3e830f2521b8c50bc8f919e3608a3cd7f7fed42c4caa01463c4bb29650f40d
Scope: scoped verification of the five low findings of round 2 against `git diff 68396fe 22eb2aa` (model, facts/united_kingdom.json, write-up). Nothing else in the diff changed: the only changed model fields are the summary and the explainers or notes of spend_2021_gbp, window_years, v16_p_win and reg_gain_share; no inputs or formulas.
Mechanical: lint not re-run (text-only diff); audit-model.ts: 0.04912 per $1,000, 0 findings.
Previous round:
1. Automatic registration wording: resolved. Summary, write-up and `reg_gain_share` now say pilots of automated registration; the explainer ends "for the rollout the pilots lead to and the other rules".
2. england_mayoral_coverage_2028 note: resolved. It names the six areas with correct years (Cheshire and Warrington, Cumbria May 2027; Greater Essex, Norfolk and Suffolk, Hampshire and the Solent, Sussex and Brighton May 2028) and about 9 million people. See finding 1 (low) for a small arithmetic wording slip.
3. spend_2021_gbp discrepancy: resolved (fallback route). The note states the £100,000 excess and that the audited accounts are not on the Society's site. See finding 2 (low) on the stated effect.
4. window_years: resolved. The explainer says the cost is always the ten-year average and the range is how typical the decade's wins are.
5. v16_p_win stage: resolved. The explainer adds the Commons stages finished in September 2026 (bill trackers) and the bill's presence in the Lords; 90% kept. The September date is attributed to trackers, not verified on bills.parliament.uk here; it does not move the number.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | @united_kingdom.england_mayoral_coverage_2028 | The note says the six areas "add about 15 points" to today's 51.5%, which gives about 66.5%, while the best value is 0.65 (13.5 points). 9 million of 58.6 million is 15 points; 51.5 + 15 = 66.5. | Note text in the diff. | Say "about 14 to 15 points (best 65%, a little under the sum, since not every area's mayor is certain by 2028)", or "about 66%" and keep 0.65 as a rounding down. | 0 |
| 2 | low | presentation | spend_2021_gbp | The note says the higher figure "would lower the decade's average by about 1%". A higher 2021 spend raises the average spending (0.865 to about 0.870, +0.5%) and so lowers the result by about 0.5%. The direction and size are mis-stated. | Recomputed: 2021 ratio 0.850 to about 0.899, one year in ten, mean +0.005. | Reword: "would raise the decade's average spending by about 0.5% and lower the result by as much, well inside spend_missing_years_vs_2024_25's range (0.7 to 1.0)". | 0 |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| @united_kingdom.england_mayoral_coverage_2028 | https://www.gov.uk/government/publications/annual-report-on-english-devolution-2024-to-2025/secretary-of-states-annual-report-on-english-devolution-2024-25 | verified in round 2 | Unchanged quote; note's area list matches the round-2 sources (LabourList, Institute for Government). |
| v16_p_win | bills.parliament.uk/bills/4080 | not re-fetched | Stage text relies on trackers, as flagged in the explainer. |

## Drivers
Unchanged from round 2: the chance and share of proportional representation (judgments), whether a voting method changes governance at all, the next-dollar room, and the supplementary-vote share. The most useful improvement would be the 2021 audited accounts and the bill's official stage.
