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

Model-sha: 7d4e531650695d356676a5f327322910d7b6115ae30dcc39fc8b22e3903f6781
Verdict: pass

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): wording only (no effective-altruism mentions; listing-risk trims); no number changed

Re-stamped (16 Nov 2026): Preflight cleanup: a typed figure now read from its shared fact at the same value (@depression.suicide_rr_with_depression, @meta.fundraiser_side_effects_share, @irap.years_gain_lasts); labels and explainers reworded. Mechanical: headline 23.69 → 23.69 (−0.0016%), 11 rows changed, against bf8498ee.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline 23.69 → 23.69 (+2.4e-8%), against a8d130f3.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline 23.75 → 23.88 (+0.56%), 11 rows changed, against 593b1bba.

Re-stamped (17 Nov 2026), rule credit-switch-co-funders: Credit rule 2.24, step 6: the co-funder switch counts co-funders only; the donors whose money a mover moves are mobilised (under mobiliser_share), so their new money leaves donor_cost_share. Only results with the switch on move. Mechanical: headline unchanged, against the tree before the rule.
