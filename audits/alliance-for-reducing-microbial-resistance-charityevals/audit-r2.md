# Audit: alliance-for-reducing-microbial-resistance-charityevals, round 2
Result: 1.012e-4 uov/$ = 0.0506 years of healthy life per 1,000 dollars (combined range 0.00045–5.75). Verdict: pass.
Model-sha: ee4d0ca0e2bdf1251169d49f689e01233ba153858595595e952d9e78e04b3ba8
Rules: 0.3.9
Scope: unchanged from round 1 (scoped verification only).
Preflight: pass (two low lines, generated files stale; regenerate with `npx tsx scripts/summaries.ts` before commit).

## Previous round
| # | Round 1 | Status |
|---|---|---|
| 1 | high, aim-theoretical.py | Deferred to the owner (he removes the AIM idea-stage models after merging; not touched on this branch). Not open. |
| 2 | high, age mix of reached deaths | Resolved. `amr_value_per_death` = (access_hic_share × HIC value + (1 − share) × world value) × `$life_value_multiplier`; `access_hic_share` 55% (40–75%) is a judgment anchored on access_share's own figures; new `@death_ages.amr_hic_share_*` facts (judgment, GRAM 2021 named). Result moved as predicted (−35%). |
| 3 | medium, price year | Resolved. `reward_price_factor = @cpi.usa_2025 / @cpi.usa_2021` used in `eu_new_drugs_per_year`; the explainer states the 2021 price year (the newsletter gives no other). |
| 4 | medium, Swiss branch | Resolved by reasoning, which holds. The Die Mitte consultation response (22 March 2024, fetched) already "befürwortet" federal funding of new antibiotic development in the Epidemics Act revision, so the legal basis predates ARMoR's Swiss Round Table work and was in the draft from the consultation opened in late 2023; Parliament decides 2026–27, after the period. 0 stands. The only open point is low finding L1. |
| 5 | medium, evidence_adj | Resolved. 0.6 (0.3–1.0); anchors now correct (2% per drug → 50:1 → 0.4; faster resistance → 100:1 → 0.8); reserve reason dropped. Kept as one row. |
| 6 | medium, wait vs life | Resolved. `drug_benefit_wait_years` = approval_lag_years (3–10, best 5) + reserve_years (4, observed) + drug_life_vs_window × study_effect_years_in_window × 0.5 = 17.25; discounting reason removed from `drug_life_vs_window`. Matches round 1's ~17.5. |

No new high or medium from the changes: the HIC facts are ranged judgments with a source and reference (83.9% at 70+ in high-income Asia Pacific); the formulas read only shared rows and the model's own; units consistent (CPI factor on a USD figure, EUR→USD at `@fx`).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect |
|---|---|---|---|---|---|---|---|
| L1 | low | source | nat_units_affected_per_year | The explainer's date "29 November 2023" for the consultation has no cited source in the model (the cited Die Mitte PDF shows only its own date, 22 March 2024, and the draft-law consultation). The BAG page named in the hand-over isn't in the row's source. | PDF text: "Bern, 22. März 2024", "Vernehmlassung: Teilrevision des Epidemiengesetzes". | Add the BAG/Fedlex consultation page (opening date 29 November 2023) to the row's source or explainer. | none |
| L2 | low | presentation | write-up | Typed: "elsewhere children under five are 17% of them" (a fact: use `{{fact:...amr_share_under5}}` if available) and "20% to 90%" / "5% to 50%" / "1% to 15%" ranges beside placeholders (use `{{range:...}}`). | `scripts/prose-numbers.ts` lists 16 left typed, mostly explainers. | Replace with placeholders where the checker offers them. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| p_success | matheson.com/insights/eu-pharma-package-eu-council-adopts-new-rules/ | verified | "the Council of the EU adopted the reforms on 28 September 2026. The new framework will enter into force following adoption" by Parliament. |
| nat_units_affected_per_year | die-mitte.ch Stellungnahme (22 March 2024) | verified | Supports federal funding of new antibiotic development in the revision. |
| nat_units_affected_per_year | globalamrhub.org/pull-incentives-by-country | reachable | Switzerland listed; round 1 had verified the quote. |

## Drivers
Unchanged: `eu_subscription_eur_per_year` (judgment), `$mobiliser_share`, `attribution_share_shared`, `eu_additional_share`, `$win_years_counted`. Result 0.0685 → 0.0506, in line with the moves from findings 2, 3, 5 and 6.

Re-stamped (18 Nov 2026): round-2 low L1: the national branch's source now shows the Swiss consultation's date (scienceindustries' response form); wording and source only. Mechanical: headline unchanged, against a36e32dc.
