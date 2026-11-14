# Audit: govai-charityevals, round 4 (verification round)
Result: 0.001583 daly/$ = 1.58 years of healthy life per 1,000 dollars (combined range 0.039-64; model's own ranges 0.047-33); cause median 0.958 (x1.7). Verdict: pass.
Model-sha: 6fdebc3e16c2a9b9c63686f4a04ebc4484cbe358e7f4fd040e3c8ff55b686f92
Scope: unchanged from round 3 (all of GovAI's 2025 work, $11.9M); only round 3's findings and the changes they caused were checked.
Mechanical: audit-model lint 0/0/0, findings (0); scripts/check.ts: all models valid. Not re-run this round (scoped): normalization-audit, simulation-check. No file in generated/ was changed.

Previous round (round 3):
- 1 (high, attr_policy): resolved. `code_resources` exists ($20M, $5M-$50M, judgment, itemised: AI Office ~$3M, chairs ~$1.3M, submissions ~$4M, plenaries ~$3M, providers ~$5-10M; the parts sum to $16-21M, consistent with the best). `attr_policy = pol_cost_share * cost_total / code_resources` = 0.02 x $11.9M / $20M = 1.19%, so the explainer's "$240,000" (actually $238,000) and "about 1.2%" are right, and the range of code_resources now flows through to the result. pol_relative_cut's cross-check reads the same row.
- 2 (low, weights): resolved. w_ai = 106,900, w_fb = 41,350, w_pol = 1,295,700 (healthy years per death 47.14, from dalys_from_uov 1.297M / deaths_averted 27,510). Hand check of the chain: evidence 0.9852, and the weighted average of each branch's own product (research 0.8 x 1 x 0.6 x 0.75 = 0.36; training 1 x 0.9 x 0.95 = 0.855; Code 1 x 0.5 x 0.0119 = 0.00595) is 81,540 / 1,443,900 = 0.05647. The model's total_adj is 0.02823 = 0.05647 x missing_data_adj 0.5 x leverage 1, and attribution_share 0.1107 = 0.05647 / (0.9852 x 0.5176). They match exactly.
- 3 (low, extinction anchor): resolved and the arithmetic holds. Yearly AI deaths risk 5.48M (0.001154 x 2.035e9 + 3.846e-4 x 8.141e9); $1M cuts 61.43, i.e. 0.0011%; x20 ($20M) = 0.022% and 0.1% is 4.5x ("5 times"). Extinction: 27.02 of 3.28e7 (8.518e10 x 3.846e-4) = 0.000082%; x20 = 0.0016% ("0.002%"), and 0.1% is 61x ("about 60"). The reason for one cut is given (frameworks' thresholds cover loss of control as well as misuse).
- 4 (low, cf_policy reference class): resolved. It names the family's 0.7 (0.4-0.95) and the peers' 0.65-0.75 and why a single seat sits below.

Summary and write-up against the model: headline 1.6 / 1.58 (matches); range 0.05-33 (0.047-33, matches); branch shares from w x product: research 47% (38,500 of 81,540), training 43%, Code 9.5%, which match "about half, two fifths, a tenth"; Code credit "about 1%" (1.19%) and the table's "about 0.01" match; next dollar 42% unchanged.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | write-up, "What the charity does" | The write-up says research and policy engagement is "about three quarters" and training "about a quarter", while the model's cost shares are 69% and 29%. | fb_cost_share 0.29, pol 0.02 | Write "about 70%" and "about 30%". | none |

## Sources checked
Not re-fetched (scoped round). The new `code_resources` row reuses the Commission's "Meet the Chairs" page already verified in round 3 (about 430 submissions, nearly 1,000 attendees at the kick-off plenary, 13 chairs and vice-chairs); its dollar components are a stated judgment, not a sourced figure.

## Drivers
Unchanged: `$ai_catastrophe_chance`, the shared misuse cut per million, `$win_years_counted`, `$missing_data_discount`, `@next_dollar.govai`. Code of Practice inputs (code_resources, pol_relative_cut, cf_policy) now each have anchors; the Code is about a tenth of the result.

**Verdict: pass** (no high finding; one low presentation note)

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.
