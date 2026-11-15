# Audit: environmental-defense-fund-charityevals, round 14 (verification of the round 13 text fixes)
Result: 0.001792 t CO₂e/$ = 0.001033 years of healthy life per $1,000, unchanged. Verdict: pass (no high or medium finding).
Model-sha: 5c5c3d85c167cf8747d465a62276d99564db2eb734f33ca0a28badf8752fba42
Scope: round 13's two mediums, in the uncommitted diff of the model summary and the write-up.
Mechanical: audit-model.ts "Findings (0)"; check.ts all models valid, 0.001033.

| # | Severity | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|
| 1 | resolved (was medium) | summary; write-up Summary | Summary now "about 0.0018 tonnes of CO₂e (about $560 a tonne)"; write-up "about $560 a tonne of CO₂e, net of what the Inflation Reduction Act's public money costs taxpayers and the rules' compliance costs". 1/0.001792 = $558. | audit-model bottom line | none | none |
| 2 | resolved (was medium) | write-up "What drives the result" | Now "what the act's public money costs taxpayers takes about a third off and the won rules' compliance costs about a quarter", matching round 13's 36% and 24% of the gross tonnes. | round 13 arithmetic | none | none |

No comparison with other charities in the edited text.

## Sources checked
- No new inputs; the text edits only restate the model's rows (tco2e_per_donor_dollar, ira_public_cost_uov, compliance_uov_per_year) as computed in round 13.
