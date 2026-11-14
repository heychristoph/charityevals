# Audit: 80000-hours-charityevals, round 6 (scoped verification)
Result: 0.002401 uov/$ = 1.200 years of healthy life per 1,000 dollars (combined range 0.0599–24.05); cause median 1.576 (×0.76). Verdict: **pass**.
Model-sha: 585bbc7098e239711a2421b64ffb4ecea67947b668ba75df14d6b2e20b6c3f7f
Scope: only the change since round 5: the shared row `prior_dollar_value` (label, formula, explainer), and `#cause:x` leaving out old estimates. Programmes, year and sources unchanged and not re-checked.
Mechanical: lint 0/0/0 (audit-model prints "Findings (0)"; the r5 INV-18 NaN false positive no longer appears), `check.ts` all models valid, invariants none, normalization-audit none (0 violations for every invariant, run by the orchestrator on this commit).
Previous round: r5's only finding (low, tooling: audit-model's closure ignoring `#cause:x`) is resolved: INV-18 now passes in audit-model.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Checks of the change
- Headline unchanged: 0.002401 uov/$ = 1.200 (round 5: 1.200); range 0.0599–24.05 as in round 5.
- Word for word: label, formula (`@meta.prior_vs_cash * #givedirectly / #cause:global-health * #cause:catastrophic-risk`) and explainer equal what `priorDollarValue("catastrophic-risk")` in src/engine/moved-money.ts produces (compared line by line, including the cause name in the explainer).
- `money_moved` = 0 (observed, the model moves no money), so `moved_dollar_net_value` is multiplied by zero and the row cannot move the result. It is still live for anyone who sets money moved above 0.
- Sense of the rule here: the destinations are about 96% AI, biosecurity and nuclear (areas of catastrophic-risk), 2% global health, 0.5% animals. Shifted money therefore would have gone to an ordinary charity of that cause, not to cash, so the catastrophic-risk rule is the right reading and the old GiveDirectly default would have understated what shifted money was worth in this model's own areas. The cause is the model's filing, which matches INV-12. The cause figure `#cause:catastrophic-risk` includes the AI, biosecurity and nuclear charities the destinations already use; the cycle (80,000 Hours reading its own cause) is closed by `causeMembers` dropping money movers (beneficiaries "destinations"), as noted in round 5.
- `#cause:x` and old estimates: the AI, biosecurity and nuclear charities have no old estimate, so `value_destinations` is unchanged (headline identical).
- Stale text: none. The `moved_money` section explainer ("shifted money only for the gain over where it would have gone"), `new_money_share` and `moved_dollar_net_value` explainers say nothing about GiveDirectly or cash; the summary and write-up never mention where shifted money would have gone (grep for cash, GiveDirectly, otherwise, shifted: only the shared rows). The write-up line 53 "whoever would otherwise have been hired" is about careers, not money.

## Sources checked
No source re-fetched; no source or number changed since round 5.

## Drivers
Unchanged from round 5: missing_data_discount (judgment), career forgone pay and years stayed (shared judgments), win_years_counted, the next-dollar figure (sourced estimate), plan changes 2012-2022 (80,000 Hours' own estimate). None touched by this change.
