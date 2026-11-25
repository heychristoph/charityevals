# Audit: metr-charityevals, round 6 (scoped verification)
Result: 0.02748 years of healthy life per $1,000 (was 0.03230, -14.9%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 62c60a70041aa6229aaa4bad98d44c544a4e61273ec837698ecf297a67e492be
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes (no blocking problem; only low lint notes)
Previous round: round 5, pass, no findings (0.107679 at mobiliser_share 100%; wording only).

## Checks
- Diff vs origin/main: only the `never_started` mark and reworded explainer on `future_dalys_averted` and the future-years row, `descendants: false` on `value_per_death`, the new row `future_animal_harm`, the `dalys_direct` formula and the `summary` sentence about the future. Nothing else. (`covid_value_per_death` is not in this model.)
- verify.mts: "lives_added off, never_started_weight 1" = 0.03230364 = "origin/main, defaults" (identical to 7 figures). Headline now 0.02748494 equals `scripts/headlines.ts` (0.0274849) and the "after" 0.02748 in lives-added.md.
- Size of each rule: never-started-weight takes the headline from 0.03230 to 0.02749 (-14.9%; future_dalys_averted 1544 DALYs no longer counts at 0%). lives-added alone: 0.0274886 to 0.0274849 (-0.013%; future_animal_harm -0.34 DALYs, value_per_death 94.32 to 94.31). animals-never-bred: none.
- Preflight passes.

## Prose
Summary: the future "counts only where you count lives that never start (0% by default)" is true. The discount rate stays listed as a big swing (8% moves the result to 0.0247, 0.1% to 0.0306): holds. Write-up: line 21 (future lives count only at a weight, 0% by default), line 43 ("deaths of people alive now carry most of the value": all of it at the defaults) and line 50 ("Long-run value set ... about 0.65", script 0.6534) are true.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (19 Nov 2026), rule never-started-branches: In the catastrophic-risk family the mark for lives that never start moves from the sum of the future to each branch's future row, so the branch weights that average the adjustments count the future as the outcome does (they counted it in full); the future's farmed animals read the branches' own formulas. Mechanical: headline unchanged, 1 row changed, against the tree before the rule.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.
