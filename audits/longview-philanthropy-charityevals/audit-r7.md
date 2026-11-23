# Audit: longview-philanthropy-charityevals, round 7 (scoped verification)
Result: 0.3662 years of healthy life per $1,000 (uov/$ 7.324e-4; was 0.2346, +56%). Range 0.1183 to 1.155, 0% of draws at or below zero; cause median 2.181 (x0.168). Verdict: pass.
Model-sha: 5fe85bf0b0852c0ae141197e366e9373ab55b118d19676033d7e34d6eec36024
Rules: 0.4.0
Scope: rule cause-portfolios only (inventory/rule-changes/cause-portfolios.md; docs/normalization.md "November 2026: a cause's portfolio"; assumptions/default.json `portfolios`). The model file is unchanged by the rule except wording; no source or scope re-audit.
Preflight: passes (no blocking problem); one low (stored simulation out of date).
Previous round: round 6 had no open high or medium finding; this round adds none.

## Checks and findings
- Move explained by the rule alone: Old-rule headline 0.23462, current 0.36618 (= the table). Method: re-ran the model on the same tree with `assumptions.portfolios` replaced by the old rule (every ranked charity of the cause, equal weights, money movers left out) and then with the current portfolios (script in the session scratchpad, `headline()` of the library `buildLibrary` builds): the old-rule headline equals the rule table's 'before' to five digits, so the model's rows, sources and the rest of the library did not move for any other reason; the whole move is the rule's.
- Rows: Rows reading the cause: `value_destinations` = (AI 81%: MATS and METR named, the rest `#cause:ai` 0.001419; nuclear 12%: `#cause:nuclear` 0.01741 (Carnegie, three members); biosecurity 3%: `#cause:biosecurity` 0.004487 (Coefficient, four members)) = 0.004299, and `prior_dollar_value` = 0.6 x GiveDirectly / global-health portfolio x the same mix = 4.65e-4.  `value_destinations` 0.004560 to 0.004299 (-6%) but `prior_dollar_value` 0.003161 to 0.000465 (x6.8 down, the global-health denominator), so `shifted_dollar_value` 0.000420 to 0.001150 and `moved_dollar_net_value` 0.000894 to 0.001220; the headline +56%.
- Portfolio and sanity: Portfolios against the text: AI, nuclear and biosecurity, the three areas the write-up names, each from a published funder's grants; MATS and METR stay named. Right. The model's own-charity exclusion and money movers left out are consistent with it (Longview is itself a money mover). Result makes sense and the cause comparison is not needed.

## Prose
Summary, explainer and write-up ('Each area is valued at its portfolio: the charities a published fund paid for that work, weighted by their grants') are right; no comparison with peers. Lows: the write-up says 'Nuclear grants carry most of the value' (nuclear is now 49% of the destination value: 'about half'), the `value_destinations` explainer says the other grantees 'take their area's charities', and the prior explainer's old wording.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
| L1 | low | presentation | write-up weakness 'share that went to nuclear', value_destinations, prior_dollar_value explainers | 'carry most of the value' (now about half: 0.12 x 0.01741 = 0.00209 of 0.0043); 'take their area's charities'; old prior wording. | model, write-up | 'carry about half of the value'; 'take their area's portfolio'. | none |
| L | low | presentation | generated/distributions.json | The stored simulation is out of date (preflight low). | `npx tsx scripts/preflight.ts` | Run `npx tsx scripts/summaries.ts` when the batch is done. | none |

## Sources checked
Scoped round: the portfolios' sources are in assumptions/default.json `portfolios` (GiveWell Metrics Report 2025, ACE Recommended Charity Fund distributions, Giving Green Fund 2025, Coefficient Giving's funds 2025, Carnegie Corporation grants); their members and weights were read there, not re-fetched.

## Drivers
Area split (81/12/3), the share Longview's advice changed, next-dollar figure, MATS's share.
