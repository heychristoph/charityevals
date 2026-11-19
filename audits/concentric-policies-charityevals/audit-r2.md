# Audit: concentric-policies-charityevals, round 2
Result: 3.100e-5 daly/$ = 0.0310 years of healthy life per 1,000 dollars (combined range 0.0015–0.63); cause median 0.112 (×0.28). Verdict: pass.
Model-sha: 46b8a3648788e9576df460cb0ac0792f3a2a85800c6fbb63c357d4dc27a458b8
Rules: 0.3.13
Scope: unchanged from round 1 (first year, about October 2023 to September 2024, about $80,000; Liberia and Guinea-Bissau; branches: stopped 2024 order, first-year share of the 2025 act, Guinea-Bissau 2022 tax). This round is a scoped verification of round 1's highs and mediums.
Preflight: pass (no blocking lines; two low "generated" lines: run `npx tsx scripts/summaries.ts` for the distributions and usage files). audit-model shows no invariant violations.
Previous round: #1 (high) resolved; #2 (high) resolved; #3 resolved; #4 resolved; #5 resolved; #6 resolved; #7 resolved. Lows #8 to #12 are the builder's and were also addressed. No new high or medium.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `lbr_tob_implementation_adj` explainer | The arithmetic anchoring the 10% uses "Liberia's roughly 177,000 smokers (Concentric's figure)" and five cigarettes a day. The cited founders' post does not contain 177,000 (it has the $6,000 / $158,000 / over $3 million excise figures and the 25% compliance goal, all verified), and the five a day is unsourced. The conclusion (compliance far below 30%) holds on the post's own figures, so this does not change the row. | EA Forum post, fetched this round: "almost none of the country's tobacco market is paying taxes"; "Bring tobacco tax compliance in Liberia to 25%"; no smoker count. | Cite where 177,000 comes from (WHO tobacco prevalence for Liberia times adults) or drop the smoker count and the 5-a-day assumption, keeping the excise series and the 25% goal. | none |
| 2 | low | source | facts/alcohol.json `unrecorded_lbr_2023`, `recorded_share_lbr` | The cited URL `...SA_0000001821?$filter=SpatialDim eq 'LBR'` timed out (HTTP 504) on repeated tries; with `and TimeDim eq 2023` it returns the figure at once. | See Sources checked. | Add `%20and%20TimeDim%20eq%202023` to the three GHO URLs. | none |
| 3 | low | presentation | `lbr_alcohol_dalys` explainer; `generated/` | The explainer still says "GBD's own figure was not retrieved" (true for the DALY conversion only; the age shares are now observed). The distributions and usage files are stale. | Preflight lows. | Say "the deaths-to-DALY figure is a judgment; the age split is GBD's"; run `npx tsx scripts/summaries.ts`. | none |

## Round 1 highs and mediums, one by one
1. **High #1, stopped order's alcohol years: resolved.** `eo_alc_years_counted` (judgment 1, 0.5 to 1.5, LRA 17 March 2025 cited) and `eo_alc_discounted_years = pv_annuity_due(1, discount, eo_alc_years_counted) * (1+discount)^-adv_years_until_effect`; `eo_alc_dalys` reads it. The tobacco part keeps `adv_discounted_years`, correct as tobacco is not in the amendment. The write-up and summary say the Legislature cut beverage excise in April 2025. The result fell 0.0646 to 0.0310, more than the single fix (0.0376) because the other changes net down.
2. **High #2, double count of credit: resolved.** `eo_p_success` is now the event only (25%, 5 to 60%, `single_event` with `eo`); the row text, and `eo_attribution_share_shared` (40%, 20 to 70%), each ask one question. 25% x 40% = 10%, the old product, so the branch is not inflated. The Guinea-Bissau branch is built the same way.
3. **Medium #3, tobacco enforcement: resolved.** 10% (2 to 30%), anchored on the founders' $6,000 / $158,000 / over $3 million series (verified) and the 25% goal (verified). See low #1 for the smoker count.
4. **Medium #4, next-dollar: resolved.** Room 0.7 (0.3 to 1), use 0.8, run 0.85 (0.8 to 0.95): 0.7 x 0.8 x 0.85 = 47.6%, low 0.3 x 0.5 x 0.8 = 12%, high 95%; matches the stored 0.48 (0.12 to 0.95), the rule in normalization.md 2.10, and the note says why.
5. **Medium #5, age shares: resolved.** Ten observed per-country rows replace the four judgments; `lbr_tob_value_per_death`, `gnb_tob_value_per_death` and `alc_value_per_death` read them. Shares recomputed from the round-1 GBD counts match: Liberia smoking 198.8 / 381.1 / 115.5 of 695.3 = 0.2859 / 0.5481 / 0.1661; Guinea-Bissau 80.7 / 117.1 / 45.5 of 243.3 = 0.3317 / 0.4813 / 0.1870; Liberia alcohol 1.0 / 467.1 / 314.8 / 105.2 of 888.2 = 0.0011 / 0.5259 / 0.3544 / 0.1184 (sum 0.9999). The OWID API returned 403 to this run (including via the browser), so the counts were not re-fetched, but the stored values are exactly those the round-1 auditor read from the same indicators, and the totals (695, 243, 888) match the already-verified deaths rows.
6. **Medium #6, price change: resolved.** `eo_tob_price_change = lbr_tob_excise_share_of_price (0.4652, WHO RGTE 2021: 28.49% + 18.03%, verified in round 1) x eo_excise_cut_share (18%, 5 to 33%)` = 8.4%; alcohol 25% (10 to 40%) x 18% = 4.5%. The alcohol excise share is a judgment because the pre-2025 rates were not found; the row says so and uses a wider range, as round 1's fix allowed.
7. **Medium #7, alcohol enforcement: resolved.** `lbr_alc_implementation_adj = recorded_share_lbr x lbr_alc_pass_through` = 0.324 x 0.9 = 29%. WHO GHO checked this round: SA_0000001747 Liberia 2023 NumericValue 0.545012976, "0.5 [0.2 - 0.9]" (verified); SA_0000001821 Liberia 2023 NumericValue 1.13717999, "1.1 [0.4 - 1.9]" (verified, 0.4196 to 1.9293). 0.545 / (0.545 + 1.137) = 0.324 (verified). Switching is out of `harm_price_response` and `alc_evidence_adj`. The pass-through (0.9, 0.7 to 1.1) is a judgment with a stated reason; it moves the result under 10% across its range.

