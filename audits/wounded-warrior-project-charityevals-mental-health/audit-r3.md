# Audit: wounded-warrior-project-charityevals-mental-health, round 3

Result: 3.06e-5 wellby/$ = 0.00200 years of healthy life per $1,000 (combined range 4.3e-4 – 0.0092); cause median 0.338 (×0.0059). Verdict: **pass**.
Model-sha: d4f2eb167e5dd3fa2bd2f6d8c08979ae083621237a79c144a607fbff6e875e24

Scope: unchanged. The model covers WWP's whole mental health line for fiscal 2025: 990 Schedule O line 4a, $98,748,548, with overhead ×1.421, so cost_total is $140.3M. The other six lines are in the sister model. charities/wounded-warrior-project.json `spending` (274,648,975) and `lines` (98,748,548 + 175,900,427) match the 990. Branches after adjustment, at the defaults:

| Branch | WELLBYs | Share |
|---|---|---|
| Intensive programmes (1,286) | 1,708 | 41% |
| Therapy: centres' outpatients 2,623 and family 565 (1,210, of which family 214), WWP-paid counselling 3,692 (1,051) | 2,260 | 54% |
| Support (4,675) | 109 | 3% |
| Suicides | 109 | 3% |
| Sized remainder | +2.5% | |

The result moved from 0.00119 to 0.00200 (+68%). That is the expected sum of round 2's fixes: the mapping dropped, Foa no longer blended, the counselling dose re-anchored, and no completion discount on the therapy branch.

