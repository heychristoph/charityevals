# Audit: hias-charityevals, round 2
Result: 3.140e-6 daly/$ = 0.0031 years of healthy life per 1,000 dollars (combined range 0.00054–0.018); cause median 0.0954 (×0.033). Verdict: pass.
Model-sha: 08513fdd234b0335f552c8915df1f56b6b653bdc04833e1d268ec644da226de3
Scope: unchanged from round 1 (US operations, fiscal year to 30 September 2025: $80,432,761 less $18,746,450 donated services less the $3.0M advocacy judgment = $58.69M cash spending, resettlement and integration $55.2M plus a $3.5M legal judgment). Exhibit B and the Form 990 figures re-checked against fs.txt and 990.txt; charities/hias.json spending and lines unchanged and still match.
Mechanical: lint 0 high / 0 medium / 2 low (far-below, with its reason in the summary; spread, stated in the summary), invariants none, normalization-audit no violation for this model (the only violations printed are other models'), `scripts/check.ts` all models valid, simulation stable (5%–95% = 0.40–2.61× the best guess). generated/ was rewritten by the scripts and restored with `git checkout -- generated`.
Previous round: all 14 findings resolved (list below). The result moved from 0.0026 to 0.0031 (+21%), which matches what the round-1 fixes imply (findings 1-3 about +30% on the legal branch, which is 63% of the outcome, less the other changes).

| R1 # | Status | Check |
|---|---|---|
| 1 | resolved | `leg_wait_years` 3 (1-5) discounts `leg_stay_ln` (the whole annuity, `(1+$discount_rate)^(0-leg_wait_years)`, so the stream starts at removal) and `leg_deaths`. Formula and direction correct. Not discounted twice. |
| 2 | resolved | `leg_consumption_share_stayed` 0.6 (0.4-0.8), `leg_cons_stayed` = 19,634 used in `leg_stay_ln`. Anchored on the shared poorest/second-quintile facts, which exist in facts/united_states.json. |
| 3 | resolved | Remittances inside `leg_stay_ln`: `origin_household_size` × ln(1 + share × cons_stayed / (cons_origin × size)); household size from `@household_size.honduras` (4.4). Adds about 15% to the per-year term (0.295 of 1.93). Units right. See N1 for a small netting omission. |
| 4 | resolved | `rst_counterfactual_adj` = `rst_pre_cut_share` × `rst_cf_pre` + (1 − share) × `rst_cf_post` = 0.42; each row has a reference class and the 24 January 2025 date is in note 1 (fs.txt) and the "$91 million to $80 million" is Exhibit B (91,092,254 to 80,432,761). |
| 5 | resolved (low remainder, N2) | `leg_removed_if_lost` now states the reference class (removals against final orders, a fifth before 2025, higher after). |
| 6 | resolved | `rst_cash_goods_share` 0.2 (0.1-0.35) rebuilt from Schedule I Part III (990.txt: R&P 1,574 and 1,790 recipients, $283,268 and $530,981; Ms. L 1,116 recipients, $1,383,790) and the R&P per-capita rule. Numbers match the filing. |
| 7 | settled | `rst_people` 13,500 with the fiscal-year argument (Schedule I: 1,574 + 1,790 = 3,364 R&P recipients against 1,725-2,213 resettled in calendar 2025). The explainer says the fiscal year offsets the legal clients; the effect of 12,000 against 13,500 is under 3%. |
| 8 | resolved | `leg_latam_share` 0.55 (0.35-0.75) weights Latin America against Kenya. |
| 9 | resolved | Template's three age-share rows restored, feeding `value_per_death`. |
| 10 | resolved | `rst_unmodelled_adj` and `leg_unmodelled_adj` applied in each branch's bridges; the canonical `unmodelled_benefits_adj` = `ue_health_share` only, applied once in `outcome_total`; per-branch `rst_leverage_funging_adj` / `leg_leverage_funging_adj`, the canonical row outcome-weighted for reading only. No double application found. |
| 11 | resolved | `ue_work_permit_share` 2% (0-6%) in the legal branch. |
| 12 | resolved | `unrep_grant_rate` 0.12-0.25 with `rep_grant_ratio` drawn with it. |
| 13 | resolved | `salary_gap` = `@staff_pay.gap_local_delivery`. |
| 14 | resolved | Citations are PDF pages (p. 9: 13,400+, 18,000 hours, 117 SIV holders; p. 4: 1,725; p. 5: deportation expansion; p. 10: social services), all confirmed in ar.txt; "117 Afghan SIV holders" fixed; the R&P per-capita figure is cited to CRS R44878. |

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| N1 | low | double-counting | leg_stay_ln | The remittances sent home are not taken out of the client's own consumption: the client term uses `leg_cons_stayed` in full while the family term sends 6% of it. | `ln(leg_cons_stayed / leg_cons_origin)` and the remittance term both use the full 19,634. | Use `leg_cons_stayed * (1 - leg_remit_share)` inside the first ln (or add a `leg_cons_kept` row). | about −3% of `leg_stay_ln`, −2% overall |
| N2 | low | source | leg_removed_if_lost, leg_wait_years, leg_remit_share | The anchors are described in words only: "a few hundred thousand removals against over a million final orders", "asylum cases take years", "5-10% of income home". No URL or table is cited (round 1 asked for DHS OHSS / TRAC / IDB figures). `leg_removed_if_lost` is the #3 tornado input. | Explainers of the three rows. | Cite the DHS Office of Homeland Security Statistics removals and the EOIR final-order docket for `leg_removed_if_lost`, TRAC's pending-case time for asylum for `leg_wait_years`, and a remittance survey (IDB or Inter-American Dialogue) for `leg_remit_share`, with the numbers. | none at the default |
| N3 | low | sensitivity | rst_pre_cut_share, rst_cf_post, rst_leverage_funging_adj | (a) Exhibit B arithmetic gives about 38% (four months at fiscal 2024's $91.1M a year is $30.4M of $80.4M), under the 45% best guess (inside the 30-60% range). (b) `rst_cf_post` already counts that the courts restored some funding, and `rst_leverage_funging_adj` (0.95) says the same ("may be restored by the courts"). | Exhibit B; the two explainers. | Set `rst_pre_cut_share` best to 0.40 and name the 38% in its explainer; drop the court-restoration clause from one of the two rows. | about +3% on resettlement |
| N4 | low | normalization | leg_cons_origin | The Latin American stand-in is still an equal-weight `avg(cons_ppp_hnd, cons_ppp_per)` (Convention 7). | Formula. | Weight Honduras and Peru by a ranged judgment, or use Honduras alone with a note, anchored on EOIR asylum filings by nationality. | about ±3% |
| N5 | low | presentation | leg_other_ls_gain, writeup | `leg_other_ls_gain` still names work permits as a life-satisfaction gain, and `ue_work_permit_share` now counts them as an income gain; the write-up does not mention either work-permit or social-services shares. | Explainer; writeups/hias-charityevals.md "Adjustments". | Drop "work permits" from the `leg_other_ls_gain` explainer; add to the write-up's adjustments line "legal clients' work permits and social services". | none |

The write-up matches the model: 13,500 people, 20% reach, the 29-point uplift (0.18 × 1.6 = 0.288), halved for selection, 40% removed after about three years, 20 years, remittances, pro bono at a wage, "about three-fifths" legal (63%), headline 0.003 live. No stale figure found.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| us_ops_expenses | HIAS-2025-Consolidated-Financial-Statements.pdf | verified | Exhibit B: U.S. Operations 80,432,761 (FY2024 91,092,254) |
| us_personnel, donated services, 24 January 2025 notice | same | verified | Exhibit C and notes 1 and 9 |
| leg_clients | HIAS-2025-990.pdf | verified | Schedule O: 1433 |
| rst_cash_goods_share (Schedule I) | same | verified | Part III: 1,574 / $283,268; 1,790 / $530,981; 1,116 / $1,383,790; Schedule O 2,213 resettled |
| rst_people, pro_bono_hours, SIV holders | HIAS-Annual-Report-2025.pdf | verified | PDF p. 9 (printed p. 16): 13,400+, 18,000 hours, $18.6 million, 117 Afghan SIV holders; PDF p. 4: 1,725 |
| leg_removed_if_lost (annual report claim) | same | verified | PDF p. 5: expanded deportations to third countries; removed-share numbers not sourced (N2) |
| unrep_grant_rate, rep_grant_ratio | tracreports.org/whatsnew/email.221129.html | verified (round 1) | unchanged quote |
| CRS R44878 per-capita figures | not fetched | unverified | cited in two explainers, context only |

## Drivers
1. `$missing_data_discount` (shared; both branches thin, correct by the glossary).
2. `$uov_per_daly`, `$uov_per_ln_consumption` (shared).
3. `leg_removed_if_lost` (judgment with a stated reference class; needs its figures cited, N2).
4. `leg_years_stayed` and `leg_evidence_adj` (judgments), with `leg_counterfactual_adj`.
5. `discount_rate`, now also acting through `leg_wait_years`.
Most improving: cited figures for the removed-share, wait and remittance rows.

**PASS** (no high findings)
Model-sha: 08513fdd234b0335f552c8915df1f56b6b653bdc04833e1d268ec644da226de3
