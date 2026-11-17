# Audit: rethink-priorities-charityevals-global-health, round 6 (scoped verification)
Result: 6.516e-4 uov/$ = 0.3258 years of healthy life per 1,000 dollars (unchanged; combined range 0.0022-49.1); cause median 0.0628 (x5.2).
Scope: the rows changed by the informed_money rename (commits 485e9db, ce92a2b): `money_moved` renamed `informed_money`, `moved_per_dollar` and `informed_money_value`. No source or scope re-audit.
Mechanical: audit-model lint 0 high/medium (one known low: spread note, unchanged), no invariant violation; check.ts "all models valid".

## Checks
- Rename complete: `informed_money` (`ghd_projects * ghd_money_per_project * ghd_share_changed`) is read by `moved_per_dollar` and `informed_money_value` only; no `money_moved` left; `donor_cost_share` reads no money row.
- Meaning: funders' spending its research changed, all shifted.
- Headline: 6.516e-4 uov/$ = 0.33 years/$1k, as before.

## Findings
None.

## Notes (low, no model change needed)
- The `informed_money` label starts "Money moved: funders' spending whose allocation ... changed"; "Money moved:" is the old name now that `money_moved` means gross money moved. Optional wording: "Spending changed: funders' spending whose allocation its 2025 global health research changed (US$)".

Model-sha: 37cffbf130395e4a8d66f2110903177a4fede27cc9a318bb906ad0c1882b9d48
Verdict: pass

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts); the receipt passed on HEAD's model, whose headline moved since its audit only through models and facts it reads. Mechanical: headline unchanged, against HEAD.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against c42a537d.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against cc9a04dd.
