# Audit round 6 (scoped verification): Ambitious Impact (charityevals)

## Scope
Only the overlap change of docs/normalization.md 2.24 for the giving organisations it incubated: rows `egi_credit_share`, `egi_shared_moved` (the old `egi_money` formula), `egi_money`, `egi_costs_value`, the shared fact `@meta.shared_credit_donor_side` (0.5, 0.3 to 0.7), the summary and writeups/ambitious-impact-charityevals.md. Headline 252.9 to 252.45 (`scripts/headlines.ts`: 252.448). The earlier rise from 17.7 to 253 (live read of a founded charity) is not re-audited.

## Checked
1. Share taken once: `egi_credit_share = 1 - @meta.shared_credit_donor_side` (0.5); `egi_money = egi_shared_moved * egi_credit_share` (229,708 = 459,416 x 0.5); `gh_money_moved = egi_money + f2g_money` feeds `moved_value` and `moved_per_dollar` only; the share is not applied again anywhere. `egi_costs_value` = orgs x budget x wait x counterfactual share x `egi_credit_share` x `gh_prior_dollar_value` x `mobiliser_share`: the running costs take the same factor once, as the money does.
2. No set or shared row changed: `shifted_dollar_value`, `moved_dollar_net_value`, `gh_moved_dollar_net_value` are as before. With `mobiliser_share=0.5` (`scripts/_rows.ts`), `egi_costs_value` halves exactly (4,693.94 to 2,346.97) and `egi_money` is unchanged, since the mobiliser share is applied only in the value rows; the headline falls to 76.8 because the live-read founded charities' own models also take the share, not because of this change.
3. Overlap is the right reading: the giving organisations are founded by Ambitious Impact and ask the donor, so both moved the same dollar; none has a model on the site, so nothing else credits that dollar, but the organisation's own work (asking, platform) is real and is the donor-side share, so crediting Ambitious Impact with the whole dollar would overstate it and crediting nothing would ignore the incubation. The other 0.5 of the credit is simply not on the site; the judgment (0.3 to 0.7) is on the fact, so it is not hidden. `egi_credit_share`'s explainer separates it from `founding_counterfactual_share`.
4. `donor_cost_share = cost_total / (cost_total + if($resource_shares, salary_sacrifice, 0))` reads no money moved.
5. Summary and writeup use `{{row:egi_credit_share}}`, agree with the model (money and running costs at Ambitious Impact's share, the asking organisation takes the rest) and compare with no other charity.
6. Preflight: two low "generated ... out of date" lines only; passes.
7. Note (not part of the change): an equal-weight average over founded charities lets one high figure (ARMoR) dominate the 253; the owner may want to look at it (for example a cap or a range check), no fix required here.

## Findings
None.

Verdict: pass
Model-sha: 8f0a2bb4e05047305821c004cb11c8bddd33061082199471edbdd8854fd2adb2
Rules: 0.1.0

Re-stamped (18 Nov 2026): NOVAH now has charityevals' own model (novah-charityevals), which the rankings show in place of Ambitious Impact's idea-stage estimate; value_destinations reads it (#charityevals:novah). Headline 9.52 → 9.35 (−1.7%). Mechanical: headline 9.52 → 9.354 (−1.7%), 13 rows changed, against HEAD.
