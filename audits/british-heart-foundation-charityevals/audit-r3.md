# Audit round 3 (scoped verification): British Heart Foundation
Result: 1.123e-5 daly/$ = 0.01123 years of healthy life per 1,000 dollars at a 100% mobiliser share (before 0.01013). Verdict: pass.
Scope: adv_attribution_share_shared (was fact uk_act_campaigners_share 40% x adv_share_of_campaigners, now adv_share_of_campaigners alone), the removal of the fact, the compliance-cost row, and the class of the implementation-pilots branch.
Mechanical: scripts/check.ts valid (warnings on range and judgment share only); headlines.ts 0.0112270.

## Checked
- Advocacy denominator: campaigning groups only; the government and Parliament are under the mobiliser's share. adv_share_of_campaigners (0.125, range 0.05 to 0.30, judgment) is unchanged; BHF's quote (annual report p. 35) and its part-funding of ASH are the stated basis. With Cancer Research UK's 0.25 the two sum to 0.375, within the groups' whole. adv_counterfactual_adj is 1, so no party is cut twice.
- adv_attribution_share is credit "win", = adv_attribution_share_shared * mobiliser_share; adv_compliance_uov multiplies adv_attribution_share, so the shops' and wholesalers' costs take the branch's used share.
- Nothing else reads uk_act_campaigners_share (no model, fact or text; waiver line gone).
- Implementation pilots (impl): class research is right. BHF's award and the NHS trust's own staff time and facilities are what the pilot is made of; the trust carries out the pilot alongside BHF, so it is a co-deliverer in the denominator (impl_attribution_share_shared 0.6, 0.4 to 0.8; for awards of 150,000 to 200,000 pounds the award is most of it). What others do with a successful model, adoption across the NHS, is the mobilised part and is under mobiliser_share; impl_attribution_share = impl_attribution_share_shared * mobiliser_share. impl_counterfactual_adj is 1 because the years brought forward carry the counterfactual. It is not a delivery branch: BHF funds evaluated pilots, and the good comes from others adopting the result.

## Findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | adv_share_of_campaigners (explainer) | Says "smoking ... is a larger part of Cancer Research UK's policy work": a comparison with another charity, against the text rule. | Drop that parenthesis; keep "the rest is ASH's, the royal colleges' and the other groups'". |
| 2 | low | impl_attribution_share_shared | The 60% rests on "the award is most of it" without a figure for the trust's staff time. | Optionally add the trust's typical share (for example a fifth to a third of the pilot's cost) or keep as judgment. |
| 3 | low | generated/usage.json | Tracked index still lists the removed fact. | Regenerate it. |

Verdict: pass
Model-sha: 060044728b5918447a0ea3f40f327d58353d72b5e5f72267b8dac86413b48e79
Rules: 0.1.1

Re-stamped (17 Nov 2026): the round's low findings fixed in wording (and, for the rainforest model, rows no longer read removed and the branch weights kept free of the mobiliser's share); no value changed at a 100% mobiliser share.
