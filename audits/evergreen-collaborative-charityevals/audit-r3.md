# Audit: evergreen-collaborative-charityevals, round 3 (scoped verification of rule 2.23 and the 15 Nov fix-ups)
Result: -0.02179 t CO₂e/$ = -0.006390 years of healthy life per $1,000 (combined range -0.2047 to -1.995e-4), against 0.0035 after the non-death change (sign change). Verdict: pass.
Model-sha: 2c63a6a5182cd62287f9dbf733c3adaeb9be947cfc6c44b11373a2953a67e71b
Rules: 0.3.0
Scope: the rows added or changed by commit 7e73f6cd: ira_public_usd_per_year, ira_public_cost_uov, uov_counted_per_year, the bridge row (0.6 side-effect form), the summary and the write-up headline sentence. Programmes and sources of earlier rounds not re-audited.
Mechanical: audit-model exit 0, "Findings (0)"; check.ts all valid.
Previous round: round 2's findings are not re-examined.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | write-up Climate paragraph | Does not say that the law's other public money is netted (the headline sentence does). | Row ira_public_cost_uov. | Optional: one clause in the Climate paragraph. | none |

## Sources checked
- ira_public_usd_per_year: $50.15e9 (65e9 × 0.85 - 60e6 × $85), household share removed once, 45Q money removed with the 60M t a year the tonnes row drops.
- ira_public_cost_uov: -50.15e9 × 2.6194e-5 × 1.4427 × 0.3 × 4.116 × 0.000448 = -1,048.4 (evaluated); same p_success, discounted_years and ira_total_adj as ira_downstream in outcome_total; /period_years in uov_counted_per_year (-257.0 a year = -1,048.4/4 + 4.0 + 1.1).
- Bridge: `1 + $side_effect_weight × @climate.nondeath_damages_vs_deaths`, matching the unit's conversion.
- Facts as in the Environmental Defense Fund round 13 (CRFB and 45Q quotes fetched and present).
- Sign change follows from the rule: 1,705 tonnes per unit of value, gross 149,710 tonne-years = about 88 units of value a year; the law's public money costs 262 a year (3.0 times), the law being nearly all the tonnes. Outcome -288,461 t.
- Summary: "averts about 0.012 tonnes (about $80 a tonne)" = the tonnes before the public money (0.01198, $83); net harm -0.0064 matches -0.006390; write-up headline -0.0064 matches; no comparison with other charities.

## Drivers
The law's cost per tonne against the tonnes' value; Evergreen's attribution share scales both and cancels in the sign.

Verdict: pass (no high or medium finding; one low).
Model-sha: 2c63a6a5182cd62287f9dbf733c3adaeb9be947cfc6c44b11373a2953a67e71b

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2492e3fc.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.
