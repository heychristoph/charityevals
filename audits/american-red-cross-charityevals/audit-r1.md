# Audit: american-red-cross-charityevals, round 1 (verification of the mc_years change)
Result: 4.533e-6 daly/$ = 0.004533 years of healthy life per 1,000 dollars (combined range 0.001906–0.01078); cause median 0.1100 (×0.041). Verdict: pass.
Model-sha: d27820dfdc36fea15fae3af593ad69a5e492865fd26e512a0c2e274fcb005612
Scope: scoped to the changes only: new row mc_years, row ln_gain_per_person and its readers (inc_uov, uov_bridged, missing_data_adj's mc_value_share weight), the income_years explainer, the summary and the write-up sentences about this model. Programmes and year (FY2025, $721 million domestic) not re-audited.
Mechanical: lint 0 high / 0 medium / 1 low (far-below, the summary gives the reason), invariants none, check.ts all valid, simulation-check stable (5% 0.617, 50% 1, 95% 1.57 × best guess), normalization-audit not rerun (coordinator: none).
Previous round: none kept (model is in audits/grandfathered.json).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | mc_value_share (explainer) | Says "the log gain splits by value to well under a percent". Still true after the change, but the meals' share of the log gain is now 10.8% against a value share of 11.0% (0.2 points), and the explainer does not say the weights differ because of mc_years. | Scratch calculation: ln_gain 0.011175 (audit-model prints 0.01118); meals' increment 0.001206 of it. | Optional: add "(and over the weeks they are used, 10.8% of the log gain against 11.0% of the value)" or leave as is; no formula change. | none (<0.02% via the missing-data weight) |
| 2 | low | missing-adjustment (rule 1) | dds_assistance via ln_gain_per_person | The audited "financial and material assistance" line mixes cash (about $139 million), recovery grants and relief items (clean-up kits and the like, used within weeks). The model counts all of it over the year. The line cannot be split from the accounts, and cash to US households stays a year by rule 1's rich-country clause, so this is acceptable; the effect of moving the items to weeks would be below 0.05% because the log is almost linear here. | Money per person $236, meals and nights $29, baseline $23,540: even the concentrated meals change the log gain by only 0.16%. | None needed. If wanted, say in the income_years explainer that relief items are inside the money-and-goods part and are held over the year for lack of a split. | below 0.05% |
| 3 | low | structure | ln_gain_per_person / income_years | The meals-and-nights term is also multiplied by pv_annuity_due(1, r, income_years), so if income_years were raised above 1 the meals would repeat every year. income_years is a fixed formula "1", not a slider, so there is no live effect. | Formula as written. | None needed; keep income_years at 1 (the explainer says one-off sum). | none |

## Checks of what was asked
- **Form of rule 1 when the two parts overlap**: right. Over the mc_years weeks consumption is higher by (money part + meals part ÷ t) ÷ b, over the remaining 1 − t of the year by the money part ÷ b only; the log gain is the time-weighted sum, t × ln(1 + (m + M ÷ t) ÷ b) + (1 − t) × ln(1 + m ÷ b). It reduces to ln(1 + v ÷ b) at t = 1 (checked: 0.011192 = old value) and to t × ln(1 + v ÷ (b × t)) when the money part is 0. Meals counted once (no double counting), money not shrunk, discounting by pv_annuity_due(1, r, 1) = 1.
- **Numbers**: value_per_person $264.9, mc_value_share 0.1099. ln_gain: t 0.02 → 0.011157, 0.04 → 0.011175, 0.15 → 0.011188, 1 → 0.011192. Result moves 0.004540 → 0.004533 (−0.16%), as stated. Across the mc_years range the result moves under 0.1%, so the judgment barely matters (the log is nearly linear at gains under 3% of consumption).
- **mc_years**: judgment with reason (days to weeks after a disaster, about two weeks), anchor and range 0.02–0.15 (one week to about two months). Acceptable; the anchor is a scenario, not a cited source.
- **Missing-data weight**: missing_data_adj weights the meals' discount by mc_value_share (value), not by log gain. Difference is 0.2 points of weight, below 0.02% of the result. Fine.
- **Summary**: "about 0.005 years" matches 0.004533. The rest (about a fifth of the value, ten fire deaths) unchanged and consistent with the model.
- **Write-up**: headline fallback 0.005 matches. "meals and shelter nights ... counted over the weeks they are used" is correct. The other figures in the same paragraph match live results: international 0.069 (live 0.06863), measles 0.36 (live 0.3585); weighted gift 0.010 (8,521 years over $846 million = 0.0101); relief abroad is 40% of the total (two fifths, correct) and measles 18% (a fifth, correct).
- **Other transfers used within weeks**: the wellbeing branch already runs only ls_effect_years (0.25); smoke alarms are spread over their life (4.6 years); SAF cash and cash assistance to US households stay a year by the rich-country clause; relief items see finding 2. Nothing else to change.

## Sources checked
Not in scope (no source changed).

## Drivers
Result is driven by uov_per_daly (judgment), inc_cf_large (judgment), uov_per_ln_consumption (estimate), unmodelled_benefits_adj and large_vs_poorest_fifth (both judgment). The mc_years row is not among them. What would most improve the model: sourced counterfactual shares for large-disaster help (FEMA, insurers).

Verdict: pass
Model-sha: d27820dfdc36fea15fae3af593ad69a5e492865fd26e512a0c2e274fcb005612

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
