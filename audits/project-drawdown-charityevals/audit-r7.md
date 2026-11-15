# Audit: project-drawdown-charityevals, round 7 (verification of the round 6 text fix)
Result: -0.001300 tco2e/$ = -0.0007695 years of healthy life per $1,000, unchanged. Verdict: pass (no high or medium finding).
Model-sha: 6dcf59a0f6bebbbe7db0fe087e335937be75d3c21246f222b7d380770e6af213
Scope: round 6's one medium, the write-up's "What drives the result" sentence.
Mechanical: check.ts all models valid; the model file is unchanged since round 6 (same sha).

| # | Severity | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|
| 1 | resolved (was medium) | write-up "What drives the result" | Now "companies' and investors' money is the positive part, about a third its size". Round 6 values: positive branches about +8,100 t against funders' -21,800 t, 37%. Correct; no comparison with other charities. | write-up line 35 | none | none |

## Sources checked
- No new inputs; branch values as recomputed in round 6.
