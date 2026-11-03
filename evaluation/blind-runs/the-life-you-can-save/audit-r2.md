# Audit: the-life-you-can-save-charityevals, round 2

Result (sandbox verification copy, 7 destinations missing): 0.09787 uov/$ = 48.94 years of healthy life per $1,000 (joint 0.27–654; shared assumptions at defaults 22.6–67.1; model's own ranges 45.1–57.3); cause median 6.36 (×7.7). The full model doesn't compute in the sandbox (environment limit), so its own multiple of the median is not measured here; the summary gives the INV-15 reason. Verdict: **pass** (no high findings; 0 medium, 5 low).

Scope: unchanged from round 1 and correct. There is one programme: moving money to its recommended charities. The model counts both entities' whole operating budget for calendar 2025 ($2,186,513 US from the 990 + A$653,207 AU = $2.61M at the IRS rate). Against that it sets all six money-moved channels for 2025. Cost and reach cover the same period, and the basis is `past_average` with the slider read.

Mechanical:
- **lint**: no findings on the verification copy.
- **invariants**: none, apart from the expected INV-12 artifact on `value_tlycs_recommended` in the verification copy.
- **normalization-audit**: this model was skipped because it doesn't load in the sandbox (an environment limit). No violations or new waivers for any other model.
- **check.ts**: fails only on the 7 unknown-model / "givewell doesn't rank evidence-action" errors and the NaN rows that follow from them. That includes `careers_value`, which reads `moved_dollar_value` through `career_employer_value`. All of these are environment limits.

Previous round:
1. In-kind services in the credit share: **resolved**. `in_kind_services` = 250,000. `attribution_share_shared` = `cost_total / (cost_total + in_kind_services)` (0.912), and it is applied to `moved_value` in `outcome_total`.
2. Completeness of the self-reported channels: **resolved**. `reported_influence_completeness_adj` is 1.25 (1–2), anchored, and applied only to the three reported channels.
3. Career branch: **resolved**. It was restored at `careers_changed = 0` and `careers_value` is in `outcome_total` (but see finding 1 on its placeholder sources).
4. Unmodelled-destination count: **resolved**. It now reads "14 charities and its Rapid Response Fund".
5. `us_staff_pay` explainer: **resolved**.
6. The 990's $6.7M agency-funds narrative: **resolved**. It is now in the `us_grants_moved` explainer.
7. Reconciliation wording in the `money_moved_reported` explainer: **resolved** in the model. The write-up still has the old claim (finding 3).
8. Write-up tornado wording and audit rounds: **resolved** for the audit rounds. The new-money sentence is still slightly off at the new numbers (finding 4).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | `career_forgone_pay`, `career_years_stayed` | The restored career rows keep the template's placeholder sources: "TEMPLATE: salary survey" / "TEMPLATE: follow-up survey", url `https://example.org/REPLACE`, quote "REPLACE: verbatim sentence". The page will show them as sources. The lint does not catch it because `careers_changed` is 0. | model rows 40–41 (`source.url` = example.org/REPLACE) | Delete the `source` objects on both rows. They are judgments with no effect here, and the explainer already says so. | none |
| 2 | low | sensitivity | `reported_influence_completeness_adj` (explainer, low end) | The judgment only considers gifts missed. Gifts *counted twice* across the reported channels are not considered. A donor who tells The Life You Can Save it influenced a gift (supporters' channel) may also answer "where did you hear about us?" at the charity (charities' channel). The report doesn't say the channels are de-duplicated. The low end of 1.0 therefore assumes no overlap. | What's Included? pp. 1–2: the charities' channel counts gifts where "a donor indicate[s] that we influenced the gift"; the supporters' channel counts gifts "where the donor tells us we influenced their gift". There is no statement that the two exclude each other. | Add one sentence to the explainer: the two channels can overlap, and the source doesn't say they are de-duplicated. Set the low end to 0.9, which allows for about half of the supporters' $1.46M also being in the charities' figure. Keep 1.25 as the best guess, since undercounting dominates by the charity's account. | best unchanged; low end of the model's own range −3.8% (half the supporters' channel × 1.25 out of $24.3M credited) |
| 3 | low | presentation | write-up, "What isn't modelled", last bullet | The bullet says confidential donors "are in the money-moved total but not in the by-charity split". That implies the split is the smaller total. In fact the by-charity table ($24,106,468) is *larger* than the channel total ($24,065,415). The round-1 fix to the model's explainer was not carried into the write-up. | By-charity PDF: 34 lines sum to $24,106,468; What's Included? channels sum to $24,065,415 | Reword: "The by-charity table excludes donors who asked for confidential designations by its own note, yet doesn't reconcile exactly with the channel total. Its split is used for shares only, so the unlisted gifts are assumed to go where the listed ones do." | none |
| 4 | low | presentation | write-up, "What drives the result"; "Biggest uncertainties" | (a) "The new-money share (35–80%) moves it by about a tenth either way" is now off: the tornado gives 46.42–53.98 against 48.94, that is −5% / +10%. (b) The model's largest own-range driver, the completeness judgment (46.67–55.73, −5% / +14%), isn't mentioned. (c) Under "New money", the undercounting of influenced gifts is given as a reason the new-money share could be higher. The model now handles it as counting in its own row, and the row's explainer says it is not the new-money question. | audit-model tornado on the verification copy | (a) Write "down a twentieth at 35%, up a tenth at 80%". (b) Add a bullet: "Gifts nobody reported (our judgment, 1–2× the reported $4.5M) move it from −5% to +14%." (c) Move the undercounting sentence from "New money" to the "Self-reported influence" bullet, and say it is handled by the completeness judgment. | none |
| 5 | low | presentation | `summary`; write-up "Money moved" | There are two money-moved-per-dollar figures for different things. The summary says "about nine dollars per dollar after crediting Founders Pledge and donated services". `moved_per_dollar` (9.31) is before the donated-services share; after it, the figure is 9.31 × 0.912 = 8.5. The write-up gives $9.3 "per dollar of cost". | `money_moved` $24.27M / `cost_total` $2.61M = 9.31; × `attribution_share` 0.912 = 8.49 | In the summary, write "about nine dollars per dollar after crediting Founders Pledge (8.5 once the donated services take their share)", or drop "and donated services". | none |

