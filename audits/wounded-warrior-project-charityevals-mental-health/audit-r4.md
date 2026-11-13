# Audit: wounded-warrior-project-charityevals-mental-health, round 4 (verification)

Result: 2.637e-5 wellby/$ = 0.001722 years of healthy life per 1,000 dollars (combined range 3.9e-4 - 0.0077); cause median 0.338 (x0.0051). Verdict: **pass** (no high findings).
Model-sha: 6afd92b4637b8792be2499d0272303b9b7e02e8f160e0e313e0b0718b9d00a02
Scope: unchanged; only the changes after round 3 were checked.

Mechanical: audit-model 1 medium (outlier against the 10 WELLBY peers, explained in the summary, as in round 3) and 1 low (far-below, the summary gives the reason); no high. normalization-audit: no violation for this model (the one INV-4 violation is habitat-for-humanity-charityevals-awareness); `git checkout -- generated` run afterwards.

Changes checked (all compute and read right):
1. `iop_evidence_adj`, `opt_evidence_adj` 0.64 (0.45-0.9): both compute; `iop_total_adj` 0.2796 = 0.64 x 0.7 x 0.7073 x wait discount x 0.9. The precision arithmetic has a small gap (finding 1).
2. `opt_dose_vs_iop`: now says outpatient content is not reported and the branch stays thin. The citation is right: Psychiatric Services 70(8):703-713 (checked in the PMC record: pages 703-713, 26 studies, weighted initiation 28% in outpatient mental health settings). See finding 2.
3. `opt_family_dose_vs_iop` 0.3 (0.1-0.6) added; `opt_people` = `opt_veterans` (2,623); `opt_wellbys_unadjusted` = (2,623 x 2.039 + 565 x 3.398 x 0.3 + cns_people x 1.529) x household multiplier; `cost_per_person` 140.3M / 12,841 = $10,930, matches "about $11,000". See finding 3.
4. `implementation_adj` is out of `sup_total_adj` (0.1942 = 0.8 x 0.7 x 0.7073 x wait x 0.5); the explainer says "Used for the intensive programmes only" and matches the formulas (`iop_total_adj` has it, `opt_total_adj` does not).
5. `effect_duration_years` explainer: 1/(1-0.76) = 4.2 and 1/(1-0.78) = 4.5, both right.
6. `attribution_share_shared` = 0.8 x 140.3 / (140.3 + 0.8 x 23.0) = 0.7073; the formula is the share of all cash and PSAs (cost_total / wwp_share + PSA), so it is consistent with the explainer.

Result moved from 0.00200 to 0.00172 (-14%): trust 0.75 to 0.64 (-15%), the family dose (about -2%), the lower attribution (0.8168 to 0.7073 in the intensive share, -13%), partly offset by `implementation_adj` leaving the support branch (+5%, small branch). Direction and size are as the changes imply.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | explainer arithmetic | `iop_evidence_adj` | The chain "0.70 of the pooled figure, then about 0.85 off its share: 0.64" does not multiply: 0.70 x 0.85 = 0.60, and 0.64 / 0.70 = 0.91. Foa's own standard error is not stated, so the 0.70 cannot be rebuilt from the text. | Explainer. | Give Foa's SE (or n) beside the 0.58 and write the second step as the factor that gives 0.64 (about 0.9), or set 0.60 and say so. | at most -6% if 0.60 |
| 2 | low | source | `opt_dose_vs_iop` | The explainer says 28% began trauma-centred CBT in "general outpatient mental health settings", "more where staff use it routinely, as in specialist clinics". In the paper the 28% (weighted mean 27.9%, range 6-82%) is the specialty anxiety/PTSD/CBT clinic studies, against 5.8% in hospital and community studies. The 28% is therefore already the specialist-clinic figure, not a floor for it. | PMC6702958, results. | Reword: "28% in studies of specialty PTSD and CBT clinics (6% in hospital and community settings); the centres are such clinics, but their patients are referred for any need". The 0.6 (0.35-0.9) can stay as a judgment; if anything the anchor points to the lower half. | none (wording); 0.35 would give about -10% |
| 3 | low | double count / source | `opt_family_dose_vs_iop`, `opt_wellbys_unadjusted` | (a) The 0.2-0.4 SD for carers' psychoeducation has no citation. (b) The family branch's WELLBYs are multiplied by `household_multiplier` (1.227), but family members are the household the multiplier counts: the veterans' spillover to them and their own treatment effect overlap. | Formula wraps all three terms in `household_multiplier`. | (a) Cite one review of carer psychoeducation with its effect size, or write "judgment". (b) Apply the multiplier to the veteran and counselling terms only; effect is under 2%. | about +1% |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `opt_dose_vs_iop` | https://pmc.ncbi.nlm.nih.gov/articles/PMC6702958/ | verified (via the PMC XML) | 26 studies; 70(8):703-713; 28% weighted initiation in outpatient mental health settings; the specialty-clinic nuance is finding 2 |
| `effect_duration_years` | https://pmc.ncbi.nlm.nih.gov/articles/PMC11110869/ | not re-fetched | verified in earlier rounds; only the arithmetic of the explainer was re-checked |

## Write-up
writeups/wounded-warrior-project-charityevals.md matches the model: headline 0.002, trust 0.64, therapy 0.6 / family 0.3 / counselling 0.45, completion 0.9 for the intensive programmes only, "no completion step" for the other branches, the announcements set against all the cash. The intensive and therapy branches are about 96% of the WELLBYs (1,500 + 1,891 of 3,515), matching "about 95%".

## Drivers
`daly_per_wellby` (judgment), `effect_duration_years` (estimate), `missing_data_discount` (judgment), `prior_effect_sd_ptsd` (estimate), `wwp_share_of_cash` (judgment). Nothing blocks the model; findings 1-3 are wording and small adjustments.
