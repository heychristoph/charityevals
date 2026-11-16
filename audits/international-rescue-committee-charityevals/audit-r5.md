# Audit: international-rescue-committee-charityevals, round 5
Scoped verification (round 2+ rules: the changes only). Result: 0.376180 years of healthy life per $1,000 (was 0.376430). Verdict: pass.
Mechanical: preflight no high or medium; audit-model, normalization-audit no violations.

Checked:
- Typed rows now reading shared facts (sam_treatment_deaths_averted_share, livelihood_cost_per_household, livelihood_package_consumption_gain, livelihood_gain_years, learning_gain_sd_median_rct_lmic, years_primary_programme_to_work, conflict_mental_disorder_prevalence): values identical to the old typed ones (checked in the fact files); no result change.
- pro_effect_sd 0.3 SD (0.1-0.5) to the shared 0.2 SD (0.05-0.4) for broad protection work: fits the IRC's protection line (safe spaces, community protection, referral, case management for fewer, as the explainer says); only the pro_wellbys formula reads it; the explainer is right. The whole result move (-0.00025) comes from this.
- Rewritten explainers: no remaining comparison with another charity, its model or a median; the mortality range, the 10% care share, the SAM untreated mortality, cash costs and livelihood explainers keep their anchors (Lassi & Bhutta 2015, Olofin et al. 2013, Purgato et al. 2018, Evans & Yuan 2022, GiveWell's IRC CEA).
No findings.

Verdict: pass.
Model-sha: 6989ecb4f61ab9ebbd5501f4e9cfd288ec29f54be3925b2f2a5ce34692d71520
