# Audit: central-square-foundation-charityevals, round 4 (scoped to the round 3 low)
Result: 0.001704 uov/$ = 0.852 years of healthy life per 1,000 dollars; cause median 0.0803 (x10.6). Verdict: pass (no high findings; 0 medium beyond the far-above judged right in rounds 2 and 3; 0 low).
Model-sha: 0870334f5c0e3c585901c5a008ad984598786f1aaee15d51d50d8bd5e39c7818
Scope: only the round 3 low (labels of `gov_value_per_student_year` and `gov_gain_sd`) and that no value changed.
Mechanical: audit-model gives 0 high / 1 medium (far-above, same chain as rounds 2 and 3, still judged right) / 0 low. Headline 0.852, identical to round 3. generated/ was not rewritten (git status clean apart from the untracked scratch-rows.ts).
Previous round:
1. Round 3 low, "per student-year" labels: **resolved**. `gov_value_per_student_year` now reads "School governance: value of the gain per child (units of value)", explainer "The lasting gain valued as later earnings." `gov_gain_sd` now reads "Learning gain per child from school report cards for parents, a lasting one-time rise (standard deviations)", and its explainer says the rise in the level of learning lasted, so it is credited once per child. Formulas and values are unchanged (gain 0.04 SD (0 to 0.11); formula `ln(1 + gov_gain_sd * learning_persistence * earnings_gain_per_sd) * lnc_value_per_unit_gain * (1 + $discount_rate) ^ -gov_years_to_work`), and `gov_years_per_student` explainer agrees. The row id `gov_value_per_student_year` still contains "student_year"; ids are internal, not shown, so left.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No new findings. | Model JSON; audit-model output (0.852). | - | none |

## Sources checked
None needed (label-only change; no figures touched).

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 39682758.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against cc9a04dd.
