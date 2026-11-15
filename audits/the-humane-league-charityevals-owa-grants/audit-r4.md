# Verification round (scoped)
Result: 0.00021 years of healthy life per $1,000 (ced per donor dollar 1.910). Verdict: **pass**.
Model-sha: 95a14433e99c5e5baa37f4b73e05359b4ef4bd1dd421a56ff4183f94dd348b86
Scope: only the round-3 fixes (H1, M1, L1 first part, L2, the two explainers). audit-model.ts: 0 findings. check.ts: all models valid.

Verdict: **pass**

## Round-3 fixes checked
- H1 resolved. legal_defence_gift = 50,000 (observed, Form 990 Schedule I Part II); apa_grant_federal = 15,000 (judgment, 5,000-35,000, reason in the explainer from the grant announcement's named projects); apa_grant_local = 351,300 - 50,000 - 15,000 = 286,300 (matches the live row). apadef_coalition_share = 15,000 / (15,000 + 0.03 x 14,619,381 + 8,000,000) = 0.001774 (live row matches). apalocal_coalition_share = 286,300 / (0.04 x 14,619,381 + 1,500,000) = 0.1373 (matches). No reference to apa_grant_federal_share is left. With the federal part set to 0 the result moves from 1.91 to 2.25 ced per donor dollar (about 18%), so the new judgment is no longer a dominant driver.
- M1 resolved. Summary and se_market no longer say "two thirds". The write-up's "nearly three quarters" fits uk_grant_share_of_budget = 0.73; "about a tenth" fits owa_attribution_share_shared = 0.0976; "more than a quarter of programme spending" fits 4.26 / 14.62 = 29%; "a sliver" fits 0.0018; "the UK space commitments are more than the whole net result" holds (with ukbcc_chickens = 0 the net goes from 1.91 to -0.67, so they contribute 2.58). The headline fallback 0.0002 matches the live 0.00021. History says round 3 (1 high, 1 medium, 2 low), matching audit-r3.
- L1, part 1 resolved. us_sales_law_population_share is 0.23 (0.23-0.27), the same as other-programmes' def_pop_share, with the ERS quote and the "more than 23%" note.
- L2 resolved. The note on sads_per_broiler_space_only cites Knowles 2008 and Dawkins 2004 and says the high end allows for some lameness; the value is unchanged (0.03 / 0.1 / 0.22; a sixth of 0.64 is 0.107, 5% to 35% gives 0.032 to 0.224).
- Explainers. apadef_cost_egg_share says 0.25 is a judgment, not an identity (72 / 300 = 0.24, consistent). apadef_sows' veal wording is consistent with the cost note.

| Severity | Row | Finding | Fix |
|---|---|---|---|
| low | apadef_coalition_share (other-programmes' def_attribution_share) | The second part of round 3's L1 was left: the other-programmes pool leaves out the grants' $15,000 federal part, so the two THL models' preemption pools differ by under 1% (shares 0.0602 against 0.0598 for one pool). Accepted as deferred; no effect on any headline at display precision. | Add apa_grant_federal to def_attribution_share's denominator in the other-programmes model when it is next touched. |
