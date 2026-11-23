# Audit: ibbis-charityevals, round 7 (scoped verification)
Result: 2.406 years of healthy life per $1,000 (was 2.670, -9.9%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 8a966e1f26fcd601b9634fd3185510bf440afdf9e2d2e036591fe972625a9658
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, never-started-prose and never-started-branches only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes (no blocking problem)
Previous round: round 6 was "fix needed" (one medium: stale "1.9 to 27" for win_years_counted 1 to 20). Resolved: the write-up now reads "0.52 to 7.3", which matches 0.5197 and 7.345.

## Checks
- Diff against origin/main: only `never_started` marks on the five `*_future_dalys` rows, reworded explainer on the future row, `descendants: false` on `value_per_death` and `covid_value_per_death`, the new `future_animal_harm` row, the `dalys_direct` formula and the reworded summary. Nothing else; no rows removed.
- verify.mts: lives_added off with never_started_weight 1 gives 2.669983, equal to origin/main at defaults. Headline now 2.406142 equals `scripts/headlines.ts` (2.40614) and the "after" column of never-started-branches.md (2.406, unchanged by that rule: the model has one branch).
- With the weight at 0, w_bio is 136907.4 = `bio_deaths_averted * dalys_from_uov / deaths_averted` exactly; the other w rows are 0. No future in any.
- Preflight passes.

## Prose
Summary and write-up read. Shares of the result recomputed: pandemics that end humanity's future 49% ("about half"), catastrophes the world survives 37% (matches), COVID-scale 14% (the rest). Long-run value set 36.8 ("about 37"). win_years_counted 1 to 20 gives 0.52 to 7.3 (matches). Next dollar 26% to 95% gives 1.04 to 3.8 ("1.0 to 3.8"). The pandemic cut-per-dollar ranges give 1.3 to 13 (matches). No stale figure.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
