# Audit: american-cancer-society-charityevals, round 5 (verification of the compliance-cost rule 2.21, text fixes of round 4)
Result: 6.005e-6 daly/$ = 0.006005 years of healthy life per 1,000 dollars (unchanged from round 4). Verdict: pass.
Verdict: pass
Model-sha: 429fdc907718ebae0d7b5f6758956ac1a5d616caf3870bb1b6a04a80dde84097

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
Model-sha: 429fdc907718ebae0d7b5f6758956ac1a5d616caf3870bb1b6a04a80dde84097
Re-stamped (15 Nov 2026): merged with the one-consumption-scale and no-comparison changes; compliance-cost rows (2.21) now on the survey scale (2.14); headline moves under 2×.

Re-stamped (16 Nov 2026): Preflight cleanup: judgments' explainers name their reference class (or say plainly there is none); labels and unit labels say what the rows are; no value changed. Mechanical: headline unchanged, against 1807d315.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 480880ba.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.
