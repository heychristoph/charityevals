# Audit: sentinel-bio-charityevals, round 8 (scoped verification)
Result: 2.123 years of healthy life per $1,000 (was 2.093, +1.4%). Range 0.5761 to 12.74, 0% of draws at or below zero; cause median 2.181 (x0.974). Verdict: pass.
Model-sha: 667903404bdf15b796eb19748e5c9f9db1660600b35b816c1c7dedba8202f509
Rules: 0.4.0
Scope: rule cause-portfolios only (inventory/rule-changes/cause-portfolios.md; docs/normalization.md "November 2026: a cause's portfolio"; assumptions/default.json `portfolios`). The model file is unchanged by the rule except wording; no source or scope re-audit.
Preflight: passes (no blocking problem); one low (stored simulation out of date).
Previous round: round 7 had no open high or medium finding; this round adds none.

## Checks and findings
- Move explained by the rule alone: Old-rule headline 2.0930, current 2.1231 (= the table). Method: re-ran the model on the same tree with `assumptions.portfolios` replaced by the old rule (every ranked charity of the cause, equal weights, money movers left out) and then with the current portfolios (script in the session scratchpad, `headline()` of the library `buildLibrary` builds): the old-rule headline equals the rule table's 'before' to five digits, so the model's rows, sources and the rest of the library did not move for any other reason; the whole move is the rule's.
- Rows: Rows reading the cause: `prior_dollar_value` (0.6 x GiveDirectly / global-health portfolio x `#cause:catastrophic-risk` 0.002705: 3.581e-4, old 4.922e-3) feeds `shifted_dollar_value` (2.565e-4 to 1.626e-3) and `informed_money_value`, the advised JHU gift (under 1% of the result in the write-up), which rises; `value_destinations` 5.777e-3 is unchanged (named Center figure). `climate_value_per_dollar` = `#cause:climate` is read as -1.4e-5 (the portfolio -7.0e-6 as a reader that skips the shared missing-data step reads it) but `climate_cost_share` is 0, so `climate_uov` is 0 and the climate row moves nothing; the CSR and typical-pandemic grants (about 95% of the result) do not read any cause. The headline moves +1.4%.
- Portfolio and sanity: Portfolio against the text: the model files itself under catastrophic risk, so the ordinary-charity prior and the advised gift use the catastrophic-risk portfolio (AI plus biosecurity); the biosecurity portfolio would be a closer cause for pandemic work, but the rule reads the model's cause and the advised gift is named (the Center at its own figure). Result makes sense.

## Prose
Explainer on `climate_value_per_dollar` ('the site's climate portfolio (the Giving Green Fund's 2025 grantees, weighted by grants)') is right and sourced; write-up unchanged and contains no portfolio sentence to fix; no comparison with peers. Low: the prior explainer's old wording.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
| L1 | low | presentation | prior_dollar_value explainer | 'global-health charities' / 'catastrophic-risk charities'. | model file | 'portfolio'. | none |
| L | low | presentation | generated/distributions.json | The stored simulation is out of date (preflight low). | `npx tsx scripts/preflight.ts` | Run `npx tsx scripts/summaries.ts` when the batch is done. | none |

## Sources checked
Scoped round: the portfolios' sources are in assumptions/default.json `portfolios` (GiveWell Metrics Report 2025, ACE Recommended Charity Fund distributions, Giving Green Fund 2025, Coefficient Giving's funds 2025, Carnegie Corporation grants); their members and weights were read there, not re-fetched.

## Drivers
How much a dollar of pandemic work cuts the risk (Rethink's placeholders), the Council on Strategic Risks's figure, the next-dollar figure; the rule moves only the advised gift.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
