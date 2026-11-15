# Audit: union-of-concerned-scientists-charityevals-climate, round 5 (verification of the compliance-cost rule 2.21)
Result: 0.006566 t CO₂e/$ = 0.001704 years of healthy life per $1,000 (combined range 4.387e-5–0.06621); cause median 0.001995 (×0.85). Verdict: pass.
Model-sha: 3d21309a1b46ea8e121ca733b26cf2d3d0d8facc0b5e3c7796f70cdac466c5e4
Scope: scoped verification of the changed rows (pwr/veh/accii/capinv_compliance_uov, compliance_uov_per_year, uov_counted_per_year, tco2e_from_uov, summary, write-up figure). Programmes and year as in earlier rounds, not re-audited.
Mechanical: lint 0 high / 0 medium / 0 low (audit-model exit 0, "Findings (0)"), invariants none, normalization-audit not re-run (changed rows only)
Previous round: earlier findings not re-examined in this scoped round.

Verdict: pass (no high finding).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | capinv_compliance_uov | The formula has a no-op term `@cpi.usa_2024 / @cpi.usa_2024` and the explainer says "2024 dollars moved to 2024's". | formula and explainer | Drop the term and the phrase "moved to 2024's". | none |
| 2 | low | source | us_power_plant_rule_2024_cost_per_year | Quoted sentence not found verbatim in the RIA text; the numbers are in Table ES-2 (PV 19, EAV 0.98 at 2%, 2019 dollars). | RIA text "Final Rules 270 14 120 6.3 19 0.98 370 20" | Quote the Table ES-2 row instead. | none |
| 3 | low | presentation | summary | "a dollar given averts about 0.0056 tonnes (about $180 a tonne)" is the tonnes alone; the model's total including the bridge is 0.00657 t/$. Wording is consistent with "and the public money ... adds about a fifth", but the compliance costs (net -18 uov a year, -35,000 t CO₂e) are now netted inside that bridge term. | audit-model bottom line 0.006566 | Optionally say "the household money net of the rules' compliance costs adds about a sixth" (bridge 92,300 of 652,990 t = 14%, gross IRA 127,400 = 19.5%). | none |

No finding on the formulas. Checks:
- Sign and values at defaults (uov a year): pwr -17.6, veh +322.6, accii +212.9, capinv -590.8; compliance_uov_per_year -18.2; with ira_transfer_uov_per_year +66.1, uov_counted_per_year +47.9, giving 92,302 t CO₂e through the bridge (IRA alone would be about 127,400). Net effect on the result: 0.001796 → 0.001704 (-5.1%), as stated.
- Dollar years: pwr 2019, veh 2022, accii 2020, capinv 2024, each against its fact; all to `@cpi.usa_2024`. Consumption `@united_states.consumption_per_person_2024` = 58,517, multiple 1.2.
- Branch adjustments are each branch's own (counterfactual, attribution_share, implementation_adj, missing_data_adj; no evidence_adj). Timing: downstream / tonnes_per_year = p_success × discounted years; `compliance_uov_per_year` divides by `period_years` as ira_transfer_uov_per_year does.
- Double counting: the IRA row is the household's gain less taxpayers' cost, a public-money branch, so no compliance-cost row for it (explainer says so); the rules' benefits are tonnes and deaths only. The vehicle rule's savings are pre-tax fuel savings, so adding them is not a transfer. Cap-and-invest is net of allowance transfers ($13.1B).
- Bridge `uov_counted_per_year` = IRA money + compliance, entering `tco2e_from_uov` once.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| us_power_plant_rule_2024_cost_per_year | epa.gov utilities RIA | verified (numbers) | see #2 |
| us_light_medium_vehicle_rule_2024_net_cost_per_year | govinfo.gov 89 FR 27842 | verified | Table 8 AV 2%: 40 + 1.5 + 9 - 1.8 - 14 - 46 = -11.3 (2022$); quote p. 19 present |
| ca_advanced_clean_cars_ii_net_cost_per_year | arb.ca.gov fsorappf.pdf | verified | net saving $92.9B (2020$) 2026-2040; taxes removed by judgment ($15.2B tax and fee, $54B fuel tax share, about a quarter of the gasoline price, unsourced: low) |
| ca_cap_and_invest_2025_net_cost_per_year | arb.ca.gov cap_invest/nc_isor.pdf | verified | Table 26: direct costs $123.8B, cost savings $57.8B, 2027-2046, 2024$; Table 30: transfers $13.1B, costs less transfers $110.8B: net $53.0B, $2.65B a year |
| public_funds.compliance_cost_payer_multiple | (judgment) | reasoned and ranged | harmonic mean of 3/4 at 1 and 1/4 at 2.5 = 1.18; 0.8-2 |

## Drivers
Compliance costs move the result -5.1%, driven by the cap-and-invest cost (-591 uov, 4% attribution) against the vehicle and ACC II savings (+535 uov). The cap-and-invest net cost is ARB's own analysis, but the high end ($4.5B) is a judgment from the earlier SRIA. The payer multiple and the taxes-as-transfers share in ACC II are the judgments.

Text: summary and write-up (0.0017) match the computed result; no peer comparison in the summary.
