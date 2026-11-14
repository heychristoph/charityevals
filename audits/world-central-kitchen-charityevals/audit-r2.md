# Audit: world-central-kitchen-charityevals, round 2
Result: 9.442e-5 daly/$ = 0.094 years of healthy life per 1,000 dollars (combined range 0.021–0.424); cause median 0.207 (×0.46). Verdict: pass.
**Verdict: pass (no high or medium findings; five low).**
Model-sha: 2a7afb2b66c761215a76244348f40e8bbf3710dee42688c0b74c83ab260c58e5
Scope: unchanged from round 1. The charity's one programme (Emergency Relief Programs, 372,535,106 dollars in 2025, audited statements p. 6), all of it, overhead 1.104. Three branches by the Form 990's Schedule F: Gaza/MENA 51.4% of spending, crises in poorer countries 28.6%, rich-country disasters 20.0%. charities/world-central-kitchen.json `spending` and `lines` match the accounts. Basis `unit_cost`, right.
Mechanical: lint 0 high / 0 medium / 0 low; invariants none for this model (normalization-audit: only INV-14 on five other models' typed 0.05); check.ts passes; simulation 5%/50%/95% = 0.54/1/1.86 × best guess (stable).
Previous round:
- F1 (high, food gain over a year): resolved. Gaza, poorer-country and rich-country gains are now `years × ln(1 + food / (baseline × years))`. I checked it: Gaza 0.286 × ln(2.008) = 0.1997. Spelled out, the Gaza food gain is person-years × ln(1 + food ÷ (baseline × person-years)), so it no longer depends on `people_reached`, which is right. The recipe for families/humanitarian-relief.md is still with the owner (the batch may not edit skills), so it is not a model finding.
- F2 (food bill over-allocated): resolved. Each branch's food is its spending × 0.708, so the food valued adds up to the 263.7 million food bill (Gaza 1.08, poorer countries 1.80, rich countries 4.49 dollars of food a meal). One sentence in the explainer still needs work (finding 2).
- F3 (counterfactual anchor): resolved. Anchored on the peer relief models, and the explainer says no truck count was found.
- F4 (crisis_mortality_rate kind): resolved. It is now `judgment` with anchors named, and the write-up gives the survey's 0.006 and our 0.010 separately.
- F5 (gz_meal_share): resolved. The low end is 0.45 and the explainer treats the two series correctly.
- F6 (evidence_adj reasons): partly resolved. The "untested" reason is gone, but one of the reasons that replaced it is not a reason to discount (finding 1).
- F7 (harm list): resolved.
- F8 (write-up clause on meal count): resolved.
- F9 (subcontractors column): resolved, 29,599,785 from the Total column.

Branch shares at the defaults (my computation): Gaza 26.1k DALYs (70.7%), poorer countries 10.6k (28.8%), rich countries 0.19k (0.5%). The `beneficiaries` field (PSE 0.7068, HTI 0.1128, UKR 0.0983, MMR 0.0555, JAM 0.0214, USA 0.0052) reproduces exactly, and so do the summary's "about 0.09" and "70% of it from Gaza".

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | double-counting | gz_evidence_adj, lm_evidence_adj | One of the two reasons given for the 0.85 is "the food's value rests on the branch's share of the food bill, which is not published by place". That is an uncertainty that runs both ways around an unbiased best guess (every branch at the average share), not a reason to discount. The other reason, the unaudited count, now matters only through the months fed: moving `total_meals` across its whole 130–179 million range moves the result 11% (0.084–0.095). | Explainers of both rows; check.ts tornado line "Meals served in 2025 0.084 – 0.095". | Drop the food-split clause from both explainers. Rest the 0.85 on the count's reliability (the charity's own, unaudited, 179m against 130m) and on the peer anchors already named (American Red Cross 0.95, Americares 0.8). The value can stay. | none at the best guess |
| 2 | low | presentation | food_share_of_programme | The last sentence says Gaza's meals "likely held more food than this average share gives it ... and US meals less", but the model does not use that direction. The direction is also doubtful: Gaza carries the sea and Jordan corridors' freight and security, and the food line includes "purchased meals" (the US restaurant and food-truck meals, booked whole as food), so Gaza's food share of spending is as likely lower as higher. | Explainers of food_share_of_programme and food_expense. | Replace the sentence with "The split by place is not published, so every branch takes the average share." | none |
| 3 | low | units | gz_share, lm_spend_990, lm_share | The regional shares are taken of the US entity's 990 total (388.5m), which counts the 27.5m grant to the Spanish affiliate. The consolidated programme spending they are applied to (372.5m) instead counts what the affiliate spent, about 11.5m (372.5 − (388.5 − 27.5)). So Europe is over-weighted by about 16m and Gaza under-weighted (51.4% against 53.6% on the consolidated basis). | Rows sf_program_total, sf_eur_grant, program_expenses; sf_program_total's own explainer gives the reconciliation. | Put the shares on the consolidated basis: `gz_share = sf_mena / program_expenses`; in `lm_spend_990` replace `sf_eur_grant` with `(program_expenses - sf_program_total + sf_eur_grant)` (the affiliate's spending); `lm_share = lm_spend_990 / program_expenses`. hi_share stays the remainder (20.0% → 17.6%). | 0.0944 → 0.0967 (+2.5%, checked in a scratch copy) |
| 4 | low | missing-adjustment | years_exposed | The food bill (all of it valued) includes the flour behind the bread the charity handed out in Gaza ("272 million meals, 73 million loaves of bread" by February 2026, bread counted apart from meals). But the person-years it is spread over count only hot meals. Under the log, food packed into fewer person-days is worth less, so leaving the bread days out lowers the gain. | wck.org/news/gaza-milestone/ (round 1, verified); food_expense explainer ("ingredients and purchased meals"); years_exposed formula. | Add `gz_bread_meal_equiv`, a judgment of the 2025 loaves as meal-equivalents (about 30 million loaves in 2025, from the 73 million cumulative, at about 0.5 of a day's meal each, ranged 0–25 million), and set `years_exposed = (gz_meals + gz_bread_meal_equiv) / (people_reached * 365 * meals_per_person_day)`. | about +4% at 20% more person-days (0.0944 → 0.0985, scratch copy) |
| 5 | low | presentation | crisis_mortality_rate | "to 0.025 (near the IPC famine threshold of 2 deaths per 10,000 a day, 0.073, in parts only)": 0.025 is a third of 0.073, not near it. | Explainer. | Write "to 0.025 (a third of the IPC famine threshold of 2 deaths per 10,000 a day, 0.073, which only parts of Gaza reached)". | none |

## Sources checked
Round 1 verified every cost, reach and top-driver source (financial statements pp. 5, 6, 8, 11; Form 990 Part III and Schedule F; WCK Gaza releases; RNZ/Reuters; UNCTAD; World Bank facts for Palestine, Haiti and Jamaica). This round added no new sourced inputs. The two changed sourced values were checked against round 1's notes:

| Row | URL | Status | Note |
|---|---|---|---|
| subcontractors | https://wck.org/wp-content/uploads/2026/09/FY2025-World-Central-Kitchen-Financial-Statements.pdf | verified (round 1) | p. 8 Total column 29,599,785; quote now "29,379,687 192,911 27,187 29,599,785" |
| food_share_of_programme (formula of food_expense, program_expenses) | same | verified (round 1) | 263,720,659 / 372,535,106 = 0.708 |
| @haiti.consumption_per_person_2024 | World Bank API NE.CON.PRVT.CD, SP.POP.TOTL HTI 2024 | verified | 23,335,617,961.7 / 11,772,557 = 1,982 (fact quote gives both; round 1 had only the numerator) |

## Drivers
1. `$missing_data_discount` (shared slider, 0.019–0.189): all three branches thin, correctly.
2. `$uov_per_daly` (shared).
3. `gz_counterfactual_adj` (judgment, 0.061–0.135): anchored on the peer relief models now; a count of the charity's trucks against all food trucks into Gaza in 2025 would improve it most.
4. `baseline_consumption` (judgment, 0.131–0.069): anchored on UNCTAD's 161 dollars of GDP per person plus aid.
5. `$uov_per_ln_consumption` (shared), then `gz_evidence_adj`, `attribution_share_shared` and `implementation_adj` (judgments, each about ±15%).

The result is 0.46× the cause median. That gap is supported: most of the value is a few months of food for people with almost nothing, half of which others would have brought in, and deaths averted are under a tenth of Gaza's value. Findings 3 and 4 together would raise it about 7%.
