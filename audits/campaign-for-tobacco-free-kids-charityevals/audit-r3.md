# Audit: campaign-for-tobacco-free-kids-charityevals, round 3 (verification)

Model-sha: 09e4dae00cdf248982314992b5ecc45869b01b806c79d1435f2f15d532a54c93

Scope: only the four changes since round 2. `audit-model.ts` runs clean (0 findings; 0.1344 years of healthy life per $1,000, combined range 0.0097 to 1.855); `check.ts` reports all models valid.

Checked and fine: (1) adv_short_term_share range 0.4 to 0.8, best 0.5, explainer's 40% to 80% matches the row and the 1.25 to 2.5 multipliers. (2) glob_implementation_adj 0.75 (0.5 to 0.9), explainer matches. (3) Write-up: 0.16% a year (2016 to 2020) and about 0.14% in the ten countries match the model's anchor text; enforcement 90% US / 75% abroad matches us_ and glob_implementation_adj; branch shares 72/18/9 match the credited values (global 11,577, GHAI 2,925, US 1,468 DALYs: 72.5%, 18.3%, 9.2%); tornado "0.08 to 0.35" matches 0.0759 to 0.3487; no UN population mention remains in the write-up or model; the checked paragraph is accurate. (4) OURS entry sums to 1.0000: ten countries 0.7249, USA 0.0919, world 0.1832; matches the model's `beneficiaries` field exactly and the branch shares.

| Severity | Row | Finding | Fix |
|---|---|---|---|
| low | adv_short_term_share | Explainer ends with "0.5, 0.35 to 0.75", the old range; the row is now 0.4 to 0.8, so the explainer contradicts itself. | Change the last sentence to "0.5, 0.4 to 0.8" (the "40% to 80%" earlier in the text already says it, so it could also be deleted). |

**Verdict: pass**
