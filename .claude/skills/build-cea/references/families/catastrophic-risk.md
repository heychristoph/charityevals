# catastrophic-risk (uov, DALYs → daly; past_average)

Charities against global catastrophes: AI (technical safety research, evaluations, governance and
policy), pandemics (biosecurity, DNA synthesis screening, biosafety policy, preparedness) and nuclear war
(arms control, diplomacy, materials security, resilience such as food after a nuclear winter). One model
covers a charity working in several areas; a regrantor is policy-research-meta's money moved, read live.

## The chain

```
risk by area   <a>_extinction_per_year   chance by 2100 ÷ forecast_years  (AI: $ai_catastrophe_chance)
               <a>_catastrophe_per_year  survivable (>10% die), × <a>_deaths_if_catastrophe
               <a>_smaller_per_year      a smaller size (pandemics: COVID-scale, shared; else 0 or sourced)
field work     cost_total × <a>_cost_share / 1e6 × <a>_deaths_per_million (and _future_per_million)
               × <a>_discounted_years    ($win_years_counted, after <a>_years_until_effect)
policy win     pol_wins × pol_p_success (single_event) × pol_relative_cut × the area's yearly deaths
field-building fb_people × fb_share_working × work-years × @catastrophe.cost_per_work_year → dollars
               of typical work × fb_credit_share
deaths         deaths_averted × value_per_death (world age split, × $life_value_multiplier)
               × (1 + @catastrophe.nondeath_losses_vs_deaths)  → uov_bridged → dalys_from_uov
future         extinction cut × future_dalys_if_extinct (long-run population × future_years_per_person)
(sum) × total_adj × (1 + benefits + harms) ÷ cost_total × marginal_vs_past_average
```

Why this shape:

- **Sizes, not one risk.** A catastrophe the world survives kills a share of people and is valued like
  any deaths. Only extinction-level ones take the future: people not yet born, counted through the one
  discount rate (`future_years_per_person`: about 8 years of the long-run population at 4%, about 960 at
  0.1%). People alive now count as deaths, never twice.
- **A typical dollar, then this charity.** The cut per dollar is Rethink Priorities' typical project per
  area, its backfire step included. The charity enters through its spending and `evidence_adj`, which
  says how far its outputs (evaluations labs run, standards adopted, governments acting on its work) beat
  or trail a typical project. No free-hand multiplier on the field.
- **Specific outcomes** (a treaty, law, standard, institution launched) go in the policy branch, with
  their spending left out of the areas' shares (`cost_shares_total` must be 1). People trained go in
  field-building, valued at their work's typical dollar, the training credited only its share.
- **Years.** Every cut counts `$win_years_counted` years (normalization.md 2.9), in place of Rethink's
  15–25 years of persistence; the wait is discounted. That the work would have come later is these
  years; that someone else would do it now is `counterfactual_adj`.
- **Basis.** `past_average`, reading `@next_dollar.<id>` (normalization.md 2.10; write it if missing).

## Shared figures (facts/catastrophe.json)

| Figure | Value | Source |
|---|---|---|
| `nuclear_`/`bio_` `extinction_by_2100`, `_catastrophe_by_2100` | experts' medians; superforecasters the low end | Existential Risk Persuasion Tournament (Karger et al. 2023, Tables 2–3; pandemics from its post-tournament survey) |
| `$ai_catastrophe_chance` (slider), `ai_catastrophe_vs_extinction` | 3% by 2100; ×4 | the same tournament (owner decision 2026-11-04) |
| `<a>_extinction_cut_per_million`, `_catastrophe_cut_per_million` | AI 7.7e-7 (misalignment, 90% of AI risk); pandemics 1.3e-4 / 2.3e-4; nuclear 2.0e-4 / 3.6e-4 | Rethink Priorities' cross-cause model, small-project presets × its backfire step 0.772; range ×10 either way, ours |
| `<a>_catastrophe_death_share` | nuclear 45%, pandemics 15%, AI 25% | judgments; nuclear from Xia et al. 2022's famine deaths |
| `pandemic_probability_covid_scale`, `covid_excess_deaths` | 2% a year; 14.9M | Marani et al. 2021; WHO |
| `world_population_now`, `life_expectancy_now`, `world_population_long_run` | 8.14bn; 73.5; 10.2bn | World Bank 2024; UN WPP 2024 |
| `@death_ages.population_world_*` | the world's age split | World Bank 5-year bands |
| `cost_per_work_year` | $250k | judgment (McAleese 2025; 990s) |
| `nondeath_losses_vs_deaths` | 0 (0–30%) | judgment, stated so it shows |

A smaller AI or nuclear size (one detonation) needs a sourced forecast in facts/; until then, a named
share in `unmodelled_benefits_adj`.

## Evidence to look for

- Spending by area: Form 990 Part III lines 4a–4d, the accounts' programme notes. Shared costs (government
  relations, fellows) are spread pro rata, the range running from none to all of them.
- Outputs for `evidence_adj`: uptake by labs, governments or international bodies, cited in system cards,
  regulations or treaty texts.
- Wins in the year, for the policy branch: the official record, entry into force, the coalition behind it
  (`attribution_share_shared`).
- Room for more funding for `@next_dollar`: reserves, deficits, funders leaving or arriving.

## Pitfalls

- **Thin by nature**: every branch takes `$missing_data_discount`; nothing about a charity's effect on
  the risk is measured.
- **Don't count a typical project's backfire twice**: it is in the shared cut. `speedup_harm_share` and
  `hazard_harm_share` (side effects) are only for work clearly riskier than typical (capabilities-
  adjacent research, dangerous-capability evaluations, published threat analyses).
- **Don't** type a funder's dollars-per-basis-point bar, an evaluator's own value of the future, or a
  premium for a catastrophe's size. Check the implied cost per basis point against those bars in the
  write-up only.
- The result moves with the AI slider, `$win_years_counted` and the discount rate: say so in the summary.
  Ranges run over orders of magnitude; the summary names the top swing.
