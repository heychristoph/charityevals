# Audit: feeding-america-charityevals, round 3 (scoped verification)

Result: 1.830e-5 daly/$ = 0.01830 years of healthy life per $1,000 (combined range 0.0036–0.094); median of the 84 global-health models 0.0717 (×0.255). Verdict: pass.

## Scope

Only the changes of commit 9e17551 to models/global-health/feeding-america-charityevals.json and writeups/feeding-america-charityevals.md, plus the shared rule they read (assumptions/default.json units.tco2e.to_common, facts/climate.json methane rows). Not a full audit; rounds 1 and 2 stand.

## What was checked

1. **methane_share = 0.95 (0.85 to 1), judgment.** Reasonable. The landfill row is "tonnes of CO2e from landfilling a tonne of food, net of gas capture" (EPA WARM), and in WARM landfilled food's emissions are methane; biogenic CO2 is not counted. The 0.85 low end allows for hauling fuel and the power credited to captured gas. The explainer names the anchor (EPA WARM) and the range. The value is ranged, `kind: judgment`, no source block required. Effect on the result: the landfill branch is a very small part of the result, and the headline is unchanged to four digits (0.01830 before and after; round 2 printed 0.01830).
2. **Bridge row dalys_from_tco2e.** Compared by script against units.tco2e.to_common in assumptions/default.json: the formula equals `tco2e_bridged * (<to_common>) / ($uov_per_daly)` exactly, character for character. It reads methane_share, air_pollution_weight and extra_deaths_per_tco2e, which are all present as model rows (extra_deaths_per_tco2e 0, air_pollution_weight 0).
3. **Removed rows fuel_share, fuel_smoke_factor.** No formula in the model reads them (script scan of every row formula; grep of model and write-up finds no mention). air_pollution_weight is now formula `0` with an explainer saying why (landfill burns no fuel; methane's ozone goes through methane_share). Placeholder scan of the whole model JSON for example.org, TEMPLATE, REPLACE: no match.
4. **Result and figures.** `npx tsx scripts/headlines.ts feeding-america-charityevals` prints 0.0183031. The write-up's live headline figure (data-figure) renders as 0.018 and the model summary's figures match; the write-up's landfill line now says "nearly all methane", consistent with the row.
5. **Mechanical.** `scripts/audit-model.ts`: 1 finding, low (`pounds_per_meal` unused, unchanged from round 2; it says so in its explainer). No invariant violation. `scripts/check.ts feeding-america-charityevals`: all models valid. Result is 0.255 of the cause median, within 0.1x to 10x.

## Previous round

Round 2 findings: all low or resolved; the round-2 low about `fuel_share` having no range (a structural 0 with placeholder source) is now resolved by removing the row.

## Findings

None.

Verdict: pass
Model-sha: e5bc38dfbdf6c4a4b5ae9fa7b81c914826945ed8712b86a228209d9b7ca7d441
Rules: 0.3.10

Re-stamped (15 Nov 2026): one consumption scale for US public money (normalization.md 2.14); 0.0183 → 0.0169.
Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (15 Nov 2026): the retail-to-wholesale ratio read from the shared fact; no value changed; 0.0169 → 0.0169.
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)
Re-stamped (15 Nov 2026): damage beyond deaths at EPA's 0.6 in the tco2e bridge copy, read through the side-effects weight (2.5, 2.16; mechanical); summary figure updated where it changed

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 1a9667aa.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): wording: wrong prose placeholders restored to the typed text or pointed at the evaluator view, and typed results in the summary made placeholders or recomputed at the 30% mobiliser share (no value moves). Mechanical: headline unchanged, against bc9e3979.
