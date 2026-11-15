# Verification round (scoped)

Result: −3.958 ced/$ = −4.354e-4 years of healthy life per $1,000 (combined range −0.2019 to −9.39e-7). Verdict: **pass** (no high finding; 0 medium, 1 low).
Model-sha: 0614bc1336bde3675bf8897d0d6d33fbe45769c418b3ae7a264e8d37c6f4aa3d

Verdict: **pass**

Scope: only the six changes after round 2 (findings 1, 4, 5, 6, 7, 8, 9); findings 2 and 3 are out of scope by the owner's decision. audit-model.ts: 0 findings; check.ts: all models valid.

Changes checked:
1. `def_cost_egg_share` 0.25 (0.05 to 0.5): correct. The CDFA notice p. 14 does say "Egg producers in California face higher costs by $72 million" (fetched and read), and p. 12 gives $40 of $50 a person for eggs. 72 / 300 = 0.24, 72 / 290 = 0.248, so 0.25 sits at the anchor. The net arithmetic in the fact's note is right: 1,195 − 950 − 18 + 63 = 290, rounded to 300.
2. `ca_pop_share` 0.116: 39,431,263 / 340,110,988 = 0.11594, so 0.116. `def_egg_states_vs_ca` = 0.23 / 0.116 = 1.983 (rows helper). It is used once, in the compliance-cost formula (`def_cost_egg_share * def_egg_states_vs_ca + 1 - def_cost_egg_share`), and the egg part now follows the same population share as the hens' reach. Consistent.
3. `def_evidence_adj` = 1: consistent with the reason stated (in-state housing laws are in `def_revert_share`, which is applied in the cost formula and in the gain). Total adjustment chain still reads `def_evidence_adj * def_counterfactual_adj * ...`. No double count remains.
4. `def_sows` explainer: the omission is reasonable, but the "under 0.1%" figure does not follow from the numbers beside it (see the first finding).
5. Fact `ca_prop12_net_cost_per_year`: the note shows the net arithmetic correctly, the low end is called a judgment in the explainer, and the p. 14 $72 million is cited. Correct.
6. Write-up: the summary reads as negative (headline span −0.0004, model −4.354e-4, matches), the drivers bullet on the laws' compliance costs matches the model, the summary's last sentence has its "and", and the history paragraph describes round 2 and its after-changes accurately (egg share 0.25, population-share scale, evidence step).

| Severity | Row | Finding | Fix |
|---|---|---|---|
| low | `def_sows` (explainer) | "Under 0.1%" for veal calves is not what the numbers say if the calves are "a few tens of thousands" against 700,000 sows (about 4% by head). It is presumably meant as the share of SADs or of the reach once weighted, but that is not stated, and a reader will compare the two numbers shown. | Say "a few thousand SADs-weighted, under 0.1% of the branch" only if checked, or drop the percentage ("a few tens of thousands, small against 700,000 sows"). |
| low | `def_cost_egg_share` (explainer) | The explainer calls the 0.25 "the net egg part: California's egg producers' $72 million of the roughly $300 million net", but the $290 million is built from the SRIA's consumer-expenditure figure less the retailers' margin transfers plus pork retailers' loss, in which producers' costs are by the note's own statement not quantified. So $72 million is not clearly a part of the $290 million, and the egg residual of the consumer figure (about $956 million of eggs against $968 million of margin) is near zero. The ratio 0.25 is a defensible judgment inside the 0.05 to 0.5 range, but "the net egg part is $72 million of the $300 million" overstates the identity. | Word it as the judgment it is ("a quarter, the size of the egg producers' $72 million against the $300 million"); no number change. |
