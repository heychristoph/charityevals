# Audit: nuclear-threat-initiative-charityevals, round 13 (scoped verification)
Result: 7.29 years of healthy life per $1,000 (was 7.48, -2.55%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 0e7040706f87885ae0b471009f2538fd8623fbb48c9e638d789c07424f51f96b
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, animals-never-bred and never-started-prose only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes (only low lint range lines on four ai/nuclear "smaller" rows, not blocking)
Previous round: round 12, wording re-stamp, pass (Rules 0.3.8, Model-sha b30bd682...).

## Checks
- Diff vs origin/main: only the `never_started` mark and reworded explainer on future_dalys_averted/future_years row, `descendants: false` on value_per_death and covid_value_per_death, new row future_animal_harm, the dalys_direct formula, and the summary's future sentence. Nothing else.
- verify.mts: "lives_added off, never_started_weight 1" = 7.482899 = origin/main defaults (exact). never-started-weight alone moves 7.4829 to 7.2931 (-2.54%); lives-added moves 7.2931 to 7.2923 (-0.010%); animals-never-bred none. Headline 7.292321 = `scripts/headlines.ts` 7.29232 = lives-added.md "after" 7.292.
- Preflight passes.

## Prose
Summary: the future counts "only where you count lives that never start (0% by default)": true (future row times 0 at the default). Writeup: same sentence true; "Catastrophes the world survives account for more than extinction" true at the defaults; "Long-run value set ... about 33" matches 32.71. Discount-rate mention still holds (0.1% alone gives 8.2, 8% gives 6.5). No stale sentence found.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (19 Nov 2026), rule never-started-branches: In the catastrophic-risk family the mark for lives that never start moves from the sum of the future to each branch's future row, so the branch weights that average the adjustments count the future as the outcome does (they counted it in full); the future's farmed animals read the branches' own formulas. Mechanical: headline unchanged, 1 row changed, against the tree before the rule.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
