# Audit: earthjustice-charityevals-health, round 2 (verification)
Result: 3.086e-5 uov/$ = 0.01543 years of healthy life per 1,000 dollars (round 1: 0.0181, so -15%, in line with the +/-18% expected from #3 and #4); combined range 0.0011-0.22; global-health median 0.069 (x0.22).
Scope: only the changes since round 1 (findings 1-10; #11 not changed, accepted as stated).
Mechanical: audit-model lint 0 findings (same warnings: wide range, 88% judgment share); check.ts all models valid; normalization-audit no violation for this model (INV-2b: 0 violations; the bridge reads `$uov_per_daly` only through `uov_from_daly`); simulation not re-run (no new inputs outside ranges already stable).

## Round 1 findings

| # | Status | Check |
|---|---|---|
| 1 | fixed, one new point (R2-1) | `pm_illness_dalys_per_death` = air_pollution_yld_share / cvd_deaths_per_daly_gbr = 0.08 x 18.2 = 1.46 DALYs per death; pfas from cancer_yld_share_usa / cancer_deaths_per_daly_usa. Units right (illness share of a DALY over deaths per DALY = illness DALYs per death). Each branch's downstream uses its own wait and `p_success`; `dalys_bridged` applies each branch's `total_adj`, `(1 + pfas_dbp_share)` on PFAS, `(1 + unmodelled_benefits_adj)`, over `period_years`; `uov_from_daly = dalys_bridged * ($uov_per_daly)` is the standard bridge form; `outcome_total` adds it. `illness_share` is gone and nothing reads it. |
| 2 | fixed | `unmodelled_benefits_adj` has `side_effect: "added"`, anchor (CATF 30%) in the explainer, still read as an added share in both formulas. |
| 3 | fixed | `years_until_effect` (PM, 8, 6-10; label and explainer say PM; downstream rows read it via `wait_discount`/`discounted_years`), `pfas_years_until_effect` 6 (5-7) with `pfas_discounted_years = years_pv * (1+$discount_rate)^-pfas_years_until_effect`, read by `pfas_downstream` and `pfas_illness_downstream`. Dates in explainers match the sources checked in round 1. |
| 4 | fixed | `pm_value_per_death` reads `cvd_share_*_gbr` (five bands present in facts/death_ages.json) x `$life_value_multiplier`; 50-69 and 70+ both at the 50-74 weight, the site's rule. Explainer names the UK as stand-in. |
| 5 | fixed | `pfas_dev_deaths` 1,300 (observed, EPA table); `pfas_value_per_death` values (total - dbp - dev) at the cancer mix and dev at `uov_per_death_under5`, divided by (total - dbp): correct weights, the dev deaths are inside `pfas_deaths_total - pfas_dbp_deaths`. The 70+ site-wide rule (second half of the r1 fix) stays an open owner decision across models, not this model's. |
| 6 | fixed | Explainer now names ALA, NRDC, EDF, Sierra Club as Earthjustice's clients, CATF as another intervenor, and the clients' own work inside the 25%. |
| 7 | fixed | Page "p. 3"; explainer "as many as", no "well under half". |
| 8 | fixed | `pfas_analysis_years` observed 82, no range, "pp. 3-4", quote from GAO. |
| 9 | fixed | next-dollar explainer reads 11% to 79%. |
| 10 | fixed | Byproduct deaths' illness included through `(1 + pfas_dbp_share)` in `dalys_bridged`. |
| 11 | accepted | Lines are the accounts' programme money, stated in each line's source. |

## New findings

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| R2-1 | low | normalization | pm_illness_dalys_per_death | The illness share (8%) is the fact's India/world judgment, "countries with younger deaths have a smaller YLD share" (its own note: Germany 24%, Libya 17%). It is combined with the UK's DALYs per cardiovascular death (18.2, an older, rich-country mix), so the two figures describe different populations: a rich country's share would be nearer the 24% end. Illness is a few percent of the value at the defaults, so this is small. The fact's range (5-24%) is not carried into this model. | facts/death_ages.json `air_pollution_yld_share` (note) | Add a rich-country figure to facts/death_ages.json (`air_pollution_yld_share_rich`, Germany 24% from the GBD 2019 paper already cited) and read it here with the UK deaths per DALY, so share and DALYs per death describe the same kind of population. | up to about +10% if 24% were used in place of 8% (illness x3 of about 4% of the value), well within the range already shown |
| R2-2 | low | presentation | years_until_effect | The PM wait row's id has no `pm_` prefix beside `pfas_years_until_effect`; label and explainer are clear. Cosmetic only. | model | Optional rename to `pm_years_until_effect` (update `wait_discount`). | 0 |

No high or medium finding. The explainers of the changed rows match their formulas (checked: pm_illness, pfas_illness, pfas_value_per_death, pfas_years_until_effect, dalys_bridged, outcome_total).

Verdict: pass (0 high)
Model-sha: 9d2d6948918c2f316dcce8fbd2fb35895e0178c82c01bba446c5fd56b7e097e6
