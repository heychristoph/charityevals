# Verification round (scoped)
Result: -0.000428899 years of healthy life per $1,000 (ced per donor dollar -3.899). Verdict: **pass**.
Model-sha: 366ae6caa5ce800feb8dd7db038a8815ac42b38e966a8f21f1f56a5b6dfb35e0
Scope: only the mechanical round-5 changes (nine judgments moved into shared facts; one coalition pool with the grants' federal part in the denominator). audit-model.ts: 0 findings. check.ts: all models valid.

Verdict: **pass**

## Checked
- Moved values. Every moved row is a pure read (`@the_humane_league.*`, `@farm_animal_laws.*`) with the same id and label as before; the facts hold the former values and reasoning: owa_coordination_cost 0.75/1.5/3.0m; uk_switches_in_count 0.1/0.4/1.85m; member_switches_in_count 0.5/1.6/3.5m; us_sales_law_population_share 0.23/0.23/0.27 (ERS quote, "more than" 23%); ca_population_share 0.116 (39,431,263 of 340,110,988 = 0.1159); ca_prop12_sows 0.4/0.7/0.9m with the 400,000 low end sourced in source.note (National Hog Farmer, read from search summaries, stated); ca_prop12_cost_egg_share 0.05/0.25/0.5 (CDFA p. 14 $72m of about $300m); us_sales_laws_revert_share 0.1/0.3/0.6; us_preemption_opposition_risk_cut 0.03/0.17/0.4 (Baumgartner 2009, Bergan and Cole 2015). Explainers keep their reasoning and sources.
- One pool. def_coalition_spend = @farm_animal_laws.us_preemption_coalition_spend_2025 = 8.5m (3.5-20.5m), the whole coalition. def_grant_federal = @the_humane_league.apa_grant_federal (15,000). def_attribution_share = def_spend / max(def_coalition_spend, def_spend + def_grant_federal) = 0.4386m / 8.5m = 0.0516. This equals the grants model's apadef_coalition_share denominator max(pool, apa_grant_federal + def_share_of_total x program_expenses) (same def_spend term) and the ASPCA farm model's def_spend / (def_spend + max(pool - def_spend, 0)) = def_spend / max(pool, def_spend): same total in all three.
- Round-4 low finding (grants' federal part in the denominator): resolved.
- Headline change -0.000435367 to -0.000428899 (1.5% smaller loss): explained. The attribution share falls from 0.4386/(0.4386+8.0) = 0.0520 to 0.0516 (-0.7%); it multiplies both the defence benefit and the compliance-cost chain, whose net is only part of the model's result, so a 0.7% move on the gross defence term gives about 1.5% on the net. No other row changed value.
- Summary: still holds (no coalition dollar figure, no comparisons).

| Severity | Row | Finding | Fix |
|---|---|---|---|
| low | write-up, "State-law defence" bullet | Says the coalition's spending is "about $8 million"; the pool is now $8.5 million (3.5-20.5m). | Change "(about $8 million)" to "(about $8.5 million)" in writeups/the-humane-league-charityevals-other-programmes.md line 22. |
Re-stamped (15 Nov 2026): this round's low findings fixed in explainers, write-ups and the egg-share fact's wording; no value changed.

Re-stamped (16 Nov 2026): pre-audit cleanup: shared facts read (US layers, preemption chance, market leakage, evaluator side effects), reference classes named, ranges widened where evidence is thin; headline unchanged. Mechanical: headline unchanged, against 9d3d36e4.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 1b0eb29e.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7224423b.
