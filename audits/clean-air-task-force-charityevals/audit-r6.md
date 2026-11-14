# Audit: clean-air-task-force-charityevals, round 6 (scoped verification)
Result: 0.01467 tco2e/$ = 0.006691 years of healthy life per 1,000 dollars; cause median: none. Verdict: pass.
Model-sha: ff8a389b180fd28a0d53e89a71a41073a851e7f741680efb5f30a4a7149fcc5c
Scope: only the restatement of the shared fact climate.us_oil_gas_methane_rule_tco2e_2024_2038 from 1.5e9 to 1.568e9 t CO2e (diff 0d56445..HEAD of this model and its write-up, and the fact in facts/climate.json).
Mechanical: audit-model: 0 findings.
Previous round: round 5 passed; nothing reopened.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## What was checked
1. Arithmetic: 58e6 short tons x 0.90718 x 29.8 = 1,567,969,912, stored as 1.568e9 (rounded); 1.568e9 / 15 years = about 105 million a year, as the explainer says. EPA's own 1.5e9 / 58e6 / 0.90718 = 28.5, as stated.
2. Fact explainer: states the EPA basis (58 million short tons, 2024-2038), that EPA's 1.5 billion is at an older potential (about 28.5), and the restatement at GWP100 29.8 (AR6, the one the shared climate conversion uses). The source quote is EPA's verbatim wording, so keeping "1.5 billion" there is correct.
3. Headline: audit-model gives 0.01467 tco2e/$ = 0.006691 years per $1,000 (was 0.006591); the move of +1.5% matches the 4.5% rise in the rule's tonnes passing through the rule's roughly 30% share of the modelled tonnes.
4. Stale figures: grep of the model and write-up for "1.5 billion", "1.5e9", "0.0066", "0.00659": the only hits are the EPA source quotes on usmeth_first_year and usmeth_last_year (verbatim quotes, correct). The model summary and the write-up's headline span both read 0.0067; usmeth_tonnes_total's explainer names 1.57 billion at the shared potential. The write-up's "about 100 million tonnes a year (EPA)" is consistent with 105 million.

## Sources checked
Not re-fetched; the source and quote are unchanged from round 5 and only the restated conversion is new.

## Drivers
Unchanged from round 5.
