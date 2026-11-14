# Audit: earthjustice-charityevals-biodiversity, round 2 (verification)
Result: 7.15e-10 daly/$ = 0.00000071 years of healthy life per 1,000 dollars (combined range 1.0e-9 to 5.1e-4 daly/$ scale as printed; model's own ranges span about 50,000x); climate cause median 0.00235 (x0.0003).
Model-sha: fd40e4140033d757636e43a03933070aa4e394a92ac691f2f937151e6b26907b
Scope: only the changes since round 1 (findings 1 to 6 and the lows).
Mechanical: audit-model 0 high / 3 medium (outlier, far-below the climate median, spread of 50,380x) / 13 low (estimates with no range, all non-driver point rows). Invariants: none violated. check.ts: all valid. generated/ untouched.
Previous round: audits/earthjustice-charityevals-biodiversity/audit-r1.md.

## Round-1 findings re-checked
| # | Status | Check |
|---|---|---|
| 1 | fixed | `logged_share_per_year` is 0.003% (0.0005% to 0.015%), about 110 ha a year (20 to 570). CRS R46505 fetched (everycrsreport.com mirror of the cited report): "The FS asserts that overall harvest levels are not expected to vary significantly under the exemption", "an additional 168,000 acres of old-growth timber", sales averaging 15 MMBF a year. The quote in the model matches. The "no projection found" sentence is gone. Result moved 5.98e-9 to 7.15e-10 daly/$, the expected ~x0.12 after findings 2-5. |
| 2 | fixed | `evidence_adj` 0.8 (0.5 to 1.1); explainer now asks only about bias in the figures and defers unmeasured tonnes to `missing_data_adj`. No double count. |
| 3 | fixed | `counterfactual_adj` 0.8 (0.5 to 1.0), the pause appears only here, stated as not covering the counted years; `years_until_avoided` 3 (1 to 6) now anchored on planning-to-sale lead time with no pause clause. |
| 4 | fixed | `other_wins_share` 0.2 (0.05 to 0.5); species wins counted as nothing, in the row and the summary; offshore sales limited to those not already in the climate model's other wins. |
| 5 | fixed | `leakage_share` -50% (-80% to -25%), anchored on Wear & Murray (2004) with the carbon-vs-timber distinction; consistent with the extra-volume reading of finding 1. |
| 6 | fixed | `annual_risk_reduction` and `future_share_lost` are estimates at 0 with a source and the "no catastrophic-risk claim" note. |
| 7 | open, accepted | Spread (medium lint) remains at 50,380x, now from the discount-rate-independent ranges; it is honest uncertainty and the summary says so. |
| 8 | fixed | Summary now gives the reasons that explain the gap (the exemption barely raising logging, timber cut elsewhere, protection under threat) and drops the heat-delay clause. |
| 9 | fixed | `implementation_adj` explainer updated to the August 2026 filing. |
| 10 | fixed | `tco2_per_ha_logged` cites Leighty et al. 2006 and tree carbon of 210 to 220 t C/ha. |
| 11 | fixed | `years_until_avoided` names its reference class. |

## New findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 12 | low | `logged_share_per_year` | The source URL is the crsreports.congress.gov PDF; I fetched the same report at everycrsreport.com, where the quote is found. The 20,000-30,000 board feet an acre in the explainer is still the builder's assumption (no forest-plan volume table cited). | Optionally cite the 2016 Tongass plan amendment's volume per acre; the range already covers it. |
| 13 | low | summary | It says "about a hundred hectares a year of 3.8 million", consistent with the row. No other issue; the result (7.1e-7) matches the summary's "about 0.0000007". | none |
| 14 | low | `leakage_share` | Wear & Murray not refetched (paywalled DOI); claim is consistent with the paper's known finding of large spillover, and the explainer states it only as "most". | none |

Mediums 1 to 3 (lint outlier, far-below the climate median, spread) are expected for a model whose result is dominated by a roughly fixed harvest being moved, and each is explained in the summary; none is a rule breach.

## Drivers
1. `$discount_rate`, `$climate_heat_death_delay`, `$win_years_counted`, `$deaths_per_tco2e`: shared.
2. `logged_share_per_year`: judgment, now anchored on the Forest Service's own projection (verified).
3. `missing_data_discount`, `@next_dollar.earthjustice`, `implementation_adj`: shared or ranged judgments with reasons.

Verdict: pass
