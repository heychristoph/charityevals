# Audit: johns-hopkins-center-for-health-security-charityevals, round 4 (verification round)
Result: 0.007521 daly/$ = 7.52 years of healthy life per 1,000 dollars (combined range 0.42-134), unchanged from round 3. Verdict: pass.
Model-sha: bcc6e8afe069d8737a83523298012fc4aeb3ec08019baa434bcba33b6352e044
Scope: only the change in commit a6b0860: the row fb_work_years (a typed judgment, 2 / 5 / 10 years) now reads the shared fact `@catastrophe.field_work_years` (INV-14), and its explainer.
Mechanical: audit-model lint no new findings; scripts/check.ts: all models valid. Not re-run this round (scoped): normalization-audit, simulation-check.

The shared fact has low 2, best 5, high 10, kind judgment, the same as the typed row it replaces, so the headline and ranges are unchanged (round 3's 7.521 and 0.4234-133.6). The explainer names the shared figure and keeps the model's own point (a doctorate's career is longer but the counterfactual years fade), so it still fits the model.

No findings.

**Verdict: pass**

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against ee138d3d.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against e8ecb2b3.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against 7dbeec92.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.
