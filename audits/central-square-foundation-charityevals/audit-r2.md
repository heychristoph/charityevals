# Audit: central-square-foundation-charityevals, round 2
Result: 0.001810 uov/$ = 0.905 years of healthy life per 1,000 dollars (combined range 0.057–14.3); cause median 0.0803 (×11.3). Verdict: pass (no high findings; 1 medium, 5 low).
Model-sha: 0d0d43201efeb09154f6add179e88dacebc2754a887ee03c5e88052732aade74
Scope: every programme, now as seven branches of one policy-research-meta model: FLN in 11 states, early childhood, adaptive learning in Andhra Pradesh (measured), adaptive learning in Himachal Pradesh (thin), other EdTech, school governance and high-potential students. The year is to 31 March 2026. Cost and spending are unchanged from round 1 and still match the audited accounts and `charities/central-square-foundation.json`: programme ₹93.78 crore ($10,762,797) of ₹107.18 crore total.
Mechanical: lint 0 high / 1 medium (far-above, judged below) / 0 low. Invariants: none violated. normalization-audit: 0 violations, none for this model. check.ts: all models valid. Simulation: stable (5% 0.24×, median 1.0×, 95% 3.71× the best guess). audit-receipt warnings: the range spans about 6,000,000×, and about 80% of the uncertainty is judgment and shared assumptions. The summary and write-up say this.

Previous round:
1. PAL thin where measured: **resolved**. `pal_missing_data_adj` is 1, citing the state's count and the DIL trial. `pal_gain_sd` is 0.3 (0.15–0.4) `estimate`, from the brochure p. 3; the trial size is now 14,000. Himachal is split into a thin `php_` branch. The summary and the write-up are updated.
2. `evidence_adj` double counting: **resolved**. It is 0.85 (0.65–1) and asks only about publication bias and the ASER-to-SD conversion. Reasons (a)–(d) are gone.
3. Accelerator stock counted as a flow: **resolved**. `edo_learners_2023_2025` ÷ `edo_accelerator_years` (3, 2–3) gives 10 lakh a year.
4. NIPUN allocation used as spending: **resolved** with `nipun_utilisation` (0.8, 0.55–1). One of its two anchors is misattributed: new finding 1.
5. Enrolment share: **resolved**. It is a per-grade formula on UDISE+ primary enrolment (verified) and a judged government share. A small base error is in finding 4.
6. LEEP in the career explainers: **resolved**.
7. LEEP comparison in `evidence_adj`: **resolved**.
8. One counterfactual for all branches: **resolved**. `gov_counterfactual_adj` and `hps_counterfactual_adj` are 0.95 (0.8–1).
9. Typed attribution shares: **resolved** for early childhood, PAL and other EdTech, each now built from CSF's spend share against the others' spending. Governance and high-potential students are still typed: finding 5.
10. Governance compliance costs: **resolved**. The line in `gov_downstream_value` places them in the resource share and in the teacher-time side effect.
11. `p_success` label: **resolved**.
12. Placeholders: **resolved**. The model reads `@education.earnings_gain_per_sd_adult_skills_lmic` × `@education.test_gain_persistence_to_adulthood`, the same way as care-, save-the-children- and teaching-at-the-right-level models (normalization.md 2.7).
13. ASER confounders: **resolved**.
14. Next-dollar note on NIPUN's end: **resolved**, but the year it gives doesn't match the source: finding 3.

