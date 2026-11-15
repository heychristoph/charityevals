# Audit round 3 (scoped verification): The Nature Conservancy (charityevals model)

Scope: verify the only change since round 2: the row `fscape_tco2_per_ha_year` now reads the shared fact `@climate.cover_crop_soc_tco2_per_ha_year` instead of holding its own value (an outcome of the Carbon180 audit, one consistent figure for soil carbon under cover crops).

Checked:
- `git diff` of models/climate/the-nature-conservancy-charityevals.json: the row's value, kind and source are replaced by `formula: "@climate.cover_crop_soc_tco2_per_ha_year"` and an explainer that points to the fact. The `beneficiaries` object is also reformatted onto several lines with the same keys and values (0.4129, 0.48, 0.041, 0.0167, 0.0135, 0.0135, 0.0173, 0.0051). Nothing else changed.
- facts/climate.json: the fact has the same best 0.7 and range 0.1–1.5 as the old row, kind estimate, with the same Poeplau & Don quote ("0.32 ± 0.08 Mg ha−1 yr−1 in a mean soil depth of 22 cm") and the Chaplot & Smith (2023) re-analysis in the note; the row's explainer repeats both.
- `npx tsx scripts/check.ts the-nature-conservancy-charityevals`: 0.00033 years of healthy life per $1,000, as before; all models valid.
- The fact `co2_per_tonne_carbon` that was removed in the same change is not referred to by this model or any other file.

Findings: None.

Verdict: pass
Model-sha: a323e5dfeaaf65145f62850235c77fc731ccca1a6541ff3fa698e5199e0841c5
Re-stamped (15 Nov 2026): damage beyond deaths at EPA's 0.6 in the tco2e bridge copy, read through the side-effects weight (2.5, 2.16; mechanical); summary figure updated where it changed
Re-stamped (15 Nov 2026): one explainer clause comparing with another evaluator's removed model dropped (text only; result unchanged)
