# Audit: rethink-priorities-charityevals (with -global-health and -cross-cause), round 3 (verification of round 2's fixes)
Result: animal welfare 2.444e-7 uov/$ = 1.222e-4 years of healthy life per 1,000 dollars (combined range 9.2e-7–0.0162); cause median 5.021e-4 (×0.24). Global health 7.106e-4 uov/$ = 0.355 years per 1,000 dollars (combined range 0.0029–43.6); hand-built global-health median 0.0631 (×5.6). Cross-cause 5.205e-5 uov/$ = 0.0260 years per 1,000 dollars (combined range 2.8e-4–2.43, was 4.9e-9–8.1e4); global-health median 0.0652 (×0.40). Round 2's sign flips are gone: the cross-cause tornado no longer changes sign for any of its own judgments (only the shared `@meta.prior_vs_cash` at 3 and `missing_data_discount` at 0.1 do).
Verdict: pass
Model-sha: f125b6a556a57bf42351f05e7ba2fec4a95533d5fc75c86edfeaf43effac67a8
Model-sha (rethink-priorities-charityevals-global-health): 8a3605171926fba1cc11d87c561df5d640328ef4df779c29c7a217e1c4dd576f
Model-sha (rethink-priorities-charityevals-cross-cause): 327bdbe3ce4973184834047722da0b1fc8be1761dc84a6568f569400b876fe26
Scope: unchanged from round 2 (verification only; untouched rows not re-audited).
Mechanical: `audit-model.ts` on the three models prints no lint finding and no invariant violation; `check.ts` all valid for the three ids; `simulation-check.ts`: main 5% −4.72 / 95% 10.6, global health −11.6 / 25, cross-cause −5.56 / 17 (all × best guess, median 1, none marked UNSTABLE); `normalization-audit.ts`: no violation for these models (the 4 INV-15 violations are other models); the new INV-12 waiver is acceptable (a checked false positive: the check assumes a global-health model's shifted money is global-health money, while this model's shares are split by cause; reason stated and correct).

Round-2 findings:
- 1 (value_destinations read the catastrophic-risk cause for AI work): fixed. Fact renamed `rp_cross_cause_share_ai` (0.3, 0.15–0.45), `value_destinations` reads `#cause:ai`, the three weights' explainers say digital minds and AI consciousness drop out; no "catastrophic" is left in the cross-cause model or the facts it reads.
- 2 (prior against GiveDirectly for every share): fixed. `prior_dollar_value` = `@meta.prior_vs_cash * #givedirectly / #cause:global-health * value_destinations`; label and explainer say what it is; the INV-12 waiver is added with the reason; the normalization audit passes. The result is 0.026, positive.
- 3 (cross-cause simulation unstable): fixed. The simulated middle is the best guess (×1), 5% −5.6×, 95% 17×.
- 4 (next-dollar use reason for the two teams): fixed. Use 0.65 with the two teams' reason (scaling cross-cause prioritisation and surveys' core needs, pp. 20 and 35); 0.5 × 0.65 × 0.95 = 31%, 12–72%; the model's explainer and summary say 31%.
- 5 (fellows and confidential policy wording): fixed. The write-up says where the fellows went is only part of each model's side-effects row; the global-health side-effects explainer now names the early-career researchers; the global-health and cross-cause `units_affected_per_year` say "the animal welfare model's side effects".
- 6 (typed 0.37): fixed. Summary 0.36 (live 0.3553), write-up headline figure 0.36, and its history no longer types the old result.
- 7 (`rethink_priorities_ghd` note): fixed. The note states the $1,265,000 current assets in the funding table (p. 12), why the audited year-end figure is used, and that the commissioned work pays for itself.
- 8 (typo): fixed.

| # | Severity | Model | Row | Finding | Fix |
|---|---|---|---|---|---|
| 1 | low | cross-cause | facts/meta.json `rp_cross_cause_share_ai` label; write-up first paragraph | The renamed fact's label reads "share informing ai decisions" (lowercase from the id word); the write-up's opening still lists the organisation's causes as "animal welfare, global health and catastrophic risks", right for the organisation but the cross-cause part is now valued at AI safety. | Label: "share informing AI safety decisions (our judgment)"; optionally "AI safety" for "catastrophic risks" in the write-up's opening sentence. |

No high or medium finding remains, and the changes introduced no new problem: typed figures match the live results (0.36, 0.03, 31%) and the summaries match the models.

## Sources checked
Nothing new to fetch: round 2's verified quotes stand (results report p. 12, 20, 25, 35; Form 990 Schedule O). The changed notes cite the same pages ($1,265,000 funding-table assets p. 12, $825K p. 20, core needs p. 35), consistent with round 2's reading.

## Drivers
Cross-cause: `@meta.prior_vs_cash`, `missing_data_discount`, `@next_dollar.rethink_priorities`, `wit_money_informed`, `discount_rate`, then the cause weights; the sign is robust at the defaults. Main and global health unchanged.
