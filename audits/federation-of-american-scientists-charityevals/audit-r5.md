# Audit: federation-of-american-scientists-charityevals, round 5 (scoped verification)
Result: 0.432 years of healthy life per $1,000 (was 0.440, -1.93%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: d5342bcd27a999dc53cc9bac845dca5f2ffc074b28bef993c9d7f546457f7c04
Rules: 0.3.12
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 4, pass (credit-rule re-stamp, headline unchanged).

## Checks
- Diff against origin/main: only `descendants: false` on value_per_death and covid_value_per_death, `never_started: true` plus a reworded explainer on future_dalys_averted, the new row future_animal_harm, and dalys_direct = (future_dalys_averted + future_animal_harm). Nothing else.
- verify.mts: lives_added off with never_started_weight 1 gives 0.4404556, equal to origin/main at defaults (0.4404556). Headline now 0.4319603, equal to scripts/headlines.ts (0.431960) and the lives-added.md "after" (0.432). never-started-weight alone: 0.4404556 to 0.4320029 (-1.92%, the future's 7,321 DALYs no longer counted). lives-added: 0.4320029 to 0.4319603 (-0.0099%). animals-never-bred: none.
- Preflight passes.

## Prose
The model's summary has no sentence about the future, so it needed no change and holds: branch shares (nuclear 93%, AI 4%, pandemic 2%, science policy under 1%) rest on the per-branch deaths-averted rows, which are unchanged (7004, 729, 203). The writeup's one changed sentence ("counted only where you count lives that never start (0% by default)") is true: dalys_direct is now -1.6 DALYs at the defaults. The writeup states no typed figure for the Long-run value set, discount rate or a one-year cut, so none is stale.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
