# Audit r4: habitat-for-humanity-charityevals-awareness (scoped verification)
Result: 1.180e-5 uov/$ = 0.0059 years of healthy life per 1,000 dollars (combined range 9.1e-6 to 3.82; model's own ranges -0.078 to +4.06).
Model-sha: 5e196022a9b5b3b8d2380c44f14f539bf9bfad34579f5fa0f5c7d81b31254bee
Verdict: pass

Scope: only the changes of commit bc46382f to the model, its write-up and scripts/beneficiary-countries.ts: each round 3 low, the new he_illness_adj row, the outcome_total formula and the narrowed unmodelled_benefits_adj. Mechanical: audit-model has no high (its only notes are the judgment-share warning and the far-below medium from netting public money, judged in r3); check.ts valid; simulation-check stable, exit 0 (5% -9.2x, 50% 1x, 95% 40.8x the best guess; the sign crosses, allowed for negative results).

| Severity | Row | Finding | Status |
|---|---|---|---|
| none | r3 #1, unmodelled_benefits_adj, he_illness_adj, outcome_total | Resolved as specified. Crowd-out dropped (explainer says why: net, under 1%); unmodelled_benefits_adj is 0.04 (-0.02 to 0.1) for zoning/tenure and attitudes; he_illness_adj is a ranged judgment 0.05 (0 to 0.2), side_effect "added", section adjustments, anchored on the international model and Cattaneo et al. 2009, deaths left to he_mortality_ratio. outcome_total adds `he_illness_adj * he_gross_value * he_total_adj`, so illness sits on the Home Equals gross value only, with the branch's own adjustments; the US term no longer carries it. It shows in the tornado and moves with side_effect_weight. Result 0.0056 to 0.0059 as predicted. | resolved |
| none | r3 #2, beneficiaries, beneficiaries_note | USA removed (negative contribution), the 13 country shares set to the values r3 gave (sum 1.0), note rewritten as r3 asked. The international model's shares were also refreshed (out of scope here). | resolved |
| none | r3 #3, write-up | "What isn't modelled" now says the benefits "add a few percent of what households gain, which is most of the result because the gain and the cost nearly cancel"; the Year 3 sentence says "from the 2023 launch". The missing comma before "any change in public attitudes" is still absent (cosmetic). | resolved |
| none | r3 #4, staff_cost_share, pae_spend, he_payer_cost_per_person | "(56%)", "about 6% above FY2025's" and the new label are in. | resolved |
| none | r3 #5, he_recipient_share | The explainer drops the unsourced "urban premium of about a quarter" and says urban prices take most of the money premium, without numbers (the Kenyan lines were unverifiable, 403). That is the honest option; the claim is qualitative and consistent with the Nairobi evidence checked in r3. | resolved |
| low | beneficiaries | The shares are r3's, computed with the old 0.08 on gross for every country. With 0.04 plus the 0.05 illness share the contributions shift slightly toward Home Equals (0.09 instead of 0.08 of gross), so the shares are a few percent off at the new defaults. They feed only the distance slider and the note says shares follow contributions. | open, optional: recompute at the new defaults |
| low | write-up | The comma/"and" before "any change in public attitudes" in "What isn't modelled" is still missing. | open, cosmetic |

No high or medium findings. Sources: nothing new to fetch; the changes add no new observed figures (Stacy et al. 2023 and Cattaneo et al. 2009 were already cited and are judgment anchors).
