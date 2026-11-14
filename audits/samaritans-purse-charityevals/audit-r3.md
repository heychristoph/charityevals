# Audit: samaritans-purse-charityevals, round 3
Result: 4.715e-5 daly/$ = 0.0472 years of healthy life per 1,000 dollars (unchanged from round 2). Verdict: pass.
Model-sha: bdba6df5216f39c7cbedda7f9cd1587ea13742fd95dff41419007814c6ec4fb2
Scope: verification of the three rows changed between HEAD~1 and HEAD (`occ_inkind_equivalence`, `occ_volunteer_rate_ratio`, `food_price_per_kg`). Everything else unchanged since round 2.
Mechanical: audit-model lint 0 findings; result identical to round 2 (explainer text and a range end only). `generated/` unchanged.

## Round-2 findings: status
| # | Round 2 | Status | Check |
|---|---|---|---|
| A | low, in-kind references uncited | fixed, one residual (new finding E) | Both DOIs resolve in crossref to the named papers: 10.1093/wber/lhw042 is "Shoeing the Children: The Impact of the TOMS Shoe Donation Program in Rural El Salvador" (World Bank Economic Review, 2016), 10.1257/app.6.2.195 is "Testing Paternalism: Cash versus In-Kind Transfers" (Cunha, AEJ: Applied, 2014). Cunha's abstract matches the explainer: in-kind transfer infra-marginal for total food, ten items with large variation in how extra-marginal each was. Wydick: crossref has no abstract; "most children already owned shoes, overall impact negligible" taken from the caller's quote of it, and "slightly lower shoe purchases" attributed to the authors via Quartz as told; the Quartz page could not be fetched in this round. |
| C | low, volunteer ratio high end | fixed | high 5 = $36.14 / $7.25 = 4.98, and the explainer now says 5x is the high end (all hours at minimum wage), 2x the low end (warehouse wage), judgment 3 (2-5), matching the row. |
| D | low, `food_price_per_kg` unsourced | fixed as far as possible | Now labelled a judgment with its basis. Arithmetic: `ss_spend` 61,329,506 over `ss_food_lbs` 40,000,000 lb x 0.45359237 = 18.14M kg gives $3.38/kg, "about 18 million kg, about $3.40" is right; $0.70 is 21% of that, "about a fifth" is right. Still no dated price bulletin; acceptable as stated. |

## New findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| E | low | sources | `occ_inkind_equivalence` explainer | The author list reads "Wydick, Katz, Calvo, Mutto and Janet"; crossref lists Wydick, Katz, Calvo, Gutierrez and Janet. The "1,578 children" figure is not in crossref's record and was not verified here. | crossref record of 10.1093/wber/lhw042. | Replace "Mutto" with "Gutierrez"; confirm 1,578 against the paper or drop the count. | none |

## Checks
- Only explainer text and the range end 4.7 -> 5 changed; no formula, unit or double-counting question arises. Model result and lint unchanged.

Verdict: pass.
