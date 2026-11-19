# Audit: bulletin-of-the-atomic-scientists-charityevals, round 6 (scoped verification)
Result: 4.758 years of healthy life per $1,000 (was 4.866, -2.2%). Combined range not re-run (scoped round). Verdict: fix needed.
Model-sha: abe0964843fdb67a13670ce2b0c24453e8ff1c06af4007bdd5b3719163076215
Rules: 0.3.12
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes (one low prose line: row nuclear_cost_share typed as "45%"; not blocking)
Previous round: round 5 (scoped, summary sentence only), pass.

## Checks
- Diff against origin/main: only the `never_started` mark and reworded explainer on future_dalys_averted, `descendants: false` on value_per_death and covid_value_per_death, the new row future_animal_harm, dalys_direct = (future_dalys_averted + future_animal_harm), and the summary's future sentence. Nothing else.
- verify.mts: "lives_added off, never_started_weight 1" = 4.866030 = origin/main defaults (identical to 7 figures). Headline now 4.758181 = scripts/headlines.ts (4.75818) = "after" column in lives-added.md (4.758).
- Move: never-started-weight alone 4.866 -> 4.7587 (-2.2%, the future's 10,924 DALYs drop out); lives-added a further -0.0099% (4.7587 -> 4.7582); animals-never-bred none.
- Preflight: no blocking line.

## Prose
Summary: "the future lost counted only where you count lives that never start (0% by default)" is true. Write-up: the "never start" sentences and "By default the future does not count" are true; "Long-run value set ... about 19" matches 18.80. One stale figure: "The shared slider runs from 1 to 20 years, moving the result from 1.1 to 15": the model gives 1.03 at 1 year and 14.5 at 20. Range "1.1 to 42" and the 96%/4% shares not re-derived (outside these rules' scope).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | prose | writeup, "What drives the result" / uncertainties | A cut counted for one year gives 1.0, not 1.1 | verify.mts: win_years_counted 1 = 1.0277 | Write "from 1.0 to 15" | none |
