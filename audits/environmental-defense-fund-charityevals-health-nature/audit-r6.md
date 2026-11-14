# Audit: environmental-defense-fund-charityevals-health-nature, round 6 (verification)
Result: 1.880e-6 daly/$ = 0.0019 years of healthy life per 1,000 dollars (combined range 1.1e-4 to 0.032); cause median 0.0018 (x1.02). Verdict: pass.
Scope: scoped verification of the round-5 fixes: lead-pipe illness rows, summary and write-up figure, and the sources of three shared soot facts. Unchanged rows not re-audited.
Mechanical: audit-model.ts 0 findings; check.ts all models valid; simulation-check.ts stable (5% 0.213, 95% 4.3 x best guess); summaries.ts started (slow, finished or not, its output is not used); normalization-audit not run (caller runs it); `git checkout -- generated` done.
Previous round: low 1 (lead-pipe illness missing) resolved. Low 2 (counterfactual source url) resolved.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No findings. | - | - | none |

Checks:
- lcri_illness_dalys = lcri deaths x 2.54 DALYs/death (same shared facts as soot, 0.14 / 0.055) x p_success x lcri_years (the branch's own discounted wait and years); lcri_dalys_raw = lcri_uov / uov_per_daly + illness, one unit for the weighted averages; dalys_direct adds lcri_illness_dalys x lcri_credit, then the model-wide leverage and unmodelled factors apply as for every branch. Illness is DALYs only, deaths and IQ stay in units of value: no double counting. Result moves 0.00180 to 0.00188 (+4.7%), as predicted.
- Summary and write-up both read 0.0019 for health and nature, matching the model (0.001880).

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| us_pm_naaqs_2024_counterfactual | RIA (epa.gov .../naaqs_pm_reconsideration_ria_final.pdf), PDF p. 25 | verified | Text reads "control strategies in 2032 after implementing existing and expected regulations and ... to meet the current annual and 24-hour ... NAAQS (12/35 µg/m3)"; the quote spans line breaks only. |
| us_pm_naaqs_2024_years_until_effect | same RIA, PDF p. 26 | verified | Late 2025 designations, Moderate areas attain late 2032. The CAA 188(c) note (sixth calendar year after designation for Moderate, tenth for Serious) is statute text I did not re-fetch; it matches the statute as I know it and the explainer's 2034 reasoning. |
| us_pm_naaqs_2024_evidence | same RIA, p. 288 (PDF p. 311) | verified | "there is a causal relationship between mortality and both long-term and short-term exposure to PM2.5" found on PDF page 311. |

## Drivers
Unchanged from round 5.

Verdict: pass
Model-sha: 59ed4e4fe28659656a0258b2b00645c4ae53093d98d18129ea83a7cccf4e71f4