Mechanical:
- Lint: 0 high, 0 medium.
- audit-model: 1 medium (outlier against the 10 WELLBY peers, explained in the summary) and 1 low (far below the median, with the summary's reason).
- check.ts: all valid.
- normalization-audit: no violation for this model. The only violation is INV-4, in habitat-for-humanity-charityevals-awareness.
- simulation-check: stable (5% 0.33×, 95% 2.8× the best guess).
- `generated/` was restored after the scripts ran.

Previous round (round 2):
1. **Resolved.** The life-satisfaction mapping is gone. `iop_evidence_adj` and `opt_evidence_adj` are trust only, and the explainer says the conversion is the shared one's. The new best guess, 0.75, sits above its own anchors (finding 1).
2. **Resolved.** The rct rows are gone and `initial_effect_sd = prior_effect_sd_ptsd * depression_vs_ptsd_effect` (0.854). Foa 2018 is named inside the pool and as part of the evidence adjustment. This follows round 2's fallback.
3. **Resolved.** There is no `side_effect` tag on `cns_deaths_per_person` or `sup_deaths_per_person`. The tags remain only on `household_multiplier` and `unmodelled_benefits_adj`.
4. **Resolved.** `opt_total_adj` no longer has `implementation_adj`, and the dose explainer says it carries the whole delivery gap. The new anchor's quote is verified, but its citation is wrong (finding 4). The `implementation_adj` explainer still says "Used for every branch" (finding 5).
5. **Resolved.** `cns_dose_vs_iop` is 0.45 (0.25–0.7), anchored on Kitchiner's direct comparison with a shorter-course factor.
6. **Resolved.** `cns_sessions_per_person` is 6 (5.3–10), and the floor is explained.
7. **Resolved.** `sup_deaths_per_person` is multiplied by `cns_veteran_share`, and that row's explainer says so.
8. **Resolved, with one figure left.** The depression-scale arithmetic is right: 1/(1 − 0.76) = 4.2. The summary says about $11,000 (`cost_per_person` $10,930). The PTSD-scale parenthesis is still off (finding 5).
9. **Resolved.** `wwp_share_of_cash` is 0.8 (0.4–1), and the explainer quotes Home Base and its 2023 federal funding.
10. **Explained.** The outlier stays, and the summary's reason (about $11,000 a person; a WELLBY is a fifteenth of a healthy year) is current.

Also checked: `attribution_share_shared` now compares the PSAs with `cost_total`. The formula still compares them with WWP's cost rather than with all the cash behind the programmes (finding 3).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | sensitivity | `iop_evidence_adj`, `opt_evidence_adj` (9th and 10th drivers; together they scale 95% of the result) | The best guess is above what the explainer's own anchors give. The explainer has two reasons. (a) HLI's psychotherapy discounts are 0.5–0.7. (b) The one large trial of the format found about half the pooled effect: 0.58 against 1.22. Neither puts trust above 0.7, yet the explainer lifts it to 0.75 "with a large trial of the same format in hand", when that trial points down. The template's rule for a format-specific trial is to weight it by precision. Using round 2's leave-one-out approximation (the rest of the pool ≈ 1.31, SE 0.31; Foa 0.58, SE 0.239), Foa's precision weight is 0.63 and the blend is 0.85, which is 0.70 of the pool. Discounting only the pool's share for small trials and publication bias (0.85) gives 0.78, which is 0.64 of the pool. | Explainer of `iop_evidence_adj`; templates.md, wellbeing ("a trial unlike today's programme … moves the weight only as a ranged judgment anchored on the precision weight"); Foa 2018 and Kitchiner 2019 figures verified in rounds 1–2. | Set both rows to 0.64 (0.45–0.9). Write the arithmetic in `iop_evidence_adj`'s explainer: "Foa 2018's precision weight against the rest of the pool (≈1.31, SE 0.31, from Kitchiner's random-effects weights) is 0.63, so the format's best estimate is 0.85 SD, 0.70 of the pool; × 0.85 on the pool's share for small trials and publication bias gives 0.64." Keep `opt_evidence_adj` "as the intensive programmes". Foa found massed and spaced therapy equivalent, so its lower effect isn't specific to the massed format. Restate the summary's "about 0.85 SD" as the effect before adjustments (unchanged), and update the write-up's "(0.75 …)". | −14% (0.00200 → 0.00171) |
| 2 | medium | structure | `opt_dose_vs_iop`, `opt_missing_data_adj` | Two explainers contradict each other on whether the centres' outpatient therapy is measured or thin. The dose row says it "is the format the trials behind the prior used (8 to 12 weekly sessions of CPT or PE)". The missing-data row calls the branch thin because it is "therapy of unknown content and length". If the first is true, the centres' outpatients are a counted reach plus trials of the same intervention delivered the same way, so the sub-branch is measured and the slider over-applies (+28%). The 990 only says "traditional outpatient therapy", and the dose row's own anchor is that many outpatients never start the trauma-focused part. So the content is not reported, and thin is the right classification. | Both explainers; 990 Schedule O ("2,623 VETERANS IN TRADITIONAL OUTPATIENT THERAPY"); glossary "Measured / thin". | Rewrite `opt_dose_vs_iop`'s first sentence: "The centres' outpatient clinics offer CPT and PE among other care (medication management, couples and other therapy); what each of the 2,623 got isn't reported, and outside trials many patients never start the trauma-focused part …". Keep `opt_missing_data_adj` at the slider. Its explainer then matches: "thin: the content and length of the centres' outpatient therapy and of the counselling aren't reported, so the effect is the trials' scaled by a judged dose". | none (+28% if it were classed measured) |
| 3 | low | units | `attribution_share_shared` | The PSAs are compared with WWP's cost only, not with all the cash behind the programmes. If `wwp_share_of_cash` s = C/(C+O), WWP's share of every resource is C/(C+O+P) = s·C/(C + s·P). The formula is s·C/(C+P), which counts the PSAs as if no one else's cash existed. | Formula; s = 0.8, C = 140.3M, P = 23.0M: 0.687 now, against 0.707. | Set the formula to `wwp_share_of_cash * cost_total / (cost_total + wwp_share_of_cash * psa_mental_health)`, and say in the explainer that the denominator is all cash (WWP's ÷ its share) plus the PSAs. Apply the same change to the sister model if it uses the same form. | +2.9% |
| 4 | low | source | `opt_dose_vs_iop` | The quote is verbatim, but the citation is wrong. The paper is Psychiatric Services 70(8):703–713, 2019, doi 10.1176/appi.ps.201800408, not "70:1031". The anchor also needs context: the 28% is for general outpatient mental health settings (range 4%–83%), and the review finds initiation higher where staff have "greater staff exposure to TC-CBT (OR=2.30)", as in the centres' specialist PTSD clinics. | Europe PMC record of PMC6702958: "The average weighted initiation rate was 6% in larger hospital systems with a high rate of trauma and 28% in outpatient mental health settings (range 4%-83%)." | Correct the citation in the explainer and the source's title. Add: "higher in specialist PTSD clinics (initiation rises with staff exposure to TC-CBT, OR 2.3), which is why 0.6 is above the general settings' figure". | none |
| 5 | low | presentation | `implementation_adj`, `effect_duration_years`, write-up | Three stale or slipped figures. (a) The `implementation_adj` explainer says "Used for every branch", but it is now the intensive and support branches only. (b) The duration explainer says "4.35 on the PTSD scale", but 0.98/1.26 = 0.778, and 1/(1 − 0.778) = 4.5. (c) The write-up says the outpatient therapy "gets 0.6 of that effect" after listing the intensive programmes' adjustments, completion included, but the therapy branch has its own counterfactual (0.6) and no completion step. It also says the intensive and therapy branches are "about 90%", against 95% now. | Rows' explainers; compute at the defaults. | (a) "Used for the intensive and support branches; the therapy branch's dose rows carry its delivery gap." (b) "(4.5 on the PTSD scale)". (c) "The centres' outpatient therapy gets 0.6 of the intensive programmes' effect and WWP-paid counselling 0.45, with their own counterfactual (0.6) and no completion step", and "about 95%". | none |
| 6 | low | double-counting | `sup_total_adj` | Round 2's completion fix wasn't carried to the support branch. `implementation_adj` (Rush's 90.8% intensive-programme completion) also discounts the support branch. Its effect is already set for the delivered dose: "five calls with a listener" is the observed 11,466 calls ÷ 2,254, and Project Odyssey counts those who attended. | `sup_effect_sd` explainer; 990 Schedule O. | Drop `implementation_adj` from `sup_total_adj`, and say in `sup_effect_sd` that the effect is for the average dose delivered. | +0.3% |
| 7 | low | units | `opt_family` via `opt_wellbys_per_person` | The 565 family members and caregivers get 0.6 of a PTSD-treated veteran's effect: 0.51 SD on depression measures. Then they get the household multiplier on top. The 990 calls what they got "treatment and psychoeducation", and caregiver psychoeducation gives much smaller effects on the carer's own depression than trauma-focused therapy gives the patient. | 990 Schedule O; `household_multiplier` explainer ("their own households' spillovers are small and left in"). | Add `opt_family_dose_vs_iop`, a ranged judgment of 0.3 (0.1–0.6) anchored on a meta-analysis of psychoeducation for caregivers of people with mental illness. Use it for the family term in `opt_wellbys_unadjusted`. | about −2.5% at 0.3 |
| 8 | medium (mechanical) | plausibility | output | audit-model: more than 10× below the 10 WELLBY peers. The cause is unchanged: $10,930 a person against tens of dollars, and US households of 2.4. The summary states it. | audit-model. | Keep the summary's reason current after finding 1. | — |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| program_spend, total_expenses, people_reached, opt_veterans, opt_family, cns_sessions, sup_*, staff_pay | WWP Form 990 FY2025 | verified (rounds 1–2; values and quotes unchanged) | |
| program_expenses | annual report p. 20 / 990 Part IX | verified (round 1) | 274,648,975. |
| psa_mental_health | audited statements p. 5, note 9 | verified (round 1) | 22,995,874. |
| prior_effect_sd_ptsd | Kitchiner 2019, PMC6853217 | verified (rounds 1–2) | SMD −1.22 (−1.78 to −0.66), 10 studies, n = 524. Foa 2018 is one of the ten, as the explainer now says. |
| effect_duration_years, depression_vs_ptsd_effect | Held 2024, PMC11110869 | verified (rounds 1–2) | 1.26 → 0.98 and 0.91 → 0.69 (finding 5b on the PTSD-scale figure). |
| opt_dose_vs_iop | van den Berk Clark 2019, PMC6702958 (read via the Europe PMC REST API; pmc.ncbi.nlm.nih.gov serves a captcha) | quote verified; citation mismatch | Psychiatric Services 70(8):703–713, 26 studies (finding 4). |
| cns_dose_vs_iop (explainer) | Kitchiner 2019 Table 2 | verified (round 2) | CBT-TF vs PCT −0.50 (−0.91, −0.08) post-treatment. |
| wwp_share_of_cash (explainer) | homebase.org | verified (round 2) | "operates predominantly on the philanthropic generosity of the Red Sox Foundation, Massachusetts General Hospital and a grateful nation". |
| implementation_adj | Held 2021, PMC8364877 | verified (round 2) | "Completion rates for the ITP are high (90.8%)". |
| veteran_suicide_rate | va.gov release, December 2024 | verified (round 2) | 6,407 veteran suicides in 2022. |
| share_deaths_15_49 | PMC12598382 | verified (round 1) | Mean age 45.1, SD 10.3. |

## Drivers
1. `$daly_per_wellby` (shared slider): 0.0015–0.0082.
2. `effect_duration_years` (estimate, Held 2024, verified): 0.0010–0.0036.
3. `$missing_data_discount` (shared): 0.0011–0.0032. The thin therapy and support branches are 57% of the result.
4. `prior_effect_sd_ptsd` (estimate, Kitchiner 2019, verified): 0.0011–0.0029.
5. `wwp_share_of_cash` (judgment, anchored on Home Base's funders): 0.0010–0.0025.

What would most improve the model:
- Set the evidence adjustments from the precision weight of the format's own trial (−14%).
- Make the dose explainer agree with the thin classification.
- Use the all-resources form of the PSA share (+3%).
- Fix the citation and the stale explainers.

The result would be about 0.0018 years of healthy life per $1,000. That is still far below the cause's median, for the cost reason the summary gives.

Verdict: pass. Findings: 0 high, 3 medium (one mechanical and explained), 5 low.
Model-sha: d4f2eb167e5dd3fa2bd2f6d8c08979ae083621237a79c144a607fbff6e875e24
