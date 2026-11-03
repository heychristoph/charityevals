# humanitarian-relief (uov, DALYs → daly; unit_cost)

Disaster and conflict response, refugee and displacement support, emergency food, water, shelter and
health care. The good is mostly deaths averted during the crisis, then illness and the value of what
was delivered. Blood supply, routine medical care and vaccination in a crisis country go through
`direct-health`; a long-term development programme of the same charity is its own model.

## The chain

```
deaths      (crisis_mortality_rate − baseline_mortality_rate) × share_excess_averted × years_exposed
            × value_per_death (@moral_weights by band × $life_value_multiplier)
goods       ln(1 + value_delivered_per_person × ppp_factor / baseline_consumption) × $uov_per_ln_consumption
                                         → uov_bridged → dalys_from_uov
illness     dalys_illness_per_person     → dalys_direct
× people_reached × total_adj × (1 + unmodelled_benefits_adj) ÷ cost_total
```

Only excess deaths count: the crisis's mortality above the population's normal rate, of which a share
is averted for the people the response reaches, over the months it reaches them.

## Shared figures it reads

- `@moral_weights.*` by age band × `$life_value_multiplier` (crisis deaths are young: often 40–60%
  under five; split them from mortality surveys or GBD).
- `@<country>.ppp_factor_2017` (add the country from the World Bank); `@gbd_disability_weights.*`
  for illness (add a missing weight from the GBD table).
- `$uov_per_ln_consumption`; `$discount_rate` where benefits last beyond a year.

## Evidence to look for

- **Mortality**: SMART or retrospective mortality surveys of the crisis (crude and under-five death
  rates per 10,000 a day; × 365 ÷ 10,000 for per person-year), with the pre-crisis rate from UN WPP or
  DHS. Sphere's thresholds (crude 1 per 10,000 a day) are a check, not a measurement.
- **Share averted**: studies of the intervention in emergencies (therapeutic feeding and mortality,
  water and sanitation and cholera deaths, measles campaigns, cash or food and child mortality). The
  share is for the people reached, so don't multiply by coverage again.
- **Reach and months**: the charity's and the cluster's (OCHA 4W) counts of unique people and months
  served; distributions are not people.
- **Counterfactual**: the response plan's funding coverage (OCHA Financial Tracking Service) and who
  else was in the same place; a well-funded response leaves less to add.

## Pitfalls

- **Counting the goods twice**: food that averts deaths is valued as deaths; `value_delivered_per_person`
  is only the share not counted there (often 0 for nutrition treatment, most of the value for shelter
  kits or non-food items).
- **Attribution in pooled responses**: a charity delivering a UN agency's supplies gets its share of
  all resources (Convention 2), the supplies' cost included.
- **Fundraising spikes**: a year with a big appeal has unusual spending; cost and reach come from the
  same year's accounts, and money unspent at year end waits (discounted).
- **Self-reported "lives saved"** with no mortality denominator is not evidence; rebuild from rates.
- In-kind gifts (donated food, medicines) are valued at local market prices, not donor list prices.
