# Audit: lead-exposure-elimination-project-charityevals, round 3
Result: 0.03040 uov/$ = 15.2 years of healthy life per 1,000 dollars (combined range 0.24–974; the model's own ranges, shared figures at their best, 0.32–323); cause median 0.0686 (×221). Verdict: pass (no high findings; one low).
Model-sha: f4d80edc4016d4762fdae50f0b748ec40e9289b233f275bb166abb0aa8f7976e
Scope: unchanged from round 2 (LEEP's whole programme, 990 year to August 2025; spend 2020 to 2025 against 7 rules and 7 measured switches). Round 3 checks only the round-2 fixes.
Mechanical: audit-model 0 high / 1 medium (far-above, explained in round 2: reach) / 1 low (spread, accepted); invariants none; check.ts "all models valid"; simulation stable (5% 0.121×, 50% 1×, 95% 6.45× the best guess); normalization-audit no line for this model (`generated` restored).

Previous round:
1. (high) `health_effects_share`: resolved. The row is gone. `lead_deaths_2023` / `world_births_2023` × `paint_share` × `adult_vs_child_paint_exposure` × `lead_cvd_value_per_death` × `paint_exposure_pv` × `cohorts_per_win_year` is `adult_deaths_value_per_birth` (side_effect added), and `value_per_unit_year = earnings_value_per_birth + adult_deaths_value_per_birth`. Re-computed by hand: 3.5M / 132.11M = 0.02649 deaths per birth; × 0.15 × 0.25 = 9.93e-4; × 29.80 uov a death = 0.02959; × 0.5049 = 0.01495, equal to the model's 0.014948. No double counting: the earnings row is children's IQ only, this row is adults' deaths. `lead_cvd_value_per_death` reads the world CVD age mix, `@moral_weights` by band (the 70+ band split by the 80+ share) and `$life_value_multiplier`. Probed with the engine: `$side_effect_weight` 0 gives ×0.721 (the side effect is 27.9% of the result, matching 0.0149 / 0.0536); `$daly_per_child_death` halved gives ×0.861 and doubled ×1.279 (±27.9%), so the value-of-life slider now moves the model and the weight applies. `paint_exposure_pv` is split out and still feeds `income_wait_discount` (0.505 × 17-year discount = 0.259). The summary, write-up and explainers say 15 and deaths; no peer comparison.
2. (low) Liberia example and `years_until_effect` 1.5 (0–3): resolved. The explainer now says three years for manufacturers and ungazetted by March 2026; `reg_implementation_adj` names it.
3. (low) split `mkt_*_implementation_adj`: resolved. Pakistan 0.53 (0.4–0.65), Malawi 0.9 (0.75–0.96), others 0.2 (0.05–0.5), births-weighted formula gives 0.4409. Beneficiary shares sum to 1.0000. Recomputed at the defaults: Pakistan 6.88M births × 0.0466 per birth × 0.53 = 169.9k of 361.1k = 47.05% (listed 0.4706); Malawi 7.69% (0.0769). The note's 35% / 65% branch split matches the model's branches (reg 127.9k, mkt 233.2k of 361.1k).
4. (low) `lag_share_2025` wording: resolved (rose through the year, $0.36M a month to August, about $0.5M after).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `lead_deaths_2023` | The stored quote's word order differs from the WHO page as fetched today ("Lead exposure was attributed to more than 3.5 million deaths globally in 2023, primarily due to cardiovascular effects"). The number, year and cause are right; the fact sheet is dated 10 June 2026 as the row says. | https://www.who.int/news-room/fact-sheets/detail/lead-poisoning-and-health | Replace the `quote` with the page's wording: "Lead exposure was attributed to more than 3.5 million deaths globally in 2023, primarily due to cardiovascular effects". | 0 |
| 2 | low | units | `adult_deaths_value_per_birth` (explainer) | World deaths over world births understate lead deaths per birth in the protected low- and middle-income countries (most lead deaths are there). Conservative and small (about 5%); worth one sentence so a reader sees the direction. | GBD 2023 via WHO; world births 132.1M | Add to the explainer: "World deaths over world births; the protected countries' rate is a little higher, so this is conservative." No formula change. | about +2% if corrected |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| lead_deaths_2023 | https://www.who.int/news-room/fact-sheets/detail/lead-poisoning-and-health | verified (number, year, date; wording differs, finding 1) | more than 3.5 million deaths in 2023, mostly cardiovascular; dated 10 June 2026 |
| world_births_2023 | https://ourworldindata.org/grapher/number-of-births-per-year | not re-fetched; 132,110,264 is consistent with UN WPP 2024's 2023 world births (about 132 million) | the same fact set as the model's `births_*` rows, verified in round 1 |
| mkt_pak/mwi/other_implementation_adj | https://leadelimination.org/news/2025-in-review-advancing-lead-elimination-at-scale | verified in round 2 (88% to 41%; 89% to 4%) | arithmetic re-checked: 47/88 = 53%; 85/89 = 96% (best guess 90% for the two manufacturers still over the limit) |
| years_until_effect (Liberia) | https://allafrica.com/stories/202603310383.html | verified in round 2 | |

## Drivers
1. `$discount_rate` (shared; 4.9–94).
2. `$win_years_counted` (shared; 3.3–46).
3. `@lead.paint_share_of_child_bll_lmic`: judgment 15% (4–40%; 4.1–41), now also scales the adult-deaths side effect (28% of the result). A source-apportionment study in a LEEP country would improve the model most.
4. `$missing_data_discount` (shared; 3.0–30).
5. `@next_dollar.lead_exposure_elimination_project`: sourced (7.2–27).

The adult-deaths side effect rests on `adult_vs_child_paint_exposure` (judgment 0.25, 0.1–0.5, reasoned from the dust pathway); a blood-lead apportionment for adults would anchor it. Peers (audit only): ×221 the cause's median, explained by reach (about 18.6M births a year in 14 countries against about $0.79M a year of spending), as accepted in earlier rounds.
