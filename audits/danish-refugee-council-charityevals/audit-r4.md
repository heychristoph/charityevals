# Audit round 4 (scoped verification): danish-refugee-council-charityevals

Scope: credit rule 2.24, step 5. (a) The Mixed Migration Centre branch is newly classed `"credit": "research"`: its used share is `mmc_attribution_share_shared * mobiliser_share`, the shared share rises from 0.6 (0.3-0.9) to 0.9 (0.7-1.0), and a `mobiliser_share` row is added. (b) Every other branch is tagged `"credit": "delivery"`: relief (`attribution_share`), protection, peacebuilding, site management, Standby Roster, Denmark.

Checked:
- mmc denominator: now DRC's share among those who produce the research (the centre is part of DRC; partners help collect the 4Mi surveys). The EU, UNHCR, IOM and NGOs that use the results are out, under `mobiliser_share`. The old 60% had them inside. Correct.
- No double cut: `mmc_counterfactual_adj` (60%) removes research other sources (IOM tracking, UNHCR, academics) would have supplied; that is a different party from the users, so the users are cut once. `mmc_budget_informed` is the users' spending, which s credits net.
- mmc class `research`: right (results others adopt).
- sbr class delivery: defensible. DRC pays the expert and supplies the person; the host's team in the denominator are co-deliverers inside one team, not an adopter of a result. 2.24 logs technical assistance as classed whole (delivery or mobilised); the sibling NRC model classes its NORCAP identically. It is the one borderline call (finding 1).
- pro, pbd, sit, dnk, relief: own services, legal representation, community work, site management by DRC's own staff, own spending in Denmark: delivery. Confirmed. (Site management coordinates other agencies, but the 25% share already counts only DRC's part of the effort.)
- Text: no peer comparisons; the mmc explainers are short. `mobiliser_share` explainer is the standard one.
- check.ts: all models valid. Headline 0.0695 years of healthy life per $1,000 at the defaults; the mmc branch is small, so the move from 0.6 to 0.9 (times s = 100%) barely changes it.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | class | sbr_attribution_share | Delivery is right for seconding a paid expert, but the row's value is judged as host's team and budget versus DRC, and `sbr_budget_influenced` is the host's budget; if the owner prefers the strict reading of "spending that advice changed" (mobilised), the class would be `win`/`research` and the share re-judged to experts' pay versus the host's team. | normalization.md 2.24 (mobilised list; deferred technical-assistance line). | Keep delivery, now; revisit with the deferred blend (own share + s times the rest) for all technical-assistance branches together, NRC's NORCAP included. | none now |
| 2 | low | source | mmc_attribution_share_shared | "Partners help collect the 4Mi surveys" is stated without a source; 90% (70-100%) rests on it. | Explainer text only. | Cite the Mixed Migration Centre's own description of 4Mi data collection (partners and enumerators) or say "our judgment: DRC runs and pays for most of it". | none |

Verdict: pass (0 high, 0 medium, 2 low)
Model-sha: 09f102d3b50f602c936aae47f904c81e986cf2e2a47bb2c3c7553fc094958fb7
Rules: 0.3.4

Re-stamped (17 Nov 2026): the round's low findings fixed in wording (and, for the rainforest model, rows no longer read removed and the branch weights kept free of the mobiliser's share); no value changed at a 100% mobiliser share.
