# Template families

Every family uses the same six sections and the same shared rows, so any two charityevals models
can be read side by side:

```
cost         program_spend, total_expenses, program_expenses → overhead_ratio → cost_total
reach        how many units (people, households, animals, meals) the spending reached
effect       what one unit gets, from the evidence, before adjustments
adjustments  evidence_adj × counterfactual_adj × attribution_share [× implementation_adj]
             [× leverage_funging_adj] = total_adj   (+ unmodelled_benefits_adj where GiveWell uses one)
outcome      outcome_total (shared unit) → <unit>_per_dollar = outcome_total / cost_total
donor        staff_cost_share, salary_gap → salary_sacrifice → donor_cost_share
             → <unit>_per_donor_dollar (the output)
```

The skeletons are in `../templates/<family>.json`; the required rows and plausible bounds that
`npm run check` enforces are in `src/engine/templates.ts`. The structures were extracted from the
evaluator models already in the repo: GiveWell's GiveDirectly and AMF models (cash, direct health),
HLI's StrongMinds model (wellbeing), ACE's The Humane League and Sociedade Vegetariana Brasileira
models (corporate campaigns, diet change), and the shared "Your dollar's share" block every
model carries.

## What each shared row means

| Row | Meaning | Typical source |
|---|---|---|
| `program_spend` | spending on the modelled program, same year as reach | audited statement of functional expenses, Form 990 Part IX, annual report |
| `overhead_ratio` | total ÷ program expenses: spreads management and fundraising over programs | same document |
| `evidence_adj` | how far to trust the effect size here: internal validity (bias, publication bias, self-report) × external validity (different setting, population, implementer). 1 = face value | judgment, anchored on the evaluator adjustments for the same intervention |
| `counterfactual_adj` | share of the outcome that wouldn't have happened anyway in this setting | coverage data, trend data, other providers |
| `attribution_share_shared` / `attribution_share` | share of credit when others contributed; `if($full_credit, 1, …)` | coalition/co-funder information; judgment |
| `implementation_adj` | share of reported reach that gets the intervention as studied (adherence, coverage-survey vs. admin data, pledges honoured) | monitoring data, trackers |
| `leverage_funging_adj` | would governments or other funders have paid anyway (<1), or does the money pull others in (>1)? | funding-gap data; judgment |
| `unmodelled_benefits_adj` | effects not modelled, as a share of modelled value (GiveWell-style supplementary adjustments) | list each, with sign and size |
| `staff_cost_share`, `salary_gap` | for the salary-sacrifice accounting toggle | financials; reference class in the repo (≈15% gap for delivery charities, 35% for advocacy) |

## Conventions (all families)

These settle the questions the development runs kept hitting; follow them so models stay comparable.

1. **Canonical rows may be formulas.** The id must exist and mean the same thing; how it is computed
   is up to the model. `program_spend = program_expenses × program_share` (a judgment, anchored on
   headcount or the charity's own description) when the charity doesn't split costs by program;
   `staff_cost_share = staff_pay / total_expenses` when the financials give staff pay.
2. **Cost is the charity's own spending.** `cost_total` is what this charity spent (with its overhead).
   Money or in-kind work by co-funders, governments or partners never goes into `cost_total`; it
   lowers `attribution_share_shared`, typically to the charity's share of the total cost of the
   outcome. That keeps `$full_credit` meaningful: on, the charity gets the whole outcome for its own cost.
3. **Flows, not stocks.** Reach is per year. Multiply by persistence (`years_of_impact`,
   `pv_annuity_due`) only for what was *added* in the period (new commitments, new institutions,
   new pledges). A year's total flow from an ongoing program (all partner institutions' meals this
   year) is credited for one year, against one year's cost.
4. **Several branches in one family** (new commitments and accountability; two countries): give each
   branch its own prefixed rows (`new_…`, `acc_…`) and sum the branches into `outcome_total`. Keep the
   canonical adjustment rows as outcome-weighted averages of the branches (formulas), so they still
   read as "the model's" counterfactual, attribution and implementation, and say so in the explainer.
   Name branch adjustments `<branch>_<canonical id>` (`acc_counterfactual_adj`) and apply them in
   each branch; the canonical averages then stay outside the result's path (the lint accepts that
   only when every branch's own row reaches the result), so nothing is discounted twice.
5. **One question per adjustment.** Years brought forward and the counterfactual answer the same
   question for accountability work: hens that would have switched on time get either zero years or
   a zero counterfactual, not both. Completion and dosage reduce `implementation_adj` only where the
   evidence shows a dose-response.
6. **Optional rows** a family may add when the evidence calls for them, always feeding `total_adj` or
   `outcome_total`: `implementation_adj`, `leverage_funging_adj`, `unmodelled_benefits_adj`,
   `delay_years` (funding-to-benefit delay, discounted with `$discount_rate`), `indirect_deaths_ratio`
   (direct-health), country- or branch-level splits.
7. **Formulas**: averages with `avg(a, b)`, weighted blends with a weight row (a judgment with a
   range), never a literal 0.5 or 2 that hides a choice.
