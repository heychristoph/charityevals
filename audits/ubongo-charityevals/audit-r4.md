# Audit r4: ubongo-charityevals (full independent audit)

Result: 0.1038 uov/$ = 51.9 years of healthy life per 1,000 dollars (range 8.1–278, 0% of draws at or below zero); far above the cause's median. Verdict: fix needed (1 high).
Model-sha: 0ef00b2bc17fe88b4af769859811ec7d36a11a80fee783fba1c5cbb792db599f
Rules: 0.4.3
Scope: Ubongo International, Form 990 for 2024, one programme ($6,724,466 of $7,247,589), matching charities/ubongo.json. The audience counted is the whole group's (#4).
Preflight: passes.
Previous rounds: r1–r3 highs and mediums resolved or accepted.

The simulation's p90 is 3.87× the best guess, so under `risk_quantile` 0.9 the result was 201 at the defaults and about 1,290 under Long-run.

| # | Severity | Category | Row | Finding | Fix | Status |
|---|---|---|---|---|---|---|
| 1 | high | double-counting | `repeat_year_ratio`, `ln_gain_per_person` | The audience is recounted every year and each child-year got 0.213 × 0.6 = 0.128 SD with no ceiling: a child watching from 3 to 14 added up to about 1.5 SD. Watson's Uwezo survey (Table 6.1: 0.126, SE 0.035, maths SD 0.841) gives 0.15 SD for Ubongo Kids viewers after up to four years on air; a year of age with schooling is 0.075 SD in the same regression. The preschool d was applied to 7–14-year-olds. | Cohort rule (one gain per child over the years watched): per show, `ak_gain_per_year_sd = effect_sd × ak_cumulative_vs_first_season / ak_viewing_years`, `uk_gain_per_year_sd = uk_effect_sd / uk_viewing_years` (Watson, interval 0.95), weighted by `preschool_share`. | fixed |
| 2 | medium | normalization | `evidence_adj`, `spillover_ratio`, `years_until_work` | Anchored on another model, on nothing, and on GiveWell's deworming wait where the site has `@education.years_primary_programme_to_work`. | Evans & Yuan and Mares & Pan Table 4 (experiments 0.377, surveys 0.262) as anchors; spillover 0.05 (0–0.1) on its audience; per-show waits, Ubongo Kids reading the shared fact, Akili and Me 14 (12–16). | fixed |
| 3 | medium | sensitivity | `households_reached`, `watch_share`, `implementation_adj` | Three wide ranges on one quantity put the upper tail above Ubongo's own 24 million regular viewers. | Households a reported point count (radio-only reach stated); `watch_share` 0.5 (0.35–0.7); `implementation_adj` 0.55 (0.3–0.8), 7–24 million regular viewers across both, with Uwezo's 16.7% weekly viewing as a check. | fixed |
| 4 | medium | source | `group_share` | Unsourced share of group spending. | No published account totals the group's 2024 spending; anchored on the 2019 group accounts (Annual Report 2019, p. 25), the judgment kept. | fixed (anchor) |
| 5 | low | double-counting | `unmodelled_benefits_adj` | +10% for social-emotional learning the pooled d already covers. | 0 (−10% to +10%). | fixed |
| 6 | low | presentation | summary, write-up | "a few cents" per child; it is about $0.26 a child-year. | Reworded. | fixed |
| 7 | low | presentation | `earnings_gain_per_sd` | Kearney & Levine find no significant wage effect. | Reworded. | fixed |
| 8 | low | presentation | `partner_share` | $1.59 million is "Fees for services, other" (Part IX line 11g), not service fees. | Reworded. | fixed |
| 9 | low | source | `effect_sd` | Founders Pledge reads Ubongo's trials as about 0.17 SD. | Added as a cross-check. | fixed |
| 10 | low | missing-adjustment | `gift_to_grant_years` | Pledges receivable rose to $20.3 million. | Kept at cash; `leverage_funging_adj` says it carries the pledges. | fixed |

Sources checked: Form 990 2024 (IRS e-file XML), Strategic Plan 2024–28 pp. 5, 10, 21, 31, Reach_popup.pdf, World Bank 0–14 shares, Mares & Pan 2013 p. 146 and Table 4, Watson thesis Table 6.1 and pp. 202, 209, Borzekowski and others 2023, NBER w21229 (wording mismatch, #7), Annual Report 2019 p. 25: verified. Evans & Yuan 2022: paywalled, read through its abstract.

After the fixes: 27.7 years of healthy life per 1,000 dollars (range 5.0–122).
