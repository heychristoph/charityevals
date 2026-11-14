# Audit: effektiv-spenden-charityevals, round 6 (scoped verification)
Result: 0.04769 uov/$ = 23.84 years of healthy life per 1,000 dollars (round 5: 23.81; the small change comes from other shared facts merged from main, not from this model's rows). Verdict: pass.
Model-sha: 53c7dce3fdf641b0d8c047d6977e275219685dbe1220860f84776b42edbb98a5
Verdict: pass
Scope: the two findings of round 5 and the changes made for them (summary, write-up). No source, scope, cost or reach re-audit.
Mechanical: audit-model 0 findings; check.ts "all models valid".

## Round 5 findings
| # | Status | Check |
|---|---|---|
| 1 (medium) | fixed | Summary now ends "only the advised gifts are discounted for missing data, since what its advice changed is judged; platform money is counted." The write-up's last sentence of "How the model works" says platform money takes no missing-data discount and the advised gifts do. No "no branch" text remains in the model or write-up. Matches the `missing_data_adj` row. |
| 2 (low) | fixed | "How this model was checked" says "Five audit rounds" and adds a Round 5 sentence on the advised gifts' move to the site's rule for advice. Accurate against audit-r5. |

## New findings
None.

Verdict: pass.
