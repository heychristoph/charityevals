# Audit: machine-intelligence-research-institute-charityevals, round 5 (scoped: COVID-scale rows)
Result: 6.594e-5 daly/$ = 0.0659 years of healthy life per 1,000 dollars (combined range 2.7e-4–16.0); cause median 1.083 (×0.061). Verdict: pass.
Scope: unchanged from round 4; this round checks only the mechanical change since then: rows bio_covid_scale_share, covid_scale_deaths_averted, covid_value_per_death added, and uov_bridged now values the COVID-scale part of pandemic deaths at COVID's age mix (@death_ages.covid_scale_*), the rest at the world's age split.
Mechanical: lint 0 high / 1 medium (far-below, below); invariants none; normalization-audit none (full run, 0 violations); simulation-check stable (5%/50%/95% within the model's ranges). Generated output restored.
Previous round: no open finding from round 4 is touched by this change.

Change check: the three new rows and uov_bridged equal .claude/skills/build-cea/templates/catastrophic-risk.json (formula/value compared row by row). bio_cost_share is 0 (AI-only model), so the COVID-scale share carries zero weight and the result is unchanged: headline 0.0659 before and after.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | plausibility | summary | far-below lint: 0.0659 is under a tenth of the 4-model cause median (1.08) and the summary does not say why; not caused by this change (headline unchanged) | audit-model lint | add to the summary a sourced "far below the median because ..." reason | 0% |

## Sources checked
None new: the change adds no sourced inputs (shared facts only, @death_ages.covid_scale_*).

## Drivers
Unchanged from round 4.

Verdict: pass
Model-sha: 9e0c7106fdb7ad5917d26ecf172b3ff2ec4afe831bbe650ac73ccc0d9a81f312
