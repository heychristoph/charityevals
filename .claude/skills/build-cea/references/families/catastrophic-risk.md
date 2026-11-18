# catastrophic-risk (uov, DALYs → daly; past_average)

AI, pandemics, nuclear war. One model covers several areas; a regrantor is money moved, read live; a
grant to a modelled charity is `grant × #owner:charity`, listed in `destination_reads`, after the branch
adjustments (its figure carries its own).

## The chain

```
risk by area   <a>_extinction_per_year   chance by 2100 ÷ forecast_years  (sliders: $ai_, $bio_, $nuclear_catastrophe_chance)
               <a>_catastrophe_per_year  survivable (>10% die), × <a>_deaths_if_catastrophe
               <a>_smaller_per_year      a smaller size (pandemics: COVID-scale, shared; else 0 or sourced)
field work     cost_total × <a>_cost_share / 1e6 × <a>_deaths_per_million (and _future_per_million)
               × <a>_discounted_years    ($win_years_counted, after <a>_years_until_effect)
policy win     pol_wins × pol_p_success (single_event) × pol_relative_cut × the area's yearly deaths
field-building fb_people × fb_share_working × @catastrophe.field_work_years × @catastrophe.cost_per_work_year
               → dollars of typical work × fb_credit_share
climate        cost_total × climate_cost_share × #cause:climate (option, share 0 unless used)
deaths         deaths_averted × value_per_death (world age split, × $life_value_multiplier);
               the COVID-scale part (covid_scale_deaths_averted) × covid_value_per_death (COVID's age mix)
               × (1 + @catastrophe.nondeath_losses_vs_deaths)  → uov_bridged → dalys_from_uov
future         extinction cut × future_dalys_if_extinct (long-run population × future_years_per_person)
(each branch × its own adjustments, summed) × (1 + benefits + harms) ÷ cost_total × marginal_vs_past_average
```

Why this shape:

- **Sizes, not one risk.** A catastrophe the world survives kills a share of people, valued like any
  deaths. Only extinction-level ones take the future: people not yet born, through the one discount
  rate (`future_years_per_person`). People alive now count as deaths, never twice. The future
  × `$never_started_weight` (2.25).
- **A typical dollar, then this charity.** The cut per dollar is Rethink Priorities' typical project per
  area. The charity enters through its spending and each branch's evidence multiplier (how far its
  outputs beat or trail a typical project); no free-hand multiplier. Spending far above a typical
  project (about $30M a year) takes `<a>_scale_adj`.
- **Adjustments by branch** (Convention 4): the canonical rows weight the branches by their healthy
  years (`w_<branch>`), never by spending.
- **AI: misuse or misalignment.** `ai_misuse_cost_share` (default 0) is the AI spending aimed at misuse
  (uplift evaluations, unlearning, refusal work); it takes the `ai_misuse_` cuts, the rest (and work
  aimed at both) the misalignment ones.
- **Climate** (an option): `#cause:climate`, never a hand-wired bridge, with its own `climate_`
  adjustments.
- **Specific outcomes** (a treaty, law, standard, institution launched) go in the policy branch, with
  their spending left out of the areas' shares (`cost_shares_total` must be 1). Calibrate
  `pol_relative_cut` per risk: everyone's resources behind the measure × the area's cuts per $1 million
  (both sizes), then a named multiple. People trained go in field-building. Credit (Convention 2):
  field work and field-building `research`, the policy branch `win`; adopters (labs, governments,
  employers) are in no denominator.
- **Years.** Every cut counts `$win_years_counted` years (normalization.md 2.9), the wait discounted;
  someone else doing the work now is `counterfactual_adj`.

## Shared figures (facts/catastrophe.json)

| Figure | Value | Source |
|---|---|---|
| `nuclear_`/`bio_` `extinction_by_2100`, `_catastrophe_by_2100` | experts' medians; superforecasters the low end | Existential Risk Persuasion Tournament (Karger et al. 2023, Tables 2–3; pandemics from its post-tournament survey) |
| `$ai_catastrophe_chance`, `$bio_catastrophe_chance`, `$nuclear_catastrophe_chance` (sliders), `ai_catastrophe_vs_extinction` | 5%, 1.01%, 0.55% by 2100; AI ×4 | the same tournament (owner decision 2026-11-04) |
| `<a>_extinction_cut_per_million`, `_catastrophe_cut_per_million` | AI misalignment 7.7e-7 / 2.7e-7 (90% of extinction, 32% of survivable catastrophes' deaths), `ai_misuse_` 1.0e-6 / 1.2e-4 (10%, 68%); pandemics 1.3e-4 / 2.3e-4; nuclear 2.0e-4 / 3.6e-4 | Rethink Priorities' cross-cause model, small-project presets × its backfire step 0.772; range ×10 either way, ours |
| `<a>_catastrophe_death_share` | nuclear 45%, pandemics 15%, AI 25% | judgments; nuclear from Xia et al. 2022's famine deaths |
| `pandemic_probability_covid_scale`, `covid_excess_deaths` | 2% a year; 14.9M | Marani 2021; WHO |
| `world_population_now`, `life_expectancy_now`, `world_population_long_run` | 8.14bn; 73.5; 10.2bn | World Bank 2024; UN WPP 2024 |
| `@death_ages.population_world_*` | the world's age split | World Bank 5-year bands |
| `cost_per_work_year`, `field_work_years` | $250k; 5 years (2–10) | judgments (McAleese 2025; 990s) |
| `nondeath_losses_vs_deaths` | 0 (0–30%) | judgment, stated so it shows |

A smaller AI or nuclear size needs a sourced forecast in facts/, else a named share in `unmodelled_benefits_adj`.

## Evidence to look for

- Spending by area: Form 990 Part III lines 4a–4d, the accounts' programme notes; shared costs pro rata.
- Outputs for the evidence multipliers: uptake by labs, governments, bodies.
- Wins in the year: the official record, entry into force, the coalition's resources.
- Room for more funding (`@next_dollar`): reserves, deficits, funders leaving or arriving.

## Pitfalls

- **Thin**: every branch takes `$missing_data_discount`.
- **Don't count a typical project's backfire twice**: it is in the shared cut. `speedup_harm_share` and
  `hazard_harm_share` (side effects) are only for work clearly riskier than typical (capabilities-
  adjacent research, dangerous-capability evaluations, published threat analyses).
- **Don't** type a funder's dollars-per-basis-point bar, an evaluator's value of the future or a
  premium for a catastrophe's size; compare in the write-up only.
