# Audit: animal-charity-evaluators-charityevals, round 4 (scoped)
Result: 2.241e-6 uov/$ = 0.001121 years of healthy life per 1,000 dollars (combined range 1.6e-5–0.0787); cause median 4.872e-4 (×2.30). Verdict: pass.
Model-sha: faca1fb51314361522f74756fc30afe7a86e83559786ba94e9757b1321a39d2e
Scope: only the changes of commit 64d4b43 (shared moved-money rule for a non-global-health cause, `#cause:x` leaving out old estimates, INV-3 waiver removed). Programme scope and sources unchanged since round 3 (all spending, year to March 2025).
Mechanical: lint 0/0/0 (audit-model: 0 findings), invariants none (audit-model's full set), normalization-audit none (run by the orchestrator, not rerun); `check.ts`: all models valid; `simulation-check.ts`: not unstable (5% -0.28, 50% 1, 95% 4.04 × best guess).
Previous round: r3 had no findings; nothing to resolve.

## Checks
1. Rule match. `prior_dollar_value` in the model is word for word what `priorDollarValue("animal-welfare")` in src/engine/moved-money.ts produces: formula `@meta.prior_vs_cash * #givedirectly / #cause:global-health * #cause:animal-welfare`, the same label, and the same explainer with the cause substituted. `ordinary_vs_ranked_ratio`, `prior_dollar_value_animals` and `moved_dollar_net_value_animals` are gone. `moved_dollar_net_value` is the shared formula and sits on the output path through `moved_value`. The only other reader of `prior_dollar_value` is `moved_value`, as `(moved_dollar_value - prior_dollar_value)` for the grantmakers' money; nothing else reads it. The `moved_money` section was moved before `effect` so rows stay in section order.
2. Numbers at the defaults (computed with the engine): `prior_dollar_value` 2.210e-6; `value_destinations` = `moved_dollar_value` 3.384e-6; `moved_dollar_net_value` 2.279e-6 (0.5 x 3.384e-6 + 0.5 x 1.174e-6); `#cause:animal-welfare` 3.688e-6; `#cause:global-health` 0.013215; `#givedirectly` 0.007919. Check: 0.007919 / 0.013215 x 3.688e-6 = 2.210e-6, i.e. 59.9% of the animal mean, so "about 60%" in the write-up is right. `moved_value` 12.82 units = (4,567,362 x 0.99563 x 2.279e-6 + 1,100,000 x 1.174e-6) x 1.1; the headline 2.241e-6 uov/$ = 0.001121 years per $1,000 follows from the model's own chain. Matches audit-model and check.ts.
3. Text. Summary says 0.0011; write-up headline figure is the live span, the text reads 0.0011, the shifted-money paragraph states the new rule (about 60% of the animal charities' average, as GiveDirectly is to global health), and the history sentence "0.0017 to 0.0011" is the only 0.0017 left (as history, correct). "THL about 5 times the next" holds (1.57e-5 / 2.87e-6 = 5.5). No 13%, no `ordinary_vs_ranked_ratio`, no `prior_dollar_value_animals` and no "kept off the path" text remain in the model or write-up. The `moved_value` explainer and the `moved_side_effects` row are consistent.
4. Sensibility. `#cause:animal-welfare` is the equal-weight mean of the animal charities' figures on the rankings, leaving out ACE's own charity (the reader) and money movers, with old estimates dropped at the default toggle (the four ACE 2016 estimates). An ordinary animal charity at 2.2e-6 is 65% of ACE's own destination mix (3.4e-6), so shifted money earns 35% of its value instead of a loss; the old local ratio (13% of destinations) is replaced by the site's one rule, as the owner asked. The mean is dominated by a few charities (The Humane League 1.57e-5), which is the rule's behaviour for every animal model, not specific to ACE.

## Findings (1)
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | sensitivity | prior_dollar_value | At the top of the shared `@meta.prior_vs_cash` slider (3x) an ordinary animal charity (1.8x destinations' value) outranks ACE's destinations and the result turns negative (-0.0003); the simulation's 5% is -0.28 x best guess. | simulation-check prints `@meta.prior_vs_cash: 0..3 moves the result x1.64 / x-0.28`; the tornado shows 0.001838 / -3.13e-4. | None in this model: the slider range is the site's shared assumption and the rule is applied word for word; the summary already says the result moves with the animal weights. No change. | none at the defaults |

## Sources checked
Unchanged since round 3 and not re-fetched, per the brief.

## Drivers
Top of the tornado: `@meta.prior_vs_cash` (shared judgment), `chicken_vs_person` (shared judgment), `ignore_old_estimates` (shared toggle, now also moves the cause mean), `daly_per_sad`, `missing_data_discount`, `win_years_counted`, `@next_dollar.animal_charity_evaluators` (sourced, 30%, 10-72%). ACE's own inputs (money moved, next-dollar figure) are sourced or ranged judgments as in round 3. The most useful improvement is the deferred per-charity next-dollar figure, not anything in this change.

Verdict: pass
