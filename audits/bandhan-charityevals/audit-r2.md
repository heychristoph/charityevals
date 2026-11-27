# Audit: bandhan-charityevals, round 2
Result: 0.01203 uov/$ = 6.017 years of healthy life per 1,000 dollars (combined range 1.885-19.21); cause median 0.0803 (x74.9). Verdict: pass (no high findings).
Model-sha: db6dfdffe8985acbbc0c3b9c646d70329225ca7cd1df4997f6b6abe0b332c838
Rules: 0.3.13
Scope: unchanged from round 1 and still right: fiscal year 2024-25, programme spending Rs 108.81 crore (expenditure less administration, scanned I&E account), the Rs 11.12 crore training sold to Bandhan Bank partly taken out, Targeting the Hardcore Poor plus six branches covering every programme heading of the annual report; charities/bandhan.json spending and lines match the accounts.
Mechanical: lint 0 high / 1 medium (far-above, explained under Plausibility) / 1 low (unused baseline_consumption); invariants none; normalization-audit no violation for this model (INV-14 gone: `fl_years` is labelled as the financial-literacy branch's own duration); `check.ts` all models valid; simulation 5% 0.563, 50% 1, 95% 1.78 x best guess (stable). `summaries.ts --check` still reports generated/usage.json out of date: that is the batch rule (agents do not regenerate generated/; it is rebuilt once after the merge), so it is not a finding. generated/ restored with `git checkout -- generated`.
Previous round:
- 1 (high, trial column): resolved. All eight rows read Table 2 column 2 (8.196 / 7.429 / 21.252 / 18.454; controls 52.77 / 66.59 / 72.95 / 86.88), verified in w28074.txt; intervals +-1.96 x the bracketed errors; explainers say migrants are at the household average.
- 2 (high, INV-14 `fl_years`): resolved (no violation; row relabelled and explained as the branch's own judgment).
- 3 (high, stale generated/): not a finding under the batch rule (regenerated once after the merge); `generated/` untouched by this run.
- 4 (medium, bank training cost): resolved. Ranged judgment `bank_training_cost_share` 0.9 (0.4-1) with its reasoning, cost subtracted as fee x share. Effect of the range on the result is under 10%.
- 5 (low, education reach): resolved with evidence. The report states "Data other than States and Staff are cumulative" (printed p. 8, text line 313) and Bandhan Bank's report uses "cumulative outreach" for the same count (verified). The explainer now says so.
- 6 (low, survey years as observed): partly resolved. The explainer states the rule (nearest survey, midpoints 2.25 / 5 / 8.5), but the rows are still `kind: observed` (see finding 1).
- 7 (low, unused `baseline_consumption`): not resolved (still the one low lint); see finding 2.
- 8 (low, write-up check section): resolved. "22% to 56%" matches the new ratios (30%, 22%, 56%, 41%); "0.7 to 1.25 times" matches the tornado (4.10 / 7.55 over 6.02); "no gain after year 10 about 0.7" matches 4.08.
- 9 (low, unspent grants): resolved. `gift_to_grant_years` is the mean of opening (Rs 11.29 crore) and closing (Rs 47.53 crore) balances over grants used (Rs 87.82 crore): 0.33 years.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | structure | `thp_years_18m`, `thp_years_3y`, `thp_years_7y`, `thp_years_10y` | The years each survey stands for (2, 3, 3, 2) are the modelling rule the explainer describes, yet filed `observed` with a quote about survey dates. | Explainer: "which years each stands for is our rule". | File them as `judgment` (no range needed, or compute from the survey times 1.5, 3, 7, 10 and the midpoint rule in the formula). | none |
| 2 | low | presentation | `baseline_consumption` | Still unused by the result (lint `unused`). | lint. | Delete it, or say in its explainer that it is context. | none |
| 3 | low | sensitivity | `ed_new`, `ed_years_enrolled` | With the cumulative reading confirmed, the year's rise (4,229) times 3 years credits about 14,000 children against about 150,000 enrolled (31 per centre over 4,770 centres). If 1,50,162 is a stock of current enrolment the branch is about ten times larger, but still only a few percent of the result. Left as the report's own definition supports. | AR printed pp. 8, 20-21. | Optional: widen `ed_years_enrolled` or ask the charity whether the count is current enrolment. | up to about +6% |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `thp_itt_*`, `thp_ctrl_*` | NBER w28074 Table 2 column 2 | verified | Treatment 8.196 / 7.429 / 21.252 / 18.454; control means 52.77 / 66.59 / 72.95 / 86.88; the rows' 95% bounds follow from the bracketed errors. |
| `thp_takeup` | w28074 p. 5 | verified (r1) | 266 of 514. |
| `bank_training_fee_inr` | Bandhan Bank AR 2024-25, related party table | verified | "Training Expense ... 11.12" (32.59 the year before). |
| `hp_new`, `ed_new`, `households` | AR printed pp. 11, 17, 21 | verified | 24,28,623 / 1,50,162 / 1,98,081 present in the text. |
| `ed_new` explainer | AR p. 8; Bank AR | verified | "Data other than States and Staff are cumulative"; bank text says "cumulative outreach". |
| `sj_gov_spend_inr` | Bihar SJY paper | verified | "budgetary allocation of INR 8,400 million". |
| `gift_to_grant_years` inputs, `total_expenses_inr`, `admin_expenses_inr` | AR scanned accounts | verified (r1) | Unchanged values; opening balance 112,886,082 matches the prior year's closing. |
| `eu_*`, `fl_new`, `hp_rr`, `ed_sd_per_year`, `rural_cbr`, `nmr` | various | not rechecked | Together under 10% of the result; unchanged since round 1. |

## Drivers
1. `uov_per_daly` (shared slider): 12.0 to 3.0.
2. `discount_rate` (shared): 8.4 to 4.5.
3. `thp_evidence_adj` (judgment 0.75, anchor three named factors): 4.1 to 7.6.
4. `uov_per_ln_consumption` (shared estimate): 4.5 to 7.5.
5. `tail_years` and `fade_rate` (judgments, nothing measured after year 10): 4.1 to 6.5 and 7.0 to 5.1; then `thp_itt_10y` (observed, 4.6 to 7.2).
Best improvement: a sourced anchor for the tail (a longer follow-up of the 2007 trial, or later waves of the Bihar trial).

Plausibility: THP is about 95% of the outcome on 54% of the spending; the six other branches are small and each discounted for missing data. The cost per enrolled household (about Rs 47,000 before overhead) is in line with the trial's US$2,163 at 2018 PPP. The 75x gap to the cause's median comes from the programme (a cash-and-coaching income programme with a 10-year trial plus a tail), not from a wrong row; the median itself is dominated by advocacy and research models. No site text compares with other charities: the write-up is clean, and its figure is live (`data-figure`).

Model-sha: db6dfdffe8985acbbc0c3b9c646d70329225ca7cd1df4997f6b6abe0b332c838

Re-stamped (16 Nov 2026): Pre-audit gate cleanup: typed figures now read shared facts at the same best values (@sub_saharan_africa.*, @newborn_care.*, @education.learning_gain_sd_median_rct_lmic, @education.years_primary_programme_to_work, @relief_development.*); where a copy's range differed it takes the fact's (livelihood years 1-4, years to work 6-15); explainers no longer compare with other charities' models; headline unchanged. Mechanical: headline unchanged, against 0da5e7f6.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 52be53be.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.

Re-stamped 27 Nov 2026: source link points to the model's page (the old /<model-id> address was a 404); values unchanged.
