# Audit: allfed-charityevals, round 6 (scoped verification; rounds 3-5 already exist)
Result: 0.02574 daly/$ = 25.74 years of healthy life per 1,000 dollars (combined range 0.00012-141,000 joint; unchanged). Verdict: pass.
Model-sha: 5be927da558c130ee25d0ea622d95780d22ac96c5c8e86b9e21652395c65a81c
Scope: the one change, one sentence added to the summary for INV-15 ("It is more than ten times its peers because ..."). The diff changes only the summary.
Mechanical: audit-model no INV-15 finding (x16.3 the cause median of 1.576); check.ts valid; no other change since round 2.

## Check
The sentence: "It is more than ten times its peers because it is valued against the famine deaths of a nuclear war, which the site's figures put far above the AI charities that make up most of the catastrophic-risk models."
- True as to the size: 25.74 is 16 times the median 1.576.
- True as to the reason: the value is the famine deaths of a nuclear war; the nuclear charities on the site sit at 15-41 against the AI charities at 0.07-1.6.
- Plain, and the INV-15 pattern is met.

## New findings
1. low, "the AI charities that make up most of the catastrophic-risk models": AI charities are about a third of the 23 peers (FAR.AI, IAPS, CAIS, GovAI, METR, Redwood, MIRI, Epoch), beside about five biosecurity and six nuclear ones. Fix: "the AI charities, the largest group of the catastrophic-risk models" or "the many AI charities among the catastrophic-risk models" (the clause "the AI charities that make up most" is the only inexact part; the same words are in the Bulletin summary).

Verdict: pass.
