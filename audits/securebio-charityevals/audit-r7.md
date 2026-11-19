# Audit: securebio-charityevals, round 7 (scoped verification)
Result: 2.157 years of healthy life per $1,000 (was 2.320, -7.0%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: f255b23cb27021741dedb54a61c9835e3d290be5b2989be3d27aa0a574ef9119
Rules: 0.3.12
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes (no blocking problem; only low range lints, unrelated)
Previous round: round 6 passed (wording fixes only; headline then 7.73 at mobiliser_share 100%).

## Checks
- Diff against origin/main: only the never_started mark and reworded explainer on future_dalys_averted, descendants: false on value_per_death and covid_value_per_death, the new row future_animal_harm, the dalys_direct formula, and the reworded summary sentence about the future. Nothing else.
- Move: origin/main at defaults 2.320204; branch with lives_added off and never_started_weight 1 gives 2.320204 (equal). Headline now 2.157299 = scripts/headlines.ts (2.15730) = "after" 2.157 in lives-added.md. never-started-weight alone moves it -7.01% (future row 21046 DALYs no longer counts at weight 0); lives-added moves it -0.011% (2.157546 to 2.157299), matching the rule-change record. animals-never-bred: no effect.
- Preflight passes.

## Prose
Summary: "future lost counted only where you count lives that never start (0% by default)" is true. Write-up: the how-the-impact-happens sentence on the future is true. "With the Long-run value set ... about 21": script gives 20.75, holds. The default future of people not yet born contributes nothing: true (future_dalys_averted is read times weight 0). The shares (about half, a third, the rest) are unchanged from main and not touched by these rules; COVID-scale share is 22% at the defaults, consistent.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
