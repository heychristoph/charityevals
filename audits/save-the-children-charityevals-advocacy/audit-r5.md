# Audit: save-the-children-charityevals-advocacy, round 5 (verification)
Result: 8.331e-4 uov/$ = 0.42 years of healthy life per 1,000 dollars (combined range 0.056-3.12); global-health median 0.08657 (x4.8). Verdict: pass (no high or medium finding).
Scope: verification of round 4's fixes only: finding 1 (summary comparison to the median), findings 2 and 3 (the `oda_vs_cash` note in facts/aid_value.json) and finding 4 (section 2.20 of docs/normalization.md). The rest of the model's diff against HEAD is as round 4 approved it.
Mechanical: `check.ts` prints 0.42, 0 expected values reproduced (none set), `all models valid`; `audit-model.ts` prints "median of 71 global-health models: 0.08657 (this model x4.812)", under the INV-15 ten-times line, so no explanation is required (the summary gives one anyway); normalization-audit not rerun, as instructed.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | none | - | - | Round 4 #1 fixed: the summary now reads "about six times charityevals' estimate for MSF's advocacy and about five times the site's global-health median", matching x4.81 and 0.4165 / 0.0652 = 6.4. The write-up has no median wording. | summary text; audit-model.ts | none | none |
| 2 | none | - | - | Round 4 #2 fixed: the note now says the cash arm cost USAID $142 a household, $114 of it transferred, and "cash did better on assets and debt"; the 0.5x stays marked as judgment. | facts/aid_value.json oda_vs_cash.source.note | none | none |
| 3 | none | - | - | Round 4 #3 fixed: the health 3x is stated as between 2.1x and 4.6x; low case recomputed 1/6 x 1.5 + 0.05 x 0.25 + 0.2 x (1 - 1/6 - 1/4) = 0.25 + 0.0125 + 0.117 = 0.38, about 0.4; high 1/3 x 4.6 + 0.25 x 0.8 + 0.417 x 1 = 1.53 + 0.2 + 0.42 = 2.15, about 2; central 0.25 x 3 + 0.25 x 0.2 + 0.5 x 0.5 = 1.05. The 1.5x for government spending is cf_value_government 0.005057 / 0.00335 = 1.51. The fact's low 0.4, best 1, high 2 are unchanged. | recomputed | none | none |
| 4 | none | - | docs/normalization.md 2.20 | Round 4 #4 fixed: "nutrition commitments at the government-spending figure" is accurate for the N4G branch (cf_value_government x ranged multiple). | normalization.md line 1317 | none | none |

## Sources checked
No new sources; the CEGA quote and its $142/$114 reading were verified in round 4 and the note now matches them.

Verdict: pass
Model-sha: fcf7a3495c3bf26e5931ad292b5f909f288963d515a665d1e26acafdf709658e
