# Audit: project-drawdown-charityevals, round 5 (scoped verification of rule 2.23 and the 15 Nov fix-ups)
Result: -0.001300 tco2e/$ = -0.0007695 years of healthy life per 1,000 dollars (combined range -895.9 to -6.6e-10). Verdict: fail (medium #1).
Model-sha: 0f9895ae79bc29093eaf1008da7fe75a722d52ad1a65bf5d973949dbc87ec6d3
Scope: the changed rows only: the tonnes bridge's damage-beyond-deaths factor, `counterfactual_adj`, `attribution_share_shared`, `total_adj`, the summary and the write-up's summary and "What isn't modelled". No public-money branch of its own (its money-moved branch reads `#cause:climate` as the shared rule 2.8 says).
Mechanical: audit-model 0 findings; check.ts all models valid; invariants none.
Previous round: round 4 findings not re-opened.

Checked:
- Bridge: `1 + $side_effect_weight * @climate.nondeath_damages_vs_deaths` matches the shared conversion.
- Summary rows: `counterfactual_adj`, `attribution_share_shared`, `total_adj` now weight by `abs()` of each branch's size. Only `attribution_share` reads `attribution_share_shared`; no row reads `counterfactual_adj` or `total_adj`; the headline is built from the branch rows (`phil_downstream` and the others times their own adjustments), so display only. Denominators cannot cancel to zero with mixed signs any more.
- Sign change: `shifted_dollar_value = moved_dollar_value - prior_dollar_value` = `#cause:climate × (1 - prior_vs_cash × GD/GH)`, so with the ranked climate charities' average negative (rule 2.23 netted public money in Carbon180, UCS, Evergreen and others) and the factor positive at 1×, the funders' branch is negative. The tornado agrees: `@meta.prior_vs_cash` 0 gives -0.0026 and 3 gives +0.0029 (the factor flips sign), consistent with a negative cluster value times (1 - k). This is the shared moved-money rule working, not an error.
- Text: no comparison with other charities; "valued at the ranked climate charities' figures" states what the shifted dollar is valued at (the lint's `comparison` code is clean).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | `summary`; write-up "What drives the result" | Both still carry the old shape of the result. The summary says a dollar averts "about 0.01 tonnes of CO₂e" (it is now -0.0013 t per dollar). The write-up says funders' giving "carries about nine-tenths of the result; companies add about a twelfth", but funders' giving is now the negative branch and companies' and investors' money the positive one (the summary row already says so). | audit-model bottom line -0.001300 tco2e/$; sign of `phil_downstream` follows `#cause:climate`. | Summary: "about -0.001 tonnes of CO₂e, about -0.0008 years of healthy life per $1,000". Write-up: "Funders' giving is the negative part, because the ranked climate charities it is valued at average below zero at the defaults; companies' money is positive, investors' and the public's small. The sign rests on that valuation." | text only |
| 2 | low | presentation | write-up "How the model works" | "A dollar at the climate charities on the rankings is worth their figure there" is correct, but a reader should be told the shifted dollar can be negative. | as #1 | Add one clause in #1's sentence, not a new line. | none |

## Sources checked
No new observed or estimate input in these rows; the shared facts the climate average rests on are checked in the rounds of the charities that carry them.

Verdict: fail (one medium: the summary and write-up text, #1; the model rows pass).
Model-sha: 0f9895ae79bc29093eaf1008da7fe75a722d52ad1a65bf5d973949dbc87ec6d3
