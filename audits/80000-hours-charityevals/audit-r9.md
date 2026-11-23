# Audit: 80000-hours-charityevals, round 9 (scoped verification)
Result: 0.2487 years of healthy life per $1,000 (uov/$ 4.975e-4; was 0.3317, -25%). Range 0.03627 to 1.617, 0% of draws at or below zero; cause median 2.181 (x0.114). Verdict: fix needed.
Model-sha: 6ea5eabced4f77473d4b6de9d92d01fecf4fec5dffd145dc75e607583a2ab076
Rules: 0.4.0
Scope: rule cause-portfolios only (inventory/rule-changes/cause-portfolios.md; docs/normalization.md "November 2026: a cause's portfolio"; assumptions/default.json `portfolios`). The model file is unchanged by the rule except wording; no source or scope re-audit.
Preflight: passes (no blocking problem); one low (stored simulation out of date).
Previous round: round 8 had no open high or medium finding; this round adds the medium below.

## Checks and findings
- Move explained by the rule alone: Old-rule headline 0.33169, current 0.24874 (= the table). Method: re-ran the model on the same tree with `assumptions.portfolios` replaced by the old rule (every ranked charity of the cause, equal weights, money movers left out) and then with the current portfolios (script in the session scratchpad, `headline()` of the library `buildLibrary` builds): the old-rule headline equals the rule table's 'before' to five digits, so the model's rows, sources and the rest of the library did not move for any other reason; the whole move is the rule's.
- Rows: Rows reading the cause: `value_destinations` = (90% x `#cause:ai` 0.001419 + 6% x avg(`#cause:biosecurity` 0.004487, `#cause:nuclear` 0.01741) + 2% x `value_global_health` 0.06149 + 0.5% x The Humane League 4.9e-6) / 0.985 = 0.003213, old 0.004284; the headline's -25% is exactly the destination value's (0.003213 / 0.004284 = 0.750); `prior_dollar_value` 0.002533 to 0.000421 and `moved_dollar_net_value` 0.000905 to 0.000901. The AI slice (90% of careers) is the one that falls, because Redwood Research (46% of the Coefficient AI grants, figure 5.8e-5) dominates the AI portfolio (0.001419).
- Portfolio and sanity: Portfolios against the text: AI safety (the cause the write-up says 90% of careers go to), biosecurity and nuclear (each area half), global health (GiveWell's Top Charities directly, unchanged), animals (The Humane League, unchanged): right. The result makes sense. Shares of the destination value at the defaults: AI 40%, global health 39%, biosecurity and nuclear 21%, animals about 0.

## Prose
Summary, explainer and write-up bullets describe the portfolios and sources correctly ('the AI portfolio, the charities Coefficient Giving's AI funds paid, weighted by their grants'; biosecurity and nuclear 'each area weighted equally, its charities by their grants'); no comparison with peers. But the write-up's 'What drives the result' says 'biosecurity and nuclear careers alone carry about half of it', which was the old split and is now about a fifth (finding 1).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | write-up (What drives the result) | Stale typed result: 'Most of the result comes from the tenth of careers outside AI; biosecurity and nuclear careers alone carry about half of it.' Now global health carries about two fifths, biosecurity and nuclear about a fifth, AI the rest (0.9 x 0.001419 : 0.06 x 0.01095 : 0.02 x 0.0615 = 40 : 21 : 39). | `#cause:` values above | 'Most of the result comes from the tenth of careers outside AI: global health about two fifths, biosecurity and nuclear about a fifth, AI the rest.' | none (wording) |
| 2 | low | presentation | prior_dollar_value explainer | Old wording ('global-health charities' on the rankings, that cause's charities'). | model file | 'portfolio'. | none |
| L | low | presentation | generated/distributions.json | The stored simulation is out of date (preflight low). | `npx tsx scripts/preflight.ts` | Run `npx tsx scripts/summaries.ts` when the batch is done. | none |

## Sources checked
Scoped round: the portfolios' sources are in assumptions/default.json `portfolios` (GiveWell Metrics Report 2025, ACE Recommended Charity Fund distributions, Giving Green Fund 2025, Coefficient Giving's funds 2025, Carnegie Corporation grants); their members and weights were read there, not re-fetched.

## Drivers
Pay given up, years stayed, share caused, the cause split (judgment anchored on its job board), next dollar.
