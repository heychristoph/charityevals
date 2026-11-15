# Audit: union-of-concerned-scientists-charityevals-climate, round 6 (verification of the restored compliance-cost bridge and the shared EPA 2024 rule years)
Result: 0.005202 t CO₂e/$ = 0.001350 years of healthy life per $1,000 (combined range 1.265e-5–0.1441); cause median 0.002189 (×0.62), against 0.001704 in round 5 (-21%; the round 5 figure predates the merges since). Verdict: pass.
Model-sha: 2ff49846a27470f07cfc3f61b7cecfa3907dd0c41eef7525b7a771c411ac29a3
Scope: scoped verification of commit e721b826: (1) the row `tco2e_from_uov` (numerator, label, explainer) and the summary and write-up figures; (2) the six rows pwr/veh first, last and win years now reading facts/climate.json. Programmes and sources of earlier rounds not re-audited.
Mechanical: audit-model exit 0, "Findings (0)" (lint and invariants clean).
Previous round: round 5 findings (no-op CPI term, Table ES-2 quote, summary wording) not re-examined here.

Verdict: pass (no high finding).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | "the won rules' compliance costs (about -12%)": measured on the model, the compliance costs move the result -10.8% (against the IRA-only bridge) or -11.2% (against no bridge); the IRA money is +3.5% of the no-bridge result ("about +3%" rounds low). | evaluated with `tco2e_from_uov` over `ira_transfer_uov_per_year` (0.005834) and over 0 (0.005638) against 0.005202 | Say "about -11%" and "about +3%" (or "+4%"). | none |
| 2 | low | presentation | write-up Summary | The `data-figure` fallback text reads 0.0017; the computed headline is 0.0014 (the EDF write-up's fallback was updated, this one was not). The "$190 per tonne" next to it is right (1/0.005202 = $192). | writeups/union-of-concerned-scientists-charityevals.md line 3 | Change the fallback to 0.0014. | none |

## Formula
`tco2e_from_uov = uov_counted_per_year / (bridge)`. `uov_counted_per_year = ira_transfer_uov_per_year + compliance_uov_per_year` (row formulas read), the bridge denominator is character for character the one the ira-only version used (diff of e721b826 shows only the numerator, label and explainer changed). At the defaults: ira_transfer_uov_per_year +10.1, compliance_uov_per_year -32.6 (pwr -31.5, veh +577, accii +381, capinv -1,056, divided by the period), counted -22.5 uov a year, so the bridge term is -43,285 t CO₂e (it was +19,486 with the IRA money alone). outcome_total 517,403 t (580,174 before). The result with the old numerator is 0.005834, so the fix moves it by ×0.892 (-10.8%) and the result by the same, as the summary's tonnes (0.0056 to 0.0052) say. Compliance enters once (the IRA row is a public-money branch with no compliance row), so no double count; sign is negative where the won rules cost more than they save. Label and explainer now say what the row carries.

## Summary and write-up figures against audit-model
Bottom line 0.005202 t/$ = 0.001350 years per $1,000. Summary: "0.0014" (right), "0.0052 tonnes" (right), "$190 a tonne" (right), "IRA money about +3%" (3.5%, finding 1), "compliance costs about -12%" (-11%, finding 1), "the act gives about half of the result" (IRA branch is 1.16M of 1.98M gross tonne-units before the bridge, 58%; loose but unchanged from round 5). Write-up: "about $190 per tonne" right, headline span computed, fallback stale (finding 2). No peer comparison in the text. Nothing else in the model changed in value.

## Shared years (INV-14), value-neutral
pwr_first_year 2028, pwr_last_year 2047, veh_first_year 2027, veh_last_year 2055, pwr_win_year 2024, veh_win_year 2024 now read `@climate.us_power_plant_rule_2024_first_year/_last_year/_final_year` and `@climate.us_light_medium_vehicle_rule_2024_first_year/_last_year/_final_year`. The facts hold 2028, 2047, 2027, 2055, 2024, 2024: every value is the one the rows had (checked in the diff of e721b826). Sources: EPA fact sheet (RIA, 1.38 billion t CO₂ avoided 2028 to 2047) for the power plant years; NACAA summary (EPA's model years 2027 and later, cumulative through 2055) for the vehicle years; both are the sources the rows carried. Minor: the vehicle fact's final-year source is the NACAA summary, whose note quotes EPA's 20 March 2024 release by URL, where the rows had cited the release itself for the date (low, no value effect); the power-plant first and last year quote reads "from 2028 to 2047" where the fact sheet is cited as "2028-2047" (wording of a quote, low).

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| us_power_plant_rule_2024_first_year/_last_year/_final_year | epa.gov fact sheet | verified earlier (round 5, 2028-2047) | value unchanged |
| us_light_medium_vehicle_rule_2024_first_year/_last_year/_final_year | 4cleanair.org NACAA summary | verified earlier (2027 to 2055, March 2024 final) | value unchanged |

## Drivers
Compliance costs now take about 11% off the tonnes: the cap-and-invest net cost (-1,056 uov a year at 4% attribution) against the vehicle and ACC II savings (+958 uov); unchanged judgments (payer multiple 1.2, taxes as transfers in ACC II).
