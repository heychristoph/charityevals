# Audit: 80000-hours-charityevals, round 8 (scoped verification)
Result: 0.002108 uov/$ = 1.054 years of healthy life per 1,000 dollars (combined range 0.0542–20.50). Verdict: **pass**.
Model-sha: e0df06223bc480aea1f08544f76f451a62cefcbb07e0a9252b1932a866596f77
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
