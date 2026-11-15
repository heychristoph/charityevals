# Audit: project-drawdown-charityevals, round 6 (verification of the round 5 text fixes)
Result: -0.001300 tco2e/$ = -0.0007695 years of healthy life per $1,000, unchanged. Verdict: fail (one medium: the new drivers sentence misstates the size of the positive branches).
Model-sha: 6dcf59a0f6bebbbe7db0fe087e335937be75d3c21246f222b7d380770e6af213
Scope: round 5's medium and low, in the uncommitted diff of the summary and the write-up's "What drives the result".
Mechanical: audit-model.ts "Findings (0)"; check.ts all models valid.

Branch tonnes at the defaults (engine values, each times its own total adjustment): funders -130,689 x 0.1667 = -21,785; companies 200,332 x 0.02917 = +5,844; investors 133,555 x 0.01297 = +1,732; public 6,678 x 0.0810 = +541; the sum, times the side-effect multiplier, gives outcome_total -15,309.

| # | Severity | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|
| 1 | medium | write-up "What drives the result" | "companies' and investors' money is the positive part, a little smaller" is wrong: the positive branches total about +8,100 against funders' -21,800, about 37% of its size, not a little smaller. | numbers above | Replace "a little smaller" with "about a third its size" (or drop the size clause). | none (text) |
| 2 | resolved (was medium) | summary | Now "about −0.0013 tonnes of CO₂e, about −0.0008 years of healthy life per $1,000", matching -0.001300 and -0.00077; funders negative, companies and investors positive. | audit-model | none | none |
| 3 | resolved (was low) | summary | The sign clause says the ranked climate charities' figures average below zero once public money's cost is counted. | summary text | none | none |

No comparison with other charities in the edited text.

## Sources checked
- No new inputs; branch values recomputed from the engine for finding 1.
