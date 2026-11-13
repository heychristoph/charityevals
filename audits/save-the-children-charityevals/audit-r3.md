# Audit: save-the-children-charityevals, round 3
Result: 2.070e-4 daly/$ = 0.21 years of healthy life per 1,000 dollars (combined range 0.04-1.09); cause median 0.39 (x0.53). Verdict: pass.
Model-sha: 08c14fbc4ac6b30a36b1df14a8d9b048b0226fb2fae46089ce3401bd2ce84e2c
Scope: unchanged from rounds 1 and 2 (Save the Children UK 2025 programmes, GBP 209.0m of 233.6m charitable activities). Verification round: the model is unchanged since round 2; only the write-up's "How this model was checked" section was reworded, which is what the new fingerprint covers.
Mechanical: lint 0 high / 0 medium / 1 low (spread), invariants none, normalization-audit none.
Previous round: round 2 #1 (write-up said "all fixed" for five medium findings) resolved: the section now says four were fixed and the emergency deaths' age shares kept as ranged judgments, matching round 1 #4 (kept, reason accepted) and round 2's account (shares move the result about 2%). "Round 2 checked the changes and passed" matches round 2's verdict: pass. Round 2 #2 and #3 needed no change.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | write-up, "How this model was checked" | The sentence lists four fixes after "four were fixed" (education cost, shared credit, health reach, education evidence adjustment) and they match round 1 #1, #3, #2 and #5. The 0.29 to 0.21 move matches round 2. Nothing to fix. | audit-r1.md, audit-r2.md | None. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| (none) | - | - | Models unchanged; sources were checked in rounds 1 and 2. |

## Drivers
Unchanged from round 2: missing-data slider, value of a healthy year, discount rate, education effect size and cost per child, earnings per SD. Best improvement: a published per-child cost for the GPE grants Save the Children UK runs.
