# Audit: ploughshares-fund-charityevals, round 12 (scoped verification)
Result: 8.282 years of healthy life per $1,000 (was 8.440 on origin/main, -1.87%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 3b986faba38f3ae1a950610984f039748c8c88763eb5821540335eb92023903b
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes (no blocking problem; only low range lints)
Previous round: r11, pass at 28.13 under rules 0.3.8 (wording re-stamp, no high or medium).

## Checks
- Diff against origin/main: only `never_started: true` on future_dalys_averted, the reworded future_dalys_averted explainer, `descendants: false` on value_per_death and covid_value_per_death, the new row future_animal_harm, the dalys_direct formula, and the reworded summary sentence on the future. Nothing else changed. (future_animal_harm is indented four spaces more than its neighbours: cosmetic.)
- verify.mts: lives_added off with never_started_weight 1 gives 8.440132, equal to origin/main at defaults (8.440132). Headline now 8.282402 = scripts/headlines.ts (8.28240) = "after" in lives-added.md (8.282). never-started-weight moves it 8.440132 to 8.283215 (-1.86%); lives-added moves it to 8.282402 (-0.0098%); animals-never-bred none.
- Preflight: passes.

## Prose
Summary: "future lost counted only where you count lives that never start (0% by default)" is true (future row is zero at the default). "Result also moves with the years a cut counts and the discount rate" holds at the defaults (1 year: 1.79; 8% discount: 7.37; 0.1% alone: 9.35). Write-up: "Those future lives count only where you count lives that never start (0% by default)" is true; "with the Long-run value set ... rises to about 30" matches 29.82; "by default the future does not count" is true. No stale future sentence found.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (19 Nov 2026), rule never-started-branches: In the catastrophic-risk family the mark for lives that never start moves from the sum of the future to each branch's future row, so the branch weights that average the adjustments count the future as the outcome does (they counted it in full); the future's farmed animals read the branches' own formulas. Mechanical: headline 8.282 → 8.282 (+0.00021%), 9 rows changed, against the tree before the rule.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.
