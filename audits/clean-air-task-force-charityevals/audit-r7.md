# Audit: clean-air-task-force-charityevals, round 7 (scoped verification)
Result: 0.01456 tco2e/$ = 0.006699 years of healthy life per 1,000 dollars (combined range 2.496e-4 to 0.1798 tco2e/$); cause median 0.001672 (x4.0). Verdict: pass.
Scope: replacement of the slider voc_health_share (+1%) by extra_deaths_per_tco2e = methane_share * usmeth share of methane tonnes * voc_deaths_per_year / usmeth_tonnes_per_year, with voc_deaths_per_year reading @climate.us_oil_gas_methane_rule_voc_deaths_per_year.
Mechanical: audit-model 0 findings; normalization-audit no violation for this model; simulation-check stable.
Previous round: the first r7 high (INV-10: row not tied to methane_share) is resolved by the rewrite through methane_share; value unchanged (0.006699).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## What was checked
1. Formula and units: deaths/year over t CO2e/year = deaths per tonne of the US rule; times its share of the methane tonnes and methane_share = deaths per average tonne, valued at air-pollution ages by the conversion.
2. No double count: methane_share's ozone is methane's own; the new figure is EPA's local VOC ozone. voc_health_share has no reader left; outcome_total keeps eor_oil_share and nuclear_harm_share only.
3. Shared fact: 56 / 65 / 74 deaths a year, EPA RIA 2023 Tables 3-8 and 3-9 (unchanged source, verified round 5).
4. Result 0.006691 to 0.006699 (+0.12%), plausible against about 65 deaths a year and the rule's roughly 30% share of the tonnes.

## Sources checked
Shared fact citation unchanged from the removed row; not re-fetched.

## Drivers
Unchanged from round 6.

Verdict: pass
Model-sha: 4b5e1f558bec45f48307b55b0d03c980880fb4a2c5bc37ea7fdc22e20036a8a2
