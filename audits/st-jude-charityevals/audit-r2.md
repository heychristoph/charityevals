# Audit: st-jude-charityevals, round 2
Result: 7.206e-6 uov/$ = 0.003603 years of healthy life per 1,000 dollars (combined range 0.00047–0.0276); cause median 0.1085 (×0.033). Verdict: pass.
Model-sha: 55262ff851b4fcb00415731c0821842f3be7c8d00c52ead0e00f141e3f27419e
Scope: scoped verification of commit 70665e1e (round 1's fixes and the changed rows and text only). The scope from round 1 (FY2025, all programmes, spending matching charities/st-jude.json) is unchanged by the commit and was not re-audited.
Mechanical: lint 0 high / 0 medium / 3 low (unused `hospital_total_expenses`, unused `research_expenses`, spread); audit-model `far-below` medium unchanged (explained in round 1 #3). Invariants: none. `scripts/check.ts st-jude-charityevals`: all models valid, no failure. normalization-audit not re-run (no rule changed; the commit adds no shared-figure conversion). generated/ untouched.
Previous round: all 12 resolved (table below); two new lows.

## Round 1 items
| # | R1 sev | Status | Note |
|---|---|---|---|
| 1 | medium | resolved | `gl_evidence_adj`, `internal_validity_adj` and `tr_evidence_adj` each name a reference class (Sacks 1982; Deeks 2003) with figures (44/56 = 79% against 10/50 = 20%). Values stay 0.6 (range 0.3–0.9, 0.3–1.0) with a stated reason. See new #13 for a wording low. |
| 2 | medium | resolved | `gl_baseline_mortality` now anchors on Ward 2019 regional figures; 50% (35–70%) follows from upper-middle 55.5% survival (44.5% die) and lower-middle 24.0% (76% die) evenly mixed, about 60%, reduced for referral hospitals doing better. Sensible. Ward not reachable (see sources). |
| 3 | medium | not a defect | Gap explained in round 1; result moved 0.00342 → 0.00360 (+5%), see the check below. |
| 4 | low | resolved | Summary "0.0005 to 0.03" against live combined range 0.00047–0.0276; "about 0.004" against 0.0036. Write-up "sixtyfold" (0.0276 ÷ 0.00047 = 59) and "4% of its result" fit. |
| 5 | low | resolved | Both anchors (6,400 FY2021; 9,300 now) cited with the definitional caveat; high end 1.5. |
| 6 | low | resolved (partly) | `hospital_et_expenses` says "derived once ... typed so the simulation doesn't draw a remainder" and its page field names the audited pp. 4–5. The three rows are marked "Context:" but the lint does not read that mark: two still show `unused` (new #14). |
| 7 | low | resolved | Hedge replaced by "a risk difference, 5.2 points (95% CI 1.9–8.5; PMC11209355 §3.2)". |
| 8 | low | resolved | `cm_vaccine_effect` has `interval: 0.95`. |
| 9 | low | resolved | `cm_share_75_plus` (0.26), `cm_share_85_plus_of_75_plus` (0.34), `cm_share_80_84_of_75_84` (0.5) feed `cm_value_per_death` correctly: 15–49 share 0.18, 75+ share 0.26, 50–74 the rest (0.56); within 75+, the three five-year weights are mixed. The weights are shared `@moral_weights` rows. |
| 10 | low | resolved | `uov_from_daly` is outside the `(1 + unmodelled_benefits_adj)` bracket; explainer matches. |
| 11 | low | resolved | Beneficiaries 0.88 / 0.12 and note. |
| 12 | low | resolved | `us_cancer_share` page "p. 3, key findings; p. 20, Figure 10". |

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 13 | low | source | `internal_validity_adj`, `gl_evidence_adj` | In `internal_validity_adj` Sacks et al. (trials against earlier patients) is cited for a concurrent, non-randomised comparison between study groups; the explainer itself says it "ran in the same years". The Sacks figure belongs to `gl_evidence_adj`'s design (historical comparison), not this row's. And in `gl_evidence_adj`, 79% against 20% is a rate of positive findings, not a size of overstatement; "keeps 0.42 of the published gain" is a judgment resting on it. | Explainers read directly. | In `internal_validity_adj` drop the Sacks sentence and keep Deeks 2003 alone (concurrent non-randomised comparisons). In `gl_evidence_adj`, say that Sacks gives the rate of positive findings, not the size of the overstatement, so the 0.6 is a judgment inside that class. | 0 |
| 14 | low | structure | `hospital_total_expenses`, `research_expenses` | The "Context:" mark does not clear the lint's `unused` (src/engine/lint.ts line 299 ignores explainers). | audit-model Findings: two `unused` lows. | Delete both rows (the derivation is stated in `hospital_et_expenses`'s explainer and `source.note`), or use them in a check row. | 0 |
| 15 | low | normalization | `us_attribution_share` | The commit puts St. Jude's side of `gl_attribution_share` at full cost (`hospital_indirect_uplift` 1.0806 = 1 + 141.47 ÷ (2,002.08 − 245.98)), because the others' figures carry overheads. In the US branch the other funders are insurers, whose payments include overheads too, but the share is `us_program_spend / patient_care_expenses` with no uplift. | Formula; the US branch is about 9% of the result and the share about 0.81. | Either use `us_program_spend * hospital_indirect_uplift / (us_program_spend * hospital_indirect_uplift + insurers' payments)`, or say in the explainer why the insurers' side is already a direct-cost figure. | about +1% |

## Checks of the changed rows
- `hospital_indirect_uplift`: formula and 1.08 verified (program_expenses 1,756.1M; hospital administration 141.47M, audited p. 5). Applied only to St. Jude's side of `gl_attribution_share`, not to cost, so no double counting with `overhead_ratio` (which spreads ALSAC fundraising and all administration over donors' dollars). The uplift raises St. Jude's side, so the credit share rises from about 21% to the "about 22%" the explainer states. Direction is right.
- Result movement 0.00342 → 0.00360 (+5%) comes from the uplift (+), the `cm_value_per_death` change and the lower `cm_share_15_49`, and the moved `outcome_total`; each is small and in the direction the commit states. No row moves the result more than 10%.
- Write-up and summary figures match the live result (0.004; range 0.0005–0.03; no peer comparison in either).
- `facts/next_dollar.json` and `facts/death_ages.json` changes belong to the research model; not re-audited.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `cm_share_15_49`, `cm_share_75_plus`, `cm_share_85_plus_of_75_plus` | seer.cancer.gov/statfacts/html/cervix.html | verified | Deaths 2020–24: 20–34 4.2%, 35–44 14.3% (so under 45 is 18.5%), 45–54 19.5%, 75–84 12.4%, over 84 6.1%; median age at death 60 |
| same | seer.cancer.gov/statfacts/html/oralcav.html | verified | 35–44 1.7%, 45–54 7.2%, 75–84 23.1%, over 84 12.4% (75+ 35.5%); median 70 |
| `gl_baseline_mortality` | doi 10.1016/S1470-2045(19)30273-6 (Ward 2019, Table 3) | unreachable | Publisher pages redirect without content; PMC and Europe PMC lookups returned nothing. The regional figures (South America 60.2%, Western Asia 56.7%, South-Central Asia 31.3%, etc.) are not confirmed here. Ask for the accepted manuscript or a second source; the value rests on them only loosely (range 35–70% is wide) |
| `gl_evidence_adj` | doi 10.1016/0002-9343(82)90815-4 (Sacks 1982) | unreachable | Counts 44/56 and 10/50 are consistent with my recollection of the abstract but not confirmed on the page |
| `internal_validity_adj` | doi 10.3310/hta7270 (Deeks 2003) | not fetched | Cited only for the general claim that non-randomised bias can be large either way |
| `cm_uptake_increase` | PMC11209355 | verified in round 1 | not re-fetched |

## Drivers
Unchanged from round 1: the shared missing-data discount, `gl_mortality_reduction` (judgment), `gl_local_cost_per_child_2018` (judgment, sourced anchors), `gl_evidence_adj` (judgment, now with a reference class) and `daly_per_child_death`. The most useful remaining improvement is a published outcome series across St. Jude Global sites.
