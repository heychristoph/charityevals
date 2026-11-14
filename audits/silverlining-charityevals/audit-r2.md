# Audit: silverlining-charityevals, round 2
Result: 1.115 tco2e/$ = 0.137 years of healthy life per 1,000 dollars (combined range 0.0013–14.2 tco2e/$, about 0.00016–1.7 years per $1,000); cause median 0.00193 (×71). Verdict: pass.
Model-sha: aeb36abd44a83426f4e94f357198a932a5e69ecc5225dba26f2bafd5586cc0ba
Scope: SilverLining's work over 2019-2024, against the average real spending of those years (2024: programme $5,324,533 of total $6,497,308; Form 990 for 2024, audited). The model now has four branches: research funded or done, engagement (the stakeholder-engagement line plus the engagement grants abroad, 36% of grants by 2024's Schedule F), other funders' money directed, and the NOAA Earth's Radiation Budget line. Recomputed here, their shares of the result are 29% / 23% / 28% / 20%, matching the write-up. Policy is covered by the federal line and the 15% add-on. "Other programmes" ($889,390, no description) has no branch of its own and sits in the base of `res_inhouse_share` (finding 3). charities/silverlining.json `spending` and its one line match the return. The c4's spending stays out of cost.
Mechanical: lint 0 high / 1 medium (outlier: more than 10× its 7 tco2e peers; the summary gives the INV-15 reason, and normalization-audit's INV-15 passes) / 1 low (spread, stated in the summary). Invariants: none. normalization-audit: no violation for any model. check.ts: all models valid. Simulation stable: 5% 0, 50% 0, 95% 17.7× the best guess. Its one single event misses 68.2% of draws, as the summary's "near zero at the default risk setting" says. generated/ was restored after normalization-audit and summaries. The merge of main touched no file this model reads: facts/next_dollar.json only added other charities' entries, `silverlining` is unchanged, and facts/climate.json and the template are unchanged.
Previous round:
- 1 resolved: `deaths_earlier_years` and `timing_adj` are on every branch, and `years_until_avoided` is 0. The value is wrong because round 1's own anchor was miscomputed (finding 1).
- 2 resolved: `single_event`; the non-use claim is dropped from the explainer and the write-up.
- 3 resolved: `pol_p_success` reads `@climate.advocacy_share_of_policy_win`; `pol_group_share` is 60% among advocates.
- 4 resolved: `noaa_srm_share` is a judgment, 55% (35-100%). The tracker data was not downloaded, which the fix allowed for now. The anchor quote checks out.
- 5 resolved: `c3_share_of_group` = 77%.
- 6 resolved: `eng_` branch; engagement grants are out of `res_grants_period`. "Other programmes" went to the in-house remainder rather than the engagement branch (finding 3).
- 7 resolved: summary and write-up figures match the live result.
- 8 resolved: 15% (5-50%).
- 9 resolved: relabelled; the explainer names the denominator.
- 10 resolved: observed; the AIP quote checks out.
- 11 resolved: model and write-up.
- 12 resolved: `dir_federal_share` 10% (2-30%).
- 13 not resolved (finding 4).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | missing-adjustment | `deaths_earlier_years`, `timing_adj`, `tco2e_per_field_dollar` explainer, write-up | 24 years overstates how much sooner the cooling's heat deaths come. The figure came from round 1's anchor, which was miscomputed. A 50-year use starting 18.5 years after the period's middle has a discount-weighted middle of 39.5 years at 4%, not 36: the stream is worth 0.212 of deaths today, and 1.04^-39.5 = 0.212, while 1.04^-36 = 0.244. Against the conversion's 1.04^-60 = 0.0951 the exact correction is 2.23, i.e. 20.5 years sooner. 1.04^24 = 2.56 is 15% too high. The same holds at other rates: 21 years tracks the exact ratio within 5% at every rate (2%: exact 1.44, 1.02^21 1.52, 1.02^24 1.61; 1%: 1.19 / 1.23 / 1.27). The range's ends are also off. A use starting in 2055 gives 5.5 years, not 15, and one starting in 2032 gives 28.5, not 35. A 20-year use gives 32 and a 100-year use 6. | Computed here (flat stream over the use, discounted at `$discount_rate`, against `(1 + r)^-60`): 4% 20.5 years; start 2032 28.5; start 2055 5.5; 20-year use 32; 100-year use 6. | Set `deaths_earlier_years` to 21 (6 to 29). Explainer: "a 50-year use starting about 18 years after the period's middle has its discount-weighted middle about 39 years out at 4% (worth 0.21 of deaths today): 21 years sooner than the conversion's 60. Low end a use starting in the 2050s or lasting a century, high end one starting in the early 2030s." `timing_adj` explainer: "2.3 at 4%, 1.2 at 1%, nearly 1 at 0.1%". `tco2e_per_field_dollar` explainer: "×2.3, about 9 tonnes a dollar, 11 cents a tonne"; after adjustments about $1.00 a tonne. Summary: "about 1.0 tonne ... about 0.12 years". Write-up: "about 21 years sooner", "4 tonnes, or 9 after the timing correction", and "raised the result about 2.3-fold" in How this model was checked. | −11% (0.137 → 0.122) |
| 2 | low | double-counting | `years_until_avoided` | Its range runs to 15 for "a use that starts late in the century", but when the use starts is now `deaths_earlier_years`' question: that row's low end is a late start. With both at their late ends, a late start is discounted twice (Convention 5, one question per row). | Explainers of both rows. | Set `years_until_avoided` to 0 (0 to 2). Explainer: "the wait between the period's work and the decision it informs; when the use starts, and so when its deaths come, is in deaths_earlier_years." | none at the best guess; narrows the simulated spread a little |
| 3 | low | presentation | `res_inhouse_share` | "Other programmes" ($889,390 in 2024, no description on the return) is named in the write-up but not in any branch. It sits in the base of `res_inhouse_share` (2024 spending outside grants and engagement: $3.5M), where 20% counts as in-house science and the rest only through the policy wins. That is a defensible reading of an undescribed line, but the model never says so. | Form 990 for 2024 Part III 4d; `res_inhouse_dollars` formula. | Add to `res_inhouse_share`'s explainer: "the base is the policy programme ($1.44M), other programmes ($0.89M, undescribed) and overhead ($1.17M); the chief scientist's pay and research coordination are in it." Add the same clause to the write-up's "Research it funds or does" bullet. | none |
| 4 | low | source | `@climate.heat_mcc_emission_year`, `@climate.heat_mcc_end_year` | Still `observed` with a page and no quote. Here too the Rethink Priorities PDF is Skia-rendered: neither zlib stream extraction nor WebFetch returns its text, and pdftoppm is not installed for the Read tool. The years agree with the audited `deaths_per_tco2e_heat` explainer. | facts/climate.json; the PDF at the cited URL. | Install poppler (`brew install poppler`), Read pp. 16-17 of the PDF, and add the sentence that gives the 2020 pulse and the 2300 horizon as `quote` on both facts. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `noaa_fy22` | aip.org/fyi/2023/fy23-budget-outcomes-national-oceanic-and-atmospheric-administration | verified | "NOAA is directed to spend $9.5 million on research ... a $500,000 increase": FY22 $9.0M |
| `noaa_srm_share` anchor | srm360.org/article/srm-funding-overview/ | verified | "The US ($39.0m) will be 3rd largest"; the figure is the total given through 2030, so the tracker counts at most about 95% of ERB's FY20-24 $41M, and less once FY25 onward and other agencies are included. 55% (35-100%) is within that. |
| `pol_group_share` (E&E News, 2 March 2023) | eenews.net/articles/blocking-sun-rays-finds-support-in-the-senate/ | verified (search excerpt) | Only two organisations disclosed lobbying on solar geoengineering in a decade: Carnegie Mellon in 2013 and SilverLining in 2018. Round 1 could not reach it. |
| `pol_group_share` (MIT Technology Review) | technologyreview.com, 20 Dec 2019 | verified in round 1 | wording now matches the context (McNerney's bill for a formal programme) |
| `policy_programme_2024`, `engagement_line_2024`, `grants_2024`, `engagement_grants_2024` | IRS TEOS XML 2025_TEOS_XML_11C | verified in round 1's reading of the same return | 1,441,366; 1,109,970; 1,883,807; Schedule F 687,149 (36%) |
| `@climate.heat_mcc_*` | rethinkpriorities.org Climate x GHD PDF | unreachable (text not extractable) | finding 4 |
| `@next_dollar.silverlining` | 990 for 2024 | unchanged since round 1 (verified then) | 50% (25-80%); not touched by the merge |
| Others (cost, period, NOAA FY20/21/23, field funding, survey, ARISE-SAI, TCRE) | as in round 1 | unchanged rows, verified in round 1 | |

## Drivers
- Top inputs:
  - `$discount_rate` (shared). Both the conversion and `timing_adj` carry it.
  - `$climate_heat_death_delay` (shared). It moves this model as it moves every tonne, though the cooling's deaths are timed by the model's own rows. INV-2b keeps any row from reading the delay, so the fixed `deaths_earlier_years` is the site's one way.
  - `decision_value_share`: a judgment with no reference class and still the largest own driver.
  - `$deaths_per_tco2e` (shared) and `$missing_data_discount`.
  - `cooling_c`, `p_deployment` and `deployment_years`: judgments anchored on ARISE-SAI, Table SPM.1 and the 2025 survey.
- `deaths_earlier_years` is a typed judgment, so it does not move with `deployment_years` or `field_years_to_decision` in the simulation. A long use doubles the tonnes but cuts the timing gain to about 6 years, so the tornado overstates `deployment_years`' upside. Finding 1's range covers this only roughly.
- What would most improve the model:
  - An anchor for `decision_value_share`: the value-of-information literature on solar geoengineering, or an elicitation of how research changes deployment outcomes.
  - The tracker's NOAA data, for `noaa_srm_share`.
  - SilverLining's breakdown of the $15M it directed, for `dir_federal_share`.
