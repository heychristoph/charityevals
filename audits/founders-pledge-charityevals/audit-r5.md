# Audit: founders-pledge-charityevals, round 5 (scoped verification)
Result: 6.666 years of healthy life per $1,000 (uov/$ 0.01333; was 3.597, +85%). Range 2.204 to 19.93, 0% of draws at or below zero; cause median 1.019 (x6.54). Verdict: pass.
Model-sha: c28398b72d8cd82a3ea8f9af4b4de57cb11bb4e9aeb9f5b795fb4ffc0f040391
Rules: 0.4.0
Scope: rule cause-portfolios only (inventory/rule-changes/cause-portfolios.md; docs/normalization.md "November 2026: a cause's portfolio"; assumptions/default.json `portfolios`). The model file is unchanged by the rule except wording; no source or scope re-audit.
Preflight: passes (no blocking problem); one low (stored simulation out of date).
Previous round: round 4 had no open high or medium finding; this round adds none.

## Checks and findings
- Move explained by the rule alone: Old-rule headline 3.5969, current 6.6656 (= the table). Method: re-ran the model on the same tree with `assumptions.portfolios` replaced by the old rule (every ranked charity of the cause, equal weights, money movers left out) and then with the current portfolios (script in the session scratchpad, `headline()` of the library `buildLibrary` builds): the old-rule headline equals the rule table's 'before' to five digits, so the model's rows, sources and the rest of the library did not move for any other reason; the whole move is the rule's.
- Rows: Rows reading the cause: `value_destinations` reads `#cause:global-health` only for the education share (31.1%; no modelled education grantee), the other terms are named grantees (CATF, SilverLining, Evidence Action, CHAI, Fika, PD, HKI, SecureBio...); `prior_dollar_value` reads climate 31.5% (portfolio -6.98e-6), global health 58.5% (0.0598) and catastrophic risk 2.8% (0.002705). Education is 0.311 x 0.0598 = 0.0186 of the destination value 0.0263 (71%): with the old mean (0.01013) it was 0.0032 of the old 0.009666. `value_destinations` rises 0.009666 to 0.02631; the prior barely moves (0.005140 to 0.005002), so `shifted_dollar_value` rises 0.001358 to 0.006394 (x4.7) and the headline +85%.
- Portfolio and sanity: Portfolio against what the model says: education money valued at GiveWell's four Top Charities is what the model's own explainer says ('education takes the global-health portfolio') and the rule prescribes; the match is loose (education charities are not malaria nets and vitamin A) and 71% of the destination value now rides on it. Noted for the owner as a rule-level question (should global-health money that is not health, here education, take the Top Charities?), not a model error: the model is consistent with its text and the rule (low finding 2). Climate and catastrophic-risk terms are named grantees, unchanged.

## Prose
Summary and explainer ('the global-health portfolio, GiveWell's Top Charities weighted by its funds') and the write-up's Education bullet are right and sourced. Stale: the write-up's Weaknesses bullet 'they take the global-health charities' average' (finding 1, low) and the summary's 'at the global-health charities'. No comparison with peers.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
| 1 | low | presentation | write-up, summary, prior_dollar_value | 'take the global-health charities' average'; 'at the global-health charities'; prior explainer 'global-health charities' on the rankings'. | writeups line 51 | 'take the global-health portfolio (GiveWell's Top Charities)'. | none |
| 2 | low | plausibility | value_destinations (education) | 71% of the destination value is education money at the Top Charities portfolio: by the rule, loosely matched. | education term 0.0186 of 0.0263 | Owner's rule-level decision; no model edit. Say in the write-up's education weakness that the portfolio is health-only. | none |
| L | low | presentation | generated/distributions.json | The stored simulation is out of date (preflight low). | `npx tsx scripts/preflight.ts` | Run `npx tsx scripts/summaries.ts` when the batch is done. | none |

## Sources checked
Scoped round: the portfolios' sources are in assumptions/default.json `portfolios` (GiveWell Metrics Report 2025, ACE Recommended Charity Fund distributions, Giving Green Fund 2025, Coefficient Giving's funds 2025, Carnegie Corporation grants); their members and weights were read there, not re-fetched.

## Drivers
Its cause split (impact report), the education share valued at the global-health portfolio, shared advice rows.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
