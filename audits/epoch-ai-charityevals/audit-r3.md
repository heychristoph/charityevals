# Audit round 3 (verification): epoch-ai-charityevals

Scope: the changes since round 2 (`git diff f62b5a8 77a75f8 -- models writeups`): earned_revenue, speedup_harm_share, the new ai_misuse_spend_share row with ai_misuse_cost_share as a formula, and the summary and write-up figures.

## Findings
None. Round 2's three findings are resolved.

| # | Round 2 finding | Check | Status |
|---|---|---|---|
| 1 | earned_revenue over 2024-25 | 2024 raised = 10.3 / 1.4 = $7.36M; receipts $17.66M; gifts $4.2125M (2024: $4,132,488 + $80,000) + $9.955M (2025, the seven gifts listed) = $14.1675M; fees $3.49M = 19.8%; × $5M = $0.988M, stated $990,000. Low $350,000 = 2025 alone ($0.345M); high $1.9M = 0.345 + half of 3.145 = $1.92M. ai_attribution_share = (1 − 0.99/5) × own_work_share 0.9 = 0.72, as the explainer and write-up say. Gift amounts unchanged from round 2's verification of the funding page; "+40% from 2024" from the impact report. | fixed |
| 2 | speedup_harm_share | −30% × 0.3 = −9%, range −60%/−5% × 0.3 = −18%/−1.5%. Scratch check: result with misuse share 0 is 0.0213 against 0.0702, ratio 0.30. | fixed |
| 3 | ai_misuse_spend_share | New judgment row 0.017 (0 to 0.08); ai_misuse_cost_share = ai_misuse_spend_share / catastrophe_relevant_share (0.017/0.6 = 2.8%), relabelled. The tornado now moves ai_misuse_spend_share, not the fixed Sentinel Bio dollars. | fixed |

## Stated figures against `scripts/audit-model.ts`
Bottom line 0.07019 (summary and headline 0.07). Own-range joint 0.001154 to 0.8755 (summary "0.001 to 0.9", write-up "0.001 to about 0.9"). Tornado: chance 0.0089 to 0.468 (write-up 0.009 to 0.47); misuse cut 0.0262 to 0.510 (0.026 to 0.51); misuse share 0 gives 0.0213 (0.021), 0.08 gives 0.2516 (0.25); discount rate 0.1% gives 0.489 (0.49). Speed-up harm range −1.5% to −18% matches the row. The "How this model was checked" section matches the audit history (round 1: one high, three medium; round 2 passed). No stale 0.84, $0.35M, −12% or 1.2-range figure remains.

## Checks
`npx tsx scripts/check.ts epoch-ai-charityevals`: passes ("all models valid"). generated/ untouched (git status clean).

Minor, no fix needed: the write-up says clients' fees are "about $1 million" for $990,000, which is a fair rounding.

Verdict: PASS. No findings.
Model-sha: 31375fd4f8b9dd507a7c9d02a00a403913411668e527452c2c2f01f3dd01159b
Rules: 0.1.1

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against ee138d3d.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against e8ecb2b3.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 6 rows changed, against HEAD.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against ca214e5f.

Re-stamped (17 Nov 2026): credit rule 2.24: fb_credit_share is the skeleton's row (unused here, or wording only): no value change. Mechanical: headline unchanged, 1 row changed, against 2b24b73c.

Re-stamped (17 Nov 2026), rule mobiliser-share-30: the summary's typed range replaced by placeholders rendered from the model (the mobiliser's share now defaults to 30%). Mechanical: headline 0.117 → 0.0351 (−70%), 12 rows changed, against 814eaf77.
