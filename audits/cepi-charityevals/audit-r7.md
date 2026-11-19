# Audit: cepi-charityevals, round 7 (scoped verification)
Result: 0.150780 years of healthy life per $1,000 (was 0.167307, -9.88%). Combined range not re-run (scoped round). Verdict: fix needed.
Model-sha: c7ed3f4be850e040f12004968074a16bf7518c5321ebc33c464d5b03c39dbcdb
Rules: 0.3.12
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 6 passed (0.5577 at mobiliser_share 100%, wording only; no high or medium).

## Checks
- Diff against origin/main: only `descendants: false` on `value_per_death` and `covid_value_per_death`, `never_started: true` plus reworded explainer on `future_dalys_averted`, the new `future_animal_harm` row, the `dalys_direct` formula, and a reworded explainer. Nothing else. The `summary` has no change in this diff and holds no false future claim.
- verify.mts: "lives_added off, never_started_weight 1" = 0.1673072 = origin/main at defaults (equal to 7 figures). Never-started weight alone: 0.1673072 to 0.1507985 (-9.87%). Lives-added alone: 0.1507985 to 0.1507800 (-0.012%). `future_animal_harm` is -591 DALYs against 2.66M future DALYs.
- Headline 0.1507800 equals `scripts/headlines.ts` (0.150780) and the lives-added.md "after" (0.1508).
- animals-never-bred: no effect. Preflight passes.

## Prose
Summary: no sentence about the future, none stale. Write-up: "future lost counts only where you count lives that never start (0% by default)" and "people alive now are all of the value" are true (the future row is zeroed at the defaults). Long-run set 2.48 (text "about 2.5") and 8% 0.1255 ("0.13") hold. The one-year and twenty-year figures are stale: the script gives 0.033 and 0.46.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | stale prose | writeups/cepi-charityevals.md, "The years a cut counts" | Typed figures are from before the rule: "At one year the result is 0.037; at twenty it is 0.51" | At the defaults, win_years_counted 1 gives 0.033 and 20 gives 0.46 | Write: "At one year the result is 0.033; at twenty it is 0.46." | none |
