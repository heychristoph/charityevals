# Audit: carbon180-charityevals, round 6 (verification of the round 5 text fixes)
Result: -0.01505 tco2e/$ = -0.002959 years of healthy life per $1,000, unchanged. Verdict: pass (no high or medium finding).
Model-sha: a929cf5c4c563b678a82cf2fba41f3d6b2c4ca89a7e850e3aea9836bdedde3aa
Scope: round 5's mediums (1, 2) and lows (3, 4) only, in the uncommitted diff of the model and write-up.
Mechanical: audit-model.ts 0 findings; check.ts all models valid, -0.002959.

| # | Severity | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|
| 1 | resolved (was medium) | write-up "How the model works" | Stale "pending a site-wide rule" sentence replaced by the netting statement citing section 2.23 and listing the credits, hub grants, farm and forest money and public purchases. Matches the model's rows. | grep: no "pending a site" left in the model or write-up | none | none |
| 2 | resolved (was medium) | `total_adj` and `dac_counterfactual_adj` explainers | Both stale sentences replaced; they now point to the branch's own `dac_public_cost_uov` (row exists) and the per-branch public-cost rows (2.23). | model diff | none | none |
| 3 | resolved (was low) | write-up "What drives the result" | New opening sentence: the public money's cost outweighs the tonnes, so the sign rests on the credits per tonne and the value of a tonne. Consistent with round 5's tornado and sign check. | write-up line 38 | none | none |
| 4 | resolved (was low) | `dac_hub_grants_usd` | Quote now "up to a total of $1.2 billion in two direct air capture, or DAC, facilities" and the title is generic; wording as given from the Utility Dive page (verified by the requester, not re-fetched here). | model diff | none | none |

Finding 5 of round 5 (NRCS page unreachable) was not in this round's scope and is unchanged.

## Sources checked
- Summary and write-up headline: -0.003 years, net harm, about $1,000 a tonne gross (1/0.000968 = $1,033); no comparison with other charities.
