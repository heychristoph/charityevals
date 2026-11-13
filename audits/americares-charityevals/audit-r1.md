# Audit: americares-charityevals, round 1
Result: 2.969e-5 uov/$ = 0.0148 years of healthy life per 1,000 dollars (combined range 0.0026–0.0836); cause median 0.338 (×0.044). Verdict: pass (no high finding; two medium).
Model-sha: fc32f9bdfb75069d0da9ec2ea29c730cac6b1cc0bc04c3c35cf37a69d5a501f1
Scope: FY2025 (year to 30 June 2025), the two programme lines Access to Medicine (34,441k cash after 1,729,225k donated goods) and Clinical Services and Community Health (58,521k cash after 5,886k goods) = 92,962k; Emergency Programs (40,106k cash) is the separate model. Together 133,068k = the accounts' "Other program expenses" (p. 7) and charities/americares.json `spending` and `lines`. Complete; no programme left out.
Mechanical: lint 0 high / 0 medium / 4 low (attribution_share diagnostic, unused hs_clinic_share, far-below, spread), invariants none, normalization-audit none for this model (generated/ rewritten, to be reverted). simulation-check stable (5% 0.405, 50% 1, 95% 3.09 × best guess). scripts/check.ts: all models valid.
Previous round: none.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | hs_clinic_share; write-up "Biggest uncertainties" | `hs_clinic_share` feeds only the reading-only `hs_clinic_spend` / `proj_spend` weights of `total_adj`, `counterfactual_adj`, `attribution_share_shared`, not the result (lint: unused). The write-up still lists "how Americares' clinics and project spending divide" as a biggest uncertainty. | Result path: deaths and DALYs use `hs_people`, `proj_workers_trained` and the branch adjustments; cost is all of `hs_spend`. | Delete that bullet from the write-up's uncertainties, and mark `hs_clinic_share` as context in its explainer (it already says reading-only). | none on result; removes a false driver |
| 2 | medium | normalization | don_share_under5, don_share_5_14_of_over5, don_share_15_49_of_over15, hs_share_under5, pap_share_15_49 | Age mix of deaths averted is typed as ranged judgments with no `@death_ages` or WHO GHE anchor; `hs_value_per_death` reuses the donated-medicine 5-14 and 15-49 shares. The rule asks for an `@death_ages` mix or WHO GHE shares. No single `@death_ages` row fits a mixed-cause population (nearest: `cvd_share_*_gbr` for the PAP's US chronic-disease adults). | Value per death is 80 UoV overall; the age-mix choice is worth under ±15%. | Anchor `pap_share_15_49` and its remainder on `@death_ages.cvd_share_*_gbr`, and the donated-medicine and clinic mixes on WHO GHE all-cause shares for low- and middle-income countries, citing them in the explainers; keep the ranges. | under 15% |
| 3 | low | double-counting | med_people, hs_people | `med_people` (1.9M "helped by medicine alone", estimated) probably includes patients of Americares' own clinics, which dispense donated medicine (5.9M of goods in Clinical Services); `hs_people` (364,468 / 2.5 = 146k) is then added on top of `don_people` = 1.9M less PAP patients. The annual report's "across all three programs" footnote marks only the 9M+ prescriptions, so the 1.9M scope is not stated. | Overlap at most 146k of 2.05M reached (7%). | Set `don_people` = `med_people` - `pap_people` - `hs_people` and say so in the explainer, or state why not. | about -3% (donation branch) |
| 4 | low | double-counting | proj_dalys vs don_people | Trained workers' patients (15,889 × 500) overlap partner-clinic patients who get donated medicine where the trainees work in partner clinics; training is about 28% of the outcome (roughly 1,000 of 1,650 UoV from DALYs). | `proj_dalys_per_patient` is a per-patient judgment not net of the medicine branch. | Add a sentence to its explainer accepting the overlap, or cap `proj_attribution_share` high at 0.7. | up to -5% |
| 5 | low | source | proj_dalys_per_patient | Rowe et al. 2018 (Lancet Glob Health 6(11): e1163-e1175) is the right paper, but the explainer's "about 10 percentage points" was not fetched here and the row has no URL. | not checked | Add the DOI or URL to the explainer, citing the page of the training-alone result. | none |
| 6 | low | presentation | write-up | Placeholder "AUDIT_ROUNDS" under "How this model was checked" (expected until the rounds are recorded). | writeups/americares-charityevals.md | Fill from the receipts after the final round. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| program_expenses 133,068k | annual report p. 18; statements p. 7 | verified | "Total Program Services (without GIK) 133,068"; "Other program expenses 133,068" |
| mgmt_general 15,629k, fundraising 21,991k | statements p. 7-8 | verified | total supporting 37,620k |
| atm_expenses 1,763,666k, atm_gik 1,729,225k | statements p. 8 | verified | Access to Medicine column |
| hs_expenses 64,407k, hs_gik 5,886k | statements p. 8 | verified | Clinical Services column; Emergency 50,546k / 10,440k matches the sister line |
| pap_gik 1,345,013k, pap_cash_gifts 15,336k | statements, donated-inventory notes | verified | restricted goods also 189,735k international / 47,455k US / 4,486k emergency (explainer's "80% abroad" correct) |
| atm_salaries 4,210k, hs_salaries 15,727k | statements p. 8 | verified | |
| cash_and_investments 54,958k | statements balance sheet | verified | 11,663 + 43,295 |
| med_people 1.9M | annual report p. 9 | verified | "1.9M people helped by medicine alone* (*estimated)" |
| hs_consultations 364,468; proj_workers_trained 15,889 | annual report p. 12 | verified | consultations footnote "across all programs" |
| inventory 317M for delay_years | statements notes | verified | total inventory 317,058k (net 287,058k) against 1.75B distributed gives about 2 months |
| recorded at US wholesale (list) value | statements notes | verified | US 1,755,084k of 1,755,245k donated supplies |
| Rowe et al. 2018 | none on row | unreachable (not fetched) | finding 5 |
| IQVIA/SSR net-price discounts; WHO/HAI availability | none on rows | unsupported | prose anchors in ranged judgments, no URLs |

## Drivers
1. `missing_data_discount` (shared slider 0.1-1): linear on the whole result (0.003-0.030 across its range).
2. `proj_dalys_per_patient` and `proj_patients_per_worker` (judgments anchored on Rowe et al.): the training branch is about 28% of the outcome; ranges move the result 0.012-0.032 and 0.012-0.023. Best improvement: Americares' project reports for patients per trained worker and a cited effect per patient.
3. `hs_risk_untreated`, `don_risk_untreated` and the risk reductions (judgments anchored on MSF's outpatient row, stated): clinics and donations each give about 10-12 deaths averted.
4. `don_local_price_ratio` (0.3, range 0.1-0.6) with `don_partner_cost_vs_goods` (1): sets donated medicine's credit share of 8%. The credit-share treatment is as ruled: cost is cash only (92,962k × 1.283 overhead); goods enter `*_attribution_share` as goods × price ratio (PAP: net-price 0.5 gives 2.2%; donations 7.7%; clinics 85% judged). No goods value leaks into `cost_total` and none is subtracted twice (`don_spend` = ATM expenses less goods less PAP cash; `hs_spend` less goods), consistent with the emergency line in charities/americares.json.
5. `external_validity_adj` 0.8 stacked on the slider: both say "effects are judged"; defensible but the largest haircut after the slider.

Peers and plausibility: 0.0148 is 0.044 of the cause median (0.338), above Red Cross biomedical (0.0084), far below MSF (0.687); the summary gives the sourced reason and the arithmetic reproduces it (credit shares 2% / 8% / 85%; about 22 deaths and 825 DALYs against 119M dollars). The PAP branch adds about 0.5 deaths, so its unknowns (`wac_per_patient_year`, `pap_risk_*`) hardly matter. Ranges are set, simulation stable. Nothing found moves the result more than 25%.
