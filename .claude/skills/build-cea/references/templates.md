# Template families

Every family has the same sections and shared rows, so any two models read side by side:

```
cost         program_spend, total_expenses, program_expenses → overhead_ratio → cost_total
reach        how many units (people, households, animals, meals) the spending reached
effect       what one unit gets, from the evidence, before adjustments
adjustments  evidence_adj × counterfactual_adj × attribution_share [× implementation_adj]
             [× leverage_funging_adj] [× wait_discount] × missing_data_adj = total_adj
             (+ unmodelled_benefits_adj)
outcome      outcome_total (native unit) → <prefix>_per_dollar = outcome_total / cost_total  (output.native)
donor        (ours) staff_cost_share, salary_gap (@staff_pay) → salary_sacrifice → donor_cost_share
             [marginal_vs_past_average, past averages only] → <prefix>_per_donor_dollar
species      (ours, animal families) sads_<s> → ced_<s> → ced_per_donor_dollar (the output, unit ced)
bridges      (ours) other units' outcomes into the output unit, fixed rows (normalization.md 2.6)
extras       deaths (wellbeing), moved_money and careers (policy-research-meta), conversion (climate)
```

Skeletons: `../templates/<family>.json` (from `../scripts/gen-templates.py`); src/engine/templates.ts
lists each family's required rows, bounds, basis and shared reads, which the lint enforces.

## Glossary

