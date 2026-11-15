# Audit: effektiv-spenden-charityevals, round 7 (scoped verification)
Result: 0.04764 uov/$ = 23.82 years of healthy life per 1,000 dollars (unchanged; combined range 6.6-86.6; the model's own ranges alone 16.9-38.2); cause median 0.0628 (x380, reason already stated in the summary in earlier rounds).
Scope: the rows changed by the informed_money rename (commits 485e9db, ce92a2b): `money_moved` (was `platform_moved`, platform donations), `informed_money` (was `money_moved`, advised gifts), `moved_per_dollar`, `informed_money_value`, the moved-money value row and `donor_cost_share`. No source or scope re-audit.
Mechanical: audit-model lint 0 findings, no invariant violation (INV-12 incl. donor_cost_share never reads informed_money); check.ts "all models valid".

## Checks
- Rename complete: `money_moved` ("Platform donations Effektiv Spenden caused", `recorded_donations * donor_own_effect`) is read by `moved_per_dollar`, the moved-money value row (`money_moved * moved_wait_discount * moved_dollar_net_value`) and `donor_cost_share` (`money_moved * new_money_share`). `informed_money` (`advised_moved`) is read by `moved_per_dollar` and `informed_money_value` only. No `platform_moved` left anywhere.
- Text: the `informed_money` explainer now names "Platform donations it caused (money_moved, about $10M)", the right row. The `donor_cost_share` explainer (platform donors' new money share the outcome; advised gifts add no resources) matches the formula.
- Credit: only gross platform money x `new_money_share` enters `donor_cost_share`.
- Headline: 0.048 uov/$ = 23.8 years/$1k, as before.

## Findings
None.

Model-sha: b09d21ecc854430c67cc1f05347edbf7dd675d0e4db26839ab4a33b122f73534
Verdict: pass

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
