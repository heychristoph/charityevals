# Audit: environmental-defense-fund-charityevals, round 2 (verification)
Result: 0.004391 tco2e/$ = 0.001862 years of healthy life per 1,000 dollars (combined range 7.5e-5–0.046). Verdict: pass.
Model-sha: 9e5989241cf6fc653a9e7d50d2e1e7219bfab779db2ea1e0b5be24383f6bc887
Scope: scoped verification of the changed rows against round 1's ten findings (audit-r1.md); unchanged rows not re-audited.
Mechanical: audit-model.ts: 0 findings; the summary and write-up (0.0019 per $1,000, about $230 a tonne = 1/0.004391) match the result.
Previous round: round 1 (pass, 10 findings: 2 medium, 8 low). All ten settled.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | double-counting | ira_tonnes_per_year | The 45Q subtraction mixes bases: the IRA fact (900 Mt) is REPEAT's projection, undelivered, while `climate.ira_45q_capture_tco2_per_year` best 60 Mt is already a delivery-adjusted judgment (a third of REPEAT's 185 Mt increment). EDF's `ira_implementation_adj` (35%) then applies to the rest, so about 125 Mt a year of 45Q's projected-but-undelivered tonnes stay in EDF's branch (about 15% of its tonnes) and CATF's own delivered share also credits them. Overlap is small and in the conservative direction for CATF only. | facts/climate.json both rows; CATF's model reads only the 45Q fact. | Subtract the projection's 185 Mt increment (the fact's high end, or a separate point fact "45Q capture per REPEAT") rather than the judged 60 Mt; or note the basis in the explainer. | about −0.3% of the total (IRA branch is about 10% of value) |

## Findings settled
1. IRA branch: present and well formed. `ira_tco2e_per_year_2030` is a shared judgment fact (600 Mt / 900 Mt / 1.1 Gt, REPEAT with a stated reading, range spanning Energy Innovation and Rhodium, `kind` and source note complete); the branch has tonnes, p_success, discounted years, counterfactual 80%, attribution 2% (0.5-5%), implementation 35% (15-60%, REPEAT and Carbon Brief sourced), total_adj, expected tonnes in `fuel_share` and `fuel_smoke_factor` at `@climate.us_power_smoke_factor`. Only CATF and this model read the 45Q fact; CATF counts 45Q as its own win and EDF takes it out, so the credit is not counted twice (apart from finding 1 above). The IRA's vehicle and power provisions overlap slightly the 2024 EPA rules' tonnes, as REPEAT's baseline excludes those rules only partly; not material. `unmodelled_benefits_adj` 30% (10-80%) and its explainer drop the IRA tonnes and keep only the repealed methane fee.
2. `eumr_attribution_share_shared`: cites EDF Europe's July 2024 release; the "key support" quote is gone; 15% (5-30%) kept.
3. Farm methane removed from the unmodelled list, with a pointer to the health-nature model's farm branch.
4. `cost_per_period_year = cost_total * average_spend_vs_year + msat_writeoff_per_year`: no overhead on the write-off.
5. `average_spend_vs_year` uses FY2023 and FY2024 shares (rows climate_2023 etc., sourced from the FY2023 and FY2025 statements with the quotes of round 1: 125,531,444 and 94,210,677), FY2022 at FY2025's. Formula is right.
6. `us_oil_gas_methane_rule_tco2e_2024_2038` = 1.568e9 = 58e6 × 0.90718 × 29.8, derivation in the explainer; CATF's +1.5% is stated in the write-up.
7. `msat_implementation_adj` = 1 and out of the effective chain (kept as a unit row); `msat_total_adj` has no evidence step; the overlap with the methane rules is named in `msat_counterfactual_adj`.
8. `usmeth_attribution_share_shared` URL is the live EDF release address (not refetched this round; the path is the one round 1 named).
9. `veh_implementation_adj`: the Federal Register citation is gone; the note now matches the Jones Day page.
10. `veh_smoke_factor` 0.04 (0.02-0.1), anchored on EPA's 2,500 deaths in 2055.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| ira_tco2e_per_year_2030 | zenodo REPEAT | not refetched | stated as the builder's reading, consistent with REPEAT's headline (about 42% vs 27% below 2005) |
| ira_implementation_adj | carbonbrief | not refetched | note limited to the 3% figure |
| climate_2023, climate_2024 | as round 1 | verified in round 1 | quotes unchanged |
