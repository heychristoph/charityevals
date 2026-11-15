# Audit: salvation-army-charityevals, round 4 (verification of the round-3 fixes)
Result: 5.238e-6 daly/$ = 0.005238 years of healthy life per 1,000 dollars (combined range 0.000029-0.31 as check.ts prints it); cause median 0.1169 (x0.045). Verdict: pass.
Model-sha: e5b9ee3a9dc6eb89bab4fb49af0800187aa3298246cac1b636cc15c85caaa85e
Scope: verification of the changes in 646c0f7e only; not a full re-audit. Changed rows: wt_arc_store_goods (explainer), value_per_person (formula and explainer), veterans_help_value (explainer), the write-up's "How this model was checked" last paragraph.
Mechanical: `npx tsx scripts/audit-model.ts models/global-health/salvation-army-charityevals.json` lint 0 high / 1 medium (far-below, 0.0448x the median; judged correct in three earlier rounds) / 0 low, invariants none; `npx tsx scripts/check.ts salvation-army-charityevals` all models valid, 0.0052; `npx tsx scripts/simulation-check.ts salvation-army-charityevals` stable (5% 0.575, 50% 1, 95% 1.78 x best guess). normalization-audit not run (verification round).
Previous round: audit-r3 finding 1 resolved (wt_arc_store_goods explainer now says wt_inkind_goods holds only the clothing and household lines, the "other" line of vehicles, jewellery and books is left out, and $6.6M is taken as the clothing and household part; value and range unchanged). Finding 2 partly resolved (the $100 is inside the in-kind group and the explainer says it is a service at the shared cash-equivalent ratio and that the housing found is valued in the placements branch; see finding 1 below for the one step not taken). Finding 3 resolved in the overseas model (see its audit-r2). Finding 4 resolved ($12 item value in the write-up; the second round's changes recorded).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | normalization | inkind_cash_equivalence (formula, explainer) | The veterans' case management now sits inside the in-kind bracket of value_per_person, so it is multiplied by inkind_cash_equivalence. But inkind_cash_equivalence's numerator and denominator do not contain `veterans_served * veterans_help_value`, so the $100 is scaled by the food/goods/services blend, not by the services ratio (`@aid_value.inkind_services_vs_cash`, 0.8) that the new veterans_help_value explainer says it gets. The blend is a little below 0.8 (food 0.8, goods 0.7, services 0.8 weighted by value), so the difference is about 1-2% of a $1.96M term. No double counting: the term appears once, in value_per_person only. | value_per_person formula ends `... + veterans_served * veterans_help_value) * inkind_cash_equivalence + financial_assistance_households * assistance_per_household + trial_earnings_value`; the inkind_cash_equivalence services bracket lists day care, medical, trafficking, correctional, disaster only. Facts: inkind_food_vs_cash 0.8, inkind_goods_vs_cash 0.7, inkind_services_vs_cash 0.8. | Add `veterans_served * veterans_help_value` to the services bracket of inkind_cash_equivalence's numerator (times `@aid_value.inkind_services_vs_cash`) and to its denominator, so the weighting matches the explainer. | below 0.1% (up, since the ratio rises toward 0.8) |

Checks passed:
- **wt_arc_store_goods.** The explainer now matches the WT note 7 passage audit-r3 quoted (clothing, household and other, with vehicles, jewellery and books in "other") and the wt_inkind_goods explainer ("other" left out). Value $6.6M (0-13.3M) unchanged; $13.3M cap (supplies $10.2M plus other expenses $3.0M, p. 7) stated as before.
- **value_per_person.** The formula now reads `(... + disaster_assisted * disaster_extra_value + veterans_served * veterans_help_value) * inkind_cash_equivalence + financial_assistance_households * assistance_per_household + trial_earnings_value`; cash bills and trial earnings stay outside the in-kind bracket, as the explainer says. Veterans' temporary financial help stays only in assistance_per_household (explainer says so); the housing found is in the placements branch, and the explainer says so, so the double count audit-r3 worried about is named and kept out.
- **Write-up.** "$12, was $10" matches item_value best 12; "about $98 a household, was $77" matches assistance_per_household ($98.05 in audit-r3, formula unchanged); "from 0.0051 to 0.0052" matches the live 0.005238. The sentence about the veterans' help being stopped from counting twice is consistent with the model.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| wt_arc_store_goods | https://docs.candid.org/edoc/10680020/document.pdf | verified in round 3, passage unchanged | Note 7 text matches the new explainer. |

## Drivers
Unchanged from round 3. None of the changed rows is a top driver.

Verdict: pass
