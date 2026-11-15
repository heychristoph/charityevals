# Audit: union-of-concerned-scientists-charityevals-food, round 4 (verification of the compliance-cost rule 2.21)
Result: 5.069e-7 uov/$ = 2.534e-4 years of healthy life per $1,000 (combined range 4.565e-6–0.01407); cause median 0.001995 (×0.127). Verdict: pass.
Model-sha: 2d22bf37ab4d34b8f8e5357bffdcca910e7cdae1415bccf0f4dbe99bdcca6a32
Scope: scoped verification of the changed rows (one sentence appended to `wetland_flood_damage_study`'s explainer; the `beneficiaries` object was only reformatted); headline unchanged.
Mechanical: `audit-model.ts` exit 0, lint one low (spread), no high or medium; invariants none.
Previous round: not applicable (verification of one changed row).

Verdict: pass

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | wetland_flood_damage_study | "all farmers lose through lower prices" is looser than the source: AER-765 (p. 62) says wetland owners "would have minor increases in farm incomes" while farmers without wetlands to convert, and farm income in total ($1.6–3.2 billion), fall. Also the report is a 1998 study of ending Swampbuster, not a regulator's impact analysis of the 2025 case. | Conclusions section of AER-765, read from the local copy. | Reword: "finds converting farmers would gain only minor income and farm income as a whole would fall by $1.6–3.2 billion through lower prices". | none |
| 2 | low | presentation | summary | "It is far below its peers" compares the model with other charities (owner rule). Not a changed row. | Summary text. | Delete the clause; keep the stated reasons. | none |

The conclusion (no cost to farmers counted) is sound: the only quantified effect on farmers is a net farm-income gain from keeping the wetlands, and consumers' gain from cheaper crops is not a regulator figure. Counting nothing is the conservative and documented choice. No search found a regulator impact analysis of the Swampbuster challenge. No formula changed.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| (sentence) | https://ers.usda.gov/sites/default/files/_laserfiche/publications/40845/32658_aer765h_002.pdf | verified | Short-run 5.8–13.2 million acres profitable to convert; net cropland 2.2–5.0 million; farm income down $1.6–3.2 billion; owners "minor increases". |

## Drivers
Unchanged: win_years_counted, attribution_share_shared, p_success (all judgments), missing_data_discount, drain_rate_per_year.
