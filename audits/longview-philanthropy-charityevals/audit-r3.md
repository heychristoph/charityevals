# Audit: longview-philanthropy-charityevals, round 3 (scoped verification)
Result: 0.002471 uov/$ = 1.235 years of healthy life per 1,000 dollars (round 2: 1.235, unchanged; combined range 0.069-22.0; the model's own ranges alone 0.97-1.59). Verdict: pass.
Model-sha: 7fb4087689f1f1e073764c6fac1e5a01bf558adbd7c12a4c13bc7aef1ecd34a8
Verdict: pass
Scope: the four low findings of round 2 and the changes made for them (model summary, facts/meta.json longview_2025_*, facts/next_dollar.json longview_philanthropy, write-up). No source or scope re-audit.
Mechanical: audit-model lint 0 findings, no invariant; check.ts "all models valid".

## Round 2 findings
| # | Status | Check |
|---|---|---|
| 1 | fixed | Summary says "about 1.2 years" (result 1.235); write-up headline span reads 1.2. |
| 2 | fixed | `longview_2025_share_nuclear` high 0.19 and `_bio` high 0.07; explainers read "6% to 19%" and "1.5% to 7%"; the AI explainer says "4.5% to digital sentience and other work". Write-up's driver bullet reads "6% to 19%". The tornado shows 0.06-0.19. |
| 3 | fixed | next_dollar.json `longview_philanthropy` note reads "first ten months". |
| 4 | fixed | "How this model was checked" is filled in: two rounds, round 1's fixes (blend with nuclear 15% to 12% and biosecurity 10% to 3%, advised money at the shared share with Effektiv Spenden moved to the same rule, digital sentience and Rethink out of the AI share, side effects narrowed, UK income evidence, formats and wording) and round 2 passing with its wording points fixed. Matches audits r1 and r2. |

## New findings
None.

Verdict: pass.
