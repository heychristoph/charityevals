# Audit: hias-charityevals-international, round 3 (scoped)
Result: 4.456e-5 daly/$ = 0.0446 years of healthy life per 1,000 dollars (combined range 0.0104-0.190), down 7% from round 2 (0.0478), as expected from `lac_value_ratio` and `cp_direct_share`. Verdict: pass.
Model-sha: 09e47f748437ffd342936b723b59fa66d12f6ea96b46c1f0d2cf84abad07c9fa
Scope: only the round-2 findings and the rows changed since 4a1aefd. Mechanical: audit-model 0 findings.

## Round-2 findings
| # | Status | Check |
|---|---|---|
| N1 | resolved (residual R1) | `rsc_people` explainer now says it is a judgment, that HIAS publishes no count and none was found, gives the basis (Vienna RSC, Lautenberg caseload, four months of October 2024-January 2025) and the arithmetic of the range (400 = about 1,200 a year x 4/12; 100 = a few hundred a year; 1,500 = pre-2017 pace); the value and range are unchanged. |
| N2 | resolved | Parenthesis removed from cva/mh/gbv/cp/leg/eco; `rsc_missing_data_adj` now says the departures are our judgment with no HIAS count. All seven read `$missing_data_discount`. |
| N3 | resolved | `lac_value_ratio` 1.5 (1-3, judgment). `value_chad = average / (s + (1-s) r)` and `value_lac = value_chad r` keep the cash total unchanged (s*vc + (1-s)*vc*r = average); `ln_gain_per_person` reads both at their own consumption. Effect about -7% alone, within the predicted range. |
| N4 | resolved | `cp_direct_share` 0.6 (0.3-0.9, judgment) in `cp_wellbys_per_child`; same convention as mh/gbv. |
| N5 | resolved | Verified on PubMed (PMID 29530422, Lancet Glob Health 2018;6(4):e390-e400, DOI 10.1016/S2214-109X(18)30046-9): IPD meta-analysis of 3,143 children in 11 RCTs, PTSD SMD -0.33 (95% CI -0.52 to -0.14); non-displaced -0.40, so "less for displaced children" holds. The explainer's figures match. |
| N6 | resolved | Note now says the weights are our judgment of spending and result, with the reasons; the shares are unchanged and sum to 1. |
| N7 | resolved | writeups/hias-charityevals.md names `audits/hias-charityevals/`, `audits/hias-charityevals-international/` and `audits/hias-charityevals-advocacy/`. |

## New findings
| # | Severity | Category | Row | Finding | Fix | Effect |
|---|---|---|---|---|---|---|
| R1 | low | source | `rsc_people` | The basis ("a few thousand a year before 2017 and far fewer since") is uncited; it is now openly labelled a judgment, which is acceptable. | Optionally cite the Refugee Processing Center (WRAPS) Iranian arrivals for fiscal 2016 and 2024 if a later pass has the data. | -3% to +8% |

No high or medium findings. No other row changed.

**PASS**
Model-sha: 09e47f748437ffd342936b723b59fa66d12f6ea96b46c1f0d2cf84abad07c9fa
