# Audit: the-life-you-can-save-charityevals, round 1

Result (sandbox verification copy, 7 destinations missing): 0.1023 uov/$ = 51.15 years of healthy life per $1,000 (joint 0.30–604; shared assumptions at defaults 24.8–62.0; model's own ranges 49.4–52.9); cause median 6.36 (×8.0). The full model doesn't compute in the sandbox (environment limit), so its own multiple of the median is not measured here; the write-up's fallback figure of 71 would be ×11. Verdict: **fix needed** (1 high).

Scope: one programme, raising money for its recommended charities (US and Australian entities, calendar 2025), against the whole operating budget of both entities ($2,186,513 US from the 990 + A$653,207 AU = $2.61M at the IRS rate; the annual report gives $2,617,394). The charity has no second programme: its research serves the recommendations. Money moved is all six channels of its 2025 report ($23.9M at the site's rate; $24,065,415 in the charity's report). This matches the spending breakdown. Year and period are consistent, and the 2025 annual report confirms "+18%" money moved and "+43%" expenses.

Mechanical:
- **lint**: no lint findings on the verification copy.
- **invariants**: none, apart from the expected INV-12 artifact on `value_tlycs_recommended` in the verification copy.
- **real model**: the 7 "unknown model / givewell doesn't rank evidence-action" schema errors and the NaN rows and INV-18 failure that follow from them are environment limits, not findings.
- **normalization-audit**: this model was skipped because it doesn't load in the sandbox (an environment limit). No violations for other models.
- **check.ts**: fails only on those same environment errors.

Previous round: none (round 1).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | high (section 2 credit rule; small effect) | missing-adjustment | `attribution_share_shared`, `outcome_total` (new row `in_kind_services`) | Others' resources behind the money moved are left out. The US audited statements carry **$250,000 of donated services and use of facilities** in 2025. That is in neither `cost_total` (correct, by Convention 2) nor any credit share. `attribution_share_shared` is fixed at 1 and in any case multiplies only the zero policy branch, so nothing reduces the money-moved credit for it. | Form 990 2025, Schedule D Part XII: total expenses per audited F/S $2,436,517; line 2a/2d "IN-KIND EXPENSES … $250,000"; 990 expenses $2,186,517. Part XI line 2b shows the same $250,000 as revenue. | Add `in_kind_services` = 250000 (observed, the Schedule D quote above). Set `attribution_share_shared = cost_total / (cost_total + in_kind_services)` (0.912), with an explainer per Convention 2. Apply it to the money-moved branch: `outcome_total = downstream_value * total_adj + moved_value * attribution_share` (the other three adjustments stay 1 for moved money, so nothing is counted twice). Keep `in_kind_services` out of `cost_total`. | −8.8% (51.15 → 46.67, tested on a scratch copy) |
| 2 | medium | sensitivity | `charity_reported_moved`, `donor_reported_moved`, `intermediary_reported_moved` | The three self-reported channels ($4.49M, 19% of money moved) are point values at what was reported. The source says they undercount: only about half of the recommended charities report any gifts, donor reports come from fewer than 100 donors, and some intermediaries "have no tracking". The model's own range (49.4–52.9) therefore covers only `rrf_credit_share`. Whether those gifts were *caused* by the charity is the shared new-money share's question. Whether they were *counted* is not, and it is left as a point. | Money Moved 2025: What's Included?, pp. 1–2 ("Only about half of our recommended charities report any donations to us"; "fewer than 100 donors, and we're very confident that we're missing donations of this type"). | Add a ranged judgment `reported_influence_completeness_adj` (best 1.25, low 1.0, high 2.0). Anchor it in the explainer on "about half of recommended charities report" (if non-reporters received half as much influenced money per charity as reporters, the multiplier is ~1.5) and on the 1.0 floor of reported gifts only. Multiply the sum of the three channels by it inside `money_moved_reported`. | +4.9% at 1.25 (51.15 → 53.63, tested); about +19% at 2.0 |
| 3 | low | structure | careers rows (template `careers_*`, `careers_value`) | The template's career branch is removed, not kept at 0. templates.md for policy-research-meta says each of the three branches is "0 with a reason where it doesn't apply", and the template's `outcome_total` adds `careers_value`. | `outcome_total` formula omits `careers_value`; no `careers_*` rows. | Restore the template's careers rows with `careers_changed` = 0 (explainer: it moves no one into jobs) and `outcome_total = downstream_value * total_adj + moved_value [* attribution_share] + careers_value`. | none |
| 4 | low | presentation | `value_tlycs_recommended` (explainer) | The explainer says "the rest (15 charities and its Rapid Response Fund …)". The by-charity table has 33 charities + the fund. 19 are modelled, so 14 charities + the fund are not (the shared row in src/engine/moved-money.ts, the summary's "15 of its 34 destinations" and the write-up all say 14 + fund). | By-charity PDF: 34 lines; the 19 modelled sum to $13,389,935 of $24,106,468 (44.5% unmodelled). | Use the shared row's explainer word for word ("14 charities and its Rapid Response Fund"). | none |
| 5 | low | presentation | `us_staff_pay` (explainer) | "Staff pay of the US entity, which is 84% of the two entities' operating cost" is wrong. US staff pay is 68% of both entities' operating cost and 82% of the US one; 84% is the US entity's share of the combined operating cost. | 1,786,290 / 2,607,666 = 0.685; 2,186,513 / 2,607,666 = 0.838. | Reword: "Staff pay of the US entity, whose operating cost is 84% of the two entities'; it is 82% of US operating cost (`staff_cost_share`)." | none |
| 6 | low | source | `us_grants_moved` (explainer) | The 990's Part III says "IN 2025, WE DIRECTLY PROCESSED US $6.7M FOR OUR RECOMMENDED CHARITIES AS AGENCY FUNDS", against $10.0M of grants paid and $10,019,059 money moved through the US channel. The explainer reconciles only against grants paid. | Form 990 2025, Part III line 4a. | Add one sentence to the explainer: the narrative's $6.7M is the agency funds processed. The money-moved channel ($10.02M, matching grants paid, including the Rapid Response Fund gifts granted through it) is used because it matches the 990's line 13 and the charity's reconciliation note. | none |
| 7 | low | presentation | `money_moved_reported` (explainer) | The explainer says the by-charity table excludes confidential donors, "so its split is used only for shares". But the by-charity table sums to $24,106,468, *more* than the channel total ($24,065,415). The stated reason doesn't match the numbers. | By-charity PDF (sum of 34 lines); What's Included? PDF channel totals. | Restate it as: "the by-charity table ($24.11M, excluding confidential gifts by its note) doesn't reconcile exactly with the channel total ($24.07M), so it is used only for shares". | none |
| 8 | low | presentation | write-up, "What drives the result"; "How this model was checked" | "The new-money share (35–80%) moves it by under a tenth either way" is slightly wrong: at 80% the result is +10.3% (56.42 vs 51.15). "AUDIT_ROUNDS" is still a placeholder. | audit-model tornado on the verification copy. | Write "by about a tenth either way". Fill the audit-rounds section when the rounds finish. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| us_total_expenses | Form 990 2025 (…/2026/10/2025-Public-Disclosure-990-for-TLYCS.pdf) | verified | Part I line 18 / Part IX line 25: 12,201,580 |
| us_grants_paid | same | verified | Part I line 13: 10,015,067 (Part IX lines 1, 3: 5,780,689 + 4,234,378) |
| us_staff_pay | same | verified | Part I line 15: 1,786,290 |
| us_ops_expenses (derived) | same, Schedule D Part XII | verified | 2,186,517 per return. Audited F/S expenses are 2,436,517, including $250,000 in-kind (finding 1) |
| au_ops_expenses_aud | Financials 2025 PDF | verified | "A$653,207" (Expenses: TLYCS Ops, 2025) |
| au_grants_moved_aud | Financials 2025 PDF | verified | A$13,394,174 revenue for grants = grants expense 2025. Report's USD equivalent $8,779,010 |
| us_grants_moved | Money Moved 2025: What's Included? | verified | $10,019,059 |
| rrf_outside_moved | same, and reconciliation PDF | verified | $778,161, "did not flow through our bank account" |
| charity_reported_moved | same | verified | $2,804,273 |
| donor_reported_moved | same | verified | $1,460,390 |
| intermediary_reported_moved | same | verified | $224,520; GiveWell-routed gifts excluded |
| rrf_moved | Money Moved 2025: By Charity | verified | 3,109,921 |
| @meta.tlycs_moved_2025_* (shared facts) | AU-version by-charity PDF | verified (spot check, all 19) | identical to the US-version table |
| total_expenses (context) | 2025 Annual Report | verified | $2,617,394 operating expenses; money moved $24,065,415; +18% / +43% |
| @fx.usd_per_aud_2025 | shared fact | not opened (shared) | 0.6447 |

Evaluator figures seen: none. The annual report's own 3-year "leverage ratio" 9.19:1 is the charity's figure (allowed) and agrees with the model's 8.9 for 2025 after the Founders Pledge share of the Rapid Response Fund. No evaluator's figure for this charity was read or used.

## Drivers
1. `$marginal_vs_past_average`: shared slider (judgment), 18.4–102.3.
2. `$resource_shares`: shared toggle, 51.2 → 8.2 when on (donors' new money shares the credit).
3. `$uov_per_daly`, `$discount_rate`, `@meta.prior_vs_cash`, `$life_value_multiplier`: shared, acting through the destination charities' live results and the shifted-money benchmark.
4. Destination mix: shared facts (the charity's own split), 44% of it unmodelled and valued at the modelled average.
5. Model's own inputs: `rrf_credit_share` (judgment, ±3%) and the observed money-moved channels. Self-reported channels are left as points (finding 2).

Nearly all of the uncertainty is shared. The result is ×8 the cause median in the sandbox (nearest peer: Ubongo, 45.8). The gap is explained by ~8.9 dollars moved per dollar of cost times destinations that average above the median. The summary states this reason (INV-15). What would most improve the model: crediting the in-kind services (finding 1), and a ranged completeness judgment for the self-reported channels (finding 2). Beyond this model, the next biggest gain would be models for the large unmodelled destinations (Fistula Foundation $1.69M, Sanku $1.39M, Educate Girls $0.95M, Living Goods $0.70M), which would replace the average stand-in for 44% of the money.
