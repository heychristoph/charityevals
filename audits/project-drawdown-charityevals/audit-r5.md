# Audit: project-drawdown-charityevals, round 5 (scoped verification)
Result: 6.693e-3 tco2e/$ = 0.003375 years of healthy life per 1,000 dollars (unchanged; combined range 3.3e-5-0.34); cause median 0.00188 (x1.8).
Scope: the rows changed by the informed_money rename (commits 485e9db, ce92a2b): `money_moved` renamed `informed_money` (philanthropy: giving that follows its guidance) and `informed_money_value`. No source or scope re-audit.
Mechanical: audit-model lint 0 high/medium (one known low: spread note, unchanged), no invariant violation; check.ts "all models valid".

## Checks
- Rename complete: `informed_money` (= `phil_money_shifted`) is read by `informed_money_value` only; no `money_moved` row or reference remains; `donor_cost_share` is `cost_total / (cost_total + if($resource_shares, salary_sacrifice, 0))` and reads no money row.
- Meaning: the row is spending its guidance changed, all shifted (`phil_money_shifted` explainer: "All shifted money").
- Headline: 6.693e-3 tco2e/$ = 0.0034 years/$1k, as before.

## Findings
None.

## Notes (low, no model change needed)
- `informed_money` label reads "Philanthropy: giving that follows its guidance (money moved, all shifted, gross)". Since `money_moved` now means money moved gross, "money moved ... gross" in this label echoes the old name. Optional wording: "Philanthropy: giving that follows its guidance (spending changed, all shifted)".

Model-sha: 5a2bd0ed735378382fcebe3b4f3f866bc54c25bd6e744e0d4a8e3e215f0e59e5
Verdict: pass

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

(Numbered 4 on its branch; renumbered at merge.)
