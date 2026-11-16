# Audit: center-for-ai-safety-charityevals, round 9 (verification round)
Result: 0.001576 daly/$ = 1.576 years of healthy life per 1,000 dollars (combined range 0.035-71.3), unchanged from round 8. Verdict: pass.
Model-sha: d43731bd61dad1fb3a47e2003c5229e73d7fe022298576d6275d4ab1f8726e87
Scope: only the change in commit a6b0860: the row fb_work_years (a typed judgment, 2 / 5 / 10 years) now reads the shared fact `@catastrophe.field_work_years` (INV-14), and its explainer.
Mechanical: audit-model lint no new findings; scripts/check.ts: all models valid. Not re-run this round (scoped): normalization-audit, simulation-check.

The shared fact has low 2, best 5, high 10, kind judgment, the same as the typed row it replaces, so the headline and ranges are unchanged (the tornado now lists @catastrophe.field_work_years). The explainer names the shared figure and its 5 (2 to 10) and keeps the model's own context (no CAIS follow-up published), so it still fits the model.

No findings.

**Verdict: pass**

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against ee138d3d.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.
