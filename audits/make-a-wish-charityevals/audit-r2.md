# Audit: make-a-wish-charityevals, round 2

Result: 1.714e-5 wellby/$ = 0.001119 years of healthy life per $1,000 (combined range 2.40e-4 – 5.21e-3); cause median 0.3585 (×0.0031). Verdict: **fix needed** (1 high, a one-line fix).
Model-sha: f1517b7846cfee770a873ec7a43442c9a2f0a6da2d67eefe8c3a3cc79aba4e23

Scope: unchanged from round 1 and right: the whole US network (national office and 58 chapters), fiscal 2024, programme services $201.4M, 16,295 wishes; one line in charities/make-a-wish.json matching the accounts.

Mechanical: audit-model lint 0 high / 2 medium (outlier vs WELLBY peers; under a tenth of the cause median; both explained in the summary: cost per wish and a few months' effect) / 4 low (the four context rows, labelled "Context"). Invariants: none violated. normalization-audit: 0 violations (generated/ restored). check.ts: all valid. simulation-check: stable (5% ×0.277, median ×1, 95% ×3.04).

Previous round:
1. Hospital costs saved: **resolved** (own rows, side effect, through `wellbys_from_uov`; `unmodelled_benefits_adj` 2%). New issues in the rows themselves: findings 1 and 2.
2. `implementation_adj` = 1: **resolved**. A leftover in evidence_adj's wording: finding 5.
3. Household size: **resolved**. Both new facts verified on FRED. A small point on which series: finding 4.
4. Duration split: **resolved** (`anticipation_years_full_effect` 0–0.05–0.25, `post_wish_years_full_effect` 0.15–0.4–1, area-equivalent ×2; arithmetic checks: 0.17 + 0.25 ≈ 0.4; 0.9 years in all).
5. $500.6M explained: **resolved** (295.8 + 206.8 = 502.6; 500.6 − 352.5 = 148.1, about donated media 67.8 + flows between them 89.9, within the 2% check). Wording of the chapters' media evidence: finding 6.
6. staff_cost_share quote: **resolved** (the whole line including the total, 7,640,865).
7. salary_gap: **resolved** (reason given for local delivery).
8. deaths_averted_per_person: **resolved** (formula 0 with reason; lint low gone).
9. Waiting-list claim: **resolved** (Metro NY note 14, 657 granted and about 1,000 waiting).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | high | normalization | hospital_uov (hospital_savings_per_wish) | The hospital savings fall over the two years after the wish, but they are deliberately left undiscounted ("most of it within two years, so undiscounted"). That breaks the rule that every future benefit is discounted at `$discount_rate`, and it means the discount-rate slider doesn't move this part of the model (one consistent way). | hospital_savings_per_wish explainer; hospital_uov formula has no `$discount_rate`. | Append `* pv_annuity_due(1, $discount_rate, 2) / 2` to `hospital_uov` (savings spread evenly over two years, from the wish), and replace "so undiscounted" in the explainer with "spread over two years and discounted at the shared rate". | −0.35% (scratch: 0.001115) |
| 2 | medium | double-counting | hospital_uov | `hospital_uov` multiplies by `total_adj`, which includes `evidence_adj` (0.5). Every part of evidence_adj is about the Shoshani trial: its size, blinding and outcomes, and Israeli 5-to-12-year-olds with cancer. But the $750 is already our causal best guess from Patel, with selection discounted inside it ("from 0 (selection explains it all)", "charges, which run well above costs"). So the observational-study discount is taken once in the $750 and the trial's discount is taken again on top. | hospital_savings_per_wish explainer; evidence_adj explainer (internal validity 0.65 "one small trial (66 children)…", external validity 0.75 against the trial's population). | In `hospital_uov` replace `total_adj` with `counterfactual_adj * attribution_share * implementation_adj * missing_data_adj`, and say in its explainer that the study's own doubts are in the $750. (Alternative: keep `total_adj` and raise the $750 to the uncorrected figure the explainer then names. That's less clear, so prefer the first.) | +14.7% (scratch: 0.001283) |
| 3 | low | normalization | payer_multiple | The 1.05 is copied from Habitat's US branch, where it is the incidence of **state and local taxes** against consumption (ITEP). Here most savings go to private insurers, and so to employer premiums, which are roughly the same per worker and so regressive against consumption (below 1). Medicaid/CHIP's share saves public money, which by the Habitat model's own rule also avoids the marginal cost of public funds (its `mcpf`, 1.2). Neither is in the row. | payer_multiple explainer: "as for US public money in the Habitat for Humanity awareness model". Habitat: `us_payer_cost_per_person = us_funds_per_person * mcpf / (us_payer_multiple * …)`. | Keep one row, but derive the judgment in its explainer from the payer mix: private insurance about half at about 0.85 (premiums per worker), Medicaid/CHIP about half (children with complex chronic conditions are mostly publicly insured) at 1.05 with the savings × 1.2 for the cost of public funds, and out-of-pocket a small share. Effective multiple ≈ 1/(0.5/0.85 + 0.5/(1.05·1.2)) ≈ 1.0. Set best 1.0 (range 0.7–1.4), naming Habitat's us_payer_multiple and mcpf as the anchors. | +0.7% at 1.0 (scratch bounds: 0.8 → +4.6%; ×1.1 on the hospital part → +1.4%) |
| 4 | low | normalization | household_size | The two-parent fact is the CE series for couples whose **oldest** child is 6 to 17 (4.2). Wish children are 2½ to 17, so some live in households whose oldest child is under 6 or over 17. CE's total for married couples with children is 4.0 (FRED CXU980010LB0604M, 2024). | FRED: LB0606M 2024 = 4.2; LB0604M (all married couples with children) 2024 = 4.0. | Keep LB0606M (most wish children are of school age, and their siblings are mostly under 18), but say so in one clause of the household_size explainer, naming 4.0 for all married couples with children as the alternative. | −2.1% if 3.9 were used (scratch: 0.001096); none as worded |
| 5 | low | structure | evidence_adj | External validity still lists "some wishes smaller, a gift rather than a trip". That is the dose argument that `implementation_adj` now rules out ("no evidence that smaller wishes do less (Convention 5…)"), so the model contradicts itself. | evidence_adj explainer vs implementation_adj explainer. | Delete "; some wishes smaller, a gift rather than a trip" from evidence_adj. Keep 0.75, which rests on age, illness and setting. | none |
| 6 | low | source | combined_expenses_check | The evidence that chapters book little donated media cites "$2,476 of advertising and media in fiscal 2025". That figure is the advertising **expense** line in Metro NY's statement of functional expenses (p. 6), not donated media. The stronger evidence is Metro NY's note 2, whose contributed nonfinancial assets ($3,799,345 in FY25) have no advertising line at all: wish travel and goods $3,681,178, professional services $3,078, special events $115,089. | Metro NY FY25 statements, p. 6 functional expenses "Advertising and Media … 2,476"; note 2 "Total Contributed Nonfinancial Assets and Services 3,799,345". | Reword: "Chapters book no donated media of their own (Metro New York and Western New York's contributed nonfinancial assets, note 2, fiscal 2025: wish travel and goods, professional services and event items only)". | none |
| 7 | low | source | two_parent_share | The anchor "about seven in ten US children live with two parents" has no citation. | Explainer only. | Name the source in the explainer: US Census Bureau, America's Families and Living Arrangements (CPS ASEC), table C3, children under 18 living with two parents (about 71% in 2023). | none |

