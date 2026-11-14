# Audit: metr-charityevals, round 2

Result: 5.653e-5 daly/$ = 0.0565 years of healthy life per 1,000 dollars (combined range 0.00024-13.3; the model's own ranges jointly 0.0044-2.57; simulation 90% 0.0041-0.45, from 5% 0.072x and 95% 8.0x the best guess). Verdict: pass (no high or medium findings; one low).
Model-sha: 95331d1ecfdb24691e4c26d4bc3fffdd265305a2091c78238e3a95b96e5c9e6c
Scope: round-1 fixes only (seven changes). Mechanical: `check.ts` all models valid; `simulation-check.ts` stable (one single event, misses 0% of draws); `audit-model.ts` shows no violations (only the range and judgment-share warnings, as in round 1). `generated/` restored after the scripts.
Previous round: round 1 (two medium, five low); all seven are fixed, verified below.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | `contractor_pay` explainer | It says adding all of the $1.10M of contractors would lower the result "by at most 4%". Round 1 computed donor_cost_share 0.810 to 0.774, which is 4.4%. | Round 1 finding 7. | Say "about 4%" (or run the model with `$resource_shares` on and quote the exact figure). | None |

## Round-1 findings, checked

| R1 # | Status | Check |
|---|---|---|
| 1 short year | fixed | 990 XML: TaxPeriodBeginDt 2024-05-01, end 2024-12-31, Schedule A short-year explanation (quote in the `program_spend` explainer matches, typo "ACIVITY" included). `program_spend`, `total_expenses`, `employee_pay` labels, the summary, the write-up ("first Form 990 covers May to December 2024 ... eight months"), `charities/metr.json` `spending.source` and the next-dollar note all say 1 May to 31 December 2024. "Became exempt in March 2024" is gone. Next-dollar note: net assets $5,404,631 are all of the first return's surplus (revenue 13,639,155 less expenses 8,234,524; BOY 0); $8.2M over eight months = $12.35M a year, 5.40/12.35 = 5.2 months, "about five months" correct, same in the write-up. Cloud computing: line 14 programme column $1,094,077 of $1,127,374 total, as the explainer now says. |
| 2 funging | fixed | `leverage_funging_adj` 1 (0.85-1.05); the explainer points to the room factor of `@next_dollar.metr` and says why (one question per adjustment, no fees, no contract). The write-up row ("Counted once, in the next-dollar figure") and the closing note (0.048 to 0.057) match. The five peers were not in scope. |
| 3 quote | fixed | Now "whether their developers are on track to lose control of them", as the about page. |
| 4 benefits row | fixed | `unmodelled_benefits_adj` no longer counts the time-horizon measure; it names the EU AI Office assistance (about page, 2026) and says the smaller-harms part is "about half of the 10%"; `ai_smaller_per_year` explainer says the same. Consistent with the write-up. |
| 5 evidence_adj | fixed | Unsourced sentence about RE-Bench uptake dropped; partnerships dated "(about page, 2026)". |
| 6 next-dollar low end | fixed | Room 0.3 (the band's floor) with the reason stated; 0.3 x 0.5 x 0.85 = 12.75%, low 13%; explainer says "from 13%". The tornado shows 0.0263-0.133 for this input. |
| 7 staff_pay | fixed | `employee_pay` 4,505,180 (Part IX line 15 / Part V, as round 1) plus `contractor_pay` 147,200: Part VII section B, Qally's, "RESEARCH CONTRACTOR", CompensationAmt 147200, verified in the XML. `staff_pay` = sum; `staff_cost_share` still reads `staff_pay / cost_total`; the explainer gives 57% and the rest of the contractors are left out with a stated reason. Both inputs are observed point values with the source cited. |

## Numbers in summary, write-up and fact against the scripts

| Place | Says | Script | OK |
|---|---|---|---|
| Summary and write-up headline | 0.06, range 0.004 to 0.5 | 0.0565; simulation 90% 0.0041-0.45 | yes |
| Write-up: chance slider | 0.007 to 0.38 | tornado 0.007161-0.3769 | yes |
| Write-up: cut per dollar | 0.015 to 0.47 | 0.01477-0.4742 | yes |
| Write-up: misuse at 10% | 0.52 | 0.5158 | yes |
| Write-up: peers | Redwood 0.07, MIRI 0.07 | 0.06847, 0.07327 | yes |
| Fact and summary: next dollar | 28%, 13% to 66% | tornado 0.13-0.66, best 0.28 | yes |

## Sources checked

| Row | URL | Status | Note |
|---|---|---|---|
| `program_spend`, period, `contractor_pay`, `employee_pay`, net assets | IRS 2025 batch 11C, object 202523209349300367 (the supplied XML) | verified | See rows 1, 7 above. |
| about-page quote | https://metr.org/about | verified in round 1 (the page text is the one quoted in round 1's finding 3) | Not re-fetched; the new wording is the one round 1 gave. |
