# Audit round 9 (scoped verification): Environmental Defense Fund (health and nature)
Result: 0.000717 years of healthy life per 1,000 dollars at the defaults (was 0.000704). Verdict: pass.
Model-sha: 491423674e2f704a3525b80da8a5d4b9d0a380a9b6afa9ec3c83da3c8da0e812
Rules: 0.2.0

## Scope
Credit rule 2.24, step 5 (re-judged shares): fish_attribution_share_shared (30% to 50%, range 25% to 80%), ag_attribution_share_shared (20% to 35%, range 15% to 60%) and the newly classed ag_attribution_share (credit win, formula share x mobiliser_share). Nothing else re-audited.

## Checked
- Denominators: fisheries ministries and fishers' cooperatives (who adopt and carry out the rules) and, for farm emissions, farmers, agribusiness and governments are out; the remaining denominator is EDF and the outside groups and funders that design, advise and press (Rare, WWF, TNC named in the counterfactual row). No co-advocate dropped.
- Double cut: fish_counterfactual_adj and ag_counterfactual_adj name governments' own reforms, fertiliser prices and companies' own targets as "would have happened anyway"; the shares no longer cut those parties, so none is cut twice or left out of both.
- Class: farm-emissions practices and rules that farmers, companies and governments carry out are a win by 2.24; ag_attribution_share carries credit win and reads mobiliser_share (100%), as fish_attribution_share does.
- ag_total_adj and ag_dalys_raw (weight by ag_credit) read the used share; headline 0.000717 reproduced by scripts/headlines.ts. check.ts: all models valid.
- Text rules: no peer comparison, no "effective altruism"; explainers plain.

## Findings
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | ag_attribution_share_shared | Explainer is longer than the others and the 35% rests only on "one of a handful of large groups" (no count). | Optional: shorten to "EDF is one of a handful of large environmental groups working with growers and food companies. No published accounting: our judgment, 35% (15% to 60%)." |

No high or medium findings. Both anchors are stated judgments and the explainers say what they rest on.

Verdict: pass
Model-sha: 491423674e2f704a3525b80da8a5d4b9d0a380a9b6afa9ec3c83da3c8da0e812

Re-stamped (17 Nov 2026): the round's low findings fixed in wording (and, for the rainforest model, rows no longer read removed and the branch weights kept free of the mobiliser's share); no value changed at a 100% mobiliser share.
