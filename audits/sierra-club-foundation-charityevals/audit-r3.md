# Audit: sierra-club-foundation-charityevals, round 3 (verification of the compliance-cost rule 2.21)
Result: 0.01589 t CO₂e/$ = 0.005929 years of healthy life per $1,000 (combined range 2.149e-4–0.1636); cause median 0.001704 (×3.48). Verdict: pass.
Model-sha: a7712ddba0d24ba13b0f47e00ba40b339a85fe4ff400dc90507e3cd0efd8a65b
Rules: 0.2.0
Scope: scoped verification of the changed rows (usmeth/pwr/veh/accii_compliance_uov, compliance_uov_per_year, the `bridges` section's tco2e_from_uov, outcome_total, summary, write-up figure). Programmes and year as in earlier rounds, not re-audited.
Mechanical: lint 0 high / 0 medium / 0 low (audit-model exit 0, "Findings (0)"), invariants none, normalization-audit not re-run (changed rows only)
Previous round: earlier findings not re-examined in this scoped round.

Verdict: pass (no high finding).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | us_power_plant_rule_2024_cost_per_year (facts/compliance_costs.json) | The quoted sentence "$270 billion in climate benefits; $120 billion in health benefits; and $19 billion in compliance costs" was not found verbatim in the RIA PDF text I extracted. The numbers themselves are in the RIA's Table ES-2 (final rules: PV 19, EAV 0.98, billions of 2019 dollars at 2%; 3%: 15 / 0.91; 7%: 7.5 / 0.65; SAGE social cost $1.51 billion a year). | RIA text: "Final Rules 270 14 120 6.3 19 0.98 370 20" | Replace the quote with the Table ES-2 row, or cite the EPA page that carries the sentence. | none |
| 2 | low | source | ca_advanced_clean_cars_ii_net_cost_per_year | The fuel-tax share of the gasoline price removed as a transfer ("about a quarter, $54 billion") is a judgment with no cited price breakdown. Federal plus California excise taxes are roughly 20% of a $4 gallon. | Appendix F p. 14-22: costs $210.35B, savings $303.24B, net saving $92.9B (2020 dollars), registration and sales tax $15.2B | Cite the CDTFA and IRS per-gallon excise rates against CARB's gasoline price; the range (a saving of $6.2B to a cost of $1B a year) already covers 20%. | under 1% of result |

No finding on the formulas. Checks:
- Sign: each row is `-cost × …`; the vehicle and ACC II rows come out positive (net savings), methane and power negative. Values at defaults: usmeth -283, pwr -41, veh +301, accii +119 uov; compliance_uov_per_year +32 uov, which is +43,100 t CO₂e through the bridge (1.8% of outcome_total 2.37 million).
- Dollar year: usmeth and pwr 2019 → `@cpi.usa_2019`, veh 2022 → `@cpi.usa_2022`, accii 2020 → `@cpi.usa_2020`, all moved to `@cpi.usa_2024`; each matches the fact's stated year (RIA Table 1-6 "million 2019$", 89 FR Table 8 "billions of 2022 dollars", FSOR App. F "2020 dollars").
- Consumption: `@united_states.consumption_per_person_2024` = 58,517, US, right for US payers. `$uov_per_ln_consumption` (1.4427) / (1.2 × 58,517).
- Branch adjustments are each branch's own (counterfactual, attribution_share, implementation_adj, missing_data_adj), evidence_adj left out as the rule says. Timing: `<b>_downstream / <b>_tonnes_per_year` = p_success × discounted years, the same as the benefits; summed and divided by `period_years` as outcome_total is.
- No double counting: the model's benefits are tonnes and deaths only, with no fuel, maintenance or bill savings anywhere else (`unmodelled_benefits_adj` is deaths-side shares of other climate wins and does not scale the bridge term, which is added outside it). The methane net figure already nets recovered gas ($1.5B net of $2.4B gross); the power figure is the system's capital, O&M, fuel and storage cost, so fuel is netted; taxes and allowances are left out in ACC II and the vehicle rule is pre-tax.
- Bridge `tco2e_from_uov` is identical to EDF's and to UCS's (same conversion), with input `compliance_uov_per_year`; the conversion reads the model's own methane_share, air_pollution_weight and extra_deaths rows, all defined.
- Coal retirements: the explainer says no regulator's analysis gives a cost; accepted.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| us_oil_gas_methane_rule_net_cost_per_year | epa.gov ... oil-and-gas-nsps-eg-climate-review ria | verified | Table 1-6 (PDF p. 24): net compliance costs 2% EAV $1,500M, compliance $2,400M, product recovery $980M, 2019$, 2024-2038 |
| us_power_plant_rule_2024_cost_per_year | epa.gov ... utilities_ria_final_111_2024-04.pdf | verified (numbers); quote see #1 | PV 19, EAV 0.98 (2%), 0.65 at 7%, SAGE $1.51B; costs 2024-2047 |
| us_light_medium_vehicle_rule_2024_net_cost_per_year | govinfo.gov 2024-06214.pdf | verified | Table 8 AV 2%: technology 40, insurance 1.5, repair -1.8, maintenance -14, fuel -46, EVSE 9: sum -11.3; quote on p. 19 present |
| ca_advanced_clean_cars_ii_net_cost_per_year | ww2.arb.ca.gov ... fsorappf.pdf | verified | "-$81.8 billion to -92.9 billion (2020 dollars)"; costs $210.35B, savings $303.24B; undiscounted 2026-2040, ÷15 = $6.2B |
| public_funds.compliance_cost_payer_multiple | (judgment) | reasoned and ranged | 3/4 on consumers at 1, 1/4 on owners at 2.5: harmonic mean 1/(0.75+0.1) = 1.18 ≈ 1.2; range 0.8-2, anchored on the corporate-tax multiple; lognormal |

## Drivers
Compliance costs move the result +1.8%. Larger inputs are unchanged: win_years_counted, missing_data_discount, deaths_per_tco2e, discount_rate, next-dollar figure. The new row's own judgments: the payer multiple (1.2, ranged) and the taxes-as-transfers share in ACC II; the vehicle rule's net saving rests on EPA's modelled fuel and maintenance savings (range in the fact: a saving of $25B to a cost of $5B).

Text: the summary's 0.0059 and "the vehicle rules a net saving to buyers" match the computed result (0.005929); it makes no peer comparison. Write-up figure 0.0059 matches.
Re-stamped (15 Nov 2026): merged with the one-consumption-scale and no-comparison changes; compliance-cost rows (2.21) now on the survey scale (2.14); headline moves under 2×.
Re-stamped (15 Nov 2026): value-neutral: the EPA 2024 rules' estimate and final years now read shared facts in facts/climate.json (INV-14), same values
Re-stamped (15 Nov 2026): damage beyond deaths at EPA's 0.6 in the tco2e bridge copy, read through the side-effects weight (2.5, 2.16; mechanical); summary figure updated where it changed

Re-stamped (16 Nov 2026): EPA methane rule and Advanced Clean Cars II dates read the shared facts (climate.us_oil_gas_methane_rule_*_year, climate.ca_advanced_clean_cars_ii_*_year); same values. Mechanical: headline unchanged, against 1a9667aa.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 8904b83b.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7224423b.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against ca214e5f.
