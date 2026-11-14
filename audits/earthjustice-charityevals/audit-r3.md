# Audit: earthjustice-charityevals, round 3 (verification of commit d8ab0c4)
Result: 0.00549 tco2e/$ = 0.002409 years of healthy life per 1,000 dollars (round 2: 0.002353, +2.4%, from the restated shared methane tonnes). Combined range 0.0000976-0.0595; cause median 0.001642 (x1.47). Verdict: pass.
Model-sha: e93bf81207befb7dad9d63785a8963b7d20ad0a22fbd6f513336fd8fc32404be
Scope: scoped verification of the four methane/power-plant adjustment rows and the restated figure; unchanged rows not re-audited.
Mechanical: audit-model.ts 0 findings, no invariant violations.
Previous round: round 2's open item (45% split, medium, accepted) unchanged.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No findings. | - | - | none |

## Checks
- usmeth_counterfactual_adj, usmeth_implementation_adj, pwr_counterfactual_adj, pwr_implementation_adj are formulas reading @climate.us_oil_gas_methane_rule_counterfactual / _delivered_share and @climate.us_power_plant_rule_2024_counterfactual / _delivered_share. The shared facts hold 0.6/0.8/1, 0.15/0.4/0.7, 0.5/0.8/1 and 0.01/0.05/0.2, identical to the removed typed values (diff of d8ab0c4). The rows' explainers name the shared fact.
- Shared tonnes fact us_oil_gas_methane_rule_tco2e_2024_2038 = 1,568,000,000 (1.568e9 = 58M short tons x 0.90718 x 29.8). Native result 0.005490 t/$; 1/0.00549 = $182 a tonne.
- Summary reads "about 0.0055 tonnes of CO2e (about $180 a tonne), 0.0024 years of healthy life per $1,000"; write-up reads "about $180 a tonne" and the live 0.0024 headline. Both match the live result (0.002409). grep for 0.0054, $185, 185 a tonne finds nothing in the model or write-up.
- Peers: x1.47 of the climate median, no gap to explain.

## Sources checked
Facts rows moved to the shared file are checked in their own audits; no source URL changed in this commit for this model.

## Drivers
Unchanged from round 2.
