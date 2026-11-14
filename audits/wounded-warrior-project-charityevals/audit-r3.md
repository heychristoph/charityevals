# Audit: wounded-warrior-project-charityevals, round 3 (verification)

Result: 1.253e-5 daly/$ = 0.01253 years of healthy life per 1,000 dollars (combined range 0.0020-0.077); cause median 0.338 (x0.037). Verdict: **pass** (no high findings).
Model-sha: dbdf279dd55a65eabedcb161c95cf2bc1c6b23460c92ee04e031b08fa7874300
Scope: unchanged from round 2; only the rows the builder listed were checked.
Mechanical: lint 0 high / 0 medium / 1 low (far-below; the summary gives the reason, about a thirtieth of the median, matches x0.037). Invariants: none for this model. normalization-audit: no violation for this model (the one INV-4 violation is habitat-for-humanity-charityevals-awareness). `git checkout -- generated` run afterwards.

Previous round (the seven findings the builder changed or declined):
1. `vba_cost_per_claim` (medium): **resolved**. 1,000 (700-1,400); the explainer now has the whole General Operating Expenses account over about 3 million claims (about $1,330) and says a disability claim's share is lower. It cites no URL in the row text (the OIG and VA press release are named, not linked); see finding 2.
2. `ben_counterfactual_adj` and `ben_income_years` reference classes (medium): **resolved in substance**. WWP's 83% (FY2024) and 87% (FY2022) approval rates are set against the VA's overall grant rate; the SSA life table (about 38 years, about 20 discounted), supplemental claims (4-5 months) and Board appeals (years) bound the years. Two small gaps remain (finding 1).
3. `attribution_share_shared` (low): **resolved**. Now `wwp_share_of_cash * cost_total / (cost_total + psa_other_programmes)` = 0.95 x 250.0/(250.0+40.8) = 0.8168; computes and reads right.
4. Stale text (low): **resolved**. `ben_attribution_share` says "about 0.8"; the row is 0.8022. `deaths_averted_per_person` now points to `con_deaths_per_person`. `ind_inkind_equivalence` says the respite row is separate. The summary says credit is shared with the VA's cost, not netted. (The model has no separate write-up file in this checkout, so the write-up wording was not checked.)
5. `adv_implementation_adj` and `cp_implementation_adj` (low): **resolved**. Both are 1, with reasons, and feed `adv_total_adj` (0.3204) and `cp_total_adj` (0.1402) as the last-but-one factor; the formulas compute.
6. `us_payer_multiple` to a shared fact (low): **declined, accepted for now**; see finding 2.

Result moved from 0.0109 to 0.0125 (+15%), as expected from the changes: the lower VA cost per claim (+8.6%), the full-cost credit (+5.9%), the two implementation rows at 1.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | sensitivity | `ben_counterfactual_adj`, `ben_income_years` | Both now have a reference class, but not the last step. The VA's grant rate is "well under two-thirds" with no figure or source; the split between lifetime and brought-forward awards that gives 10 years is not stated. | Explainers. | Replace "well under two-thirds" with the VA Annual Benefits Report figure for disability issues granted, with year; add one sentence giving the assumed split (for example "about a quarter lifetime at 20 years, three quarters timing at 3 years gives about 8"). | none (wording) |
| 2 | low | normalization | `us_payer_multiple` | Still a typed judgment in the model (8th in the tornado, 1.3 (1-2)); the explainer says why. Consistent with the deferral, but once `facts/public_funds.json` merges the model should read it. | Tornado: 0.0097-0.0158. | After the other branch merges, replace the row by the shared fact (or a row reading it), keeping the 1.3 as the model's judgment only if the fact has no US-payer figure. Also give `vba_cost_per_claim` the OIG and VA press-release URLs in `source`. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `vba_cost_per_claim` | https://news.va.gov/press-room/va-reduces-backlog-of-veterans-waiting-for-va-benefits-by-57/ | verified in round 2 | about 3.0M claims in FY2025; $4B GOE from VA OIG, also verified in round 2; not re-fetched, only the row's arithmetic was re-checked ($4.0B / 3.0M = $1,330) |
| `ben_counterfactual_adj`, `ben_income_years` | WWP impact reports, SSA period life table | not re-fetched | figures (83%, 87%, 38 years) match what round 2 found; the VA grant rate has no number (finding 1) |

## Drivers
`missing_data_discount` (judgment), `ben_income_years` (judgment, now with a reference class), `uov_per_daly` (shared), `ben_consumption_share` (judgment), `ben_counterfactual_adj` (judgment, now with a reference class). What would most improve the model: the VA grant rate figure and the lifetime/timing split (finding 1).
