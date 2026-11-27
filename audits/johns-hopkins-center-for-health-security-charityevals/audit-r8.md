# Audit: johns-hopkins-center-for-health-security-charityevals, round 8 (scoped verification)
Result: 2.889 years of healthy life per $1,000 (was 3.205, -9.9%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 3bfedbd490a03da090dd8c72f6367e1c78e790a46bb125247aace6cb49cb9f15
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, never-started-prose and never-started-branches only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes (no blocking problem; low range lints only)
Previous round: round 7 was "fix needed" (one medium: shares by pandemic type, proposed 60% / a quarter). Not adopted, and I find the write-up's text is the true one: round 7 weighed deaths without the cut per $1M, which differs by pathway (extinction 1.3e-4, catastrophe and COVID-scale 2.3e-4). Recomputed with the cuts: extinction 49%, survivable catastrophes 37%, COVID-scale 14%. Check: zeroing the extinction cut leaves 1.463 of 2.889 (51% remains, so extinction is 49%).

## Checks
- Diff against origin/main: only `never_started` marks on the five `*_future_dalys` rows, reworded explainer on the future row, `descendants: false` on `value_per_death` and `covid_value_per_death`, the new `future_animal_harm` row, the `dalys_direct` formula and the reworded summary. Nothing else; no rows removed.
- verify.mts: lives_added off with never_started_weight 1 gives 3.205432, equal to origin/main at defaults. Headline now 2.888679 equals `scripts/headlines.ts` (2.88868) and the "after" column of never-started-branches.md (2.889, unchanged by that rule).
- With the weight at 0, w_bio (731188) and w_fb (281719) equal `<branch>_deaths_averted * dalys_from_uov / deaths_averted` exactly; no future in them.
- Preflight passes.

## Prose
Summary and write-up read. "Pandemics that end humanity's future about half, survivable catastrophes 37%, COVID-scale the rest": holds (49 / 37 / 14). Long-run value set 44.7 ("about 45"). Cut per dollar 1.6 to 16 holds (1.57 to 16.05 either pathway). win_years_counted 1 to 20: 0.62 to 8.8 holds. Discount, lives-that-never-start and future sentences are true. No stale figure.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.

Re-stamped 27 Nov 2026: source link points to the model's page (the old /<model-id> address was a 404); values unchanged.
