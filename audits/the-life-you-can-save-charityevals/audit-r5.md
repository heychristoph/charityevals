# Audit round 5 (scoped verification): The Life You Can Save

## Scope
Only the fixes to round 4: `value_tlycs_recommended` replaced by its own split `value_destinations` (`moved_dollar_value = value_destinations`) with the four GiveWell Top Charity weights reweighted by the credit share, and the write-up's stale "$7.3 million". Headline 11.09 to 10.30 years of healthy life per $1,000 (scripts/headlines.ts 10.2964).

## Checked
1. Term by term against the shared formula (src/engine/moved-money.ts, TLYCS_DESTINATIONS): the formula starts with exactly the shared numerator and denominator over all 22 recipients (compared as text, in a scratch script); only the tail differs: `- (1 - shared_credit_donor_side) * (AMF, Malaria Consortium, Helen Keller Intl, New Incentives weights x their live values) / tlycs_by_charity_total_2025`, all over `1 - (1 - side) * (the four weights) / total`. The four are the same four facts `givewell_shared_moved` sums. No recipient is weighted twice or dropped.
2. Hand recomputation. Whole table T = 24,106,468 (34 lines; unmodelled lines valued at the average of the modelled, so the average V = 0.036076 holds for all T). Shared money 3,598,621, their live value per dollar 0.064471; unshared at own value (V x T - shared value)/(T - shared) = 0.031094. Credited mix = (unshared dollars x 0.031094 + 0.5 x shared dollars x 0.064471) / (unshared + 0.5 x shared) = 0.033786 = `value_destinations` (0.033786), equal to the model's formula. Deduction on the amount (`recorded_donations` 22,467,735, shared x 0.5 out) and the mix together therefore give full credit for unshared dollars plus the credit share of shared dollars, each at its own recipients' value.
3. The base is T (all lines, 24.1M), not the 16.7M of the 22 listed recipients: right, because the 7.4M of unmodelled lines is real money valued at the average and is in the money the deduction is a share of. This is why the headline is 10.30 and not 9.91 (the round 4 scratch test halved the weights inside the 22-recipient sum, which over-removes). Explained: V falls 6.3% (0.0361 to 0.0338), headline 11.09 to 10.30 (-7.1%).
4. `donor_cost_share = cost_total / (cost_total + if($resource_shares, salary_sacrifice, 0))` reads no money moved. `$mobiliser_share` appears only in the `mobiliser_share` row; other rows read that row. At 0.5 the headline is 4.61, below half, because recipients' live results compound (rule 2.24).
5. Summary and write-up: placeholders for result, recorded_donations, money_moved, moved_per_dollar, givewell_shared_moved, givewell_credit_share; the explainer of the shared split uses a placeholder; no peer comparison. See findings.
6. Previous findings: 1 (medium, mix) resolved; 2 (typed $7.3M) resolved ({{row:money_moved}}).
7. Preflight: passes; only the "generated ... out of date" lines.

## Findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | summary; `value_destinations` explainer | Stale typed counts, not from this change: the explainer says "The 13 charities with a model here took $11.3 million of the $24.1 million" and the summary "18 of its 33 recipient charities and its emergency fund (53% of the money) have no model"; `facts/meta.json` (and the engine template) say 20 charities modelled with $16.7 million, 11 charities and the Rapid Response Fund ($7.4 million, 31%) not modelled. | Correct both to the fact's figures (20 modelled, $16.7M; 11 and the fund, $7.4M, 31%), or drop the typed numbers. |

Verdict: pass
Model-sha: 57acb0df453547efedfa0b246d429f3e586ced33a8d51c0f13820140c8b37a84
Rules: 0.3.9
