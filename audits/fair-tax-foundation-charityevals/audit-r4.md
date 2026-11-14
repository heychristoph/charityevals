# Audit: fair-tax-foundation-charityevals, round 4 (scoped verification of the shared corporate-tax payer multiple)
Result: 1.124e-4 uov/$ = 0.0562 years of healthy life per 1,000 dollars (model's own ranges 268,236x joint low to high); cause median 0.0667 (x0.84). Verdict: fail (fix needed: three low items that need a model, fact and write-up edit).
Scope: only `payer_consumption_vs_uk` (now `@public_funds.corporate_tax_payer_multiple`), the new fact, and the summary and write-up lines that quote them. Not re-audited: everything else.
Mechanical: audit-model lint 1 low (spread), 0 high or medium; check.ts all models valid; headline 0.066 -> 0.056 (-15%), as stated.

Verified: fact quote. The Tax Foundation page carries the JCT sentence (25 percent of corporate income taxes borne by domestic labor, 75 percent by owners of domestic capital) and "the 25/75 figure seems to come from CBO". Arithmetic: dollar-weighted harmonic mean 1/(0.75/c + 0.25) = 2.29 at c = 4 and 2.67 at c = 6, so "about 2.3 to 2.7" is right; the cap is 1/0.25 = 4. The fact sits beside us_federal_payer_multiple (1.4) and us_state_local_payer_multiple (1.05) in facts/public_funds.json; same dimension (consumption of payers against the average), and 2.5 for corporate tax against 1.4 for the whole federal mix is coherent (corporate falls on capital owners more than the income-tax and borrowing mix). Range 1.5 to 4 is sensible. Model row is a formula reading the fact, so the slider and fact move it.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | facts/public_funds.json corporate_tax_payer_multiple explainer | The range end reads "4 (all on owners)". All on owners at 4 to 6 times gives 4 to 6, not 4; 4 is the cap with a quarter on workers (the explainer's own reasoning). | Explainer: "can't exceed 4 however rich the owners" against "4 (all on owners)". | Replace "4 (all on owners)" with "4 (the 25/75 split with the owners very rich)". | 0 |
| 2 | low | presentation | summary (line 12 of the model) | "the model's own ranges span over a million-fold": audit-model now gives 268,236x (the payer range narrowed from 1.5-20 to 1.5-4). | audit-model lint: spread 268236x. | Change "over a million-fold" to "over two-hundred-thousandfold". | 0 |
| 3 | low | text | write-up, line 21 | Stale: "We judge the payers consume four times the UK average". | Row now 2.5 (1.5 to 4). | Replace with "We take the payers to consume two and a half times the UK average (the shared figure for those who bear corporate income tax: three quarters on shareholders, a quarter on workers)". | 0 |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| corporate_tax_payer_multiple | https://taxfoundation.org/jct-corporate-tax-falls-partly-labor/ | verified | JCT 25/75 sentence and CBO attribution on the page. |

## Drivers
Unchanged outside this row. Round 3 write-up item (the "10% to 22%" range) was not re-checked here.

Model-sha: 4266ef4932eaaa24858a7acdc76677374ad4dda7af36edc2a02addae41c98a72
Verdict: fail
