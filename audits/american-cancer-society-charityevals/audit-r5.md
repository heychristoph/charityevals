# Audit: american-cancer-society-charityevals, round 5 (verification of the compliance-cost rule 2.21, text fixes of round 4)
Result: 6.005e-6 daly/$ = 0.006005 years of healthy life per 1,000 dollars (unchanged from round 4). Verdict: pass.
Verdict: pass
Model-sha: 9e60d1f8281b7e2426b62957b16ee1fe6ad82c4751f70cd794ddf23930d9dae0

Scope: scoped verification of the line on `adv_share_burden_averted`. No formula changed.

Mechanical: `audit-model.ts` exit 0; three lows (two unused reference inputs, far-below with reason in the summary). normalization-audit, simulation-check not run (caller runs them).

Previous round: round 4 finding 1 (no line on the coverage-advocacy branch) fixed; 2 (absolute wording) low open; 3 (peer comparison in summary) low open.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | "far below the site's global-health median" compares with peers (owner rule); repeated from round 4 finding 3. | Summary text. | Delete the comparison, keep the reasons. | none |

Checks:
- The added line says the extra screening the coverage laws pay for is a health-care cost no impact analysis gives for these wins, so none is counted: reads as accurate and meets the rule's "say so" for a branch with no analysis. Not on a formula.

## Sources checked
None in scope (no regulator figure read by the changed text).

## Drivers
Unchanged: text-only fixes.

Verdict: pass
Model-sha: 9e60d1f8281b7e2426b62957b16ee1fe6ad82c4751f70cd794ddf23930d9dae0
