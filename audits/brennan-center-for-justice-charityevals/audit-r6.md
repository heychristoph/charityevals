# Audit: brennan-center-for-justice-charityevals, round 6 (verification of the alignment with the family rule)

Result: 0.0732 years of healthy life per $1,000 (7.318e-5 DALYs per dollar), 1.07x the global-health median. Mechanical pass clean (0 findings), `check.ts` passes.
Model-sha: 89564b898e40cd3fb7f6f3109f16062b50ae3a6756cdc849834cac11fd284b6b

| # | Check | Status | Issue |
|---|-------|--------|-------|
| 1 | dem_p_breakdown reads @democracy.us_democracy_loss_chance_2030; dem_field_spending = @democracy.us_democracy_philanthropy_per_year x field multiples x CPI 2025/2022 as Protect Democracy's field_resources (2024 prices there) | pass | Formulas identical but for the price year. Value $2.62 billion; dem_attribution_share 1.94% (about 2%) |
| 2 | dem_loss_years is the shifted ramp with r = $discount_rate + dem_reversal_rate, T = @democracy.democratization_years_to_effect, N = years_of_impact | pass | Formula (1-(1+r)^-N)(1-(1+r)^-T)/(ln(1+r)^2 T) x wait discount, same as bs_discounted_years; value 1.511 at r = 0.09 (by hand 1.671 x 0.9064 = 1.515) |
| 3 | Same concept, same value: severity, field cut, reversal rate, evidence adjustment, field multiples (3), indirect effect, four ue_* side effects | pass | All values and ranges equal Protect Democracy's (0.3/0.6/1; 0.005/0.045/0.2; 0.02/0.05/0.1; 0.5/0.8/1; 1.2/1.5/2.2; 0.2/0.4/0.7; 0/0.2/0.5; ue 0.1/0.3/1, 0/0.05/0.2, 0/0.2/0.6, -0.15/-0.05/0). dem_years_until_effect 1.5/2.5/4.5 vs 2/3/5, explained (year to June 2025 vs calendar 2024) |
| 4 | Summary and write-up figures; beneficiaries in model and scripts/beneficiary-countries.ts | pass | 0.07 per $1,000 (0.0732); share 2% (1.94%); tariff share of result 20,629 / 26,305 = 78%, four fifths; model and script both USA 0.52, CHN 0.48 with identical notes (tariff 78% x about 61% abroad = 48%) |
| 5 | Mechanical: audit-model, check.ts | pass | No findings; warnings only for the wide range and the judgment share (known) |

Low (not blocking): the dem_field_spending explainer says "about $2.5 billion"; the value is $2.6 billion at the defaults.

Verdict: pass
