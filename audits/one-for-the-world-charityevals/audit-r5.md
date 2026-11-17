# Audit round 5 (scoped verification): One for the World

## Scope

Only the overlap rows of credit rule 2.24 ("Overlap", docs/normalization.md): `caused_donations`, `givewell_shared_moved`, `givewell_credit_share`, `money_moved`, the shared fact `@meta.shared_credit_donor_side` (0.5, 0.3 to 0.7), and the summary and write-up text that quote them. Headline 12.8 to 7.4 years of healthy life per $1,000. Everything else is as audited in round 4.

## Checked

1. Sizing. `givewell_shared_moved` = caused_donations ($723,588) x `@meta.oftw_givewell_share_ay24` (0.841; $1,303,670 of $1.55M, source and note read) = $608,537. `money_moved` = 723,588 - 608,537 x 0.5 = $419,319 (engine). The share is of money moved to GiveWell-recommended charities, so it is the right base for "GiveWell's research also directed it".
2. Deducted once, at the right stage. `own_effect` (0.5) removes what donors would have given to GiveWell's charities anyway; the split then divides the dollars that remain between two organisations that both were needed (the one that brought the donor, the one whose research chose the charity). These are different cuts, as rule 2.24 ("two cuts, never the same one twice") requires. `money_moved` is read once downstream; no other row deducts the same money.
3. Mix of the credited money: see finding 1.
4. `donor_cost_share` formula reads no money moved (only cost_total and, with `$resource_shares`, salary sacrifice, in-kind and volunteer value). With `mobiliser_share=0.5` the headline is 3.717, exactly half of 7.434. With `resource_shares=1` it is 5.047.
5. Classification. The charity's pledge is to "charities GiveWell recommends", and 84% of its money (including grants to GiveWell itself) goes there on GiveWell's research. Sharing with GiveWell on that basis is fair. The 16% to other charities is not shared. The 0.5 is a labelled judgment (0.3 to 0.7), sourced to the problem statement in the Giving What We Can evaluation, not to an evidence split.
6. Summary and write-up use placeholders for the new figures ({{row:caused_donations}}, {{row:money_moved}}, {{row:givewell_credit_share}}) and agree with the model, apart from finding 2 and 3. No comparison with other charities.
7. Preflight: passes; only low lines "generated ... out of date" (distributions, usage).

## Findings

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | medium | value_destinations | The mix still weights the credited money 84% to GiveWell's charities, as if all of caused_donations were left. After the deduction the credited $419K holds only $304K to those charities (73%) and $115K to the others (27%), whose value per dollar is about an eighth. The value of a credited dollar is overstated: with the corrected mix the headline is 6.50, not 7.43 (-12.5%; tested in a scratch copy). | In value_destinations replace each `@meta.oftw_givewell_share_ay24` by `(@meta.oftw_givewell_share_ay24 * givewell_credit_share / (1 - @meta.oftw_givewell_share_ay24 * (1 - givewell_credit_share)))` and reword its explainer ("84% went ..." is the share of what it moved, the credited mix has less). Then run `npx tsx scripts/summaries.ts`. |
| 2 | low | moved_per_dollar | Explainer says "about one dollar of caused, discounted giving per dollar it spends", but the row is money_moved / cost_total = 0.55 now. The ratio of caused_donations to cost (0.95) is what the summary and write-up quote. | Reword: "about {{row:moved_per_dollar}} of discounted giving credited to it per dollar it spends; about a dollar before sharing with GiveWell". |
| 3 | low | write-up, "How the model works" | The "Value = giving caused ..." sentence omits the shared credit; "(30% to 70%)" is a typed figure. | Add "less GiveWell's share" to the sentence; render the range from the fact if a placeholder exists, else keep. |

Verdict: fail
Model-sha: 5ab92c0f4aa53fe2a7612883f13cf8e7733084b537865917018f16e45683452f
