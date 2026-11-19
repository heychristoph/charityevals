# Audit: sentinel-bio-charityevals, round 7 (scoped verification)
Result: 2.097 years of healthy life per $1,000 (was 2.275, -7.8%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: d27f700ae14778956b602d545b8c4a5647df062e2d524806d81ee4952dcf742c
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 6 passed (verification of round 5's findings), re-stamped at rules 0.3.8.

## Checks
- Diff against origin/main: only `descendants: false` on value_per_death and covid_value_per_death, the `never_started` mark on future_dalys_averted, the reworded future_dalys_averted explainer, the new row future_animal_harm, and dalys_direct now `(future_dalys_averted + future_animal_harm)`. The `summary` has no diff (it never stated the future's weight). Nothing else changed.
- verify.mts: origin/main 2.275084; branch defaults 2.097199 (equals `headlines.ts` 2.09720 and the lives-added.md "after" 2.097). Never-started-weight alone: 2.252234 to 2.097439 (-6.9%, future_dalys_averted 4859 no longer counts, dalys_direct is now -1.08). Lives-added alone: 2.097439 to 2.097199 (-0.011%). Animals-never-bred: none.
- Switched-off check: lives_added 0 and never_started_weight 1 gives 2.252234, not 2.275084 (-1.0%). The old model run in the branch library gives the same 2.252234, and the differing rows (prior_dollar_value, shifted_dollar_value, informed_money_value, `#cause:global-health`) are cross-model reads: the model's own rows are unchanged, so the gap is other models' changes, not this one's.
- Preflight passes.

## Prose
Writeup: "only where you count lives that never start (0% by default)" is true (future row is zero at default). "Catastrophes the world survives count for more than extinction does" holds. "Long-run value set ... about 27" matches 26.60; "a cut counted for one year ... about 0.45" matches 0.4528. The summary's "moves with the discount rate" holds (0.1% alone: 2.49; 8%: 1.84).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | verification | cause figure | Rules-off headline is 1.0% below origin/main, from other models' changes in the shared global-health figure the model reads | 2.252234 vs 2.275084; same for the unchanged old model | none for this model | none |

Re-stamped (19 Nov 2026), rule never-started-branches: In the catastrophic-risk family the mark for lives that never start moves from the sum of the future to each branch's future row, so the branch weights that average the adjustments count the future as the outcome does (they counted it in full); the future's farmed animals read the branches' own formulas. Mechanical: headline 2.097 → 2.093 (−0.20%), 14 rows changed, against the tree before the rule.
