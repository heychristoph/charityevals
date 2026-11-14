# Audit: far-ai-charityevals, round 6 (scoped: merged pandemic death-age rule and funging = 1)
Result: 9.578e-4 daly/$ = 0.9578 years of healthy life per 1,000 dollars (combined range 0.0195–47.0); cause median 0.0733 (×13.1). Verdict: pass.
Model-sha: a6b3e2ada94e9ab453d7d7f41b47d3b1783a9b0ee062501cda37f988b781f34d
Scope: unchanged from round 3 (all four programmes, 2024); this round checks that the two changes verified on separate branches (round 4: COVID-scale death ages; round 5: `leverage_funging_adj` = 1) are both present in the merged model and consistent with each other.
Mechanical: audit-model lint no high or medium; invariants none (INV-15 included); normalization-audit none (full run, "all models valid", 0 violations); `scripts/check.ts far-ai-charityevals` passes.
Previous round: rounds 4 and 5 had no open findings; both changes are present.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | none | double-counting | `leverage_funging_adj`, `@next_dollar.far_ai` | Funging is asked once: the row is 1 (0.85–1.05) with an explainer saying the room factor of `@next_dollar.far_ai` already asks it; no other row asks it (only `total_adj` multiplies it). The write-up's table says "Counted once, in the next-dollar figure". | model rows | none | none |
| 2 | none | normalization | `bio_covid_scale_share`, `covid_scale_deaths_averted`, `covid_value_per_death`, `uov_bridged` | The four rows equal the catastrophic-risk template (formula, value, unit compared); `covid_value_per_death` reads `@death_ages.covid_scale_*`. `bio_cost_share` is 0 (AI-only model), so the COVID-scale part carries zero weight and the age rule does not move this model. The two changes touch different rows and do not interact. | template comparison | none | 0% |
| 3 | none | presentation | summary, write-up | All figures equal `npx tsx scripts/headlines.ts far-ai-charityevals` (0.957847): 0.96, range "0.02 to 47" (0.0195–47.0), "about 13 times MIRI's" (0.958 / 0.0733 = 13.07), "more than ten times its peers' median". INV-15 sentences are right: the model is above ten times the cause median, and the reason stated (the over-a-quarter share of misuse work; misuse preset about 450 times misalignment) is true of the rows. Tornado figures quoted (0.13–9.2, 0.12–6.4, 0.40–1.4) match audit-model. | audit-model, headlines | none | none |
| 4 | low | presentation | `audit-r5.md` | The note "(Numbered 4 on its branch; renumbered at merge.)" was misleading once renumbered. | audit-r5.md | Removed. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| all | | not re-fetched | no new or changed facts; the only changed values are shared-fact reads and the funging row, verified in rounds 4 and 5 |

## Drivers
Misuse cut per dollar (estimate), AI catastrophe chance (judgment), years a cut counts (judgment), missing-data discount (judgment), next-dollar figure (estimate). Unchanged.

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.
