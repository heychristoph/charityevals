# Audit: rethink-priorities-charityevals-cross-cause, round 5 (verification round)
Result: 5.071e-5 uov/$ = 0.02536 years of healthy life per 1,000 dollars (combined range 2.4e-4-2.66); round 4 had 0.02504, a drift not caused by this wording-only change (the change is wording only). Verdict: pass.
Model-sha: 4ae9553b78fbc13fca3c96abf658258633f085a575e8e1c847234d670aa96b45
Scope: only commit 3d29300's change in this model: the `iaps_expenses` explainer (and, for the sources text, charities/rethink-priorities.json) now says the Institute for AI Policy and Strategy has its own model (institute-for-ai-policy-and-strategy-charityevals), which counts line 4b of the Form 990.
Mechanical: audit-model lint 0 high/0 medium (the one low, the wide joint range, is stated in the summary where applicable); scripts/check.ts: all models valid. Not re-run this round (scoped): normalization-audit, simulation-check.

The wording is true: the IAPS model reads the same $3,905,273 line and no row of this model values it; the id named exists. No number or formula changed.

No findings.

**Verdict: pass**
