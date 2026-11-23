# Audit: effektiv-spenden-charityevals, round 10 (scoped verification)
Result: 3.312 years of healthy life per $1,000 (uov/$ 0.006625; was 3.439, -3.7%). Range 0.2637 to 10.15, 3% of draws at or below zero; cause median 1.019 (x3.25). Verdict: pass.
Model-sha: 44934e0211f14bae89d3684a6355d010502bc6fbd78875b2c5d0288e063d4912
Rules: 0.4.0
Scope: rule cause-portfolios only (inventory/rule-changes/cause-portfolios.md; docs/normalization.md "November 2026: a cause's portfolio"; assumptions/default.json `portfolios`). The model file is unchanged by the rule except wording; no source or scope re-audit.
Preflight: passes (no blocking problem); one low (stored simulation out of date).
Previous round: round 9 had no open high or medium finding; this round adds none.

## Checks and findings
- Move explained by the rule alone: Old-rule headline 3.4390, current 3.3124 (= the table). Method: re-ran the model on the same tree with `assumptions.portfolios` replaced by the old rule (every ranked charity of the cause, equal weights, money movers left out) and then with the current portfolios (script in the session scratchpad, `headline()` of the library `buildLibrary` builds): the old-rule headline equals the rule table's 'before' to five digits, so the model's rows, sources and the rest of the library did not move for any other reason; the whole move is the rule's.
- Rows: Rows reading the cause: `value_destinations` reads `#cause:catastrophic-risk` (0.002705, ten Coefficient grantees) for recipients without a model (2024 list, Future Matters and others) and `#cause:democracy` (2.38e-5: Brennan Center 600k, FairVote 500k, Protect Democracy 450k); poverty (about half) is named GiveWell charities and the fund's value (`value_global_health`), unchanged. `value_destinations` 0.01472 to 0.01433 (-2.6%); `prior_dollar_value` is GiveDirectly's level 0.007919 (no portfolio read), so the shifted gain on those causes stays below zero (both portfolios are below GiveDirectly, as the write-up says) and `moved_dollar_net_value` 0.003229 to 0.003112; headline -3.7%.
- Portfolio and sanity: Portfolios against the text: catastrophic risk (the write-up's 12%: Safe AI Forum, Civic AI Security Program, Future Matters; METR named) and democracy (9%) are the causes named; both portfolios from a published funder's grants, with the right sources. Result makes sense.

## Prose
Write-up bullets 'Catastrophic risks (12%)' and 'Democracy (9%)' and the explainer describe the portfolios and sources correctly; no comparison with peers. The historical audit line 'move of two equal-weight lists to the site's live cause averages' is a record of a past round, left as it is.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
| L | low | presentation | generated/distributions.json | The stored simulation is out of date (preflight low). | `npx tsx scripts/preflight.ts` | Run `npx tsx scripts/summaries.ts` when the batch is done. | none |

## Sources checked
Scoped round: the portfolios' sources are in assumptions/default.json `portfolios` (GiveWell Metrics Report 2025, ACE Recommended Charity Fund distributions, Giving Green Fund 2025, Coefficient Giving's funds 2025, Carnegie Corporation grants); their members and weights were read there, not re-fetched.

## Drivers
The poverty half (named GiveWell charities), shared credit rows, next dollar.
