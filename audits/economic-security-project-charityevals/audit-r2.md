# Audit: economic-security-project-charityevals, round 2 (verification of round 1)
Result: 0.0867 years of healthy life per 1,000 dollars (cause median 0.0652, x1.33). Verdict: pass.
Model-sha: 05876e4615b46bb067a00db2a895260d09f6e48d66545327efef9fd33bf99e06
Scope: only the six round-1 findings and the rows changed for them.
Mechanical: audit-model.ts findings 0 (warnings only: wide range, judgment-heavy); check.ts all valid.
Previous round: audit-r1.md (pass; 3 medium, 3 low).

| # | R1 finding | Status | Check |
|---|---|---|---|
| 1 | ctc_attribution_share omits the c4 | fixed | 0.13 (0.04-0.27); explainer names ESP Action ($1.8m of $3.6m on its campaigns line) as another advocate and says only the c3 is modelled. |
| 2 | persistence counted twice in ctc_evidence_adj | fixed | 0.8 (0.6-0.95), only "are the counted amounts real"; rollback and Georgia clauses gone; ctc_discounted_years says persistence is in the shared years alone. |
| 3 | am_ue_ideas flat 2 units | fixed | Row removed; am_value formula has no flat term; explainer gives the sourced finding (2024 Schedule I grantees named, no credit-able win, cost kept in the denominator). |
| 4 | Direct File omits newly claimed credits | fixed | df_refunds_2024 $90M: quote verified on the Treasury featured story ("claimed more than $90 million in refunds"; same page: "16 percent did not file last year at all"). df_new_credits = 90/141,000 x 450,000 x 0.07 = $20M (explainer matches); counted at filers' consumption and as cost at federal payers in df_net_ln, and in df_gross_value. Units consistent. |
| 5 | GI baseline | fixed | gi_baseline_consumption = ce_expenditure_per_person_2024 x food_aid_recipients_consumption_share (0.3, exists in facts/united_states.json); gi_payment_per_person = payment / household size; gi_evidence_adj 0.9 with the survey-income clause dropped. |
| 6 | 2021 partial year | fixed | first_year 2022 with reason; expenses_2021 and ctc_money_2021 gone; average_spend_vs_year averages 2022-2024 (CPI-adjusted); ctc_money_per_year sums 2022-2024 ($3.6B over the campaign years); gi_window_share 0.6 (0.45-0.75) with explainer. No stale 2021-window text remains (remaining 2021 mentions are the reasons for leaving it out). |

Write-up and summary: result 0.087 matches the model; the write-up notes round 1 and the c4 treatment.

## New findings
None.
