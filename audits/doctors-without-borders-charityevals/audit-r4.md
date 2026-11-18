# Audit: doctors-without-borders-charityevals, round 4
Result: 0.001677 uov/$ = 0.839 years of healthy life per 1,000 dollars (combined range 0.315–2.231); the cause median was not re-read in this scoped round. Verdict: pass.
Verdict: pass
Model-sha: f54edeae811d2bbb6814707eface6978ac71d7f54cc3459a52569cb3423781bd
Rules: 0.2.0
Scope: verification round only: commits 36d2fd53 and 1f524029 (g4 cleanup): ln 2 row replaced by @givewell_shared.ln_consumption_per_doubling; cholera and other-admissions 5-14 shares read @death_ages.crisis_share_5_14_of_over5; WASH death rate and reduction read the @humanitarian_response facts; wash_years format; eight rewritten explainers. Programmes, year and the rest of the model were not re-audited.
Mechanical: audit-model: 0 findings, result 0.8386 (round 3: 0.8390, about -0.05%, the WASH facts); preflight passes, with two low "generated files out of date" lines (run npx tsx scripts/summaries.ts); other scripts not re-run.

## Changes checked
- ln 2: the fact has the same value (0.6931471806), a GiveWell moral-weights quote, and the formula is otherwise unchanged. Fine.
- 5-14 shares: the fact is 20% (10-40%), the model's old best; cholera's high end moves 0.3 to 0.4, the only change. The fact's meaning (share of deaths at five or older aged 5-14 in crises) is the same as both rows' labels. Fine.
- WASH: the death rate fact (0.0008, 0.0004-0.002; GBD SSA about 0.0005 raised for camps) means the same as the row it replaces (yearly diarrhoea death rate in the people served). The reduction fact (15%, 3-35%) is a different quantity from the old 45%: the old row was household WASH from trials, with emergency basicness left to the evidence and validity adjustments; the new fact is already the emergency-supply effect. The branch formula applies shared_adj (evidence_adj, attribution_share, implementation_adj, leverage_funging_adj, wait_discount), wash_counterfactual_adj and wash_missing_data_adj. Counterfactual (shared with UNICEF/UNHCR) and attribution are different questions from the fact's, so no double count there. Overlap: see finding 1.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | double-counting | wash_missing_data_adj | The explainer justifies the missing-data marker partly by "the effect is from household trials, not emergency supply". The 15% reduction fact is now the emergency-supply effect (its explainer: "emergency supply reaches many people with light services"), so that half of the reason is covered in the fact. The reach half (no count of people served) still stands. | Explainer text of wash_missing_data_adj against the fact's explainer; wash_deaths_averted multiplies both. | Edit the wash_missing_data_adj explainer to give only the reach as the reason (MSF publishes no count of the people served); keep the formula. | Negligible: the branch moves the headline about 0.05% in total |
| 2 | low | source | surgery_share_under5 | "30% of interventions were in preteens (Trudeau et al. 2015)" has no URL or quote; I could not check it. The Chu et al. numbers (6% under five, median age 24) are verified. | Row explainer | Add the Trudeau et al. 2015 DOI, or delete the clause. | None (the 8% best is not driven by it) |
| 3 | low | presentation | generated files | generated/distributions.json and usage.json are out of date. | Preflight | Run npx tsx scripts/summaries.ts. | None |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| vhf_share_under5, vhf_share_5_14_of_over5 | https://www.who.int/emergencies/disease-outbreak-news/item/2019-DON226 | verified | 182 under one and 293 aged 1-4 of 3,233 confirmed (475, 15%); under 18 898 (28%); case fatality 70% (under one) and 78% (1-4). Derived 5-17 share of cases over five: (898-475)/(3,233-475) = 15%. |
| vhf_share_under5 | https://www.msf.org/children-are-being-left-behind-ebola-disease-response | not checked | the Epicentre 24% against 13% claim; not in the top drivers |
| inpatient_share_under5, outpatient_share_under5 | https://paediatrics.msf.org/why-paediatrics | verified | 600,000 admitted and almost 6 million seen as outpatients (2022) |
| same | MSF International Activity Report 2022 | verified | 1,214,100 patients admitted and 16,272,300 outpatient consultations; 600,000/1,214,100 = 49%, 6m/16.27m = 37%, both as the explainers say. "Patients admitted" is read as admissions. |
| surgery_share_under5 | https://pmc.ncbi.nlm.nih.gov/articles/PMC2873460 | verified (via Europe PMC full text) | Median age 24 (IQR 18-31); 152 (6%) under five |
| wash_years | https://pmc.ncbi.nlm.nih.gov/articles/PMC9439956 | verified (via Europe PMC full text) | median epidemic duration 13 weeks (IQR 8-19); 13 weeks = 0.25 years, the row's low end |
| years_of_coverage | https://www.msf.org/international-activity-report-2023/2023-figures | verified | "50 per cent of expenditure comprises all costs related to locally hired and international staff" |
| ln_consumption_per_doubling | https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/moral-weights | not fetched | a mathematical constant (ln 2); the fact is not this model's own |

The rewritten explainers contain no comparison with other charities, models, medians or peers, and no mention of effective altruism (checked by reading all eight and grepping the model for the terms). Ranges match the rows (vhf 0.05/0.15/0.25; other admissions half, 30-65%; outpatient 60%, 40-80%; surgery 8%, 3-15%; wash_years 0.25/0.5/1; delay 0.05, 0-0.2).

## Drivers
Unchanged: missing_data_discount, daly_per_child_death, malaria_attributable_fraction, sam_in_risk_untreated, internal_validity_adj (all judgments). Nothing in these commits touches them.

Re-stamped (16 Nov 2026): Explainers only: wash_missing_data_adj gives the reach as its reason; an unchecked citation dropped from surgery_share_under5 (audit r4's low findings). Mechanical: headline unchanged, against 1f524029.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 768b765f.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.
