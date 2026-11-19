# Audit: union-of-concerned-scientists-charityevals, round 3 (scoped verification)
Result: 4.645 years of healthy life per $1,000 (was 4.734, -1.87%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 6ca26c85dfb63ed2cd77b3fa1b0d61c72034ef2a234ca4e75ef89a4b395f8e44
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 2 (see audit-r2.md), passing, later re-stamped through 17 Nov 2026 for text-only and credit-rule changes.

## Checks
- Diff vs origin/main: only the `never_started` mark and reworded explainer on `future_dalys_averted`, `descendants: false` on `value_per_death` and `covid_value_per_death`, the new `future_animal_harm` row, the `dalys_direct` formula, and the summary's future sentence. Nothing else.
- verify.mts: lives_added off with never_started_weight 1 = 4.733579 = origin/main defaults (equal to 7 figures), so with the rules off the model is what it was. Headline now 4.645208; `scripts/headlines.ts` prints 4.64521; lives-added.md "after" 4.645 (-0.0098%), as stated.
- Size of each move: never-started-weight alone takes 4.6457 to 4.7331 when raised back to 100%, i.e. about -1.8% at the default 0%; lives-added is -0.0098% (4.645664 to 4.645208).
- Preflight: passes.

## Prose
Summary: "future lost counted only where you count lives that never start (0% by default)" is true (future row is 30,879 DALYs, weight 0, net direct is -6.9). The discount rate and years counted still move the result (discount 0.1%: 5.20; 1 year: 1.00), so "moves with the years a cut counts and the discount rate" holds. The summary has no typed figures. Write-up: the nuclear paragraph says the same as the summary; no typed Long-run, 8% or one-year figures. Holds.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (19 Nov 2026), rule never-started-branches: In the catastrophic-risk family the mark for lives that never start moves from the sum of the future to each branch's future row, so the branch weights that average the adjustments count the future as the outcome does (they counted it in full); the future's farmed animals read the branches' own formulas. Mechanical: headline 4.645 → 4.645 (−0.000060%), 11 rows changed, against the tree before the rule.
