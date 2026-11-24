# Audit: arms-control-association-charityevals, round 4 (scoped verification)
Result: 12.17 years of healthy life per $1,000 (was 12.40, -1.9%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 5aec3e1097cedf65b5a7fd984426cbda8dac1db84ae6a4ca97eeaa0627c20648
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 3 (verification of one explainer fix) passed with no findings.

## Checks
- Diff against origin/main: only the reworded summary sentence on the future, `descendants: false` on value_per_death and covid_value_per_death, the reworded future_years/future_dalys_averted explainer with `never_started: true`, the new future_animal_harm row, and the dalys_direct formula. Nothing else changed.
- verify.mts: origin/main at defaults 12.40283; branch with lives_added off and never_started_weight 1 gives 12.40283 (identical). Branch headline 12.16642 equals `scripts/headlines.ts` (12.1664) and the "after" column in lives-added.md (12.17).
- Size of each rule: never-started-weight (default 0%) takes the headline from 12.40283 to 12.16762 (-1.9%, the future was about 2% of the result); lives-added then moves it to 12.16642 (-0.0099%, matching the logged -0.0098%). animals-never-bred: none.

## Prose
Summary: "the future lost counted only where you count lives that never start (0% by default)" is true. Write-up: "Those future lives count only where you count lives that never start (0% by default)" is true; "Deaths in a war the world survives bring almost all of the result" is true (dalys_from_uov 441,343 against a direct row of -1.9); "With the Long-run value set ... about 44" matches the script's 44.04. Other sentences are unrelated to these rules.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (19 Nov 2026), rule never-started-branches: In the catastrophic-risk family the mark for lives that never start moves from the sum of the future to each branch's future row, so the branch weights that average the adjustments count the future as the outcome does (they counted it in full); the future's farmed animals read the branches' own formulas. Mechanical: headline unchanged, 1 row changed, against the tree before the rule.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
