# To do after the evaluator review (2026-11-09)

From reading GWWC's evaluations of evaluators, ACE's email and RP's cross-cause model
(sources/evaluator-skill/). Done the same day: estimates over 5 years old leave the rankings by
default (normalization.md 2.15).

## To build

- [ ] **Second-order effects for every charity.** Collect them first; don't model yet. One place for
  everything a model's main chain leaves out. It would subsume:
  - RP's outcome risk: a campaign that fails, does nothing, or backfires, each with a probability;
  - ACE's list: spillovers it couldn't quantify, effects of programmes without a CEA, and outside
    factors that changed since the estimate;
  - existing optional rows that already do part of this (`unmodelled_benefits_adj`, leverage and
    funging), so there's one way rather than three.
- [ ] **Theory of change for every charity, and the model covers all of it.** Today build-cea models
  every programme by spending (decided 2026-11-03), but nothing writes down the causal chain. Nothing
  checks that each step of it has a row, either. Imported models cover only what the evaluator
  modelled: ACE says its CEAs cover particular programmes, not whole charities. Proposal:
  - each write-up lists the steps from money to outcome and names the row that covers each one;
  - a step with no row becomes a second-order effect (above), not a note.
- [ ] **When a charity's own monitoring disagrees with the research literature.** The missing-data
  discount (normalization.md 2.12) covers missing data, not data that conflicts. GWWC's case:
  Friendship Bench's low attendance and monitoring results, with effects well below the
  meta-analysis HLI relied on. Needed: one rule for combining the two, weighted by each one's
  precision, in build-cea and audit-cea.
- [ ] **Next dollar vs past average, per charity.** Today it's one blanket 50% slider, and only on
  `past_average` models. `unit_cost` models assume the next item costs the same, and nothing uses a
  charity's own funding gap or budget path. Better:
  - use the charity's budget history from its financials to get a ratio from a returns curve
    (normalization.md 2.10: under logarithmic returns, (1 − B₀/B) / ln(B/B₀));
  - use its stated funding gap, and whether it over- or undershot its budget (ACE's factors);
  - apply the same curve to `unit_cost` models where scaling has bottlenecks.

  This replaces open proposal 11 in section 5 (no adjustment by age or size).
- [ ] **Automated outreach to charities for review**, once we're confident in the models: send each
  charity its model, and record any corrections and statements (docs/permissions.md style).
- [ ] **Check past estimates against what happened**, as GiveWell reviews its grant forecasts. For now:
  record each model's headline and its key forecasts with dates, so we can score them later.

## Decided against (2026-11-09)

- Ranking by a probability distribution instead of the best guess: readers set their own values.
- Pulling a charity's result towards its intervention class, or flagging results over 10× from it:
  there's no reason they should agree.
- An RP moral-weights preset.
- A public corrections log beyond the git history the site already shows.
- A separate recommendation bar: the missing-data discount and the warning signs do that job.
