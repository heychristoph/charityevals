# Audit: bulletin-of-the-atomic-scientists-charityevals, round 4 (scoped verification)
Result: 0.01615 daly/$ = 16.15 years of healthy life per 1,000 dollars (unchanged from round 3). Verdict: pass.
Model-sha: 11068fd44113933b8b5eb0bba3541a4f7d08e0a41f7a8c2ce33e044910b55ec5
Scope: the one change, the INV-15 clause added to the summary ("It is more than ten times its peers because almost all of its value is its nuclear coverage ... it is below the Arms Control Association, the Nuclear Threat Initiative and Ploughshares Fund because ..."). The model rows are unchanged since round 3.
Mechanical: audit-model no INV-15 finding (x10.25 the cause median of 1.576); check.ts valid; normalization-audit no violation for this model (generated/ restored).

## Check
- "almost all of its value is its nuclear coverage": the summary's own 96% share; true.
- "valued against the deaths of a nuclear war, which the site's figures put far above the AI charities": nuclear charities 15-41 against AI 0.07-1.6; true.
- "below the Arms Control Association, the Nuclear Threat Initiative and Ploughshares Fund": 16.15 against 41.3, 23.4 and 26.0; true. "under half its spending is on nuclear risk" matches the 45% cost share. The sentence reads well.

## New findings
1. low, "the AI charities that make up most of the catastrophic-risk models": AI charities are about a third of the 23 peers, not most (see the ALLFED round 3 note). Fix: "the AI charities, the largest group of the catastrophic-risk models".
2. low, margin: the gap is x10.25, so a small change in the peers' median (a new catastrophic-risk model) can take it under ten and make "more than ten times" false; INV-15 will then flag it. Fix: none now; re-check the clause when the cause's models change.

Verdict: pass.
