# Audit: wounded-warrior-project-charityevals-mental-health, round 2

Result: 1.82e-5 wellby/$ = 0.00119 years of healthy life per $1,000 (combined range 2.7e-4 – 0.0052); cause median 0.338 (×0.0035). Verdict: **fix needed**.
Model-sha: 43e560c18e789f1dcb6858a012cac264b975eafa52c99950ad896ca975d9ee4c

Scope: unchanged from round 1. The model covers WWP's whole mental health line for fiscal 2025: 990 Schedule O line 4a, $98,748,548, with overhead ×1.421, so cost_total is $140.3M. The other six lines are in the sister model, and charities/wounded-warrior-project.json `spending` and `lines` match the 990. Branches after adjustment:

| Branch | WELLBYs | Share |
|---|---|---|
| Intensive programmes | 1,105 | 43% |
| Therapy: centres' outpatients and family (3,188) plus WWP-paid counselling (3,692 people from 22,149 sessions) | 1,180 | 46% |
| Support | 109 | 4% |
| Suicides | 95 | 4% |
| Sized remainder | 2.5% | |

Mechanical:
- Lint: 0 high, 0 medium. 2 low: `prior_effect_se` and `rct_effect_se` have no range. They are arithmetic from the CIs, which is acceptable.
- audit-model: 1 medium (outlier against the 10 WELLBY peers, explained in the summary, as in round 1) and 1 low (far below the median, with the summary's reason).
- check.ts: valid.
- normalization-audit: no violation for this model. The INV-14 group is gone. The only INV-4 violation is in another model.
- simulation-check: stable (5% 0.38×, 95% 2.6× the best guess).
- `generated/` was restored after the scripts ran.

Previous round:
1. **Resolved.** `sup_deaths_per_person` and `cns_deaths_per_person` are in `uov_valued_outside_wellbys`, the funging item is gone and the remainder is sized (0.025, two items). Both new deaths rows are tagged `side_effect` (finding 3), and the support deaths include family members (finding 7).
2. **Resolved.** The 4.2 years and the quote are right. The explainer's arithmetic has a slip (finding 8).
3. **Resolved.** The `cns_` split, reach from sessions, and their own dose rows are in. Follow-ups: the sessions range dips below its own floor (finding 6), and the counselling dose anchor misreads Kitchiner (finding 5).
4. **Resolved.** WWP's share is 0.85 × 98.75 / (98.75 + 23.00) = 0.689.
5. **Resolved as asked, but my round-1 fix was wrong.** Foa 2018 is already one of the 10 studies in Kitchiner's pooled 1.22, so blending it in counts it twice (finding 2).
6. **Resolved.** The waitlist part is out of `iop_evidence_adj`. But its remaining "mapping onto life satisfaction" part is an own conversion (finding 1).
7. **Mostly resolved.** The outpatient dose is anchored on VA completion, but the anchor isn't cited (finding 4). The attribution explainer names the other funders without figures (finding 9).
8. **Explained.** The mechanical outlier stays and the summary's reason is current. One figure is slightly off (finding 8).
9. **Resolved** for the outpatients and the counselled. The support branch still counts family members (finding 7).
10. **Resolved.** Now a judgment citing the VA's release. "6,407 suicides among Veterans in 2022" and 46.2 per 100,000 for the 2021 separations are verified.
11. **Resolved.** The quote is verbatim.
12. **Resolved.** `interval: 0.95` is on both CI rows.
13. **Resolved.**

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | high | normalization | `iop_evidence_adj`, `opt_evidence_adj` | The model applies its own conversion on top of the shared one. Of the 0.7 evidence factor, 0.8 is "mapping a PTSD-and-depression effect onto life satisfaction … part of a symptom change doesn't reach life satisfaction". Converting depression-scale SDs into WELLBYs is `@wellby_factors.wellbys_per_sd_year`'s job. Its explainer says it "converts an effect measured in SDs of a depression or wellbeing scale into WELLBYs", and its range "hides the debate over whether depression scales and life satisfaction move one for one". `depression_vs_ptsd_effect` already moves the PTSD effect onto the depression scale. The 0.8 also discounts the suicides averted, through `iop_total_adj` and `opt_total_adj`, although no life-satisfaction mapping applies to a death. | Explainer of `iop_evidence_adj`; `opt_evidence_adj` reads "as the intensive programmes (0.7)"; facts/wellby_factors.json. No other wellbeing model on the site applies such a factor. | Drop the mapping part. `iop_evidence_adj` = the trust part only, 0.85 (0.5–1). `opt_evidence_adj` the same, 0.85 (0.45–1). Restate the "implied multiple after all adjustments" sentence. If the builder thinks the shared rate is too high for injured veterans, that belongs in the shared fact's range, not in this model. | +20% (0.00119 → 0.00143) |
| 2 | medium | double-counting | `rct_effect_sd`, `rct_weight`, `prior_effect_sd_ptsd` | Foa et al. 2018 is counted twice. Kitchiner 2019's pooled CBT-TF vs waitlist/usual care estimate (10 studies, n = 524, SMD 1.22) already includes Foa 2018, probably its largest study (370 randomised). The blend then adds Foa again at 59% weight as if it were independent. The template's blend is for a trial outside the pooled literature (the charity's own). The summary and write-up call it "the one controlled trial of the two-week format" blended with the review. I recommended this blend in round 1 without checking the review's included studies. | Kitchiner 2019 (PMC6853217), Table 2 and section 2.7: the comparison's 10 studies are "Foa (2018), Forbes (2012), Gamito (2010), Gray (2017), Keane (1989), McLay (2011), Monson (2006), Peniston (1991), Reger (2016), Tylee (2017)". Its search ran to 31 May 2018. | Make `prior_effect_sd_ptsd` and `prior_effect_se` the leave-one-out pool of the other nine CBT-TF studies, re-pooled by random effects from Kitchiner's Figure 2 forest plot. Keep the blend with Foa, and say in the explainers that Foa is taken out of the prior. If the forest plot can't be read, drop the blend and set `initial_effect_sd = prior_effect_sd_ptsd * depression_vs_ptsd_effect`, with Foa's smaller effect (0.58 against 1.22) as the anchor of the small-trial part of `iop_evidence_adj`. | Leave-one-out (approximated from the random-effects weights: Foa about 12%, prior about 1.31, SE 0.31): +1%. Prior alone with the trust part unchanged: +41% |
| 3 | medium | normalization | `cns_deaths_per_person`, `sup_deaths_per_person` | Two main-chain rows are tagged `side_effect: "added"`, so `$side_effect_weight` scales them. Suicides averted are the template's main chain (its `deaths_averted_per_person` carries no tag). The intensive and outpatient deaths rows aren't tagged. At 0% side effects, the counselling and support suicides vanish while the other branches' suicides stay. normalization.md 2.16 marks spillovers and unmodelled shares, never the programme's own outcome. | Rows' `side_effect` fields; 2.16 "What is marked". | Remove `side_effect` from both rows. Keep it on `household_multiplier` and `unmodelled_benefits_adj`. | none at default; −0.8% wrongly at 0% side effects |
| 4 | low | source | `opt_dose_vs_iop` | The anchor is named but not cited. The explainer says "in VA care fewer than a third of those who start CPT or PE complete eight sessions" with no source. It also compares with the intensive programmes' 90% completion, while `implementation_adj` (0.9) is applied to this branch again, so the dropout gap is partly discounted twice. The same holds for counselling, whose reach is already built from sessions delivered. | Explainers of `opt_dose_vs_iop` and `implementation_adj` ("Used for every branch"). | Cite the national VA figure (Psychiatric Services 2019, doi 10.1176/appi.ps.201800361: 5,142 of 16,559 veterans starting CPT or PE in fiscal 2015, 31.1%, completed eight or more sessions; check the passage). In `opt_total_adj` drop `implementation_adj`, since the dose ratio is against completers-weighted intensive care and counselling reach counts sessions delivered. Or keep it and restate the dose ratio against the intensive programmes before completion. | +5% (implementation dropped from the therapy branch) |
| 5 | low | source | `cns_dose_vs_iop` | The anchor misreads Kitchiner. The explainer says non-trauma-focused therapies give "roughly half the effect of trauma-focused CBT against waitlist (Kitchiner et al. 2019 compare them directly)". Kitchiner has no PCT-vs-waitlist comparison. Its direct CBT-TF vs present-centred therapy comparison is SMD 0.50 at post-treatment (4 studies, n = 612) and 0.23 under six months (2 studies, n = 370). That puts PCT at about (1.22 − 0.50) / 1.22 = 0.59 to 0.8 of CBT-TF. Foa 2018 found PCT about equal to spaced PE ("difference in decrease vs spaced therapy, 0.10 [95% CI, -2.48 to 2.27]"). "Half of 0.6" also carries the outpatients' VA-dropout discount over to counselling, whose dose (about six sessions) is already the observed one. | Kitchiner 2019 Table 2; Foa 2018 abstract. | Anchor on Kitchiner's direct comparison: about 0.6 for a non-trauma-focused course, times a shorter-course factor of about 0.75 (6 sessions against the trials' 8–12). That gives 0.45 (0.25–0.7). Quote Table 2's −0.50 (−0.91, −0.08). | +6% at 0.45 |
| 6 | low | sensitivity | `cns_sessions_per_person` | The range's low end, 4, is below the row's own floor. The explainer says 22,149 sessions over the 4,204 served "would be 5.3 if everyone had some". At 4 sessions the counselled (5,537) outnumber everyone served (4,204). | Explainer; 990 Schedule O. | Set the range to 5.3 (= 22,149 / 4,204) to 10, best 6, and say so in the explainer. | none on the best guess; trims the simulated high tail |
| 7 | low | units | `sup_deaths_per_person` | Round 1's finding 9 counted deaths for veterans only in the outpatient and counselling branches, but the support branch still applies the PTSD veterans' excess risk to everyone: Project Odyssey, WWP Talk and case coordination serve family members too. | Formula has no veteran share; `cns_veteran_share` does the same job for counselling. | Multiply by a veteran share: reuse `cns_veteran_share` (registrants are 80% warriors), or add `sup_veteran_share` with the same anchor. | −0.04% |
| 8 | low | presentation | `effect_duration_years`, `summary` | Two small figures are off. The duration explainer says "1 / (1 - 0.77) = 4.2", but that is 4.35. 4.2 is the depression measure's own fit, 1 / (1 − 0.758) = 4.1–4.2, which is the right one for a model on the depression scale. The summary says each veteran costs "about $10,000". `cost_per_person` is $10,930, and its explainer says about $11,000. | Held 2024: 0.98/1.26 = 0.778, 0.69/0.91 = 0.758. | Duration: "On the depression scale the model uses, 76% is kept at a year (0.91 to 0.69), so a straight fade reaches zero at 1 / (1 − 0.76) ≈ 4.2 years". Summary: "about $11,000". | none |
| 9 | low | sensitivity | `wwp_share_of_cash` (7th driver) | The explainer names the centres' other funders but gives no figure. Home Base's own statement makes the 0.85 look high for at least one of the four centres. | Home Base (homebase.org, "Our Impact"): it "operates predominantly on the philanthropic generosity of the Red Sox Foundation, Massachusetts General Hospital and a grateful nation", and it announced $5M of federal funding for clinical programmes in 2023 (homebase.org/2023federalfunding). | Quote Home Base's statement and the 2023 federal funding in the explainer, and lower the range's low end to 0.4. Keep 0.85 only if WWP's grant covers most of the four centres' intensive-programme cost, and say so. | none on the best guess; widens the low tail |
| 10 | medium (mechanical) | plausibility | output | audit-model: more than 10× below the 10 WELLBY peers. The cause is unchanged: about $11,000 a person against tens of dollars, and US households of 2.4. The summary states it. | audit-model. | Keep the summary's reason current after the fixes above. | — |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| program_spend, people_reached, opt_veterans, opt_family, cns_sessions, sup_*, staff_pay, total_expenses | WWP Form 990 FY2025 | verified (round 1, quotes unchanged) | 22,149 sessions next to the 4,204 served by outreach and referrals. |
| psa_mental_health | audited statements p. 5, note 9 | verified (round 1) | 22,995,874 in the mental health column. |
| prior_effect_sd_ptsd, prior_effect_se | europepmc.org/article/MED/31762951 (PMC6853217) | verified number; **Foa 2018 is inside it** (finding 2) | SMD −1.22 (−1.78 to −0.66), 10 studies, n = 524. No prediction interval is published, so the pooled CI is acceptable as said. Considerable heterogeneity. |
| rct_effect_sd, rct_effect_se | Foa 2018, JAMA 319:354 (Europe PMC abstract; europepmc.org is 403 to fetches, read through the Europe PMC REST API) | verified | "difference in decrease, 3.70 [95% CI,0.72 to 6.68]; P = .02"; "mean baseline PSS-I score, 25.49 [6.36]". 3.70/6.36 = 0.58; SE (6.68 − 0.72)/3.92/6.36 = 0.239. |
| effect_duration_years | PMC11110869 | verified | Post-treatment d 1.26 / 0.91; 12 months 0.98 / 0.69 (finding 8 on the arithmetic). |
| depression_vs_ptsd_effect | PMC11110869 | verified | 0.69/0.98 = 0.70. |
| implementation_adj | PMC8364877 | verified | "Completion rates for the ITP are high (90.8%)". |
| veteran_suicide_rate | va.gov news release, December 2024 | verified | "there were 6,407 suicides among Veterans in 2022"; 46.2 per 100,000 for 2021 separations. The release gives no overall rate. The explainer's ≈35 is 6,407 ÷ about 18 million, a judgment, as filed. |
| cns_dose_vs_iop (explainer) | PMC6853217 Table 2 | misread (finding 5) | CBT-TF vs PCT −0.50 (−0.91, −0.08) post-treatment, −0.23 under six months. No PCT-vs-waitlist comparison. |
| opt_dose_vs_iop (explainer) | none cited | unsupported as written (finding 4) | VA figure found: 31.1% of FY2015 CPT/PE starters had 8+ sessions (Psychiatric Services 2019, appi.ps.201800361; search result, to confirm). |
| wwp_share_of_cash (explainer) | homebase.org | named funders verified | Home Base: "predominantly" the Red Sox Foundation's and MGH's philanthropy (finding 9). |

## Drivers
1. `$daly_per_wellby` (shared slider): 0.00092–0.0049.
2. `effect_duration_years` (estimate, Held 2024, verified): 0.00061–0.0021.
3. `$missing_data_discount` (shared): 0.00068–0.0018. The thin therapy and support branches are half the result.
4. `rct_effect_sd` (estimate, Foa 2018, verified): 0.00083–0.0015. It is counted twice through the prior (finding 2).
5. `depression_vs_ptsd_effect` (judgment, anchored on Held 2024): 0.00088–0.0015.

What would most improve the model:
- Drop the own life-satisfaction mapping (+20%).
- Take Foa 2018 out of the prior before blending (about +1% done leave-one-out).
- Re-anchor the counselling dose on Kitchiner's direct comparison (+6%).
- Stop discounting completion twice in the therapy branch (+5%).

Together these move the result to about 0.0016 years of healthy life per $1,000. That is still far below the cause's median, for the cost reason the summary gives.

Verdict: fix needed. Findings: 1 high, 3 medium (one mechanical and explained), 6 low.
Model-sha: 43e560c18e789f1dcb6858a012cac264b975eafa52c99950ad896ca975d9ee4c