## Sources checked

| Row | URL | Status | Note |
|---|---|---|---|
| @household_size.united_states_married_with_children_6_17 (4.2) | fred.stlouisfed.org/series/CXU980010LB0606M | verified | "Married Couple with Children, Oldest Child 6 to 17", 2024: 4.2 (2023 and 2022 also 4.2) |
| @household_size.united_states_one_parent_with_children (3.0) | fred.stlouisfed.org/series/CXU980010LB0609M | verified | "One Parent, at Least One Child Under 18", 2024: 3.0 (2023 3.1, 2022 2.9) |
| household_size, for comparison | fred.stlouisfed.org/series/CXU980010LB0604M | verified | All married couples with children, 2024: 4.0 (finding 4) |
| combined_expenses_check (chapters' media) | wish.org FY25 Audited Financial Statements (Metro NY) | partly | p. 6 $2,476 is an expense; note 2 has no donated advertising (finding 6) |
| counterfactual_adj (note 14) | same | verified in round 1 | 657 granted in FY24, about 1,000 waiting |
| staff_cost_share | same | verified | total column 7,640,865 of 18,946,687 |
| program_expenses, fundraising, management, people_reached, initial_effect_sd, volunteers, donated_media_reported | as in round 1 | verified in round 1, unchanged | values and quotes as before |
| hospital_savings_per_wish quote | ohiostate.elsevierpure.com (Patel 2019 abstract) | verified in round 1 | 1.9× fewer ED visits; the $750 is a judgment |

## Drivers

1. `initial_effect_sd`: sourced, one RCT (n = 66), 0.10–1.08 → 0.00033–0.0019. A second trial is the only way to narrow it.
2. `$daly_per_wellby`: a shared slider.
3. `post_wish_years_full_effect`: a judgment, 0.15–1, anchored on the 5-week measurement and de Bloom 2009. A follow-up measurement (any wish charity's own survey months after the wish) would most improve the model.
4. `evidence_adj`: a judgment anchored on HLI's shrinkage of single trials.
5. `hospital_savings_per_wish`: a judgment, 0–4,000, now about a seventh of the result (about a quarter of it once finding 2 is fixed). The full Patel paper's charge differences, converted to costs with a cost-to-charge ratio, would replace the judgment.
