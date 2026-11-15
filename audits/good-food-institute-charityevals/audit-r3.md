# Audit: good-food-institute-charityevals, round 3
Result: 0.002024 years of healthy life per 1,000 dollars (cause median 4.87e-4, ×4.2). Verdict: pass.
Model-sha: c22c9bf688a0af203df1281b16c628dc20679eb72883a778381ed2b6a510e962
Scope: verification of the rows changed after round 2 (seafood, dairy and egg rows, the shared alt-protein facts, species routing, leverage, explainers, summaries). Not a full re-audit.
Mechanical: audit-model.ts 0 findings; no file under generated/ changed.
Previous round (round 2 findings):
1. (medium, seafood) resolved: `seafood_per_meal_kg` 0.2, `seafood_net_kg_co2e_per_kg` 4 (Parker et al. 2018 named, not fetched), `seafood_health_dalys_per_kg` -5e-6, all weighted by `seafood_share` (shared 3%); the red-meat health figure now applies to land meat only; "seafood is near that per kg" is gone. A new consistency question: finding 2.
2. (medium, dairy and eggs) resolved: own SAD facts (egg 0.16, dairy 0.002), eggs to chickens, dairy to mammals counted as pigs, own emissions (dairy 0.55, eggs 0.45). Egg arithmetic reproduces (0.7 × 28.94 + 0.3 × 11.45 = 23.7 per hen-year; /150 = 0.158). Dairy: 15 SADs per cow-year / 10,000 = 0.0015, stated 0.002 "with calves", a judgment.
3. (medium, leverage) resolved: re-anchored on Moretti, Steinwender and Van Reenen; arithmetic 0.5 × 1.5 = 0.75, 1.75, 0.6 × 1.75 + 0.4 × 0.7 = 1.33 checks. The paper's elasticity and the $1.1bn private-to-public ratio were not re-fetched.
4. (low, SOFIA quote) resolved: verbatim FAO newsroom sentences.
5. (low, EPA) resolved: 192.6 + 82 + 120 = 395, about 400 Mt; table figures not re-fetched.
6. (low, denominator clause) resolved: no longer contradicts.
7. (low, summaries) resolved: model, charity and write-up summaries name seafood, milk and eggs; write-up says $22 billion.

Checks: derivation in `alt_protein_meal_vs_reference` recomputed: SADs per tonne relative to the 537 Mt average: fish 3.00, birds 0.233, mammals 0.0314; mix 0.03/0.35/0.62 gives 0.191 (stated 0.19); shares 0.471/0.426/0.102 (stated 0.47/0.43/0.10); 1% seafood 0.13 and 10% seafood 0.40 (stated 0.13, 0.39). Species rows: `sads_per_donor_dollar` = meat + egg + dairy SADs, and fish, chicken and pig rows are meat_sads_share × (0.47, 0.43, 0.10) plus egg_sads_share (chicken) and dairy_sads_share (pig); the three shares sum to 1, so the rows sum to the whole, no double counting. tco2e per meal weights land meat and seafood by `seafood_share`, dairy and egg tonnes added once; DALYs per meal likewise, none for dairy and eggs.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `alt_protein_meal_vs_reference` quote | The quote is not on the page verbatim. The page reads: "The three largest animal-type subcategories—plant-based beef, chicken, and pork—accounted for 86 percent of total plant-based meat category sales in 2025." The figure is a share of sales (US retail), while the note calls the mix "by weight". | Fetched https://gfi.org/resource/analyzing-plant-based-meat-and-seafood-sales/; the page also says plant-based beef holds about a third of analogs in foodservice and gives no seafood share. | Use the page's sentence as the quote, and say "by sales, taken as by weight". | none |
| 2 | medium | consistency | `world_meat_meals`, `seafood_share` | The market base counts seafood at 165 Mt / 0.2 kg = 825 of 3,345 meal units (25%), while the analogues' mix gives seafood 3%. The gain is a share of the whole market, so it fixes seafood at 25% of replaced meals if applied evenly, yet the weights treat the replaced meals as 3% seafood. The meal count carries fish meals that the weighting then treats as meat. Meal count and mix disagree. | model formulas `world_meat_meals`, `tco2e_per_meal`, `dalys_per_meal`; facts alt_protein_seafood_share 3%. | Either count meals from land meat only plus seafood at the mix share (base = land meat meals / (1 − seafood_share)), or state in the `seafood_tonnes` explainer that the base is the market size and the 3% is a product-mix judgment, and use one seafood share in both. | up to about -25% if the base is cut to land meat meals / 0.97; direction not definite either way |
| 3 | low | presentation | write-up Summary | "under one percent the animals spared" and the climate/health split were not recomputed this round. | headline 0.0020 matches 0.002024. | Confirm the split with a scratch run. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `alt_protein_meal_vs_reference` | gfi.org/resource/analyzing-plant-based-meat-and-seafood-sales/ | page reachable, quote differs | see finding 1; the 86% figure is on the page |
| leverage, EPA, Parker et al., Moretti et al. | not re-fetched | arithmetic only | |

Verdict: pass (no high findings; 1 medium, 2 low).
Model-sha: c22c9bf688a0af203df1281b16c628dc20679eb72883a778381ed2b6a510e962
