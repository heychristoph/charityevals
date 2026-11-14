# Audit: world-central-kitchen-charityevals, round 3
Result: 9.936e-5 daly/$ = 0.099 years of healthy life per 1,000 dollars (combined range 0.022–0.448); cause median above (reference class: hand-built daly models, median about 0.005, so about x20; the summary's stated reasons stand from rounds 1-2). Verdict: **pass**.
Model-sha: 0f7b3414849c2512c8c1cbdd453a8570cd76c3471368af79336079eb5599cbe3
Scope: unchanged from round 2 (the one programme, 2025, 372.5 million consolidated); this round checks only the changes since a18247b.
Mechanical: lint 0 findings, invariants none, normalization-audit not re-run (no rule-relevant structure changed), check.ts all models valid, simulation-check stable (5% 0.506, 50% 1, 95% 1.88 x best guess).
Previous round: five low findings, all five resolved (see below).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | beneficiaries (file) | `scripts/beneficiary-countries.ts --check` reports "1 file would change". The WCK model's `beneficiaries` block now sits at the end of the file (line 1586) instead of after `cause`, where the script writes it; the check does not name the file. | `--check` output | Run `npx tsx scripts/beneficiary-countries.ts` once and commit if it moves the block back. | none |
| 2 | low | source | gz_bread_meal_equiv | The 73 million loaves (Gaza since 2023) are on wck.org/news/gaza-milestone/ and verified; "perhaps 30 to 40 million of them in 2025" and "half a meal's food per loaf" are the builder's guesses, not in the source. Fine as a ranged judgment (5-30 million, best 15), but the explainer states the 2025 share as if known. | page text: "272 million meals, 73 million loaves of bread" since 2023 | Reword: "73 million loaves since 2023; we take about half of them to fall in 2025 (a judgment)". | about 1% (bread adds 15M to 125M Gaza meals; years_exposed +12%, food gain concave) |

## Previous round
- Gz/lm evidence-adjustment explainers: the unpublished-split clause dropped, 0.85 now rests on the count and peers (Red Cross 0.95, Americares 0.8): resolved.
- food_share_of_programme explainer: ends "The split by place is not published, so every branch takes the average share." Matches the formulas (every branch uses food_expense / program_expenses): resolved.
- Shares over the consolidated programme: gz_share = sf_mena / program_expenses, lm_share = lm_spend_990 / program_expenses; lm_spend_990's Europe term = sf_eur + (program_expenses - sf_program_total + sf_eur_grant) = sf_eur + 11.55 M (the affiliate's own spending by difference, 388.52 - 372.54 = 15.99 M less the 27.54 M grant). Arithmetic correct, hi_share remains the remainder so the three shares sum to 1. sf_* and sf_program_total now `drawn_with: program_expenses` so the difference stays fixed in the simulation: resolved. Units and explainers consistent.
- gz_bread_meal_equiv (judgment 15 M, 5-30 M, kind judgment, sourced) added in years_exposed as (gz_meals + bread) / (people * 365 * meals_per_person_day): units (meals / person-meals per year) right, no double count with meals (the source counts bread apart, flour in the food bill, which also feeds gz_food_per_person via spend): resolved (see finding 2 for the wording).
- crisis_mortality_rate explainer: 0.025 is about a third of 0.073 (2 deaths per 10,000 a day x 365), wording now right: resolved.
- Summary and write-up: 0.10, over 70% from Gaza, about 140 dollars per person (gz_spend x food share / people), result 0.099 live; beneficiaries 0.7171+0.1125+0.0891+0.0556+0.0213+0.0044 = 1.0000 and the note's 72% / 28% match: consistent.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| gz_bread_meal_equiv | https://wck.org/news/gaza-milestone/ | verified | "more than 272 million meals, 73 million loaves of bread, and 6.4 million gallons of water" since 2023 |

## Drivers
Unchanged: missing_data_discount (judgment), uov_per_daly (shared), gz_counterfactual_adj (judgment), baseline_consumption (judgment), uov_per_ln_consumption (shared estimate). The 2025 Gaza death rate and the 0.15 share of excess deaths averted remain the main judgments with anchors. No high or medium finding; the changes moved the result 0.094 to 0.099 as expected (bread adds exposure, the consolidated shares move a little spend between branches).
