# Template families

Every family has the same sections and shared rows:

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
- **Species step**: the fixed `sads_<s>` → `ced_<s>` row pair per species, swapping AIM's species weight for Rethink Priorities' (normalization.md 2.4).
- **Our view / evaluator view**: our view reads the shared facts and sliders; the evaluator view reproduces an imported sheet at its own rates. A charityevals model has only ours.
- **Shared fact** (`@file.key`): a sourced number in facts/*.json, one value for every model. **Shared assumption** (`$name`, a slider): a value judgment in assumptions/default.json that readers can move.
- **`estimate_basis`**: what the dollar is: `unit_cost` (price per item delivered), `marginal` (the next grant or planned work), `past_average` (past spending over what it won).
- **Canonical row**: a row id every model of a family has, meaning the same (`program_spend`, `total_adj`); listed in src/engine/templates.ts.
- **Invariant (INV-n)**: a site-wide rule over every model (docs/normalization.md section 3); the **lint** (src/engine/lint.ts) checks one model. **Convention n**: the rules below.
- **Measured / thin** (a branch's outcome for this charity): *measured* when the charity's own count of
  who got the intervention meets an effect from its own controlled evaluation or trials of the same
  intervention delivered the same way. *Thin*: reach judged (spending over an assumed cost), an effect judged (care
  with no trial against none) or from other delivery, or no outcome data. A judged baseline,
  counterfactual or attribution never makes a branch thin.
- **Combined range**: audit-model's, every input's range as independent log-space errors.
- **Mobiliser's share** (`$mobiliser_share`, read by the row `mobiliser_share` only): the charity's share
  of the good done with resources others commit only because of it, net of their cost (INV-22).

## What each shared row means

| Row | Meaning (source) |
|---|---|
| `program_spend` | spending on the modelled programme, same year as reach (the audited accounts) |
| `overhead_ratio` | total ÷ programme expenses: management and fundraising spread over every programme by cost |
| `evidence_adj` | trust in the effect size here: internal × external validity; 1 = face value (a judgment anchored on studies) |
| `counterfactual_adj` | share of the outcome that wouldn't have happened anyway (coverage, trend, other providers) |
| `attribution_share_shared` / `attribution_share` | the charity's share among those who paid for or did the same work; the share used (Convention 2) |
| `mobiliser_share` | `$mobiliser_share`, in a win's or research branch's used share (Convention 2) |
| `implementation_adj` | share of reported reach that gets the intervention as studied (monitoring, trackers, the shared fulfilment rate) |
| `leverage_funging_adj` | others would have paid anyway (<1), or the money pulls others in (>1) |
| `unmodelled_benefits_adj` | effects not modelled, each listed as a signed share of modelled value |
| `staff_cost_share`, `salary_gap` | staff's forgone pay, credited by share of resources (Convention 1, else `@staff_pay.share_<kind>`; the gap always `@staff_pay.gap_<kind>`) |
| `marginal_vs_past_average` | past averages only: `@next_dollar.<charity id, - as _>` (`published` 1; normalization.md 2.10, written if missing): the easiest wins come first |
| `years_of_impact`, `years_until_effect`, `wait_discount` | won reforms: `$win_years_counted` (years the win brought the change forward) and the wait to the commitments' deadlines, discounted |

## Conventions (all families)

1. **Canonical rows may be formulas**, if the id exists and means the same:
   `program_spend = program_expenses × program_share` (a judgment anchored on headcount or the
   charity's own description) when costs aren't split by programme; `staff_cost_share = staff_pay /
   total_expenses` when the financials give staff pay (contractors who work like staff count).
2. **Cost is the charity's own spending; credit asks one question** (normalization.md 2.24): would the
   party have committed its resources without the charity? *Yes, a co-funder* (co-advocates,
   co-deliverers, partners, volunteers, donated goods): never in `cost_total`; it lowers
   `attribution_share_shared` to the charity's share among those who paid for or did the same work, at
   cost (unpaid hours at the local wage; goods at market value, off both sides of the overhead ratio). *No, mobilised* (the government that enforces, the company that
   complies, whoever adopts the research): never in that denominator; the branch's used share is
   `<branch>_attribution_share_shared * mobiliser_share` (`"credit": "win"` or `"research"`); the
   win's cost rows read it. Own services, grants and purchases: `"credit": "delivery"`.
   Beneficiaries' own time is no resource. `salary_sacrifice` is only the charity's
   own staff's forgone pay.
3. **Flows, not stocks.** Reach is per year. Multiply by persistence only what was *added* in the period
   (new commitments, institutions, pledges): for a won reform, `$win_years_counted`. An ongoing
   programme's yearly flow counts one year, against one year's cost. Count everything the wins cover,
   delivery only in `implementation_adj`; a stock becomes a flow by the recipes below. A won rule's compliance costs are a negative row in its
   branch (normalization.md 2.21), or one line in an explainer saying why none is counted.
4. **Several branches in one family** (new and pressed commitments; two countries): prefixed rows
   (`new_…`, `acc_…`) summed into `outcome_total`. Branch adjustments are `<branch>_<canonical id>`
   (`acc_evidence_adj`), each applied in its branch; the canonical rows
   are their outcome-weighted averages, labelled "outcome-weighted average of the branches, for reading only".
   No row upstream of `outcome_total` may read those averages (a formula cycle): rows multiplying by
   `total_adj` take each branch's `<branch>_total_adj` and are summed; `<branch>_outcome` reads the
   bridges' result, never a conversion slider (INV-2b). A small grant portfolio across families may be
   one model, a branch per sector on its family's chain.
5. **One question per adjustment.** Years brought forward and the
   counterfactual are one question: a change that would have come anyway gets zero years or a zero
   counterfactual, not both. Completion and dosage lower `implementation_adj` only where the evidence
   shows a dose-response. Validity and delivery adjustments are multipliers; a downside (funging inside
   the organisation, bottlenecks, monitoring errors, harms) is a negative share in
   `unmodelled_benefits_adj`.
6. **Optional rows** (adjustments, waits, splits) always feed `total_adj` or `outcome_total`.
7. **Formulas**: a blend's weight is a row (a ranged judgment), never a literal that hides a choice.
8. **Money over time**: local currency × `@fx.usd_per_<cur>_<year>` (`scripts/link-fx.py`). Several
   years' spending in one year's prices: × `@cpi.<iso3>_<Y> / @cpi.<iso3>_<year>`
   (`python3 scripts/link-cpi.py <ISO3>` adds a country), then the year-Y rate.
9. **Year and programme**: as SKILL.md step 0. A newer run-rate is context or a range end, never
   silently the best guess.
10. **Judgment anchors**: a driving judgment's explainer names its reference class (studies,
    evaluations or data), never another charity or model.
11. **Estimate basis**: keep the template's unless the dollar is another kind, and say why. A past
    average's cost and wins come from the *same period*: `program_spend × average_spend_vs_year`, the
    average real spending over the wins' years (Convention 8) ÷ the modelled year's. Years without
    published accounts: a ranged judgment anchored on the nearest one.
12. **Every programme is modelled; missing data is discounted.** Thin or no outcome data: the family's
    chain from the research on that kind of work (research.md), own spending and reported reach, wide
    ranges; other models only as a named cross-check. Each branch's `<branch>_missing_data_adj` is
    `$missing_data_discount` when thin, 1 when measured (glossary), naming the count and the trial.
13. **Several outcome units**: each in its own unit, entering the output unit only through the
    template's bridge rows (`uov_bridged` → `dalys_from_uov`; normalization.md 2.6).

## direct-health (uov, unit_cost)

Chain: people reached × years of protection × baseline mortality the intervention can reduce × risk
reduction × (1 + `indirect_deaths_ratio`) = deaths averted, valued by age band (`value_per_death`) ×
`$life_value_multiplier`; stillbirths at `@givewell_shared.uov_per_stillbirth`; later-life income
(ln-consumption gain over `@givewell_shared.long_term_benefit_years`, after its wait, discounted,
× `@givewell_shared.resource_sharing_multiplier` × `$uov_per_ln_consumption`); illness as a share of
the deaths' and income's value (`uov_morbidity`, the base of GiveWell's other supplementary shares,
summed in `unmodelled_benefits_adj`).

**Shared figures per programme** (the skeleton reads the nets set; a sourced input where the site has
none):

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

- Baseline mortality: the causes affected, target group and region, today. Prefer an all-cause effect
  from a systematic review (then `indirect_deaths_ratio` is 0); with a cause-specific effect, check
  deaths averted per person-year against the all-cause trial result scaled to today's mortality.
- **Ages**: deaths by age band (research.md), weighted by the programme's reach by country. A split
  another model could reuse goes into facts/death_ages.json as `<cause>_<place>_share_<band>`. Several
  age groups at different risk: a row per group, summed into `deaths_averted_per_person`.
- **Waits**: `gift_to_grant_years` (unspent funds ÷ yearly spending), `delay_years` (to delivery) and
  `benefit_midpoint_years` (half the protection), discounted together in `wait_discount`; interest on
  waiting funds `× (1+interest_yield)^gift_to_grant_years`. The income gain's own wait counts from delivery.
- **Survivors' remaining life**: × `@survival.*_remaining_life_ratio` only where studies show survivors
  live shorter than their age group (cardiac arrest, transfusion, childhood cancer).
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

- Baseline consumption per person per year from a household survey of the people served
  (`@survey_consumption.*`), in the transfer's PPP base; national accounts only × the shared
  `survey_to_na_<iso3>` ratio (a shared conversion, not thin data).
- A benefit stated as a multiple of cash is that multiple × `@cash.uov_per_dollar`; GiveDirectly as a
  destination is `#givewell:givedirectly`, as a comparison `#givedirectly` (read live).
- A gain the programme's own trials measure (graduation, livelihoods): the measured-gain rows replace
  the transfer chain. Every wait before delivery is in `wait_discount`.

## wellbeing (wellby, unit_cost)

Chain: people treated × (initial effect in SD × duration ÷ 2, linear fade, × `discount_factor`) ×
`@wellby_factors.wellbys_per_sd_year` × household multiplier × adjustments; plus deaths averted, in
units of value, entering only through `wellbys_from_uov`.

- PHQ-9 (or PHQ-8) points ÷ `@depression.phq9_sd` for SDs; depression stays in WELLBYs (the lint checks).
- **The charity's own trial and the literature**: one blend, by precision. Rows `prior_effect_sd`,
  `rct_effect_sd` (estimates, CIs as ranges), `prior_effect_se` (from the meta-analysis's *prediction*
  interval; the pooled one only when none is published, said), `rct_effect_se` (CI width ÷ 3.92, worked in the explainer); then
  `rct_weight = (1/(rct_effect_se*rct_effect_se))/(1/(rct_effect_se*rct_effect_se)+1/(prior_effect_se*prior_effect_se))`
  and `initial_effect_sd` the weighted mean. A trial unlike today's programme (dose, population,
  delivery) moves the weight only as a ranged judgment anchored on the precision weight; what the blend
  leaves out goes in `evidence_adj`, with the implied multiple of the trial's effect after all
  adjustments stated. Monitoring data without a control group is a check, not a trial.
- `counterfactual_adj` is 1 when the effect is a trial's against its control arm; below 1 only for
  treatment these clients would get and the controls didn't, or an effect from pre-post data.
- **Suicides averted** (`deaths_averted_per_person`): the yearly suicide rate of the population treated
  (the clients' sex and age band, in their countries, WHO Global Health Estimates; per 100,000 ÷ 100000)
  × (relative risk of suicide with depression − 1) × the share of that excess removed at the end of
  treatment (a judgment) × 0.5 × `effect_duration_years` × `discount_factor`.
- `effect_duration_years` is an input from follow-ups, not initial ÷ decay.

## corporate-campaign (SADs → ced, past_average)

Chain: animals per year under the commitments won or pressed × share not yet compliant ×
`pv_annuity_due(1, $discount_rate, $win_years_counted)` × the discounted wait × SADs per animal-year
(`@sad_factors.*`) × adjustments (`implementation_adj` the shared fulfilment
rate); × `marginal_vs_past_average`; then the species step.

- Count animals per year, not commitments; cite the tracker and the conversion (eggs per hen, birds per
  tonne).
- One fulfilment rate for every model: a charity's own tracker figure never replaces it. Pig, fish and
  shrimp pledges: a ranged judgment.
- **Accountability on a stock of existing pledges** (`acc_`) and new pledges later pressed: the
  recipe in [families/corporate-campaign.md](families/corporate-campaign.md).
- **Two SAD versions in one species** (battery and enriched cages): `sads_per_animal_year` mixes the
  2024 and 2025 figures by a ranged share; a row `<s>_sads_share_2024` (the 2024 figure's share of the
  SADs) splits `sads_per_donor_dollar` into `sads_<s>` (`ced_<s>`, 2024) and `sads_<s>_2025`
  (`ced_<s>_2025`), both in `ced_per_donor_dollar`.
- **Grants to sister organisations or coalition members**: split by activity (its own breakdown, else a
  ranged judgment) for `program_spend`; its wins enter the branch the grant funds, attribution the
  grant's share of its resources on them. A regranting line is never a programme of its own.
- A missing SADs figure goes into facts/sad_factors.json (source, `change` note, SAD version).

## diet-change (SADs → ced, unit_cost)

Chain: meals replaced per year × discounted years (`$win_years_counted` for a won menu or procurement
change, 1 for a year's flow) × `@sad_factors.sads_per_meal_replaced` × `meal_mix_vs_reference` ×
`@sad_factors.production_response` (how much less is produced per meal not bought) × adjustments;
split by `@sad_factors.meal_sads_share_<s>`.

- `meal_mix_vs_reference` is 1 (0.5–2) unless one published estimate compares this country's meal with
  the reference meal the same way; never a per-meal figure from a meat mix of your own, nor a ratio of
  two studies. Alternative proteins replace mostly land meat: a step `alt_protein_mix` =
  `@sad_factors.alt_protein_meal_vs_reference` (its species split in `alt_protein_meal_sads_share_*`);
  milk and eggs read `sads_per_dairy_meal_replaced` and `sads_per_egg_meal_replaced`.
- **Basis**: Convention 11; a year's trainings, events or pledges against that year's spending are
  `unit_cost`.
- **A stock of running wins** (only the meals a year still served under all changes won so far): wins
  per year = `(meals a year still running + lapsed) ÷ the campaign's years`, against the average real
  spending over those years; never the flow ÷ the changes' average age.
- Self-reported change: social desirability and attrition in `evidence_adj`. Institutional changes:
  `implementation_adj` is the share of pledged meals served.

## policy-research-meta (uov, wellby, SADs → ced or tco2e; past_average)

Branches summed into `outcome_total`:

- **Policy or research won**: units per year × value per unit-year × `p_success` × discounted
  `$win_years_counted` × the discounted wait, × adjustments. The value per unit-year uses the shared
  figures a direct model would, or reads the downstream model live (`#model-id`).
- **Money moved or raised**: `money_moved × moved_dollar_net_value` (below).
- **Aid or public money won or kept** is worth what that aid does: its known use's figure (a downstream
  model live, `@givewell_shared.cf_value_*`, or recipients' gain less payers' cost, both on the survey
  scale), else `@aid_value.humanitarian_vs_cash` or `@aid_value.oda_vs_cash` × `@cash.uov_per_dollar`;
  never a model's own multiple.
- **Career changes**: `careers_changed × career_change_value × careers_missing_data_adj`.
- Downstream WELLBYs: rename `uov_*` to `wellbys_*`, unit `wellby`. Animals: `sads_*` and the species
  section. Climate (`tco2e`): the climate skeleton (normalization.md 2.5).

**Money moved** (shared rows verbatim, INV-12: `python3 scripts/moved-money.py <model> <set> net <cause>`;
how each read is valued: the header of src/engine/moved-money.ts):

- `money_moved` = donations recorded × recording (unrecorded giving) × own effect (its donor survey,
  else `@meta.own_effect_share`); never an evaluator's multiplier or effectiveness step.
- Pledges: new pledges × yearly giving × discounted years by `@meta.pledge_recording_*`
  (floor + (first − floor) × (1 − decay)^t).
- A published split: set `own-split`, weights `@meta.<org>_moved_*`: recipients at `#owner:charity`
  (`#id` only without one), funds that follow an evaluator at its charities, the rest at
  `#cause:<cause or area>` (never a typed list), meta and unmodelled causes the average of the rest,
  below the organisation's own bar `@meta.prior_vs_cash × #givedirectly`. No split: the cause's set.
  Not yet proven: `@meta.success_chance_new_org` and the success step. Each destination brings its
  own missing-data step. Not a `"destinations"` model (a grantmaker, an advocate's money moved)? List
  every grantee, destination and prior reference in `destination_reads`.
- Research or advice that changes where money is spent: `informed_money` (a judged share of the money
  it informed, all shifted) at `informed_money_value` (set `informed`), never in `donor_cost_share`
  (`money_moved` stays gross). A second destination set: the same rows prefixed `<set>_`
  (`moved-money.ts set <set> <destination>`). A split across causes: the prior by the same shares
  (cause `<share fact>=<cause>,...`).
