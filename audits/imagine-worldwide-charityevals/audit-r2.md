# Audit: imagine-worldwide-charityevals, round 2 (scoped to the changes since round 1)
Result: 0.004626 uov/$ = 2.313 years of healthy life per 1,000 dollars (combined range 0.17-32.1); cause median 0.0740 (x31). Verdict: pass.
Model-sha: 12d1a4be2d47d10a8a2c4b21c4aabad3ab0b3afcb493b322096001b7c3745835
Scope: unchanged from round 1 (one programme, 2024 Form 990 programme expenses; all in cost_total). Only commit 4423e385's rows and text were checked.
Mechanical: audit-model 0 high, 2 medium (far-above, spread: 3,787x); no invariant violated. check.ts: valid. Generated/ unchanged.
Previous round: round 1 (pass). Finding 4 (spread from the education rows, waiting for the shared fact) is accepted as open by design; the model's own spread rose from 2,346x to 3,787x because rct_learning_gain_sd (0.12-0.40) and evidence_adj (0.4-0.9) got wider ranges. It falls when the two education rows move to the shared fact.

## Round 1 findings: status
| # | Status | Check |
|---|---|---|
| 1 | fixed | rct_learning_gain_sd 0.25 (0.12-0.40); explainer and write-up now say TZ-Host ran after school, that BEFIT sessions replace lessons, and name the Malawi school-day trials (56 h, 101 h) and BEFIT's 36 h a year. "Same time, displaced lessons netted out" is gone. |
| 2 | fixed | evidence_adj 0.7 (0.4-0.9) covers trust in small, charity-run trials only; its explainer hands scale to mw_implementation_adj. No scale clause remains. |
| 3 | fixed | mw_children = befit_y1_learners 270,000 x 0.65 + befit_y2_learners 575,000 x 0.25 = 319,250 child-years (round 1's estimate: about 316,000). Quotes verified below. The 369,360 count is kept in the explainer as children reached. |
| 4 | open by design | see above |
| 5 | fixed | program_expenses explainer cites the IRS e-file (TEOS XML, EIN 82-0990106) read with scripts/irs-990.py; not re-run here (low). |
| 6 | fixed | write-up: "three to five 30- to 35-minute sessions a week". |
| 7, 8 | fixed | mw_missing_data_adj names both the Tanzanian effect and the Malawi school-day bounds; oth_missing_data_adj explains the 4,303 Dzaleka and Tanzania children kept in the thin branch (94% figure: 61,599 of 65,252 = 94.4%, rounds to 94%). |
| 9 | fixed | attribution_share_shared 0.84 with the co-funded countries named (AR p. 12 partner lists). |
| 10 | fixed | clause removed from leverage_funging_adj. |
| 11 | fixed | edu_persistence cites Bailey et al. only. |
| 12 | partly fixed | tablets_in_service_2023 is now a range 80,000 (80,000-88,000); see finding 1 below. |
| 13 | fixed | launch-cost note in program_spend explainer; no published split, cost kept. |

## Findings (this round)
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | units | tablets_in_service_2023 | The explainer's arithmetic does not give its high end: earlier pilots with 6,534 children in 2022 at about five children a tablet are about 1,300 tablets, not "up to 8,000". 88,000 is still a fair upper bound given AR p. 23's cumulative "100k+", but the stated reason is wrong. | explainer; AR p. 23 | Either say the high end of 88,000 allows for more pilot tablets than the 2022 count implies (cumulative "100k+" less 2024 purchases), or set the high to about 82,000. | 0 to -1% |

## Checks of the changed rows
- Beneficiaries: at the defaults, Malawi branch outcome = 319,250 x 0.7 x 1 = 223,475; other branch = 65,252 x 0.55 x 0.5 = 17,944 (oth_missing 0.5 implied by missing_data_adj 0.9151); total 241,419. Shares: Malawi BEFIT 92.57%, other 7.43%; with Dzaleka's 3,653 children's 0.4% inside MWI: MWI 0.930, SLE 0.0494, LBR 0.0067, SEN 0.0060, GHA 0.0037, BFA 0.0035, TZA 0.0007, sum 1.0000. Matches both scripts/beneficiary-countries.ts and the model's `beneficiaries`; the note's 92.6% matches.
- Quotes, 2024 Annual Report (the PDF was fetched and its text read; page numbers follow the report's own layout): the p. 11 key-highlights sentence reads "In Malawi, Year 1 of the BEFIT tablet program (2023/24) rolled out on time and under budget, serving 500 schools and over 270,000 learners and training nearly 7,000 educators" (the new row's quote matches; p. 14 repeats it); the p. 12 footnote reads "* Year 2 of BEFIT program ends Q2 2025, serving 960 schools and 575,000 students total" (matches); "MALAWI 369,360 students served, 681 schools*" matches. Partner lists for Counterpart, CRS, USDA McGovern-Dole (Senegal, Burkina Faso) and Rising Academy (Liberia, Ghana) match p. 12.
- Year-share judgments: y1 0.65 (0.60-0.70) matches Jan-July of a Sept-July school year in three terms (2 of 3 terms is 0.67); y2 0.25 (0.15-0.33) is consistent with 681 of 960 schools running and one term, about 0.24. Both are ranged judgments with explainers.
- Double counting: scale is now only in mw_implementation_adj/oth_implementation_adj; effect setting gap only in rct_learning_gain_sd; evidence_adj covers trial quality only. The 0.25 SD and 0.7 evidence_adj were not both reduced for the same reason.
- Write-up numbers agree with the model (2.3, 0.25, about 319,000).
- Summary text updated to 2.3.

Mechanical detail: audit-model "far-above" (31x the cause median) stands on the round 1 reasoning (about $53 a child-year cost; trial-based effect); no new cause.

Findings by severity: high 0, medium 0, low 1.

Verdict: pass (no high findings).
Model-sha: 12d1a4be2d47d10a8a2c4b21c4aabad3ab0b3afcb493b322096001b7c3745835
