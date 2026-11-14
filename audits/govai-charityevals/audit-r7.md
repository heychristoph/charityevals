# Audit: govai-charityevals, round 7 (verification round)
Result: 0.001576 daly/$ = 1.58 years of healthy life per 1,000 dollars (combined range 0.042-60; model's own ranges 0.12-15.8), unchanged. Verdict: pass.
Model-sha: 1478e1317c50464352e11e83343f55c9205901508b321b5c928eea51443f04ee
Scope: only round 6's finding: the own-range figures in the model's `summary` and in writeups/govai-charityevals.md (commit 1696f63 changes only these two lines).
Mechanical: audit-model lint 0/0/0, findings (0). Not re-run this round (scoped): check.ts, normalization-audit, simulation-check. No file in generated/ was changed.

Previous round (round 6):
- 1 (medium, presentation): resolved. Both the summary and the write-up's Summary now say "from 0.1 to 16" (the write-up: "about 0.1 to about 16, and wider with the shared assumptions"). audit-model's "Joint low-high of the model's own ranges" is 0.1214 - 15.82, so they match; no stale "0.05" or "33" is left in either file. The headline 1.6 and the rest of the summary are unchanged and were checked in earlier rounds.

No findings.

## Sources checked
None (scoped round; no source or row changed).

**Verdict: pass**
