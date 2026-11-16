# Audit: project-drawdown-charityevals, round 7 (verification of the round 6 text fix)
Result: -0.001300 tco2e/$ = -0.0007695 years of healthy life per $1,000, unchanged. Verdict: pass (no high or medium finding).
Model-sha: cad102039513e15bb2c9d023bf02cb2ef30d123e56ebd0fa8ee64ac04e4c5b92
Scope: round 6's one medium, the write-up's "What drives the result" sentence.
Mechanical: check.ts all models valid; the model file is unchanged since round 6 (same sha).

| # | Severity | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|
| 1 | resolved (was medium) | write-up "What drives the result" | Now "companies' and investors' money is the positive part, about a third its size". Round 6 values: positive branches about +8,100 t against funders' -21,800 t, 37%. Correct; no comparison with other charities. | write-up line 35 | none | none |

## Sources checked
- No new inputs; branch values as recomputed in round 6.

Re-stamped (16 Nov 2026): Why the simulation is too wide to use, said in outcome_total's explainer (normalization.md 2.18); the model's values unchanged. Since round 7's version its headline has moved −3.1% (−0.0007695 → −0.0007935) through the live climate and global-health values it reads, not this edit. Mechanical: headline unchanged, against HEAD.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline -0.0007935 → -0.0007935 (−0.00074%), 14 rows changed, against 8904b83b.
