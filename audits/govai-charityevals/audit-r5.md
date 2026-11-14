# Audit: govai-charityevals, round 5 (verification round)
Result: 0.001583 daly/$ = 1.58 years of healthy life per 1,000 dollars (combined range 0.039-64), unchanged from round 4. Verdict: pass.
Model-sha: c74a2e5610bccfd6624c7943fa68abd82fe08f4a7560d7c0fff60ffb63781500
Scope: only the change in commit a6b0860: the row fb_work_years (a typed judgment, 2 / 5 / 10 years) now reads the shared fact `@catastrophe.field_work_years` (INV-14), and its explainer.
Mechanical: audit-model lint no new findings; scripts/check.ts: all models valid. Not re-run this round (scoped): normalization-audit, simulation-check.

The shared fact has low 2, best 5, high 10, kind judgment, the same as the typed row it replaces, so the headline and ranges are unchanged (the tornado now lists @catastrophe.field_work_years 2-10). The explainer names the shared figure and keeps the model's own context (GovAI publishes no longer follow-up), so it still fits the model.

No findings.

**Verdict: pass**
