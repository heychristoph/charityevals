# Audit: international-rescue-committee-charityevals-resettlement, round 4

Result: 8.484e-6 daly/$ = 0.00848 years of healthy life per $1,000 (combined range 0.00168-0.0430). Verdict: **pass** (no findings above low; none open).
Model-sha: ae0b3fcd18123bb545327864f7892cc15e477b48de668fe13aab150898a979de

Scope: scoped verification of the round-3 fixes only (`git diff eab604a 135055d`).

Mechanical: `audit-model.ts` bottom line 8.484e-6 daly/$ (0.0085), combined range 0.001675-0.04297, matching the summary's "about 0.008 (combined range 0.002-0.04)"; its one low lint (far below a tenth of the median) is explained by the summary and still matches the rows; `scripts/check.ts` "all models valid"; `simulation-check` stable (5% 0.432x, 50% 1x, 95% 2.35x best guess). generated/ restored.

Previous round (1 medium, 2 low):
- 1 (Kossoudji & Cobb-Clark DOI and figure): resolved. The resource URL is now https://doi.org/10.1086/339611 (the Crossref-confirmed DOI from round 3). The publisher page returns 403, but the RePEc listing and citing documents (found by search) give the abstract's figures: a wage benefit of legalisation under IRCA of about 6% and a wage penalty for being unauthorised of 14-24%. The explainer of `legal_undocumented_ln_gap` quotes both, and the 0.15 (0.05-0.35) judgment sits between them (ln 0.15 = 16%).
- 2 (docket figure, AIC): the docket figure is resolved: `legal_removal_share` now cites ICE's 271,484 FY2024 removals and the CRS's estimated 1.6 million with final orders on the non-detained docket (February 2026). I fetched https://www.everycrsreport.com/reports/IF13208.html: it says the non-detained docket includes "an estimated 1.6 million with final orders of removal", as of 26 February 2026 (report dated 24 April 2026), and gives no FY2024 removals count, which the resource list attributes to ICE's annual report instead (271,484 verified in round 3 via reports of that document). The CRS report is added to resources. The AIC page was not re-fetched (403 in round 3; the explainer's use of it is unchanged and the value is a judgment).
- 3 (reunification's counterfactual twice): resolved. `wellbys_bridged` = (`people_reached` x `wellbys_per_person` + `reunif_wellbys` / `svc_counterfactual_adj`) x `svc_total_adj`; `svc_total_adj` contains `svc_counterfactual_adj` as a factor (0.3-0.8, never zero), so it cancels for the reunification term and the services' term is unchanged. The explainer says so. Result 0.00847 to 0.00848 (+0.1%), as expected for a row of about 1%.

No new findings.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `legal_removal_share` | https://www.everycrsreport.com/reports/IF13208.html | verified | 1.6 million with final orders, February 2026; no removals figure on the page. |
| `legal_removal_share` | ICE FY2024 annual report | 271,484 verified (round 3, secondary) | Unchanged. |
| `legal_undocumented_ln_gap` | https://doi.org/10.1086/339611 | DOI correct (Crossref, round 3); abstract figures 6% and 14-24% confirmed via RePEc and citing documents (publisher 403) | Figures match the explainer. |
| `legal_defence_gap` AIC | americanimmigrationcouncil.org | not re-fetched | Judgment, unchanged. |

## Drivers
Unchanged: shared sliders (`missing_data_discount`, `uov_per_daly`, `uov_per_ln_consumption`), then judgments `legal_ln_gain_per_year`, `svc_counterfactual_adj`, `recipients_consumption_share`, `legal_years`, `legal_defence_share`, `legal_defence_gap`.

Verdict: **pass** (no high or medium findings; the round-3 medium and both lows resolved).
Model-sha: ae0b3fcd18123bb545327864f7892cc15e477b48de668fe13aab150898a979de
