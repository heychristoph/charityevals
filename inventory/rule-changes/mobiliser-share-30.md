# Rule change mobiliser-share-30 (17 Nov 2026)

Credit rule 2.24, step 7: the mobiliser's share defaults to 30% (was 100%). Applied by `scripts/_mobiliser-share-30.py`; files changed: 1. 203 models moved. No model file changed, so every receipt stays current. Afterwards: typed results in the sensitivity sentences of 34 write-ups rescaled with their model (×0.3), and seven summaries' typed ranges replaced by placeholders (receipts re-stamped).

## For the owner: moves over 2×

196 of 203 models moved more than 2×; 7 moved less. Units are each model's headline (years of healthy life per $1,000 where it converts).

- **176 fall to exactly 30%** (÷3.33): the whole result is mobilised and the model's costs take the same share. 9 of them are net harm and shrink towards zero the same way: aspca-charityevals-farm-animals, carbon180-charityevals, coalition-for-rainforest-nations-charityevals, drug-policy-alliance-charityevals, evergreen-collaborative-charityevals, industrious-labs-charityevals, opportunity-green-charityevals, the-humane-league-charityevals-other-programmes, union-of-concerned-scientists-charityevals-climate.
- **1 changes sign**: project-drawdown-charityevals -0.001569 → 0.0005623.
- **11 fall by more than ÷3.33** (a chain: the share of a recipient's share, or a cost that stays whole):

| model | before | after | move |
|---|---|---|---|
| animal-charity-evaluators-charityevals | 0.001302 | 3.28e-05 | ÷39.7 |
| longview-philanthropy-charityevals | 3.68 | 0.2788 | ÷13.2 |
| rethink-priorities-charityevals-cross-cause | 0.08872 | 0.008805 | ÷10.1 |
| rethink-priorities-charityevals | 0.0001875 | 2.092e-05 | ÷8.96 |
| 80000-hours-charityevals | 2.982 | 0.336 | ÷8.88 |
| rethink-priorities-charityevals-global-health | 0.871 | 0.1067 | ÷8.16 |
| ambitious-impact-charityevals | 48.46 | 9.52 | ÷5.09 |
| effektiv-spenden-charityevals | 14.7 | 3.447 | ÷4.26 |
| the-life-you-can-save-charityevals | 10.3 | 2.638 | ÷3.9 |
| giving-what-we-can-charityevals | 38.67 | 10.23 | ÷3.78 |
| sentinel-bio-charityevals | 7.836 | 2.282 | ÷3.43 |

- **8 fall by ÷2 to ÷3.33** (part of the result is own delivery):

| model | before | after | move |
|---|---|---|---|
| sierra-club-foundation-charityevals-lands-health | 0.0008134 | 0.000246 | ÷3.31 |
| transparency-international-charityevals | 0.07698 | 0.0233 | ÷3.3 |
| the-nature-conservancy-charityevals | 0.0007542 | 0.0002291 | ÷3.29 |
| rewiring-america-charityevals | 0.01217 | 0.003708 | ÷3.28 |
| american-cancer-society-charityevals | 0.006807 | 0.002234 | ÷3.05 |
| cancer-research-uk-charityevals | 0.002232 | 0.0007393 | ÷3.02 |
| innocence-project-charityevals | 0.0004891 | 0.000187 | ÷2.62 |
| founders-pledge-charityevals | 9.608 | 3.771 | ÷2.55 |

## The top 25 (homepage order of charities)

8 charities leave the top 25, 8 enter; 11 of those that stay keep their figure.

| charity | rank at 100% | rank at 30% | figure at 100% | figure at 30% |
|---|---|---|---|---|
| ARMoR (Alliance for Reducing Microbial Resistance) | 1 | 1 | 461.8 | 138.5 |
| Ubongo | 2 | 2 | 51.9 | 51.9 |
| Helen Keller Intl | 6 | 3 | 40.99 | 40.99 |
| Jhpiego | 7 | 4 | 40 | 40 |
| Malaria Consortium | 8 | 5 | 38.95 | 38.95 |
| Suvita | 13 | 6 | 31.67 | 31.67 |
| Better Season Project | 14 | 7 | 30 | 30 |
| GiveWell | 10 | 8 | 35.73 | 28.19 |
| Family Empowerment Media | 17 | 9 | 26.07 | 26.07 |
| New Incentives | 18 | 10 | 25.69 | 25.69 |
| Educate Girls | 20 | 11 | 24.01 | 24.01 |
| Against Malaria Foundation | 23 | 12 | 22.7 | 22.7 |
| Sightsavers | 25 | 13 | 21.24 | 21.24 |
| UNFPA | 27 | 14 | 15.69 | 15.69 |
| Evidence Action | 24 | 15 | 21.64 | 13.92 |
| Arms Control Association | 4 | 16 | 41.34 | 12.4 |
| Teaching at the Right Level Africa | 5 | 17 | 41.23 | 12.37 |
| Lafiya Nigeria | 32 | 18 | 11.48 | 11.48 |
| Development Innovation Lab | 34 | 19 | 11.24 | 11.24 |
| London School of Hygiene & Tropical Medicine | 35 | 20 | 10.96 | 10.96 |
| Opal Health | 37 | 21 | 10.91 | 10.91 |
| IRD Global | 39 | 22 | 10.66 | 10.66 |
| First Embrace | 40 | 23 | 10.55 | 10.55 |
| Giving What We Can | 9 | 24 | 38.67 | 10.23 |
| Uduma | 43 | 25 | 10.23 | 10.23 |
| The Hospital for Sick Children (SickKids) | 11 | 26 | 33.9 | 10.17 |
| Council on Strategic Risks | 12 | 27 | 32.03 | 9.609 |
| Ambitious Impact | 3 | 29 | 48.46 | 9.52 |
| Ploughshares Fund | 15 | 35 | 28.13 | 8.44 |
| ALLFED (Alliance to Feed the Earth in Disasters) | 16 | 37 | 27.41 | 8.222 |
| Nuclear Threat Initiative | 19 | 41 | 24.94 | 7.483 |
| Lead Exposure Elimination Project | 21 | 46 | 22.8 | 6.841 |
| World Health Organization | 22 | 47 | 22.73 | 6.819 |

## Before and after

Largest move first.


| model | before | after | move | rows changed |
|---|---|---|---|---|
| project-drawdown-charityevals | -0.001569 | 0.0005623 | +1.4e+2% | value_destinations, moved_dollar_value, prior_dollar_value, mobiliser_share +19 |
| animal-charity-evaluators-charityevals | 0.001302 | 0.0000328 | −97% | value_destinations, moved_dollar_value, prior_dollar_value, mobiliser_share +10 |
| longview-philanthropy-charityevals | 3.68 | 0.2788 | −92% | value_destinations, moved_dollar_value, prior_dollar_value, mobiliser_share +11 |
| rethink-priorities-charityevals-cross-cause | 0.08872 | 0.008805 | −90% | value_destinations, moved_dollar_value, prior_dollar_value, mobiliser_share +10 |
| rethink-priorities-charityevals | 0.0001875 | 0.00002092 | −89% | value_destinations, moved_dollar_value, prior_dollar_value, mobiliser_share +10 |
| 80000-hours-charityevals | 2.982 | 0.336 | −89% | value_destinations, moved_dollar_value, prior_dollar_value, mobiliser_share +9 |
| rethink-priorities-charityevals-global-health | 0.871 | 0.1067 | −88% | value_destinations, moved_dollar_value, mobiliser_share, shifted_dollar_value +9 |
| ambitious-impact-charityevals | 48.46 | 9.52 | −80% | value_destinations, moved_dollar_value, prior_dollar_value, mobiliser_share +14 |
| effektiv-spenden-charityevals | 14.7 | 3.447 | −77% | value_destinations, moved_dollar_value, mobiliser_share, shifted_dollar_value +10 |
| the-life-you-can-save-charityevals | 10.3 | 2.638 | −74% | value_destinations, moved_dollar_value, mobiliser_share, moved_dollar_net_value +8 |
| giving-what-we-can-charityevals | 38.67 | 10.23 | −74% | value_destinations, moved_dollar_value, mobiliser_share, moved_dollar_net_value +8 |
| sentinel-bio-charityevals | 7.836 | 2.282 | −71% | climate_value_per_dollar, value_csr, value_epoch, live_grants_uov +20 |
| aspca-charityevals-farm-animals | -0.001355 | -0.0004065 | +70% | mobiliser_share, def_attribution_share, def_total_adj, def_outcome +16 |
| campaign-for-tobacco-free-kids-charityevals | 0.2111 | 0.06332 | −70% | mobiliser_share, us_attribution_share, us_total_adj, us_illness_credited +16 |
| carbon180-charityevals | -0.002959 | -0.0008878 | +70% | mobiliser_share, dac_attribution_share, tech_attribution_share, q45_attribution_share +19 |
| clean-air-task-force-charityevals | 0.003461 | 0.001038 | −70% | mobiliser_share, eumr_attribution_share, usmeth_attribution_share, pwr_attribution_share +21 |
| nuclear-threat-initiative-charityevals | 24.94 | 7.483 | −70% | mobiliser_share, attribution_share, total_adj, outcome_total +2 |
| one-for-the-world-charityevals | 6.503 | 1.951 | −70% | mobiliser_share, moved_dollar_net_value, moved_value, career_change_value +5 |
| the-humane-league-charityevals-owa-grants | 0.0002103 | 0.00006309 | −70% | mobiliser_share, owanew_attribution_share, owanew_total_adj, owaacc_attribution_share +52 |
| ciftlik-hayvanlarini-koruma-dernegi | 0.0009483 | 0.0002845 | −70% | mobiliser_share, sads_per_donor_dollar, sads_chicken, ced_chicken +1 |
| earthjustice-charityevals-health | 0.00397 | 0.001191 | −70% | mobiliser_share, pm_attribution_share, pfas_attribution_share, pm_total_adj +11 |
| electoral-reform-society-charityevals | 0.07988 | 0.02396 | −70% | mobiliser_share, pr_attribution_share, pr_total_adj, sv_attribution_share +25 |
| epoch-ai-charityevals | 0.117 | 0.0351 | −70% | mobiliser_share, ai_attribution_share, bio_attribution_share, nuclear_attribution_share +8 |
| evidence-action-maternal-syphilis-zambia-cameroon | 16.55 | 4.965 | −70% | mobiliser_share, uov_per_dollar |
| evidence-action-rough-beta | 4.175 | 1.252 | −70% | mobiliser_share, uov_per_dollar |
| habitat-for-humanity-charityevals-awareness | 0.007505 | 0.002252 | −70% | mobiliser_share, moved_dollar_net_value, career_change_value, us_attribution_share +8 |
| humane-society-of-the-united-states-ace-2016 | 0.05887 | 0.01766 | −70% | mobiliser_share, ced_per_donor_dollar |
| institute-for-ai-policy-and-strategy-charityevals | 7.114 | 2.134 | −70% | mobiliser_share, ai_attribution_share, bio_attribution_share, nuclear_attribution_share +8 |
| international-refugee-assistance-project-charityevals-advocacy | 0.2317 | 0.06952 | −70% | mobiliser_share, siv_attribution_share, usrap_attribution_share, pacito_attribution_share +13 |
| j-pal-vouchers-option-value-2024 | 14.41 | 4.322 | −70% | mobiliser_share, uov_per_dollar |
| jesuit-refugee-service-charityevals-advocacy | 0.01349 | 0.004048 | −70% | mobiliser_share, moved_dollar_net_value, attribution_share, total_adj +3 |
| johns-hopkins-university-ca-code-voi-threshold | 8.253 | 2.476 | −70% | mobiliser_share, uov_per_dollar |
| labri-aim | 8.537 | 2.561 | −70% | mobiliser_share, dalys_per_dollar |
| lead-exposure-elimination-project-charityevals | 22.8 | 6.841 | −70% | mobiliser_share, moved_dollar_net_value, career_change_value, attribution_share +4 |
| sinergia-animal | 0.02216 | 0.006649 | −70% | mobiliser_share, ced_per_donor_dollar |
| sinergia-animal-ace-2026 | 0.000517 | 0.0001551 | −70% | mobiliser_share, sads_per_donor_dollar, sads_chicken, ced_chicken +1 |
| vital-strategies-botec-breakeven | 8.378 | 2.513 | −70% | mobiliser_share, uov_per_dollar |
| wild-animal-initiative | 7.896e-7 | 2.369e-7 | −70% | mobiliser_share, ced_per_donor_dollar |
| 1day-sooner-charityevals | 5.464 | 1.639 | −70% | mobiliser_share, ai_attribution_share, bio_attribution_share, nuclear_attribution_share +10 |
| albert-schweitzer-foundation-ace-2016 | 0.01204 | 0.003613 | −70% | mobiliser_share, ced_per_donor_dollar |
| allfed-charityevals | 27.41 | 8.222 | −70% | mobiliser_share, ai_attribution_share, bio_attribution_share, nuclear_attribution_share +8 |
| alliance-for-reducing-microbial-resistance-aim | 461.8 | 138.5 | −70% | mobiliser_share, dalys_per_dollar |
| animal-policy-international-aim | 0.001631 | 0.0004893 | −70% | mobiliser_share, ced_per_donor_dollar |
| animal-welfare-observatory | 0.001212 | 0.0003637 | −70% | mobiliser_share, sads_per_donor_dollar, sads_chicken, ced_chicken +1 |
| aquatic-life-institute | 0.0001309 | 0.00003928 | −70% | mobiliser_share, sads_per_donor_dollar, sads_shrimp, ced_shrimp +1 |
| arms-control-association-charityevals | 41.34 | 12.4 | −70% | mobiliser_share, attribution_share, total_adj, outcome_total +2 |
| atlas-ai-atlasai-target-pop-optionality-voi | 10.91 | 3.273 | −70% | mobiliser_share, uov_per_dollar |
| better-futures-guide-aim | 12.58 | 3.775 | −70% | mobiliser_share, moved_dollar_net_value, moved_money_revaluation, uov_per_dollar |
| blueprint-biosecurity-charityevals | 5.892 | 1.767 | −70% | mobiliser_share, ai_attribution_share, bio_attribution_share, nuclear_attribution_share +8 |
| breast-cancer-now-sogive | 0.01261 | 0.003784 | −70% | mobiliser_share, dalys_per_dollar_cash, dalys_per_dollar |
| brennan-center-for-justice-charityevals | 0.07019 | 0.02106 | −70% | mobiliser_share, dem_attribution_share, dem_total_adj, tar_attribution_share +22 |
| british-heart-foundation-charityevals | 0.01123 | 0.003368 | −70% | mobiliser_share, research_attribution_share, adv_attribution_share, impl_attribution_share +19 |
| california-yimby-education-fund-charityevals | 0.2675 | 0.08024 | −70% | mobiliser_share, adu_attribution_share, oth_attribution_share, adu_total_adj +11 |
| campaign-legal-center-charityevals | 0.01444 | 0.004332 | −70% | mobiliser_share, dem_attribution_share, dem_total_adj, ref_attribution_share +12 |
| cearch-aim | 65.48 | 19.64 | −70% | mobiliser_share, uov_per_dollar |
| center-for-ai-safety-charityevals | 13.07 | 3.922 | −70% | mobiliser_share, ai_attribution_share, fb_attribution_share, attribution_share_shared +5 |
| center-for-global-development-charityevals | 4.283 | 1.285 | −70% | mobiliser_share, moved_dollar_net_value, career_change_value, a_attribution_share +13 |
| centre-for-long-term-resilience-charityevals | 6.482 | 1.945 | −70% | mobiliser_share, ai_attribution_share, bio_attribution_share, nuclear_attribution_share +9 |
| centre-for-pesticide-suicide-prevention-cpsp-skeleton | 19.72 | 5.916 | −70% | mobiliser_share, uov_per_dollar |
| cepi-charityevals | 0.5577 | 0.1673 | −70% | mobiliser_share, ai_attribution_share, bio_attribution_share, end_attribution_share +9 |
| ciftlik-hayvanlarini-koruma-dernegi-ace-2026 | 0.000821 | 0.0002463 | −70% | mobiliser_share, sads_per_donor_dollar, sads_chicken, ced_chicken +1 |
| clinton-health-access-initiative-chai-incubator-threshold | 6.368 | 1.91 | −70% | mobiliser_share, uov_per_dollar |
| clinton-health-access-initiative-chai-msupply-voi-2025 | 21.32 | 6.395 | −70% | mobiliser_share, uov_per_dollar |
| clinton-health-access-initiative-chai-ppm-2024 | 12.02 | 3.607 | −70% | mobiliser_share, uov_per_dollar |
| clinton-health-access-initiative-chai-tsus-april-2025 | 19.97 | 5.992 | −70% | mobiliser_share, uov_per_dollar |
| clinton-health-access-initiative-msupply-rct-april-2026 | 0.6383 | 0.1915 | −70% | mobiliser_share, uov_per_dollar |
| coalition-for-rainforest-nations-charityevals | -0.02525 | -0.007575 | +70% | mobiliser_share, rbf_attribution_share, rbf_total_adj, rbf_credit +17 |
| common-cause-education-fund-charityevals | 0.02256 | 0.006767 | −70% | mobiliser_share, bs_attribution_share, bs_total_adj, maps_attribution_share +16 |
| concentric-policies-aim | 4.762 | 1.428 | −70% | mobiliser_share, dalys_per_dollar |
| council-on-strategic-risks-charityevals | 32.03 | 9.609 | −70% | mobiliser_share, ai_attribution_share, bio_attribution_share, nuclear_attribution_share +9 |
| dansk-vegetarisk-forening | 0.000119 | 0.00003571 | −70% | mobiliser_share, ced_per_donor_dollar |
| development-innovation-lab-dil-bridge-funding-water-vouchers-value | 10.07 | 3.02 | −70% | mobiliser_share, uov_per_dollar |
| development-innovation-lab-water-vouchers-value-information | 9.575 | 2.873 | −70% | mobiliser_share, uov_per_dollar |
| dimagi-optionality-mother-baby-wellness | 10.17 | 3.05 | −70% | mobiliser_share, uov_per_dollar |
| doctors-without-borders-charityevals-advocacy | 0.06611 | 0.01983 | −70% | mobiliser_share, acc_attribution_share, acc_total_adj, aw_attribution_share +12 |
| drug-policy-alliance-charityevals | -0.004563 | -0.001369 | +70% | mobiliser_share, od_attribution_share, od_credit_adj, od_compliance_uov +22 |
| earthjustice-charityevals | 0.002282 | 0.0006846 | −70% | mobiliser_share, usmeth_attribution_share, pwr_attribution_share, coal_attribution_share +12 |
| earthjustice-charityevals-biodiversity | 0.000001144 | 3.431e-7 | −70% | mobiliser_share, attribution_share, total_adj, outcome_total +2 |
| economic-security-project-charityevals | 0.07328 | 0.02198 | −70% | mobiliser_share, moved_dollar_net_value, career_change_value, ctc_attribution_share +12 |
| environmental-defense-fund-charityevals | 0.001046 | 0.0003137 | −70% | mobiliser_share, eumr_attribution_share, usmeth_attribution_share, pwr_attribution_share +23 |
| environmental-defense-fund-charityevals-health-nature | 0.0007168 | 0.000215 | −70% | mobiliser_share, pm_attribution_share, lcri_attribution_share, fish_attribution_share +20 |
| evergreen-collaborative-charityevals | -0.00639 | -0.001917 | +70% | mobiliser_share, pwr_attribution_share, veh_attribution_share, ira_attribution_share +17 |
| evidence-action-2023-top-up-technical-assistance-to | 8.087 | 2.426 | −70% | mobiliser_share, uov_per_dollar |
| evidence-action-accelerator-renewal-november-2021 | 13.8 | 4.14 | −70% | mobiliser_share, uov_per_dollar |
| evidence-action-ifa-evac-beta-india | 9.772 | 2.931 | −70% | mobiliser_share, uov_per_dollar |
| evidence-action-ifa-in-bihar-uttar-pradesh-july-2024 | 12.18 | 3.653 | −70% | mobiliser_share, uov_per_dollar |
| evidence-action-ifa-supplementation-2022 | 9.613 | 2.884 | −70% | mobiliser_share, uov_per_dollar |
| evidence-action-in-line-chlorination-india-2023 | 30.59 | 9.177 | −70% | mobiliser_share, uov_per_dollar |
| evidence-action-india | 4.656 | 1.397 | −70% | mobiliser_share, uov_per_dollar |
| evidence-action-india-water-pilot-expansion-2023 | 7.79 | 2.337 | −70% | mobiliser_share, uov_per_dollar |
| evidence-action-iron-folic-acid-supplementation-india | 12.44 | 3.732 | −70% | mobiliser_share, uov_per_dollar |
| evidence-action-phase-2-ifa-model-with-updated-iron | 1.133 | 0.3399 | −70% | mobiliser_share, uov_per_dollar |
| evidence-action-syphilis-screen-treat-in-pregnant-women | 15.18 | 4.554 | −70% | mobiliser_share, uov_per_donor_dollar |
| evidence-action-syphilis-screening-treatment-in | 19.73 | 5.918 | −70% | mobiliser_share, uov_per_dollar |
| evidence-action-technical-assistance-to-liberia | 5.445 | 1.633 | −70% | mobiliser_share, uov_per_dollar |
| evidence-action-tlycs-iron-folic-acid-india | 14.37 | 4.312 | −70% | mobiliser_share, dalys_per_dollar |
| evidence-action-tlycs-syphilis-free-start-liberia | 5.689 | 1.707 | −70% | mobiliser_share, dalys_per_dollar |
| fair-tax-foundation-charityevals | 0.09674 | 0.02902 | −70% | mobiliser_share, moved_dollar_net_value, career_change_value, a_attribution_share +13 |
| fairvote-charityevals | 0.02264 | 0.006791 | −70% | mobiliser_share, rcv_attribution_share, pr_attribution_share, rcv_total_adj +10 |
| far-ai-charityevals | 1.596 | 0.4789 | −70% | mobiliser_share, attribution_share, total_adj, outcome_total +2 |
| federation-of-american-scientists-charityevals | 1.468 | 0.4405 | −70% | mobiliser_share, ai_attribution_share, bio_attribution_share, nuclear_attribution_share +9 |
| feeding-america-charityevals-advocacy | 0.08748 | 0.02624 | −70% | mobiliser_share, moved_dollar_net_value, career_change_value, attribution_share +7 |
| fika-bridges-to-prosperity-value-information | 6.586 | 1.976 | −70% | mobiliser_share, uov_per_dollar |
| fortify-health-value-incubation-grants-june-2019 | 7.257 | 2.177 | −70% | mobiliser_share, uov_per_dollar |
| fortify-health-value-information-december-2021 | 7.466 | 2.24 | −70% | mobiliser_share, uov_per_dollar |
| future-cleantech-architects-charityevals | 0.0008081 | 0.0002424 | −70% | mobiliser_share, rc_attribution_share, rc_uov_per_year, ren_attribution_share +10 |
| givedirectly-pilots-optionality-2025 | 9.672 | 2.902 | −70% | mobiliser_share, uov_per_dollar |
| global-alliance-for-improved-nutrition-givewell | 6.479 | 1.944 | −70% | mobiliser_share, uov_per_dollar_gross, uov_per_dollar |
| good-food-fund | 0.00005213 | 0.00001564 | −70% | mobiliser_share, people_per_donor_dollar, animals_spared_per_donor_dollar, sads_fish +6 |
| good-food-institute-charityevals | 0.001682 | 0.0005046 | −70% | mobiliser_share, attribution_share, total_adj, credit_factor +20 |
| govai-charityevals | 9.032 | 2.71 | −70% | mobiliser_share, attribution_share, total_adj, outcome_total +2 |
| greener-by-default | 0.00002655 | 0.000007965 | −70% | mobiliser_share, ced_per_donor_dollar |
| healthy-futures-phl-based-on-updated-23-feb-2026 | 2.502 | 0.7505 | −70% | mobiliser_share, dalys_per_dollar |
| hias-charityevals-advocacy | 0.3078 | 0.09235 | −70% | mobiliser_share, attribution_share, total_adj, outcome_total +2 |
| ibbis-charityevals | 8.9 | 2.67 | −70% | mobiliser_share, ai_attribution_share, bio_attribution_share, nuclear_attribution_share +8 |
| ican-charityevals | 8.645 | 2.594 | −70% | mobiliser_share, ai_attribution_share, bio_attribution_share, nuclear_attribution_share +8 |
| idinsight-model | 5.283 | 1.585 | −70% | mobiliser_share, uov_per_dollar |
| idinsight-value-model-new-incentives-endline-rct | 6.757 | 2.027 | −70% | mobiliser_share, uov_per_dollar |
| industrious-labs-charityevals | -0.001835 | -0.0005506 | +70% | mobiliser_share, s46_attribution_share, s53_attribution_share, iis_attribution_share +17 |
| innovations-for-poverty-action-ipa-m-e-msi-family-planning-outreach | 5.138 | 1.541 | −70% | mobiliser_share, uov_per_dollar |
| international-rescue-committee-voi-irc-mini-incubator-june-27-2024 | 7.496 | 2.249 | −70% | mobiliser_share, uov_per_dollar |
| iodine-global-network-charityevals | 3.172 | 0.9515 | −70% | mobiliser_share, moved_dollar_net_value, career_change_value, leb_attribution_share +36 |
| iodine-global-network-givewell | 6.479 | 1.944 | −70% | mobiliser_share, uov_per_dollar_gross, uov_per_dollar |
| ird-global-mcct-value-information-evaluation | 10.42 | 3.127 | −70% | mobiliser_share, uov_per_dollar |
| ird-global-zm-mccts-value-information | 17.78 | 5.334 | −70% | mobiliser_share, uov_per_dollar |
| johns-hopkins-center-for-health-security-charityevals | 10.68 | 3.205 | −70% | mobiliser_share, attribution_share, total_adj, outcome_total +2 |
| johns-hopkins-university-chobi7-bangladesh-voi | 6.684 | 2.005 | −70% | mobiliser_share, uov_per_dollar |
| kids-in-need-of-defense-charityevals-advocacy | 0.009337 | 0.002801 | −70% | mobiliser_share, jop_attribution_share, dc_attribution_share, jop_total_adj +10 |
| lead-exposure-elimination-project-leep | 31.09 | 9.326 | −70% | mobiliser_share, dalys_per_dollar |
| lead-exposure-elimination-project-leep-2024 | 159 | 47.69 | −70% | mobiliser_share, dalys_per_dollar |
| lead-research-for-action-aim | 10.94 | 3.283 | −70% | mobiliser_share, dalys_per_dollar |
| league-of-women-voters-education-fund-charityevals | 0.01118 | 0.003353 | −70% | mobiliser_share, bs_attribution_share, bs_total_adj, maps_attribution_share +21 |
| lshtm-earn-rct-voi-2024 | 9.419 | 2.826 | −70% | mobiliser_share, uov_per_dollar |
| machine-intelligence-research-institute-charityevals | 0.1221 | 0.03664 | −70% | mobiliser_share, attribution_share, total_adj, outcome_total +2 |
| malaria-consortium-tlycs-llins-south-sudan | 325 | 97.5 | −70% | mobiliser_share, dalys_per_dollar |
| mats-charityevals | 10.4 | 3.12 | −70% | mobiliser_share, ai_attribution_share, bio_attribution_share, nuclear_attribution_share +8 |
| medicines-development-for-global-health-moxidectin-mda-onchocerciasis-ro | 4.64 | 1.392 | −70% | mobiliser_share, uov_per_dollar |
| metr-charityevals | 0.1077 | 0.0323 | −70% | mobiliser_share, attribution_share, total_adj, outcome_total +2 |
| miraclefeet-monitoring-may-2023-voi-vet-complete | 6.309 | 1.893 | −70% | mobiliser_share, uov_per_dollar |
| motor-neurone-disease-association-sogive-upper-bound | 0.2638 | 0.07914 | −70% | mobiliser_share, dalys_per_dollar_cash, dalys_per_dollar |
| new-incentives-expected-cost-effectiveness-2017-rct | 1.012 | 0.3036 | −70% | mobiliser_share, uov_per_dollar |
| norwegian-refugee-council-charityevals-advocacy | 0.01642 | 0.004926 | −70% | mobiliser_share, fund_attribution_share, acc_attribution_share, acc_total_adj +8 |
| nutrition-international-rice-fortification-2024 | 8.81 | 2.643 | −70% | mobiliser_share, uov_per_dollar |
| one-acre-fund-updated-value-information-rwanda | 7.509 | 2.253 | −70% | mobiliser_share, uov_per_dollar |
| opportunity-green-charityevals | -0.4376 | -0.1313 | +70% | mobiliser_share, imo_attribution_share, ets_attribution_share, imo_total_adj +11 |
| pallium-india-hli | 1.113 | 0.334 | −70% | mobiliser_share, wellbys_per_dollar_discounted, wellbys_per_dollar |
| path-pmc-drc-pilot | 19.13 | 5.74 | −70% | mobiliser_share, uov_per_dollar |
| path-pmc-rtss-threshold-2023 | 9.012 | 2.704 | −70% | mobiliser_share, uov_per_dollar |
| path-rts-s-pilot-comparison-areas-based-on | 10.34 | 3.103 | −70% | mobiliser_share, uov_per_dollar |
| path-threshold-accelerator-malaria-vaccines | 7.706 | 2.312 | −70% | mobiliser_share, uov_per_dollar |
| prison-policy-initiative-charityevals | 0.05462 | 0.01639 | −70% | mobiliser_share, fed_attribution_share, st_attribution_share, dec_attribution_share +18 |
| protect-democracy-charityevals | 0.01797 | 0.005392 | −70% | mobiliser_share, bs_attribution_share, ref_attribution_share, bs_total_adj +10 |
| proveg-deutschland-ace-2016 | 0.0000827 | 0.00002481 | −70% | mobiliser_share, ced_per_donor_dollar |
| pure-earth-hli-ghana-cosmetics | 0.5679 | 0.1704 | −70% | mobiliser_share, wellby_per_dollar |
| pure-earth-hli-ghana-cosmetics-before-correction | 0.5667 | 0.17 | −70% | mobiliser_share, wellby_per_dollar |
| pure-earth-model | 26.19 | 7.858 | −70% | mobiliser_share, uov_per_dollar |
| redwood-research-charityevals | 0.1141 | 0.03423 | −70% | mobiliser_share, attribution_share, total_adj, outcome_total +2 |
| refugee-council-charityevals-advocacy | 0.002942 | 0.0008825 | −70% | mobiliser_share, mvo_attribution_share, ima_attribution_share, attribution_share +10 |
| refugees-international-charityevals | 0.1321 | 0.03963 | −70% | mobiliser_share, hai_attribution_share, hai_total_adj, sdn_attribution_share +12 |
| representus-education-fund-charityevals | 0.02563 | 0.007689 | −70% | mobiliser_share, bs_attribution_share, bs_total_adj, rcv_attribution_share +20 |
| save-the-children-charityevals-advocacy | 0.4459 | 0.1338 | −70% | mobiliser_share, tcl_attribution_share, tcl_total_adj, gavi_attribution_share +12 |
| securebio-charityevals | 7.734 | 2.32 | −70% | mobiliser_share, attribution_share, total_adj, outcome_total +2 |
| shrimp-welfare-project | 0.0009693 | 0.0002908 | −70% | mobiliser_share, sads_per_donor_dollar, sads_shrimp, ced_shrimp +1 |
| sickkids-f35-milk-trial-2026 | 33.9 | 10.17 | −70% | mobiliser_share, uov_per_donor_dollar |
| sierra-club-foundation-charityevals | 0.007133 | 0.00214 | −70% | mobiliser_share, coal_attribution_share, usmeth_attribution_share, pwr_attribution_share +18 |
| silverlining-charityevals | 0.1989 | 0.05968 | −70% | mobiliser_share, res_attribution_share, dir_attribution_share, pol_attribution_share +13 |
| sociedade-vegetariana-brasileira | 0.001047 | 0.0003142 | −70% | mobiliser_share, sads_per_donor_dollar, sads_fish, ced_fish +5 |
| st-jude-charityevals-research | 0.002251 | 0.0006754 | −70% | mobiliser_share, ca_attribution_share, ca_total_adj, ca_uov_credited +16 |
| tax-justice-network-charityevals | 2.797 | 0.839 | −70% | mobiliser_share, moved_dollar_net_value, career_change_value, a_attribution_share +10 |
| teaching-at-the-right-level-africa-tlycs | 41.23 | 12.37 | −70% | mobiliser_share, uov_per_dollar |
| terrapraxis-charityevals | 0.01493 | 0.00448 | −70% | mobiliser_share, rep_attribution_share, nuc_attribution_share, rep_total_adj +10 |
| the-bail-project-charityevals-advocacy | 0.003048 | 0.0009145 | −70% | mobiliser_share, tx_attribution_share, tx_total_adj, t25_attribution_share +21 |
| the-humane-league | 0.007847 | 0.002354 | −70% | mobiliser_share, ced_per_donor_dollar |
| the-humane-league-charityevals-corporate-campaigns | 0.0003535 | 0.000106 | −70% | mobiliser_share, attribution_share, total_adj, sads_2024 +9 |
| the-humane-league-charityevals-other-programmes | -0.0004289 | -0.0001287 | +70% | mobiliser_share, new_attribution_share, vol_attribution_share, def_attribution_share +44 |
| uduma-ilc-pilot-in-mali-option-value-february | 5.023 | 1.507 | −70% | mobiliser_share, uov_per_dollar |
| union-of-concerned-scientists-charityevals | 15.78 | 4.734 | −70% | mobiliser_share, ai_attribution_share, bio_attribution_share, nuclear_attribution_share +9 |
| union-of-concerned-scientists-charityevals-climate | -0.001514 | -0.0004543 | +70% | mobiliser_share, pwr_attribution_share, veh_attribution_share, ira_attribution_share +21 |
| union-of-concerned-scientists-charityevals-food | 0.0004532 | 0.000136 | −70% | mobiliser_share, attribution_share, total_adj, outcome_total +2 |
| vegan-outreach-ace-2016 | 0.0009919 | 0.0002976 | −70% | mobiliser_share, ced_per_donor_dollar |
| vital-strategies-model | 3.399 | 1.02 | −70% | mobiliser_share, uov_per_dollar |
| wehi-voi-walter-eliza-hall-iron-repletion | 18.52 | 5.555 | −70% | mobiliser_share, uov_per_dollar |
| world-food-programme-ta-iron-2-0-2025 | 8.622 | 2.587 | −70% | mobiliser_share, uov_per_dollar |
| world-health-organization-rough-who-gdg-march-2025 | 22.73 | 6.819 | −70% | mobiliser_share, uov_per_dollar |
| yale-research-initiative-on-innovation-and-scale-desalination-kiosks-in | 11.35 | 3.406 | −70% | mobiliser_share, uov_per_dollar |
| ploughshares-fund-charityevals | 28.13 | 8.44 | −70% | grl_uov, mobiliser_share, attribution_share, total_adj +4 |
| bulletin-of-the-atomic-scientists-charityevals | 16.22 | 4.866 | −70% | climate_value_per_dollar, climate_uov, uov_bridged, dalys_from_uov +17 |
| global-alliance-for-improved-nutrition-charityevals | 1.619 | 0.4863 | −70% | mobiliser_share, ff_attribution_share, wf_attribution_share, pol_attribution_share +16 |
| sierra-club-foundation-charityevals-lands-health | 0.0008134 | 0.000246 | −70% | mobiliser_share, pm_attribution_share, pm_total_adj, pm_credit +9 |
| transparency-international-charityevals | 0.07698 | 0.0233 | −70% | mobiliser_share, pol_attribution_share, pol_total_adj, enf_attribution_share +12 |
| the-nature-conservancy-charityevals | 0.0007542 | 0.0002291 | −70% | mobiliser_share, deal_attribution_share, deal_total_adj, deal_credit +57 |
| rewiring-america-charityevals | 0.01217 | 0.003708 | −70% | mobiliser_share, ira_attribution_share, ira_total_adj, attribution_share +9 |
| american-cancer-society-charityevals | 0.006807 | 0.002234 | −67% | mobiliser_share, research_attribution_share, adv_attribution_share, research_total_adj +16 |
| cancer-research-uk-charityevals | 0.002232 | 0.0007393 | −67% | mobiliser_share, research_attribution_share, adv_attribution_share, research_total_adj +15 |
| innocence-project-charityevals | 0.0004891 | 0.000187 | −62% | mobiliser_share, pol_attribution_share, pol_total_adj, attribution_share +10 |
| founders-pledge-charityevals | 9.608 | 3.771 | −61% | value_destinations, moved_dollar_value, prior_dollar_value, mobiliser_share +11 |
| givewell-charityevals | 35.73 | 28.19 | −21% | value_destinations, moved_dollar_value, mobiliser_share, moved_dollar_net_value +10 |
| central-square-foundation-charityevals | 0.8786 | 0.8334 | −5.1% | mobiliser_share, moved_dollar_net_value, career_change_value, gov_attribution_share +7 |
| rainforest-foundation-us-charityevals | 0.01253 | 0.01222 | −2.5% | mobiliser_share, glob_attribution_share, glob_total_adj, glob_credit +10 |
| wounded-warrior-project-charityevals | 0.006462 | 0.006407 | −0.85% | mobiliser_share, adv_attribution_share, adv_total_adj, adv_uov +8 |
| danish-refugee-council-charityevals | 0.06955 | 0.06954 | −0.015% | mobiliser_share, mmc_attribution_share, mmc_total_adj, mmc_uov_adj +8 |
| aspca-charityevals | 0.0001368 | 0.0001368 | −0.0083% | mobiliser_share, pol_attribution_share, pol_total_adj, pol_outcome +10 |
| dogs-trust-charityevals | 0.00005344 | 0.00005343 | −0.0076% | mobiliser_share, pol_attribution_share, pol_total_adj, pol_outcome +10 |
