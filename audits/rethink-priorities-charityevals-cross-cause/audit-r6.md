# Audit: rethink-priorities-charityevals-cross-cause, round 6 (scoped verification)
Result: 4.852e-5 uov/$ = 0.02426 years of healthy life per 1,000 dollars (unchanged; combined range 2.1e-4-2.86); cause median 0.0667 (x0.36).
Scope: the rows changed by the informed_money rename (commits 485e9db, ce92a2b): `money_moved` renamed `informed_money`, `moved_per_dollar` and `informed_money_value`. No source or scope re-audit.
Mechanical: audit-model lint 0 high/medium (one known low: spread note, unchanged), no invariant violation; check.ts "all models valid".

## Checks
- Rename complete: `informed_money` (`wit_money_changed + srv_money_changed`) is read by `moved_per_dollar` and `informed_money_value` only; no `money_moved` left; `donor_cost_share` reads no money row.
- Meaning: funders' and organisations' spending its research and surveys changed, all shifted.
- Headline: 4.852e-5 uov/$ = 0.024 years/$1k, as before.

## Findings
None.

## Notes (low, no model change needed)
- The `informed_money` label starts "Money moved: funders' and organisations' spending whose allocation ... changed"; "Money moved:" is the old name now that `money_moved` means gross money moved. Optional wording: "Spending changed: funders' and organisations' spending whose allocation its 2025 cross-cause research and surveys changed (US$)".

Model-sha: a47dd143fd38f5f1c8a8bb210283599981111ba0006d0859bfc045b470003d05
Rules: 0.1.0
Verdict: pass
Re-stamped (15 Nov 2026): wording only (no effective-altruism mentions; listing-risk trims); no number changed

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts); the receipt passed on HEAD's model, whose headline moved since its audit only through models and facts it reads. Mechanical: headline unchanged, against HEAD.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against c42a537d.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change of its own; the headline moves with the models it reads live, whose shares were re-judged). Mechanical: headline 0.03155 → 0.0327 (+3.6%), 11 rows changed, against 593b1bba.

Re-stamped (17 Nov 2026), rule mobiliser-share-30: typed results in the model's text made placeholders or recomputed at the 30% mobiliser share, and wrong prose placeholders corrected; no row changes. Mechanical: headline 0.03255 → 0.008805 (−73%), 14 rows changed, against 2b24b73c.
