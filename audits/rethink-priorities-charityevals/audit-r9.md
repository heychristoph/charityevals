# Audit: rethink-priorities-charityevals, round 9 (scoped verification)
Result: 2.250e-5 years of healthy life per $1,000 (uov/$ 4.500e-8; was 7.389e-6, +2.0e+2%). Range 4.458e-6 to 1.071e-4, 0% of draws at or below zero; cause median 1.517e-4 (x0.148). Verdict: pass.
Model-sha: f5570f8c3364d552c2bd1699d27b371734774fd83b78fecbbb47bbd3b6b49c26
Rules: 0.4.0
Scope: rule cause-portfolios only (inventory/rule-changes/cause-portfolios.md; docs/normalization.md "November 2026: a cause's portfolio"; assumptions/default.json `portfolios`). The model file is unchanged by the rule except wording; no source or scope re-audit.
Preflight: passes (no blocking problem); one low (stored simulation out of date).
Previous round: round 8 had no open high or medium finding; this round adds none.

## Checks and findings
- Move explained by the rule alone: Old-rule headline 7.3886e-6, current 2.2499e-5 (= the table). Method: re-ran the model on the same tree with `assumptions.portfolios` replaced by the old rule (every ranked charity of the cause, equal weights, money movers left out) and then with the current portfolios (script in the session scratchpad, `headline()` of the library `buildLibrary` builds): the old-rule headline equals the rule table's 'before' to five digits, so the model's rows, sources and the rest of the library did not move for any other reason; the whole move is the rule's.
- Rows: Rows reading the cause: `value_destinations` = `#cause:animal-welfare` = 1.005e-6 (ACE Recommended Charity Fund, Feb and Aug 2026: ten charities, The Humane League 16.1% at 4.9e-6, Sinergia 15.1% at 3.2e-7, Wild Animal Initiative 16.4% at 4.9e-10 and so on; the old equal-weight mean read 1.311e-6) and `prior_dollar_value` 0.6 x GiveDirectly / global-health portfolio x that = 1.331e-7 (old 1.025e-6). The destination value falls 23% but the prior falls x7.7 (the global-health denominator rises 0.01013 to 0.05981), so the gain `shifted_dollar_value` rises x3 (8.59e-8 to 2.617e-7), the headline's x3.
- Portfolio and sanity: Portfolio is the right one: the model's money stays in farmed and wild animal welfare (EU grants, advocacy budgets) and the portfolio is the ACE fund's grantees. Result makes sense: tiny on the common scale as the write-up says, near the cause median.

## Prose
Summary, explainer and write-up ('the animal portfolio', 'the charities ACE's Recommended Charity Fund paid, weighted by its grants') are right; no comparison with peers. Lows: `moved_dollar_value` ('the cause's charities on this site') and `moved_value` ('the cause's charities') explainers and the prior explainer's 'global-health charities' still use the old wording.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
| L1 | low | presentation | moved_dollar_value, moved_value, prior_dollar_value explainers | Old wording ('the cause's charities'). | model file | 'the cause's portfolio'. | none |
| L | low | presentation | generated/distributions.json | The stored simulation is out of date (preflight low). | `npx tsx scripts/preflight.ts` | Run `npx tsx scripts/summaries.ts` when the batch is done. | none |

## Sources checked
Scoped round: the portfolios' sources are in assumptions/default.json `portfolios` (GiveWell Metrics Report 2025, ACE Recommended Charity Fund distributions, Giving Green Fund 2025, Coefficient Giving's funds 2025, Carnegie Corporation grants); their members and weights were read there, not re-fetched.

## Drivers
Money informed and share changed (judgments), next-dollar figure; the animal portfolio value 1.0e-6.