Branch shares of the result at the defaults: FLN 51%, adaptive learning in Andhra Pradesh 25%, governance 13%, other EdTech 5%, early childhood 4%, Himachal 2%, high-potential students under 0.1%. The write-up's "about half ... a quarter ... an eighth" matches.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | source | `nipun_utilisation` | One of the two anchors is misattributed. The explainer says Samagra Shiksha "spent most of it (₹9,903 crore of ₹12,467 crore revised in 2024-25, same article)". In the article those are the mid-day meal scheme's (PM POSHAN) figures, not Samagra Shiksha's. | Careers360, 25 Mar 2026, under the mid-day meal scheme: "in 2024-25 the actual expenditure was Rs 9,903 crore against the allocation of Rs 12,467.39 crore". Samagra Shiksha's own figure there is "54.9% of the BE of Rs. 41,250 crore" (Feb 2026). | Replace the clause with Samagra Shiksha's own past utilisation: 2024-25 actuals against the revised estimate, from the Union Budget's Expenditure Profile or the Department of School Education's Demands for Grants 2026-27, cited with page. Reset the best guess to match. If that figure is not found, drop the clause and anchor only on the 54.9% (part-year) figure, saying the year's last weeks usually lift it. | about ±5% (0.8 → 0.9: FLN credit 3.08% → 2.78%, result −5%) |
| 2 | low | double-counting | `gov_units_affected_per_year`, `gov_gain_sd` | The gain is a one-off level effect, but it is counted once per student-year. The report-card anchor (Andrabi, Das and Khwaja 2017) is a one-time rise in test scores of about 0.11 SD that persisted. It is not a gain added each year. The model credits 0.04 SD to the same 1 lakh students in each of the won reform's years. A Jodhpur child in Grades 6-9 is credited up to four times, and an Angul child (Grades 5 and 8) twice. | Row explainers ("per student-year"); `gov_downstream_value` = students a year × value per student-year × `discounted_years`. | Either (a) count new children per year: `gov_new_students_per_year` = Jodhpur 70,000 ÷ 4 grades + Angul 30,000 ÷ 2 tested grades ≈ 32,500, plus the first year's 1 lakh as the stock, or (b) divide `gov_value_per_student_year` by a judged average number of years each child is counted (about 3, 2–4). Then label the gain "per child" and keep the anchor. | about −8% (governance branch × ~1/3) |
| 3 | low | source | `nipun_central_inr` explainer, `@next_dollar.central_square_foundation` note, write-up | Two versions of NIPUN's end date, and one of them isn't what the source says. The fact's note and the write-up say the mission "was due to end in 2026-27 unless extended". The explainer says "this financial year". The article, dated 25 March 2026 (six days before 2025-26 ends), says "set to be wound up this financial Year". | Careers360, 25 Mar 2026. | Use the article's own words in all three places: "the committee notes the mission is set to be wound up this financial year (2025-26), unless extended" (the annual report p. 30 reports its goal extended to Grade 5). Keep the use factor at 0.7. | none |
| 4 | low | source | `govt_share_primary` | The anchor mixes bases. The 12.16 crore government enrolment is Primary to Higher Secondary, but the 24.69 crore it is divided by includes pre-primary. On the same base, the total is 23.29 crore (52%, not 49%). The explainer also doesn't say whether government-aided schools (2.48 crore) are in or out, which has to match the states' counts. | UDISE+ 2024-25 summary pp. 1-2: total enrolment Pre-Primary to HS 246,932,680; Primary to HS 232,885,600; government schools (Primary to HS) 121,589,911; government aided 24,761,526. | Restate the anchor as 12.16 of 23.29 crore (52%) and say that aided schools are excluded, as in the states' "government schools" counts. Better: read the UDISE+ 2024-25 report's table of enrolment by management and level (government, primary) as an observed row. | small (share 0.55 → 0.57: FLN credit +1%) |
| 5 | low | structure | `gov_attribution_share`, `hps_attribution_share` | The attribution for governance (13% of the result) and high-potential students is still typed. Raising `gov_spend_share` or `hps_spend_share` lowers FLN's credit without raising their own, the same issue round 1 fixed for the other branches (one consistent way). | Row values 0.5 (judgment). | Build them like the others: `gov_attribution_share = total_expenses_inr * gov_spend_share / (total_expenses_inr * gov_spend_share + gov_district_inr)`, with `gov_district_inr` a judgment of the districts' staff and teacher time on the assessments and report cards (about ₹5 crore, ₹2–10 crore, so the share stays near 0.5–0.8). Do the same for high-potential students with Navodaya Vidyalaya Samiti's and the partners' costs. | small |
| 6 | low | presentation | write-up, Sources | The source list is stale. It lists Banerjee et al. 2007, which no row reads any more (persistence is the shared fact). It leaves out the PAL Works brochure, which sets the measured branch's gain (25% of the result), and the UDISE+ summary behind `india_primary_enrolment`. | Write-up "Sources"; row sources. | Drop Banerjee et al. 2007. Add "Central Square Foundation, PAL Works brochure, 28 January 2026" (res.cloudinary.com/.../PAL_Works_Brochure_28Jan2026.pdf) and the UDISE+ 2024-25 national summary (educationforallinindia.com/.../National_2020-21-and-2024-25.pdf). | none |
| 7 | low | missing-adjustment | `ece_state_inr`, `ece_units_affected_per_year` | Credit and benefit cover different children. The denominator is the states' spending on all supported pre-primary classes: UP's 70,000+ Balvatikas, Odisha's 45,000 Sishu Vatikas, Telangana's 1,362 schools. The benefit counts only the ~4 lakh children there "for the first time ever". CSF's academic package and training also reach the children who would have been in those classes anyway, and they are not counted. | AR pp. 34-37. | Either scale `ece_state_inr` by a judged share of the supported classes' children who are first-time (about 0.6, 0.4–0.9), or add the other children with a smaller quality gain (around 0.03 SD, judgment). | up to +3% |

