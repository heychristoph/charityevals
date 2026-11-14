# Audit: campaign-legal-center-charityevals, round 2 (verification of round 1's five lows)
Result: 1.444e-5 daly/$ = 0.0144 years of healthy life per 1,000 dollars (combined range 0.00076–0.274); cause median 0.0642 (×0.225). Verdict: pass.
Model-sha: 2236051441f8e42b588906283d46285a9b6cd639a5b67adf5c71d2a565f8f5b1
Scope: unchanged from round 1 (all seven programme columns of the 2025 audited statement; $16.0M programme of $21.5M).
Mechanical: lint 0/0/0 (audit-model: 0 findings), invariants none; the other scripts were not re-run (scoped verification of the five lows and their knock-on numbers).
Previous round: finding 1 (reform wording) resolved in the write-up and in the `ref_relative_effect`, `ref_people_per_year` and `ref_attribution_share` explainers; finding 2 (stale explainers) resolved; finding 3 (`ref_years_until_effect` 4, 2 to 8, duration wording) resolved; finding 4 (drivers sentence) resolved; finding 5 (`oth_direct_share` 0.6 (0.3 to 0.8) citing note 8; `red_direct_share` explainer with p. 8) resolved.

Stated numbers against computed values (vals.mts, audit-model):
- direct share about 35%: `dem_direct_share` 0.3519 (summary "about a third", explainer "about 35%", write-up list 50/30/15/5/60%: all match).
- the Center's share of the field 0.29%: `dem_attribution_share` 0.002895, `dem_field_spending` $2.617B (matches).
- slide branch "nearly half": `dem_dalys` 389.8 of `outcome_total` 863.4 = 45%; reform 473.7 = 55%, "a little over half" (matches).
- reform spending "about three fifths of the movement's yearly spending": `ref_attribution_share` 0.618 (`ref_cost` 13.95M over 22.58M) (matches).
- Other column: 1,183,535 / 1,760,427 = 67%, "two thirds" (matches).
- next dollar 36%, result 0.014, about a fifth of the median (0.225), field cut 0.045 "about a twentieth", loss years "about 1.5" (1.541): all match.
- the `@next_dollar.campaign_legal_center` entry is still read (marginal_vs_past_average 0.36).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary; `ref_cost` explainer | Both still say the reform branch uses "the figures the Common Cause Education Fund and Brennan Center models use". After round 1's fix the other explainers (and the write-up) say Brennan only, because the Common Cause model counts its commission work at the movement's own rate. | summary, last-but-two sentence; `ref_cost` explainer | In both, replace "the Common Cause Education Fund and Brennan Center models" by "the Brennan Center model" (summary: "counted as reform work only at the figures the Brennan Center model uses for reforms within a democracy"). | none |
| 2 | low | presentation | write-up "What drives the result" | The tornado order has shifted: `@democracy.democratization_gdp_gain` ("the size of that gain") is now fourth (0.0049–0.0237), ahead of `other_reform_relative_effect` and `redistricting_gain_share`, which the sentence puts fourth and fifth. The three are within 0.5% of each other on swing ratio (4.7–4.8×), so the order is a wording choice, not an error. | audit-model tornado | Optional: "...the next-dollar figure, then the size of democracy's income gain, how much a reform dollar does against a redistricting dollar, and the share of that gain fair maps bring; the field's effect on the risk of a slide follows." | none |

No high or medium findings; the round-1 changes introduced no wrong numbers.

## Sources checked
Not re-fetched: the round-1 sources are unchanged. The `oth_direct_share` explainer's figure (release 1,183,535 in note 8) was verified in round 1.

## Drivers
Unchanged from round 1; the model's own judgments (direct shares and waits) remain minor (joint low–high of the model's own ranges 0.0116–0.0164).
