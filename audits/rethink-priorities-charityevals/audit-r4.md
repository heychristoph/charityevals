# Audit: rethink-priorities-charityevals, round 4 (scoped verification)
Result: animal welfare 2.384e-7 uov/$ = 1.192e-4 years of healthy life per 1,000 dollars (combined range 8.2e-7–0.0174); headline unchanged from before the change (0.000119183); cause median 5.021e-4 (x0.24).
Verdict: **pass**
Model-sha: f821f8945e909263be56ca29dbf178c31cf94841a7f350d8a4165d7b306895b8
Scope: only the change to how the money its research changed is valued (docs/normalization.md 2.8 "November 2026: spending research changed; a mover across causes", src/engine/moved-money.ts, INV-12). Sources unchanged, not re-fetched; nothing else re-audited.

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| - | - | - | No finding. | - |

## Checks of the change
- Shared rows: `shifted_dollar_value` and `informed_money_value` (id, section, label, format, formula, explainer) equal the output of `npx tsx scripts/moved-money.ts own-split informed animal-welfare` word for word; `prior_dollar_value` and `moved_dollar_value` are unchanged and equal the shared ones too.
- Headline: `scripts/headlines.ts` gives 0.000119183, the same as before.
- Nothing dropped: `moved_value` = `informed_money_value * (1 + research_side_effects)`; the old `total_adj` product here was evidence_adj * missing_data_adj, since counterfactual_adj and attribution_share are both 1 in this model, so the new formula (evidence_adj and missing_data_adj inside `informed_money_value`) is the same number. `total_adj` is still used for `downstream_value`.
- Removed rows: `new_money_share` and `moved_dollar_net_value` were unused; no reference to either is left in the model or in `normalization-waivers.json` (the INV-12 waiver is gone). The orchestrator's `normalization-audit.ts` run: 0 violations.
- `audit-model.ts`: 0 findings (no high); the tornado is as before (`@meta.prior_vs_cash` and `missing_data_discount` change sign, nothing else).
- Text: the `moved_value` explainer ("after the adjustments and with the side effects") and the summary/write-up do not mention the removed rows or the old formula; nothing is stale.
