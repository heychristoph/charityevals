# Audit: clean-air-task-force-charityevals, round 5 (scoped verification)
Result: 0.01448 tco2e/$ = 0.006591 years of healthy life per 1,000 dollars (combined range 2.4e-4–0.18; the model's own ranges with shared figures at their best 0.0012–0.029); cause median: none. Verdict: pass.
Model-sha: d1e995b1157b340a905e0b0b2b7375eedd15fc22d3af658738c2f008a6d5b367
Scope: only commit 0d56445's change to this model and facts/climate.json: seven judgment rows (eumr_years_until_avoided, eumr_counterfactual_adj, eumr_implementation_adj, usmeth_counterfactual_adj, usmeth_implementation_adj, pwr_counterfactual_adj, pwr_implementation_adj) moved into shared facts and read as `@climate.<fact>` formulas, plus the new fact us_light_medium_vehicle_rule_2024_tco2_2027_2055.
Mechanical: lint none new, invariants none, normalization-audit none (audit-model: 0 findings; check.ts: all models valid)
Previous round: round 4's findings were resolved; nothing reopened.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## What was checked
1. Values and ranges identical. Diffing the seven rows in `git show 0d56445` against the seven new facts: low/best/high are the same for each (6/7/10 years; 0.2/0.5/0.85 and 0.3/0.6/0.9 for the EU regulation; 0.6/0.8/1 and 0.15/0.4/0.7 for the US methane rule; 0.5/0.8/1 and 0.01/0.05/0.2 for the power-plant standards), all `kind: judgment` as before. The formulas point at the right fact in each case (counterfactual to counterfactual, implementation to delivered share, years to years).
2. Explainers. Each model row's explainer keeps the old text and prefixes a sentence naming the shared fact; the dates, figures (54%, 80% x 40%, COM(2026) 569, September 2026 repeal) and ranges quoted in them match the fact values. Fact explainers are the old row text verbatim.
3. Headline unchanged: 0.006591 years per $1,000 (0.01448 tco2e/$), the same as before the commit; the tornado lists the shared `@climate.eu_methane_regulation_counterfactual` with its range, so the sliders still move the model.
4. New facts well-formed. The seven judgment facts have id, label, unit, format, low/best/high, kind, a source (charityevals' own judgment, shared by the models counting the win, with a note that the value moved unchanged on 14 November 2026) and an explainer. The vehicle-standards fact is `kind: estimate`, a single value 7.2e9 t CO2 (a point value, like three other estimate facts in the file), sourced to the NACAA summary of EPA's final rule with a page, a note giving the 7.2 billion figure and EPA's own "more than 7 billion", and an explainer. It is not read by this model (only by the Environmental Defense Fund model), so it has no effect here.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| us_light_medium_vehicle_rule_2024_tco2_2027_2055 | NACAA summary / EPA release (cited in the fact) | not re-fetched | Not used by this model; belongs to the Environmental Defense Fund model's audit. |

## Drivers
Unchanged from round 4: win_years_counted, missing_data_discount, the advocacy share of policy wins, next-dollar share, deaths per tCO2e and methane ozone deaths.
