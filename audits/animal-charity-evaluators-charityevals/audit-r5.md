# Audit: animal-charity-evaluators-charityevals, round 5 (scoped verification)
Result: 2.182e-6 uov/$ = 0.001091 years of healthy life per 1,000 dollars (combined range 1.4e-5–0.083); cause median 4.19e-4 (×2.60). Verdict: pass.
Model-sha: daf0db328ae6cd91082bfbf73b9733abc9f11c979991f7b14ff4383a93e3cc91
Scope: only the change that the gain of grantmakers' money (all shifted) reads the new shared row `shifted_dollar_value = moved_dollar_value - prior_dollar_value` instead of the inline difference in `moved_value` (docs/normalization.md 2.8, src/engine/moved-money.ts, INV-12). Sources unchanged, not re-fetched.
Mechanical: audit-model 0 findings; normalization-audit run by the orchestrator (0 violations), not rerun.
Previous round: r4 had one low finding (shared slider range), accepted; nothing to resolve.

## Findings (0)
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

## Checks of the change
1. Row match. `shifted_dollar_value` in the model (section moved_money, label, format small, formula `moved_dollar_value - prior_dollar_value`, explainer) is word for word the shared row printed by `scripts/moved-money.ts own-split informed` (and `MOVED_MONEY_ROWS.shifted_dollar_value`).
2. `moved_value` changed only in replacing `(moved_dollar_value - prior_dollar_value)` by `shifted_dollar_value`; everything else (donors_moved, moved_wait_discount, moved_dollar_net_value, side effects) is unchanged. The row sits before `moved_value` in the moved_money section; no other row reads `prior_dollar_value` except `moved_dollar_net_value` and `shifted_dollar_value` (INV-12 now requires this).
3. Headline: `scripts/headlines.ts` prints 0.00109097, equal to the previous value; audit-model bottom line 0.001091.
4. audit-model: no findings, so no high finding.

Verdict: pass

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
