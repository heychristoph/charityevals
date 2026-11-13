# Audit: wounded-warrior-project-charityevals, round 5 (verification)

Result: 1.329e-5 daly/$ = 0.01329 years of healthy life per 1,000 dollars (combined range 0.0022-0.081); cause median 0.104 (x0.1275). Verdict: **pass** (no high findings).
Model-sha: 3afd84d0cf906bfc33f76b317c52943681adcfb32a457fa89e73403df9b7b1c3
Scope: only the changes since round 4 (diff 09393a2..HEAD for this model and its write-up; main was merged in between, so the median moved from 0.338 to 0.104).

Mechanical: audit-model 0 findings. normalization-audit: no violation for this model (its one INV-4 violation is another model's); `git checkout -- generated` run afterwards.

Changes checked:
- `us_payer_multiple` now `formula: @public_funds.us_federal_payer_multiple` (1.4, 1-2, facts/public_funds.json); it resolves, the label and explainer match the fact, and the consumer row (`mcpf / (us_payer_multiple * consumption_na)`) is unchanged. Round 3/4's typed-literal item is closed.
- `ben_counterfactual_adj` source: fetched the American Legion page; it says "The grant rate for these claims is 64.6%", fiscal year 2024 to about the end of June (page dated 24 July 2024), claims VA processed that year. Quote matches. The explainer's "64.6% grant rate for claims decided in fiscal 2024 to July" is accurate.
- `vba_cost_per_claim`: the VA 2026 Budget in Brief (fetched, text extracted) lists "General Operating Expenses, Veterans Benefits Administration 3,869 3,899 3,879" under 2024 enacted / 2025 enacted with transfers / 2026 request, so $3,899M is the 2025 figure and the quote is exact. $3,899M / 3,001,734 = $1,299 a claim, as the explainer says; the $1,000 (700-1,400) judgment is unchanged.
- Summary: "about an eighth" of the median matches x0.1275. Write-up: headline 0.01 matches 0.0133; the write-up's only change is in the mental-health paragraph (0.64 to 0.60), checked in the other audit.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `vba_cost_per_claim` | The GovCIO page (fetched) says VA processed "a record 3 million Compensation and Pension (C&P) claims in fiscal year 2025"; it does not give 3,001,734, so the exact figure is not verifiable from the cited URL. It is also a count of compensation and pension claims, not only disability compensation. | WebFetch of the GovCIO page. | Cite a page that carries 3,001,734 (VA's own news release) or write "about 3 million". The $1,300 and the $1,000 are unaffected. | none |
| 2 | low | scope of cost | `vba_cost_per_claim` | The $3,899M is the discretionary GOE only; the Budget in Brief adds a further $1,426M of Toxic Exposures Fund money for VBA in 2025 (subtotal $5,325M), part of which also pays claims processing. The per-claim cost may be about $1,775 before the share paid for other benefits. | Budget in Brief p. 34 table: GOE 3,899, TEF 1,426, subtotal 5,325. | Say in the explainer that TEF money is left out, or widen the high end toward 1,800. A claim's share of a larger pool still lies inside 700-1,800. | At most a small fall: the VA cost is a minor term in WWP's credit share (about 0.8). |
| 3 | low | carried over | `ben_counterfactual_adj`, `ben_income_years` | The lifetime/timing split behind 40% (20-70%) remains a judgment; the Legion figure is the VA's rate for all claims, not for represented ones, which the explainer already says. | Round 3 finding 2. | As in round 3. | none |

## Sources checked
American Legion page (quote exact); VA 2026 Budget in Brief (3,899 exact, column 2025); GovCIO page ("3 million" only, finding 1). The VA grant rate is a different measure from WWP's 83% (claims vs WWP's own approval rate); the explainer treats the gap as selection.

## Drivers
`missing_data_discount`, `ben_income_years`, `uov_per_daly`, `ben_consumption_share`, `ben_counterfactual_adj` (judgments or shared; unchanged). `us_payer_multiple` is now a shared fact (1.4), the model's value rose from 1.3.
