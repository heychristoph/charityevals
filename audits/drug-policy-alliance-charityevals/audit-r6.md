# Audit round 6 (scoped verification): Drug Policy Alliance

Scope: credit rule 2.24, step 5. Two shares re-judged. `od_attribution_share_shared` 0.05 (0.02 to 0.15) to 0.20 (0.08 to 0.40): OnPoint NYC (pays for and runs the centres) and the city's health department out of the denominator. `can_attribution_share_shared` 0.15 (0.05 to 0.30) to 0.20 (0.08 to 0.35): governors' budget drives out. Headline -0.00419 to -0.00444 (net harm; `headlines.ts` prints -0.00443627). `check.ts` passes.

Checked:
- Classes: `od_attribution_share` and `can_attribution_share` are `"credit": "win"` and read `mobiliser_share`; right (centres, laws and budgets others carry out).
- Harm reduction denominator: DPA, VOCAL-NY, Housing Works and the SIF NYC coalition; no adopter left in; the operator and health department are under s. Anchor: four named campaigners, equal split 25%; DPA a national group among local ones, so 20% (8% to 40%). Real and stated.
- Legalisation denominator: DPA, VOCAL-NY, the NYCLU, Citizen Action and the cannabis lobbyists campaigned; governors and legislatures are under s. Net harm (traffic, use disorder) shares like credit, and does: `can_uov` and `ue_can_*` read the same share.
- No double cut: `od_counterfactual_adj` and `can_counterfactual_adj` are 1; `od_period_share`/`can_period_share` cut by time, not by party.
- Centres' running costs: the model's cost is DPA's own spending only (`cost_total`); there is no row for the centres' running costs, and no `*_public_cost_uov` row. Before, the 5% share stood in for them (old explainer: the resources behind the deaths averted are mostly the centres' running costs). Now they sit under s but are not netted. See finding 1.
- Text: no comparison with other charities, no "effective altruism".

Findings:
| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | medium | od_uov (no cost row) | Rule 2.24 says s applies to the benefit net of the mobilised resources' cost. The New York centres' running costs (OnPoint's budget, mostly non-government money) are not subtracted anywhere; the old low share hid this. The deaths-averted benefit is now credited at 20% x s with no cost. | Add an input for the centres' yearly running cost (OnPoint's accounts), valued at the cost of funds as in the `*_public_cost_uov` pattern (2.23), divided by `campaign_years` and multiplied by `od_credit_adj`'s used share (`od_attribution_share`); subtract it inside `od_uov`. The other-wins multiple needs the same cost scaled by `(1 + od_other_multiple)`. |
| 2 | low | can_attribution_share_shared | Explainer says "Our judgment" but not what it rests on. | Add the anchor: about five named campaigner groups, an equal split of 20%. |
| 3 | low | can_attribution_share_shared | The 501(c)(4) sister's spending is excluded from the cost and not named in the denominator. | State that it is counted among the campaigners (inside the 20%) or leave out explicitly. |

Verdict: fix needed
Model-sha: 58352cbecf099029e95cd60c6a2412bf2dfffc26df7efd1538946a70661c387f
