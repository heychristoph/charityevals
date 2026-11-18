# Audit: arms-control-association-charityevals, round 3
Result: 0.04134 daly/$ = 41.3 years of healthy life per 1,000 dollars, unchanged from round 2. Verdict: pass.
Scope: verification round. Only the change since round 2 (uncommitted `git diff` of the model: one line, the attribution_share_shared explainer) and the one round-2 finding. The rest of the model was passed in earlier rounds and is not re-audited.
Mechanical: audit-model lint 0 findings (dalys_per_donor_dollar 0.04134); the diff touches only the explainer text of attribution_share_shared, no value, range or other row.

Previous round:
1. Worked count sums to $265,000 but text said "about $0.25M" and 0.87: resolved. The explainer now reads "About $0.27M beside $1.69M of cost: 0.86, so 0.9". Arithmetic: $90,000 + $50,000 + $55,000 + $70,000 = $265,000, about $0.27M; 1.69 / (1.69 + 0.265) = 1.69 / 1.955 = 0.864, stated 0.86, rounds to 0.9. Value 0.9 (0.75 to 1) unchanged.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No new findings | - | - | none |

## Sources checked
None needed; no source, figure or value changed.

Verdict: pass (no findings)
Model-sha: 3d80cda25e4aaff50d2f67f2d06e808af19fc63e834b46de70227388ca9d75a5
Rules: 0.3.0

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against ee138d3d.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against e8ecb2b3.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against 7dbeec92.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against ca214e5f.

Re-stamped (17 Nov 2026): credit rule 2.24: fb_credit_share is the skeleton's row (unused here, or wording only): no value change. Mechanical: headline unchanged, 1 row changed, against 2b24b73c.
