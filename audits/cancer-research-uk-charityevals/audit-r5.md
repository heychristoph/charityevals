# Audit: cancer-research-uk-charityevals, round 5 (verification)
Result: 1.649e-6 daly/$ = 0.001649 years of healthy life per 1,000 dollars (combined range 9.4e-5–0.0288); cause median 0.0667 (×0.025). Verdict: pass.
Model-sha: d7fab7c182b06ec750f9354984b9dc0c54b5db0adf79f0e05190164edac877bc
Scope: verification of commit 3e68437 only (policy branch re-pointed to facts/tobacco.json; credit split into campaigners' share × the charity's share; second-hand-smoke and vaping side-effect rows; unmodelled share 10% -> 7%). Research and information branches untouched. Before: 0.00165905; after: 0.001649 (-0.6%).
Mechanical: lint 0 high / 0 medium / 4 low (three unused context inputs, far-below note that the summary already explains), invariants none, normalization-audit none for this model (generated/ restored with git checkout). check.ts: all models valid, 0 expected values to reproduce. simulation-check: 5% 0.275, 50% 1, 95% 4.15 x best guess, stable.
Previous round: round 4 findings not re-examined (out of scope); nothing in this diff reopens them.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | double-counting | facts/tobacco.json uk_act_evidence_adj (read as adv_evidence_adj) | The fact's explainer now says switching to vaping is its own side effect (uk_act_vaping_substitution_share), but the value stays at 0.7, the figure that before the change covered vaping substitution plus repeal. Vaping is now taken off twice (here and in adv_vaping_substitution_harm, 3% of the branch). | Old model explainer: "this covers the rest: substitution by vaping ... and the chance of later repeal"; new fact keeps 0.7/0.4/1 unchanged. | Either keep 0.7 and say in the explainer that it is a repeal-and-modelling-risk figure that stays at the research branch's 0.7 (no vaping share left in it), or raise best to about 0.72. Not worth a model change on its own. | at most about +2% of the policy branch, under 1% of the result |
| 2 | low | presentation | adv_share_of_campaigners / normalization-waivers | Waiver for "adv_share_of_campaigners = @tobacco.uk_act_campaigners_share" is a checked false positive (0.25 is the fact's low end by coincidence; the row multiplies the fact). Acceptable. | waivers file | none | none |

Checked and fine:
- Re-pointed rows read the facts with the same meaning and values as before: adv_people_affected_per_year (11,777,381 / 17 x 1.19 = 824,000), prevalence cut (0.025/0.08/0.092), DALYs per young smoker (1.5/3/6), years until health (30/40/50), share of campaign in the year (0.1/0.2/0.4), years until effect (0.5/1/1.5), evidence adjustment (0.4/0.7/1). All values identical to the old model rows; the explainers were shortened to point at the fact.
- Credit: old attribution 0.05/0.10/0.20 (judgment); now 0.4 x 0.25 = 0.10 at best, so the point estimate is unchanged; range 0.0375-0.24 (campaigners' share 0.25/0.4/0.6 x charity's share 0.15/0.25/0.4), a little wider, defensible. BHG reads the same fact x 0.125 (0.05 at best), so the two charities together take 37.5% of the groups' share at best (0.7 even at both high ends), within the groups' share. The write-up's "a tenth in all, twice the British Heart Foundation's" is right.
- Side effects: adv_secondhand_smoke_share = 171,622 / 1,903,996 = 9.0% (tagged `added`); adv_vaping_substitution_harm = -0.30 x 0.10 = -3% (tagged `added`); adv_side_effects sums them and enters both credited rows as (1 + adv_side_effects), same pattern as the BHG model, so `$side_effect_weight` moves them. The units are shares of the branch's value; the formulas are dimensionally right. Second-hand smoke is applied to the YLD and death parts alike (stated in the explainer; slight undervaluation noted there).
- No double counting with unmodelled_benefits_adj: the row's explainer removes second-hand smoke and keeps only "the Act's limits on youth vaping" (a different channel from substitution). Its best fell 10% -> 7% (-3 points of the result); the new rows add about +9% x 38% (policy share) = +3.4 points and -3% x 38% = -1.1 points, net +2.3, so the total moves -0.7 points, matching the -0.6% result change. adv_evidence_adj no longer claims leakage/vaping beyond the note in finding 1.
- Write-up: "less second-hand smoke (9% more), less the harm of those who vape instead (3%)", "a tenth in all", unmodelled 7% (-8% to 27%), branch shares 56/38/6, and the removal of second-hand smoke from "what isn't modelled" all match the model. The rows' own sentence "about 3 points of it before" is consistent.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| smoking_dalys_gbr 1,903,996 (smoking DALYs, UK 2023) | https://ourworldindata.org/grapher/disease-burden-by-risk-factor?tab=table&time=2023&country=GBR~USA | verified | Fetched in the browser pane (table rendered): United Kingdom, Smoking column 1,903,996. |
| shs_dalys_gbr 171,622 | same | verified | United Kingdom, Secondhand smoke column 171,622. |
| shs_dalys_usa 990,985; smoking_dalys_usa 9,447,628 (read by other models) | same | verified | United States row. The ten-country figures were not in scope. |
| uk_act_england_14_30 11,777,381 (para. 120) | https://assets.publishing.service.gov.uk/media/65f9bd0a9316f5001164c351/tobacco-vapes-bill-impact-assessment.pdf | verified | "The population of those aged 14 to 30 is 11,777,381" (para. 120). |
| uk_act_uk_uplift 1.19 (para. 148) | same | verified | Text reads "uplifted by 1.19 ... to provide estimates for ... the UK" (footnote marker appended in extraction; the Annex gives 1.1925). In my text extraction the sentence sits under para. 121 (and again near para. 148 in the annex text); the figure matches, the paragraph number in the cite may be off by section (low). |
| uk_act_prevalence_cut high 9.2 points; para. 169 | same | verified | Para. 169: central scenario takes 14-30 prevalence to 0.0%, "9.2" points lower than baseline; Scenario 5 table shows 6.7% against 9.2%. |
| never_start_lag_years citing para. 178 | same | verified | Para. 178: "no health benefits would be expected until 2044". |
| uk_act_years_until_effect | same | verified | "come into effect from 1 January 2027". |
| uk_dalys_per_young_smoker (Doll 2004) | https://www.bmj.com/content/328/7455/1519 | not re-fetched | Unchanged judgment moved verbatim from the old model; out of scope this round. |

## Drivers
1. missing_data_discount (judgment, shared slider), 2. discount_rate (shared), 3. share_burden_averted_per_research_year (judgment), 4. @next_dollar.cancer_research_uk (estimate), 5. years_brought_forward (judgment). The policy branch is 38% of the result; its drivers are the shared tobacco figures (DALYs per young smoker, share of the campaign in the year), both judgments with ranges. Best improvement remains a sourced next-dollar figure and reference classes for the research branch's judgments (out of this round's scope).

Verdict: pass
