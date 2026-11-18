# Audit round 5 (scoped verification): Giving What We Can (charityevals)

## Scope
Only the change since round 4: overlap rows per docs/normalization.md 2.24 "Overlap" (`caused_donations`, `givewell_shared_share`, `givewell_shared_moved`, `givewell_credit_share`, `effektiv_spenden_shared_moved`, `effektiv_spenden_credit_share`, `money_moved` now net of the other side's share), the new facts `shared_credit_donor_side`, `gwwc_donations_2023_24_pledge`, `gwwc_donations_2023_24_other`, `gwwc_moved_2023_24_via_effektiv_spenden`, the mirror in the Effektiv Spenden and GiveWell models, the summary and write-up. Headline 57.1 to 46.9 (scripts/headlines.ts 46.9075).

## Checked
1. Facts against sources. I could not open the donation classification sheet or the impact evaluation: Google Docs/Sheets export returned a redirect that failed (HTTP 400), so the totals 67,476,618.03 and 23,144,262.92, the five Effektiv Spenden rows and the Appendix B note 33 quote are unverified against the source. Arithmetic is checked: the five rows sum to 1,541,950.32; the numerator of `givewell_shared_share` (funds 24,617,284.17 + AMF 4,039,369.53 + MC SMC 767,762.50 + MC 215,289.84 + Helen Keller 628,292.15 + New Incentives 567,860.53 = 30.84M) over 90.62M gives 0.3403, matching the model row.
2. Formulas. `money_moved = caused_donations - givewell_shared_moved*(1-gw_share) - es_shared_moved*(1-es_share)`: deducted once, on money, before `moved_value = money_moved * moved_dollar_net_value`. `donor_cost_share = cost_total/(cost_total + if($resource_shares, salary_sacrifice, 0))` reads no money moved (0.795 with the switch on, 1 off). `moved_dollar_net_value` multiplies by `mobiliser_share` exactly (0.5 gives 0.01415 = 0.5 x (0.5 V + 0.5 (V - V_before))); `money_moved` does not move with the slider. The headline at 0.5 is 22.10, not half of 46.91, because the destination models it reads also take the slider; unchanged behaviour, not from this change. Values: caused 33.83M, GiveWell-shared 11.51M, Effektiv Spenden-shared 0.61M, money_moved 27.77M, 7.08 per dollar spent.
3. Mirror. `effektiv-spenden-charityevals` `gwwc_credit_share = 1 - @meta.shared_credit_donor_side`; `givewell-charityevals` `fundraisers_credit_share = 1 - @meta.shared_credit_donor_side`; this model reads the fact itself on both rows, so each pair sums to 1.
4. Classification. GiveWell's Top Charities and its funds are fairly "following GiveWell". The fund fact also holds EA Funds' Global Health and Development Fund, Giving What We Can's own Global Health and Wellbeing Fund and RC Forward's/Effektiv Spenden's poverty funds, which follow GiveWell only in part (finding 2). The share is a floor on the named recipients.
5. Text. Summary and write-up read caused_donations, money_moved, givewell_shared_share, givewell_credit_share, moved_per_dollar as placeholders; no peer comparisons; the write-up's typed "(30% to 70%)" is the fact's range (finding 3).
6. Preflight: passes; only two "low generated ... out of date" lines (distributions, usage).

## Findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | `effektiv_spenden_shared_moved`, `givewell_shared_share` | The GiveWell-following fund fact includes Effektiv Spenden's poverty funds, and the Effektiv Spenden fact includes its "Spenden-Fonds: Armut bekaempfen" row (115,034) and possibly the generic "Effektiv Spenden" rows. Money in both is deducted under both overlaps. Bounded: the Effektiv Spenden deduction is 0.31M of 33.8M (under 1%). | Where building the facts, take from the Effektiv Spenden fact the rows already inside `gwwc_moved_2023_24_global_health_funds`, or multiply `effektiv_spenden_shared_moved` by (1 - givewell_shared_share); say which in the explainer. |
| 2 | low | `givewell_shared_share` | 34% treats every dollar in the mixed fund fact as GiveWell-directed, though EA Funds' and the GWWC fund's grants are only partly GiveWell's. | Add to the explainer that the figure is an upper reading for those funds; the 30-70% split already brackets it. |
| 3 | low | write-up | "(30% to 70%)" typed in the write-up. | Replace with a placeholder if one exists for a fact's range, or drop it. |

Verdict: pass
Model-sha: 0ff67d4f0c0ca1cdbaf43b74146077abf60e50d642ee86e71855983511597098
