# Audit round 7 (scoped verification): Cancer Research UK
Result: 2.232e-6 daly/$ = 0.00223 years of healthy life per 1,000 dollars at a 100% mobiliser share (before 0.00151). Verdict: pass.
Scope: adv_attribution_share_shared (was fact uk_act_campaigners_share 40% x adv_share_of_campaigners, now adv_share_of_campaigners alone), the removal of the fact and its waiver, and the compliance-cost row that reads the branch's used share.
Mechanical: scripts/check.ts valid (warnings on range and judgment share only, as before); headlines.ts 0.00223217.

## Checked
- The denominator is the campaigning groups only (Cancer Research UK, ASH, the British Heart Foundation, royal colleges, BMA, directors of public health); the government that drafted the law and Parliament that passed it are the carriers-out, now under the mobiliser's share. No co-advocate was dropped.
- adv_share_of_campaigners (0.25, range 0.15 to 0.40, judgment) is unchanged and reads as the share among the groups; its explainer names its basis (Smokefree UK campaign through four parliaments, part-funding of ASH, policy budget). With the British Heart Foundation's 0.125 the two charities sum to 0.375, inside the groups' whole.
- No double cut: adv_counterfactual_adj is 1 (the win-years row carries the "later anyway" counterfactual), so the government is cut once, by the mobiliser's share.
- Class: adv_attribution_share is credit "win" and reads adv_attribution_share_shared * mobiliser_share; research is "research"; info is "delivery" and reads no mobiliser_share. Right by 2.24.
- adv_compliance_uov still multiplies adv_attribution_share (the branch's used share), so the shops' and wholesalers' costs take the mobiliser's share like the benefit.
- Nothing else reads uk_act_campaigners_share: no model, fact, source file or text uses it. Its waiver line is gone, the label and explainer of the row no longer mention the 40%.

## Findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | generated/usage.json | The tracked usage index still lists uk_act_campaigners_share (one entry). | Regenerate the index with the project's usual script. |
| 2 | low | adv_share_of_campaigners | A pure judgment with no data anchor; the explainer says what it rests on, which is enough. The 15% to 40% range is wide enough for ASH and the colleges. | None. |

Verdict: pass
Model-sha: 5ff8990d1155bff1a1325070e0329cfb715fc1e18130848fca0a1130a73f4a17
Rules: 0.3.12
