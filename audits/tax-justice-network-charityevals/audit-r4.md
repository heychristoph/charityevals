# Audit: tax-justice-network-charityevals, round 4 (scoped verification of the payer blend)
Result: 2.507e-3 uov/$ = 1.253 years of healthy life per 1,000 dollars (model's own ranges 28,438x joint low to high); cause median 0.0628 (x20). Verdict: fail (fix needed: one low write-up change, one low fact change).
Scope: only `payer_corporate_share`, `offshore_owner_consumption_vs_uk`, `payer_consumption_vs_uk` (now a formula), the shared fact they read, and the write-up line that quotes the payers. Not re-audited: everything else.
Mechanical: audit-model lint 1 low (spread), 0 high or medium; check.ts all models valid; headline 1.256 -> 1.253 (-0.2%), as stated.

Verified: TJN quote. State of Tax Justice 2024 says US$492 billion a year; "two-thirds (US$347.6 billion) is lost to multinational corporations shifting profit offshore to underpay tax" and "the remaining third (US$144.8 billion) is lost to wealthy individuals hiding their wealth offshore"; the quote and explainer match. Blend arithmetic: 1/(0.5/2.5 + 0.5/20) = 1/(0.2 + 0.025) = 4.44, "about 4.4" is right. Harmonic mean is the right combination (cost of a dollar is 1/c, weighted by dollars). payer_corporate_share 50% (30% to 70%): the UN-convention branch is two thirds corporate, the transparency branch mostly individuals, and the model's two branches are about 51/49, so 50% is a fair judgment and the range covers both ends; fine. Offshore owners at 20x UK consumption (8 to 60): judged, anchored on Alstadsaeter, Johannesen and Zucman 2019 (top 0.01% hold about half of leaked offshore wealth); consumption much less concentrated than wealth, so 20 is plausible; range wide enough. Effect of the change on the headline is tiny (4.4 vs the old 5; harmonic mean with a heavy low tail). Shared fact: see the Fair Tax Foundation round 4 file (quote verified; range-end wording low).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | text | write-up, line 19 | Stale: "judged to consume five times the UK average". | Payers are now the blend, about 4.4. | Replace with "judged to consume about four and a half times the UK average (a blend of multinationals' shareholders, at the shared 2.5 times, and offshore wealth's owners, at 20 times)". | 0 |
| 2 | low | presentation | facts/public_funds.json corporate_tax_payer_multiple explainer | "4 (all on owners)" is wrong: 4 is the cap with a quarter on workers; all on owners at 4 to 6 times would give 4 to 6. | Explainer's own cap argument. | Replace with "4 (the 25/75 split with the owners very rich)". | 0 |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| payer_corporate_share | https://taxjustice.net/reports/the-state-of-tax-justice-2024/ | verified | Both sentences and the US$492 billion total on the page. |
| offshore_owner_consumption_vs_uk | (explainer only: Alstadsaeter, Johannesen, Zucman 2019) | not re-fetched | Judgment with a named anchor; not a top-5 driver. |

## Drivers
Unchanged outside these rows; the payer multiple is not in the tornado's top 12.

Model-sha: 46d93b1dc95d81fe1edf9e7af1654f92d900f98359f45fddda34c801fd257580
Verdict: fail
