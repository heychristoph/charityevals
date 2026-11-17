# Audit: good-food-institute-charityevals, round 4
Result: 0.001572 years of healthy life per 1,000 dollars (14.29 chicken pain days per dollar). Verdict: pass.
Scope: verification of the rows changed after round 3 (seafood meals in the market base, the shared quote and note, summaries, write-up). Not a full re-audit.
Mechanical: audit-model.ts 0 findings, no invariant violations; no file under generated/ changed.

Previous round (round 3 findings):
1. (low, quote) resolved: the quote on `alt_protein_meal_vs_reference` now reads "The three largest animal-type subcategories—plant-based beef, chicken, and pork—accounted for 86 percent of total plant-based meat category sales in 2025." The page at gfi.org/resource/analyzing-plant-based-meat-and-seafood-sales/ was fetched and carries that sentence (the fetch tool returned the opening and confirmed the rest). The note now says the mix is from GFI's shares of sales, taken as a stand-in for weight.
2. (medium, seafood meal count) resolved: `seafood_tonnes` is gone from the model (no remaining reader in the model, facts or write-up; the FAO fisheries source line is out of the write-up). `world_meat_meals` = land meat tonnes / 0.15 kg = 2.52e12, land meat only. `meat_meals_replaced_per_year` = 2.52e12 × 3% / (1 − 0.03) = 7.80e10 (recomputed from the run), so seafood analogue meals are `seafood_share` (3%) of all meat and seafood analogue meals, the same mix the weights use. `alt_share_gain` label and explainer say "meat market"; the `world_meat_meals` label says "Meat meals". `seafood_per_meal_kg` stays, used for seafood's emissions and health weighting only, and its explainer says so.
3. (low, split) resolved: see check 4 below.

Checks: (3) summary, model summary and write-up headline read 0.0016 against the computed 0.001572; the write-up's "gain" bullet matches the formulas (land meat only, seafood added at the 3% share, dairy 0.4 and egg 0.1 per meal unchanged) and the checked-by paragraph describes round 3 and this change. (4) Split of `ced_per_donor_dollar` (14.29): `ced_from_tco2e` 8.99 = 62.9%, `ced_from_daly` 5.18 = 36.2%, `ced_fish + ced_chicken + ced_pig` 0.121 = 0.84%. The summary's "nearly two thirds / about a third / under one percent" holds. (5) audit-model.ts: 0 findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | No new findings in the changed rows. | | | |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `alt_protein_meal_vs_reference` | gfi.org/resource/analyzing-plant-based-meat-and-seafood-sales/ | page reachable, quote present | the 86% sentence matches; share of sales, now stated as a stand-in for weight |

Verdict: pass (no high findings; no medium; no low).
Model-sha: 9cf0fab5cddc7921829b2da84d344b63050d21e4a3ce613dcc60c974d31b06fe
Re-stamped (15 Nov 2026): damage beyond deaths at EPA's 0.6 in the tco2e bridge copy, read through the side-effects weight (2.5, 2.16; mechanical); summary figure updated where it changed

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 1a9667aa.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against cc9a04dd.
