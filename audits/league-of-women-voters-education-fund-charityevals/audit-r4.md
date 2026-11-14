# Audit: league-of-women-voters-education-fund-charityevals, round 4
Result: 1.248e-5 daly/$ = 0.01248 years of healthy life per 1,000 dollars (combined range 0.00075–0.207; joint low–high of the model's own ranges 0.0077–0.0238); cause median 0.0667 (×0.19). Verdict: pass.
Model-sha: c84808f3a348b1238c7c56fe452b408c8e2ed63f4ecfddfd98a48de0e62e9e09
Scope: unchanged since round 3 (scoped verification: only the `summary` change was checked; no row changed).
Mechanical: lint 0/0/0 (audit-model prints no findings), invariants none, normalization-audit not rerun (no row touched); check.ts all models valid.
Previous round: 1. Low, summary's closing driver list named "the weight of voter information against direct work": **resolved**. The sentence now reads "turns most on the years a win counts, the field's effect on the risk (both judgments), the income gain of democracy and the next-dollar figure, and all four branches are discounted by the shared missing-data slider".

Summary against the model: the tornado's top six are missing_data_discount (0.0025–0.025), win_years_counted (0.0033–0.028), field_risk_cut_per_year (0.0054–0.040), democratization_gdp_gain (0.0043–0.020), next_dollar (0.0050–0.024), then uov_per_daly. The summary's four named drivers are tornado ranks 2 to 5, in the same order, and the missing-data discount (rank 1) is named separately in the same sentence. "Both judgments" is right for win_years_counted and field_risk_cut_per_year (both `judgment`); the income gain and next-dollar figure are estimates, not claimed otherwise. The remaining claims still hold: result 0.012 (live 0.01248); branch shares about 32 / 32 / 10 / 11 / 14% as in round 3; voter information 73% of spending; 1% share of the redistricting movement; 79 million Americans; next dollar 52.5% of the average (0.7 × 0.75, the entry audited in rounds 1 and 2); $11.3 million own spending plus $5.4 million donated legal and advertising; 501(c)(3) versus 501(c)(4) note.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| none | | not applicable | Summary wording only; sources verified in rounds 1 to 3. |

## Drivers
1. `$missing_data_discount` (shared slider): 0.0025–0.025.
2. `$win_years_counted` (shared slider, judgment): 0.0033–0.028.
3. `@democracy.field_risk_cut_per_year` (shared judgment): 0.0054–0.040.
4. `@democracy.democratization_gdp_gain` (shared estimate): 0.0043–0.020.
5. `@next_dollar.league_of_women_voters_education_fund` (estimate): 0.0050–0.024.
