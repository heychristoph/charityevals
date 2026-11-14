# Audit: far-ai-charityevals, round 4 (scoped: COVID-scale rows)
Result: 8.142e-4 daly/$ = 0.8142 years of healthy life per 1,000 dollars (combined range 0.016–40.3); cause median 0.709 (×1.15). Verdict: pass.
Scope: unchanged from round 3; this round checks only the mechanical change since then: rows bio_covid_scale_share, covid_scale_deaths_averted, covid_value_per_death added, and uov_bridged now values the COVID-scale part of pandemic deaths at COVID's age mix (@death_ages.covid_scale_*), the rest at the world's age split.
Mechanical: lint 0 high / 0 medium; invariants none; normalization-audit none (full run, 0 violations); simulation-check stable (5%/50%/95% within the model's ranges). Generated output restored.
Previous round: no open finding from round 3 is touched by this change.

Change check: the three new rows and uov_bridged equal .claude/skills/build-cea/templates/catastrophic-risk.json (formula/value compared row by row). bio_cost_share is 0 (AI-only model), so the COVID-scale share carries zero weight and the result is unchanged: headline 0.8142 before and after.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | none | | | No findings from the change | rows equal the template; headline unchanged | none | 0% |

## Sources checked
None new: the change adds no sourced inputs (shared facts only, @death_ages.covid_scale_*).

## Drivers
Unchanged from round 3.

Verdict: pass
Model-sha: c2d5c312c67de4a5bed6cf8731fb00595aba2a1ad89e39a4001779e2e397a7f6
