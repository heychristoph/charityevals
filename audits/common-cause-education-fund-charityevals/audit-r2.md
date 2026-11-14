# Audit: common-cause-education-fund-charityevals, round 2
Result: 2.256e-5 daly/$ = 0.0226 years of healthy life per 1,000 dollars (combined range 0.0013–0.40; joint low–high of the model's own ranges 0.0044–0.38); cause median 0.0684 (×0.33). Verdict: pass.
Model-sha: 88631ea882453910c21e3198c94df33cc89f73b58adcff26b1d259014381d0ce
Scope: unchanged from round 1 (all six Education Fund programme columns, $22,989,343 of $25,120,892, year to June 2025); this round checks the seven round-1 fixes and the changed rows only.
Mechanical: lint 0/0/0 (audit-model prints no lint findings); invariants none; check.ts all models valid. Normalization-audit and simulation not re-run (verification round on changed rows). generated/ untouched.
Previous round: findings 1–7 each resolved, except that the Thompson URL fix (6) was not carried into the write-up's Sources list (finding 1 below, low).

## Round-1 findings, checked

| R1 # | Status | Check |
|---|---|---|
| 1 | resolved | `bs_own_weight` is gone (0 occurrences). `bs_attribution_share` = `cost_total * bs_direct_share / bs_field_spending` = 25,120,892 × 0.35 / 2,617,075,486 = 0.00336, as the engine computes. The explainer states the rule and cites Protect Democracy. Reform dollars count only in `maps_attribution_share` (0.1135) and `oth_attribution_share` (0.610). |
| 2 | resolved | `maps_movement_resources` is $22M (12–45M), litigation left out with its wins, and the explainer says so. The parts: ballot campaigns about 9 × $3–25M over 18 years ≈ $6M/yr, plus standing organisations $8–20M/yr, give $14–26M, middle about $20M, so $22M is within the sum and the range is wide enough. |
| 3 | resolved | The summary gives the slide branch "0.3%", matching `bs_attribution_share` 0.00336. Branch shares from `bs_dalys` 443.6, `maps_dalys` 348.2, `oth_dalys` 467.4 (sum 1259.2): 35% / 28% / 37%. The summary's "about a third / about a quarter / the rest" and the write-up's "a third / a quarter / a little over a third" are consistent. The summary's 11% redistricting share matches `maps_attribution_share` 0.1135. |
| 4 | resolved | `maps_people_weak` = 23,702,457 = 8,631,393 + 3,271,616 + 11,799,448 (2020 census); with the strong 55,389,268 the total is 79.09M, the "79 million" in the summary and write-up. New York is excluded in the row's explainer and in the write-up, with the reason. |
| 5 | resolved | `oth_implementation_adj` explainer now says the relative effect is against a redistricting dollar as delivered, so the delivery share carries over. |
| 6 | resolved in the model | `oth_relative_effect` source URL is https://doi.org/10.1073/pnas.2007249117. Not carried to the write-up (finding 1). |
| 7 | resolved | The `common_cause_education_fund` next-dollar note in facts/next_dollar.json no longer mentions $16.6 million or growth; its remaining figures are the ones round 1 verified. The write-up has no "grew" clause (grep for 16.6, grew, FY2023: none). |

## New findings

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | write-up, Sources | The Thompson et al. line still links to the dead URL https://www.andrewbenjaminhall.com/Thompson_et_al_VBM.pdf (404 in round 1); the model's row was changed to the DOI but the write-up wasn't. | writeups/common-cause-education-fund-charityevals.md line 56 | Replace the link with https://doi.org/10.1073/pnas.2007249117. | none |

## Write-up against the model
All numbers match: 25.1M total and 23.0M programme spend; the six programme lines (10.0, 7.7, 2.6, 0.9, 0.9, 0.9); 11% chance of losing the democracy rating; 35% direct share; slide share 0.3%; 79 million people; weak commissions at 30%; 1% gain per commission; $22M movement spend and 11% share; the other-reforms quarter; 45% next dollar; headline 0.02 (0.0226); about a third of the cause median (×0.33); FairVote 0.0226 and Protect Democracy 0.0174 are the "close" peers. The drivers paragraph matches the tornado order (win years, missing-data discount, next dollar, democratization gain, then field risk cut and maps_gain_share).

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| maps_people_weak | https://en.wikipedia.org/wiki/List_of_U.S._states_and_territories_by_population | verified (round 1) | arithmetic re-checked this round |
| oth_relative_effect | https://doi.org/10.1073/pnas.2007249117 | not fetched | DOI resolved in round 1 and is the paper named |
| next_dollar note | FY2025 statements pp. 21–22 | verified (round 1) | the unsupported FY2023 clause is gone |

## Drivers
Unchanged: `win_years_counted`, `missing_data_discount`, `maps_gain_share` (judgment), the next-dollar 45%, `democratization_gdp_gain`. After the fixes, `maps_movement_resources` ($22M, tornado 0.0347 at $12M to 0.0151 at $45M) is a smaller swing than the maps gain share.

Verdict: pass (0 high, 0 medium, 1 low).
Model-sha: 88631ea882453910c21e3198c94df33cc89f73b58adcff26b1d259014381d0ce
