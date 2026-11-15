# Audit: environmental-defense-fund-charityevals-health-nature, round 7 (verification of the compliance-cost rule 2.21)
Result: 1.221e-6 daly/$ = 0.001221 years of healthy life per 1,000 dollars (combined range 5.0e-5 to 0.0296); cause median 0.001995 (x0.61). Round 6: 0.001880, so -35%. Verdict: pass.
Verdict: pass
Model-sha: 4a80a13473a966ce2b422eacaba03c6cfd2aa9c8f70cbe25afbd80ca19ad88a5

Scope: scoped verification of the changed rows (`pm_compliance_uov`, `lcri_compliance_uov`, `uov_bridged`, `summary`). Unchanged rows not re-audited.

Mechanical: `audit-model.ts` exit 0, 0 findings. normalization-audit, simulation-check not run (caller runs them).

Previous round: no open findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | `summary` | "over half from the lead-pipe rule and most of the rest from the soot standard" is no longer true after the costs. Lead-pipe net uov = 2,357 - 1,720/1.3 = about 1,034 (about 517 DALYs, plus illness about 101); soot net = 1,586 - 340/1.3 = about 1,324 (about 662 DALYs, plus illness about 168). Soot is about 55% of the total and lead-pipe about 40%. | values: pm_uov x pm_credit 1,586; lcri_uov x lcri_credit 2,357; pm_compliance_uov -340.6; lcri_compliance_uov -1,719.8; uov_bridged 2,388.9; dalys_direct 268.9. | Reword to "mostly from the soot standard (about 55%) and the lead-pipe rule (about 40%)". | none (text) |
| 2 | low | source | facts/compliance_costs.json `us_pm_naaqs_2024_cost_per_year` | The page cites "Table ES-8"; the quoted line is Table ES-10 (p. ES-27); ES-8 is monetized benefits by area. | RIA text. | Change to "Table ES-10, p. ES-27 (PDF p. 50)". | none |

Checks:
- Sign: both compliance rows negative; added into `uov_bridged` as `(pm_compliance_uov + lcri_compliance_uov) / (1 + unmodelled_benefits_adj)`. `outcome_total` multiplies the whole `dalys_from_uov` by `(1 + unmodelled_benefits_adj)`, so after the division the costs enter once at face value (2,060 uov: -340.6 + -1,719.8 = -2,060.4; /1.3 x 1.3). Right. The costs reach DALYs through `dalys_from_uov = uov_bridged / $uov_per_daly`. The result's before/after: 0.001880 to 0.001221.
- Dollar year and consumption: PM $590M x `cpi.usa_2024 / usa_2017`; LCRI $1.47-1.95 billion (best 1.71) x `cpi.usa_2024 / usa_2022`; the denominator is 1.2 x US 2024 consumption per person ($58,517, current 2024 dollars). Right.
- Branch adjustments: PM uses `p_success`, `pm_years`, `pm_counterfactual_adj`, `pm_attribution_share`, `pm_implementation_adj`, `missing_data_adj` (the same as `pm_credit` less `pm_evidence_adj`). LCRI uses `p_success`, `lcri_years`, `lcri_counterfactual_adj`, `lcri_attribution_share`, `lcri_implementation_adj`, `missing_data_adj` (the same as `lcri_credit` less the model-wide `evidence_adj` and `lslr_disturbance_share`, which belong to the benefits). Right.
- Gross of costs: `pm_uov`, `lcri_uov` (deaths x value plus IQ wage gain) and the illness DALYs are EPA's deaths and IQ points avoided, gross; nothing netted in the branches. Fisheries (net income) and farm tonnes unchanged and not rule costs.
- Timing: `pm_years` (wait 9 years, EPA's 2032 analysis year for the $590M) and `lcri_years` (8-year wait) are the branches' own, identical in benefit and cost rows.
- Result and summary figure: 0.0012 matches 0.001221. The LCRI cost is 73% of its credited benefit on our scale (EPA's benefits are $13.5-25 billion a year valued at VSL; ours are lower, so the ratio is higher; the same valuation as every other row).

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| us_pm_naaqs_2024_cost_per_year | EPA RIA, p. ES-27 | verified | "Costsb $200 $340 $590 $1,500", millions of 2017$, annualized at 7%, 2032. Table label: finding 2. |
| us_lcri_2024_cost_per_year | https://www.govinfo.gov/content/pkg/FR-2024-10-30/html/2024-23549.htm | verified | "the quantifiable annual costs of the rule will be $1.47 to $1.95 billion in 2022 dollars" at a two percent discount rate; EPA fact sheet: service line replacement $1.17 to $1.64 billion. |
| compliance_cost_payer_multiple | facts/public_funds.json | judgment | 1.2 (0.8-2), reasoned and ranged, anchored on the corporate-tax split and utilities passing costs to ratepayers. Accepted. |

## Drivers
Unchanged: shared years counted, missing-data discount, EDF's shares of the two rules. The compliance rows add the payer multiple and, for lead pipes, the LCRI cost (1.47-1.95 billion): at the defaults lead-pipe costs take 1,720 of 2,060 uov of costs.

Verdict: pass
Model-sha: 4a80a13473a966ce2b422eacaba03c6cfd2aa9c8f70cbe25afbd80ca19ad88a5
