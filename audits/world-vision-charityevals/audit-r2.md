# Audit: world-vision-charityevals, round 2

Result: 2.694e-4 daly/$ = 0.269 years of healthy life per 1,000 dollars (combined range 0.066–1.10); global-health median 0.338 (×0.80). Verdict: pass (0 high)
Model-sha: fad5361a3be06d8256d1c8dff50ad24e6b1760ecffd43bdab0639c78c22bccd1

Scope: unchanged from round 1 (Form 990 lines 4a and 4c, fiscal 2025; the domestic line is the sister model). The non-food donated goods abroad are now their own branch and are taken out of `dev_spend`.
Mechanical: lint 0/0/0 (no findings), invariants none, normalization-audit none for this model (INV-14 clear). check.ts: all models valid. simulation-check: 5% 0.579, 50% 1.00, 95% 1.87 × best guess (stable). `generated/` restored.

Previous round (high and medium findings only checked, as asked):
- 1 (high, typed `unmodelled_benefits_adj`, INV-14): resolved. It is now the sum of four signed `side_effect` rows (sanitation +2.5%, empowerment +1%, food-aid market −1%, dependency −1%), each a ranged judgment with an anchor. Faith and funging are dropped, and child protection stays inside the education branch. The explainer says why. The normalization-audit no longer flags the model.
- 2 (medium, reach implied by costs): resolved. At the defaults livelihoods reach about 0.6M households (107M ÷ $180) against the partnership-share anchor of about 0.64M (GAR p. 11: 1.7M savings members, 100,000 producers, 150,000 ultra-poor households; development share 500M ÷ 1,662M ≈ 0.30). Water reaches about 1.25M people (125M ÷ $100) against 0.3 × 2.8M ≈ 0.9M. That is inside the range, and finding 1 below is the leftover. Folding graduation into the livelihoods cost anchor, not its own row, is accepted: the gain row is a single ranged 1.5% (0–5%) and the evidence is thin either way.
- 3 (medium, donated goods in development reach): resolved. `gik_abroad` 43,261,126 reproduces from the 990 XML (sum of non-"FOOD" Schedule F noncash grants; food commodities and food 217,627,006 = 217,208,346 + 418,660, as quoted). It is subtracted from `dev_spend`. The new branch is on the right chain (value per person, in-kind equivalence, ln gain at `ssa_consumption`, `$uov_per_ln_consumption`), has its own evidence, counterfactual, and `$missing_data_discount`, and is read into `attribution_share_shared`, `missing_data_adj` and `total_adj`.
- 4 (medium, relief attribution): resolved. `relief_attribution_share` 0.85 (0.7–1) is in `relief_total_adj` and in the outcome-weighted `attribution_share_shared`, once each. It is in the tornado (0.240–0.299).
- 5 (medium, relief counterfactual anchor): resolved. The explainer now frames the row as who would have been reached anyway, with the 2025 funding cuts and part rations. It is still a judgment without a figure from OCHA FTS (finding 2 below, low).
- 6 (medium, death-age split): resolved. `share_under5` and the two over-five splits read `@death_ages.diarrhoea_ssa_*` (WHO GHE). Effect under 1%, as before.
- Lows 7–10: staff_cost_share kept at the shared row with a sound reason (990 Part IX: programme-column salaries are $23.0M of $1.22B); `ppp_factor` gone; `gift_to_grant_years` 0.3 (0.15–0.6) matches (354.8M + 156.6M + 67.7M) ÷ 2,212M ≈ 0.26; the static figure is out of the summary.

New problems from the changes: none above low.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | sensitivity | `wash_cost_per_person` | The explainer says "at its share of the reach about $100". With World Vision US at about 0.30 of the partnership's development money, $125M ÷ (0.30 × 2.8M) is about $150, and the model's reach is 1.25M people against 0.9M. $100 is inside the range (50–200) but the arithmetic puts the anchor higher. | GAR 2025 p. 8, p. 22 (development $1,662M); `dev_spend` ≈ $500M × 0.25 | Set best to 150 (range 75–250), or say that the 0.45 share of partnership reach follows from World Vision US funding more water points than its share. | Water is about 8% of the result: $150 gives about −3%. |
| 2 | low | sensitivity | `relief_counterfactual_adj` | Still no OCHA FTS cluster coverage figure. The "well under half funded" claim is stated without a number. | Explainer | Cite OCHA FTS 2025 food-security cluster coverage for Sudan, South Sudan, DRC, Somalia, Ethiopia, Afghanistan. | Unknown direction; the tornado range 0.209–0.318. |
| 3 | low | presentation | `share_5_14_of_over5`, `share_15_49_of_over15`, `share_under5`; "How the impact happens" | The explainers say "From the same split" without saying that diarrhoea in Sub-Saharan Africa is a stand-in for crisis mortality (it puts too few adults in). The impact list has no item for the donated goods abroad. | Formulas; write-up | One sentence in the explainer naming the stand-in; add a point 6 for goods abroad (and advocacy to 7). | None. |
| 4 | low | sensitivity | `gik_value_per_person` | Its anchor ("a few items of clothing") is thin: $30 ($10–80). | Explainer | Anchor on a distribution record or the Schedule F Part II item counts if World Vision publishes them. | The branch is a few % of the result. |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `gik_abroad` | 990 XML Schedule F Part II (object 202611209349301676) | verified | Non-food noncash grants sum to 43,261,126 (reproduced from the XML); food items 217,627,006 |
| `wash_cost_per_person`, `livelihood_cost_per_member` anchors | GAR 2025 pp. 8, 11, 22 (gar25.txt) | verified | 2.8M with clean water; 1.7M savings members; 700,000 families; 150,000 ultra-poor households; development $1,662M (51%) |
| `gift_to_grant_years` anchor | KPMG note 13 (fy25.txt) | verified | $354,837k; purpose restricted: child sponsorship 67,655 and relief/development 156,610 (sum 224.3M, as the explainer says) |
| `staff_cost_share` argument | 990 Part IX, programme-column salaries | verified | $23.0M of programme expenses $1,222M |

## Drivers
1. `$missing_data_discount` (shared slider): 0.054–0.539, correct since every branch is thin.
2. `$uov_per_daly` (shared): 0.461–0.174.
3. `affected_consumption_share` (judgment, 0.55): 0.346–0.226.
4. `relief_counterfactual_adj` (judgment, 0.7): needs a FTS anchor (finding 2).
5. `health_cost_per_child` (judgment, $150): 0.361–0.239.

Next improvement: the water and relief anchors in findings 1 and 2. At ×0.80 of the cause median and between ARC international (0.073) and MSF relief (0.70), the result needs no outlier statement.

Findings by severity: high 0, medium 0, low 4.
