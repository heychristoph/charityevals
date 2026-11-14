# Audit: doctors-without-borders-charityevals-advocacy, round 1 (verification)
Result: 1.304e-4 uov/$ = 0.0652 years of healthy life per 1,000 dollars (combined range 0.00692–0.614); cause median 0.1042 (×0.63). Verdict: fix needed (one medium, wording).
Scope: only the working-tree change: awareness-raising's `aw_aid_vs_cash` (own judgment 1×, 0.5–2 → formula `@aid_value.humanitarian_vs_cash`, 0.2, 0.05–0.8), facts/aid_value.json (new), docs/normalization.md section 2.20, and the write-up's shares, drivers, combined range and headline figure. Earlier rounds (described in the write-up, no files in audits/) not re-audited.
Mechanical: audit-model lint 0 high / 0 medium / 0 low (findings: 0; warns on the 10^6 spread and judgment share only); check.ts "all models valid"; invariants none; normalization-audit not run (0 violations per the caller).

Checks:
- Fact derivation recomputed (script: scratchpad/aidvalue/audit-msf/recompute.ts, `headline` with `missing_data_discount` = 1 on every model with template humanitarian-relief and owner charityevals, /1000 × `$uov_per_daly` (2) / 0.00335): 17 models, min 0.049, median 0.206, max 0.837. Matches the fact's "0.05–0.84, median 0.21"; 0.2 (0.05–0.8) is a fair rounding of the best and ends. Source note and explainer say the same. Verified.
- Rule (2.20) applied correctly: the extra appeal money MSF's coverage brings goes to whatever crises are funded, so its use is unknown and the fallback figure applies; the branch applies its own `aw_missing_data_adj` (0.5) once, as the fact's explainer says (the fact is taken before the step), so no double discount. MSF Access's buyers' savings stay at GiveWell's Global Fund and government figures (`@givewell_shared.cf_value_*`), a known use; DNDi is in DALYs through the bridge. `aw_value_per_dollar` = 0.2 × `@cash.uov_per_dollar` = 0.00067. Row reads a fact, no literal left. The moved-money rows are the standard shared ones and not touched.
- Write-up numbers: branch shares computed from `acc_value_per_year*acc_total_adj`, `aw_value_per_year*aw_total_adj`, `uov_from_daly`: 0.890 / 0.039 / 0.071 = 89 / 4 / 7%. Matches. Headline 0.06519 = 0.065 (summary figure and `data-figure` fallback). Tornado (audit-model): missing data 0.013–0.130, win years 0.020–0.184, MSF's attribution share 0.030–0.123, next dollar 0.033–0.114, counterfactual 0.030–0.100: the write-up's drivers (0.013 to 0.13, 0.02 to 0.18, 0.03 to 0.12, 0.03 to 0.11, 0.03 to 0.10) match and are in the order of the tornado. Combined range 0.00692–0.614 = "0.007 to 0.61". Matches. Awareness paragraph's "a fifth of cash to the very poor, what its relief models do per dollar" matches the fact. The 2.20 section's "0.075 → 0.065" matches.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | summary; write-up "Why it is so low" | Both say the result is "under a tenth" of the site's median health charity. audit-model's cause median is 0.1042 (71 global-health models); this model is 0.065 = ×0.63 (it was ×0.72 at 0.075), so the claim is untrue, and the change makes it a little further off, not closer. Pre-existing, but stale with the number. | audit-model: "median of 71 global-health models: 0.1042 (this model ×0.6255)" | Replace "under a tenth of" with "below" (summary: "The result is below the site's health median, by about a third: …"; write-up: "Below the site's median health charity (about 0.6×): …"), keep the reasons that follow. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| aid_value.humanitarian_vs_cash | (the site's own relief models) | verified | recomputed, see above |
| aid_value.oda_vs_cash | cega.berkeley.edu (not used by this model) | not checked | not on this model's path |

## Drivers
Missing-data slider (shared), years a won reform counts (shared), MSF's attribution share of the price campaigns (judgment, 0.1–0.5), next dollar's share of the average (shared estimate), counterfactual share of the cuts (judgment). The change moved only the awareness branch (4% of the result), so the result moved 0.075 → 0.065 mainly by that branch shrinking to a fifth.

Verdict: fail
