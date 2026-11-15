# Audit: rethink-priorities-charityevals, round 6 (scoped verification)
Result: 2.315e-7 uov/$ = 1.158e-4 years of healthy life per 1,000 dollars (unchanged; combined range 7.1e-7-0.019); cause median 5.0e-4 (x0.23).
Scope: the rows changed by the informed_money rename (commits 485e9db, ce92a2b): `money_moved` renamed `informed_money`, `moved_per_dollar` and `informed_money_value`. No source or scope re-audit.
Mechanical: audit-model lint 0 findings, no invariant violation; check.ts "all models valid".

## Checks
- Rename complete: `informed_money` (`aw_funders_money_changed + aw_coord_money_changed + aw_commissioned_money_changed`) is read by `moved_per_dollar` and `informed_money_value` only; no `money_moved` left; `donor_cost_share` reads no money row.
- Meaning: the row is funders' and organisations' spending its work changed, all shifted; no gross money moved is claimed.
- Headline: 2.315e-7 uov/$ = 1.2e-4 years/$1k, as before.

## Findings
None.

## Notes (low, no model change needed)
- The `informed_money` label starts "Money moved: funders' and advocacy organisations' spending whose allocation ... changed". With `money_moved` now meaning gross money moved, "Money moved:" is the old name. Optional wording: "Spending changed: funders' and advocacy organisations' spending whose allocation its 2025 animal welfare work changed (US$)".

Model-sha: bf37c2772a15ee01a3e541e423dd0274b4274b704147269a0e82c8199c963907
Verdict: pass

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
