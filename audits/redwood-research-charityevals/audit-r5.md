# Audit: redwood-research-charityevals, round 5 (scoped: COVID-scale rows)
Result: 5.477e-5 daly/$ = 0.0548 years of healthy life per 1,000 dollars (combined range 4.5e-5–67.0); cause median 1.083 (×0.051). Verdict: pass.
Scope: unchanged from round 3; this round checks only the mechanical change since then: rows bio_covid_scale_share, covid_scale_deaths_averted, covid_value_per_death added, and uov_bridged now values the COVID-scale part of pandemic deaths at COVID's age mix (@death_ages.covid_scale_*), the rest at the world's age split.
Mechanical: lint 0 high / 1 low (far-below, summary gives the reason); invariants none; normalization-audit none (full run, 0 violations); simulation-check stable (5%/50%/95% within the model's ranges). Generated output restored.
Previous round: no open finding from round 3 is touched by this change.

Change check: the three new rows and uov_bridged equal .claude/skills/build-cea/templates/catastrophic-risk.json (formula/value compared row by row). bio_cost_share is 0 (AI-only model), so the COVID-scale share carries zero weight and the result is unchanged: headline 0.0548 before and after.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | none | | | No findings from the change | rows equal the template; headline unchanged | none | 0% |

## Sources checked
None new: the change adds no sourced inputs (shared facts only, @death_ages.covid_scale_*).

## Drivers
Unchanged from round 3.

Verdict: pass
Model-sha: f2245aaac14571f1ba76cfe4ca25759a4de4a85bc9ef92da7d45640483634975
