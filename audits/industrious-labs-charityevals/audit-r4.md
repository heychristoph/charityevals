# Audit: industrious-labs-charityevals, round 4 (scoped verification of rule 2.23 and the 15 Nov fix-ups)
Result: -0.006819 tco2e/$ = -0.001835 years of healthy life per 1,000 dollars (combined range -1.811 to -1.9e-6). Verdict: pass.
Model-sha: 53c8f72c1466c9da167bec63233d36229132cd02ece3e187e5423f48c35c85a4
Rules: 0.3.9
Scope: the changed rows only: `uov_per_year`, the explainers of `air_morbidity_share` and `iis_deaths_per_year`, the tonnes bridge's damage-beyond-deaths factor, and the write-up's headline sentence. No public-money branch (its EPA and district rules carry compliance costs through the 2.21 compliance rows; no credit, grant or levy), so rule 2.23 adds no row here.
Mechanical: audit-model 0 findings (warnings only: range runs from harm to good, 90% judgment share); check.ts all models valid; invariants none.
Previous round: round 3 low #3 (morbidity share multiplied EPA's steel deaths): resolved.

Checked:
- `uov_per_year` = `((s46_health_uov + s53_health_uov) * (1 + air_morbidity_share) + iis_health_uov + s46_compliance_uov + s53_compliance_uov + iis_compliance_uov + coke_compliance_uov) / period_years`: the share now multiplies only the two district rules, whose deaths come from the district's NOx modelling (mortality only). `iis_health_uov` stays inside the sum, once, with its own years, wait, counterfactual, credit, delivered share and missing-data step, so nothing is dropped or doubled.
- `iis_deaths_per_year` and `air_morbidity_share` explainers state exactly this; the fact's note ("monetized fine-particle benefits", illness included) supports it (GAO B-336203 verified in round 3).
- Bridge: the damage-beyond-deaths factor is `1 + $side_effect_weight * @climate.nondeath_damages_vs_deaths`, matching the shared conversion.
- Effect: the change drops a 3.6% uplift on EPA's deaths (about 0.4 of a net -74 uov); result -0.00182 to -0.00184 reproduces at the defaults. The write-up's headline sentence (-0.002, "a small net harm") still holds; it does not mention EPA's illness share and makes no comparison.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| (none) | | | | No high, medium or low finding in the changed rows. | | | |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `@climate.us_iron_steel_neshap_2024_deaths_per_year` | gao.gov/products/b-336203 | verified (round 3), unchanged | the figure includes illness, which is why the share leaves it |

Verdict: pass (no findings).
Model-sha: 53c8f72c1466c9da167bec63233d36229132cd02ece3e187e5423f48c35c85a4

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2492e3fc.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7224423b.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.
