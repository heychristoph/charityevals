# Audit: rethink-priorities-charityevals-global-health, round 4 (scoped verification)
Result: 6.825e-4 uov/$ = 0.3412 years of healthy life per 1,000 dollars (combined range 0.0025–46.0), unchanged from before the change (headline 0.341233); global-health median 0.0631 (×5.4).
Verdict: **pass**
Model-sha: 9da7ec64a19b1bf96b5818509df1c39e96d8bb6684b0082a5de3bc460d9de892
Scope: only the change to the money-moved rows (docs/normalization.md 2.8, INV-12): `shifted_dollar_value` and `informed_money_value` added, `moved_value` rewritten, `new_money_share` and `moved_dollar_net_value` removed, the INV-12 waiver deleted, the summary's 0.36 corrected to 0.34. Sources unchanged, not re-fetched.

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | writeups/rethink-priorities-charityevals.md line 3 | The typed fallback inside the live figure span for this model still reads 0.36 (live result 0.34). | Change the typed text to 0.34. |

## Checks of the change
- Shared rows: `shifted_dollar_value` and `informed_money_value` (id, label, format, formula, explainer) equal the output of `moved-money.ts own-split informed` word for word.
- Headline: `headlines.ts` prints 0.341233, equal to the value before the change; the summary's 0.34 now matches the live result.
- `audit-model.ts`: no high or medium finding; the only finding is a low one (spread, already stated in the summary).
- Nothing dropped: `counterfactual_adj` and `attribution_share` are 1 in this model, so `evidence_adj * missing_data_adj` equals the old `total_adj` (0.35); `total_adj` is still used by the downstream term. The old formula's `(moved - prior)` factor is now `shifted_dollar_value`, same value.
- Removed rows (`new_money_share`, `moved_dollar_net_value`) are referenced nowhere in the model; the INV-12 waiver for this model is gone from normalization-waivers.json; the orchestrator reports 0 violations.
- Text: summary and the `moved_value` explainer still describe the mechanism correctly (gain over GiveDirectly, evidence step, missing-data discount, side effects); no stale row names.
