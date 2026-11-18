# Audit: ambitious-impact-charityevals, round 18 (scoped verification)
Result: 6.489 years of healthy life per 1,000 dollars at defaults (r17: 8.213; 6.203 after the five new spending records, 6.489 after rule spending-no-fallback); combined range and cause median not re-checked in this scoped round. Verdict: pass.
Model-sha: 3693e4baab7ade49971c9cfe941472455029b56974cc28cc1b0b1fddaab5c569
Rules: 0.3.5
Scope: spending recorded from evaluators' costs; no guessed weights (rule spending-no-fallback)
Preflight: pass. `npx tsx scripts/preflight.ts ambitious-impact-charityevals` prints "passes".
Previous round: r17 had no high or medium finding.

## Checked
1. **Formula pairs.** `value_destinations` is `(human_founded * wavg(...) + animal_founded * wavg(...)) / (human_founded + animal_founded)`. Human wavg: 19 pairs, each `#spending:X` followed by that charity's own figure (9 `#givewell:`: Suvita, Family Empowerment Media, Fortify Health, Ansh, Taimaka, Lafiya Nigeria, Notify Health, Healthy Futures, Spiro; 10 `#charityevals:`: Learning Alliance, NOVAH, Oxygen Access Project, Respira Health, LABRI, Lead Research for Action, ARMoR, First Embrace, Kaya Guides, Concentric Policies). Animal wavg: 2 pairs (Shrimp Welfare Project `#ace:`, Animal Policy International `#charityevals:`). 21 distinct charities, no mismatched or repeated pair. Clear Solutions and ACTRA appear nowhere in the formula, and their charities/*.json carry no `spending`. Every one of the 21 has a `spending.programme`; the weights are all positive.
2. **The five new figures against the rows their sources name.**
   - Spiro 469,807: models/grants/givewell/spiro-community-based-tb-hcm-april-2025.json, row `spiro_total_costs_2025_expectation` = 469807 (Full CEA!B19). Match.
   - Ansh 1,350,795: row `adjusted_budget_16_contingency_and_inflation_adjustment` and `_2` to `_12` (Budget ->!C5 to N5, twelve months): 84343+90128+95913+101698+107483+113268+119053+124838+130623+127816+127816+127816 = 1,350,795. Match.
   - Healthy Futures 484,653: row `total_costs_to_healthy_futures`, expected 484653.0519 (Costs!D59). Match.
   - Notify Health 314,815: not in the model (its only dollar figure is the arbitrary 100,000 `grant_size_best_guess`, as the source says); taken from the grant page, 85,000 / 0.27 = 314,814.8. Match, and the source says why the page is used.
   - Fortify Health 2,590,000: row `total_budget_usd_millions_year_3_2024_2025` = 2.59 (Annual cost per person!D4). Match; the source explains why this and not the HLI model's open-market-only figure.
   Each source names model and row, and each has year 2025.
3. **Weights and who carries the result** (computed from the library at defaults). Human cause: Fortify Health 23.7% of the weight, Lafiya Nigeria 13.2%, Ansh 12.4%, Suvita 10.5%, Family Empowerment Media 6.6%, the other 14 each 4.8% or less (Healthy Futures 4.4%, Spiro 4.3%, Notify Health 2.9%); no charity is a majority. Weighted mean 0.01976 units of value per dollar. By contribution to that mean: Suvita about 34%, Family Empowerment Media 17%, Lafiya 15%, Ansh 12%, Fortify Health 7% (heavy weight, low figure), Learning Alliance 4%; the five new records together under 15% (Spiro 2%, Notify 3%, Healthy Futures under 1%). Animal cause: Shrimp Welfare Project 82% and Animal Policy International 18% of the weight; the mean is about zero (SWP 5.8e-7, API slightly negative), so the animal term does not move the headline. The result is carried by four GiveWell human-health charities, as the formula intends.
4. **Text.** The explainer on `value_destinations` gives the right counts (nine GiveWell figures, eleven charityevals models including Animal Policy International, ACE for Shrimp Welfare Project; eight human and one animal launches in the year) and says weights are programme spending from accounts or the evaluator's model; its Clear Solutions and ACTRA sentence (no account or evaluator model gives their spending; valued at the average of their cause) matches the formula. The write-up's "GiveWell's figure for nine of them", the Clear Solutions/ACTRA sentence and "eight to one" agree. docs/normalization.md 2.8 says spending is recorded, never guessed, and that a reference to a charity with none is an error. `wavg` in src/engine/expr.ts returns NaN for any non-positive weight, with no fill. No peer, median or comparison wording in the explainer or write-up passages checked.
5. **Headline.** `npx tsx scripts/headlines.ts ambitious-impact-charityevals` prints 6.48878, as stated in the rule note.

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | No high or medium finding remains. | Checks 1-5. | | None |

## Sources checked
Spiro, Ansh, Healthy Futures and Fortify Health: the model rows named in each source, opened in the repo's model JSON and compared (not the live Google sheets). Notify Health: arithmetic of the quoted footnote only; the grant page was not re-fetched in this scoped round.

## Drivers
Unchanged from round 17, except that the weights are now all recorded spending. The result depends mostly on the figures of Suvita, Family Empowerment Media, Lafiya Nigeria and Ansh on the rankings, and on Fortify Health's large weight at a low figure.

Verdict: pass (no high or medium remains).
