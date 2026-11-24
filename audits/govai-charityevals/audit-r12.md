# Audit: govai-charityevals, round 12 (scoped verification)
Result: 2.662 years of healthy life per $1,000 (was 2.710, -1.7%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: b68e854347b6a7e36c2b0dcb1417e7d2e6c45bb98048860ccdfc6b0040705c04
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, never-started-prose and never-started-branches only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 11 passed (0.3.12); no open findings.

## Checks
- Diff against origin/main: only `never_started` marks on the five `*_future_dalys` rows, reworded explainer on the future row, `descendants: false` on `value_per_death` and `covid_value_per_death`, the new `future_animal_harm` row, the `dalys_direct` formula and the reworded summary. Nothing else; no rows removed.
- verify.mts: lives_added off with never_started_weight 1 gives 2.709613, equal to origin/main at defaults. Headline now 2.662175 equals `scripts/headlines.ts` (2.66218) and the "after" column of never-started-branches.md (2.662).
- With the weight at 0, w_ai, w_fb and w_pol (176483, 422252, 1917176) equal `<branch>_deaths_averted * dalys_from_uov / deaths_averted` exactly: no future in them.
- Preflight passes.

## Prose
Summary and write-up read. Shares by branch recomputed (weight times adjustments): training 79.0%, research 13.9%, Code 7.1%; they match the typed 79%, 14%, 7%. Next dollar 42% holds; GovAI's share of the Code about 3% (0.034) holds. Discount rate 8% gives 2.33 (little move) and the Long-run value set 9.26; win_years_counted 1 gives 0.57, 20 gives 8.1 (several-fold). The future-counts-only-where-lives-never-start sentences are true. No stale figure.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
