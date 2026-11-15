# Audit: iodine-global-network-charityevals, round 3
Result: 0.004813 uov/$ = 2.41 years of healthy life per 1,000 dollars (combined range 0.096–60.2); cause median 0.0689 (×34.9). Verdict: pass.
Model-sha: 590f0ba05738ac6295901b4894b2edbebb291290f12572f1a588584416795a24
Scope: unchanged from round 2: one programme line ($1,125,878 of $1,322,260, 2025), six branches. Verification round: only the round-2 findings and the changes since were checked.
Mechanical: lint 0/0/0 (audit-model's two mediums are far-above and spread, copied below), invariants none, normalization-audit not run (instructed), check.ts valid, simulation stable (5%–95% at 0.191–4.52× the best guess; two single events, 0% of draws missed).
Previous round:
- 1 (Moldova anchor) resolved: the unit is a hypothetical new rule the size of Moldova's bread rule; the `net_win_share` explainer says the rule dates from 2011, was re-issued in 2025 and that the re-issue isn't counted. `net_wins_per_year` 0.5 (0.1–2) and `reg_wins_per_year` 0.25 (0.05–1) match the fix; explainers state the 2019–2025 record (findings and drafts, no new rule). Summary and write-up reworded without "protects about 12,700 births a year" as the effect of the 2025 decree. Result 3.00 → 2.41 (round 2 predicted 2.36).
- 2 (GAIN uses a different iodine chain) not resolved here, by design: the fix belongs in global-alliance-for-improved-nutrition-charityevals. Carried as finding 1 below, not a defect of this model.
- 3 (illness adjustments, harm) resolved: (a) each branch has a `<b>_health_adj` (counterfactual × attribution × implementation × missing data) without `iodine_evidence_adj`; dropping the cohort-confounding 0.85 as well is sound, since that part concerns IQ cohort studies, not goitre. (b) The hyperthyroidism harm is −0.001 (−0.005 to 0), its explainer says why; a single figure instead of a per-branch factor is acceptable at about 1% of the result.
- 4 (`value_per_unit_year`) resolved: numerator sums the four births-based branches, and `units_affected_per_year` counts the same four; the explainer says so.
- 5 (charity file line) resolved: "six branches", regional advocacy named.
- 6 (Lebanon explainer) resolved: no unnamed surveys; the row is called a judgment with no national survey to cite, range 0.25–0.8 kept.
- 7 (far-above) still explained by its rows (finding 2). 8 (spread) still real uncertainty (finding 3).
- Beneficiary shares recomputed: Lebanon 0.309, Vietnam 0.2614, India 0.1744 and so on; they sum to 1 and check.ts passes.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | comparability | (other model) global-alliance-for-improved-nutrition-charityevals: ff_iq_gain_sd, ff_childhood_years, ff_lasting_share, iron-delay row | Open from round 2 finding 2: GAIN's charityevals model values the same iodine change by its own chain (children under 15 at a fifteenth each, 0.25 SD × 0.8, 10-year wait) instead of `@iodine.iq_points_deficient_vs_replete` and `@iodine.years_until_income_benefits_iodine` (15 years). This model follows the facts. | Round 2; facts/iodine.json explainers. A 10-year wait alone moves this model +21%. | In GAIN's model read the iodine facts (births reached × `@iodine.iq_points_deficient_vs_replete` × a ranged severity row, waiting `@iodine.years_until_income_benefits_iodine`), or make one chain the shared version for both. Not a change to this model; reported to the coordinator. | none here |
| 2 | medium (mechanical) | plausibility | births per dollar × income_value_per_birth | far-above: 34.9× the global-health median. The rows are found and supported (round 2 finding 7): about 195,000 births a year moved from deficiency in a line costing $1.48M, each 0.82 units of value, 2.5% credited after adjustments. Down from 43.5× after finding 1. | audit-model. | No change; nothing in the summary or write-up compares. | none |
| 3 | medium (mechanical) | sensitivity | net_wins_per_year, reg_wins_per_year, qa_mozper_supply_share, qa_mdg_supply_share, dav_share_gain, qa_quality_gain | spread: the model's own ranges span 8,186× joint low to high (121.6 / 0.01485); product of about 40 judged ranges, each stated with its anchor. The summary already says the result is very uncertain, and the simulation is stable. | audit-model; simulation-check. | No change. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| net_win_share, net_win_births, net_wins_per_year, reg_wins_per_year | AR 2025 p. 37 and the round-2 checks (Government Decision 596/2011; Logos Press, 3 Dec 2025) | verified (round 2; use unchanged) | The new explainers state the 2011 date and the 2025 re-issue as the round-2 sources found them; no new facts added. |
| leb_share_deficient_without | AR 2025 pp. 15–17 | verified | "well below standard for years" matches the report's account; the survey clause is gone. |
| hyperthyroidism_dalys_per_birth | Feyrer, Politi and Weil (2017) | verified (round 1) | Judgment; range 0 to −0.005 explains itself. |
| beneficiaries | scripts/beneficiary-countries.ts | verified | Recomputed shares sum to 1; check.ts valid. |

## Drivers
- Shared: `$missing_data_discount`, `$discount_rate`, `$win_years_counted`, `$uov_per_daly`, `@givewell_shared.resource_sharing_multiplier` (the site's).
- `severity_vs_meta` (judgment 0.5: 1.29–4.17); a meta-analysis of iodine in mildly deficient pregnancies would settle it.
- `@next_dollar.iodine_global_network` (estimate 0.56: 1.29–3.65).
- `net_wins_per_year` (judgment 0.5: 2.00–3.92); IGN's own list of rules changed after its tools since 2019 would settle it.
- `iodine_evidence_adj` (judgment 0.7: 1.60–3.05) and `vnm_share_protected` with `vnm_p_final` (the final Decree 09 amendment will settle the Vietnam branch).
