# Audit: allfed-charityevals, round 4 (verification round)
Result: 0.02574 daly/$ = 25.7 years of healthy life per 1,000 dollars (combined range 0.88-750), unchanged. Verdict: fail (one medium finding).
Model-sha: bb613cba6e3db75eadb5abe6eccda97518147a50ce46a69d8c604260320c3ff4
Scope: only the reworded ten-times sentence in `summary` (commit 3d29300), against round 3's finding.
Mechanical: audit-model lint 0/0/0, findings (0); scripts/check.ts: all models valid. Not re-run this round (scoped): normalization-audit, simulation-check.

Round 3's finding is resolved in substance: the cause median is set by AI work (the 22 models' median is now 3.42; the AI-only models sit well below ALLFED) and the nuclear peers are about as high (audit-model: Nuclear Threat Initiative 23.4, Ploughshares Fund 26.0, ALLFED 25.7). The sentence "all applying the same typical nuclear cut" is true.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | summary | "It is more than ten times its peers" is no longer true of the cause's median: with IAPS in the library the median of the 22 catastrophic-risk models is 3.42, so ALLFED is x7.5. | audit-model: "median of 22 catastrophic-risk models: 3.416 (this model x7.537)" | Write "about seven times the cause median (3.4)" (and keep the AI-median and nuclear-peers reason). | none |

**Verdict: fail** (medium: the stated multiple of the median is stale)
