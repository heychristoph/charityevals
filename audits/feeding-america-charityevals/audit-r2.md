# Audit: feeding-america-charityevals, round 2

Result: 1.830e-5 daly/$ = 0.01830 years of healthy life per $1,000 (combined range 0.0036–0.094); cause median 0.253 (×0.072). Verdict: **pass**.
Model-sha: f42a96650afef9b5b215278de7f74f03f84db5507addf8e84816e00cd2aa7d08

Scope: unchanged from round 1: member services, food procurement and programs, FY2025, in Feeding America's own cash less the members' repayments, $221.5m × overhead 1.303 = cost_total $288.7m. The advocacy model takes the other $48.9m, so costs are disjoint. The child hunger and food-as-medicine grants are now argued to be part of the food branch (they hand out network food), with their cost in `food_attribution_share`'s numerator. That settles finding 6 as an alternative fix: their food is already in the pounds counted, and the health effect of food is stated as not modelled. Split at the defaults, from scratch runs with each branch's counterfactual at ~0: food (with the tiny landfill part) 0.0100 (55%), SNAP 0.0082 (45%).

Mechanical: lint 0 high / 0 medium / 3 low (`pounds_per_meal` unused and says so; `fuel_share` no range, a structural 0; far-below, with the summary's reason). Invariants: none violated. check.ts: all models valid. normalization-audit: no violation for this model. simulation-check: stable (5% 0.41×, 95% 2.56× the best guess). The sister models (advocacy, Salvation Army) read the same shared figures (`@united_states.food_aid_recipients_consumption_share`, `@snap.cash_equivalence`, `@snap.benefit_share`, `@public_funds.us_federal_payer_multiple`, `@public_funds.mcpf`).

Previous round:
1. Consumption share: resolved (alternative fix). One shared fact for all US food-aid clients (0.3, 0.2–0.5), read by this model, the Salvation Army build and the advocacy model; the SNAP branch reads the same baseline. Anchors are in the fact's explainer.
2. Landfill climate: resolved. `landfill_tco2e_averted` (tagged `side_effect` `added`) goes through `tco2e_bridged` and the shared conversion; the +2% is gone.
3. SNAP cash equivalence and shares: resolved (shared `@snap.*` facts read by both models).
4. Marginal enrollees' benefit: resolved (`snap_marginal_benefit_ratio` 0.8, 0.6–1, anchored on the paper; applied to the benefit and the payers' cost alike).
5. Retail in the credit denominator: resolved (`donated_food_value_fy2025 * retail_vs_wholesale`).
6. Child hunger and food-as-medicine: resolved (alternative fix, see Scope).
7. SNAP credit from money: resolved in form (cost × share ÷ (applications × cost per application)); the two inputs that now set it are findings 1 and 2 below.
8. Counterfactual a judgment, `snap_years` anchored: resolved.
9. Implementation 0.95, spoilage before the household: resolved.
10. +6% grants: resolved (removed).
11. Distribution cost: partly resolved (range 0.1–0.8, volunteers named); see finding 4.
12. Payer multiple shared: resolved.
13. Write-up: partly resolved; counts and audit sentence fixed, branch split still stale (finding 3).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | source | `cost_per_assisted_application`, `snap_program_share` | The SNAP credit is `cost_total * snap_program_share / (snap_applications * cost_per_assisted_application)`. The applications count cancels (set it to 1: the result is unchanged), so the SNAP branch is set by the two judgments. Both are unsourced: $150 (75–300) has no cost-per-application source and "about a third of the programs line" has no grant total. `cost_per_assisted_application` is the fourth tornado row. The tornado shows 75 → 0.0265 and 300 → 0.0142. | Tornado; explainers state no source. r1 finding 7 asked for BDT or USDA FNS outreach cost data and Feeding America's SNAP grant totals. | Source `cost_per_assisted_application` from Benefits Data Trust's or USDA FNS state outreach plans' cost per application, naming the reference class, and `snap_program_share` from the SNAP-labelled part of note 7's grants (or the annual report's SNAP grant count). Keep the ranges. | Range effect: ×0.78 to ×1.45 |
| 2 | low | structure | `snap_attribution_share` | Not capped at 1, as r1 asked. At `snap_program_share` 0.12 and $75 per application it is 1.48 (the simulation can draw this: the result then is 0.0424, 2.3×). A credit above 1 means Feeding America paid for more than all the help. | Scratch run with those two at their ends; canonical row printed 0.22 for the blended attribution. | `min(1, cost_total * snap_program_share / (snap_applications * cost_per_assisted_application))`. | 0 at defaults; trims the high tail |
| 3 | low | presentation | summary, write-up | "About two thirds is the food, most of the rest SNAP" is stale: the food (with the small landfill part) is 55% and SNAP 45%. | Scratch runs with each branch's counterfactual at ~0: 0.0100 and 0.0082 of 0.0183. | Write "about half is the food, the rest SNAP help" in the summary; update the write-up if it carries the split. | None |
| 4 | low | sensitivity | `distribution_cost_per_lb` | 25 cents is described as the 20-cent fee plus the pantries' volunteer hours, which would make volunteers worth 5 cents a pound. With 60,000 mostly volunteer-run pantries that looks low, and the explainer shows no count of hours. The row still isn't built from network data (r1 asked for food bank operating expenses less purchases ÷ pounds, plus volunteer hours × `@united_states.volunteer_hour_value_2025`). | Explainer; r1 finding 11. | Build it as food bank operating cost per pound (Form 990 aggregate or Feeding America network data) plus volunteer hours per pound × the shared hourly value, citing the hours count. | At 0.5: about −5%; at 0.8: about −10% |
| 5 | low | normalization | `landfill_tco2e_averted` | The landfill part leaves out `wait_discount` and `implementation_adj`, and applies `food_counterfactual_adj`, which includes "people turn to other pantries" and doesn't bear on the landfill route. It also applies EPA's per short ton figure to metric tonnes (about 10%). | Row formula and explainer. | Multiply by `wait_discount * implementation_adj`; cite the EPA WARM factor per metric tonne. | Under 0.5% of the result: the landfill part is about 1,600 t CO2e |
| 6 | low | source | `@united_states.food_aid_recipients_consumption_share` (shared fact) | The fact gives its anchor as the lowest-quintile ratio and the poverty line limits, but doesn't cite the ERS (Amber Waves 2004) and Hunger in America 2014 income shares r1 found, and has no `source`. It is the third tornado row (0.2 → 0.0277, 0.5 → 0.0105). | The fact's explainer. | Add a `source` with ERS 2004 (over 90% of pantry households below 130% of the poverty line) and Hunger in America 2014 (72% at or below it). | 0 |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| Feeding America audited figures, `snap_applications`, CRS SNAP figures, NBER w24652 | as round 1 | verified in round 1, unchanged | Not refetched: no input of these changed. |
| `snap_marginal_benefit_ratio` | NBER w24652 | consistent | The abstract says marginal enrollees "receive lower benefits"; the 0.8 is a judgment on that direction (the table's ratio wasn't read). |
| `cost_per_assisted_application`, `snap_program_share` | none | unsupported | Finding 1. |
| `@snap.*`, `@public_funds.*`, `@united_states.food_aid_*` | shared facts | read, not fetched | Shared assumptions, outside this model's scope; they match what the advocacy and Salvation Army builds read. |

## Drivers
1. `$missing_data_discount` (shared slider, ×0.2 to ×2).
2. `$uov_per_daly` (shared).
3. `@united_states.food_aid_recipients_consumption_share` (shared judgment, 0.2–0.5).
4. `cost_per_assisted_application` (judgment, unsourced: finding 1).
5. `snap_counterfactual_adj` and `snap_years` (judgments anchored on the trial and USDA's participation studies).

What would improve the model most: sources for the SNAP credit's two inputs (finding 1), then a built distribution cost (finding 4).
