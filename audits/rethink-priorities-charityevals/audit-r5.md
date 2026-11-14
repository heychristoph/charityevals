# Audit: rethink-priorities-charityevals, round 5 (verification round)
Result: 2.384e-7 uov/$ = 1.192e-4 years of healthy life per 1,000 dollars (combined range 8.2e-7-0.0174), unchanged from round 4 (the change is wording only). Verdict: pass.
Model-sha: 5e3d5d4fdcdcf351b439041b7b1b84316c20eced5d8192a9d1abac1a4f67cb75
Scope: only commit 3d29300's change in this model: the `iaps_expenses` explainer (and, for the sources text, charities/rethink-priorities.json) now says the Institute for AI Policy and Strategy has its own model (institute-for-ai-policy-and-strategy-charityevals), which counts line 4b of the Form 990.
Mechanical: audit-model lint 0 high/0 medium (the one low, the wide joint range, is stated in the summary where applicable); scripts/check.ts: all models valid. Not re-run this round (scoped): normalization-audit, simulation-check.

The wording is true: the IAPS model reads the same $3,905,273 line and no row of this model values it; the id named exists. No number or formula changed.

No findings.

**Verdict: pass**
