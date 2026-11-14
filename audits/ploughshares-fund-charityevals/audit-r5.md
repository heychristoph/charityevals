# Audit: ploughshares-fund-charityevals, round 5 (verification round)
Result: 0.02598 daly/$ = 26.0 years of healthy life per 1,000 dollars (combined range 1.22-555; model's own ranges 2.27-101), unchanged from round 4. Verdict: pass.
Model-sha: 9fb0395cc9c56dc8c2796d2244445cebea601016d72c7be3ef9b191308557886
Scope: only the change in commit a6b0860: the row fb_work_years (a typed judgment, 2 / 5 / 10 years) now reads the shared fact `@catastrophe.field_work_years` (INV-14), and its explainer.
Mechanical: audit-model lint no new findings; scripts/check.ts: all models valid. Not re-run this round (scoped): normalization-audit, simulation-check.

The shared fact has low 2, best 5, high 10, kind judgment, the same as the typed row it replaces, so the headline and combined range are unchanged. The explainer names the shared figure and keeps the model's own point (fellows are early or mid career), so it still fits the model.

No findings.

**Verdict: pass**
