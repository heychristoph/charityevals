# Audit round 6 (scoped verification): Giving What We Can (charityevals)

## Scope
Only the fixes to round 5: `value_destinations` reweighted by the credit share, `effektiv_spenden_shared_moved` scaled by (1 - givewell_shared_share), typed numbers in the write-up, the `givewell_shared_share` explainer. Headline 46.9 to 38.67 (scripts/headlines.ts 38.6744).

## Checked
1. Mix. In a scratch copy: old mix V = 0.033984; the new formula subtracts (1 - c) x [shared recipients' named money x live value / all classified donations (90.62M)] = 0.5 x 0.020462 and divides by 1 - 0.5 x 0.34027: (0.033984 - 0.010231)/0.829863 = 0.028623 = `value_destinations`. The shared set (funds, Against Malaria Foundation, both Malaria Consortium lines, Helen Keller Intl, New Incentives) is the numerator of `givewell_shared_share`; GiveDirectly, Deworm the World, Unlimit Health and StrongMinds are not in it. So the dollar basis is exact: the shared dollars (34% of the giving) are halved at their own recipients' values, the unshared stay in full. `money_moved` = 33,832,082 - 11,512,152 x 0.5 - 404,025 x 0.5 = 27,873,994.
2. Pairwise with Effektiv Spenden: its `gwwc_shared_moved` = 1.54M/2 x its own effect x (1 - 0.2606); this side = (pledge + trial caused) x 1.54M/67.48M x (1 - 0.3403). Credit shares 0.5 and 1 - 0.5. Each side deducts its own caused part of the same gifts, both after removing the part in the GiveWell overlap, so the poverty-fund gifts are deducted once (round 5 finding 1 resolved). Money moved +0.1M on this side from that fix; Effektiv Spenden's +0.03M.
3. Why 46.9 to 38.67 (-17.6%): the mix value falls 15.8% (0.03398 to 0.02862) as the GiveWell-directed dollars, the most valuable in the mix, are cut in half; `money_moved` +0.4%; the net value of a moved dollar V - 0.5 V_before falls a little more than V. Explained by the fix.
4. `donor_cost_share` = cost_total / (cost_total + if($resource_shares, salary_sacrifice, 0)) reads no money moved. `$mobiliser_share` appears only in `mobiliser_share`.
5. Summary and write-up: placeholders for result, caused_donations, money_moved, givewell_shared_share, givewell_credit_share, moved_per_dollar; "(30% to 70%)" gone; the explainer of `givewell_shared_share` now says funds are counted whole, an upper reading (round 5 finding 2 resolved); no peer comparison. Round 5 findings 1, 2, 3: resolved.
6. Preflight: passes; only the "generated ... out of date" lines.

## Findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | `value_destinations` | The old mix gives the shared recipients 47% of the weight, not the 34% of dollars the deduction removes: the "average of the rest" rule values climate, movement building and unnamed global-health giving at an average that is mostly GiveWell-like. So after the subtraction the credited mix still holds about 0.008 of that average. If those dollars were also taken as GiveWell-directed (47%), the credited mix is 0.02591 and the headline about 35.0 (-9.5%). The dollar basis is the one the money deduction uses and `givewell_shared_share` is a floor, so the choice is defensible. | Keep; add one sentence to the explainer: the unplaced giving valued at the average is not itself treated as shared. |
| 2 | low | intro of the write-up | "about nine dollars of giving it caused" is a typed figure (caused 8.7 per dollar spent; credited 7.1). | Use "about {{row:moved_per_dollar}} of giving credited to it for each dollar it spends". |

Verdict: pass
Model-sha: 1a87adef5d1b18e83e448c9178c3e521935cd313e8366fb79af07a3e7f3c38a0
Rules: 0.2.0
