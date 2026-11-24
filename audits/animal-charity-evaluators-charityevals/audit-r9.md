# Audit: animal-charity-evaluators-charityevals, round 9 (scoped verification)
Result: 1.517e-4 years of healthy life per $1,000 (uov/$ 3.033e-7; was 6.490e-5, +1.3e+2%). Range 4.834e-5 to 4.863e-4, 0% of draws at or below zero; cause median 1.368e-4 (x1.109). Verdict: fix needed.
Model-sha: 4d6ed62d89594dbc98876d6ba5df6d7df0f07818cfa3ad3b2d8db39ba015150d
Rules: 0.4.0
Scope: rule cause-portfolios only (inventory/rule-changes/cause-portfolios.md; docs/normalization.md "November 2026: a cause's portfolio"; assumptions/default.json `portfolios`). The model file is unchanged by the rule except wording; no source or scope re-audit.
Preflight: passes (no blocking problem); one low (stored simulation out of date).
Previous round: round 8 had no open high or medium finding; this round adds the medium below.

## Checks and findings
- Move explained by the rule alone: Old-rule headline 6.4900e-5, current 1.5167e-4 (= the table). Method: re-ran the model on the same tree with `assumptions.portfolios` replaced by the old rule (every ranked charity of the cause, equal weights, money movers left out) and then with the current portfolios (script in the session scratchpad, `headline()` of the library `buildLibrary` builds): the old-rule headline equals the rule table's 'before' to five digits, so the model's rows, sources and the rest of the library did not move for any other reason; the whole move is the rule's.
- Rows: Rows reading the cause: only `prior_dollar_value` (= 0.6 x GiveDirectly / `#cause:global-health` x `#cause:animal-welfare` = 1.331e-7); donors' money is valued at its Recommended Charities' own figures (named), not the cause. The prior fell from 1.025e-6 to 1.331e-7 (from about 0.78 of the animal portfolio to 0.132 of it, as the global-health denominator rose 0.01013 to 0.05981), so the shifted money's gain over an ordinary charity grew (`shifted_dollar_value` -4.3e-9 to +2.63e-7; `moved_dollar_net_value` 1.49e-7 to 2.83e-7), and `moved_value` and the result follow; the destination figure 1.010e-6 is the named Recommended Charities' and did not move.
- Portfolio and sanity: Portfolio right: ACE's fund grantees for the animal-welfare ordinary charity. ACE itself is not a member. The result sits at the cause median.

## Prose
Write-up sentence on the prior says 'an ordinary animal charity is to the animal portfolio ... as GiveDirectly is to the global-health one: about 75% of it'. That figure is the old one: now 0.6 x GiveDirectly / global-health portfolio = 13% (1.331e-7 / 1.005e-6) (finding 1). Summary and explainers are right; no comparison with peers.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | write-up, prior_dollar_value | Stale typed result: 'about 75% of it' (write-up paragraph on shifted money) was true under the old mean and is 13% now. | prior 1.331e-7 / portfolio 1.005e-6 = 0.132 | 'about an eighth of it' (or 'about 13%'). | none (wording) |
| 2 | low | presentation | prior_dollar_value explainer | 'global-health charities'. | model file | 'global-health portfolio'. | none |
| L | low | presentation | generated/distributions.json | The stored simulation is out of date (preflight low). | `npx tsx scripts/preflight.ts` | Run `npx tsx scripts/summaries.ts` when the batch is done. | none |

## Sources checked
Scoped round: the portfolios' sources are in assumptions/default.json `portfolios` (GiveWell Metrics Report 2025, ACE Recommended Charity Fund distributions, Giving Green Fund 2025, Coefficient Giving's funds 2025, Carnegie Corporation grants); their members and weights were read there, not re-fetched.

## Drivers
Next-dollar figure (30%), the animal weights, new-money share (50%, shared).
