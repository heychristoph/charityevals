# Audit: dogs-trust-charityevals-rabies, round 3

Result: 4.834e-4 uov/$ = 0.2417 years of healthy life per $1,000 (combined range 0.041–1.415); global-health median 0.403 (×0.60). Verdict: pass (0 high).
Model-sha: 2605bcd5482e1f83750baef3812afe583ea814c3f814d901130d51796a02f9ab

Scope: unchanged from round 2 (the "rabies" line, 20% of the 2025 international line, $6.877m; sister model takes the rest). Round 3 checks only the round-2 highs and mediums and what the changes introduced.

Mechanical: lint 0/0/0 (audit-model: 0 findings); invariants none violated; normalization-audit: no violation for this model; simulation-check 5% 0.272, 50% 1.00, 95% 3.30 × best guess (stable); check.ts: all models valid. generated/ restored with `git checkout -- generated`.

The result moved 0.520 → 0.242 (×0.46) since round 2: attribution 1.00 → 0.628 (the inversion fixed, vaccine added to the full cost), `incidence_ratio` 1.3 → 1, the world GHE age split (value per death 99.0 → 95.2).

Previous round (highs and mediums only):
1. Attribution inverted (high): **resolved**. Formula is `min(1, (program_spend / people_reached) / full_cost_per_dose_usd)`: 3.13 / ((3.45 + 0.5) × CPI 2025/2019) = 0.628, below the cap, and the explainer now says what Dogs Trust paid per dose over the full cost. Effect matches round 2's −28% estimate (with the vaccine added, −37% in total). The second half of the fix (education and surveillance in the numerator but not the denominator) is open (finding 2, low).
2. Age split (high): **resolved**. The four `@death_ages.rabies_world_share_*` are WHO GHE 2021 world shares. **Verified** from WHO's API (xmart-api-public.who.int/DEX_CMS/GHE_FULL, cause 320, year 2021, sex TOTAL, all countries summed, 19,748 deaths): under 5 (Y0T1+Y1T4) 17.06%, 5–14 24.21%, 15–49 29.46%, 50+ 29.26%, so 17.1 / 24.2 / 29.5 / 29.3 are right. The three model rows read the shared figures (share_5_14_of_over5 and share_15_49_of_over15 are conditional shares computed from them; checked). No waiver. The reach-weighted (India-heavy) variant is not used; the explainer says it would lower the value of a death by under 10% (round 2 computed −8.4% against world), so low (finding 3).
3. `full_cost_per_dose_2019_usd` omitted the donated vaccine (medium): **resolved in structure**. The explainer now says vaccine is not in the $3.45 and `vaccine_cost_per_dose_2019_usd` (judgment 0.5, 0.3–0.8) is added in `full_cost_per_dose_usd`, in 2025 prices via the shared CPI. The vaccine row has no source or reference class (finding 1, medium).
4. `incidence_ratio` (medium): **partly resolved**. Centring at 1 (0.4–2.5) removes the round-2 claim that other countries' rates per dog are higher than Goa's, and says the direction is open. It is still not computed from deaths per person and dogs per person, and the explainer's "dog density ... is higher in many of them" is unsourced (finding 4, medium).
5. Static figures in the summary (medium): **resolved**. The summary has no result or ratio now (its dollar figure is an input, $6.9m, a judgment, stated as one). "Often one-off" wording is gone.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | source | `vaccine_cost_per_dose_2019_usd` | A judgment with no reference class: "about half a dollar" names no price anchor and has no `source`. After the attribution fix it drives the credit (the row is in the tornado: 0.2546–0.2246). | Model row; tornado above. | Name the anchor: a published price for canine rabies vaccine bought for mass campaigns (e.g. the PAHO Revolving Fund or WOAH/OIE vaccine bank price per dose) with its year and source, and set best and range from it. If none is found, say in the explainer which prices the 0.3–0.8 spans. | ±0.8 around 0.5 moves the result about ±6% |
| 2 | low | double-counting | `attribution_share_shared` | The numerator (program_spend / people_reached) includes Dogs Trust's rabies education and surveillance spending; the denominator (Goa's dog-vaccination cost plus vaccine) does not. This overstates Dogs Trust's share a little. | round-2 finding 1, second half; facts/dogs_trust.json anchor. | Take the education and surveillance part (the fact's anchor, about £0.5m) out of the numerator, or add Goa's education cost to the denominator, and say which in the explainer. | about −5 to −9% |
| 3 | low | normalization | `@death_ages.rabies_world_share_*` | The split is the world's, not reach-weighted by country (templates.md: weighted by the programme's reach by country). Source note says "not re-read by the builder" (I re-read it, above) and the URL is WHO's landing page, not the data query. | Fact source note; WHO API query above. | Put the GHE API query URL (`https://xmart-api-public.who.int/DEX_CMS/GHE_FULL?$filter=DIM_YEAR_CODE eq 2021 and DIM_GHECAUSE_CODE eq 320 and DIM_SEX_CODE eq 'TOTAL'`) in the source and drop "not re-read". Optionally add India's split (4.7 / 17.8 / 39.3 / 38.1%) and weight by beneficiaries. | −4% if reach-weighted |
| 4 | medium | sensitivity | `incidence_ratio` (judgment 1, 0.4–2.5; #2 driver) | Still a bare judgment on the path to the second-largest swing. WHO GHE 2021 gives deaths per 100,000 below Goa's 1.16 for the dose-weighted countries (India 0.67, Malawi 0.25, Cambodia 0.13, Bangladesh 0.54); per dog it needs dogs per person (Goa about 1 : 10.6). The claim of higher dog density "in many of them" has no source. | WHO GHE query; Gibson et al. 2022 (17 deaths in 2014, 137,353 dogs). | Add rows for dose-weighted deaths per 100,000 (GHE 2021) and dogs per person by country (Hampson et al. 2015 or the country dog surveys), compute the ratio from them against Goa's 17 ÷ 137,353 and keep 0.4–2.5 only if they span it; or cite the survey behind the density claim. | The range already spans the plausible direction: tornado 0.097–0.604 |

Round-2 lows 6–11 were not re-checked (outside this round's scope).

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `@death_ages.rabies_world_share_*` | xmart-api-public.who.int/DEX_CMS/GHE_FULL (cause 320, 2021, TOTAL sex, all countries) | verified | 19,748 deaths; 17.06 / 24.21 / 29.46 / 29.26% |
| `full_cost_per_dose_2019_usd` | PMC9120018 (round 2) | unchanged | 3.45 in-country; explainer now matches |
| `vaccine_cost_per_dose_2019_usd` | none | unsupported | judgment without anchor (finding 1) |

## Drivers
1. `$missing_data_discount` (shared, 0.5): 0.048–0.483.
2. `incidence_ratio` (judgment 1): 0.097–0.604, unquantified (finding 4).
3. `coverage_sustainment_adj` (judgment 0.6): 0.121–0.403.
4. `daly_per_child_death` (judgment, shared range): 0.145–0.338.
5. `goa_deaths_averted` (estimate 80, sourced): 0.151–0.332.

What would most improve the model: compute `incidence_ratio` from GHE deaths and dog densities, and anchor the vaccine price.

Findings by severity: high 0, medium 2, low 2.
