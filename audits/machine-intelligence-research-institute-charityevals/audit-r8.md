# Audit: machine-intelligence-research-institute-charityevals, round 8 (scoped verification)
Result: 0.0312 years of healthy life per $1,000 (was 0.0366, -14.9%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: f87655580e3f46d1af153eb210046cd7fda6ddde794234c274ff652bfbd385d0
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 7 (scoped, merged death-age rule and funging = 1) passed with no open findings.

## Checks
- Diff against origin/main: only the `never_started` mark and reworded explainer on future_dalys_averted, `descendants: false` on value_per_death and covid_value_per_death, the new future_animal_harm row, the dalys_direct formula, and the reworded summary sentence about the future. Nothing else.
- verify.mts: "lives_added off, never_started_weight 1" 0.03663607 equals "origin/main, defaults" 0.03663607. Headline now 0.03117111, equal to scripts/headlines.ts (0.0311711) and the lives-added.md "after" (0.03117). Move of never-started-weight alone: 0.03663607 to 0.03117525 (-14.9%; the future's 1336 DALYs no longer count). Move of lives-added: 0.03117525 to 0.03117111 (-0.013%). animals-never-bred: none.
- Preflight: passes, no blocking line (lows only: missing ranges on small-catastrophe rows, a simulation note).

## Prose
Read the summary and writeups/machine-intelligence-research-institute-charityevals.md. The summary says the future counts only where you count lives that never start (0% by default): true. The write-up says people alive now are all of the value at the defaults, and "With the Long-run value set ... the result rises to about 0.77": true (0.7699). Typed 0.0028 to 0.37 and other figures concern the chance slider, unrelated to these rules. No false or stale sentence.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (19 Nov 2026), rule never-started-branches: In the catastrophic-risk family the mark for lives that never start moves from the sum of the future to each branch's future row, so the branch weights that average the adjustments count the future as the outcome does (they counted it in full); the future's farmed animals read the branches' own formulas. Mechanical: headline unchanged, 1 row changed, against the tree before the rule.
