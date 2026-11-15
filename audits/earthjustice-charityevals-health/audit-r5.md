# Audit: earthjustice-charityevals-health, round 5 (verification of the compliance-cost rule 2.21)
Result: 1.186e-5 uov/$ = 0.005932 years of healthy life per 1,000 dollars (combined range 2.96e-4 to 0.1189; model's own ranges -0.0029 to 0.0177); global-health median 0.0686 (far-below finding ignored per brief). Round 4: 0.00842, so -30%. Verdict: pass.
Verdict: pass
Model-sha: 37fd06f80e8e940b98fcb85b94449b5c33e878f29f393649b27e4bcd7f93b7eb

Scope: scoped verification of the changed rows (`pm_compliance_uov`, `pfas_compliance_uov`, `compliance_uov_per_year`, `outcome_total`, `summary`, and the figure span in writeups/earthjustice-charityevals.md). Unchanged rows not re-audited.

Mechanical: `audit-model.ts` exit 0, one finding (MEDIUM far-below, to be removed by another agent, ignored per brief). normalization-audit, simulation-check not run (caller runs them).

Previous round: no open findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | `summary` (and writeups/earthjustice-charityevals.md line 58) | The summary's last sentence, "Compliance costs to US water systems and industry aren't counted, as in the site's other policy models", contradicts the new rows and the sentence before it. The write-up's "Compliance costs to industry and water systems aren't counted, as in the site's other policy models. For the PFAS standards EPA puts them near the benefits' dollar value." is stale in the same way. | Both texts unchanged from before the rule; the model now subtracts both rules' costs. | Delete the sentence from the summary. In the write-up replace it with: "The two rules' compliance costs count (EPA's own figures, docs/normalization.md 2.21); the other wins' costs are not counted." | none (text) |
| 2 | medium | presentation | `summary` | "(EPA's own figures; the PFAS standards' about equal their benefits)" is true of EPA's dollars but not of the model: PFAS costs here are -1,348 uov against about 56 uov a year of PFAS benefit (3,976 x 0.0288 / 4 x 1.5 x (1 + DBP share), before illness), so the PFAS branch is net negative and about 6 times its benefit on our scale, because our deaths are valued by age and EPA's at a single VSL. A reader takes "about equal" as roughly zero net. | `pfas_compliance_uov` -1347.7, `pm_compliance_uov` -851.5, `compliance_uov_per_year` -549.8; outcome_total 1310.4 (benefits 1,860 including illness 319). | Reword: "the PFAS standards' costs, EPA's about equal to its benefits in dollars, are several times the value of their deaths avoided on our scale, so that branch is net negative." | none (text) |
| 3 | low | missing-adjustment | `unmodelled_benefits_adj` explainer | The 50% for other wins scales their gross benefits (x1.5 on the modelled benefits) while their compliance costs (chemical plants, coal ash, mercury rule) are in no row; rule 2.21 asks for a line where no analysis gives a cost. | Explainer has no such line; `outcome_total` adds `compliance_uov_per_year` outside the `(1 + unmodelled_benefits_adj)` factor, as intended. | Append one line to the explainer: "These wins' compliance costs are not counted: the 50% is of the modelled benefits, gross of costs." | small, none until a cost is modelled |
| 4 | low | source | facts/compliance_costs.json `us_pfas_npdwr_2024_cost_per_year` | The quote does not say "2022 dollars"; the unit year rests on the FR preamble's other sentences. | Quote read at govinfo (FR 89 FR 32533): "$1,548.64 million per year" at a 2 percent rate; year not in the quoted sentence. | Add the preamble sentence stating 2022 dollars (89 FR 32533), or the RIA's table title. | none |

Checks:
- Sign: both rows start with a minus; they enter `outcome_total` as `+ compliance_uov_per_year`, after and outside `(1 + unmodelled_benefits_adj)`, so the share for other wins does not scale them. Right.
- Dollar year: PM2.5 $590M is 2017 dollars (EPA Table ES-10, p. ES-27: "Costs $200 $340 $590 $1,500", annualized at 7%, in 2032); model multiplies by `@cpi.usa_2024 / @cpi.usa_2017`. PFAS is 2022 dollars (the FR text reads "$1,548.64 million per year" at 2 percent) with `@cpi.usa_2024 / @cpi.usa_2022`. The consumption figure `@united_states.consumption_per_person_2024` is current 2024 US dollars, so numerator and denominator are both 2024 dollars. Value of a dollar = `$uov_per_ln_consumption / (1.2 x 58,517)`, the log scale, US. Right.
- Branch's own adjustments: PM uses `p_success`, `discounted_years`, `pm_counterfactual_adj`, `pm_attribution_share` (with `own_resource_share`), `pm_implementation_adj`, `missing_data_adj`, not `pm_evidence_adj`; PFAS likewise with `pfas_discounted_years`, `pfas_counterfactual_adj`, `pfas_attribution_share`, `pfas_implementation_adj`. These are the same factors as `pm_total_adj` and `pfas_total_adj` less the evidence adjustment. Note `pfas_total_adj` uses the model-wide `evidence_adj`, and the cost correctly leaves it out. Right.
- Gross of costs: the PM benefits are deaths avoided x value (`pm_downstream`) and the PFAS ones the 9,600 deaths less the DBP deaths plus DBP share; neither is net of any cost, and EPA's death counts are gross. The PFAS DBP (bladder cancer) deaths are co-removed byproducts, benefits not costs. Nothing netted twice.
- Timing: PM cost is a 2032 annual figure (EPA's analysis year, constant in nominal terms across 2032-2051: the PV table's 2032 and 2051 columns at 7% give 590 and 592 once brought up to their own years), and the benefit wait is 9 years from 2024 (`us_pm_naaqs_2024_years_until_effect`, attainment late 2032), so cost and benefit start together and share `discounted_years` (3.253). PFAS: costs for treatment begin around the 2029 deadline, benefits 6 years after 2024, shared `pfas_discounted_years` (3.659). Right.
- Division by period_years: `compliance_uov_per_year` divides by `period_years` as `downstream_value` does.
- Result: 1310.4 uov/year / cost_per_period_year gives 0.005932; matches the summary's 0.0059 and the write-up's 0.0059, and the before value 0.008421 (+851.5 and 1347.7 over 4 years = +549.8 a year; 1310.4 + 549.8 = 1860.2 -> 0.00842).
- Payer multiple (`compliance_cost_payer_multiple`, 1.2, 0.8-2, lognormal): reasoned (three quarters consumers at about average, a quarter owners at 2.5x, harmonic mean about 1.2), anchored on `corporate_tax_payer_multiple` and regulated utilities passing costs to ratepayers, ranged. Accepted.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| us_pm_naaqs_2024_cost_per_year | EPA RIA (naaqs_pm_reconsideration_ria_final.pdf), p. ES-27 | verified | "Costsb $200 $340 $590 $1,500", millions of 2017$, annualized at 7%, 2032; low end $470M is the 3% EAV in Table ES-11. The fact's page cites "Table ES-8"; the table is ES-10 (ES-8 is monetized benefits by area): low, label only. |
| us_pfas_npdwr_2024_cost_per_year | https://www.govinfo.gov/content/pkg/FR-2024-04-26/html/2024-07773.htm | verified | "the quantifiable costs of the rule will be $1,548.64 million per year" at a two percent discount rate; EPA fact sheet Table 2: treatment and disposal $1,506M, monitoring $36M. 2022 dollars not in the quoted sentence (finding 4). |
| compliance_cost_payer_multiple | facts/public_funds.json | judgment | see checks. |

## Drivers
Unchanged: `win_years_counted`, `missing_data_discount`, `pm_attribution_share_shared`, `@next_dollar.earthjustice`, delivered share. The compliance rows add the payer multiple (1.2, 0.8-2) and the PFAS cost range ($1.2-3 billion); the PFAS cost is the one that most lowers the result (-1,348 of -2,199 uov over four years).

Verdict: pass
Model-sha: 37fd06f80e8e940b98fcb85b94449b5c33e878f29f393649b27e4bcd7f93b7eb
