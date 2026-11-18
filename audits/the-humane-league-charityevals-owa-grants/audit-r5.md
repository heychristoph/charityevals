# Verification round (scoped)
Result: 0.00021 years of healthy life per $1,000 (0.000210297; ced per donor dollar 1.912). Verdict: **pass**.
Model-sha: 85968f574c9e391c75fc6a541b80d926756fd1bf1af40714a1f1d7b178005d6e
Rules: 0.2.2
Scope: only the mechanical move of shared judgments into facts/the_humane_league.json and facts/farm_animal_laws.json, and the single coalition pool (def_coalition_spend, apadef_coalition_share). audit-model.ts: 0 findings; check.ts: all models valid.

Verdict: **pass**

## Checked
- Moved rows: owa_coordination_cost, apa_grant_federal, us_sales_law_population_share, ca_pop_share, apadef_sows, apadef_cost_egg_share, apadef_share_reverting, apadef_opposition_risk_cut each read their fact with the same id and label. Fact values agree with every former figure the earlier audits record (apa_grant_federal 5,000/15,000/35,000; population share 0.23-0.27; California 0.116; sows 700,000 best with the 400,000 low end; egg share 0.05/0.25/0.5; opposition cut 0.03/0.17/0.4); the fact explainers keep the old reasoning and sources, and the sows low end is now sourced in source.note. The former literals themselves could not be diffed (no repository history access in this round), so the 900,000 sows high end, the 0.1/0.3/0.6 revert share and the 0.75/1.5/3.0 million coordination cost were checked only against their explainers.
- Pool: def_coalition_spend reads @farm_animal_laws.us_preemption_coalition_spend_2025 (8.5m, 3.5-20.5m, whole coalition, label and explainer say so). apadef_coalition_share = 15,000 / max(8,500,000, 15,000 + 0.03 x 14,619,381 = 453,581) = 0.001765. The other-programmes model's def_attribution_share is def_spend / max(def_coalition_spend, def_spend + def_grant_federal) with def_spend = 0.03 x program_expenses and the same federal figure, so the total is the same pool and the same floor.
- Headline: share falls from 0.001774 (15,000 / 8,453,581) to 0.001765 (-0.5%). In this branch the compliance costs outweigh the animals' gain, so a smaller share makes the net less negative; the headline rises from 0.000210092 to 0.000210297 (+0.1%), as expected. Live headline matches.
- Compliance rows: apadef_compliance_uov reads apadef_cost_egg_share, apadef_states_vs_ca (= us_sales_law_population_share / ca_pop_share), apadef_share_reverting, apadef_opposition_risk_cut and the attribution share correctly; ukban_compliance_uov unchanged; both sum into the net.
- Summary and write-up: "a sliver" for the federal part, "about a tenth", "nearly three quarters", the headline 0.0002 and the compliance statements all still hold; no comparison with other charities, medians or peers.

| Severity | Row | Finding | Fix |
|---|---|---|---|
| low | audit trail | The former literals could not be diffed in this round. | Confirm once against the previous commit that 900,000 (sows high), 0.1/0.3/0.6 (revert share) and 0.75/1.5/3.0 million (coordination) equal the old values; no model change expected. |
Re-stamped (15 Nov 2026): this round's low findings fixed in explainers, write-ups and the egg-share fact's wording; no value changed.

Re-stamped (16 Nov 2026): pre-audit cleanup: shared facts read (US layers, preemption chance, market leakage, evaluator side effects), reference classes named, ranges widened where evidence is thin; headline unchanged. Mechanical: headline unchanged, against 9d3d36e4.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 1b0eb29e.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7224423b.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against cc9a04dd.
