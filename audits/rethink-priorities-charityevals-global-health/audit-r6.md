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

Model-sha: 7d47652790859ca5abbc6ec0c5a36c6cc13e3d581f813a193fddb4aa6cdd86dc
Rules: 0.1.1
Verdict: pass

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts); the receipt passed on HEAD's model, whose headline moved since its audit only through models and facts it reads. Mechanical: headline unchanged, against HEAD.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against c42a537d.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change of its own; the headline moves with the models it reads live, whose shares were re-judged). Mechanical: headline 0.3968 → 0.4122 (+3.9%), 10 rows changed, against 593b1bba.

Re-stamped (17 Nov 2026), rule mobiliser-share-30: typed results in the model's text made placeholders or recomputed at the 30% mobiliser share, and wrong prose placeholders corrected; no row changes. Mechanical: headline 0.4102 → 0.1067 (−74%), 13 rows changed, against 2b24b73c.
