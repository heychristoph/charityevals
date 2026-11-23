# Audit: save-the-children-charityevals, round 6
Scoped verification (round 2+ rules: the changes only). Result: 0.219532 years of healthy life per $1,000 (was 0.219861). Verdict: pass.
Mechanical: preflight no high or medium; audit-model, normalization-audit no violations.

Checked:
- Typed rows now reading shared facts (sam_treatment_deaths_averted_share, livelihood_cost_per_household, livelihood_package_consumption_gain, livelihood_gain_years, learning_gain_sd_median_rct_lmic, years_primary_programme_to_work, crisis_share_5_14_of_over5, conflict_mental_disorder_prevalence): values identical to the old typed ones; no result change.
- pro_effect_sd 0.3 SD (0.1-0.5) to the shared 0.2 SD (0.05-0.4) for broad protection work: fits the model's protection line (community child-protection committees, safe spaces, case management for the few survivors, as the explainer says); only pro_wellbys reads it; the explainer is right. This is the whole result move (-0.00033).
- Rewritten explainers (emergency cost per person, deaths averted share, funging, delivery adjustment, health evidence, education cost and persistence, livelihoods, overhead): no remaining comparison with another charity, its model or a median; reference classes are now studies and published data (Pega et al. 2015, Richterman et al. 2023, OCHA FTS, GPE grants, Evans & Yuan 2022, Steinert et al. 2018).
No findings.

Verdict: pass.
Model-sha: 094e40620c1d5ad254e011d4010f8353a00e24bffe79887bd4c895c4be8fbc8d
Rules: 0.3.13

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 52be53be.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against d150f0b2.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
