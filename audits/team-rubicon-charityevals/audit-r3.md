# Audit: team-rubicon-charityevals, round 3 (verification)
Result: 1.200e-6 daly/$ = 0.0012 years of healthy life per 1,000 dollars (combined range 0.00026-0.0056); cause median 0.3585 (x0.0033). Verdict: pass.

Scope: the three changes since round 2 only. Mechanical pass: `audit-model.ts` shows no high or medium finding (two lows: an unused context input `audited_program_expenses`, and the far-below-median note, which the summary explains); `check.ts` prints "all models valid".

## Round-2 findings
1. resolved: `ltr_value_per_home` is $90,000 (50,000-150,000). Check: $100-150 x 1,000-1,500 sq ft is $100,000-225,000, about $130,000 at the midpoint; $130,000 x (1 - 0.25 to 0.33) is $87,000-97,500, so $90,000 follows from the stated parts. The explainer says what is taken out and why (labour 30-45% of the price, Greyshirts doing a quarter to a third of the price), and the volunteers' hours stay in `vol_hours` so nothing is counted twice. Still no published $/sq ft source (low, below).
2. resolved: the "trained sawyers who work locally" item is gone from `unmodelled_benefits_adj`; the value is unchanged at +10% (-5% to +30%), the remaining items (mould illness, emergency access, careers, service projects, volunteer injuries, contractor work displaced) each carry a sign.
3. resolved: the write-up's "What isn't modelled" matches the row (service projects for organisations listed, trained volunteers dropped); "How this model was checked" is filled in and matches the audit files (round 1 one high and one medium; round 2 pass with three lows; this round).

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | "Homes about a fifth" understates the computed share. | Computed rows: response 448.6 x 0.139 = 62.4, rebuilt homes 70.5 x 0.141 = 9.9 plus the SBP grant 49.5 x 0.19 = 9.4, volunteers' wellbeing 1.45 of 42.3 DALYs (3.4%). Shares of the result: response about 74%, homes about 23%, volunteers 3%. | Say "about a quarter" for the homes (or "almost a quarter"). | none |
| 2 | low | sources | `ltr_value_per_home` | The $100-150 a square foot figure and the 30-45% labour share are unsourced. | Explainer. Fine as a ranged judgment; the row sits in the lower half of the tornado. | Cite a construction-cost source (RSMeans, a Texas rebuild cost per square foot) when one is found. | about +-1% |
| 3 | low | unused-input | `audited_program_expenses` | Does not feed the result (lint low). | audit-model. | Delete or mark it as context in the explainer. | none |

## Sources checked
Only the changed rows. `ltr_value_per_home` and `unmodelled_benefits_adj` are labelled judgments with their parts and anchors stated; no published source to fetch. The write-up's checked-by section matches the files in the audit folder.

## Drivers
Unchanged from round 2: `$missing_data_discount`, `$uov_per_daly`, `resp_counterfactual_adj`, `resp_price_ratio`, `resp_inkind_value`.

Verdict: pass. Findings: 0 high, 0 medium, 3 low.
Model-sha: 8419e9519e581328d972045245df0ddf1c6094298ea05115863004642e84b4f3
Rules: 0.3.3

Re-stamped after merge: the summary low fixed ("about a fifth" → "about a quarter", computed 23%); no other change.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)

Re-stamped (16 Nov 2026): Pre-audit cleanup (16 Nov 2026): shared figures read from facts at the same values (@myanmar.household_consumption_share_of_gdp, @survey_consumption.disaster_affected_share_of_survey_mean, @volunteering.disaster_volunteer_ls_gain_year); judgments' reference classes named from sources; volunteer-hours labels name the charity. Values unchanged. Mechanical: headline unchanged, against bebc953e.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2b370f40.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against c42a537d.
