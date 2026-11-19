# Audit: redwood-research-charityevals, round 8 (scoped verification)
Result: 0.02913 years of healthy life per $1,000 (was 0.03423, -14.9%). Combined range not re-run (scoped round). Verdict: fix needed.
Model-sha: 0868f2e90e1d79707151d6ec70a15f7ce902a05d00e578cebeeb3cd705856ae2
Rules: 0.3.12
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: 1 blocking: "high simulation result: the simulation is unstable (5% 0.0661, 95% 10.3 × the best guess): see the inputs that flip it, and normalization.md 2.18" (plus medium ai_misuse_cost_share x1.00 / x15.3 and four low range lints)
Previous round: round 7 passed (Model-sha e42d42d9..., rules 0.3.8).

## Checks
- Diff vs origin/main: only the never_started mark and reworded explainer on future_dalys_averted, descendants:false on value_per_death and covid_value_per_death, the new future_animal_harm row, dalys_direct = (future_dalys_averted + future_animal_harm), and the reworded summary. Nothing else.
- verify.mts: "lives_added off, never_started_weight 1" = 0.03423301 = origin/main defaults (equal to 7 figures). Headline now 0.02912651 = scripts/headlines.ts (0.0291265) = lives-added.md "after" 0.02913. never-started-weight moves it -14.9% (future row 537 DALYs leaves dalys_direct); lives-added alone -0.013%; animals-never-bred none.
- Preflight run: see above.

## Prose
Summary and writeup state no range and use no {{low}}, {{high}} or {{range}}; distributions.json has "unstable": true, so that is true. "Future lost counted only where you count lives that never start (0% by default)" and "deaths of people alive now carry most of the value" hold (future row is 0 at defaults). Typed figure "Long-run value set ... about 0.71" matches 0.7058. Other figures concern unrelated rules. No false or stale sentence.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | high | preflight | outcome | Simulation unstable: 5% 0.0661, 95% 10.3 x best guess | scripts/preflight.ts blocking line | Resolve per normalization.md 2.18 (e.g. the ai_misuse_cost_share flip, x15.3 when 0 to 0.15), or record why the instability stands | none on the headline |
