# Audit: protect-democracy-charityevals, round 4
Result: 1.953e-5 daly/$ = 0.0195 years of healthy life per 1,000 dollars (combined range 0.00093–0.41); cause median 0.069 (×0.28). Verdict: pass.
Model-sha: 24c5e2796d7a1d49b5a74ca31b8d4e2246608a6a20da5f7c1fe079a95c2a20f5
Scope: scoped verification of the text-only changes in commit 0bfafff (round 3's three lows). Nothing else re-audited; scope, sources and the rest are as in round 3.
Mechanical: audit-model result, combined range, joint ranges, tornado values and canonical rows all identical to round 3 (discounted_years 1.486, wait_discount 0.8893); lint 0 high / 0 medium / 1 low (the same stated spread, 16,417×). The model-file diff of 0bfafff is two lines, the summary and the bs_discounted_years explainer; no formula, value or range changed (the Model-sha differs from round 3 only through that text).
Previous round:
- r3 #1 explainer: resolved. It now says "about 1.5 full-effect years (5 undiscounted)"; the row is 1.486.
- r3 #2 reform share: resolved. The summary and the write-up both say "about a fifth of the result"; round 3's scratch run gave 18.5% and the result is unchanged.
- r3 #3 drivers list: resolved. The list follows the audit-model tornado (ordered by high/low ratio) minus the site's sliders: risk cut, next dollar (16%–74%), GDP gain (7%–35%), forecast (5%–28%), people covered (50,000–2 million), severity (30%–100%), direct share (20%–70%), reversal hazard (2%–10%). Ranges match the model's. The reversal hazard is now listed.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | writeups/protect-democracy-charityevals.md "What drives the result" | The list follows the tornado's order, which is by ratio of high to low; by absolute swing the forecast (0.0331) is a hair above the next dollar (0.0322). Same site order, so no change needed. | audit-model tornado | None needed | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| bs_discounted_years explainer | computation | verified | 1.486 printed by audit-model |
| summary, write-up reform share | scratch run (round 3) | verified | 18.5% is "about a fifth" |
| drivers list ranges | model ranges | verified | each matches the tornado line |
| all other rows and sources | | unchanged | not re-fetched; no value or formula changed |

## Drivers
Unchanged from round 3: field risk cut (0.0054–0.074), the forecast, the next dollar, people covered, the GDP gain.

Verdict: pass (0 high, 0 medium, 1 low).
