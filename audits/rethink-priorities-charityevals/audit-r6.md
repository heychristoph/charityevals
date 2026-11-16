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

Model-sha: 86e53f91e63987e637847eaa0b36fdb26b8b0b962edf1f3620df3996757d6dc1
Verdict: pass

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts); the receipt passed on HEAD's model, whose headline moved since its audit only through models and facts it reads. Mechanical: headline unchanged, against HEAD.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7224423b.
