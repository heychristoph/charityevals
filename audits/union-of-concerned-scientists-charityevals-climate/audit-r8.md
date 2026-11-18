# Audit: union-of-concerned-scientists-charityevals-climate, round 8 (scoped verification of rule 2.23 and the 15 Nov fix-ups)
Result: -0.004510 t CO₂e/$ = -0.001514 years of healthy life per $1,000 (combined range -0.5057 to -4.534e-6), against 0.0018 after the non-death change (sign change). Verdict: pass.
Model-sha: de68eeeeabe70da8ebc7ce4dd960ce55047e364fd912a628edf195b39b87d8cc
Rules: 0.3.10
Scope: the rows added or changed by commit 7e73f6cd: ira_public_usd_per_year, ira_public_cost_uov, uov_counted_per_year, the bridge row (0.6 side-effect form), the summary and the write-up sentence stating the result. Programmes and sources of earlier rounds not re-audited.
Mechanical: audit-model exit 0, "Findings (0)"; check.ts all valid.
Previous round: round 7's two lows were fixed earlier; not re-examined.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | "averts about 0.0052 tonnes (about $190 a tonne)" is the figure after the household and compliance rows but before the law's public money; at the 0.6 bridge it reads 0.0053 ($189). The sentence goes on "but the act ... buys them with public money", so it is not read as the net. | (560,688 gross t - 33,460 t) × 0.33 / 32.82M = 0.0053. | Write "about 0.0053 tonnes (about $190 a tonne)". | none |
| 2 | low | presentation | write-up Climate paragraph | Describes the household money as netted but says nothing of the law's other public money that the model now nets (the headline sentence does). | Row ira_public_cost_uov. | Optional: one clause "The act's other public money counts at what it costs taxpayers." | none |

## Sources checked
- ira_public_usd_per_year: $50.15e9 as for the other two models (65e9 × 0.85 - 60e6 × $85); household share removed once, 45Q money removed with the 60M t a year the tonnes row drops.
- ira_public_cost_uov: -50.15e9 × 2.6194e-5 × 1.4427 × 0.3 × 4.116 × 0.00112 = -2,620.9 (evaluated); same p_success, discounted_years and ira_total_adj as ira_downstream in outcome_total (ira_downstream × ira_total_adj); /period_years in uov_counted_per_year (-677.7 a year = -2,621/4 + 10.1 - 32.6).
- Bridge: `1 + $side_effect_weight × @climate.nondeath_damages_vs_deaths`, matching the unit's conversion.
- Facts as in the Environmental Defense Fund round 13 (CRFB and 45Q quotes fetched and present).
- Sign change follows from the rule, not an error: 1,489 tonnes per unit of value, so the gross 560,688 tonne-years are worth about 377 units of value a year; the law's public money costs 655 a year. The law gives about three fifths of the gross tonnes (about 226 units), the money costs about 2.9 times that; Evergreen's model (law nearly all its tonnes) has the same ratio. Outcome -448,503 t.
- Summary and write-up say a small net harm of -0.0015 (matches -0.001514), the act about three fifths of the gross tonnes, public money about $65 billion a year (the law's figure; $50 billion enters after the household and 45Q parts); no comparison with other charities.

## Drivers
The law's public cost (cost figure, payer multiple) against the value of its tonnes; UCS's attribution share cancels between them (it scales both), the sign rests on the cost per tonne.

Verdict: pass (no high or medium finding; two lows).
Model-sha: de68eeeeabe70da8ebc7ce4dd960ce55047e364fd912a628edf195b39b87d8cc
Re-stamped (15 Nov 2026): round 8's low fixed: summary's gross tonnes per dollar 0.0052 -> 0.0053 (text only)

Re-stamped (16 Nov 2026): EPA methane rule and Advanced Clean Cars II dates read the shared facts (climate.us_oil_gas_methane_rule_*_year, climate.ca_advanced_clean_cars_ii_*_year); same values. Mechanical: headline unchanged, against 2492e3fc.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 8904b83b.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7224423b.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.
