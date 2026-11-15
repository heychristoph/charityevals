# Audit: clean-air-task-force-charityevals, round 8 (verification of the compliance-cost rule 2.21)
Result: 0.01140 tco2e/$ = 0.005244 years of healthy life per 1,000 dollars (combined range 1.3e-4 to 0.2116); cause median 0.001704 (x3.08), against 0.006699 in round 7 (-22%). Verdict: pass.
Model-sha: 9c9d4613599f3a745c0ef7ecbd61afdfd37550af1e415f0811367fbc7265d34d
Scope: scoped verification of the changed rows: eumr_compliance_uov, usmeth_compliance_uov, pwr_compliance_uov, compliance_uov_per_year, the new `bridges` section and tco2e_from_uov, outcome_total, the summary and the write-up's headline figure; the compliance facts and payer multiple read. Unchanged rows not re-audited.
Mechanical: audit-model.ts exit 0, 0 findings (lint, invariants; the new section and bridge pass INV-2b and INV-10); normalization-audit and check.ts not re-run (scoped round).
Previous round: round 7's findings are not touched by this change; not re-checked.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | writeups/clean-air-task-force-charityevals.md, "How the model works" (the paragraph on the wins being added up) | The write-up's description of the chain does not mention the new step: the won rules' compliance costs are subtracted (about a fifth of the result). | headline 0.0067 to 0.0052 is explained nowhere in the text | Add one clause: "less the three rules' compliance costs (EPA's and the Commission's own figures), about a fifth" | none |
| 2 | low | units | pwr_compliance_uov | EPA's power-plant cost is a yearly equivalent over 2024-2047 but is counted over the benefits' years 2028-2047 (waited 4 years), under-counting the rule's cost by roughly a fifth; the row is -61 of -1,397 uov. | RIA Table ES-2; pwr_first_year 2028 | Optional: scale by 24 / 20 or note it in the explainer | under 1% |
| 3 | low | source | us_power_plant_rule_2024_cost_per_year (fact) | Quote is from EPA's fact sheet, not from the RIA at the given url; RIA Table ES-2 has the figure (Final Rules 2%: PV 19, EAV 0.98, 2019 dollars). | RIA PDF p. 20 | Quote the table row | none |

## Checked
- Formulas as in the Environmental Defense Fund model (same text; same fact reads): negative sign; dollar years EU 2018, US methane 2019, power plant 2019, each to @cpi.usa_2024; US consumption 2024 for the US rules, UK 2024 for the EU rule; per-branch chain cost x downstream / tonnes_per_year x counterfactual (0.5, 0.8, 0.8) x attribution (0.2, 0.1, 0.1) x delivered share (0.6, 0.4, 0.05) x missing data (0.5), no evidence_adj. Recomputed: eumr -589 uov, usmeth -747, pwr -61; /4 = -349 uov a year; bridge gives -379,636 t/yr; outcome_total 1,368,810 t/yr (tonnes x (1 + 0.3 + eor -0.01 + nuclear -0.002) + bridge: the bridge is not scaled by the unmodelled-benefits and side-effect shares).
- Branches without a row: the carbon-capture credit (public money, 2.20's), ADVANCE Act and fusion framework (support, not rules): stated in the explainer. Nothing counted twice; benefits are gross tonnes.
- New section `bridges` (kind ours) sits before `outcome`; tco2e_from_uov is in t CO2e / year with the shared bridge form, reading no climate slider except through the same conversion denominator; its input here is compliance_uov_per_year alone (no household money in this model).
- Summary: "about 0.015 tonnes ... $68 a tonne" is the tonnes alone (gross 1.748M vs net 1.369M t/yr: 0.0114 x 1.277 = 0.0146); "about a fifth" matches -21.7%; 0.0052 matches; "nearly all of it from the two methane rules" holds (methane tonnes about 1.44M gross, 1.08M net of their compliance costs, of 1.37M, more with methane's higher value per tonne). No peer comparison in the text (the x3.08 over the cause median is under 10x, so INV-15 does not apply).
- Write-up figure span 0.0052 matches the headline.
- Payer multiple: see round 10 of environmental-defense-fund-charityevals (judgment 1.2, 0.8 to 2, reasoned and ranged).

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| us_oil_gas_methane_rule_net_cost_per_year | epa.gov RIA 2060-AV16, Table 1-6 | verified | Net Compliance Costs $19,000 PV, $1,500 EAV (million 2019$, 2%); gross 2,400 less product recovery 980 |
| us_power_plant_rule_2024_cost_per_year | epa.gov utilities RIA, Table ES-2 | verified (finding 3) | EAV 0.98 billion 2019 dollars at 2%, 0.65 at 7% (the range's low end) |
| eu_methane_regulation_imports_cost_per_tco2e | parlament.gv.at SWD(2021) 459, Table A.5.6 | verified | 2,607 million US$ (2018) of net abatement costs for 25,513 kt methane = $3.65 a tonne at GWP 28 |

## Drivers
Of the changed rows: the EU rule's $3.65 a tonne (1 to 10, the largest single compliance term here: -589 uov, as the import-measure cost is a proxy the impact assessment did not itself cost), the US methane rule's $1.5B, and the payer multiple. The EU proxy is the weakest figure (the IA costed the cost-effective cuts in eight exporters, not the regulation's import limit); its range 1 to 10 covers it.
Re-stamped (15 Nov 2026): merged with the one-consumption-scale and no-comparison changes; compliance-cost rows (2.21) now on the survey scale (2.14); headline moves under 2×.
Re-stamped (15 Nov 2026): value-neutral: the EPA 2024 rules' estimate and final years now read shared facts in facts/climate.json (INV-14), same values
