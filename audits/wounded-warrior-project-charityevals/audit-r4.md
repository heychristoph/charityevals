# Audit: wounded-warrior-project-charityevals, round 4 (verification)

Result: 1.262e-5 daly/$ = 0.01262 years of healthy life per 1,000 dollars (combined range 0.0021-0.078); cause median 0.338 (x0.037). Verdict: **pass** (no high findings).
Model-sha: 0f4c9d1a39fb456fab7d0f2a74f7ce27af78bdef927d0a79d837ad8d813ef872
Scope: unchanged; only the one change after round 3 was checked.

Mechanical: audit-model 0 high / 0 medium / 1 low (far-below, the summary gives the reason). normalization-audit: no violation for this model (the one INV-4 violation is habitat-for-humanity-charityevals-awareness); `git checkout -- generated` run afterwards.

Change checked: `attribution_share_shared` = `wwp_share_of_cash * cost_total / (cost_total + wwp_share_of_cash * psa_other_programmes)` = 0.95 x 250.0M / (250.0M + 0.95 x 40.78M) = 0.8225, which computes and matches the row. It is the share of all cash (cost_total / wwp_share) plus the donated announcements, as the explainer says (round 3's version, 0.8168, set the announcements against WWP's cost only). The result moved from 1.253e-5 to 1.262e-5 (+0.7%), as a slightly higher share implies. The canonical-row comparison with the peers shows `attribution_share_shared` 0.82 against 0.16-0.89, in range.

Write-up (writeups/wounded-warrior-project-charityevals.md) checked against the model: headline 0.01 matches 0.0126; the benefits credit "WWP's share about 0.8" matches `ben_attribution_share` 0.8022; "$263.7M of awards" and the branch descriptions are unchanged; the "How this model was checked" paragraph names the announcements set against all the cash behind the programmes in both models, which is what both formulas now do.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | carried over | `us_payer_multiple`, `vba_cost_per_claim`, `ben_counterfactual_adj` | The three low items from round 3 stand unchanged and were not re-checked: the typed `us_payer_multiple` until the public-funds fact merges, the missing URLs in `vba_cost_per_claim`'s source, and the VA grant-rate figure and lifetime/timing split in `ben_counterfactual_adj`/`ben_income_years`. | Round 3 findings 1-2. | As in round 3. | none |

## Sources checked
None re-fetched: `psa_other_programmes` ($63,771,143 - $22,995,874 = $40,775,269) was verified in earlier rounds and its arithmetic re-checked here.

## Drivers
`missing_data_discount`, `ben_income_years`, `uov_per_daly`, `ben_consumption_share`, `ben_counterfactual_adj` (all judgments or shared; unchanged from round 3).