## Far-above (audit-model, medium): judged right
The result is 11.3× the median of 122 global-health models, and the gap is right. That median is set mostly by direct-service, emergency and advocacy models (0.003–0.1), whose chains are not this one. The models that value learning or IQ gains through later earnings are on the same chain, and the result sits below them: teaching-at-the-right-level-africa-tlycs 17.2, lead-exposure-elimination-project-charityevals 15.2, iodine-global-network-charityevals 2.4. It is also below GiveDirectly at 3.96. The rows behind the level are checked:
- Reach is one grade-cohort a year of 2.6 crore government-school children (65 lakh), and 0.354 units of value per child (0.12 SD × 40% lasting × 20% per SD, discounted 12 years, over a 40-year working life with household sharing).
- That is cut by CSF's ~3.1% share of the resources (₹67.5 crore against ₹1,829 crore of NIPUN spending in its states plus ₹300 crore of other partners'), 0.85 × 0.85 and the missing-data step.
- Fully credited, the missions cost about $39 per child for 0.12 SD, which is plausible for state-run structured pedagogy.
Nothing here is a different programme, year or counting rule from the site's. Per the rule, none of this goes in site text.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `objects_inr`, `grants_inr`, `total_expenses_inr`, `staff_pay_inr` | accounts PDF | verified (round 1, values unchanged) | 87,69,65,107; 6,08,29,652; 1,07,17,90,037; 52,74,10,618. |
| `@fx.usd_per_inr_2025` | IRS yearly averages | verified (round 1) | 87.133. |
| `@next_dollar.central_square_foundation` | accounts PDF; AR p. 42; Careers360 | verified, except the year NIPUN ends (finding 3) | 0.6 × 0.7 × 1.0 = 0.42; retrieved 2026-11-15. |
| `pal_gain_sd` | PAL Works brochure p. 3 | verified | "Study Sample: 14,000 students across Grades 6–9"; RCT, DIL, maths, SwiftPAL; "In just 17 months ... (0.43 SD)"; PAL 0.74 SD, control 0.31 SD; AP "the only fully state-funded PAL programme". Low end: Rajasthan Mindspark 0.22 SD maths over 18 months (p. 4), verified. |
| `pal_students_ap`, `pal_students_hp` | AR pp. 40-41 | verified | 3.82 lakh in Grades 6-9; ~50,000. |
| `edo_learners_2023_2025` | AR p. 39 | verified | "Between 2023 and 2025 ... more than 30 lakh learners". |
| `india_primary_enrolment` | UDISE+ national summary p. 1 | verified | Enrolment in Primary 2024-25: 104,381,347. |
| `govt_share_primary` anchor | same, p. 2 | mismatch in base (finding 4) | Government 121,589,911 is Primary to HS; 24.69 crore includes pre-primary. |
| `nipun_central_inr` | Careers360, 25 Mar 2026 | verified, with caveat (round 1) | "increase budget allocation to Rs 6,000 crore from Rs 2,500 crore", in the NIPUN section. |
| `nipun_utilisation` anchors | same | 54.9% verified; ₹9,903 / ₹12,467 crore mismatch (finding 1) | The latter is PM POSHAN 2024-25. |
| `fln_enrolled_*` | AR pp. 15-30 | verified (round 1); grade bases re-read | Gujarat Grades I-V; Punjab Grades 1-3; others "schools with FLN grades" (e.g. MP 18.2 lakh in 78,444 schools), consistent with the judged 4 grades (3–5). |
| `ece_units_affected_per_year` | AR pp. 34-37 | verified | "~4 lakh students received access to pre-primary education for the first time ever"; Odisha ~3.2 lakh enrolled (finding 7). |
| `fln_gain_sd` anchor | ASER 2024 presentation, slide 11 | verified (round 1) | Confounders now named. |
| `@education.*` | shared facts | not re-checked | Shared figures; reading them isn't a finding. |

## Drivers
1. `$discount_rate` (shared slider): 2.59–0.38. The earnings start 7–14 years out.
2. `$missing_data_discount` (shared slider): 0.37–1.58. Every branch but Andhra Pradesh's PAL is thin.
3. `$uov_per_daly` (shared slider): 1.81–0.45.
4. `@next_dollar.central_square_foundation` (estimate, sourced): 0.43–1.62.
5. `@education.test_gain_persistence_to_adulthood` (shared judgment): 0.45–1.58.

The first input of the model's own is `fln_gain_sd` (judgment anchored on ASER: 0.60–1.40), then `counterfactual_adj` and `evidence_adj` (judgments, 0.67–1.07).

What would most improve the model:
- A causal estimate of the state FLN missions' gain, which would replace the main judgment of the model's own and could make FLN a measured branch. Examples: a difference-in-differences across states on ASER or PARAKH, or the missions' own external validations (such as Gujarat's Tangerine sample, AR p. 18) with a comparison group.
- NIPUN's actual central releases to CSF's states, from the Samagra Shiksha Project Approval Board minutes. These would replace both `nipun_central_inr` and `nipun_utilisation`.
