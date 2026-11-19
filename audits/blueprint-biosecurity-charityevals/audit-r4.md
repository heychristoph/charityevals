# Audit: blueprint-biosecurity-charityevals, round 4 (scoped verification)
Result: 1.593 years of healthy life per $1,000 (was 1.767, -9.9%). Combined range not re-run (scoped round). Verdict: fix needed.
Model-sha: dbe1c7880717d2e782947d2368a4bc957c60c16a97c1eafb4b0a78bf00512499
Rules: 0.3.12
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 3 passed (no findings), on an earlier Model-sha and rules 0.3.8.

## Checks
- Diff vs origin/main: only the `never_started` mark and reworded explainer on `future_dalys_averted`, `descendants: false` on `value_per_death` and `covid_value_per_death`, the new row `future_animal_harm`, `dalys_direct` = `(future_dalys_averted + future_animal_harm)`, and the summary's future clause. Nothing else.
- verify.mts: lives_added off with never_started_weight 1 = 1.767461 = origin/main defaults (equal). Branch default 1.592805 = `headlines.ts` 1.59280 = the "after" 1.593 in lives-added.md. Moves: never-started-weight -9.87% (1.767461 to 1.593001); lives-added -0.012% (to 1.592805). animals-never-bred: none.
- Preflight passes.

## Prose
Summary holds (future counts only where lives that never start count, 0% default). Writeup: Long-run value set "about 25" matches 25.29; "8% discount rate ... about 1.4" matches 1.376; "deaths of people alive now are all of the value at the defaults" holds. Stale: "At one year the result is 0.38; at twenty it is 5.4" are origin/main's figures (0.3817, 5.396); now 0.34 and 4.9 (0.3440, 4.862). "From 13.5% to 79% of the past average, the result moves from 0.64 to 3.8" is main's (0.645, 3.774); now 0.58 to 3.4. "The extinction figure alone moves the result from 0.90 to 10" is probably stale too (the extinction cuts' future value no longer counts at the defaults); I could not recompute it with the script, so it needs recomputing.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | prose | writeup, Biggest uncertainties | Typed figures are the pre-rule ones | years 1: 0.344, 20: 4.862; next dollar 0.581 to 3.401; extinction line not recomputed | "At one year the result is 0.34; at twenty it is 4.9." "...the result moves from 0.58 to 3.4." Recompute the extinction line at the defaults | none |
