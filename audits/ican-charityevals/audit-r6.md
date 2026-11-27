# Audit: ican-charityevals, round 6 (scoped verification)
Result: 2.54515 years of healthy life per $1,000 (was 2.59357, -1.87%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: bfe94a00cdbb8f28d0592374e895434d5b5ba50d4aa3efdef82142aa5f5ac040
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 5 passed (re-stamp, headline 8.65 at the then-current rules); this round is on the current rules.

## Checks
- Diff against origin/main: only `descendants: false` on value_per_death and covid_value_per_death, the `never_started` mark and reworded explainer on future_dalys_averted, the new row future_animal_harm, and dalys_direct = (future_dalys_averted + future_animal_harm). The summary is unchanged (it says nothing about the future). Nothing else.
- verify.mts: "lives_added off, never_started_weight 1" = 2.593573 = "origin/main, defaults" (identical to 7 figures). Headline now 2.545150 = `scripts/headlines.ts` (2.54515) = lives-added.md "after" (2.545). never-started-weight alone moves 2.593573 -> 2.545400 (-1.86%: the 10,656-DALY future row drops out of dalys_direct; the rest comes from deaths in a survived war). lives-added moves 2.545400 -> 2.545150 (-0.0098%); animals-never-bred: no effect; future_animal_harm is -2.37 DALYs at the defaults.
- Preflight: passes.

## Prose
Summary: no sentence about the future, discounting or people not yet born; nothing to correct. Write-up (writeups/ican-charityevals.md): line 18 says the lives of those not yet born count only where lives that never start count (0% by default): true (weight 0%, future row contributes nothing). Line 42: "Deaths in a war the world survives bring almost all of the result. By default the future does not count": true. "With the Long-run value set ... the result rises to about 9": script gives 8.996 (discount 0.1% and weight 1): true. Typed 8% (0.55%/yr risk figures) are source figures, unrelated.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (19 Nov 2026), rule never-started-branches: In the catastrophic-risk family the mark for lives that never start moves from the sum of the future to each branch's future row, so the branch weights that average the adjustments count the future as the outcome does (they counted it in full); the future's farmed animals read the branches' own formulas. Mechanical: headline unchanged, 4 rows changed, against the tree before the rule.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.

Re-stamped 27 Nov 2026: source link points to the model's page (the old /<model-id> address was a 404); values unchanged.
