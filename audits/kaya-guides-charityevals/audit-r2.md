# Audit: kaya-guides-charityevals, round 2
Result: 0.01201 wellby/$ = 0.7841 years of healthy life per 1,000 dollars (combined range 0.2003–3.070); cause median 0.1196 (×6.56). Verdict: pass.
Model-sha: 1e26a9456c19a03cc06b04db9a9768ae5e8ce65fe0ddc1758a70021fac92407a
Rules: 0.3.2
Scope: unchanged from round 1 (one programme, the 2025 WhatsApp course with guide calls, $166,981, 2,776 starters); scoped verification only.
Preflight: pass (kaya-guides section of preflight-r2.txt).
Previous round: finding 1 (high, effect_duration_years) resolved; finding 2 (high, shape normal) resolved; finding 3 (medium, implementation_adj) resolved; finding 4 (medium, suicide_rate) resolved; finding 5 (medium, evidence_adj) resolved. Lows 6, 7, 8 are the builder's (all addressed in the model text).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No new high or medium introduced by the round-1 changes. | | | |

## Verification of each round-1 high and medium
- 1 `effect_duration_years`: best 1.5 (0.5-3), explainer works the pooled 3-month effect (0.61/0.52/0.16 with SEs 0.122/0.153/0.120 give 0.41 SD, 83% of the pooled 0.50, so zero at about 1.45 years); low end and high end each have a stated reason. Resolved. Summary and write-up say "about a year and a half" and read the row.
- 2 `sbs_syrians_sd`, `sbs_lebanese_sd`, `sbs_china_sd`: each now has `interval: 0.95` and `shape: normal`. Resolved. The three `_se` rows are still points on the result's path (audit-model lists them); they are the sources' CI widths over 3.92 and carry no judgment, so not a finding.
- 3 `implementation_adj`: 0.95 (0.8-1); the per-protocol argument is gone; the explainer uses the trials' completion and Kaya's engagement, and says the 5% is for joiners who never take a first call. Resolved.
- 4 `suicide_rate`: 0.000183 (0.000119-0.000233). Checked against the WHO GHO API (SDGSUICIDE, SpatialDim IND, 2021): both sexes ages 20-29 = 18.2605, all ages both sexes 13.7 (8.9-17.5); 18.26 × 8.9/13.7 = 11.9 and 18.26 × 17.5/13.7 = 23.3 give the stated range. Label, title, page and quote now describe the age-band rate. Resolved. (The title still names the "Crude suicide rates" indicator page, which is the SDGSUICIDE indicator, so correct.)
- 5 `evidence_adj`: 0.64 (0.4-0.9) = 0.85 internal × 0.75 external. The publication-bias reason is dropped; the internal part is anchored on the trials' Lee bounds and the external part on the Chinese trial's 0.70 ratio to the pool, each part's number stated. Resolved. It remains a judgment, now with named anchors.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `suicide_rate` | https://ghoapi.azureedge.net/api/SDGSUICIDE?$filter=SpatialDim eq 'IND' | verified | 2021 SEX_BTSX AGEGROUP_YEARS20-29 = 18.2605; ALL 13.7 [8.9-17.5]. Males 18.47, females 18.03 at 20-29. |
| `effect_duration_years` inputs | Round-1 verified quotes (PLOS Med, EBMH, Transl Psychiatry) | verified in round 1 | The 3-month figures were not re-fetched; the pooled arithmetic was rechecked: (0.61/0.122² + 0.52/0.153² + 0.16/0.120²) / (1/0.122² + 1/0.153² + 1/0.120²) = 0.41. |

## Drivers
Per audit-model with the blind exclusion: `effect_duration_years` (0.26-1.54), `daly_per_wellby` (the reader's slider), `evidence_adj` (0.49-1.10, judgment with anchors), the shared household spillover and WELLBYs-per-SD-year. Kaya Guides' own 2026 RCT with longer follow-up would improve duration and external validity most. Result is 6.6 times the cause median: the gap comes from the effect size (about 0.5 SD) and the $60 cost per person, both sourced; no row unexplained.
