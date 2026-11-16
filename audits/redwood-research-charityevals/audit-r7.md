# Audit: redwood-research-charityevals, round 7 (scoped: merged pandemic death-age rule and funging = 1)
Result: 6.847e-5 daly/$ = 0.0685 years of healthy life per 1,000 dollars (simulation 5%-95%: 0.0046-0.655; audit-model's combined range is far wider); cause median 0.958 (x0.071). Verdict: pass.
Model-sha: 78d45905902a1aff5f9be7a077221b23e6c6253edd6066587218da4176fe1053
Scope: unchanged; scoped to the two merged changes, both present and consistent.
Mechanical: lint 0 high / 0 medium (four range lows, two unused lows, far-below low whose reason the summary gives); invariants none; normalization-audit none (full run, 0 violations; generated output restored); check.ts passes; simulation-check stable (5% 0.067, 95% 9.57 x best guess).
Previous round: round 6 had no open findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | none | | | Pandemic death-age rule present: `bio_covid_scale_share`, `covid_scale_deaths_averted`, `covid_value_per_death` and `uov_bridged` equal the template row by row and read `@death_ages.covid_scale_*`; COVID-scale deaths at COVID's age mix, the rest at the world mix. `bio_cost_share` is 0, so it carries zero weight here. | template comparison | none | 0% |
| 2 | none | | `leverage_funging_adj` | Funging = 1 (0.85-1.05), explainer says the room factor of `@next_dollar.redwood_research` already asks it. The two do not double count: `total_adj` uses funging 1 and the next-dollar factor (40%, room 0.5) is applied once, as the past-average-to-next-dollar step. The next-dollar note names Open Philanthropy/Coefficient Giving as the funder. | model rows, facts/next_dollar.json | none | none |

## Numbers checked
- `headlines.ts`: 0.0684660. Summary 0.07, write-up 0.068 match; range "0.005 to 0.7" = simulation 5%-95%; misuse share 13x (x13.2): match. Write-up funging row "1, counted once in the next-dollar figure" and the check paragraph are accurate. The write-up's age sentence ("across the world's age groups") is true for the AI deaths here; no pandemic weight.
- INV-15: x0.071 is under a tenth of the cause median; the summary's reason (all work against misaligned AI, whose typical project cuts far less per dollar than misuse, which carries most of FAR.AI's and CAIS's results) matches the rows (misuse share 0 vs 0.28/0.25 in peers). Close to MIRI's (0.0733): true. Not over 10x the median.

## Sources checked
None re-fetched: no new facts; both changes are shared-fact or structural.

## Drivers
AI catastrophe chance, misalignment cut per dollar, discount rate, years a cut counts, misuse share. Unchanged.

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against ee138d3d.
