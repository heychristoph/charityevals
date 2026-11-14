# Audit: earthjustice-charityevals, round 2 (verification of round-1 changes)
Result: 0.00538 tco2e/$ = 0.002353 years of healthy life per 1,000 dollars (round 1: 0.00245; -4%, from the longer coal lead, as the round-1 tornado predicted). Combined range 0.000095-0.058.
Mechanical: audit-model lint 0 findings, invariants none; `scripts/check.ts earthjustice-charityevals` all models valid; no generated files changed.

| # | Severity | Finding | Status |
|---|---|---|---|
| 1 (r1 #1) | - | `unmodelled_benefits_adj` now has `side_effect: "added"`. | Fixed |
| 2 (r1 #2) | - | Anchor now names CATF's 30%, the 130 matters in 18 states, and the South African High Court ruling; the SA branch itself is not modelled, accepted as an anchor in the lump. | Fixed (anchor) |
| 3 (r1 #3) | - | `voc_deaths_per_year` (estimate 56-74, best 65, EPA RIA Tables 3-8/3-9) is a conversion row; `extra_deaths_per_tco2e = methane_share * voc_deaths_per_year / usmeth_tonnes_per_year` is dimensionally right (deaths/yr over t/yr, times the methane share of the average tonne). `voc_health_share` is gone and `outcome_total` no longer adds it. INV-2b: the inputs are an estimate, the reach row and the model-internal share; no shared assumption (`$deaths_per_tco2e`, `$climate_heat_share`) feeds the conversion rows. Result moved -0.1% from this change, as predicted. | Fixed |
| 4 (r1 #5) | - | `coal_years_until_avoided` is 3 (1-5), explainer reads the period's closings as a steady-flow proxy for wins and the lead from order to closing. | Fixed |
| 5 (r1 #6) | - | Next-dollar explainer reads "11% to 79%", matching facts/next_dollar.json (0.11). Summary figures ($185 a tonne, 0.0054 t, 0.0024) match the model. | Fixed |
| 6 (r1 #4) | medium | The 45% split is still a judgment (Form 990 Part III unreadable behind a bot check); moves the result about +-22% across 35-55%. Unchanged and stated by the caller. | Open (accepted) |
| 7 | low | `voc_deaths_per_year` carries no `side_effect` tag, so the `$side_effect_weight` slider does not reach the methane rule's smog deaths. Round 1 allowed this if the engine cannot weight a conversion row; CATF's `extra_deaths_per_tco2e` row is likewise untagged. At the defaults, effect is about 0.1%. | Low, optional: tag `side_effect: "added"` if the engine honours it on conversion rows. |
| 8 | low | The unmodelled uplift multiplies tonnes, so the VOC deaths (a ratio per tonne) also scale by 1.5 through `outcome_total`; arguably the other wins have no such smog. Effect below 0.1%. | Ignore. |

Verdict: pass
Model-sha: ce7d1e01fa9e006eeaefdd58d90d91b1ba958da6637ec932d4cb16fb7cac3cd6
