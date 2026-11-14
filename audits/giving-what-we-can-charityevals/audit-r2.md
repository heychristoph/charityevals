# Audit: giving-what-we-can-charityevals, round 2
Result: 0.07490 uov/$ = 37.3 years of healthy life per 1,000 dollars (combined range 6.8–206.0; check.ts range 0.50–2201 with all ranges); cause median 0.06933 (×539). Verdict: pass.
Model-sha: 893a8ebeadfb1ea3aa23224f2cf8b38ad4f05f1e54443b5537b83daf82b97083
Scope: unchanged from round 1 (all 2023 and 2024 spending, one effective-giving programme). Verification round: only the changes since round 1 (commit 069d12a and the merge of main) were checked.
Mechanical: lint none reported (check.ts "all models valid"), invariants none, normalization-audit none for this model (generated/ restored).
Previous round: 1 next-dollar high resolved (0.75 → 0.85, anchored on the charity's own 5x target against a 6x average = 0.83, stated in the note; best 0.42 and the 0.6 use factor kept with the same stated reasons); 2 per-stream effective share resolved (see below); 3 ranges resolved (expenses_2023 and expenses_2024 now ±$200K, the report's stated margin; counted donations stay points); 4 no fix needed, confirmed; 5 resolved (reserves quote confirmed).

Verification of the changes:
- gwwc_effective_share_2023_24: (26.80 × 0.774 + 7.03 × 0.997) / 33.83 = 27.75 / 33.83 = 0.820 best; conservative (26.80 × 0.502 + 7.03 × 0.733) / 33.83 = 18.61 / 33.83 = 0.550 low. Both match the fact (0.82, 0.55). The money-moved weights (pledges and trials $26.8M, other $7.03M) are the model's own defaults, a little below round 1's rounded $27.9M, which changes the weighted share by under 0.001. The explainer in the model and the write-up say 82% (55–90%) and 18% remaining; both match.
- Career defaults: the three rows now read @meta.career_forgone_pay_default, career_years_stayed_default and career_counterfactual_share_default (shared facts, kind judgment, sourced to the policy-research-meta template). careers_changed is 0, so they multiply nothing; the result is unaffected.
- Next-dollar fact: the quote for reserves is now in the note. Result sensitivity of the next dollar, 17.8–75.4 at its 20–85% range.
- Result moved 37.68 → 37.3 (−1%), as predicted by findings 1 and 2 (the high end is only in the range, the share change is the −1%).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | wording | @meta.gwwc_effective_share_2023_24 note | The note says it is weighted by money moved "at the defaults", so the 0.82 is a fixed number typed from the model's own outputs and will drift if the pledge or other-donor rows change; it is not computed live. | fact note; moved weights 26.80 and 7.03 | Accept (the fact is a classification share, and the drift is under 0.001 for any plausible change) | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| next dollar note, reserves | https://opencharities.uk/ew/1207964/files/2024-12-31-accounts.md | verified | line 363: "significant reserves at a global level (more than $1.5M) ensured viability and stability"; the quote in the note matches word for word |
| next dollar high 0.85 | eval (round 1 quote) | verified | "at least 5x" marginal against the 6x best guess; 5/6 = 0.83, rounded up to 0.85 |
| effective share coefficients | class.xlsx (round 1) | verified | 0.774 / 0.997 best, 0.502 / 0.733 conservative; arithmetic redone above |
| expenses ±$200K | eval (round 1) | verified | "could vary by up to $200K per year" |

Checks that passed: lint and invariants clean; no unit constants introduced; shared career defaults used instead of retyped rows; write-up figures (82%, 18%, 20–85%) match the live model and fact; simulation and peers as in round 1 (the 539× gap has its stated reason in the summary).

Verdict: pass (no high or medium findings).
