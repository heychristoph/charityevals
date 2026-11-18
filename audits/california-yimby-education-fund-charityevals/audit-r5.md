# Audit round 5 (scoped verification): California YIMBY Education Fund

Scope: credit rule 2.24, step 5. The legislators' and housing department's staff time taken out of the denominators of the two coalition shares: row `adu_public_resources` removed, `adu_others_resources` shortened; `oth_lobbies_public_resources` renamed `oth_lobbies_resources` and re-judged $150m -> $100m ($30m-$300m).

Checked:
- Diff against HEAD for the changed rows only. check.ts passes. Headline 0.131 -> 0.2675 at the default 100% mobiliser share; the move is explained by the shares (ADU about 11% -> 24%, other laws about 9% -> 13%; weighted by the 85/15 split the ratio is 2.04, as observed).
- Denominators. ADU: Casita Coalition 990s plus the large lobbies' and groups' ADU spending; no legislator or HCD time left. Others: YIMBY Action's state share plus unions, affordable-housing developers, business groups, SPUR, AHLA, YIMBY Law and the building and realtor lobbies; authors' offices, committee staff and HCD enforcement removed. No co-advocate wrongly dropped.
- Branch class: `adu_attribution_share` and `oth_attribution_share` are `credit: win`, `<x>_attribution_share_shared * mobiliser_share`. Correct (laws others carry out).
- Double cut: `adu_counterfactual_adj` and `oth_counterfactual_adj` are 1 and the "anyway" cuts sit in `adu_followon_share` and the years a win counts, so the legislature is cut once (by s) and not also in an anyway row.
- Text rules: no peer comparisons, no "effective altruism"; explainers short; the removed "about 11% / 9%" figures are gone from the share explainers.
- Sources: the unchanged observed rows were not re-fetched; no changed row cites a new source.

Findings:
- [MEDIUM] writeups/california-yimby-education-fund-charityevals.md, the "The credit is..." paragraph, is stale: "about 11% for the ADU laws (15% of their spending against about $33 million ... and $20 million of legislators' and HCD's staff time) and 9% for the others (... against about $153 million: ... a judged $150 million from the rest of the coalition and the state)". Fix: "about 24% for the ADU laws (15% of their spending against about $13 million from everyone else: the Casita Coalition's $1.2 million from its 990s and a judged $12 million from the large lobbies) and 13% for the others (half their spending against about $103 million: YIMBY Action's state work from its 990s and a judged $100 million from the rest of the coalition)", then say once that the legislature's and the housing department's work is under the mobiliser's share. Recompute the two percentages from the rows before writing them (I back-solved them from the old text). The sentence on swings, "everyone else's resources behind the ADU laws", still holds.
- [LOW] `oth_lobbies_resources` explainer: the new $100m ($30m-$300m) says it is a judgment but not what it rests on beyond "bigger and more contested than the ADU ones". Fix: add one clause tying it to the ADU row, e.g. "about eight times the ADU lobbies' $12 million, for a dozen larger laws", or state that the old $150m was cut by the authors' and agencies' staff time (about a third).
- [LOW] Write-up "How this model was checked" says four rounds; add round 5 with the headline move 0.13 -> 0.27 once the verdict is pass.

Verdict: fix needed

Model-sha: 4d76753531a93058d756eaea4fd8cbc4653e66e4d9c2557f5223f1dff02afc1d
