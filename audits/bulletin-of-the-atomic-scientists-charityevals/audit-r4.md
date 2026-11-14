# Audit: bulletin-of-the-atomic-scientists-charityevals, round 4
Result: 0.01615 daly/$ = 16.15 years of healthy life per 1,000 dollars (combined range 0.76-342); cause median not re-derived in this scoped round (round 3: unchanged peers; 0.0161 sits among catastrophic-risk models as before). Verdict: pass.
Model-sha: ebd5eee9346d920f64a080b09758966403c5ba8c936d906f5086b7724624775e
Scope: scoped verification of the climate-branch change only (commit after round 3). The programme list and year (all work, year to June 2025, $3.5M) are unchanged from round 3.
Mechanical: lint 0/0/0 (audit-model: 0 findings), invariants none, normalization-audit none (every invariant 0 violations; `git checkout -- generated` run afterwards). summaries + simulation-check: stable (5% 0.153, 50% 1, 95% 10.5 x best guess; the single event misses 0% of draws).
Previous round: round 3 had no findings.

## Structure of the change against the template (climate option)
- `climate_cost_share`, `climate_value_per_dollar` (= `#cause:climate`), `climate_uov` (= cost_total x climate_cost_share x climate_value_per_dollar), `w_climate` (= climate_uov x dalys_per_death_value), `uov_bridged` (... + climate_uov) and `outcome_total` (no `dalys_from_tco2e`) are formula-identical to the template's climate option (template rows at lines 643-673, 969-973, 1341-1370). The `#cause:climate` read keeps the site's shared climate figure (normalization.md 2.5, 2.8), so the climate sliders move this model.
- `cost_total` shares sum to 1 through `other_cost_share` as the remainder; the total row includes `climate_cost_share`.
- Leftover rows or resources: none. No row, formula, source or explainer references fuel, methane, smoke, `dalys_from_tco2e`, a top-fund cost per tonne or tonne-years. The Rethink resource remains and is still used by the risk branches. No undefined row references.
- Double counting: the climate average is the mean of climate charities' results, each already net of its own evidence, counterfactual and attribution adjustments. This branch's `climate_evidence_adj` (0.3), `climate_counterfactual_adj` (0.4) and `climate_attribution_share`, and the model's `missing_data_adj`, then apply on top. This is acceptable: the template applies the same branch factors to the other branches' typical-project values, and here they scale the typical climate dollar to journalism in a crowded field (the evidence explainer says so and names the anchor), so they are the Bulletin's relative position, not a repeat of the average's own adjustments. The missing-data step is the shared, intended one for a charity with no measured outcome. Climate adds under 1% of the result, so any residual overlap moves the headline by far less than 1%.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | missing_data_adj explainer | It says the thin outcome data is "on emissions (the climate branch's tonnes are judged)". The climate branch no longer has tonnes. | Row explainer (model line 1326): "...or on emissions (the climate branch's tonnes are judged), so the shared missing-data step applies to every branch". | Replace with "...or on the climate coverage (valued at the site's climate average), so the shared missing-data step applies to every branch". | none |

## Summary and write-up (INV-15)
Consistent with the model. The summary and write-up state the climate coverage is valued at the site's own average for a dollar of climate work and adds almost nothing, the split (22% climate), the headline 16 and the shares (96% / 4% / under 1%), the range 0.8-340 and the reason it sits below the Arms Control Association, the Nuclear Threat Initiative and Ploughshares Fund. The write-up's checking paragraph gives the 16.1485 to 16.1487 move. The write-up's remaining mention of Rethink is for the risk branches, correctly.

## Sources checked
Not repeated: no source or number changed except the removal of the Rethink per-tonne reading; `climate_cost_share` is unchanged from round 3.

## Drivers
Unchanged: the nuclear cut per million (estimate), years counted (judgment), missing-data discount (judgment), discount rate (judgment), nuclear death share (judgment).

Verdict: pass
Model-sha: 5c33d7eed686a4eccda68886c398d622ecf8f27ad711812d0f4911dd3460e8a7

Re-stamped: low and medium findings fixed after the round (wording in the model and write-up only, no formula or number changed).
