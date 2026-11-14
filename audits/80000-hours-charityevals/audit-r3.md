# Audit: 80000-hours-charityevals, round 3
Result: 0.002136 uov/$ = 1.068 years of healthy life per 1,000 dollars (combined range 0.055–20.6); cause median 0.958 (catastrophic-risk, 7 models; ×1.1). Verdict: **pass** (no high findings).
Model-sha: 8754d91041859687e3e3a2cef32094a725294b8cf5c26bec7468778e1ca8b930
Scope: unchanged from round 2: one chain for all six programmes (the accounts give no split), 2012–2022 past average (2,000 estimated plan changes, $18.77M in 2025 prices less half of 2022 for the lag), next dollar at 36%; charities/80000-hours.json matches 2025 spending ($10,958,343).
Mechanical: lint 0/0/0 (audit-model: 0 findings), invariants none, normalization-audit no violations (generated/ restored), check.ts valid, simulation stable (5%–95% at 0.145–5.9× the best guess).
Previous round:
1. Cause split vs its anchor: resolved. AI 90% (80–95) = 88% + half of the 4% balance; bio/nuclear 6% (3–10), global health 2% (0.5–4), animals 0.5% (0.2–1), the rest 1.5% at the weighted average: the non-AI total is 10%, matching 8% + half of 4%. The "most of the 8%" wording now fits (6% of 10%). Result 2.03 → 1.07.
2. Biosecurity/nuclear reads NTI and Johns Hopkins at equal weights: resolved (formula, explainer, write-up all say so).
3. Report lag: resolved. report_lag_share 0.5 is explained as a ~six-month average lag in both explainers; "a year on average" is gone.
4. Summary and write-up state the shares and that most value comes from careers outside AI: resolved.
5. Earning-to-give removed from careers_side_benefits (counted once, in the main chain): resolved; the write-up says the same.
6. Staff share 50% (40–65%): resolved. I re-added the FTE column of the financial-accounts table: 0.7+2.8+2.6+3.8+5.2+6.7+8.9+11.8+13.8+14.5+20.7 = 91.5; $18.77M / 91.5 = $205k per staff-year; 2025 budget staff $4.71M of $10.43M. Quote "2022 6.66 4.72 20.7" is on the page (spending, income, FTE).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | staff_cost_share | The "$100,000 of pay and on-costs per staff-year" that turns $205k per FTE into 50% is an unsourced assumption inside an "estimate" row. The page's FTE count also includes staff hours allocated by the parent group, which the cost side includes too, so the ratio is consistent. | Explainer text; page note on the FTE column. | Mark the row `judgment` (it is one, with the FTE ratio as its anchor), or cite a UK EA-organisation pay figure. | 0 at defaults; only with `$resource_shares` on |
| 2 | low | presentation | write-up, "Where the people go" / drivers | "the tenth of careers outside AI" and "mostly AI" are fine, but the drivers section does not say that bio/nuclear alone carries a large part of the value (bio 6% of careers, about 50% of the value in scratch runs round 2). The tornado shows it moves the result only 0.85–1.34 across its range, so this is context, not an error. | audit-model tornado. | Optionally add "biosecurity and nuclear careers carry about half of it" to the drivers bullet. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| staff_cost_share, spend rows | https://80000hours.org/about/credibility/evaluations/financial-accounts/ | verified | FTE column 2012–2022 sums to 91.5; 2025 budget staff 4.71 of 10.43; spending column as in round 2. |
| `@meta.eighty_k_career_share_*` | https://80000hours.org/2026/07/why-were-increasing-the-ai-focus-of-our-job-board/ | verified in round 2 (88/4/8, roles kept); the shares now follow from it | not re-fetched. |
| plan_changes_2012_2022, careers_side_benefits, next dollar, CBPC definition | donate page, 2023–mid-2025 review, Q3–Q4 2025 update, 2021–2022 review | verified in round 2 / round 1 | unchanged since; EA Forum 429, Companies House PDFs scanned, not re-checked per brief. |

## Drivers
1. `$missing_data_discount` (shared slider, applied in this model and again inside the destination models): moves the result 0.09–3.6.
2. `$discount_rate`, `$win_years_counted` and `ai_catastrophe_chance` (shared, through the destination models).
3. `@meta.career_forgone_pay_default` and `@meta.career_years_stayed_default` (shared judgments; 80,000 Hours publishes no pay or retention survey).
4. `@next_dollar.eighty_thousand_hours` (estimate, 15–75%) and `plan_changes_2012_2022` (80,000 Hours' own extrapolation, 604–3,000).
5. The cause split (judgment, now anchored); advising-call topic data would improve it most.
