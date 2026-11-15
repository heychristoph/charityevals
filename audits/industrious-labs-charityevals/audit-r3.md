# Audit: industrious-labs-charityevals, round 3 (scoped verification of round 2's fixes)
Result: -0.01158 tco2e/$ = -0.002117 years of healthy life per 1,000 dollars (combined range -0.563 to -8e-6; own ranges with shared figures at best -0.0233 to +0.0015); cause median 0.00152 (×-1.39). Verdict: pass.
Model-sha: 73d8d695cbd7aa820296e657e35f317be87a6e08c20326fa5274e20d705d220f
Mechanical: audit-model 0 findings; check.ts all models valid; normalization-audit no violations (generated/ restored); simulation-check runs, not unstable (evidence_adj, the payer multiple and `capital_cost_factor` still move the result by more than 2×, which the write-up names).

Round 2 findings:
- #1 (NOx deaths without `evidence_adj`): fixed. `s46_health_uov` and `s53_health_uov` carry `evidence_adj`; the explainers of both and of `evidence_adj` say so. The write-up's cost paragraph agrees. Result -0.00088 → -0.00212.
- #2 (EPA counterfactuals repeated the advocacy share): fixed. `iis_` and `coke_counterfactual_adj` are 0.9 (0.7 to 1) as the market counterfactual, and the explainers send "would the rule come later" to the shared advocacy share and `$win_years_counted`.
- #3 (morbidity): fixed. `air_morbidity_share` 0.036 (0.02 to 0.08), `side_effect: added`, read in `uov_per_year` as ×(1 + share) on all three health rows. Slide values inherited from round 2 (the PDF's text could not be extracted here, see #1 below).
- #4 (US age mix): fixed. Shares recomputed from OWID's counts (568, 5, 1,275, 50-69 12,739 + 70+ 55,158 = 67,897 of 69,745): 0.008144, 0.000072, 0.018281, 0.973503, sum 1. `v_air_death` reads them; 43.74 uov a death. The other climate models read the world mix only in the tonnes' conversion (global deaths), so no other row needed the US mix.
- #5 (`capital_cost_factor` reference class): fixed in form. Harrington, Morgenstern & Nelson (2000) is cited, 1 (0.75 to 1.25). Source not reachable here (see #2).
- #6 (EPA's two cases): fixed. Checked against GAO B-336203: "$1.8 billion at a three percent discount rate", "$3.7 billion", "EAV of $200 million and $420 million" (3%). ÷ $12M = 16.7 and 35 deaths; the fact is 16 / 23 / 35.
- #7 to #11: fixed. Drivers and summary now match the rows (see below), the checked section covers round 2, the duplicate resources are gone (GAO and the REMI slides added), `program_spend` and `counterfactual_adj` wording is fixed, and the refrigerant factor applies to `s46_downstream * s46_total_adj` only.

Write-up claims at the defaults, recomputed from the row values (two-year sums, uov): Rule 1146.2 health 139.6 × 1.036 = 144.7, tonnes about +22, cost -218.5, net about -52 (about 70% of the net -74); costs are 1.31× its benefits ("about a third") ✓. Rule 1153.1 health 4.4, cost -32.8 (7.4×, "several times") ✓, net about -28. EPA steel +11.6 less -2.9 cost = +8.7 ("a little good") ✓; coke -3.0 ✓. Headline -0.002117 matches "-0.002". Sign flips: capital factor 0.75 → +0.0008 ✓; `evidence_adj` 1.1 → +0.0015 ✓.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `air_morbidity_share` | The quote "Morbidity-related benefits $0.7 $1.4 $0.7 $4.7" gives four values with no column headers, so a reader cannot tell that 1.4 is the 2037 figure (the mortality 39.1 is not in the quote). The slide PDF's text could not be extracted in this round; the numbers were verified in round 2. | Fact source block. | Quote the mortality and morbidity rows together with the year header, or say in the note which column is 2037. | none |
| 2 | low | source | `@compliance_costs.scaqmd_rule_1146_2_capital_cost_factor` | The Harrington et al. note (28 rules; total costs more often too high; unit costs about as often too high as too low) has no quote or page, and the Wiley page returned 403 here (unreachable). | Fact source block. | Add the abstract's sentence as `quote` and a free copy (RFF/NBER working paper) as a second URL. | none |
| 3 | low | double-counting | `uov_per_year` | `air_morbidity_share` multiplies `iis_health_uov` too, but those deaths come from EPA's total monetized benefits ÷ VSL, which already contain EPA's illness value ("nearly all from deaths"). | Fact note on `us_iron_steel_neshap_2024_deaths_per_year`. | Apply the morbidity factor to `s46_health_uov + s53_health_uov` only. | about +0.5% of the net harm |
| 4 | low | presentation | write-up "What drives the result" | The list of sign-fragile inputs still includes "Deaths per ton of NOx in the basin: 12 to 30", but the tornado shows the result negative across that range (-0.0043 to -0.0011). | Tornado. | Say it moves the size of the harm (about ×2), not its sign. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| @climate.us_iron_steel_neshap_2024_deaths_per_year | gao.gov/products/b-336203 | verified | quote and EAVs $200M / $420M (3%) present; 16 / 35 deaths follow at $12M |
| @death_ages.air_pollution_share_*_usa | ourworldindata.org (US 2023) | arithmetic verified | counts in the note give the four shares exactly and sum to 1; the chart's table view is not machine-readable, counts taken as stated |
| air_morbidity_share | REMI slides, slide 13 | not re-read | text extraction failed; verified in round 2 (#1 above) |
| @compliance_costs.scaqmd_rule_1146_2_capital_cost_factor | doi.org/10.1002/(SICI)1520-6688(200021)19:2<297 | unreachable | 403 (#2 above) |

Verdict: pass (no high or medium findings remain; 4 low).
Model-sha: 73d8d695cbd7aa820296e657e35f317be87a6e08c20326fa5274e20d705d220f
