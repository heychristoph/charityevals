# Audit: longview-philanthropy-charityevals, round 4 (scoped verification)
Result: 0.002434 uov/$ = 1.217 years of healthy life per 1,000 dollars (unchanged; combined range 0.068-21.8; the model's own ranges alone 0.95-1.57); cause median 5.573 (x0.22).
Scope: the rows changed by the informed_money rename (commits 485e9db, ce92a2b): `money_moved` (was `fund_moved`, fund money), `informed_money` (was `money_moved`, advised money), `moved_per_dollar`, `informed_money_value`, the moved-money value row and `donor_cost_share`. No source or scope re-audit.
Mechanical: audit-model lint 0 findings, no invariant violation (INV-12 incl. donor_cost_share never reads informed_money); check.ts "all models valid".

## Checks
- Rename complete: `money_moved` (label "Money moved through its funds that Longview caused", formula `fund_donations * fund_own_effect`) is read by `moved_per_dollar`, the moved-money value row (`money_moved * moved_dollar_net_value`) and `donor_cost_share` (`money_moved * new_money_share`). `informed_money` (label "Advised money whose allocation its advice changed", `advised_money * advised_share_changed`) is read by `moved_per_dollar` and `informed_money_value` only. No `fund_moved` left anywhere in the repo; no dangling id.
- Meaning: each row means what its name says; explainers name no row id that now points at the other row (the `donor_cost_share` explainer: fund donors' new money in the credit, advised money adds no resources).
- Credit: only gross fund money x `new_money_share` enters `donor_cost_share`; advised money, all shifted, does not.
- Headline: 2.434e-3 uov/$ = 1.217 years/$1k, as before.

## Findings
None.

Model-sha: 583330bb60d299bb946588c69ac70df28417e203f516f4feba4344759de64dff
Verdict: pass

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
