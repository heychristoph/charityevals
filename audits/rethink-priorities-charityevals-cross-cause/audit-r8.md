# Audit: rethink-priorities-charityevals-cross-cause, round 8 (scoped verification)
Result: 0.07512 years of healthy life per $1,000 (uov/$ 1.502e-4; was 0.004128, +1.7e+3%). Range 0.009801 to 0.5252, 0% of draws at or below zero; cause median 1.114 (x0.0674). Verdict: pass.
Model-sha: 2a29fbe541c47ca49fbddf392bb75dce7561d011757da481fec2f5df2b62132a
Rules: 0.4.0
Scope: rule cause-portfolios only (inventory/rule-changes/cause-portfolios.md; docs/normalization.md "November 2026: a cause's portfolio"; assumptions/default.json `portfolios`). The model file is unchanged by the rule except wording; no source or scope re-audit.
Preflight: passes (no blocking problem); two lows (stored simulation out of date, the typed 31% next-dollar in the summary).
Previous round: round 7 had no open high or medium finding; this round adds none.

## Checks and findings
- Move explained by the rule alone: Old-rule headline 0.0041280, current 0.075119 (= the table). Method: re-ran the model on the same tree with `assumptions.portfolios` replaced by the old rule (every ranked charity of the cause, equal weights, money movers left out) and then with the current portfolios (script in the session scratchpad, `headline()` of the library `buildLibrary` builds): the old-rule headline equals the rule table's 'before' to five digits, so the model's rows, sources and the rest of the library did not move for any other reason; the whole move is the rule's.
- Rows: Rows reading the cause: `value_destinations` = (25% x `#cause:global-health` 0.05981 + 35% x `#cause:animal-welfare` 1.005e-6 + 30% x `#cause:ai` 0.001419) / 0.9 = 0.01709 (old 0.003729) and `prior_dollar_value` = 0.6 x GiveDirectly / global-health portfolio x the same mix = 0.002262 (old 0.002914); `shifted_dollar_value` 0.000244 to 0.004447 (x18). Almost all of it is the global-health term (portfolio 0.0598 against the old mean 0.0101, 25% weight); the animal term is negligible (portfolio 1.0e-6), the AI term is 0.001419.
- Portfolio and sanity: Portfolios against the text: global health (GiveWell Top Charities), animal welfare (ACE Recommended Charity Fund grantees), AI (Coefficient Giving's AI grantees on the site): the three causes the model names; digital minds and movement work still drop out. Right for cause-neutral funders' money. Sanity check: the audit-model 'far-below' (x0.0674 of the global-health median) is pre-existing and explained by the weights, not the rule: 30% AI at 0.0014 and 35% animal at about 0, only 25% at global health; before the rule it was x0.004.

## Prose
Summary, explainer and write-up say 'that cause's portfolio' and name the three causes and the judged weights; the write-up's sentence on the portfolios (published fund's grants) is right; no comparison with peers or medians. Low: `prior_dollar_value` explainer still reads 'over the global-health charities' on the rankings, times that cause's charities''.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
| L1 | low | presentation | prior_dollar_value explainer | Old wording ('charities on the rankings'). | model file | 'over the global-health portfolio's, times that cause's portfolio's'. | none |
| L | low | presentation | generated/distributions.json | The stored simulation is out of date (preflight low). | `npx tsx scripts/preflight.ts` | Run `npx tsx scripts/summaries.ts` when the batch is done. | none |

## Sources checked
Scoped round: the portfolios' sources are in assumptions/default.json `portfolios` (GiveWell Metrics Report 2025, ACE Recommended Charity Fund distributions, Giving Green Fund 2025, Coefficient Giving's funds 2025, Carnegie Corporation grants); their members and weights were read there, not re-fetched.

## Drivers
Cause weights (judgment 25/35/30), money informed and share changed (judgments); the portfolio values now set the scale (global health 0.0598, AI 0.0014).

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.
