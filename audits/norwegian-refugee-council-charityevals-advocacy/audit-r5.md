# Audit: norwegian-refugee-council-charityevals-advocacy, round 5 (verification)
Result: 2.641e-5 uov/$ = 0.0132 years of healthy life per 1,000 dollars (combined range 0.00078–0.225); cause median 0.104 (×0.127). Verdict: pass.
Scope: only the fix to round 4's one low finding: the summary's "a seventh of the site's global-health median" changed to "an eighth". The rest of the model's diff vs HEAD is what round 4 approved.
Mechanical: audit-model lint 0 high / 0 medium / 1 low (spread, stated in the summary), invariants none; check.ts "all models valid"; result unchanged (2.641e-5 uov/$, 0.01321 years/$1k, combined range 0.00078–0.225); normalization-audit not run, as instructed.

Previous round: round 4 passed with one low finding (the "seventh" wording).

Checks:
- Summary now reads "an eighth of the site's global-health median". audit-model: "median of 71 global-health models: 0.1042 (this model ×0.1267)", so 1/7.9 of the median: an eighth is right.
- The other figures in the summary still match audit-model: 0.013 (0.01321), combined range 0.001-0.23 (0.00078–0.225), 97%/3% split, "about a fifth of cash" (humanitarian_vs_cash best 0.2).
- No writeup exists for this model, so no second place to update.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | Round 4 finding fixed: "a seventh" is now "an eighth". No new findings. | summary text in the model JSON; audit-model ×0.1267 | none needed | none |

Verdict: pass
Model-sha: 2560ca03f4f027d8a1e98d1bc6a2d51b2fb5a16dce8a2238f60104165adaf43e
