# Audit: refugees-international-charityevals, round 3 (verification)
Result: 2.597e-4 uov/$ = 0.130 years of healthy life per 1,000 dollars (combined range 0.0155–1.09; simulation 5%–95%: 0.19–6.2× the best guess, stable); cause median 0.0866 (×1.50). Verdict: pass.
Model-sha: 635f8acd30b99063fcae4fa933646967a14f048983eec1d138e28738dc02366d
Scope: verification of the changes since round 2 (the model and write-up diff from commit 8535bb5 to HEAD): the fixes to all thirteen round-2 findings. Programme scope unchanged (both 2024 programme lines, $4.5m of program services; $5.67m total expenses). Branch contributions at the defaults (units of value): Haiti 1,728 (42% of the result), Sudan funding 838 (20%), Sudan access 117 (3%), Costa Rica 199 (5%), other campaigns 1,210 (30%).
Mechanical: lint 0 high / 0 medium / 1 low (spread, stated in the summary); invariants none; normalization-audit no violations for this model (0 violations anywhere); check.ts valid; simulation stable (median 1.0×).
Previous round:
1. Humanitarian dollar (M1): **resolved**. sdn_aid_vs_cash = `@aid_value.humanitarian_vs_cash` (0.2, facts/aid_value.json, normalization.md 2.20) × sdn_response_vs_average 1.5 = 0.3; displaced aid at the shared 0.2 without the premium; facts/humanitarian.json gone; the shared figure is the 7th tornado driver and moves the Sudan, access and displaced rows together. That a fixed multiple doesn't follow `$life_value_multiplier` is the owner's rule in 2.20, stated in the fact's note.
2. sdn_evidence_adj (M2): **resolved**. 1, with a reason naming the shared figure, sdn_response_vs_average and the missing-data step.
3. Access (M3): **resolved**. Own branch: acc_value_per_year = funding × acc_aid_unlocked_share (2%, 0.5–8%) × sdn_value_per_dollar × sdn_wait_discount, no displacement, with acc_counterfactual_adj 20% (5–50%) as NRC's advocacy model, its own attribution share and missing-data step; sdn_access_ratio removed; envoy, genocide determination and UAE pressure moved into other_wins_ratio; all four acc_* adjustments enter outcome_total. 2% against NRC's 5% × 15% = 0.75% is inside the stated range. One residue: finding 1.
4. Credit anchors (M4): **resolved**. sdn_attribution_share 4.5% = 45% (US government $738.9m + State $106.6m of $1,889m, FTS plan 1188, verified in round 2) × a tenth; the Haiti rows name IRAP advocacy's 8% (usrap_p_success) and 6% (usrap_attribution_share) as the reference class (both values checked in that model).
5. Template placeholders (L5): **resolved**. policy-research-meta.json lines 312–351 read `@meta.career_*_default`.
6. Brain drain (L6): **resolved**. −7% (−20% to −2%), gross of remittances, applied to hai_own_value_per_person_year only; formula `units × years × (value_per_person_year + own × loss)` checked.
7. Family reunification (L7): **resolved**. In other_wins_ratio's anchor (8 × 15% + 5%) / 3 = 42%, low and high restated (11%, 150%); the write-up lists it.
8. 2023 funding (L8): **resolved**. 51% (FTS plan 1123: $1,319.4m of $2,565.2m, verified in round 2) in both explainers.
9. cri_evidence_adj (L9): **resolved**. 0.8 (0.5–1), external validity only; the narrower change stays in cri_work_permit_share_of_effect.
10. US consumption (L10): **resolved**. hai_us_consumption = `@united_states.ce_expenditure_per_person_2024 * @irap.destination_consumption_share` ($14,725; shared fact 0.45, 0.3–0.7).
11. Death value (L11): **resolved**. hai_value_per_death mixes the 5–14, 15–49 and 50–74 bands by three ranged judged shares × `$life_value_multiplier`.
12. UNHCR source (L12): **accepted**. Still unarchived (403); the note says so and the value stays.
13. Write-up shares (L13): **resolved**. Haiti "about two fifths" (42%), Sudan "about a quarter" (23% with access), Costa Rica "under a twentieth" (4.9%), the summary the same; the result 0.13, the range 0.02–1.1 and "about one and a half times the median" match audit-model; "between MSF's (0.065) and Save the Children's (0.42)" holds.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | double-counting | acc_evidence_adj (0.7, 0.4–1) | The access branch discounts for "diversion, other routes" a second time. The dollar it uses, sdn_value_per_dollar, already carries Sudan's pull-back for "access problems and diversion by the warring parties" (sdn_response_vs_average's explainer), the reason round 2 gave for taking sdn_evidence_adj to 1; and acc_aid_unlocked_share already counts only the part that would not have gone through Tine anyway. One question per adjustment (Convention 5). | explainers of acc_evidence_adj, sdn_response_vs_average, acc_aid_unlocked_share; scratch: access contribution 117 → 167 at 1 | Set acc_evidence_adj to 1 with the reason "the dollar's value is the shared figure and the premium, already net of diversion; the share let through is acc_aid_unlocked_share", or restate it for a question no other row asks. | +1.7% at 1 |
| 2 | low | presentation | beneficiaries (CRI 0.06, TCD 0.02, SDN 0.21, UGA 0.03) | The shares don't quite follow the branch shares: Costa Rica is 4.9% (0.05), Sudan's access branch (assigned to Chad) 2.9% (0.03), Sudan's funding 20% (0.20), the other four campaigns 30%. Haiti 0.42 is right. | branch contributions above | Set CRI 0.05, TCD 0.03, SDN 0.20, UGA 0.04 (sum 1.00 with HTI 0.42, UKR 0.08, PSE 0.08, USA 0.10). | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| sdn_attribution_share (US 45%), sdn_funding_2024 | https://api.hpc.tools/v1/public/fts/flow?planId=1188&groupby=plan | verified (round 2, unchanged) | US government 738,902,170 + State 106,612,257 of 1,889,336,676 = 44.7%. |
| sdn_counterfactual_adj, sdn_funding_2024 (2023 context) | https://api.hpc.tools/v1/public/fts/flow?planId=1123&groupby=plan | verified (round 2) | 51%, now the number in the text. |
| hai_counterfactual_adj, hai_attribution_share (reference class) | models/global-health/international-refugee-assistance-project-charityevals-advocacy.json | verified | usrap_p_success best 0.08; usrap_attribution_share best 0.06 (2–15%). |
| acc_counterfactual_adj, acc_aid_unlocked_share (cross-check) | models/global-health/norwegian-refugee-council-charityevals-advocacy.json | verified | acc_counterfactual_adj 0.2 (0.05–0.5); acc_aid_gain_share 0.05 × acc_affected_share 0.15 = 0.75%. |
| @aid_value.humanitarian_vs_cash | facts/aid_value.json, docs/normalization.md 2.20 | read | 0.2 (0.05–0.8), the shared rule. |
| @irap.destination_consumption_share | facts/irap.json | read | 0.45 (0.3–0.7). |
| acc_aid_unlocked_share | not refetched | judgment | Ranged judgment with a cross-check; OCHA's Adre truck count would sharpen it. |
| remaining inputs | as rounds 1 and 2 | unchanged | |

## Drivers
1. `$missing_data_discount` (shared). 2. `@next_dollar.refugees_international` 36% (sourced). 3. `$uov_per_daly` (shared). 4. `hai_counterfactual_adj` 10% (reference class now named). 5. `hai_years_in_us`, then `hai_attribution_share`, `@aid_value.humanitarian_vs_cash` (shared), `other_wins_ratio`, `sdn_counterfactual_adj`, `sdn_attribution_share`.
All four round-2 mediums and the nine lows are fixed or accepted; no new high or medium. What would most improve the model is a sourced Adre share of Sudan's 2024 aid and a saved copy of the UNHCR report.

Verdict: pass (0 high; 0 medium; 2 low).
Model-sha: 635f8acd30b99063fcae4fa933646967a14f048983eec1d138e28738dc02366d
