# Audit: novah-charityevals, round 2
Result: 1.270e-4 uov/$ = 0.0635 years of healthy life per 1,000 dollars (combined range 0.0071–0.5677; joint low–high of the model's own ranges 8.73e-5–2.957); cause median about 0.117 (×0.54, from round 1's median). Verdict: pass.
Model-sha: 7b06a540a61293559e64ac41abf629a84a7a2095745bc48be1908a8e1aff3111
Rules: 0.3.5
Scope: unchanged from round 1 (the Twubakane radio drama, all 2025 spending of $173,600, 2025's reach). Not re-audited; round 2 is a scoped verification.
Preflight: pass (scratchpad/build/preflight-novah-r2.txt). Two lows, generated/distributions.json and generated/usage.json out of date, are refreshed by `npx tsx scripts/summaries.ts` before commit.
Previous round: 
- 1 (high, missing data): resolved. `missing_data_adj` reads `$missing_data_discount`; the explainer says thin; summary and write-up say so.
- 2 (high, dose cut twice): resolved. `implementation_adj` is 1 (Convention 5, no dose-response measured); `ipv_reduction` is relabelled and re-explained as the effect among couples with an active listener at the dose they got (25%, 5–50%), with the Uganda all-women and attender figures as anchors.
- 3 (high, treatment costs): resolved. `treatment_costs_share` reads `@givewell_shared.treatment_costs_averted`.
- 4 (high, AIM idea-stage model still shown): out of scope for this model's audit, deferred to the site owner by explicit written instruction (models/grants/ambitious-impact/, inventory/ambitious-impact-models.json and scripts/aim-theoretical.py are not to be touched by the builder). Not an open finding against novah-charityevals. The ambitious-impact-charityevals `value_destinations` now reads `#charityevals:novah`, as round 1 expected.
- 5 (medium, ever-partnered share): resolved. Rwanda's 59.6% is replaced by the ranged judgment `ever_partnered_share_region` 72% (60–82%), anchored on the region's DHS marriage patterns and the wider "ever-partnered" definition; the Rwanda fact is removed from facts/ipv.json (the explainer keeps the DHS figure as the low end).
- 6 (medium, place): resolved. `rwanda_burden_vs_region` 0.75 (0.55–1), a judgment anchored on Rwanda's HIV prevalence against the region's, multiplies both `dalys_per_ipv_year` and `deaths_per_ipv_year`.
- 7 (medium, burden_per_year_adj): resolved. Re-anchored on harm following each year of exposure (HIV, Devries et al. 2013), 0.75 (0.4–1), health only; fear and pain are counted once, in `other_unmodelled_share`, and both explainers say so.
- 8 (medium, listener range): resolved. `active_listeners` is an estimate 16,500 / 27,000 / 32,600, interval 0.95, with the binomial reasoning in the explainer.
- Lows 9–14: applied (counterfactual_adj 1; Uganda caveats in both validity explainers, internal low end 0.3; Sardinha Table 4; baseline_ipv explainer notes current-union and North; pay wording; the 5% pause sentence is gone from the write-up). Lows never re-open a round.

New high or medium introduced by the changes: none found. Checked: the chain still reads every template row and shared figure (`@givewell_shared.*`, `@moral_weights.*`, `@staff_pay.gap_research_policy`, `$discount_rate`, `$life_value_multiplier`, `$missing_data_discount`); `dalys_per_ipv_year` and `deaths_per_ipv_year` both carry `rwanda_burden_vs_region` and `burden_per_year_adj` is applied once to deaths and illness; `illness_dalys_per_ipv_year` subtracts the deaths' YLL from the same scaled DALY rate, so the place factor is consistent; the write-up has no comparison with other charities or a median, and its result is live (`{{result}}`); the one "5%" in it is the effect's low end. The rows added (`ever_partnered_share_region`, `rwanda_burden_vs_region`) are ranged judgments naming their anchors.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 15 | low | normalization | ever_partnered_share_region | A site-wide ever-partnered share for Eastern sub-Saharan Africa would be a shared estimate; it is a model-local judgment here (acceptable: ranged, anchored). Not blocking. | Model row. | Optionally add `@ipv.ever_partnered_share_women_15_49_eastern_ssa` from DHS StatCompiler later and read it here. | none at present |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| active_listeners | evaluation and activity report (round 1) | verified | 31 of 500 active listeners, 27,000 reported; range is arithmetic from that |
| @ipv.past_year_prevalence_eastern_ssa | PMC8885817 | verified (round 1) | page now "Table 4, regional estimates"; quote unchanged |
| facts/ipv.json | | unchanged otherwise | only the Rwanda ever-married fact removed and the page field corrected; no new sourced numbers were added by the builder to fetch |

No new observed or estimate input was added in the changed rows (the two new rows are judgments), so no new fetch was needed; the round-1 fetches stand.

## Drivers
- ipv_reduction (judgment, 0.05–0.5) and missing_data_discount (shared): the effect is unmeasured for this drama; the 2026 trial will settle both.
- years_of_coverage (judgment, 0.4–2): eight months of follow-up at most.
- internal_validity_adj (judgment) and burden_per_year_adj (judgment, now anchored).
- @ipv.daly_rate_women_15_49_eastern_ssa (GBD estimate) with rwanda_burden_vs_region (judgment): a Rwanda-specific GBD figure would replace the place judgment when a public copy exists.
