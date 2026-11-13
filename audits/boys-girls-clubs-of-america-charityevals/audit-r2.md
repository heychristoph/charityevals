# Audit: boys-girls-clubs-of-america-charityevals, round 2

Result: 2.87e-5 daly/$ = 0.0287 years of healthy life per $1,000 (combined range 0.0018–0.457); cause median 0.3585 (×0.080). Verdict: **pass**.
Model-sha: d589e3d32b1bc775b6e296b79d777cb5be5d01512687cc81f2c0aab8fb0840a2

Scope: unchanged and still right. Both programme lines ($353,995k) are modelled; `total_expenses` is now the functional total $396,021k (= 353,995 + 23,028 + 18,998), so `overhead_ratio` is 1.1187 and cost_total $396.0m.

Mechanical: audit-model lint 0 high / 0 medium / 1 low (far-below, the summary still gives the matching reason: US log-income scale and about $1,700 a member). check.ts: all models valid. No normalization violations for this model; generated/ unchanged (git status clean apart from this file). Result moved 0.0306 to 0.0287 (-6%), in line with the sum of the predicted effects of findings 3 to 6 (-0.85%, -0.6%, -6%, +1%).

Previous round:
- #1 (edu_effect_sd filed as estimate with an unsupported source) resolved. `kind: "judgment"`, no `source` block, the explainer names Durlak (DOI, 0.12 grades / 0.17 tests), Kremer 2015, 21st CCLC (James-Burdumy 2005) and P/PV as anchors. United Way's `edu_effect_sd` is likewise a judgment with the Kraft quote moved into the explainer; its result is unchanged (0.01156 in the peer table).
- #2 (reach rows changed meaning) resolved. `households_reached = members_credited`, `people_reached = households_reached * household_size` (2.4, as in the peers), `edu_children_reached` carries the outreach uplift and is read by `edu_uov`, `uov_bridged`'s deaths term, `wellbys_bridged` and `dalys_direct`; the parents' branch reads `people_reached`. The same-template table now compares like rows (households 2.07e5, people 4.96e5).
- #3 (advocacy cost outside cost_total) resolved. `program_spend = program_expenses`; the advocacy cost is subtracted only in `nat_spend`, so it stays in cost_total and buys no member-years. The explainers of `program_spend` and `nat_spend` say so.
- #4 (total_expenses) resolved. 396,021k with the functional-statement quote; explainer matches (fundraising $18,998k including the event costs).
- #5 (cost per member year) resolved. $1,700 (950–2,900), explainer adds about $86 a member of BGCA's own services.
- #6 (advocacy share) resolved. 0.03 (−0.02 to 0.10), the explainer works the arithmetic (5% of cost × about 55% net: 4.3e-5 ln per Club dollar against 1.2 ÷ (1.05 × 58,517) ≈ 2e-5 per taxpayer dollar). I re-did it: 1.95e-5 / 4.3e-5 gives 45% lost, 55% net, 18/396 = 4.5% (called 5%), product about 2.5–2.7%, so 3% is fair.
- #7 (write-up $440) resolved. "about $430".

New problems from the changes: none that move the result or break a rule.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | structure | `edu_effect_sd` (here and in united-way-charityevals) | Both models now hold their own after-school effect as a separate judgment (BGCA's 0.09 is described as "the figure the United Way model uses"). A slider moving one does not move the other, and the 0.09 is a component inside United Way's 0.16 blend rather than a shared row. Not a rule breach (the values differ in meaning: BGCA's is the single after-school figure, United Way's a four-part mean), but the link is by prose only. | BGCA explainer: "0.09, the after-school figure the United Way model uses"; United Way `edu_effect_sd` 0.16. | If a youth-programmes fact `afterschool_effect_sd` is added later, read it from both. Optional, no action needed now. | none |
| 2 | low | presentation | write-up, advocacy bullet | "public money costs taxpayers about 45% of what it gains the families" is right (1.95e-5 / 4.3e-5), but the "5% of its cost" is 4.5% (18 ÷ 396). Rounding only. | arithmetic above | Optional: "about 4.5%". | none |

## Sources checked
Only what changed. `total_expenses` quote re-checked against the functional statement figures already verified in round 1 (178,112 + 175,883 = 353,995; 23,028; 18,998; total 396,021; the three add up). Anchors of `edu_effect_sd` and the Kraft quote are unchanged text moved into explainers (verified in round 1 and in the United Way audit); nothing new was fetched.

## Drivers
Unchanged from round 1: `$missing_data_discount`, `edu_effect_sd` (now honestly a judgment), `$discount_rate`, `$uov_per_daly`, `cost_per_member_year` ($950–$2,900, now including national services). Tornado order in the audit-model output: value of BGCA's own services, evidence adjustment, unmodelled effects, years to working age, parents' real-gain share.

Peers: 0.0287 is still the highest of the domestic-services models (United Way 0.0116, Habitat 0.0054, Salvation Army 0.0052, Red Cross 0.0045); the explanation in round 1 (children's earnings branch, cost per member-year) still holds, and the move was only the mechanical effect of the fixes.
