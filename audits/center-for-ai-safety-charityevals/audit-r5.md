# Audit: center-for-ai-safety-charityevals, round 5 (scoped: COVID-scale rows)
Result: 0.001351 daly/$ = 1.351 years of healthy life per 1,000 dollars (combined range 0.030–61.2); cause median 0.440 (×3.07). Verdict: pass.
Scope: unchanged from round 4; this round checks only the mechanical change since then: rows bio_covid_scale_share, covid_scale_deaths_averted, covid_value_per_death added, and uov_bridged now values the COVID-scale part of pandemic deaths at COVID's age mix (@death_ages.covid_scale_*), the rest at the world's age split.
Mechanical: lint 0 high / 0 medium; invariants none; normalization-audit none (full run, 0 violations); simulation-check stable (5%/50%/95% within the model's ranges). Generated output restored.
Previous round: no open finding from round 4 is touched by this change.

Change check: the three new rows and uov_bridged equal .claude/skills/build-cea/templates/catastrophic-risk.json (formula/value compared row by row). bio_cost_share is 0 (AI-only model), so the COVID-scale share carries zero weight and the result is unchanged: headline 1.351 before and after.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | none | | | No findings from the change | rows equal the template; headline unchanged | none | 0% |

## Sources checked
None new: the change adds no sourced inputs (shared facts only, @death_ages.covid_scale_*).

## Drivers
Unchanged from round 4.

Verdict: pass
Model-sha: 4238053d2dc42f561660326392c9814420a02c4067d072408286cd6a7c4c4ebf
