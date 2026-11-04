# domestic-services (WELLBYs, uov, DALYs → daly; unit_cost)

Social services in rich countries: food banks and meals, housing and homelessness, youth clubs and
mentoring, help for veterans and older people, toys and wishes. The good they do is mostly wellbeing
and money, some health, so the template counts each in its own unit and bridges it into healthy years
(normalization.md 2.6): a reader moving the WELLBY or income sliders moves these models exactly as it
moves a therapy or a cash model.

## The chain

```
households_reached × household_size = people_reached
wellbeing   ls_gain_per_person_year × pv(ls_effect_years)               → wellbys_bridged → dalys_from_wellby
income      ln(1 + value_per_person / baseline_consumption) × pv(income_years) × $uov_per_ln_consumption
deaths      deaths_averted_per_person × value_per_death (@moral_weights by band × $life_value_multiplier)
                                                                        → uov_bridged → dalys_from_uov
health      dalys_averted_per_person                                    → dalys_direct
(sum) × total_adj × (1 + unmodelled_benefits_adj) = outcome_total; ÷ cost_total
```

`baseline_consumption = consumption_mean × recipients_consumption_share`: the site's one log-income
scale at the clients' own consumption, so $400 of food is a small ln gain for a US household and a
large one for a household on two dollars a day. Nothing else makes a rich-country dollar do less: the
scale does it.

## Shared figures it reads

- `@household_size.united_states`, `@household_size.united_kingdom` (add another country's from its
  statistics office); 1 for a service to one person, said.
- Survey consumption of the people served: `@united_states.ce_expenditure_per_person_2024` (Consumer
  Expenditure Survey); where only national accounts exist, the national figure × the shared
  `@survey_consumption.survey_to_na_<iso3>` (UK: `@united_kingdom.consumption_per_person_2024 *
  @survey_consumption.survey_to_na_gbr`; pounds × `@fx.usd_per_gbp_<year>`). A shared conversion,
  never a reason for `$missing_data_discount`.
- `@united_states.ce_lowest_quintile_vs_all_2024`: the anchor for `recipients_consumption_share`
  (per household; per person the share is higher, since poorer households are smaller).
- `@wellby_factors.wellbys_per_sd_year` for an effect in SDs; `@depression.phq9_sd` for PHQ points.
- `@moral_weights.*` by age band × `$life_value_multiplier`; `@gbd_disability_weights.*` for illness.
- `$discount_rate` on every year after the first.

## Evidence to look for

- **Reach**: unique households or people per year, not visits or meals (a food bank's "meals" are
  usually pounds of food ÷ a fixed weight per meal: say which).
- **Wellbeing**: trials or quasi-experiments of the same service with a life-satisfaction or
  validated wellbeing outcome (housing-first trials, mentoring RCTs, befriending and loneliness
  trials, food-insecurity studies with wellbeing measures). An effect on a depression or anxiety scale
  is SDs × the shared rate; a food-insecurity score alone is not wellbeing.
- **Income**: what the help is worth to the people who get it at the price they would pay (retail food
  prices, rent saved, benefits claimed and won). Count only value not already counted as wellbeing or
  health: food that makes people happier because it saves them money is counted once.
- **Health and deaths**: overdose, exposure, suicide and hospitalisation evidence for housing and
  outreach; most services have none, so 0 with the reason.

## Pitfalls

- **Double counting the same change** in two branches (money saved and the relief it brings). Pick the
  measure the evidence uses; the other branch is 0 or the share not covered.
- **Counterfactual**: rich countries have public services and other charities. `counterfactual_adj`
  is the share that wouldn't have come from government, other food banks or family; anchor it on
  waiting lists, coverage gaps or a trial's control arm.
- **Volunteers and donated goods** are not in the charity's cost: they lower
  `attribution_share_shared` (Convention 2), valued at the local wage and the goods' retail price.
- **Gifts and wishes**: a one-off experience has a short wellbeing effect (weeks to months); a study's
  long-run claim without a control group is a check, not the effect.
- **Grants to local member charities** (federations, community funds) count as what the members do,
  split by activity; money a federation raises for members goes through the money-moved rows of
  policy-research-meta only when it is fundraising, not service.
- A charity's own "social return on investment" ratio is its conversion, never ours.
