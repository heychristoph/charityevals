# Audit: terrapraxis-charityevals, round 6 (verification)
Result: 0.03356 tco2e/$ = 0.02106 years of healthy life per 1,000 dollars (combined range 5.017e-5 to 8.844); cause median 0.001828 (x11.5). Verdict: pass (no high; the one medium is the explained far-above; one new low of substance on the beneficiaries split).
Model-sha: 3efe38ad324db59d129c06f7f41c3c780cd8a206f8e9996378721e74d9bea367
Scope: unchanged. Scoped to round 5's finding 1 (medium) and lows 3 and 4 and the diff e101fabc..09965d56 (model, facts/climate.json, write-up, scripts/beneficiary-countries.ts). The rows' values were dumped from the live model (temporary script, deleted) and the money's split by region recomputed by hand from them; the tonnes' split by the death-weights in assumptions/default.json and facts/climate.json.
Mechanical: audit-model: 0 high, 1 medium (far-above, below), 3 low (the reading-only summary rows, already labelled). check.ts: all models valid; the headline 0.021 matches the write-up's "0.02". generated/ restored; no other file changed.

## Round 5's findings
| Round 5 | Status | Check |
|---|---|---|
| 1 (medium) beneficiaries and text | resolved, one soft spot (finding 1) | The money is 71% of the value and sits where the note says (below); summary and write-up now say China and other middle-income countries, India largely offset. |
| 3a US solar | resolved | Table 3.14 lists US utility-scale 100 MW at 28% (the *** entry): 31.60 / 44.00 (26.03 investment, 5.42 O&M). Mean with onshore wind 26.53 / 35.10 = 29.07 / 39.55; nuclear 43.90 / 71.25 less that = 14.83 / 31.70. Matches the fact. |
| 3b France solar | resolved | Table 3.14 France utility scale 25 MW, 24% : 24.39 / 33.94. Gap against wind 43.77 / 56.08: mean 34.08 / 45.01, EPR 45.27 / 71.10, gap 11.19 / 26.09. Korea -38.66 / -51.65 unchanged; mean of the two: -13.74 / -12.78. Matches the fact. |
| 4 system-cost explainer | resolved in form, see finding 2 | Arithmetic added and the hydro simplification named. |
| 2, 5, 6 | left | Still low; unchanged by this diff. |

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | accuracy of a displayed claim | beneficiaries {world 0.35, CHN 0.52, IND 0.13} | Within about 0.05 of a recomputation, so it passes "roughly", but the mass sits a little differently. Money (0.711 of the value: 88,959 of 125,100 before the 5% other work) by region from the rows at the defaults, in uov a year: China 206, India 24 (siting saving 113.5 less 89.5 on the extras), middle-income builders valued as China 46, rest of the world 62, US -3; total 335 = 61.5% China, 7.2% India, 13.7% middle-income, 18.6% rest, -1% US. The note's "China about 60%, other countries about 33%, India about 7%" is right (middle-income + rest + US = 31-32%). The tonnes (0.29): by the death weights at the defaults heat 22%, air pollution 75%, methane ozone 4%, so the tonnes fall mostly on China and India (air), not mostly on the world: world's part of the tonnes is about 26% (0.07 of the whole), China's and India's about 0.22. Whole: CHN about 0.44 + (China's share of the air, about 0.13-0.18) = 0.57-0.62; IND 0.05 + 0.04-0.08 = 0.09-0.13; world about 0.22 + 0.07 = 0.30. The stored 0.52 / 0.13 / 0.35 is therefore about 0.05-0.10 low for China and 0.05 high for the world. (Round 5's 'air pollution about a fifth of the tonnes' was a slip: it is about three quarters.) The note's words are correct; only the weights are rough. | model rows w_overnight, premium_*, clean_premium_*, fossil_share_*; death weights in assumptions/default.json deaths_per_tco2e, climate_heat_share, facts climate.ozone_deaths_per_tco2e_methane; by hand | Optional: {CHN 0.57, IND 0.13, world 0.30} (the India figure depends on India's smoke per tonne, not recomputed here); same in scripts/beneficiary-countries.ts. No text change. | none; moves the home-country lever slightly |
| 2 | low | judgment | @climate.vre_system_cost_usd_per_mwh explainer | The new arithmetic ($50-70 per MWh times a 20-50% value loss = $10-35) rests on two typed numbers the study does not give (PCGE has Figure 4.3's energy value relative to the average price, but no price level or a 20-50% loss), and its low end ($10) is above the stated range's low end ($5). The label says it is the builder's judgment, which is the right form. | PCGE chapter 4 (no price level found by search of the extract) | Either name where the price comes from (a wholesale price source) and say the loss range is judged, or widen the arithmetic to "$5-35" to match the range. | none; inside the range already shown |
| 3 | medium (explained) | far-above | result | 11.5x the cause's median; the explanation of round 5 holds after this diff: the money is 71% of the value, mostly construction saved on coal-site reactors (siting saving 208 uov, extras 127), falling on payers at $4,200 consumption in China and $630 in India under the 1/consumption rule. A sourced saving (DOE 15-35%, 25% default); the sign turns on the ranged system cost and shared uncertainty (tornado). Not a finding against the model. | tornado; rows above | none | none |

## Checks asked for
- Beneficiaries in the model and in scripts/beneficiary-countries.ts are identical ({world 0.35, CHN 0.52, IND 0.13}); the note is one sentence in both and is consistent with the rows for the money (finding 1 for the tonnes).
- Summary and write-up: "China and other middle-income countries" (China 62% and the middle-income builders 14% of the money; India 7% net, its 113 uov siting saving "largely offset" by -90 on the extras at +9.67 per MWh against wind and solar) are true by the rows. The write-up's build sentence "since most reactors would be built in China and other middle-income countries" fits the shares (China 45%, India 10%, middle-income 10%).
- US and France facts: verified above against Table 3.14 (and nuclear and wind entries from Tables 3.13a and 3.15a, unchanged from round 5). Notes in the facts say what they use.
- Write-up per-MWh figures against the live rows at 4%: `clean_premium_ind` +9.67 ($10 more), `clean_premium_usa` +4.05 ($4 more), `clean_premium_chn` -5.04 ($5 less), `clean_premium_rest` -28.5 ("much less"). Fossil lines ($2 more China, $6 less India, $10 more US, $14 less rest) match premium_chn 1.60, premium_ind -5.76, premium_usa 10.23, premium_rest -14.05. All match.
- Only this model reads the US clean-gap fact (no other model's result moved).
- Headline 0.02 (0.0211); the tonnes about three tenths (0.29) and money about seven tenths match the summary.

## Sources checked
| Row | Source | Status | Note |
|---|---|---|---|
| clean-premium US 3% / 7% | PCGE Tables 3.13a, 3.14, 3.15a (text extract) | verified | utility solar 31.60 / 44.00, wind 26.53 / 35.10, LWR 43.90 / 71.25 |
| clean-premium rest 3% / 7% | same | verified | France utility 24.39 / 33.94, wind 43.77 / 56.08, EPR 45.27 / 71.10; Korea as before |
| vre_system_cost explainer | PCGE chapter 4 | judgment | price level and loss range are the builder's (finding 2) |
