# Audit: govai-charityevals, round 10 (verification of round 9's findings)
Result: 0.009032 daly/$ = 9.03 years of healthy life per $1,000. Verdict: pass.
Model-sha: 7c69e27f153c743cf13b12b97c4a26fb9a15dc8446dea0194a768024ee8406ab
Rules: 0.1.0
Scope: scoped verification of round 9's four findings and what they introduced.
Preflight: pass (lows only: unused code_resources, out-of-date distributions line).
Previous round: finding 1 (high, attr_policy denominator) resolved; finding 2 (medium, fb_share_working) resolved; findings 3 and 4 (low) resolved.

Verdict: pass

| # | Severity | Category | Row | Finding | Fix |
|---|---|---|---|---|---|
| 1 | low | presentation | code_resources | The lint reports it unused: it no longer feeds the result (attr_policy reads code_coadvocate_resources); it is the base of the anchor in pol_relative_cut's explainer only. | Add to its explainer: "Context, not read by a formula: everyone's resources behind the chapter, the base for the typical-rate anchor in pol_relative_cut; GovAI's share (attr_policy) is over code_coadvocate_resources." |

## Checks
- `attr_policy` = 240,000 / $7M = 3.4%; denominator is chairs, submitters and outside participants only; AI Office and providers named as mobilised in both explainers. code_coadvocate_resources $7M (3M-15M) judgment, with its components traceable to code_resources' own list (chairs $1.3M; parts of $4M and $3M). Range is consistent with the explainer.
- `fb_share_working` 0.17 (0.07-0.35): explainer arithmetic 60% x a third x 0.8 = 16%, a little more for scholars = 17%, consistent.
- `fb_credit_share` explainer is the round 9 wording; value 1 (0.5-1) unchanged.
- Headline 9.03 reproduces. Branch values: training 78.3%, research 13.8%, Code 7.9%; the summary's "78%, 14%, 8%" is right; the summary's Code share and range use placeholders.
- Class unchanged (research, mobiliser_share read once).

## Writeup edits (writeups/govai-charityevals.md)
Code bullet: $20 million sentence replaced by the $7 million co-advocates' resources and about 3%; "about 2%" to "about 8%" (also in the uncertainties); training: 22% to 17% (twice), "85% / 12%" to "78% / 14%"; table: Code resource share "about 0.01 (its spending over everyone's)" to "about 0.03 (its spending over its co-advocates')".

Re-stamped (17 Nov 2026): credit rule 2.24: fb_credit_share is the skeleton's row (unused here, or wording only): no value change. Mechanical: headline unchanged, against 814eaf77.
