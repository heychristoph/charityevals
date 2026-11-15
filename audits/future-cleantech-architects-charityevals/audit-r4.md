# Audit: future-cleantech-architects-charityevals, round 4 (verification of the round-3 changes only)
Result: 0.001216 tco2e/$ = 0.000727 years of healthy life per 1,000 dollars (combined range 1.6e-5–0.034); cause median 0.00183 (×0.40). Verdict: pass.
Model-sha: fd8d5b57e42195ebce2df60d51a25d35da1d86cafa015ed351f5f6ba1bee9b68
Scope: unchanged since round 3 (not re-audited). Only the commit b245cb4f's changes to the model, facts/climate.json and the write-up were checked.
Mechanical: `audit-model.ts`: 1 low (spread: the model's own ranges span 309,934×, and the summary says so), no invariant violation. `check.ts`: all models valid. `simulation-check.ts`: stable (5% 0.133×, 50% 1×, 95% 13.8× the best guess). normalization-audit not re-run (no rule or shared-version change since round 3).
Previous round (round 3 findings):
- 1 (high, `learn_stock_growth`): resolved. Now 10 (4-20), labelled "from 2030 to the middle of the years counted (about 2040)", explainer cites TGS 4C, Rystad and RenewableUK. Headline at G = 4 / 10 / 20: 0.000564 / 0.000727 / 0.000850.
- 2 (medium, learning tonnes' own mix): resolved structurally. `learn_coal_share` (0.4, 0.1-0.7) drives both `learn_tco2_per_mwh` (0.526 = gas × 0.6 + coal × 0.4, per the IPCC figures) and `learn_smoke_factor` (0.149, derived with the same formula as `direct_smoke_factor`). `ren_learn_tonnes_per_year` reads `learn_tco2_per_mwh`. One weakness remains (finding 1 below).
- 3 (medium, elasticity explainer): resolved. Hughes & Podolefsky is described as a rebate response (about 1.2, several times that as a short-run price elasticity), Gillingham & Tsvetanov's 0.65 as the price elasticity; range 0.5-3 (headline 0.000522 / 0.000727 / 0.001541). The write-up sentence is fixed to match.
- 4 (medium, ETS fact kind): resolved. `facts/climate.json` `eu_ets_net_reduction_share` is `judgment`, value and anchors unchanged.
- 5 (low, coal high end): resolved. `coal_tco2_per_mwh` high is 0.87 (IPCC Table A.III.2 maximum, verified in round 3); the explainer no longer cites lignite 1.0-1.1. Headline at the high end 0.000735 (+1%).
- 6 (low, write-up wording): resolved. "our evidence adjustment, the shared missing-data step"; the learning paragraph and the "How this model was checked" section are updated; the placeholder is gone.

## Checks of the stated figures against the computed rows (defaults)
| Statement | Computed | Result |
|---|---|---|
| summary, write-up: about 0.0012 t CO₂e per dollar | `tco2e_per_donor_dollar` 0.001216 | ok |
| summary: about 0.0007 years per $1,000; write-up figure 0.0007 | headline 0.000727 | ok |
| learning "about half" (summary, write-up) | set `learn_stock_growth` to 1 (ln G = 0): headline falls to 0.000310, so learning is 57% | ok (slightly over half) |
| write-up: "a third from the capacity it causes" | direct = 100% − 57% − 11% − 2% = 30% | ok within rounding; "under a third" would be exact (low, finding 3) |
| research consortia about 11% | `rc_share_of_spend` = 0: headline 0.000644, so 11.4% | ok |
| delegated act about 2% | `h2_volume_t_per_year` = 0: headline 0.000716, so 1.6% | ok |
| "each gigawatt the target causes brings about three-quarters of a gigawatt more later" | `learn_gw` 1.463 / `ren_caused_gw` 1.974 = 0.74 | ok |
| "two-fifths of the later capacity in the EU, later tonnes displace two-fifths coal" | `learn_eu_share` 0.4, `learn_coal_share` 0.4 | ok |
| `learn_smoke_factor` explainer "about 0.16 at the defaults" | 0.149 | mismatch (finding 2, low) |
| `direct_smoke_factor` explainer "about 0.11, gas alone 0.05" | 0.109 | ok |
| later tonnes' mix: 0.526 t/MWh vs the direct 0.448 | `learn_tco2_per_mwh` 0.526 | consistent with the coal shares 0.4 vs 0.2 |
| "Floating wind is expected to grow about tenfold from 2030 to 2040" | 56-90 GW in 2040 over 1.7-7 GW in 2030 (round-3-verified outlooks) | the central ratios (13-14×) support "about tenfold" and the range 4-20; low-to-high ratios span 8× to over 40× |

## Findings

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | plausibility (judgment without a reference class) | `learn_coal_share` (0.4, 0.1-0.7) | The new judgment names no anchor in numbers. The explainer says only that coal "still makes much of the power" outside the EU. Round 3 asked for an anchor on coal's share of fossil power outside the EU today, falling by the 2040s. The row is a top-15 swing: low and high end give 0.000504 and 0.000945 (−31% / +30%). The 0.4 is plausible (about 40% of the later capacity is in the EU at roughly 20% coal, the other 60% at roughly 55%), but the explainer doesn't show that. | Explainer of `learn_coal_share`; headline at coal 0.1 / 0.4 / 0.7. | Add the arithmetic and a source to the explainer: EU part (`learn_eu_share`) at `coal_share_of_displaced_power`, the rest at coal's share of fossil power in China, India and the US from Ember's Global Electricity Review, reduced for the 2040s; say how 0.4 follows. | 0 at the best guess |
| 2 | low | presentation | `learn_smoke_factor` explainer | Says "about 0.16 at the defaults"; the row computes 0.149. | Computed row. | Write "about 0.15". | 0 |
| 3 | low | presentation | write-up, "What drives the result" | "A third from the capacity it causes" and "about half from the later learning" are 30% and 57%. | Branch shares above. | "More than half from the later learning and under a third from the capacity it causes", and the summary "(about half)" can stay. | 0 |
| 4 | low | presentation | `coal_tco2_per_mwh` explainer | "lignite, higher, runs in only a few member states and is left in the coal share's range": the coal share's range is a range on the share, not on the intensity, so lignite's higher intensity isn't covered by it. | Row explainer. | "lignite, higher (about 1.0-1.1), is not covered; it runs in only a few member states." | under 2% |
| 5 | low | source | `learn_stock_growth` explainer | "growth of 10-20 times" for floating wind: the outlooks' own ratios are 8-14× at the central values and wider at the extremes (56-90 GW in 2040 over 1.7-7 GW in 2030). | TGS 4C 4.1 GW → 56.2 GW (13.7×); Rystad under 7 GW → about 90 GW (13×). | "growth of about 10-15 times at the outlooks' central figures" | 0 |

No high finding.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `learn_stock_growth` | TGS 4C, Rystad Energy, RenewableUK (as in round 3) | verified in round 3, not re-fetched | The explainer's 2-7 GW (2030) and 56-90 GW (2040) match the numbers quoted in round 3. |
| `deployment_cost_elasticity` | Hughes & Podolefsky; Gillingham & Tsvetanov (2019) | verified in round 3, not re-fetched | The new explainer matches that reading (rebate response vs price elasticity 0.65). |
| `coal_tco2_per_mwh` high 0.87 | IPCC AR5 WG3 Annex III Table A.III.2 | verified in round 3 | "PC 670 / 760 / 870". |
| `learn_coal_share` | none | unsupported (judgment, no anchor) | Finding 1. |

## Drivers
Unchanged in order: the shared value judgments (`$missing_data_discount`, `$win_years_counted`, the air-pollution deaths per tonne, `$discount_rate`), then `ren_attribution_share_shared`, `ren_counterfactual_adj`, the next dollar, `coal_deaths_per_twh`, the advocacy share, `ren_fossil_displaced_share` and `deployment_cost_elasticity`. The learning branch (57% of the result) rests on three judgments: `learn_stock_growth` (now anchored), `deployment_cost_elasticity` (anchored, range 6×) and `learn_coal_share` (finding 1). Peers: ×0.40 the climate median, no gap to explain.

Verdict: pass
