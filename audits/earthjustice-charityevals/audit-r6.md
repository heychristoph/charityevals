# Audit: earthjustice-charityevals, round 6 (verification of the compliance-cost rule 2.21)
Result: 0.004546 tco2e/$ = 0.001995 years of healthy life per 1,000 dollars (cause median 0.001704, x1.17), against 0.002409 in round 5 (-17%). Verdict: pass.
Model-sha: 1afdd5452b66a644e8a0874b9689c2db9d24847a55aff755c51600adedbf7118
Scope: scoped verification of the changed rows: usmeth_compliance_uov, pwr_compliance_uov, compliance_uov_per_year, the new `bridges` section and tco2e_from_uov, outcome_total, the summary and the write-up's figures (this model's and the health model's headline spans). Unchanged rows not re-audited.
Mechanical: audit-model.ts exit 0, 0 findings (lint, invariants); normalization-audit and check.ts not re-run (scoped round).
Previous round: not re-checked beyond the changed rows.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | "about half from the methane rule and half from the coal closings" no longer fits the result net of the rules' compliance costs: on the tonnes (before methane's higher value per tonne) the rule gives about 36% (0.50M tonnes a year gross, 0.33M net of its cost) and the coal closings about 60% (0.55M) of the 0.90M net; the power-plant rule about 4%. Counting methane's higher value per tonne brings the methane rule back toward 45%. | usmeth 1.322M t over 4 years x 1.5 = 0.496M, compliance -597.6 uov = -0.17M t a year; coal 1.452M x 1.5 / 4 = 0.545M | Write "somewhat less than half from the methane rule and more than half from the coal closings" or "about 40% ... and 55%" after recomputing with the value weights | none |
| 2 | low | presentation | writeups/earthjustice-charityevals.md, bullet "Climate and clean energy" | Headline 0.0020 is now net of compliance costs but the bullet still says "about $180 a tonne of CO2e averted" (the tonnes alone: 0.0055 a dollar). Net of the costs, the model's tonnes are 0.00455 a dollar, about $220 a tonne. | summary 0.0055 gross; audit-model 0.004546 tco2e/$ | Say "about $220 a tonne of CO2e averted, net of compliance costs" or "about $180 a tonne before compliance costs" | none |
| 3 | low | units | pwr_compliance_uov | EPA's yearly equivalent over 2024-2047 counted over the benefits' 2028-2047 (waited 4 years): the rule's cost is under-counted by about a fifth; the row is -61 of -659 uov. | RIA Table ES-2 | Optional: scale by 24 / 20 or note it | under 1% |

## Checked
- Formulas as in the Environmental Defense Fund model (identical text): negative sign; 2019 dollars to 2024 (@cpi.usa_2019, matching EPA's "million 2019$" and "billion 2019 dollars"); US consumption per person 2024; chain cost x downstream / tonnes_per_year x counterfactual (0.8, 0.8) x attribution (0.08, 0.1) x delivered share (0.4, 0.05) x missing data 0.5, no evidence_adj. Recomputed: usmeth -597.6 uov, pwr -61.0; /4 = -164.7 uov a year; bridge -187,595 t/yr; outcome_total 903,801 t/yr (the bridge is not scaled by the +50% unmodelled-benefits share).
- The coal retirements have no row: settlements and orders plant by plant, no regulator's impact analysis (stated in the explainer). Strictly, retiring coal plants also costs and saves money (replacement power); no sourced figure exists, so none is invented; acceptable under 2.21's "where no analysis gives a cost" line.
- No double counting: tonnes are gross; nothing netted elsewhere.
- Summary: "0.0055 tonnes ... $180 a tonne" is the tonnes alone, correct; "less the two rules' compliance costs (EPA's own figures), 0.0020" matches. No peer comparison. Write-up spans 0.0020 (this model) and 0.0059 (the health model, whose own round covers it) agree with the headlines.
- Payer multiple: judgment 1.2 (0.8 to 2), reasoned and ranged (see round 10 of the Environmental Defense Fund model).

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| us_oil_gas_methane_rule_net_cost_per_year | epa.gov RIA 2060-AV16, Table 1-6 | verified | Net compliance costs PV $19,000, EAV $1,500 million 2019$ (2%) |
| us_power_plant_rule_2024_cost_per_year | epa.gov utilities RIA, Table ES-2 | verified | EAV 0.98 billion 2019$ at 2% (the url's quote is the fact sheet's wording; the table has the same figure) |

## Drivers
Of the changed rows: the US methane rule's cost ($1.5B, 1.0 to 2.4B) times the rule's 40% delivered share and 8% credit, and the payer multiple. Both sourced or ranged.
