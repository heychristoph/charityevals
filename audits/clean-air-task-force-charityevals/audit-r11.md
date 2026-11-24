# Audit: clean-air-task-force-charityevals, round 11 (scoped verification of rule 2.23 and the 15 Nov fix-ups)
Result: 0.005801 tco2e/$ = 0.003461 years of healthy life per 1,000 dollars (summary and write-up say 0.0035; round 10 plus the non-death change 0.0062). Verdict: pass.
Model-sha: c827585096d13124f75007f51d415cc2969b173fcfd928e7e5f318491c1cd9b1
Rules: 0.3.13
Scope: ccs_evidence_adj, ccs_total_adj, ccs_implementation_adj; nuc_pathway_first_year, nuc_pathway_last_year, nuc_middle_year, nuc_pathway_counted_share and their use in nuc_downstream, fus_downstream, nuc_extra_power_cost_uov; us_power_twh_2023, us_fossil_power_twh_2023, nuc_fossil_share, pcge_rate_position, nuc_premium_usd_per_mwh; public_payer_uov_per_dollar, ccs_public_usd_per_year, ccs_public_cost_uov, compliance_uov_per_year, tco2e_from_uov (side-effect form); summary and write-up headline. Nothing else re-audited.
Mechanical: audit-model.ts 0 findings (warnings only); check.ts "all models valid". Conversion-section rows (methane_share, fuel_share, fuel_smoke_factor) read no shared assumption (INV-2b clean).

Checks:
- 45Q: ccs_total_adj = 1 × 0.9 × 0.03 × 0.95 × 0.5 = 0.012825 (reads ccs_evidence_adj, not evidence_adj); the shared tonnes already carry the evidence cut, as in the fact's note. No second cut remains.
- Pathway: middle year = 2023.5 + 15 + 2.5 = 2041; share = (2041 - 2030) / 20 = 0.55. Applied to nuclear and fusion tonnes and to nuclear's cost row (same share, same years, so tonnes and cost stay matched).
- Fossil share: displaced intensity = grid × 0.7; fossil intensity = grid × 4178 / 2505; ratio = 0.7 × 0.5996 = 0.4197. Formula correct. Premium = 6.64 $/MWh (2018) at 4%: 0.42 × (5.33 + 19.59 × 0.25) + 0.58 × (14.83 + 16.87 × 0.25 - 15) = 4.28 + 2.36; clamped rate position 0.25; uncertainty term 0 added once. Clean-share gap net of wind/solar system cost is the right sign and base year.
- Public money: 60 Mt × $85 = $5.1B a year; × 3.78e-5 uov/$ (mcpf 1.2 × uov per ln / (1.4 × US expenditure per person)) × 0.3 × 4.116 × 0.012825 = -3,052 uov. Per-unit money takes every adjustment of the tonnes, same years, wait and chance as ccs_downstream: correct per 2.23. Added to the compliance row and into tco2e_from_uov; label and explainer say so. Bridge formula reads `1 + $side_effect_weight × ratio`, matching the unit's conversion.
- Result sentence: 0.0035 in summary, write-up, and computed value. No comparison with other charities.

| # | Severity | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|
| 1 | low | fus_downstream | Fusion is read at nuclear's pathway share (0.55) although fus_scale_vs_nuc is already "its first decades"; the build stage is a judgment carried from nuclear. Stated in the explainer. | fus_downstream formula; explainer of fus_scale_vs_nuc | Optional: name this as a judgment in the explainer. | Fusion is about 1% of tonnes: negligible. |
| 2 | low | methane_share, fuel_share | Conversion weights use nuclear's full-level expected tonnes (not x 0.55), so nuclear is overweighted in the smoke weights. Unavoidable (INV-2b) and already stated in nuc_tonnes_per_year and fuel_share explainers. | explainers | None. | Smoke factor tiny; negligible. |
| 3 | low | nuc_fossil_share | Uses the 2023 fossil share (60%) for the 2040s; the counterfactual factor carries the cleaner-grid view, consistently with the tonnes side. | explainer | None. | None. |

## Sources checked
- EIA FAQ 427 (fetched): total 4,178 billion kWh; fossil fuels 2,505, 60.0%. Matches us_power_twh_2023 and us_fossil_power_twh_2023.
- DOE Advanced Nuclear liftoff article (fetched): "if new nuclear deployment starts by 2030", "the U.S. could deploy an additional 200 GW by 2050". Matches both year rows.
- facts/climate.json q45_credit_usd_per_tco2 ($17 x 5 = $85, 26 USC 45Q) read; not refetched. IEA/NEA clean-premium and system-cost facts read (inputs from round 10 checks).

Findings: 0 high, 0 medium, 3 low. Verdict: pass.

Re-stamped (16 Nov 2026): EPA methane rule and Advanced Clean Cars II dates read the shared facts (climate.us_oil_gas_methane_rule_*_year, climate.ca_advanced_clean_cars_ii_*_year); same values. Mechanical: headline unchanged, against 1a9667aa.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 8904b83b.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7224423b.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against ca214e5f.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
