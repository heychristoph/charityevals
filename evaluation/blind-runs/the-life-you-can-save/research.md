# Research log: The Life You Can Save (blind build-cea run), 2026-11-03

All retrieved 2026-11-03.

## 2025 Annual Report — https://www.thelifeyoucansave.org/2025-annual-report/
- WebFetch summary (the fetch tool said the page has embedded text asking not to be reproduced verbatim; summary only):
  Money Moved 2025 $24,065,415 (2024 $20,345,228); Expenses 2025 $2,617,394 (2024 $1,833,624); "Net impact" $21,448,021;
  3-year leverage ratio (2023-2025) 9.19:1; ~2,540 donors funded operations; Rapid Response Fund with Founders Pledge raised $13.1M H1 2025.
  Report aggregates TLYCS US and TLYCS Australia. Money moved = processed + influenced donations.
  (Leverage ratio is the charity's own metric: context only, not used.)

## Financials 2025 — https://www.thelifeyoucansave.org/wp-content/uploads/2026/04/the-life-you-can-save-financials-2025-.pdf-FInal.pdf (p.1)
- US 2025: Revenue for grants $10,215,063; revenue for ops $1,074,897; total revenue $11,289,960; Expenses grants $10,015,063; "Expenses: TLYCS Ops" $2,186,576; total $12,201,639.
- US 2024: ops expenses $1,486,354.
- AU 2025: grants A$13,394,174; ops expenses A$653,207; total A$14,047,381. AU 2024 ops A$625,653.

## Money moved 2025, what's included — https://www.thelifeyoucansave.org/wp-content/uploads/2026/04/money-moved-2025-.pdf-Final.pdf (pp.1-2)
- Grants by TLYCS (US) $10,019,059 ("All gifts made directly to TLYCS US for purposes of granting to our recommended charities.")
- Grants by TLYCS Australia (USD equivalent) $8,779,010
- Rapid Response Fund $778,161 ("funds raised together with Founders Pledge for the Rapid Response Fund")
- Donations reported by recommended charities as influenced $2,804,273
- Donations reported by supporters $1,460,390
- Donations reported by intermediaries $224,520; GiveWell-routed gifts excluded.
- Sum = $24,065,413 (report total $24,065,415).

## Reconciliation instructions — https://www.thelifeyoucansave.org/wp-content/uploads/2026/04/Financial-Statement-Reconciliation-Instructions-2025.pdf
- "Total operational expenses can be calculated by adding the operating expenses of The Life You Can Save US and The Life You Can Save Australia."
- US ops = 990 Total expenses minus Grants; AU ops = all expenses except Program Costs.
- RRF $778,161 "represents reported donations that did not flow through our bank account."

## Money moved by charity 2025 — https://www.thelifeyoucansave.org/wp-content/uploads/2026/04/The-Life-You-Can-Save-money-moved-by-charity-2025.pdf.pdf
- 34 lines, matches facts/meta.json tlycs_moved_2025_* (spot-checked AMF 1,427,023; GiveDirectly 1,676,894; RRF 3,109,921; Fistula Foundation 1,692,558; Sanku 1,391,077).
- "This table excludes donations made by foundations and individuals who have requested that the designation of their contributions remain confidential."

## FX — IRS yearly average, https://www.irs.gov/individuals/international-taxpayers/yearly-average-currency-exchange-rates
- Australia Dollar 2025: 1.551 AUD per USD (2024 1.516). Page last reviewed 17-Sep-2026. -> 0.644745 USD/AUD.

## Form 990 2025 — https://www.thelifeyoucansave.org/wp-content/uploads/2026/10/2025-Public-Disclosure-990-for-TLYCS.pdf
- Text extracted locally with pypdf (venv in scratch). Calendar 2025.
- Part I line 13 grants 10,015,067 (prior 9,913,028); line 15 salaries etc. 1,786,290 (prior 1,183,793); line 17 other 400,223; line 18 total expenses 12,201,580 (prior 11,400,673); line 12 total revenue 11,955,494.
- Part IX col (A)/(B)/(C)/(D) line 25: 12,201,580 / 10,290,952 / 695,336 / 1,215,292. Line 1 grants domestic 5,780,689; line 3 foreign 4,234,378.
- US ops = 12,201,580 − 10,015,067 = 2,186,513 (financials summary: 2,186,576).
- Part XII checkboxes not legible in text extraction (audit status not confirmed from the 990). TLYCS blog (2020 correction post, search snippet) says both entities are independently audited. 2025 audited statements not posted on the site (only the summary).
- Principal officer / chair: Peter Singer.

## Rapid Response Fund
- Web search (2026-11-03): RRF launched Feb 2025 with Founders Pledge, raised ~$13.1M, now closed. Did not open Founders Pledge's RRF impact report (not needed). TLYCS counts $3,109,921 of it.

## Derived
- AU ops A$653,207 × 0.644745 = $421,152; total ops $2,607,665 (annual report $2,617,394 at TLYCS's rate).
- AU grants A$13,394,174 × 0.644745 = $8,635,831 (TLYCS's USD equivalent $8,779,010).
- Money moved (site rates) $23,922,234; credited after RRF share 0.75: $23,144,754; per $ of cost 8.88.
- Sandbox verification (12 of 19 modelled destinations present): V = 0.0270 uov/$, net 0.0231, result 0.1023 uov/$ = 51.2 healthy years/$1000.
- Rough production estimate using the stale headline figures in the sandbox write-ups of the 7 missing destinations (DMI 34, Evidence Action ~29.5 programme-weighted per normalization.md, IPA 10, Lafiya 23, One Acre Fund 14, RTV 20, Unlimit 10 years/$1000): V ≈ 18 years/$1000 → result ≈ 71 years/$1000. Not used in the model; the write-up span is live.

## Blind-rule notes
- No evaluator figure for TLYCS seen in search results. Did not open any Founders Pledge or GWWC page about TLYCS.
- WebFetch of the 2025 annual report said the page has embedded text asking not to reproduce it verbatim; only a summary was taken (no instructions acted on).

## Round 1 audit follow-up (990 Schedule D)
- Schedule D Part XII: total expenses per audited F/S 2,436,517; line 2d other "IN-KIND EXPENSES . . . $ 250,000."; per return 2,186,517 (+ 10,015,063 grants on 4b = 12,201,580). Part XI: same 250,000 in revenue. Schedule D XI/XII completed => audited financial statements exist (Part IV 12a).
- Part III: "IN 2025, WE DIRECTLY PROCESSED US $6.7M FOR OUR RECOMMENDED CHARITIES AS AGENCY FUNDS" and "GLOBALLY WE ESTIMATE THAT WE EITHER DIRECTLY RAISED OR INSPIRED US $24 M".
- Final sandbox verify result: 48.94 healthy years/$1000; rough production estimate ~68 (stale destination headlines).
