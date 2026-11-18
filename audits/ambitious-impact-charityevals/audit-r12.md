# Audit round 12 (scoped verification): Ambitious Impact (charityevals)

## Scope
Only the change since round 7: the write-up sentence flagged as the medium (writeups/ambitious-impact-charityevals.md, bullet "What a dollar to its charities does"). The model JSON is unchanged (same Model-sha as round 7).

## Checked
1. Finding 1 of round 7 is resolved. Line 27 now reads "ACTRA is the Happier Lives Institute's, Kaya Guides and First Embrace are charityevals', and eleven younger ones are Ambitious Impact's own idea-stage estimates." The count matches the formula (11 Ambitious Impact idea-stage refs, 2 charityevals, ACTRA, 10 GiveWell) and the model's explainer.
2. No other stale count in the write-up: a search for "thirteen", "eleven", "twelve" and "idea-stage" finds only line 13 (Founding to Give, eleven companies: unrelated), line 27 (the fixed sentence) and line 38 (the missing-data discount, no count).
3. Model JSON unchanged: Model-sha identical to round 7 (f60a02a4...), so the round 7 checks of references, inputs (first-embrace-charityevals 5.248, kaya-guides-charityevals 0.784) and the preflight pass stand.
4. Round 7 finding 2 (low): the fall from about 48.5 to 9.4 is the 30% mobiliser-share default, not these two inputs (which move the headline -1.7%). The builder notes it and will state it in the commit message; no change to the model needed.

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none at high or medium | | | | | | | |

Verdict: pass (no high or medium findings; the round 7 medium is fixed, the low is carried into the commit message)
Model-sha: f60a02a41fb54b2bb314fe0b5238b3aabd936d1f222437066cd91e8f2dc717ee
Rules: 0.1.0

(Numbered 8 on its branch; renumbered at merge.)
