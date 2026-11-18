# Audit round 4 (scoped verification): Global Alliance for Improved Nutrition (GAIN)

## Scope
Only the five findings of round 3 and the rows that fixed them: `summary`, `ff_company_cost_per_person`, the new `ff_compliance_uov` and its entry in `outcome_total`, `ff_others_vs_gain`, `pol_attribution_share_shared`, `ff_attribution_share_shared`, and `ff_counterfactual_adj`'s explainer. Also the writeup's credit sentences, read for consistency (not edited).

Result: 3.81 years of healthy life per 1,000 dollars at the defaults (3.806; round 3: 3.82). check.ts: all models valid.

## Checked
1. Summary: no longer says "about a tenth"; it now says a quarter of the benefit depends on outside support and GAIN is credited with `{{row:ff_attribution_share_shared}}` of that support. Matches the model.
2. `ff_company_cost_per_person` is back (0.05 / 0.08 / 0.12, Horton, Mannar and Wesley 2008, p. 6, quote kept). `ff_compliance_uov` follows 2.21's recipe (same shape as the won-rule cost rows of the climate models): `-ff_people * cost * $uov_per_ln_consumption / (compliance_cost_payer_multiple * lmy_na_consumption_per_person_2024 * survey_to_na_world_median)`. The payers' consumption is right for payers spread over the developing world: 3,109 times 0.68 is about 2,100 a person on the survey scale, times 1.2, so about 2,500; no new literal. It reads the branch's counterfactual, credit (`ff_attribution_share`, which carries `mobiliser_share`, so the cost halves with the slider as INV-22 asks), delivery, funging, wait and missing-data steps, not the evidence rows. It is added once, outside the `(1 + unmodelled_benefits_adj)` bracket, in `outcome_total`; no other row reads it. Size: about 3e-5 on the log scale a person against the iodine gain; the headline moves from 3.82 to 3.81 (well under 1%), in line with the round-3 estimate that the cost is small.
3. `ff_others_vs_gain` is 0.5 / 0.7 / 2; the explainer names the supporters (UNICEF, Nutrition International, Food Fortification Initiative, Iodine Global Network), that programmes have several supporters, and GAIN's spending of about a cent per person reached. It says plainly that there is no reference class, so it stays a judgment with its basis stated. Share used: 59% (33% to 67% in the shared row; with the mobiliser's share at 100%).
4. `pol_attribution_share_shared` is 0.2 (0.1 to 0.4); the anchor, four or more partners, gives an equal split of a quarter or less, so 20% sits under it. The count of partners is still not sourced, but the explainer calls it a judgment.
5. `ff_attribution_share_shared` is `1 / (1 + ff_others_vs_gain)`; `ff_counterfactual_adj`'s explainer now says "GAIN's and the other organisations'" outside support.
- Text rules: no peer comparison, no "effective altruism". The new rows are short and plain.
- Writeup (`writeups/global-alliance-for-improved-nutrition-charityevals.md`): the credit sentences agree with the model (the share among outside supporters with governments and companies under the mobiliser's share; companies' cost of 5 to 12 cents netted from the benefit; a quarter depends on support; `{{row:ff_attribution_share_shared}}`).

## Findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | `ff_company_cost_per_person` | The cost is in 2008 dollars (Horton et al.) and is used at 2024 consumption without a price adjustment; the cost is understated by up to about 1.5 times, which moves the headline by under 1%. | Optional: multiply by `@cpi.usa_2024 / @cpi.usa_2008` in `ff_compliance_uov`, or say in the explainer that it is in 2008 dollars. |
| 2 | low | writeup, "Audits" paragraph | Says "GAIN's share of fortification resources is worked out from food companies' published cost of fortifying", which describes the round-1 fix and is no longer how the share is built. | Reword the sentence to the share among outside supporters, with the companies' cost netted from the benefit. |

Verdict: pass
Model-sha: ae2c4c69eb8dd0750457abd64abeb5999891b4a74fe577dbddaa9f47153fdbb9

Re-stamped (17 Nov 2026): the round's low findings fixed in wording (and, for the rainforest model, rows no longer read removed and the branch weights kept free of the mobiliser's share); no value changed at a 100% mobiliser share.
