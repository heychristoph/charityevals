# Audit: international-refugee-assistance-project-charityevals-advocacy, round 2
Result: 2.317e-4 daly/$ = 0.232 years of healthy life per 1,000 dollars (combined range 0.027-2.03); cause median 0.102 (x2.3). Verdict: pass
Model-sha: b84c45a2c21f3043a6391b955bb1823f706a6666918e2a9dd1dcef73c747bc08
Mechanical: audit-model lint 0 high/medium (one low: spread, which the summary states); check.ts all models valid; normalization-audit 0 violations (INV-4 false positive gone); simulation-check stable (5% 0.248x, median 1x, 95% 4.06x).
Previous round: all 11 findings settled (below).

| # | Severity | Category | Row | Finding | Fix |
|---|---|---|---|---|---|
| 1 | low | sourcing | `usrap_p_success` | Round-1 finding 6 is settled in substance (anchored on the April-May 2021 ceiling reversal, 15,000 to 62,500) but the row carries no dated source for that episode. | Add a source (a dated news report or the White House determination of May 2021) to the row. |
| 2 | low | sourcing | `usrap_counterfactual_adj` | The explainer cites "about 2 million refugees in need of resettlement a year against a little over 100,000 departures" with no source or year. | Cite the UNHCR Projected Global Resettlement Needs report (year) beside the figure. |
| 3 | low | sourcing | `siv_p_success` | The explainer states "a revised plan June 2025", which neither the CRS report in the model nor any fact in the model supports. | Cite the source for the June 2025 revision, or drop the clause. |
| 4 | low | spread | model's own ranges | The model's own ranges span about 1,700x; the summary says so. | None needed; narrow the widest ranges where a source allows. |

## Round-1 findings
1 SIV period (high): settled. `siv_p_success` credits only the period's defence and revision, 0.2 (0.08-0.5); explainer dates the plan to 14 June 2020 and the pause after the withdrawal.
2 missing-data (high): settled. Pacito and USRAP at `$missing_data_discount`, reasons rewritten to the judged value of a move; the summary names all three branches.
3 `usrap_counterfactual_adj` (medium): settled, 0.85 (0.7-1), a different question from `usrap_p_success`.
4 `siv_counterfactual_adj` (medium): settled, formula 1 with the Convention 5 explainer.
5 INV-4 false positive (medium): settled; normalization-audit shows no violation after the fact was relabelled, no waiver.
6 `usrap_p_success` reference class (medium): settled with the April-May 2021 episode (source citation is low finding 1).
7 `ue_remittances_hosts` (low): settled, added and summed into `unmodelled_benefits_adj`, tagged `side_effect`.
8 `siv_people_per_year` (low): settled, an estimate, 20,000 (27,318) 45,000, Table 3 cited.
9 `years_until_effect` explainer (low): settled.
10 Summary (low): settled; "a little over twice the median" and "about three times the legal-services model" match the live x2.3 and 0.232/0.071; the "mostly uncertainty" sentence is there.
11 Write-up (low): settled; missing-data bullet and checked line fixed; headline figures 0.23 and 0.07 match the live results.

## New rows
`ue_remittances_hosts` (-5% to +10%, judgment, same as the sibling) and the reweighted beneficiaries (AFG 0.383 ... sum 1.000) are consistent with the branch shares (SIV 27%, USRAP 70%, Pacito 3%). No double counting or unit problems found in the changed rows. Result moved 0.274 to 0.232 (-15%), explained by findings 1, 2, 3 and 7.

## Drivers
`$missing_data_discount`, `usrap_p_success`, `usrap_attribution_share`, `$uov_per_daly`, `$win_years_counted`: all shared sliders or judgments with anchors.
