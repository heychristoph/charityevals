# Audit: environmental-defense-fund-charityevals, round 11 (verification of the restored compliance-cost bridge and the shared EPA 2024 rule years)
Result: 0.003094 tco2e/$ = 0.001369 years of healthy life per 1,000 dollars (combined range see audit-model); cause median 0.002189 (x0.63), against 0.001695 in round 10 (-19%). Verdict: fail until the INV-4 waiver in finding 1 is added (no finding on the model's values).
Model-sha: 855918696a940f1fbcd5d0b77702134acea0ed42e5a934d4f99cc8a6c286d471
Scope: scoped verification of commit e721b826: (1) the row `tco2e_from_uov` (numerator, label, explainer) and the summary and write-up figures; (2) the six rows pwr/veh first, last and win years now reading facts/climate.json. Programmes and sources of earlier rounds not re-audited.
Mechanical: audit-model exit 1, two HIGH INV-4 findings (finding 1), nothing else.
Previous round: round 10 not re-examined.

Verdict: fail on finding 1 only (a false positive of the invariant that needs a recorded waiver); formula and figures pass.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | high (mechanical) | invariant | usmeth_first_year | INV-4 flags the methane rule's first year, 2024, as a literal copy of `@climate.us_power_plant_rule_2024_final_year` and `@climate.us_light_medium_vehicle_rule_2024_final_year` (both 2024, new in e721b826). A false positive: 2024 is the first year of EPA's methane tonnes (EPA 2023 release, "58 million tons of methane emissions from 2024 to 2038"), a different quantity that shares the year. The same two flags now appear in clean-air-task-force-charityevals and earthjustice-charityevals (same row). | audit-model Findings (2) | Add to src/engine/normalization-waivers.json under INV-4, for each of the three models, "<model-id> usmeth_first_year = @climate.us_power_plant_rule_2024_final_year" and "... = @climate.us_light_medium_vehicle_rule_2024_final_year": "First year of EPA's methane-rule tonnes (2024 to 2038); the fact is the year another rule was final, a different quantity that happens to share 2024." | none |
| 2 | low | presentation | write-up, What drives the result | "the Inflation Reduction Act's tonnes about 10% and the money it won for households about 5%" does not match the model: of the gross tonnes the IRA branch is 24%, US methane 46%, EU 22%, MethaneSAT 3%, power-plant and vehicle rules 5% (branch downstream x total_adj, before the bridge); the IRA money is +0.7% of the no-bridge result. The summary's "under 1%" is right; "about four-fifths from the two methane rules" is 68% of the gross tonnes (and 97% of the net result, since compliance costs take 31% off). | evaluated rows: eumr 2.09M, usmeth 4.47M, pwr 0.13M, veh 0.34M, ira 2.32M, msat 0.28M | Restate the drivers from the model (methane rules about two-thirds of the tonnes, the Act's tonnes a quarter, the money it won under 1%) and the summary's "about four-fifths" as "about two-thirds". | none |

## Formula
`tco2e_from_uov = uov_counted_per_year / (bridge)`, `uov_counted_per_year = ira_transfer_uov_per_year + compliance_uov_per_year`; the denominator is unchanged from the ira-only version (diff shows numerator, label, explainer only). At the defaults: ira_transfer_uov_per_year +20.2, compliance_uov_per_year -868.2 (eumr -525, usmeth -3,612 over the period divided out, pwr -105, veh +769 per the rows), counted -848.0 uov a year, bridge term -957,748 t CO₂e (+22,851 with the IRA money alone); outcome_total 2,173,604 t (3,154,203 with the old numerator). The result with the old numerator is 0.004489, so the fix moves it by ×0.689 (-31%), the same as the write-up's "about a third off" and the summary's "about a third off". Compliance enters once (the IRA row has none); sign is negative where costs exceed savings. The previous round's -18% payer-multiple change is the same cost rows, now reaching the result again.

## Summary and write-up figures against audit-model
Bottom line 0.003094 t/$ = 0.001369 years per $1,000. Summary: "0.0031 tonnes" right, "$320 a tonne" right (1/0.003094 = $323), "under 1%" right (0.7%), "about a third off" right (31%), "0.0014" right. Write-up: headline fallback 0.0014 right, "$320 a tonne of CO₂e" right; the duplicated stale paragraph is gone, the one left is the correct one; "health and nature work about 0.0012" is a span computed by the site. No peer comparison. Drivers paragraph: finding 2.

## Shared years (INV-14), value-neutral
pwr_first_year 2028, pwr_last_year 2047, veh_first_year 2027, veh_last_year 2055, pwr_win_year 2024, veh_win_year 2024 now read the shared facts `us_power_plant_rule_2024_first_year/_last_year/_final_year` and `us_light_medium_vehicle_rule_2024_first_year/_last_year/_final_year`; the facts hold 2028, 2047, 2027, 2055, 2024, 2024, the values the rows had (diff of e721b826). Sources: EPA fact sheet (RIA 2028 to 2047) and NACAA summary (through 2055), the rows' own earlier sources. Low: the vehicle fact's final-year note cites the NACAA summary and quotes EPA's 20 March 2024 release by URL where the rows had cited the release; the power-plant first/last quote reads "from 2028 to 2047" for a fact sheet cited as "2028-2047".

## Sources checked
No new source; the six year facts as above, unchanged in value.

## Drivers
The two methane rules (US rule's net cost -3,612 uov a year inside the compliance bridge, the largest) and the shared attribution and delivered-share steps; compliance costs now take 31% off, as in round 10's design.
