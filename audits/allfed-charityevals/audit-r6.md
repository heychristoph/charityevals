# Audit: allfed-charityevals, round 6 (verification round)
Result: 0.02574 daly/$ = 25.7 years of healthy life per 1,000 dollars (combined range 0.88-750; model's own ranges 1.7-192), unchanged; cause median 1.576 (x16.3). Verdict: pass.
Model-sha: 2f1a375a30448780a7493430b20a7098331e3ace32c2155cec62a296e19969e7
Scope: only the change in the `summary` line (the file's only change against main): the added sentence "It is more than ten times its peers because its work is valued at a typical nuclear project's cut per dollar, hundreds of times a typical AI misalignment project's, and most of its peers work on AI." The cause median fell to 1.576 (from 3.42 in round 5) when the MATS model joined, so INV-15 now needs the reason. The sentence agrees with the summary around it, which already says each dollar is valued as a typical nuclear project's relative cut; no number elsewhere in the summary changed (about 26 years, 0.9 to 750).
Mechanical: audit-model lint 0/0/0, findings (0). normalization-audit INV-15 checked 247 models, 0 violations (generated/ restored with git checkout). Not re-run this round (scoped): check.ts, simulation-check. No file in generated/ was changed.

Previous round (round 5): no open finding carried over.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | model `summary` | "Hundreds of times a typical AI misalignment project's" is true for the extinction presets (0.0002023 / 7.712e-7 = 262) and understated for the catastrophe presets (0.0003559 / 2.742e-7 = 1,298). | facts/catastrophe.json best values | None needed; "hundreds" is a safe lower statement. | none |

## Sources checked
None re-fetched (scoped round; no row or source changed). facts/catastrophe.json presets read: nuclear_extinction_cut_per_million best 0.0002023, nuclear_catastrophe_cut_per_million 0.0003559, ai_extinction_cut_per_million 7.712e-7, ai_catastrophe_cut_per_million 2.742e-7.

**Verdict: pass** (no high or medium finding; one low presentation note)

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against ee138d3d.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against e8ecb2b3.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against 7dbeec92.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 6 rows changed, against HEAD.
