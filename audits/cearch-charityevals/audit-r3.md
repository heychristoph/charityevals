# Audit: cearch-charityevals, round 3
Result: 0.006531 uov/$ = 3.27 years of healthy life per 1,000 dollars (combined range 0.28–37.4); cause median 0.112 (×29.2). Verdict: pass.
Model-sha: c650b75c42d26b0fa298f2f74f0f768e3449557a1b8153ea931450487e9b8f0e
Rules: 0.3.13
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

Re-stamped (23 Nov 2026), rule cause-portfolios: Money to a cause with no named recipient (#cause:x) is valued at the cause's portfolio: named charities weighted by a published fund's grants (assumptions portfolios), not the average of the charities on the site, so adding a charity moves no other figure (normalization 2.8). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.

Re-stamped 27 Nov 2026: source link points to the model's page (the old /<model-id> address was a 404); values unchanged.
