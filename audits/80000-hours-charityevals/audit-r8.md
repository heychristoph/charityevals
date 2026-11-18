# Audit: 80000-hours-charityevals, round 8 (scoped verification)
Result: 0.002108 uov/$ = 1.054 years of healthy life per 1,000 dollars (combined range 0.0542–20.50). Verdict: **pass**.
Model-sha: 10ae9b2944251dc683691accde13b7e5f5d3fa8f933aa02823546589f2f38473
Rules: 0.3.7
Scope: only the text fix since round 7: the summary's range "0.06–24" now "0.05–21". Nothing else re-checked.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Checks of the change
- Range: "0.05–21" matches the audit-model combined range 0.0542–20.50 (r7) after rounding; "about 1.1" matches the headline 1.05399 (headlines.ts).
- Nothing else changed: `git diff HEAD` on the model shows, against r7, only the summary range text; the other hunks are r7's `prior_dollar_value` change and the "1.2 to 1.1" correction, already verified.
- Headline unchanged (1.05399), as a text-only edit must leave it.

## Sources checked
None re-fetched; no source or number changed.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): wording only (no effective-altruism mentions; listing-risk trims); no number changed

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline 1.082 → 1.082 (+0.0073%), 10 rows changed, against bf8498ee.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7dbeec92.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline 1.311 → 1.32 (+0.65%), 10 rows changed, against 593b1bba.

Re-stamped (17 Nov 2026), rule credit-switch-co-funders: Credit rule 2.24, step 6: the co-funder switch counts co-funders only; the donors whose money a mover moves are mobilised (under mobiliser_share), so their new money leaves donor_cost_share. Only results with the switch on move. Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (17 Nov 2026), rule mobiliser-share-30: the summary's typed range replaced by placeholders rendered from the model (the mobiliser's share now defaults to 30%). Mechanical: headline 2.983 → 0.336 (−89%), 13 rows changed, against 1daaf2ba.
