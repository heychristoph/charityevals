# Audit: campaign-legal-center-charityevals, round 3 (verification of round 2's two lows)
Result: 1.444e-5 daly/$ = 0.0144 years of healthy life per 1,000 dollars (combined range 0.00076–0.274); cause median 0.0642 (×0.225). Verdict: pass.
Model-sha: 40d89c1b8922b6e26df92bdd21e3b140db46a019c64c877aa9199ef7cbfa7de5
Scope: unchanged from rounds 1 and 2.
Mechanical: audit-model run on the current model: result, range and joint ranges identical to round 2; no other script re-run (scoped verification of two wording lows).
Previous round: finding 1 (summary and `ref_cost` explainer name the Common Cause Education Fund and Brennan Center models) resolved: both now say "the figures the Brennan Center model uses". Finding 2 (write-up drivers sentence against the tornado) resolved: see below.

Diff HEAD~1 (models, writeups) touches exactly three strings: the summary sentence, the `ref_cost` explainer and the write-up's "What drives the result" paragraph. No number, formula, range or other text changed.

Tornado order now (audit-model): win_years_counted, missing_data_discount, @next_dollar, democratization_gdp_gain, other_reform_relative_effect (0.0081–0.0382), redistricting_gain_share (0.0081–0.0381), field_risk_cut_per_year. The write-up reads: years a won reform counts, then the missing-data discount, the next-dollar figure and the size of democracy's income gain; after those, almost tied, a reform dollar against a redistricting dollar and the fair-maps share of the gain; then the field's effect on the risk of a slide. This follows the tornado, and the "almost tied" wording matches the two near-identical swings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|

No findings.

## Sources checked
Not re-fetched: no source or number changed.

## Drivers
Unchanged from round 1.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 06560793.
