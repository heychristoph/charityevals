# Audit: 1day-sooner-charityevals, round 7 (scoped verification)
Result: 1.519 years of healthy life per $1,000 (was 1.639, -7.3%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: c3aa778114db52a26cfa35437c6500eb64fcc225022f229a43af321d661cc3e9
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, never-started-prose and never-started-branches only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes
Previous round: round 6 was "fix needed" (rules 0.3.12, summary and typed figures); the model was changed since by never-started-prose, never-started-branches and the figure recompute, and each is re-checked below.

## Checks
- Diff vs origin/main: only never_started marks on the five *_future_dalys rows, reworded explainers on future rows, descendants:false on value_per_death and covid_value_per_death, the new future_animal_harm row, the dalys_direct formula, and changed sentences/figures in summary. Nothing else.
- verify.mts: lives_added off + never_started_weight 1 = 1.639322 = origin/main defaults. Headline 1.518932 = scripts/headlines.ts (1.51893) = never-started-branches.md "after" (1.519, -4.8% from 1.595).
- Weights at weight 0: w_bio 58641 (main 65070, minus bio_future 6423 and a 0.01% population term), w_pol 18254 (main 20255 minus 1999); w_hcv and w_mal hold no future. No future in any w_<branch>.
- Preflight: passes.

## Prose
Summary and write-up read. Shares recomputed from w_ times the adjustments: pandemic 65%, malaria 18%, hepatitis C 10%, California 7%; the summary's "about 28%" (hepatitis C plus malaria = 27.7%) and "about a sixth" hold. Biggest uncertainties recomputed: Long-run value set 18.9 (about 19), 8% discount 1.2, 1 year 0.45, 20 years 4.3, extinction cut 1.0 to 6.4, next dollar 0.64 to 2.6, malaria children 1.3 to 2.6. All match.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
