# Audit: center-for-ai-safety-charityevals, round 9 (verification round)
Result: 0.001576 daly/$ = 1.576 years of healthy life per 1,000 dollars (combined range 0.035-71.3), unchanged from round 8. Verdict: pass.
Model-sha: 24927e42f2207c392012762dd2f3f1bf8913ebf275db14dea15dc63c2764f601
Scope: only the change in commit a6b0860: the row fb_work_years (a typed judgment, 2 / 5 / 10 years) now reads the shared fact `@catastrophe.field_work_years` (INV-14), and its explainer.
Mechanical: audit-model lint no new findings; scripts/check.ts: all models valid. Not re-run this round (scoped): normalization-audit, simulation-check.

The shared fact has low 2, best 5, high 10, kind judgment, the same as the typed row it replaces, so the headline and ranges are unchanged (the tornado now lists @catastrophe.field_work_years). The explainer names the shared figure and its 5 (2 to 10) and keeps the model's own context (no CAIS follow-up published), so it still fits the model.

No findings.

**Verdict: pass**

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
