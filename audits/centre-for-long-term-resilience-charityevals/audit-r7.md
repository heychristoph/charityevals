# Audit: centre-for-long-term-resilience-charityevals, round 7 (scoped verification)
Result: 1.783 years of healthy life per $1,000 (was 1.945, -8.3%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: fefd115e9d8231159a9d5c3b326afd60b0d448436bf42067da2f82d976919900
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, never-started-prose and never-started-branches only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes (one low prose line about a typed 17% for rm_covid_scale_share).
Previous round: r6 passed (headline 1.796 under rules before never-started-branches); nothing outstanding.

## Checks
- Diff against origin/main: only `never_started` marks on the `*_future_dalys` rows (including `rm_future_dalys`), the reworded future explainer, `descendants: false` on the two death-value rows, the new `future_animal_harm` row, the `dalys_direct` formula, and the summary. Nothing else.
- verify.mts: lives_added off with never_started_weight 1 gives 1.944514, equal to origin/main defaults (1.944514). Headline now 1.78270 equals `scripts/headlines.ts` and the 1.783 "after" in never-started-branches.md (-0.76% from the previous 1.796 stamp; -8.3% from origin/main).
- `w_ai` 30899.5, `w_bio` 83069.6, `w_rm` 15483.5 equal the deaths-only terms (deaths x death value with the COVID-scale blend x dalys_per_death_value) exactly; no future in them at weight 0. (The brief's simple ratio differs here only because the bio and rm rows blend COVID-scale death values.)
- Shares of the result by branch after adjustments (w x evidence x counterfactual x attribution): bio 77.2%, ai 17.2%, rm 5.6%.
- sens.mts: pandemic cut x0.1/x10 (both facts) gives 0.48 and 14.9; Long-run value set 22.9 not typed in prose.

## Prose
Summary and write-up read. Future, never-started and discount-rate sentences are true. Summary shares (77%, 17%) and the write-up's later shares (77%, 17%, 6%) hold; "0.48 to 15" holds. Low note only: the write-up's opening paragraph says about 79% and 16%, which is within 2 points of the true 77% and 17% but inconsistent with the paragraph below it.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
