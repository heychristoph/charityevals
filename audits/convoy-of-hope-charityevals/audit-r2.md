# Audit: convoy-of-hope-charityevals, round 2
Result: 5.926e-5 daly/$ = 0.0593 years of healthy life per 1,000 dollars (combined range 0.0127–0.277); cause median 0.0687 (×0.86). Verdict: pass.
Model-sha: 71ad5561a6dde097b0755a342eed76a99ff1148f0ae5e9918a73691242909810
Rules: 0.2.2
Scope: verification round on the 11 round-1 findings and the rows they changed; scope and accounts unchanged from round 1 (all four programme lines, cost = Convoy's own cash with overhead).
Mechanical: lint 0/0/0; invariants none; check.ts valid (own build, no `expected` values); simulation stable (5% 0.566, 50% 1.00, 95% 1.77 × best guess); every formula constant in the changed rows is a row, `1`, or `365`.
Previous round: round 1 (5 medium, 6 low). Branch shares now: children's feeding 66% (4,513 of 6,856 healthy years before the unmodelled share), agriculture and women 15%, partner resourcing 9%, disasters abroad 6%, medicines 2%.

## Round-1 findings: status

| R1 # | Status | Check |
|---|---|---|
| 1 | fixed in part | `cons_dom` added, same formula as `cons_hnd`, explainer corrected, `abroad_consumption` and `abroad_price_level` now the mean of the same six countries (1,652 dollars, level 0.357); `abroad_recipient_share` explainer still true. Guatemala and El Salvador still out (see 2) |
| 2 | fixed | `income_mortality_uov_ratio` (0.2, 0–0.5, World Vision's row) multiplies `feed_uov_raw`, `liv_uov_raw` and the abroad part of `pr_uov_raw`; the disaster branch is excluded and the explainer says why; result 0.0600 → 0.0593 net of the other fixes |
| 3 | fixed (as a judgment) | `food_vs_overall_price_level` 1.4 (1.1–1.9) in `food_abroad_price_ratio` (0.624 = 1.25 × 0.357 × 1.4, half of US retail); see 3 |
| 4 | fixed | `cd_grants` 8,179,000 and `dr_grants` 2,962,000 match note K (fs.txt line 776: partner resourcing 314, community development 8,179, events 25, disaster response 2,962); each times its judged share, inside the value before the in-kind step, at cost, and in `dus_value` and `value_delivered_per_person` only inside the US and abroad splits respectively (no double count) |
| 5 | fixed | `liv_new_share` 0.5 (0.3–0.8): new participants get `pv_annuity_due(liv_years)`, continuing ones one year; equals the old value when `liv_years` is 1 |
| 6 | fixed | `feed_attribution_share` 0.389 over the feeding cash and food at local prices; `cdo_attribution_share` 0.538 for training and rural work; old rows gone, no reference left; the write-up's 39% and 54% match |
| 7 | fixed | `ue_school_meals_share` 0.066 (0–0.2); feeding is 66% of the result, so "two thirds" and +6.6% are true |
| 8 | fixed | beneficiaries split the disasters over 15 countries with the reason (sums to 1.000); `dint_consumption_ratio` and `dint_counterfactual_adj` no longer rest on Brazil, Spain and Chile (the first names them only to say they are under 1%) |
| 9 | fixed | summary says $66 million on four programmes, the rest fundraising and management; no comparison with other charities |
| 10 | fixed | write-up: "from a sixth lower to a third higher" matches the tornado (0.0501–0.0801 against 0.0593) |
| 11 | fixed | `rur_value` at `food_us_price_ratio`; the explainer notes the FY2025 value and the half-year offset |

## Findings

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | one-consistent-way | `food_vs_overall_price_level` | The food price level is a Convoy-only judgment, so the same World Bank price-level concept is read one way here and another in the other relief models that value goods abroad at the overall level. The explainer cites the ICP pattern (food at half to two thirds of US prices) without a figure or source. It is ranged and anchored, and I could not check the ICP numbers in this run (unverified). | Scratch run with the ratio at 1: 0.0593 → 0.0545 (−8%) | Add ICP 2021 "food and non-alcoholic beverages" price levels per country to facts/survey_consumption.json beside the overall ones, read them in `abroad_price_level`'s food counterpart, and drop the judgment (or keep it only as the residual); give the other relief models the same step. | −8% at 1.0 |
| 2 | low | scope | `abroad_consumption`, `abroad_price_level` | Round-1 fix asked for Guatemala and El Salvador to be added (price level and growth rows from World Bank ICP and WDI, as the existing rows). The build excludes them instead, and states it. Both are named programme countries with survey means (12.5 and 15.5 dollars a day) well below the Dominican Republic's 22.7, which carries the mean up. | facts/survey_consumption.json has only `gtm_`/`slv_survey_mean_2021ppp_day` | Add `gtm_`/`slv_consumption_price_level_2024` and `_real_growth_survey_to_2024`, then `cons_gtm`, `cons_slv`, and average eight countries. | Likely a few percent lower (rough estimate, not computed) |
| 3 | low | presentation | `abroad_price_level` | The explainer still says "food and goods cost about a third as much at local market prices as in the US", while food is now valued at about half (× 1.4). | `food_abroad_price_ratio` 0.624 | "...goods cost about a third as much; food, see the food price level below". | none |
| 4 | low | presentation | `cdo_attribution_share` | The explainer calls the rest of community development's donated goods "mostly the rural initiatives' food", but the rural initiative delivered 510,808 pounds (about 1 million dollars) of about 17 million dollars of the remainder; `feed_gik_share` says the rest is supplies for agriculture, women's groups and rural initiatives. The denominator values all of it as food at US prices. | `rur_lbs`; `feed_gik_share` explainer | Say "supplies (mostly food) for agriculture, women's groups and rural initiatives" and value the remainder at a blend of `food_us_price_ratio` and `nonfood_us_price_ratio` (or state the all-food reading). | small (credit share of training and rural, about 54%) |
| 5 | low | one-consistent-way | `income_mortality_uov_ratio` | The same judgment (0.2, 0–0.5) now stands as a private row in five models (World Vision, Mercy Corps, Save the Children, Salvation Army International, Convoy), as round 1 suggested making it one shared fact. | the five model files | Make it a shared fact the five models read. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| cd_grants, dr_grants | convoyofhope.org/financials/ (local fs.txt line 776, note K p. 14) | verified | "Grants to other ministries 314 8,179 25 2,962"; columns partner resourcing, community development, events, disaster response; thousands |
| dom_ rows, cons_dom | facts/survey_consumption.json | verified | survey mean 22.73, price level 0.3952, growth 1.0, same formula as `cons_hnd` |
| write-up figures (990 dollars a person, 60 dollars a child, 39%, 54%, food at about half) | computed | verified | 991; 61.8; 0.389; 0.538; 0.624 / 1.25 = 0.50 |

Verdict: pass (no high findings; five low)

Re-stamped (15 Nov 2026): Guatemala and El Salvador added to the programme countries (World Bank price level and growth facts); food abroad at the World Bank ICP 2021 food price levels (1.87, was a judged 1.4); consumption surveys carried forward by 0.7 of real growth (the shared line-up rule); the income-mortality ratio read from the shared fact and the shared US values of donated food and goods; the training's donated supplies valued at local prices in its credit share; the school meals' side effect resized to the branch's three-fifths share (6%); 0.0593 → 0.0600.
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against bebc953e.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.
