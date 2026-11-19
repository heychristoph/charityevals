# Audit: govai-charityevals, round 11 (scoped verification)
Result: 2.466 years of healthy life per $1,000 (was 2.710, -9.0%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: bb45040f1bcb26c94a3ab7032889f875672fb7ef704baee9117177141c67bafb
Rules: 0.3.12
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 10 passed (0.3.8): round 9's four findings resolved.

## Checks
- Diff against origin/main: only the `never_started` mark and reworded explainer on `future_dalys_averted`, `descendants: false` on `value_per_death` and `covid_value_per_death`, the new `future_animal_harm` row, the `dalys_direct` formula and the reworded summary sentence. Nothing else changed; no rows removed.
- verify.mts: with lives_added off and never_started_weight 1 the headline is 2.709613, equal to origin/main at defaults (2.709613). Headline now 2.465598 equals `scripts/headlines.ts` (2.46560) and the "after" column in lives-added.md (2.466).
- Size of moves: never-started-weight (future off at 0%): 2.709613 to 2.465901, -8.99%. lives-added: -0.012% (2.465901 to 2.465598; -0.011% at weight 1). animals-never-bred: none.
- Preflight: passes, no blocking lines.

## Prose
Summary: the future "counted only where you count lives that never start (0% by default)" is true: `dalys_direct` is now -55 DALYs (animal harm only), the future row is zeroed at the default. Write-up: the "lives that never start" sentence is true. No typed Long-run or 8% figures appear in either text. "Discount rate and years a cut counts each move the result several-fold" still holds (0.1% discount alone 0.748; one year counted 0.533). The 42% next-dollar figure holds. Branch shares (78/14/8) could not be recomputed exactly from rows; the deaths-only split of the branches is about 76/17/7 before branch adjustments, close enough that I do not call it false.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
