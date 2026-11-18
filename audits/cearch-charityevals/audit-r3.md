# Audit: cearch-charityevals, round 3
Result: 0.006531 uov/$ = 3.27 years of healthy life per 1,000 dollars (combined range 0.28–37.4); cause median 0.112 (×29.2). Verdict: pass.
Model-sha: bf0a5089cc5ab227ff9db265da8a297bdd2b2424138b2c0e374737da5d9b4883
Rules: 0.3.6
Scope: unchanged from round 2 (all of CEARCH's work, October 2022 to May 2025). Scoped verification of round 2's one open medium (finding 11) only.
Preflight: pass. Two low lines (generated/distributions.json, generated/usage.json stale): run `npx tsx scripts/summaries.ts` before commit.
Previous round: finding 11 resolved. No other high or medium was open.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | No open high or medium; no new finding from the data change. | | | none |

Resolved, checked in the files:
- 11: charities/cearch.json `spending.programme` and `lines[0].dollars` are both 120000, matching the model's `yearly_spend` best (120,000; range 70,000 to 170,000). Both sources are worded as the model's judged running costs anchored on the archived Charity Entrepreneurship profile; the spending source states no accounts are published and that regranted money is not counted as running cost (normalization.md 2.17). The model file is unchanged: its Model-sha equals round 2's.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| yearly_spend | web.archive.org/web/20250120145810/https://www.charityentrepreneurship.com/centre-for-exploratory-altruism-research | verified in round 2 | not re-fetched; the model is unchanged and the new data wording cites the same page |

## Drivers
Unchanged from round 2: `mobiliser_share`, `money_per_commission`, `@next_dollar.cearch`, `missing_data_discount`, `@meta.own_effect_share`. The far-above-median result (×29.2) was explained in round 1 and stays a noted plausibility point, not a finding.
