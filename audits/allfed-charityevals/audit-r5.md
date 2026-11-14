# Audit: allfed-charityevals, round 5 (verification round)
Result: 0.02574 daly/$ = 25.7 years of healthy life per 1,000 dollars (combined range 0.88-750; model's own ranges 1.7-192), unchanged; cause median 3.42 (x7.5). Verdict: pass.
Model-sha: 8e7c3632800911fe45c9a983aa3e965bf48137cfd253da7cc01cf59e8baeb9a9
Scope: only the removal of the ten-times sentence from `summary` (commit 1696f63), the finding of rounds 3 and 4.
Mechanical: audit-model lint 0/0/0, findings (0); `npx tsx scripts/normalization-audit.ts` run in full: no violation, and INV-15 (a ranked model far above its peers says why) shows "checked, 0 models, 0 violations" (generated/ restored afterwards). Not re-run this round (scoped): simulation-check.

Previous rounds (3 and 4): resolved. The sentence "It is more than ten times its peers because AI work ... sets the cause's median" is gone; the summary states no multiple of the median, so nothing can be stale (audit-model: median of 22 models 3.416, this model x7.537, below the ten-times threshold INV-15 asks to be explained).

The Model-sha equals the one recorded in audit-r2.md (8e7c3632800911fe45c9a983aa3e965bf48137cfd253da7cc01cf59e8baeb9a9), so the model's content is exactly what round 2 passed; result, ranges and tornado are as in round 2.

No findings.

## Sources checked
None (scoped round; the model's content is identical to round 2's).

**Verdict: pass**
