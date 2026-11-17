# Audit round 4 (scoped verification): The Life You Can Save

## Scope

Only the overlap rows of credit rule 2.24 ("Overlap"): `givewell_shared_moved`, `givewell_credit_share`, the extra term in `recorded_donations`, the shared fact `@meta.shared_credit_donor_side` (0.5, 0.3 to 0.7), and the summary and write-up text that quote them. Headline 12.0 to 11.1 years of healthy life per $1,000.

## Checked

1. Sizing. `givewell_shared_moved` = the four `@meta.tlycs_moved_2025_*` facts (Against Malaria Foundation 1,427,023; Helen Keller Intl 1,343,347; Malaria Consortium 548,188; New Incentives 280,063) = $3,598,621, matching the engine. These are GiveWell's four Top Charities, and the facts are the charity's own money-moved-by-charity report, the same report whose six channels make up `money_moved_reported` ($25.04M). They are gross figures, not scaled by the 1.25 completeness uplift, so the deduction is if anything slightly small; no double count with the Rapid Response Fund (a separate line).
2. Deducted once, at the right stage. `recorded_donations` = 25,044,525 - 3,109,921 x 0.25 - 3,598,621 x 0.5 = $22,467,735 (engine), before `donor_own_effect` (0.3), which is the would-it-have-happened cut; the split is the other cut. `money_moved` $6.74M is read once downstream.
3. Mix of the credited money: see finding 1.
4. `donor_cost_share` reads no money moved. With `mobiliser_share=0.5` the headline is 5.05, not exactly half of 11.09: the recipients' live results in `value_tlycs_recommended` also move with the setting (chains compound, rule 2.24), so this is by design.
5. Classification. It recommends the four Top Charities on GiveWell's research and passes the money on; GiveWell counts such gifts. Fair. Other GiveWell-supported charities on its list (Evidence Action, GiveDirectly and others) are not shared, which is conservative.
6. Summary uses placeholders ({{row:recorded_donations}}, {{row:money_moved}}, {{row:moved_per_dollar}}) and agrees with the model; no comparison with other charities. Write-up: see finding 2.
7. Preflight: passes; only low lines "generated ... out of date".

## Findings

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | medium | value_tlycs_recommended | The destination mix weights each charity by its full reported money moved, but half of the four Top Charities' dollars is now credited to GiveWell. Their weight (about 22% of the modelled mix) is too high and the credited money is valued too high: with their weights halved the headline is 9.91, not 11.09 (-10.7%; tested in a scratch copy). | Multiply each of the four `@meta.tlycs_moved_2025_*` weights (AMF, Malaria Consortium, Helen Keller Intl, New Incentives) by `givewell_credit_share` in both the numerator and the denominator of value_tlycs_recommended (the engine template in src/engine/moved-money.ts and scripts/relink-tlycs.ts if it writes the row), and say so in the explainer. Then run `npx tsx scripts/summaries.ts`. |
| 2 | low | write-up, "How the impact happens" | "That is about $7.3 million in 2025" is typed and stale: money_moved is now $6.7M ("about three dollars" still holds at 2.6). | Replace with {{row:money_moved}}; the "Where we differ" list could add one line on GiveWell's share. |

Verdict: fail
Model-sha: e0394e9661ecfbb192a6d47083158c520defdcf41096eb187469ff008466be17
