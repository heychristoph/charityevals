# Audit: giving-what-we-can-charityevals, round 7 (scoped verification)
Result: 9.907 years of healthy life per $1,000 (uov/$ 0.01981; was 10.21, -3.0%). Range 3.546 to 26.25, 0% of draws at or below zero; cause median 1.019 (x9.72). Verdict: pass.
Model-sha: abae62fe5b54887c0eab996d36cf5de086b92963f4c2fc2562704f6b383f97a1
Rules: 0.4.0
Scope: rule cause-portfolios only (inventory/rule-changes/cause-portfolios.md; docs/normalization.md "November 2026: a cause's portfolio"; assumptions/default.json `portfolios`). The model file is unchanged by the rule except wording; no source or scope re-audit.
Preflight: passes (no blocking problem); one low (stored simulation out of date).
Previous round: round 6 had no open high or medium finding; this round adds none.

## Checks and findings
- Move explained by the rule alone: Old-rule headline 10.213, current 9.9075 (= the table). Method: re-ran the model on the same tree with `assumptions.portfolios` replaced by the old rule (every ranked charity of the cause, equal weights, money movers left out) and then with the current portfolios (script in the session scratchpad, `headline()` of the library `buildLibrary` builds): the old-rule headline equals the rule table's 'before' to five digits, so the model's rows, sources and the rest of the library did not move for any other reason; the whole move is the rule's.
- Rows: Rows reading the cause: only the catastrophic-risk recipients' term in `value_destinations` (Long-Term Future Fund, Longview, its own Risks and Resilience Fund; the $11.5M of catastrophic-risk giving in the write-up), `#cause:catastrophic-risk` 0.002705; the other terms are named charities or funds, unchanged. `value_destinations` 0.02567 to 0.02502 (-2.5%), `moved_dollar_net_value` 0.006513 to 0.006318, headline -3.0%.
- Portfolio and sanity: Portfolio against the text: the Long-Term Future Fund and Risks and Resilience fund AI and biosecurity work, which Coefficient Giving's three catastrophic-risk funds' grantees weighted by grants represent; money movers (Longview) are left out of the portfolio, as they value moved money through it. Right.

## Prose
Write-up bullet 'Catastrophic risk ... valued at the catastrophic-risk portfolio: the charities Coefficient Giving's catastrophic-risk funds paid, weighted by their grants', and the explainer, are right; no comparison with peers. Historical audit line 'live cause average' is a record, left.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
| L | low | presentation | generated/distributions.json | The stored simulation is out of date (preflight low). | `npx tsx scripts/preflight.ts` | Run `npx tsx scripts/summaries.ts` when the batch is done. | none |

## Sources checked
Scoped round: the portfolios' sources are in assumptions/default.json `portfolios` (GiveWell Metrics Report 2025, ACE Recommended Charity Fund distributions, Giving Green Fund 2025, Coefficient Giving's funds 2025, Carnegie Corporation grants); their members and weights were read there, not re-fetched.

## Drivers
Discount rate (pledges pay over decades), next dollar, the named GiveWell charities' figures.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