8. **Currency**: an input `fx_<cur>_per_usd` (local units per US dollar, the year's average) and a
   formula dividing by it. Never a constant in a formula.
9. **Which year**: the latest year with audited financials *and* reach data for the same period.
   A newer run-rate (cheaper current cost per person) goes in the explainer as context, or as the
   high end of a range, never silently as the best guess.
10. **Staffing**: count contractors who work like staff (e.g. Brazilian PJ consultants) in
   `staff_cost_share`; the pay gap is relative to what they'd earn elsewhere.
11. **Judgment anchors**: a judgment that drives the result names its reference class in the
    explainer (another model's value, a published estimate, a tracker's rate).

## direct-health (uov)

Chain: people reached × years of protection × baseline mortality the intervention can reduce ×
relative risk reduction = deaths averted; plus illness (YLDs × `$uov_per_daly`) and later-life
income (ln-consumption × `$uov_per_ln_consumption`). Deaths are valued with GiveWell's weights:
`@moral_weights.uov_per_death_under5` / `uov_per_death_over5`, times `$life_value_multiplier`.

- Baseline mortality is the rate *from the causes the intervention affects*, in the target age
  group and region, today (mortality has fallen since most trials: say how you adjusted).
- Prefer the effect on all-cause mortality from a systematic review; if you use cause-specific
  mortality × cause share, add `indirect_deaths_ratio` (deaths the disease causes indirectly, per
  direct death) and check deaths averted per person-year against the all-cause trial result,
  scaled to today's mortality. Counting direct deaths only undercounts badly for malaria.
- If the intervention protects several age groups, add a row per group and sum into
  `deaths_averted_per_person`; set `share_under5` from the result.
- Don't count illness both in `dalys_averted_per_person` and in `unmodelled_benefits_adj`.
- A cost-share attribution (the charity's cost ÷ everyone's cost per unit) must use the same unit
  basis as `implementation_adj`: if partner costs are per dose actually received, divide by
  `implementation_adj` or the delivery shortfall is counted twice.
- Programs that also hand out cash (conditional incentives) add a `uov_cash` branch valued like
  the cash-income template (ln-consumption × `$uov_per_ln_consumption`) and sum it into `outcome_total`.

## cash-income (uov)

Chain: cost × transfers' share ÷ transfer size = households; transfer per person in PPP;
ln(1 + consumed share × transfer / baseline consumption) in year 1, times (1 + later years'
ratio); × people × `$uov_per_ln_consumption`; plus spillovers and mortality as ratios.

- Baseline consumption must be per person, per year, in the same PPP base as the transfer
  (2017 international $ via `@<country>.ppp_factor_2017`).
- For recurring income gains (livelihoods, agriculture), replace year-1/later-years with
  `ln(1 + gain / baseline) × pv_annuity_due(1, $discount_rate, persistence_years)`, with persistence
  from follow-up studies.

## wellbeing (wellby)

Chain: people treated × (initial effect in SD × duration ÷ 2, linear decay) × `@wellby_factors.wellbys_per_sd_year`
× household multiplier (`1 + (household size − 1) × spillover ratio`) × adjustments.

- Use the charity's own trial or M&E only with an evidence discount (response bias, no control
  group, attrition); blend with the meta-analytic prior and say how.
- Completion and dosage go into `implementation_adj`, not into the effect size, and only where the
  evidence shows a dose-response.
- `effect_duration_years` may be an input (from follow-up studies) instead of initial ÷ decay;
  with the formula, the effect size enters twice, so the joint range overstates the uncertainty.
- When `evidence_adj` is calibrated against a charity-specific RCT, state the implied multiple of
  that RCT's effect after all adjustments, so the reader can see nothing is discounted twice.

## corporate-campaign (sad)

Chain: animals per year in the covered supply chains × share not yet compliant × discounted years
the reform is brought forward × SADs averted per animal-year (`@sad_factors.*`) × adjustments
(compliance is `implementation_adj`).

- Count animals per year, not commitments; cite the tracker and the conversion (eggs per hen,
  birds per tonne).
- `years_of_impact` is how much earlier the reform happens than without the work, not how long it
  lasts. For accountability work on existing pledges, `counterfactual_adj` is the share of
  compliance that wouldn't have happened without the pressure.
- A SAD factor missing from `facts/sad_factors.json` (fish, shrimp, pigs) goes there with a source
  (Ambitious Impact's SADs, Rethink Priorities' welfare ranges), not inline.

## diet-change (sad)

Chain: meals replaced per year × discounted years of persistence × `@sad_factors.sads_per_meal_replaced`
× `@sad_factors.production_response` × adjustments.

- Self-reported diet change is inflated: put social-desirability and attrition into `evidence_adj`.
- Institutional changes: `implementation_adj` is the share of planned/pledged meals actually served.
- Production response (fewer meals bought lowers production by less than one for one) is always
  applied; it is why charityevals' diet-change numbers sit below ACE's.

## policy-research-meta (uov, sad or wellby)

Chain: units affected per year × value per unit-year (from another charityevals model of the
downstream intervention, cited) × probability the change happens because of this work ×
discounted years it is brought forward × adjustments. For money moved or research, the "units"
are dollars influenced and the value per unit is the downstream charity's value per dollar,
minus what that money would have done anyway (`counterfactual_adj`).

- `p_success` needs a reference class (share of similar bills passed, similar campaigns won).
- Rename the per-dollar rows to `sads_per_dollar`/`wellbys_per_dollar` when the downstream unit isn't uov.
- These models are usually dominated by judgment; say so in the summary.
