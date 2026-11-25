# Audit: redwood-research-charityevals, round 9 (scoped verification)
Result: 0.02913 years of healthy life per $1,000 (was 0.03423, -14.9%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: d39477885cdbda0ddee5a81fa2f00031778c12a89b3eba6033a3ed7b050c4dc3
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, never-started-prose and never-started-branches only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 8 was "fix needed" (unstable simulation, 1 high); resolved, preflight now passes with ai_misuse_cost_share a fixed 0 of kind observed.

## Checks
- Diff against origin/main: the `never_started` marks on the five `*_future_dalys` rows, the reworded explainer on future_dalys_if_extinct, `descendants: false` on value_per_death and covid_value_per_death, the new future_animal_harm row, the dalys_direct formula, the summary's changed sentences, and ai_misuse_cost_share (value {0, 0, 0.15} judgment -> 0 observed, explainer reworded). Nothing else.
- verify.mts: "lives_added off, never_started_weight 1" = 0.03423301 = origin/main defaults, so the input change moves no default figure (its best was already 0); the difference is only that it is no longer drawn. Headline now 0.02912651 = scripts/headlines.ts (0.0291265) = never-started-branches.md "after" (0.02913). Never-started weight alone -14.9%.
- Weights: the model has no `w_<branch>` rows (one branch), so that comparison does not apply; future_dalys_averted is 0 at the default.
- sens.mts: catastrophe chance 0.38% -> 0.002214, 50% -> 0.2913; both Rethink cuts x0.1 -> 0.002913, x10 -> 0.2913; misuse share 0.15 -> 0.4460 (15.3 times); Long-run value set (0.1%, weight 1) -> 0.7058.

## Prose
Summary: future "counted only where you count lives that never start (0% by default)" holds; "raise the result 15 times" holds (15.3). Write-up: the 5% default, the future sentence, "deaths of people alive now carry most of the value" and the Biggest uncertainties figures (0.0022 to 0.29; 0.0029 to 0.29; 0.45; about 0.71) all hold at two significant figures. No false or stale sentence.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.