- **DALY**: disability-adjusted life year, a year of healthy life lost; the site's scale is DALYs averted per $1,000.
- **uov** (units of value): GiveWell's unit for income and deaths on one scale; `$uov_per_daly` (2) make one healthy year.
- **WELLBY**: one point of life satisfaction (0–10) for one person for a year; × `$daly_per_wellby` gives healthy years.
- **SAD** (suffering-adjusted day, Ambitious Impact's): a day of an animal's disabling pain, milder pain as a fraction, AIM's species weight built in (the 2024 and 2025 versions differ in it).
- **ced** (chicken-equivalent pain day): a day of disabling pain in a chicken; animal models' output unit.
- **Species step**: the fixed `sads_<s>` → `ced_<s>` rows, one pair per species, that swap AIM's species weight for Rethink Priorities' welfare range (normalization.md 2.4); the split by species is a fact or ranged judgment.
- **Our view / evaluator view**: our view reads the shared facts and sliders; the evaluator view reproduces an imported sheet at its own rates. A charityevals model has only ours.
- **Shared fact** (`@file.key`): a sourced number in facts/*.json, one value for every model. **Shared assumption** (`$name`, a slider): a value judgment in assumptions/default.json that readers can move (discount rate, value of a life).
- **`estimate_basis`**: what the dollar is: `unit_cost` (price per item delivered), `marginal` (the next grant or planned work), `past_average` (past spending over what it won).
- **Canonical row**: a row id every model of a family has, meaning the same (`program_spend`, `total_adj`); listed in src/engine/templates.ts.
- **`total_adj`**: the product of the adjustment multipliers.
- **Invariant (INV-n)**: a site-wide rule computed over every model (listed with reasons in docs/normalization.md section 3); the **lint** (src/engine/lint.ts) checks one model's sources, ranges, constants and required rows. **Convention n**: the numbered rules below.
- **Measured / thin** (a branch's outcome for this charity): *measured* when the charity's own count of
  who got the intervention meets an effect with a credible counterfactual (its own controlled
  evaluation, or trials of the same intervention delivered the same way: doses delivered and an RCT's
  effect); *thin* when its reach or effect is a judgment, the effect is from other delivery than the
  charity's, or the programme has no outcome data. Thin takes `$missing_data_discount`.
- **Combined range**: audit-model's `Combined range`, every input's range combined as independent errors in log space (a 90% interval if each range is one). Joint low–high, every input at its worst or best at once, is the extreme case.

## What each shared row means

| Row | Meaning | Typical source |
|---|---|---|
| `program_spend` | spending on the modelled programme, same year as reach | the audited accounts |
| `overhead_ratio` | total ÷ programme expenses: spreads management and fundraising | the same |
| `evidence_adj` | trust in the effect size here: internal × external validity; 1 = face value | judgment, anchored on another model of the intervention |
| `counterfactual_adj` | share of the outcome that wouldn't have happened anyway | coverage, trend, other providers |
| `attribution_share_shared` / `attribution_share` | the charity's share of all resources behind the outcome | co-funders, partners, volunteers (Convention 2) |
| `implementation_adj` | share of reported reach that gets the intervention as studied | monitoring data, trackers, the shared fulfilment rate |
| `leverage_funging_adj` | others would have paid anyway (<1), or the money pulls others in (>1) | funding-gap data; judgment |
| `unmodelled_benefits_adj` | effects not modelled, as a share of modelled value, each with its sign | list each |
| `staff_cost_share`, `salary_gap` | staff's forgone pay, counted with credit by share of resources | salaries ÷ expenses from the financials, else `@staff_pay.share_<kind>`; the gap always `@staff_pay.gap_<kind>` |
| `marginal_vs_past_average` | past averages only: `$marginal_vs_past_average` (`published` 1): the easiest wins come first | the shared slider (normalization.md 2.10) |
| `years_of_impact`, `years_until_effect`, `wait_discount` | won reforms: `$win_years_counted` (years the win brought the change forward) and the discounted wait | the shared slider; the commitments' deadlines |

## Conventions (all families)

1. **Canonical rows may be formulas**, if the id exists and means the same:
   `program_spend = program_expenses × program_share` (a judgment anchored on headcount or the
   charity's own description) when costs aren't split by programme; `staff_cost_share = staff_pay /
   total_expenses` when the financials give staff pay (contractors who work like staff count).
2. **Cost is the charity's own spending.** Money or in-kind work by co-funders, governments, partners or
   volunteers never goes into `cost_total`; it lowers `attribution_share_shared` to the charity's share
   of all resources, with `$resource_shares` on or off. Value government staff time and partners'
   delivery at their cost, and volunteers' unpaid hours (beyond stipends the charity pays) at the
   local wage. `salary_sacrifice` is only the charity's own staff's forgone pay.
3. **Flows, not stocks.** Reach is per year. Multiply by persistence only what was *added* in the period
   (new commitments, institutions, pledges): for a won reform, `$win_years_counted`. An ongoing
   programme's yearly flow counts one year, against one year's cost. Count everything the period's wins
   cover, delivery in `implementation_adj`: never a delivered-only count with the fulfilment rate
   (delivery would count twice). A stock reported as a total becomes a flow by the recipes below.
4. **Several branches in one family** (new and pressed commitments; two countries): prefixed rows
   (`new_…`, `acc_…`) summed into `outcome_total`. Branch adjustments are `<branch>_<canonical id>`
   (`acc_evidence_adj`, `acc_years_until_effect`, …), each applied in its branch; the canonical rows
   are their outcome-weighted averages, labelled "outcome-weighted average of the branches, for reading only".
5. **One question per adjustment**, so no doubt is counted twice. Years brought forward and the
   counterfactual are one question: a change that would have come anyway gets zero years or a zero
   counterfactual, not both. Completion and dosage lower `implementation_adj` only where the evidence
   shows a dose-response. Validity and delivery adjustments are multipliers; a downside (funging inside
   the organisation, bottlenecks, monitoring errors, harms) is a negative share in
   `unmodelled_benefits_adj`.
6. **Optional rows** (`implementation_adj`, `leverage_funging_adj`, `unmodelled_benefits_adj`, discounted
   waits, branch or country splits) always feed `total_adj` or `outcome_total`.
7. **Formulas**: weighted blends with a weight row (a judgment with a range), never a literal that
   hides a choice.
8. **Money over time**: local currency as an input × `@fx.usd_per_<cur>_<year>` (`scripts/link-fx.py`).
   Several years' spending in one year's prices: × `@cpi.<iso3>_<Y> / @cpi.<iso3>_<year>`
   (`python3 scripts/link-cpi.py <ISO3>` adds a country), then the year-Y rate.
9. **Year and programme**: as SKILL.md step 0. A newer run-rate is context or a range end, never
   silently the best guess.
10. **Judgment anchors**: a judgment that drives the result names its reference class in the explainer.
11. **Estimate basis**: keep the template's unless the dollar is another kind, and say why (a unit price
    per item installed is `unit_cost`; won menu or procurement changes against what winning them cost,
    `past_average`). A past average's cost and wins come from the *same period*: `program_spend ×
    average_spend_vs_year`, the average real spending over the wins' years (Convention 8) ÷ the
    modelled year's. Years without published accounts: a ranged judgment anchored on the nearest one.
12. **Every programme is modelled; missing data is discounted.** Thin or no outcome data: the family's
    chain from the research on that kind of work (research.md), the programme's own spending and
    reported reach, wide ranges; other models only as a cross-check named in the explainer, never the
    value. Each branch's `total_adj` has `missing_data_adj` (`<branch>_missing_data_adj`):
    `$missing_data_discount` when thin (glossary), else 1 with what was measured; the lint enforces it
    where reach or effect is judgment only. The summary names the discounted branches.
13. **Several outcome units** (the new families): each outcome in its own unit, entering the output
    unit only through the template's bridge rows (`uov_bridged` → `dalys_from_uov`; normalization.md
    2.6), never a rate typed between them.

## direct-health (uov, unit_cost)

Chain: people reached × years of protection × baseline mortality the intervention can reduce × risk
reduction × (1 + `indirect_deaths_ratio`) = deaths averted, valued by age band (`value_per_death`) ×
`$life_value_multiplier`; stillbirths at `@givewell_shared.uov_per_stillbirth`; later-life income
(ln-consumption gain over `@givewell_shared.long_term_benefit_years`, after its wait, discounted,
× `@givewell_shared.resource_sharing_multiplier` × `$uov_per_ln_consumption`); illness as a share of
the deaths' and income's value (`uov_morbidity`, the base of GiveWell's other supplementary shares,
summed in `unmodelled_benefits_adj`); every wait discounted in `wait_discount`.

**Shared figures per programme.** The skeleton reads the insecticide-net set; point each row at its
programme's fact, or a sourced input where the site has none:

| Row | Nets, SMC | Vitamin A, iron | Vaccination incentives | Deworming | Water treatment |
|---|---|---|---|---|---|
| `indirect_deaths_ratio` | `@givewell.indirect_malaria_deaths_per_direct_malaria_death_2` | 0 if the effect is all-cause | 0 if all-cause | 0 | `@givewell_shared.indirect_deaths_per_direct_diarrhea_death` |
| `morbidity_value_ratio` | `@givewell_common.malaria_morbidity` | estimate | `@givewell_common.morbidity_effects_from_directly_incentivized_vaccines_a` | estimate | estimate |
| `internal_validity_adj` | `…internal_validity_adjustment_malaria` | `…_vas_iron` | the trial's `…internal_validity_adjustment_*` fact | judgment | `…_for_morbidity` |
| `rebound_share` | `@givewell_common.rebound_effects_decreased_immunity_development` (also malaria vaccines) | 0 | 0 | 0 | 0 |
| `investment_of_income_share` | nets `…_nets`, SMC `@givewell_shared.investment_of_income_increases` | `…_vas` | `…_increases` | `…_deworming` | `…_increases` |
| `years_until_income_gain` | `…years_until_income_benefits_malaria` / `_smc` | `_iron`, else the study's | the study's | `_deworming` | the study's |

`treatment_costs_share` (`@givewell_shared.treatment_costs_averted`; 0 for treatment programmes),
`resource_sharing_multiplier` and `years_income_gain_lasts` are the same for every programme.

- Baseline mortality: the causes affected, target group and region, today. Prefer an all-cause effect from a systematic
  review (then `indirect_deaths_ratio` is 0); with a cause-specific effect keep it, and check deaths
  averted per person-year against the all-cause trial result scaled to today's mortality.
- **Ages**: deaths by age band (research.md), weighted by the programme's reach by country. A split another model
  could reuse goes into facts/death_ages.json as `<cause>_<place>_share_<band>`, read by the rows. Several
  age groups at different risk: a row per group, summed into `deaths_averted_per_person`.
- **Waits**: `gift_to_grant_years` (unspent funds ÷ yearly spending), `delay_years` (to delivery) and
  `benefit_midpoint_years` (half the protection), discounted together; interest on waiting funds
  `× (1+interest_yield)^gift_to_grant_years`. The income gain's own wait counts from delivery.
- Illness in one place only: `morbidity_value_ratio`, `unmodelled_benefits_adj` or, in DALYs,
  `dalys_illness_averted_per_person` (hospitals and hospices in rich countries: families/high-income-care.md).
- A cost-share attribution uses the same unit basis as `implementation_adj` (partner cost per dose
  received: divide by `implementation_adj`, or the shortfall counts twice).
- Cash handed out with the service (conditional incentives): a `uov_cash` branch valued as
  cash-income does, in `outcome_total`.

## cash-income (uov, unit_cost)

Chain: cost × transfers' share ÷ transfer size = households × `@household_size.<place>`; transfer per
person in PPP (`@<country>.ppp_factor_2017`); ln(1 + consumed share × transfer / baseline consumption)
in year 1, × (1 + later years' gains, discounted); × people × `$uov_per_ln_consumption`; plus
spillovers and mortality as ratios.

- Baseline consumption per person per year, in the transfer's PPP base.
- Household size is the place's fact (rural where recipients are rural); the recipients' own
  size only with that reason stated.
- A benefit stated as a multiple of cash is that multiple × `@cash.uov_per_dollar`; GiveDirectly as a
  destination or comparison is `#givedirectly` (read live).
- Recurring income gains: `ln(1+gain/baseline) × pv_annuity_due(1,$discount_rate,persistence_years)`,
  persistence from follow-up studies.

## wellbeing (wellby, unit_cost)

Chain: people treated × (initial effect in SD × duration ÷ 2, linear fade, × `discount_factor`) ×
`@wellby_factors.wellbys_per_sd_year` × household multiplier × adjustments; plus deaths averted, in
units of value, entering only through `wellbys_from_uov` (so they don't move with the WELLBY slider).

- PHQ-9 (or PHQ-8) points ÷ `@depression.phq9_sd` for SDs. Never depression to DALYs inside the model.
- **The charity's own trial and the literature**: one blend, by precision. Rows `prior_effect_sd`,
  `rct_effect_sd` (estimates, CIs as ranges), `prior_effect_se` (from the meta-analysis's *prediction*
  interval; the pooled one only when none is published, said), `rct_effect_se` (CI width ÷ 3.92, worked in the explainer); then
  `rct_weight = (1/(rct_effect_se*rct_effect_se))/(1/(rct_effect_se*rct_effect_se)+1/(prior_effect_se*prior_effect_se))`
  and `initial_effect_sd` the weighted mean. A trial unlike today's programme (dose, population,
  delivery) moves the weight only as a ranged judgment anchored on the precision weight; what the blend
  leaves out goes in `evidence_adj`, with the implied multiple of the trial's effect after all
  adjustments stated. Monitoring data without a control group is a check, not a trial.
- `counterfactual_adj` is 1 when the effect is a trial's against its control arm (care as usual is
  already netted out); below 1 only for treatment these clients would get and the controls didn't, or
  an effect from pre-post data.
- **Suicides averted** (`deaths_averted_per_person`): the yearly suicide rate of the population treated
  (the clients' sex and age band, in their countries, WHO Global Health Estimates; per 100,000 ÷ 100000)
  × (relative risk of suicide with depression − 1) × the share of that excess removed at the end of
  treatment (a judgment) × 0.5 × `effect_duration_years` × `discount_factor`: the risk falls with the
  effect and the deaths come over its years, discounted like the WELLBYs.
- `effect_duration_years` is an input from follow-ups, not initial ÷ decay.

## corporate-campaign (SADs → ced, past_average)

Chain: animals per year under the commitments won or pressed × share not yet compliant ×
`pv_annuity_due(1, $discount_rate, $win_years_counted)` × the discounted wait × SADs per animal-year
(`@sad_factors.*`, one figure per change) × adjustments (`implementation_adj` the shared fulfilment
rate); × `marginal_vs_past_average`; then the species step.

- Count animals per year, not commitments; cite the tracker and the conversion (eggs per hen, birds per
  tonne). `years_until_effect` from the commitments' deadlines.
- A fulfilment rate the charity reports from the same tracker the shared rate is built from never
  replaces the shared rate (it is the same evidence, and every model must keep pledges at one rate).
  Pig, fish and shrimp pledges have no shared record: a ranged judgment.
- **Accountability on a stock of existing pledges** (`acc_`): one year's pressure gets one year's share
  of the compliance it causes, anchored on the observed pace:
  - `acc_switched_per_year`: animals that came out of cages in the year under the pledges pressed (published
    by the charity or a tracker). Observed switches are delivered already: no
    `implementation_adj`, no division by years of pressure. Without a count: the pressed stock (all
    animals under the pledges) × `implementation_adj` ÷ `acc_years_pressed` (start of the pressure to
    the deadlines, a judgment).
  - `acc_counterfactual_adj`: the share of those switches that wouldn't have come *yet* without the
    pressure (anchored on pressed against unpressed pledges in the tracker). Each counts
    `$win_years_counted` years, so never "would it ever have come" (Convention 5).
  - `acc_years_until_effect`: the lag from pressure to switch (0–2 years), not the time to every deadline.
  - New pledges of the year (`new_`) take `1 − share later pressed × acc_counterfactual_adj`, since
    later pressure is credited to later years' accountability.
- **Two SAD versions in one species** (battery and enriched cages): `sads_per_animal_year` mixes the
  2024 and 2025 figures by a ranged share; a row `<s>_sads_share_2024` (the 2024 figure's share of the
  SADs) splits `sads_per_donor_dollar` into `sads_<s>` (`ced_<s>`, 2024) and `sads_<s>_2025`
  (`ced_<s>_2025`), both in `ced_per_donor_dollar`.
- **Grants to sister organisations or coalition members** count as what the recipient does with them:
  split by activity (its own breakdown, else a ranged judgment) for `program_spend`;
  its wins enter the branch the grant funds, attribution the grant's share of its resources on them. A regranting line is never a programme of its own.
- A missing SADs figure goes into facts/sad_factors.json (source, `change` note, SAD version).

## diet-change (SADs → ced, unit_cost)

Chain: meals replaced per year × discounted years (`$win_years_counted` for a won menu or procurement
change, 1 for a year's flow) × `@sad_factors.sads_per_meal_replaced` × `meal_mix_vs_reference` ×
`@sad_factors.production_response` (how much less is produced per meal not bought) × adjustments;
split by `@sad_factors.meal_sads_share_<s>`.

- `meal_mix_vs_reference` is 1 (0.5–2) unless one published estimate compares this country's meal with
  the reference meal the same way; never a per-meal figure from a meat mix of your own, nor a ratio of
  two studies.
- **Basis**: Convention 11 (estimate basis); a year's trainings, events or pledges against that year's
  spending are `unit_cost`.
- **A stock of running wins.** When the charity reports only the meals a year still served under all
  changes won so far (or a cumulative total), the wins per year are `(meals a year still running +
  meals a year of changes that lapsed) ÷ the campaign's years`, against the average real spending over
  the same years. Never the year's flow ÷ the changes' average age.
- Self-reported change: social desirability and attrition in `evidence_adj`. Institutional changes:
  `implementation_adj` is the share of pledged meals served. Production response always applies.

## policy-research-meta (uov, wellby, SADs → ced or tco2e; past_average)

Three branches summed into `outcome_total`, each 0 with a reason where it doesn't apply:

- **Policy or research won**: units per year × value per unit-year × `p_success` × discounted
  `$win_years_counted` × the discounted wait, × adjustments. The value per unit-year uses the shared
  figures a direct model would, or reads the downstream model live (`#model-id`). `p_success` needs a
  reference class.
- **Money moved or raised**: `money_moved × moved_dollar_net_value`, the shared rows word for word
  (`python3 scripts/moved-money.py` for another destination set); a not-yet-proven organisation takes
  `@meta.success_chance_new_org` and the shared success step.
- **Career changes**: `careers_changed × career_change_value × careers_missing_data_adj`. Money
  moved is measured dollars: no missing-data step.
- Downstream WELLBYs: rename `uov_*` to `wellbys_*`, unit `wellby`. Animals: `sads_*` and the species
  section. Climate (`tco2e`, tonnes of CO₂-equivalent averted): the climate skeleton (normalization.md 2.5).
- Usually dominated by judgment; say so in the summary.
