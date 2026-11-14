# Audit: league-of-women-voters-education-fund-charityevals, round 3
Result: 1.248e-5 daly/$ = 0.01248 years of healthy life per 1,000 dollars (combined range 0.00075–0.207; joint low–high of the model's own ranges 0.0077–0.0238); cause median 0.0667 (×0.19). Verdict: pass.
Model-sha: bbf43555f45849f6bbb75c4ef727e9a084123c7732a385f79b39a895ae48157b
Scope: unchanged since round 2 (scoped verification: only the round-2 fixes were checked).
Mechanical: lint 0/0/0 (the audit-model output shows no lint codes), invariants none, normalization-audit not rerun (scoped round; no row it reads was touched); check.ts all models valid; simulation stable (5% 0.133×, median 1.00×, 95% 6.44× the best guess).
Previous round:
1. Medium, `vi_cycle_share` / `vie_uov` double counting: **resolved**. The Thompson clause is gone from `vi_cycle_share`, whose explainer now says the shared relative effect already holds the small partisan effect and the tenth is reach per dollar against a state-wide reform. `vie_cycle_years` (judgment 2, 1 to 4), `vie_wait` (judgment 0.5, 0.25 to 1.5) and `vie_discounted_years = pv_annuity_due(1, $discount_rate, min(vie_cycle_years, years_of_impact)) * (1 + $discount_rate) ^ (0 - vie_wait)` are as specified, each with an anchor and reference class, and `vie_uov` swaps the reform's `maps_discounted_years` for `vie_discounted_years`. The side effect no longer grows with the years slider beyond a term: the result at `$win_years_counted` 1 / 20 is now 0.00327 / 0.0283, exactly the values the round-2 fix predicted, and the default is 0.01248 (predicted 0.01248). The rows are discounted at the shared rate, tagged `side_effect: added`, thin (`vi_missing_data_adj`), and the new judgments are ranged.
2. Low, `unmodelled_benefits_adj`: **resolved**. `+ vie_uov` is in the numerator as specified; reading-only, result unchanged.
3. Low, write-up drivers and side-effects sentence: **resolved**. The drivers paragraph follows the tornado (missing-data discount, years counted, field risk cut, income gain, next dollar; then uov_per_daly, loss chance, redistricting gain share, discount rate). "Besides voter information's effect on who is elected, the side effects are shared figures." is in. The voter-information paragraph matches the new chain (a tenth of an access reform per dollar each year, reaches only those it informs, two-year term).
4. Low, `bs_direct_share` missing space: **resolved** ("…leave litigation out), the April 2025 lobbying…").

Summary and write-up against the result: both say 0.012 (live figure span for the headline), about 32 / 32 / 10 / 11 / 14% for the branches (redistricting now 11%, as round 2 measured 11.5%), 73% of the programme, 1% of the movement, a fifth of the median and about half Common Cause (0.01248 / 0.02256 = 0.55). All match.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary, write-up "Biggest uncertainties" | The summary's closing list of drivers ("the years a win counts, the field's effect on the risk, the weight of voter information against direct work") still names the voter-information weight, which sits below the first five tornado inputs (missing-data discount, years counted, field risk cut, income gain, next dollar). Optional wording. | tornado | Replace "the weight of voter information against direct work" with "the income gain of democracy and the next-dollar figure". | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| New rows `vie_cycle_years`, `vie_wait` | none (judgments) | not applicable | Both are ranged judgments with a stated anchor (House term; November 2024 election to January 2025 seating). |
| Earlier sources | as in round 2 | verified in rounds 1 and 2 | Not refetched; scoped round. |

## Drivers
1. `$missing_data_discount` (shared slider): 0.0025–0.025.
2. `$win_years_counted` (shared slider, judgment): 0.0033–0.028.
3. `@democracy.field_risk_cut_per_year` (shared judgment): 0.0054–0.040.
4. `@democracy.democratization_gdp_gain` (shared estimate): 0.0043–0.020.
5. `@next_dollar.league_of_women_voters_education_fund` (estimate): 0.0050–0.024.

The model's own judgments matter less (joint low–high of its own ranges 0.0077–0.0238). What would most improve it is still an issue-level split of the Education Fund's spending (Form 990 Schedule C or the League's budget by campaign) in place of the judged shares.
