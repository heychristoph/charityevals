# Audit: make-a-wish-charityevals, round 3

Result: 1.981e-5 wellby/$ = 0.001293 years of healthy life per $1,000 (combined range 2.98e-4 – 5.61e-3); cause median 0.3585 (×0.0036). Verdict: pass.
Model-sha: 91ef3fc2e9f4cbaae6b533eaf0a6f1dee83fdcf6b693cdb1df5248ede93d3f5e
Rules: 0.3.8

Scope: unchanged and right (whole US network, fiscal 2024, programme services $201.4M, 16,295 wishes). Round 3 checks only the seven changes made after round 2.

Mechanical: audit-model lint 0 high / 2 medium (outlier vs WELLBY peers; under a tenth of the cause median; both explained in the summary: cost per wish and a few months' effect) / 4 low (the four labelled context rows). Invariants: none violated. normalization-audit: 0 violations (generated/ restored). check.ts: all valid. simulation-check: stable (5% ×0.286, median ×1, 95% ×2.71).

Previous round (round 2):
1. hospital_uov undiscounted: **resolved**. New row `hospital_years` = 2 (observed, quoted "across 2 years" from the Patel abstract); `hospital_uov` = people_reached * hospital_savings_per_wish / hospital_years * pv_annuity_due(1, $discount_rate, hospital_years) * ...; the discount-rate slider now moves this part; the explainer says so.
2. evidence_adj double counted on the hospital part: **resolved**. `hospital_uov` multiplies by counterfactual_adj * attribution_share * implementation_adj * missing_data_adj; its explainer says why evidence_adj is left out. Result moved 0.001119 → 0.001293 (+15.5%, as predicted +14.7% plus the discounting and payer change).
3. payer_multiple: **resolved**. 1 (0.7–1.4), derived from the payer mix, with the Habitat anchor named.
4. household_size series: **resolved**. The explainer says most wish children are of school age and names 4.0 for all married couples with children.
5. "some wishes smaller" in evidence_adj: **resolved** (clause gone; no contradiction with implementation_adj).
6. combined_expenses_check wording: **resolved** (Metro NY note 2 in-kind list: wish travel and goods, professional services, special events, no advertising).
7. two_parent_share citation: **resolved** (Census Bureau, table C3, 2023; the table exists at the cited page; about 71%).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | No new finding. Checked: formulas parse and the units agree (savings $ / years × annuity factor, a dimensionless sum of discount factors ≈ 1.98 over 2, so ≈ 0.99 of the undiscounted value; `hospital_years` has no range, as an observed point, and is the only divisor, so no zero risk). The write-up at the model's defaults: result 0.001 (0.001293), cost per wish about $21,600 (352.5M / 16,295 = $21,632), duration "three weeks" (0.05 years) and "five months" (0.4 years), household "about 2.8 more people" (3.8 − 1), hospital "about a quarter" (setting savings to 0 gives 9.5e-4 of 1.29e-3, i.e. 26%), "0.0008 to 0.0013" over the rounds; its checked-section describes round 2's fixes as now in the model. The explainer of hospital_savings_per_wish (spread over the two years and discounted) matches the formula. | audit-model, check.ts, write-up and model read side by side | | 0 |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| hospital_years | ohiostate.elsevierpure.com (Patel 2019 abstract) | verified in round 1 (same abstract) | "across 2 years" quote matches the follow-up the savings were measured over |
| two_parent_share | census.gov/data/tables/2023/demo/families/cps-2023.html | verified (table) | Table C3 "Living Arrangements of Children Under 18 Years and Marital Status of Parents" is on the page; the ~71% is the table's own two-parent share (xlsx not opened) |
| household_size clause (4.0) | fred.stlouisfed.org/series/CXU980010LB0604M | verified in round 2 | 4.0 for 2024 |
| combined_expenses_check (note 2) | Metro NY FY25 audited statements | verified in round 2 | note 2 total 3,799,345, no advertising line |

## Drivers
1. `initial_effect_sd`: sourced, one RCT; 0.10–1.08 → 5.0e-4 – 2.1e-3. Only a second trial narrows it.
2. `$daly_per_wellby`: a shared slider.
3. `post_wish_years_full_effect`: a judgment (0.15–1) anchored on the 5-week measurement and de Bloom 2009; a follow-up survey months after a wish would improve the model most.
4. `hospital_savings_per_wish`: a judgment (0–4,000), now about a quarter of the result; the Patel paper's charge differences with a cost-to-charge ratio would replace it.
5. `evidence_adj`: a judgment anchored on HLI's shrinkage of single trials.

Verdict: pass. Findings: 0 high, 0 medium, 0 low.

Re-stamped (15 Nov 2026): one consumption scale for US public money (normalization.md 2.14); 0.00129 → 0.00156.
Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2ef0280a.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against c42a537d.
