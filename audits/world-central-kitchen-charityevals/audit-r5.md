# Audit: world-central-kitchen-charityevals, round 5
Result: 1.158e-4 daly/$ = 0.116 years of healthy life per 1,000 dollars (combined range 0.026–0.517); cause median 0.0898 (×1.29). Verdict: **pass**.
Model-sha: f2548d422bbaaacef94c31f9b547f3164df43dc226db27b2644ca247668efcc0
Scope: verification of the rule 2 change only (evidence step on deaths averted only; food takes `*_goods_total_adj`; reading-only weight rows; attribution kept at 0.9; `wellbys_bridged` label; summary and write-up sentences). Not the whole model.
Mechanical: audit-model 0 findings; check.ts valid (0 expected values, none claimed); simulation-check 5% 0.525, 50% 1.00, 95% 1.81 × best guess; normalization-audit not rerun (coordinator).
Previous round: round 4 had no findings; rule 1 was applied in its round 1.

Checks done: gz_uov = people × (deaths × value × gz_total_adj + food × gz_goods_total_adj) and lm_uov likewise; the goods adjustments are the totals minus only the evidence factor (0.1977 vs 0.1680 in Gaza, 0.2372 vs 0.2017 elsewhere): nothing left unadjusted or adjusted twice. Illness in `dalys_direct` (0 here) keeps gz_total_adj, consistent with `gz_deaths_share_unadj`, whose numerator includes it. hi branch: hi_evidence_adj = 1 as formula, hi_total_adj and hi_uov unchanged in structure. Unadjusted rows recompute exactly (gz_dalys_unadjusted 166,033 = gz_uov_unadjusted ÷ uov_per_daly; deaths share 7.7% in Gaza, 1.0% elsewhere); `evidence_adj` (0.991), `total_adj` and the other averages are read by nothing on the result's path. Result moves 0.0994 → 0.1158 (×1.165), what removing 0.85 from about 92% of Gaza's and 99% of the poorer-country value gives. Summary "about 0.12", write-up headline 0.12, "a little above the median" (×1.29) and the adjustments sentence match the live result and the model. World Vision's relief deaths use 0.85 as the explainer says. `wellbys_bridged` is 0 and now unlabelled "(before adjustments)": correct. The two new judgment-free rows are formulas (no reason needed); gz_/lm_evidence_adj keep reason, anchor and 0.6–1 range.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | missing-adjustment | attribution_share_shared | Kept at 0.9 (0.75–1), but the food, 92% of Gaza's value, is valued from the charity's own food bill, so others' resources are not in the value counted, which is rule 2's case for about 0.95. The explainer's others' shares are small or already paid for: volunteers 1–2% of spending, restaurant partners are paid subcontractors inside the cost (29.4 million dollars). Only UN and Jordanian convoys and logistics in Gaza are a real others' contribution and the explainer gives no size for them. | Explainer text; cost_total includes subcontractors | Set best to 0.95 (range 0.8–1) and say that the others' share is the UN and Jordanian convoys and logistics in Gaza plus volunteers' 1–2%; or keep 0.9 and put a figure on the convoys' share. | +5% (to about 0.122) |

## Sources checked
None new: no source changed in this round.

## Drivers
Missing-data discount (0.1–1, 0.023–0.232), the dollars-per-DALY bridge, Gaza counterfactual share (0.074–0.166), baseline consumption in Gaza (0.16–0.083) and the consumption-to-UoV step; all judgment or shared assumptions (98% of the uncertainty). Food is now 92% of Gaza's value, so the model rests on baseline consumption, the months fed and the counterfactual more than on deaths averted; the best improvement would be a sourced Gaza per-capita food-gap figure for 2025 (IPC, WFP).

Verdict: pass
Model-sha: f2548d422bbaaacef94c31f9b547f3164df43dc226db27b2644ca247668efcc0
