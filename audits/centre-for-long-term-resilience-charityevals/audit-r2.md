# Audit: centre-for-long-term-resilience-charityevals, round 2 (verification)
Result: 0.005383 daly/$ = 5.38 years of healthy life per 1,000 dollars (combined range 0.32–90.2); cause median 5.57 (×0.97). Verdict: pass.
Model-sha: 4c69928a2e38b3104abd51e2daca35c93fc10ffe62aed34eec060e50f830969e
Scope: scoped verification of round 1's six findings and the changed rows (git diff 7f9037d..HEAD). No other part re-audited. audit-model: 0 findings, no invariant violated; check.ts: all models valid. Result unchanged from round 1 (5.383), as expected: cost scales every branch.

| # | Round 1 finding | Status | Check |
|---|---|---|---|
| 1 | staff_cost_share filed as a peer-anchored judgment | fixed | Now `kind: "estimate"`, 0.8 (0.7–0.9), sourced to the Companies House accounts (Note 6 PAYE/NI £50,213; members' funds £272 to £601,578), peer anchor dropped from the explainer. Arithmetic: £75k salary: tax £17.4k + employee NI £3.5k + employer NI £10.5k = £31.4k × 19 / 12 = £49.7k a month, matches the creditor. Staff pay with benefits £1.78M; income less surplus £2.1–2.4M gives 0.74–0.85, as stated; 0.8 sits inside. |
| 2 | employer_oncost 1.19 left out benefits | fixed | 1.25 (1.20–1.31) = 1 + 0.134 NI + 0.05 pension + about 0.07 benefits; NI blend restated (4 months at 13.8% above £9,100, 8 at 15% above £5,000, about 13.4%); source and quote (pension up to 7% matched) on the row. Charity record and write-up regenerated, see below. |
| 3 | avg_salary_gbp adverts without URLs | fixed | URLs added for all four further adverts, and the Note 6 PAYE creditor as the independent check. |
| 4 | leftover CSR / gov text | fixed | pol rows say CLTR; evidence_adj, counterfactual_adj, attribution_share_shared say "risk management branch (rm_)"; uov_bridged label has no public spending; fb_future_per_million says "Not used (fb_people is 0)"; dalys_per_death_value explainer reworded; w_rm has unit DALYs. Remaining "Council on Strategic Risks" mentions are explicit peer anchors for judgments (program_share, pol_years, bio_evidence_adj), correct. |
| 5 | staff_pay after the native output row | fixed | staff_pay now sits before total_expenses in the cost block. |
| 6 | match stated as current | fixed | Write-up: "Coefficient Giving offered in October 2024 to match other donors' gifts, up to £3 million". |

Arithmetic and consistency of the changed rows:
- staff_pay = 19 × £75,000 × 1.25 × 1.3175 = $2,346,797; total_expenses = staff_pay / 0.8 = $2,933,496 (£2.23M); programme = ×0.8 = $2,346,797. Charity record `spending.programme` and the line `dollars` are 2,346,891 (difference $94, 0.004%, rounding of the exchange rate; not a finding). Its source text says 1.25, about $2.9M: consistent.
- Model summary "$2.9M", total_expenses explainer "$2.9M (£2.2M)" and the write-up "about $2.9 million (£2.2 million), plus 25%" all agree and sit inside the £2.1–2.4M cross-check.
- Write-up "How this model was checked" describes round 1 and the fixes accurately (staff share from the accounts' tax creditor and surplus; benefits in employer costs; adverts linked; leftover text removed).
- facts/next_dollar.json CLTR entry unchanged (confirmed in the brief); not re-checked.

Findings: none. Nothing high, medium or low remains from round 1.
