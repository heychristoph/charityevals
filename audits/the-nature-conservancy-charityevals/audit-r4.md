# Audit round 4 (scoped verification): The Nature Conservancy (charityevals model)

Scope: credit rule 2.24, step 5. Shares re-judged to the share among co-arrangers, co-advocates and co-deliverers only: ocean, deal, prot, zdc, conv, fish (rows `<x>_attribution_share_shared`). Branches energy, siting, fscape, prana, rest and adapt newly classed (win; siting research) with a new `<x>_attribution_share_shared` and a used share `<x>_attribution_share = shared * mobiliser_share`. Also whether guarantors and insurers of the debt conversions are rightly co-arrangers.

Checked:
- `git diff HEAD` of the model: only those rows, their labels and explainers changed. Each new explainer names who is in the denominator, who is under the mobiliser's share (Bahamas and Ecuador for the debt savings and agencies; Pará's government, ranchers, packers and retailers; traders, banks and the soy chamber; developers, utilities and state agencies; farmers and the machinery subsidy; utilities, cities and governments paying into water funds; governments and fishers; governments, hotels and insurers funding and delivering schemes), and what the figure rests on.
- Counterfactual rows (`deal`/`prot_counterfactual_adj` = protection_effect, `energy`/`siting`/`fscape`/`prana`/`rest_counterfactual_adj`, and the 1 rows for zdc, conv, fish, adapt) cut what would have happened anyway; the shares split only what TNC caused. No party is cut twice, and none is left out of both. The two shares that stood in for the counterfactual (zdc, conv) have their own row at 1 with the years counted explaining it.
- `liv_attribution_share` (win) reads `deal_attribution_share` and `ocean_attribution_share`, which already carry the mobiliser's share: s enters once. The evaluator-side blend row at the end reads the `_shared` values (s = 1), consistent with the evaluator view reading models at 100%.
- Guarantors and insurers (IDB guarantee, DFC political-risk insurance, the arranging bank): rightly co-arrangers. Each brings an instrument and a design role in the deal, not spending on the conservation outcome; the conservation is paid for by the country's debt savings, which are mobilised and sit under s. Counting them in the denominator is also the conservative choice (the equal splits of 25% and 20% are the anchors, TNC above as designer and planner). The ocean explainer lists four arrangers and the deal explainer five; both are consistent with the roles named.
- Classes: ocean, deal, prot, zdc, conv, fish, adapt are rules, pledges, budgets or schemes others carry out (win), right. Siting maps are research others adopt (research), right. Energy (mine-land siting steered to developers' projects) and rest (funds paid in by utilities and cities) are win, right. fscape is win: farmers adopt, right. prana is the weakest fit (see low finding).
- Text rules: no comparison with other charities, no "effective altruism"; explainers short and plain.
- `npx tsx scripts/check.ts`: all models valid (existing range warnings only). `npx tsx scripts/headlines.ts`: 0.000754 years of healthy life per $1,000 at the defaults (0.00034 before; mobiliser share 100%).

Findings:
- Low: `adapt_attribution_share_shared` explainer puts insurers' modellers among the designers in the denominator and insurers among the funders under s. Fix: say "TNC's share among those who design the schemes, with insurers' and universities' modellers" and name only insurers that pay premiums or claims as mobilised ("the governments, hotels and community brigades that fund and deliver them, and the insurers that pay out").
- Low: `liv_attribution_share` label and explainer still say "TNC's share of each deal's resources". Fix: "TNC's share of each deal's credit, weighted by the people in it".
- Low: `prana_attribution_share` is a win, though TNC funds and runs the programme with its partners. Defensible because farmers' switching and the subsidy are carried out by others (and sit under s), but a mixed case; keep as is, or class as delivery only if farmers' costs are excluded from the benefit.
- Low: the new best guesses (0.4, 0.3, 0.15, 0.3, 0.25, 0.4, 0.5, 0.6, 0.6, 0.4, 0.6) are stated judgments anchored on who is named in the denominator, with no counts of co-advocates; the explainers say so. Acceptable.

Verdict: pass
Model-sha: 7365ef471c7bb3c9a7f622a9f09a81a0c7ddff62ff110114b883e4b9613a8d31
Rules: 0.1.0

Re-stamped (17 Nov 2026): the round's low findings fixed in wording (and, for the rainforest model, rows no longer read removed and the branch weights kept free of the mobiliser's share); no value changed at a 100% mobiliser share.
