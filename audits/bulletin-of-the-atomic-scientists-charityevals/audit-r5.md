# Audit: bulletin-of-the-atomic-scientists-charityevals, round 5 (verification round)
Result: 0.01615 daly/$ = 16.15 years of healthy life per 1,000 dollars (combined range 0.76-342), unchanged; cause median 1.576 (x10.25). Verdict: pass.
Model-sha: f551575bbbc92cf5762c9dbd6471bc00362d52c31930c2ea68d215b256053201
Rules: 0.3.7
Scope: only the change in the `summary` line (the file's only change against main): the added sentence "It is more than ten times its peers because its nuclear coverage is valued at a typical nuclear project's cut per dollar, hundreds of times a typical AI misalignment project's, and most of its peers work on AI." The multiple is 10.25 against the median of all 25 catastrophic-risk models, just over the threshold; INV-15 (ranked peers only) shows no violation. The sentence sits between the nuclear-coverage description and "It is below the Arms Control Association, the Nuclear Threat Initiative and Ploughshares Fund", which does not contradict it (those are nuclear-only peers above the median).
Mechanical: audit-model findings (0). normalization-audit INV-15 checked 247 models, 0 violations (generated/ restored with git checkout). Not re-run this round (scoped): check.ts, simulation-check. No file in generated/ was changed.

Previous round (round 4): no open finding carried over.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | model `summary` | "Hundreds of times a typical AI misalignment project's" is true for the extinction presets (0.0002023 / 7.712e-7 = 262) and understated for the catastrophe presets (0.0003559 / 2.742e-7 = 1,298). | facts/catastrophe.json best values | None needed; "hundreds" is a safe lower statement. | none |

## Sources checked
None re-fetched (scoped round; no row or source changed). facts/catastrophe.json presets read: nuclear_extinction_cut_per_million best 0.0002023, nuclear_catastrophe_cut_per_million 0.0003559, ai_extinction_cut_per_million 7.712e-7, ai_catastrophe_cut_per_million 2.742e-7.

**Verdict: pass** (no high or medium finding; one low presentation note)

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline 16.15 → 16.15 (−0.0034%), 12 rows changed, against ee138d3d.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against e8ecb2b3.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against 7dbeec92.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 7 rows changed, against HEAD.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline 16.22 → 16.22 (+0.000078%), 12 rows changed, against ca214e5f.

Re-stamped (17 Nov 2026): credit rule 2.24: fb_credit_share is the skeleton's row (unused here, or wording only): no value change. Mechanical: headline unchanged, 1 row changed, against 2b24b73c.
