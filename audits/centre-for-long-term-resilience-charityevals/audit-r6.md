# Audit: centre-for-long-term-resilience-charityevals, round 6 (scoped verification)
Result: 1.796 years of healthy life per $1,000 (was 1.945, -7.6%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: e8ee40c1e81b374de2877931f36f54ba8abde43204dc7e49a78d8066e6d65d03
Rules: 0.3.12
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 5 (wording follow-up) passed with no findings, on rules 0.3.8.

## Checks
- Diff against origin/main: only the `never_started` mark and reworded explainer on `future_dalys_averted`, `descendants: false` on `value_per_death` and `covid_value_per_death`, the new row `future_animal_harm`, `dalys_direct` = `(future_dalys_averted + future_animal_harm)`, and the reworded summary sentence about the future. Nothing else.
- verify.mts: lives_added off with never_started_weight 1 gives 1.944514, equal to origin/main at defaults (1.944514). Headline now 1.796325; `scripts/headlines.ts` prints 1.79633; lives-added.md "after" is 1.796.
- Size of the moves: never-started-weight alone 1.9445 to 1.7965 (-7.6%; the future's 10,664 DALYs no longer count). lives-added -0.012% (1.796532 to 1.796325). animals-never-bred: none.
- Preflight passes, no blocking lines.

## Prose
Summary: "the future lost counted only where you count lives that never start (0% by default)" is true. It gives no typed figures for the discount rate or the Long-run value set. Writeup line 15: the same statement, true. No other sentence in the summary or writeup concerns the future, the discount rate's effect or the people-alive-now share; the 85% biosecurity share is unrelated to these rules.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
