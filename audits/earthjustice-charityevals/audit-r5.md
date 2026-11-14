# Audit: earthjustice-charityevals, round 5 (verification of the coal rows' pointer explainers)
Result: 0.00549 tco2e/$ = 0.00240925 years of healthy life per 1,000 dollars (combined range 0.0000976-0.0595); cause median 0.001672 (x1.44). Verdict: pass.
Model-sha: 054033553ce07014ea3491b39af9240c3bfa71305e0d06acf641dd54ea733960
Scope: scoped verification of the explainers of the nine shared US coal rows; unchanged rows not re-audited.
Mechanical: audit-model.ts 0 findings (two info/warn notes on judgment share, as before); check.ts all models valid; normalization-audit: no violation for this model (INV-10 lists two violations, both for clean-air-task-force-charityevals and environmental-defense-fund-charityevals, not this model); summaries and simulation-check: stable (5% 0.175, 50% 1, 95% 4.39 x best guess).
Previous round: the round-4 low (stale explainer copies of coal_twh_per_gw_year, coal_advocacy_share, coal_years_until_avoided) resolved: all nine are now a one-line pointer.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Checks
- Pointers name the right fact: `coal_gw_2022_2023` -> climate.us_coal_retired_gw_2022_2023; `coal_gw_2024` -> ..._2024; `coal_gw_2025` -> ..._2025; `coal_twh_per_gw_year` -> us_retiring_coal_twh_per_gw_year; `coal_tco2_per_mwh` -> us_coal_tco2_per_mwh; `coal_replacement_tco2_per_mwh` -> us_coal_replacement_tco2_per_mwh; `coal_advocacy_share` -> us_coal_retirement_advocacy_share; `coal_years_until_avoided` -> us_coal_retirement_years_until_avoided; `coal_implementation_adj` -> us_coal_retirement_stay_closed_share. Each id matches the row's own formula and exists once in facts/climate.json.
- Nothing else changed: the diff of models/climate/earthjustice-charityevals.json is nine `explainer` lines only (9 insertions, 9 deletions); no formula, value, range, kind or label touched. Headline 0.00240925 and 0.005490 t/$ unchanged.
- VOC deaths: `voc_deaths_per_year` has formula `@climate.us_oil_gas_methane_rule_voc_deaths_per_year` and feeds `voc_deaths_per_tonne`; already reads the shared fact.

## Sources checked
None needed: no value changed; the facts' sources were checked in rounds 3-4.

## Drivers
Unchanged from round 3.
