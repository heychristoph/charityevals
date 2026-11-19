# Audit: epoch-ai-charityevals, round 4 (scoped verification)
Result: 0.0335 years of healthy life per $1,000 (was 0.0351, -4.6%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 1eeff80ec8add566f8eaf9e35ef9ff4257c7040046833d9a855e9b84c982c563
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: r3, re-stamped 17 Nov 2026 for rule mobiliser-share-30 (headline 0.117 to 0.0351).

## Checks
- Diff against origin/main: only the summary's future sentence, the `never_started` mark and reworded explainer on `future_dalys_averted`, `descendants: false` on `value_per_death` and `covid_value_per_death`, the new `future_animal_harm` row, and `dalys_direct` = `(future_dalys_averted + future_animal_harm)`. Nothing else.
- verify.mts: "lives_added off, never_started_weight 1" = 0.03509744 = origin/main defaults (equal). Branch defaults 0.03349406 = `headlines.ts` (0.0334941) = lives-added.md "after" (0.03349). Moves: never-started-weight alone -4.55% (0.03509744 to 0.03349756); lives-added -0.010% (to 0.03349406); together -4.57%. `future_animal_harm` = -0.21 DALYs, `dalys_direct` falls from 946.6 to -0.21 at the default weight.
- Preflight passes; no blocking lines.

## Prose
Summary: the future "counted only where you count lives that never start (0% by default)" is true at the defaults (the weight is 0%, `dalys_direct` is now the animal-harm row only). Write-up lines 20 and 45 say the same and are true; line 45's "deaths of people alive now are all of the value at the defaults" holds. Line 53: "Long-run value set ... about 0.24" matches 0.2444 (0.24). No typed 8% discount or one-year figures appear in the write-up.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (19 Nov 2026), rule never-started-branches: In the catastrophic-risk family the mark for lives that never start moves from the sum of the future to each branch's future row, so the branch weights that average the adjustments count the future as the outcome does (they counted it in full); the future's farmed animals read the branches' own formulas. Mechanical: headline 0.03349 → 0.03349 (+4.4e-14%), 3 rows changed, against the tree before the rule.
