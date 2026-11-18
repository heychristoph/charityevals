# Audit round 9 (scoped verification): Effektiv Spenden (charityevals)
Result: 0.0147 uov/$ = 14.70 years of healthy life per 1,000 dollars (was 21.01 in round 8).

## Scope
Only the fixes to round 8: `value_destinations` reweighted by the GiveWell credit share, `gwwc_shared_moved` scaled by (1 - givewell_shared_share), the typed numbers in summary, write-up and `informed_money`, and the headline change 21.0 to 14.7.

## Checked
1. Mix by hand. In a scratch copy I split the new formula: old mix V = 0.023620; GiveWell-directed part G (poverty fund, Malaria Consortium, Against Malaria Foundation 2024; Helen Keller Intl, Malaria Consortium, New Incentives, Against Malaria Foundation 2025, each at its live value, on the same blend and denominators as before) = 0.016422; their share of the giving s = 0.26065 (= `givewell_shared_share`). Credited mix = (V - 0.5 G)/(1 - 0.5 s) = (0.023620 - 0.008211)/0.869676 = 0.017719 = `value_destinations`. With `money_moved` = caused x (1 - 0.5 s) - the Giving What We Can part, value credited = caused x (V - 0.5 G): full credit for unshared dollars plus half of the shared, each at its own recipients' value. No recipient weighted twice or dropped: GiveDirectly, Deworm the World/Evidence Action, StrongMinds and Lafiya stay in the unshared part; the four GiveWell charities and the fund are removed in the same list as `givewell_shared_share`. The five cause shares sum to 0.97 and the rest takes the average, so the weights in V are over 0.97 while G and s are not: that is right, because the 3% is real money valued at the average (V = N/0.97 holds for all the dollars).
2. Why 21.0 to 14.7. The GiveWell-directed dollars are the most valuable in the mix: 0.0630 per dollar (G/s) against 0.0236 on average (climate, animal welfare, catastrophic risks and democracy at far lower figures). Half of 26% of the giving moves to GiveWell; the credited money (8.37M of 9.73M caused, -14%, the amount was already cut in round 8) loses its best dollars: value per dollar falls 25% (0.02362 to 0.01772). The net value of a moved dollar is V - 0.5 x V_before (half counts as new money, the rest only for the gain over where it would have gone), and V_before (0.0079) is fixed: it falls from 0.01966 (round 8) to 0.01376, -30%, which is the whole change in the headline (14.70/21.01 = 0.70). Right and expected: the round 8 figure valued the credit left after the deduction as if it still held the average mix, which is the fault round 5 found in One for the World and The Life You Can Save.
3. Pairwise overlap with Giving What We Can: this side `gwwc_shared_moved` = 1,541,950 / 2 x 0.3045 x (1 - 0.2606) = 173,585; credit share 1 - 0.5. Giving What We Can's side `effektiv_spenden_shared_moved` = (pledge + trial caused) x 1,541,950/67,476,618 x (1 - 0.3403) = 404,025; credit share 0.5. Shares sum to 1; the same gifts counted by each at its own caused part; both scale by their own GiveWell share, so the poverty-fund gifts are deducted once on each side (round 8 finding 4 resolved). `money_moved` = 9,729,773 - 2,536,050 x 0.5 - 173,585 x 0.5 = 8,374,955.
4. `donor_cost_share` = cost_total / (cost_total + if($resource_shares, salary_sacrifice, 0)) reads no money moved. `$mobiliser_share` appears only in the `mobiliser_share` row.
5. Summary and write-up use placeholders for result, caused_donations, money_moved, givewell_shared_share, givewell_credit_share, moved_per_dollar; "(30% to 70%)" gone; no peer comparison. `informed_money` explainer uses {{row:money_moved}}. Round 8 findings 1 to 4: resolved.
6. Preflight: passes; only the "generated ... out of date" lines.

## Findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | `moved_per_dollar` explainer | "(about eight)" is typed and stale: the row is now 7.0. | Use {{row:moved_per_dollar}} or drop the parenthesis. |
| 2 | low | `value_destinations` | The Giving What We Can pledgers' gifts (about 1% of the credited money) are deducted from the amount but not taken out of the mix, so they stay at the average value, not their own recipients'. The explainer says this. | None needed; accept. |

Verdict: pass
Model-sha: 2e5f4f9344520d78789f1915fc66305298f5b054d10bdaf9a524a15e594664fe
Rules: 0.3.10
