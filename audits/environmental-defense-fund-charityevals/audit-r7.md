Result: 0.004508 tco2e/$ = 0.001967 years of healthy life per 1,000 dollars, against 0.001898 in round 6. Verdict: pass.
Scope: scoped verification of the round 6 low: the EPA oil and gas methane rule's own dates (usmeth_win_year, usmeth_years_until_avoided, usmeth_discounted_years, read by usmeth_downstream), the years_until_avoided explainer, and the headline against summary and write-up. Unchanged rows not re-audited.
Mechanical: audit-model.ts 0 findings (warnings as before: wide range, judgment share); check.ts all valid.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No findings. | - | - | - |

## Checked
- usmeth_win_year 2023, kind observed, source the EPA RIA for the final rule (title page, signed 2 December 2023), retrieved date and note present. usmeth_first_year is 2024 (EPA release: cuts "from 2024 to 2038"), so usmeth_years_until_avoided = 2024 - 2023 = 1.
- usmeth_discounted_years = years_pv * (1 + $discount_rate) ^ -usmeth_years_until_avoided: same form as the power-plant, vehicle and EU Methane Regulation rows. usmeth_downstream now reads it; the wait is applied once.
- years_until_avoided explainer ("used by the wins without compliance dates of their own (the Inflation Reduction Act); the rules use their own dates"): the only remaining reader of the shared discounted_years is ira_downstream (line 950). The EPA methane, power-plant, vehicle and EU rules all read their own discounted years. The explainer is now correct.
- Headline: 0.001967 = 0.0020 and 0.004508 = 0.0045 tonnes per dollar (about $222 a tonne, "about $220"). The summary says 0.0045, $220 and 0.0020; the write-up says 0.0020 and $220. All agree. The rise from 0.001898 (+3.6%) matches a 3-year wait shortened to 1 for the largest slice.
- Source for the new year fact not re-fetched; the signing date is the one cited in the EPA release already checked in earlier rounds.

## Findings settled
Round 6's low (usmeth_downstream on the shared wait): fixed, closed. No open findings.

## Sources checked
None re-fetched this round.

Verdict: **pass**
Model-sha: 654ef04911f9da6d0d69d60f5208a7f684b18a542e05f6d43d76386b584facbe
