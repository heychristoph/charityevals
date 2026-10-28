# Audit checklist

## Double counting

- [ ] Overhead counted twice: `program_spend` already includes allocated overhead *and* `overhead_ratio` > 1.
- [ ] Credit shared twice: reach is already "attributable to the charity" (an evaluator's attributed
      count) *and* `attribution_share_shared` < 1. Or reach only counts the charity's share *and* the
      formula multiplies by full-credit totals.
- [ ] Counterfactual twice: the effect is an RCT treatment-vs-control difference (already net of
      what would have happened) *and* `counterfactual_adj` discounts for the same thing. In this
      setting `counterfactual_adj` is only for what's different from the trial (other providers here).
- [ ] Discounting twice: an input that is already a present value (GiveWell's later-years ratio, a
      PV of lifetime income) multiplied by `discounted_years`.
- [ ] Benefits twice: illness in `dalys_averted_per_person` *and* in `unmodelled_benefits_adj`;
      household spillovers in the effect size *and* in `household_multiplier`; mortality inside a
      consumption effect *and* as its own branch.
- [ ] Animals twice: hens counted per commitment and per company when commitments overlap; meals
      counted per pledge and per participant.

## Missing adjustments

- [ ] Evidence: publication bias, self-report bias, small or single studies, effect measured on a
      different population.
- [ ] Counterfactual: other providers, government programs, existing trends (cage-free trend,
      falling mortality since the trial).
- [ ] Attribution: coalition campaigns, co-funders, government delivery partners.
- [ ] Implementation: adherence, dosage/completion, coverage-survey vs. admin count, pledges kept.
- [ ] Persistence and discounting: does the effect fade? Is `$discount_rate` applied to anything
      that lasts more than a year?
- [ ] Funging and leverage (global health): would a government or the Global Fund have paid?
- [ ] Production response (diet change): `@sad_factors.production_response` applied.
- [ ] Negative effects: substitution to other animal products, rebound, harms of the intervention.

## Units

- [ ] Per person vs. per household; per year vs. per lifetime vs. per program round.
- [ ] Nominal USD vs. PPP; local currency converted at the right year's rate.
- [ ] Percent as 45 vs 0.45; per 1,000 or per 100,000 rates divided correctly.
- [ ] Mortality rate per person-year vs. probability over 5 years (U5MR is a cumulative probability
      per 1,000 live births, not an annual rate).
- [ ] SD vs. raw scale points; SD-years vs. WELLBYs.
- [ ] Animals in supply chain per year vs. at any one time (hens live ~1.5 years in production).
- [ ] Output row is per dollar of `cost_total`, then × `donor_cost_share`.

## Plausibility (reference classes)

- [ ] Cost per unit reached compared with the charity's own published figure and with peers.
- [ ] Effect sizes within the CI of the cited meta-analysis.
- [ ] Bottom line within 10× of peers in the same unit, or a sourced reason why not.
- [ ] Canonical rows compared with other charityevals models of the same family.
- [ ] Ranges: judgment ranges reflect real disagreement (cite the disagreeing sources), not a
      reflexive ±20%.