## Checks of the changes for new problems
- Shares of the result at the defaults (computed from the model's rows): stopped order about 67%, 2025 act about 27%, Guinea-Bissau about 5%; tobacco about 48%, alcohol about 52%. The write-up's "two thirds, about a quarter, about a twentieth" and "about equally" match, as do `beneficiaries` (Liberia 94.6%, Guinea-Bissau 5.4%) and its note.
- CTFK's `glob_evidence_adj` now reads the shared `@tobacco.lmic_wins_evidence_adj` (0.8, 0.5 to 1, the same as before): no change in value, one consistent way.
- `tob_household_spending_share` at 0 with its reason: acceptable.
- `lmic_smoking_burden_price_response` is now sourced to Chaloupka, Straif and Leon 2011 (PubMed 21115556 reachable); the passage supports "sufficient evidence" for tax effectiveness, and the number stays a judgment with the -0.5 and Chile as checks.
- The write-up's "How this model was checked" gives the round-1 changes and the result move (0.065 to 0.031) with no comparison to other charities, a median or peers; the result is the live `{{result}}`.
- ambitious-impact-charityevals now reads this model; not part of this round.
- Judgment-heavy: the cause median is ×0.28, within a tenth to ten times, so no peer-gap row needs finding.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| recorded_lbr_2023 | ghoapi.azureedge.net/api/SA_0000001747?$filter=SpatialDim eq 'LBR' | verified | 2023, 0.545012976, "0.5 [0.2 - 0.9]" |
| unrecorded_lbr_2023, recorded_share_lbr | ghoapi.azureedge.net/api/SA_0000001821?$filter=SpatialDim eq 'LBR' and TimeDim eq 2023 | verified | 1.13717999, "1.1 [0.4 - 1.9]"; the URL as stored (no TimeDim) gave 504 twice, see low #2 |
| smoking and alcohol age shares (ten rows) | api.ourworldindata.org indicators 1172062/64/70/74, 1171632/37/41/46 | arithmetic verified; not re-fetched | 403 from the API and the CSV (non-redistributable data); consistent with round 1's reading |
| lbr_tob_implementation_adj | forum.effectivealtruism.org/posts/zdacfpQdQjfGNoavQ | verified except 177,000 | "almost none of the country's tobacco market is paying taxes"; $6,000 (2023), $158,000 (2022), over $3 million (2013); 25% compliance goal; no smoker count |
| @next_dollar.concentric_policies | same post | verified | "full $100,000 gap through December 2025" |
| lbr_tob_excise_share_of_price | WHO RGTE 2021 Liberia profile | verified in round 1 | 28.49% + 18.03% |
| eo_alc_years_counted | revenue.lra.gov.lr/?p=10358 | verified in round 1 | April 2025 beverage excise cut |

## Drivers
- `$mobiliser_share`, `$missing_data_discount`, `@next_dollar.concentric_policies`, `$win_years_counted`: shared sliders and a sourced estimate on stale evidence, now neutral.
- `eo_p_success` (event only, judgment with stated basis), `eo_excise_cut_share` (judgment, order's rates unknown), `lbr_tob_implementation_adj` (judgment on verified revenue figures).
- Most improved by: the text or a dated report of the 2024 order; Liberia's pre-2025 beverage excise rates and retail prices (replacing `lbr_alc_excise_share_of_price`); a current funding statement.

Re-stamped (18 Nov 2026): the round's three lows fixed, wording and links only (the illustration's smoker count and cigarettes a day labelled as the brief's and ours, the lbr_alcohol_dalys explainer, WHO URLs with a year filter). Mechanical: headline unchanged (3.100e-5 daly/$).
