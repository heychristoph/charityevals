# Audit: johns-hopkins-center-for-health-security-charityevals, round 4 (verification round)
Result: 0.007521 daly/$ = 7.52 years of healthy life per 1,000 dollars (combined range 0.42-134), unchanged from round 3. Verdict: pass.
Model-sha: 8835d2755c2bb37ac03604e489d8431dc20eb792c8ba6a11e470b5103d046af7
Scope: only the change in commit a6b0860: the row fb_work_years (a typed judgment, 2 / 5 / 10 years) now reads the shared fact `@catastrophe.field_work_years` (INV-14), and its explainer.
Mechanical: audit-model lint no new findings; scripts/check.ts: all models valid. Not re-run this round (scoped): normalization-audit, simulation-check.

The shared fact has low 2, best 5, high 10, kind judgment, the same as the typed row it replaces, so the headline and ranges are unchanged (round 3's 7.521 and 0.4234-133.6). The explainer names the shared figure and keeps the model's own point (a doctorate's career is longer but the counterfactual years fade), so it still fits the model.

No findings.

**Verdict: pass**

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)
