# Audit: world-vision-charityevals-domestic, round 3

Result: 5.540e-6 daly/$ = 0.00554 years of healthy life per 1,000 dollars; global-health median 0.338 (x0.016). Verdict: pass (0 high)
Model-sha: 2568cc5a6c9533a54f6bad6dfbc6777b81e276e4d67e5022758fe5c4e159e394
Rules: 0.2.0

Scope: unchanged. Only the changes after round 2 were checked.
Mechanical: audit-model.ts 0 high or medium (one low, far-below, which the summary explains); check.ts all models valid.
Previous round: no open high or medium findings.

Findings: none above low.
- Summary: the stale 0.004 figure is gone and the text still gives the reason for the gap to the median. Resolved.
- `households_reached` explainer: "about 1.1 million" matches the computed 1,144,000.
- `ue_school_share` explainer: "about 1-1.5%" is consistent with KPMG note 16 ($3.2M of school and office supplies, against $206M of goods used at home, about 1.6% of all received); wording only.
- Write-up: the live-figure fallback 0.006 matches the result (0.00554).

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (15 Nov 2026): donated goods moved from the cost to the credit share at the shared US market value (Convention 2), partners' resources as their own row; 0.00554 → 0.00719.
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against bebc953e.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against c42a537d.
