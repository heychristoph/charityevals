# Audit: international-rescue-committee-charityevals, round 5
Scoped verification (round 2+ rules: the changes only). Result: 0.376180 years of healthy life per $1,000 (was 0.376430). Verdict: pass.
Mechanical: preflight no high or medium; audit-model, normalization-audit no violations.

Checked:
- Typed rows now reading shared facts (sam_treatment_deaths_averted_share, livelihood_cost_per_household, livelihood_package_consumption_gain, livelihood_gain_years, learning_gain_sd_median_rct_lmic, years_primary_programme_to_work, conflict_mental_disorder_prevalence): values identical to the old typed ones (checked in the fact files); no result change.
- pro_effect_sd 0.3 SD (0.1-0.5) to the shared 0.2 SD (0.05-0.4) for broad protection work: fits the IRC's protection line (safe spaces, community protection, referral, case management for fewer, as the explainer says); only the pro_wellbys formula reads it; the explainer is right. The whole result move (-0.00025) comes from this.
- Rewritten explainers: no remaining comparison with another charity, its model or a median; the mortality range, the 10% care share, the SAM untreated mortality, cash costs and livelihood explainers keep their anchors (Lassi & Bhutta 2015, Olofin et al. 2013, Purgato et al. 2018, Evans & Yuan 2022, GiveWell's IRC CEA).
No findings.

Verdict: pass.
Model-sha: 108600d01a9e092be1bcc12b1ea2312b95129b9c693a36a9a6b907426af2a1de
Rules: 0.3.13

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 52be53be.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against d150f0b2.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.

Re-stamped 27 Nov 2026: source link points to the model's page (the old /<model-id> address was a 404); values unchanged.
