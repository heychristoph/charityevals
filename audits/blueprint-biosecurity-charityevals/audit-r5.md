# Audit: blueprint-biosecurity-charityevals, round 5 (scoped verification)
Result: 1.593 years of healthy life per $1,000 (was 1.767, -9.9%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 568ae3992a4fc7903915e2e31ab789c0dba34bfd57a528655fd09eea93839e51
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, never-started-prose and never-started-branches only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 4 was "fix needed" (one medium: stale typed figures in Biggest uncertainties); resolved, the write-up now reads 0.34/4.9, 0.58 to 3.4 and 0.89 to 8.7, all matching.

## Checks
- Diff vs origin/main: only never_started marks on the five *_future_dalys rows, reworded explainer on future_dalys_averted, descendants:false on value_per_death and covid_value_per_death, the new future_animal_harm row, the dalys_direct formula, and the summary's future clause. Nothing else.
- verify.mts: lives_added off + never_started_weight 1 = 1.767461 = origin/main defaults. Headline 1.592805 = scripts/headlines.ts (1.59280) = never-started-branches.md "after" (1.593, unchanged: one branch only, so the mark's move changes nothing at the headline).
- Weights at weight 0: w_bio 174151 = bio_deaths_averted * dalys_from_uov / deaths_averted exactly; every other w_ is 0. No future in any w_<branch>.
- Preflight: passes.

## Prose
Summary and write-up read; the future counts only where lives that never start count (0% default), holds. Recomputed: Long-run value set 25.3 (about 25), 8% discount 1.376 (1.4), 1 year 0.344 (0.34), 20 years 4.862 (4.9), extinction cut low/high 0.885 / 8.668 (0.89 to 8.7), next dollar 13.5% to 79% gives 0.581 to 3.401 (0.58 to 3.4). Far-UVC uptake range 0.4 to 1.2 as stated. No share-by-branch figures to check (one branch).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.
