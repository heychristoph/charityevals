# Audit: johns-hopkins-center-for-health-security-charityevals, round 4 (verification round)
Result: 0.007521 daly/$ = 7.52 years of healthy life per 1,000 dollars (combined range 0.42-134), unchanged from round 3. Verdict: pass.
Model-sha: 3c0a09cbb71d289e0a7d8bbfb3336c8991b6bf68be0e93e6ca90273d0cce0189
Scope: only the change in commit a6b0860: the row fb_work_years (a typed judgment, 2 / 5 / 10 years) now reads the shared fact `@catastrophe.field_work_years` (INV-14), and its explainer.
Mechanical: audit-model lint no new findings; scripts/check.ts: all models valid. Not re-run this round (scoped): normalization-audit, simulation-check.

The shared fact has low 2, best 5, high 10, kind judgment, the same as the typed row it replaces, so the headline and ranges are unchanged (round 3's 7.521 and 0.4234-133.6). The explainer names the shared figure and keeps the model's own point (a doctorate's career is longer but the counterfactual years fade), so it still fits the model.

No findings.

**Verdict: pass**

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
