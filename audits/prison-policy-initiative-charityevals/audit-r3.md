# Audit: prison-policy-initiative-charityevals, round 3 (verification)
Result: 2.890e-5 daly/$ = 0.0289 years of healthy life per 1,000 dollars (combined range 0.0030–0.274); cause median 0.0693 (×0.42). Verdict: pass.
Model-sha: 41d0fcf3535a76c7c2c7b962cc1bf8335b925139966a1ccc7506abea447ccde6
Scope: unchanged from round 2 (PPI's one programme column, $1,728,751 of $1,911,368, FY to June 2025; four branches; cost averaged over FY2021–FY2025). Scoped to the round-2 fixes (git diff b3461a8~1 b3461a8).
Mechanical: audit-model runs (0.0257 → 0.0289, +12.5%, the sum of the fixes: 0.43 share, split payers, fee wins as rows, overlap, side-effect scope); check.ts valid for this model and for habitat-for-humanity-charityevals-awareness; simulation stable (5% 0.31×, 50% 1.00×, 95% 3.1× the best guess). Habitat's `us_payer_multiple` now reads `@public_funds.us_state_local_payer_multiple`, whose value (0.75/1.05/1.6) equals what Habitat held, so its result is unchanged.
Previous round:
- 1 (`fed_share_lost_2025`): resolved. Best 0.43 (0.40–0.60), explainer states the frame and why the range is wider above. (Low end 0.40 rather than the suggested 0.35; acceptable, "at least" bounds are named.)
- 2 (`fee_wins_ratio`): structurally resolved, anchors partly. The ratio is gone; copay and fee savings and video-visit savings are on the state branch (state payers, state credit), the 2021 interstate cut is on the federal branch (federal credit and payers, `fcc2021_savings`). The three amounts are still judgments (see N3).
- 3 (federal payers): resolved. `fed_commission_share` (0.4, 0.2–0.6) at the state-and-local multiple with mcpf, the rest at `fed_owner_multiple` (2, 1–4).
- 4 (`st_payer_multiple`): resolved. Removed; shared fact `@public_funds.us_state_local_payer_multiple` read by the state branch, the commission term and Habitat.
- 5 (`st_ct` source): resolved in form. Now `ct_people` (observed, OPM, 10,098) × `ct_saving_per_person` (judgment 1,200, 500–1,801, within the report's range, with the reason it sits high). The claim that $1,801 is Connecticut's is gone. See N1 for the dead URL.
- 6 (`ger_ls_gain`): partly resolved. Anchored on Frey and Stutzer (2000), range 0–0.004, but the explainer's effect size is not the paper's (N2).
- 7 (`unmodelled_benefits_adj`): resolved. The adjustment is scaled by the phone-and-fee wins' share of the outcome, so it applies only to the uov share. Algebra checks: outcome × (1 + adj × uov/total) = total + adj × uov.
- 8 (`fed_implementation_adj`, write-up): resolved. Explainer says "interim, pending permanent rules"; the write-up text was updated. (The October 2025 inflation factor is still unnamed; low, cosmetic.)
- 9 (overlap; state share over whole campaigns): resolved. `fed_overlap_share` (2%, 0–5%) applied in `fed_savings_per_year`; `st_attribution_share` explainer states the campaigns ran 2020–2023, almost wholly inside the cost period.
- 10 (named studies; arithmetic): resolved. `ue_dec_family` cites Wakefield and Wildeman (2013), `ue_dec_crime` Ouss and Stevenson (AEJ: Applied 2023), `fed_attribution_share` shows 1.6M over five years against about 24M.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| N1 | low | source | `ct_people` | The source URL returns 404 ("That page is no longer here"). The number is right and the report exists at a different path. | Fetch of the model's URL: 404. Search finds the report at portal.ct.gov/-/media/opm/cjppd-main/cjppd/cjresearch/monthlyindicators/2023-monthly-indicator-reports/monthly-indicators-report----october-2023.pdf, with "OPM Population Estimate: 10,098". | Replace `source.url` with the cjppd-main path (the `?rev=` suffix may be dropped). | 0 |
| N2 | medium | source | `ger_ls_gain` | The explainer says Swiss residents in cantons with the most direct-democracy rights are "about 0.2 points more satisfied (0-10)". The paper reports its effect as a probability: about 11 percentage points more likely to be completely satisfied between the canton with the most and the fewest rights (SSRN abstract). The 0.2 is not in it, and the translation of 11 pp into points is not shown. | SSRN 203211 abstract (Frey and Stutzer, Happiness, Economy and Institutions). The row's tornado range (0–0.004) moves the result −4.6% to +57%. | State the paper's figure (11 points on the share completely satisfied, between extreme cantons) and the conversion to scale points, or say that the 0.2 is our rough conversion. Re-derive the 0.004 top from it and keep 0.0003 as the judgment. | Best value is about 5% of the result; the top of the range +57% |
| N3 | medium | sensitivity | `copay_fee_savings`, `video_visit_savings`, `fcc2021_savings` | The three replacements for the old ratio are judgments with no sourced anchor except copays ("a tenth of the free-call laws' savings"). Together at best they carry about 9% of the result, and at their highs 12.5% more (scratch run: 0.0289 → 0.0325). | Explainers: "No total is published". | Anchor: (a) `fcc2021_savings` = interstate minutes from the FCC's 2021 Third Report and Order (govinfo FR 2021-07-28) × (21¢ − 12¢/14¢); (b) copays: the number of states in PPI's copay tracker that ended copays in 2020–25 × people held × copays per person; (c) video visits: jails with bans × people held × the visit fees avoided. Keep them judgments with those ranges. | about ±10% |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| ct_people | portal.ct.gov OPM monthly indicators, Oct 2023 | number verified at the current path; model URL 404 | N1 |
| ger_ls_gain | SSRN 203211 / Frey and Stutzer 2000 | partly | Effect reported as 11 pp "completely satisfied", not 0.2 points (N2) |
| fed_share_lost_2025 | Worth Rises, 29 Oct 2025 | verified in r2 | 215/500 = 43%, unchanged |
| @public_funds.us_state_local_payer_multiple | ITEP Who Pays 2024 (as cited) | not re-fetched | same value and explainer as Habitat's previous row |

## Drivers
1. `$win_years_counted` (judgment, 1–20): 0.0062–0.088.
2. `$missing_data_discount`: 0.0058–0.058.
3. `@next_dollar.prison_policy_initiative` (estimate, 12–50%): 0.0139–0.058.
4. `fed_attribution_share` (judgment 7%, 3–18%, reference class and arithmetic now stated): 0.016–0.064.
5. `$uov_per_daly` (shared): 0.055–0.0157; `ger_ls_gain` now at 0.0276–0.0453 because its range widened (N2).
