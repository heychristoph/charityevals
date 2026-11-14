# climate (tco2e; policy-research-meta climate skeleton, conservation, past_average or unit_cost)

Every climate programme ends in tonnes of CO₂-equivalent averted (`tco2e`). The unit's one conversion
(normalization.md 2.5) turns a tonne into heat deaths (discounted over `$climate_heat_death_delay`)
plus the air-pollution deaths its fuel carries; the model supplies the tonnes and how smoky they are.
Advocacy, litigation and research use `templates/policy-research-meta-climate.json`; forest and land
protection the `conservation` template's climate branch; direct cuts (stoves, capture plants, methane
capture) the climate skeleton with `unit_cost`.

## The chain

```
win:  tonnes_per_year (once in effect) × p_success × pv($win_years_counted) × (1+$discount_rate)^-wait
      × counterfactual × attribution (the charity's share of all groups' resources) × implementation
      × evidence_adj × missing_data_adj
(sum of the period's wins) ÷ period years ÷ (cost × average_spend_vs_year) × @next_dollar.<charity>
conversion (ours): fuel_share × fuel_smoke_factor = air_pollution_weight; extra_deaths_per_tco2e; methane_share
```

- **Policy and litigation** are past averages: the wins of a period (several years: one year's wins
  are noise) against the same years' real spending (Convention 11). Each win is a branch
  (`<win>_counterfactual_adj`, `<win>_attribution_share_shared`, `<win>_implementation_adj`,
  `<win>_total_adj`); the canonical rows are outcome-weighted averages for reading only.
- **Technology acceleration** (advanced reactors, fusion, new fuels): a won policy speeds a share of a
  published deployment pathway. Tonnes = pathway capacity × output per unit × displaced emissions ×
  share built × share due to the policy; a technology that may never work adds a `single_event`
  chance.
- **Forest protection**: hectares protected in the year × tonnes per hectare-year × years protected,
  the counterfactual from matched comparisons of protected and unprotected land, leakage as a negative
  share (families/conservation.md). Land carbon carries no fuel smoke; clearing fires only a little.
- **Direct emissions cuts** (`unit_cost`): units installed × tonnes per unit-year, measured where it can
  be, × years of use, discounted; no win years and no next-dollar factor.

## Shared figures (facts/climate.json)

- `advocacy_share_of_policy_win` (30%, 10-60%): the part of a won policy due to all advocates
  together; `p_success` reads it for a win already in. A pending policy takes a chance of winning from
  a reference class instead, marked `single_event`.
- `years_until_avoided_regulation` (3, 1-6) for rules and tax credits;
  `years_until_avoided_technology` (15, 8-25) for technologies not yet deployed. A policy with its own
  compliance dates uses them.
- Tonnes of particular wins, for every model that counts them: the EU Methane Regulation's import
  cut, EPA's 2023 oil and gas methane rule, EPA's 2024 power-plant standards, the 2022 carbon-capture
  credit. Add a new win's tonnes here (the regulator's impact assessment or a modelling study), never
  inside one model.
- `us_power_smoke_factor` for tonnes from US power plants burning less, `us_coal_power_smoke_factor`
  for coal plants'; other fuels and places from per-fuel evidence (deaths per TWh) in the model's
  `fuel_smoke_factor`, weighted by branch.
- Methane: the model's `methane_share` row (methane's part of the CO₂e tonnes, weighted by tonnes a
  year before waits); the conversion gives it methane's own warming (`methane_heat_*`) and ozone
  (`ozone_deaths_per_tco2e_methane`, discounted over `methane_lifetime_years`). Never in
  `extra_deaths_per_tco2e`.
- `nondeath_damages_vs_deaths` stays a visible shared zero.

## Evidence to look for

- **Wins**: laws, rules, rulings and credits in the period that the charity's annual or impact report
  claims, checked against the official record (dates, current status).
- **Tonnes**: the regulator's impact assessment, the modelling of independent groups; GWP100 (IPCC
  AR6) for methane, as the sources state it.
- **Status since**: repeals, delays, court stays and weakening amendments set `implementation_adj`;
  a rule repealed keeps only the chance it is restored within the years counted.
- **Share of the work**: the coalition behind each win (the other groups, industry lobbies, their
  budgets where known), for `attribution_share_shared`.
- **Fuel**: what the tonnes replace (coal, gas, oil, other clean power), for `fuel_share` and the
  counterfactual.

## Pitfalls

- **Counted twice**: years a win counts and the counterfactual are one question each; trade
  reshuffling (cleaner supply sent to the regulated market) is the counterfactual, not a lower tonnes
  figure; smoke already in a death count goes in `extra_deaths_per_tco2e` with `air_pollution_weight` 0.
- **Rows feeding the conversion** read no shared assumption (INV-2b): weight `fuel_share` by tonnes
  before waits and years counted, and say so.
- **Pathways are not forecasts**: a government's 2050 target is the yardstick, the share built a
  ranged judgment.
- **Wins outside the period** are out with their cost: never a famous old win against this year's
  budget.
- **Projections run ahead**: ex-ante tonnes of tax credits and technology have often exceeded what
  was built; say so in `evidence_adj`.
- The organisation's own credit claims ("thanks in part to our advocacy") name the win, not its
  share.