## Sources checked
This round re-opened the three money-moved and financials PDFs. The Form 990 (3.7 MB, 30+ pages) could not be rendered in this environment (no page renderer). Its figures are unchanged from round 1, where they were verified line by line, including Schedule D's $250,000 in-kind.

| Row | URL | Status | Note |
|---|---|---|---|
| us_grants_moved | Money Moved 2025: What's Included? | verified | $10,019,059 |
| (AU channel, context) | same | verified | $8,779,010 USD equivalent. The model converts A$13,394,174 at the site's rate instead (correct). |
| rrf_outside_moved | same | verified | $778,161, "funds raised together with Founders Pledge" |
| charity_reported_moved | same | verified | $2,804,273; "Only about half of our recommended charities report any donations to us" |
| donor_reported_moved | same | verified | $1,460,390; "fewer than 100 donors" |
| intermediary_reported_moved | same | verified | $224,520; "others have no tracking in place"; GiveWell-routed gifts excluded |
| reported_influence_completeness_adj (anchors) | same | verified | All three quoted anchors are in the source. On overlap, see finding 2. |
| au_ops_expenses_aud | Financials 2025 | verified | A$653,207 (2025, "Expenses: TLYCS Ops") |
| au_grants_moved_aud | Financials 2025 | verified | A$13,394,174 revenue for grants = grants expense 2025 |
| us_ops_expenses (context) | Financials 2025 | verified | $2,186,576 "TLYCS Ops" and $10,015,063 grants, against the 990's $2,186,513 / $10,015,067 (the explainer notes it) |
| rrf_moved | Money Moved 2025: By Charity | verified | 3,109,921 |
| @meta.tlycs_moved_2025_* (shared facts) | same | verified (all 19 modelled lines) | 34 lines: 33 charities plus the fund. The 14 unmodelled charities are Breakthrough, CRS, CEDOVIP, Educate Girls, Fistula, Food4Education, Fred Hollows, Living Goods, Muso, Oxfam, PSI, Sanku, Seva and Thanzi. |
| us_total_expenses, us_grants_paid, us_staff_pay, in_kind_services | Form 990 2025 | verified in round 1; not re-rendered here | values unchanged since round 1 |
| @fx.usd_per_aud_2025 | shared fact | not opened (shared) | |

Evaluator figures seen: none. No evaluator's evaluation of this charity was read, searched or used.

## Drivers
1. `$marginal_vs_past_average`: shared slider (judgment), 17.6–97.9.
2. `$resource_shares`: shared toggle, 48.9 → 7.6 when on.
3. `$uov_per_daly`, `$discount_rate`, `@meta.prior_vs_cash`, `$life_value_multiplier`: shared, acting through the destinations' live results and the shifted-money benchmark.
4. `reported_influence_completeness_adj` (judgment, anchored on the charity's own statements of undercounting), 46.7–55.7; and `@meta.new_money_share` (shared), 46.4–54.0.
5. `rrf_credit_share` (judgment), 47.4–50.5. The money-moved channels and costs are observed and verified.

The model's own uncertainty is now ranged where the evidence is uncertain. The rest is shared. The gap to the nearest peer (Ubongo, 45.8) and the ×7.7 multiple of the median come from about 8.5 credited dollars moved per dollar of cost, going to destinations above the median. The summary states this reason. What would most improve the model is beyond it: models for the large unmodelled destinations (Fistula Foundation $1.69M, Sanku $1.39M, Educate Girls $0.95M, Living Goods $0.70M), which would replace the average stand-in for 44% of the money.
