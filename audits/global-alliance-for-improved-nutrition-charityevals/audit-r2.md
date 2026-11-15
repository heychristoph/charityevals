# Audit: global-alliance-for-improved-nutrition-charityevals, round 2 (verification)
Result: 0.001440 uov/$ = 0.720 years of healthy life per 1,000 dollars (combined range 0.088–5.86); cause median 0.0687 (x10.5). Verdict: pass (no high findings, 0 medium, 1 low; the far-above medium is explained below).
Model-sha: 324dd2bbd04be88248d5fb70bbe1fb130d53e3e3d37022e18a457bc257aaa30e
Scope: unchanged from round 1 (all four programme lines, year to 30 June 2025, 61.6 million programme costs); only the round-1 fixes and the rows they touched were checked.
Mechanical: lint 0 high / 1 medium (far-above, explained below) / 2 low (estimate-basis, spread; both as in round 1); invariants none; check.ts "all models valid"; normalization-audit skipped in this sandbox (no violation reported for the model).
Previous round: 9 findings, all resolved (table below).

| # | Round-1 finding | Status | Check |
|---|---|---|---|
| 1 | split missing-data step | resolved | `ff_missing_data_adj` = `$missing_data_discount`, read only by `uov_income` (via `ff_total_adj = ff_base_adj * ff_missing_data_adj`) and the canonical average; `ff_iron_missing_data_adj` = 1 in `ff_iron_total_adj`, read by the ff term of `dalys_bridged`. Explainers name the reach audit and Keats 2019 (measured). `ff_base_adj` holds the common factors, none dropped or doubled. |
| 2 | supplement shares on the wrong terms | resolved | `unmodelled_health_adj` = treatment costs + rebound (0) + other; `unmodelled_income_adj` = investment of income + other; both from the shared figures; `unmodelled_benefits_adj` is the value-weighted average over (income) and (deaths, stillbirths, daly) terms, and `outcome_total` multiplies the four by (1 + it) with `uov_morbidity` added outside, as before. Sliders still move the model. Weights sum to 1; no term counted twice. |
| 3 | attribution anchor and tie to spend | resolved | `ff_attribution_share = ff_spend / (ff_spend*(1+ff_others_vs_gain) + ff_people*ff_company_cost_per_person)`; at the defaults 15.2 / (30.4 + 124) = 9.8%, so it follows `ff_share`. `ff_company_cost_per_person` (0.05-0.12, best 0.08) is `estimate` with the Horton, Mannar and Wesley 2008 URL, p. 6 and quote; `ff_others_vs_gain` a ranged judgment with its reference class. The company-cost sum is not in the shared attribution rows twice (companies' cost enters only here). |
| 4 | external validity double count | resolved | explainer limited to new vs established programmes; 0.8 (0.6-0.95); no non-deficient-people sentence. |
| 5 | `ff_childhood_years` kind | resolved | now `judgment`, anchored on GiveWell's 15 (Iodine!B17), range 12-18 stated as ours. |
| 6 | share overlap | resolved | `ff_iron_share` explainer states the shares count people once and can overlap above 1. (`ff_iodine_share` explainer is silent on it; harmless, the iron row carries it.) |
| 7 | N3F reach discount | resolved | new `vc_reach_share = (vc_consumers*vc_implementation_adj + n3f_consumers)/vc_people`, used in `vc_total_adj`; `vc_implementation_adj` no longer in that product (no double). |
| 8 | policy gift wait | resolved | `pol_gift_wait = (1+$discount_rate)^-gift_to_grant_years` in `pol_total_adj`; the plan-to-effect wait stays only in `pol_years_counted`; no double discount. |
| 9 | reach audit in text | resolved | `ff_people` explainer and the write-up (fortification bullet) mention the audit of the reach method. |

## New findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `ff_company_cost_per_person` | The Copenhagen Consensus PDF was retrieved but its text is compressed and could not be read here, so the quote "approximately $0.05/person/year for iodine and $0.12/person/year for iron ..." on p. 6 is not confirmed by this audit (round 1 cited the same 5-12 cents figure from the paper). | PDF binary only. | A reader or the builder confirms the quote and page against the PDF; no change to the model unless it differs. | none unless the figure differs (about +-5% on attribution) |

## Consistency checks
- Summary and write-up headline (0.7; "the anaemia effect ... comes from evaluations of real fortification programmes"; "everything but the anaemia effect is discounted for missing data") match the model's structure and result (0.720). The write-up's closing round-1 paragraph lists the actual fixes; no peer comparison in site text.
- No stale numbers found (0.585 does not appear).

## Far-above (10.5x the median of 113 global-health models)
Checked scope, reach and persistence; the gap is supported, not an error, so it is noted here only.
- Scope: all four programmes, the audited year, programme costs 61.6 million; the result is a past average scaled by the next-dollar figure (0.6).
- Reach: the fortification branch alone counts 1.55 billion people a year (about 2 billion with the other branches), against a cost of 65 million: roughly 3 cents of spending per person reached. Per-person benefits are small (iodine: IQ 0.25 SD spread over 15 childhood years; iron: a 34% fall in anaemia YLDs averaged over everyone) but multiplied by that reach they dominate; most models in the cause treat thousands to millions.
- Persistence: iodine earnings run over a 40-year annuity at the shared discount rate after a 10-year wait, and are cut by the shared missing-data step (0.5), counterfactual (25%), attribution (about 10%), implementation (75%), internal/external validity, lasting share. Net adjustment on the fortification terms is about 0.03, so the high headline comes from reach times a cheap, thoroughly discounted effect, not from a loose factor.
- Median: the cause median is pulled down by advocacy and large-organisation models with diffuse attribution. The same programme's GiveWell import is about 9x higher still, the difference being the credit rule (2.5% vs 50%), a difference of rule.
- Sensitivity: the top swings (counterfactual 0.1-0.5, discount rate, missing-data step, next dollar) each move the result within 0.3-1.6, so the level rests on shared sliders and one judgment, all with ranges; the combined range 0.09-5.9 is stated in the summary.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| ff_company_cost_per_person | copenhagenconsensus.com ... bpp_fortification.pdf, p. 6 | unreadable | see new finding 1 |
| all others | as in round 1 | unchanged | not re-checked (only changed rows in scope) |

## Drivers
1. `ff_counterfactual_adj` (judgment, 0.1-0.5).
2. `$discount_rate` and `$uov_per_daly` (shared).
3. `$missing_data_discount` (shared; now on the iodine term only).
4. Next-dollar figure (estimate from the accounts).
5. `ff_share`, `ff_company_cost_per_person` (attribution now follows these).

Verdict: pass (no high findings).

Builder's response to the low finding: the quote was checked against the PDF's extracted text (stdlib extractor): page 6 reads "approximately $0.05/person/year for iodine and $0.12/person/year for iron fortification of wheat and maize flour", as cited; no model change.
