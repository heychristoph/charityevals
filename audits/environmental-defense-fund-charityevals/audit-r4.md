Result: 0.004353 tco2e/$ = 0.001846 years of healthy life per 1,000 dollars (combined range 7.4e-5–0.046), unchanged from round 3. Verdict: pass.
Scope: scoped verification of the move of five judgment rows into shared facts (facts/climate.json) so union-of-concerned-scientists-charityevals-climate reads the same figures; unchanged rows not re-audited.
Mechanical: audit-model.ts 0 findings; check.ts all valid.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Checked
- Values and ranges: the four fact values equal the old rows' exactly (vehicle counterfactual 0.4/0.7/0.9; vehicle delivered 0.01/0.05/0.2; IRA counterfactual 0.6/0.8/1.0; IRA delivered 0.15/0.35/0.6) and the smoke factor equals the removed `veh_smoke_factor` (0.02/0.04/0.1).
- Explainers: the facts' explainers are the old rows' explainers word for word.
- Sources: the two delivered facts carry the old rows' sources (Jones Day 2026; Carbon Brief 2025) with the same notes and retrieved date. The two counterfactual rows had no source before; the facts add one (the NACAA summary of EPA's final rule; REPEAT's projection) with a note, marked as charityevals' judgment. The smoke factor has EPA's 2024 rule as source. All five have kind `judgment` and a retrieved date.
- Wiring: the four `_adj` rows are now formula `@climate.<id>` with an explainer naming the shared figure; `veh_smoke_factor` is removed with no remaining reference (grep of models/ and facts/ is empty); `fuel_smoke_factor` reads `@climate.us_vehicle_smoke_factor` in the same weighted formula, and its explainer is updated.
- Headline: audit-model.ts gives 0.004353 tco2e/$ = 0.001846 years of healthy life per $1,000, equal to round 3 and to the pre-change file; combined range 7.401e-5–0.04602, same as round 3.
- Lint/INV: 0 findings now. The pre-change file run against the new facts shows four INV-4 findings (literal copies of the facts), which this change resolves; none are new.

## Findings settled
None open.

## Sources checked
No new sources in this model; the three added fact sources (counterfactual rows, smoke factor) are judgment backing and were read as text only, not re-fetched.

Verdict: **pass**
Model-sha: 485b3fba5685a56fb08702f75ac3d85f233f74feb9bcea365d0543da02685344
