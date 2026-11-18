# Rule change later-benefits-discount (18 Nov 2026)

Benefits that come years later move with the discount rate: GiveWell's typed-in development effects, deworming and malaria income present values and development shares rescale to your rate (later_benefits in link-givewell-shared.py); TLYCS dispensers' income share rescales like the other readers; HLI's GiveDirectly splits recipient and household (a side effect) and is discounted over the years the effect lasts. Applied by `scripts/_later-benefits-discount.py`; files changed: 37. 38 models moved; 0 receipts re-stamped (headline within 1%), 0 to verify, 0 other models moved more than 2×.

Rules 0.3.3 → 0.3.4 (minor); 174 receipts moved to 0.3.4, the 0 to verify stay on theirs until verified.

## Verification list

None.

## Before and after

| model | before | after | move | rows changed | receipt |
|---|---|---|---|---|---|
| givedirectly-hli | 0.4472 | 0.3988 | −11% | wellbys_per_dollar, recipient_share_of_household, wellbys_recipient_per_1000, wellbys_household_spillover_per_1000 +4 | - |
| evidence-action-tlycs-dispensers-for-safe-water | 16.53 | 16.53 | +1.3e-9% | - | - |
| nutrition-international-vitamin-a-chad-march-2022 | 42.22 | 42.22 | −2.2e-14% | overall_units_of_value_from_development_effects_per_treatmen_at_shared_values | - |
| against-malaria-foundation-2023-amf-drc | 21.16 | 21.16 | unchanged | present_value_of_lifetime_benefits_from_reducing_prevalence_at_shared_values | - |
| alima-malnutrition-treatment-chad-2021-with | 5.766 | 5.766 | unchanged | units_of_value_per_child_treated_from_development_effects_pe_at_shared_values | - |
| alima-malnutrition-treatment-chad-2024-renewal | 3.405 | 3.405 | unchanged | units_of_value_per_child_treated_from_development_effects_pe_at_shared_values | - |
| alima-malnutrition-treatment-combined | 6.976 | 6.976 | unchanged | units_of_value_per_child_treated_from_development_effects_pe_at_shared_values, units_of_value_per_child_treated_from_development_effects_pe_2_at_shared_values | - |
| alima-mirriah-niger-operational | 7.508 | 7.508 | unchanged | estimated_percentage_of_total_benefits_of_treatment_that_com_at_shared_values | - |
| alima-primary-healthcare-malnutrition | 6.092 | 6.092 | unchanged | size_of_the_developmental_effect_as_a_proportion_of_the_mort_at_shared_values | - |
| ansh-kangaroo-care-2024 | 9.543 | 9.543 | unchanged | adjustment_for_developmental_effects_best_guess_at_shared_values | - |
| clear-solutions-ors-zinc | 4.541 | 4.541 | unchanged | units_of_value_from_development_effects_per_treatment_year_o_at_shared_values, units_of_value_from_development_effects_per_treatment_year_o_2_at_shared_values, units_of_value_from_development_effects_per_treatment_year_o_3_at_shared_values | - |
| clinton-health-access-initiative-chai-ors-zinc | 11.98 | 11.98 | unchanged | units_of_value_from_development_effects_per_treatment_year_o_at_shared_values, units_of_value_from_development_effects_per_treatment_year_o_2_at_shared_values, units_of_value_from_development_effects_per_treatment_year_o_3_at_shared_values | - |
| clinton-health-access-initiative-chai-ors-zinc-updated-costs-january-202 | 11.47 | 11.47 | unchanged | units_of_value_from_development_effects_per_treatment_year_o_at_shared_values, units_of_value_from_development_effects_per_treatment_year_o_2_at_shared_values, units_of_value_from_development_effects_per_treatment_year_o_3_at_shared_values | - |
| development-innovation-lab-vouchers-water-quality-february-2023 | 11.24 | 11.24 | unchanged | units_of_value_for_development_effects_per_treatment_year_fr_at_shared_values | - |
| dimagi-commcare-connect-2023 | 7.334 | 7.334 | unchanged | units_of_value_from_development_effects_per_treatment_year_o_3_at_shared_values, adjusted_long_term_benefits_per_year_of_deworming_per_person_at_shared_values | - |
| evidence-action-dispensers-safe-water-based-on-larger | 2.279 | 2.279 | unchanged | development_benefits_as_a_of_overall_benefits_for_vitamin_a_at_shared_values | - |
| evidence-action-in-line-chlorination-india-2023 | 9.177 | 9.177 | unchanged | units_of_value_generated_from_long_term_income_increases_per_2_at_shared_values | - |
| evidence-action-water-quality-ilc-dsw | 10.26 | 10.26 | unchanged | units_of_value_for_development_effects_per_treatment_year_fr_at_shared_values, units_of_value_for_development_effects_per_treatment_year_fr_2_at_shared_values, units_of_value_for_development_effects_per_treatment_year_fr_3_at_shared_values | - |
| evidence-action-water-quality-ilc-dsw-with-lower | 7.704 | 7.704 | unchanged | units_of_value_for_development_effects_per_treatment_year_fr_at_shared_values, units_of_value_for_development_effects_per_treatment_year_fr_2_at_shared_values, units_of_value_for_development_effects_per_treatment_year_fr_3_at_shared_values | - |
| evidence-action-water-quality-nov-2022 | 9.513 | 9.513 | unchanged | units_of_value_for_development_effects_per_treatment_year_fr_at_shared_values | - |
| givedirectly | 3.96 | 3.96 | unchanged | adj_development_at_shared_values | - |
| givedirectly-malawi | 5.724 | 5.724 | unchanged | adj_development_at_shared_values | - |
| helen-keller-intl-april-2023-madagascar | 17.6 | 17.6 | unchanged | units_of_value_from_development_effects_per_treatment_year_o_3_at_shared_values | - |
| international-rescue-committee-malnutrition-treatment-irc-standard | 5.557 | 5.557 | unchanged | units_of_value_per_child_treated_from_development_effects_pe_at_shared_values, units_of_value_per_child_treated_from_development_effects_pe_2_at_shared_values, units_of_value_per_child_treated_from_development_effects_pe_3_at_shared_values, units_of_value_per_child_treated_from_development_effects_pe_4_at_shared_values +1 | - |
| ird-global-2023-zm-mcct-in-sindh | 10.66 | 10.66 | unchanged | units_of_value_from_development_effects_per_counterfactually_2_at_shared_values | - |
| ird-global-breastfeeding-promotion-pilot-march-2024 | 9.339 | 9.339 | unchanged | units_of_value_from_development_effects_per_treatment_year_o_at_shared_values | - |
| ird-global-mcct-in-high-risk-sindh-districts-2021 | 6.762 | 6.762 | unchanged | units_of_value_from_development_effects_per_counterfactually_2_at_shared_values | - |
| malaria-consortium-smc-vas-co-delivery-by-october-2023 | 18.75 | 18.75 | unchanged | units_of_value_generated_from_long_term_income_increases_per_2_at_shared_values | - |
| malaria-consortium-vitamin-a-supplementation-vas | 8.432 | 8.432 | unchanged | developmental_benefits_long_term_income_increases_ref_at_shared_values | - |
| new-incentives-evidence-cost-effectiveness-writeup | 10.75 | 10.75 | unchanged | units_of_value_from_development_benefits_per_vaccinated_infa_at_shared_values | - |
| new-incentives-june-2019 | 4.948 | 4.948 | unchanged | developmental_benefits_are_what_percent_of_under_5_mortality_2_at_shared_values | - |
| new-incentives-june-2019-endline-updated-ni-early-2018 | 2.099 | 2.099 | unchanged | developmental_benefits_raise_benefits_by_what_percentage_les_at_shared_values, developmental_benefits_raise_benefits_by_what_percentage_che_at_shared_values, developmental_benefits_raise_benefits_by_what_percentage_inp_at_shared_values, developmental_benefits_raise_benefits_by_what_percentage_eli_at_shared_values +5 | - |
| new-incentives-june-2023 | 27.32 | 27.32 | unchanged | units_of_value_from_development_effects_per_treatment_year_o_at_shared_values, units_of_value_from_development_effects_per_treatment_year_o_2_at_shared_values, units_of_value_from_development_effects_per_treatment_year_o_3_at_shared_values | - |
| nutrition-international-2024-chad-renewal-vitamin-a | 8.792 | 8.792 | unchanged | adjustment_to_account_for_developmental_benefits_long_term_i_at_shared_values | - |
| nutrition-international-chad-may-2023 | 28.68 | 28.68 | unchanged | overall_units_of_value_from_development_effects_per_treatmen_at_shared_values, overall_units_of_value_from_development_effects_per_treatmen_2_at_shared_values, overall_units_of_value_from_development_effects_per_treatmen_3_at_shared_values | - |
| rice-institute-kmc-with-r-i-c-e-in-uttar-pradesh-2023 | 8.728 | 8.728 | unchanged | adjustment_for_developmental_effects_best_guess_of_r_i_c_e_s_at_shared_values | - |
| suvita-march-2023 | 31.67 | 31.67 | unchanged | units_of_value_from_development_effects_per_treatment_year_o_at_shared_values | - |
| university-college-london-pla-mnh-participatory-learning-action | 8.952 | 8.952 | unchanged | child_disability_averted_and_development_effects_at_shared_values | - |
