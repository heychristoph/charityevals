# Audit: project-drawdown-charityevals, round 9 (verification of the round 8 summary fix)
Result: -0.001255 tco2e per donor dollar = -0.000745 years of healthy life per $1,000. Verdict: fix needed (one open medium: the summary's tonnes figure rounds wrong).
Model-sha: 3d14b8bff8ef221bd2fcb888412f63bc7a5b0fdcb965a100f6ac130a12375205
Scope: round 8's open medium (model summary) and the two write-up edits against the current live values.
Previous round: round 8 finding 4 (summary) partly resolved; findings 1 and 2 (write-up) re-checked below.

Live values at the defaults: tco2e_per_donor_dollar -0.0012552 (tco2e_per_dollar -0.0029886); headline -0.000744878. Branch tonnes: funders -130,263 x 0.2500 = -32,572; companies +13,636; investors +5,195; public +541; positive/negative = 59%. The headline moved from -0.00060 only through the climate charities the funders' branch reads live (no row of this model changed).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | model `summary` | "about −0.0012 tonnes of CO₂e" is off: -0.0012552 rounds to −0.0013. The years figure "about −0.0007" matches -0.000745. | values above | Change "−0.0012 tonnes" to "−0.0013 tonnes" (years part stays). | none (text) |
| 2 | resolved by this round (was medium 2 of round 8) | presentation | write-up "What drives the result" | "about two thirds its size" no longer holds: positive branches are 59% of the funders' branch. | 19,372 / 32,572 | Edited by this round to "about three fifths its size". | none (text) |
| 3 | resolved | presentation | write-up line 31 | The adopters wording from round 8 is unchanged and still correct. | file | none | none |

No row of the model changed, so the round 8 row checks (denominators, classes, mobiliser's share once) stand. At mobiliser_share 50% the outcome is +11,587 t, as before a sign flip, consistent with a difference near zero.

## Sources checked
- No new inputs.

Write-up edit made: "about two thirds its size" -> "about three fifths its size" (writeups/project-drawdown-charityevals.md line 35).
