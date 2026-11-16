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

Model-sha: d5028b8360508a3ca153d6cb8354576082e59c5421586b27757453a87976c6e8
Verdict: pass

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts); the receipt passed on HEAD's model, whose headline moved since its audit only through models and facts it reads. Mechanical: headline unchanged, against HEAD.
