# Audit: ambitious-impact-charityevals, round 8 (scoped verification)
Result: 0.01847 uov/$ = 9.236 years of healthy life per 1,000 dollars (combined range 0.7411-115.1); cause median not re-checked in this scoped round. Verdict: pass.
Model-sha: d801523f5dad778dbb87b943a4fdcaf1a1da9269a9cdb02495570f7a40d48ccb
Rules: 0.1.0
Scope: unchanged from round 7; only the stored mobiliser-share snapshot was refreshed.
Preflight: not re-run; the model file is unchanged (same Model-sha as round 7), whose preflight passed.
Previous round: r7 finding 1 (medium, stale mobiliser-share snapshot): resolved.

## Checked
1. Model-sha from `npx tsx scripts/audit-receipt.ts ambitious-impact-charityevals` equals round 7's (d801523f...8ccb): the model is unchanged, so r7's other checks stand.
2. `npx vitest run src/engine/mobiliser-share.test.ts`: 1 file, 11/11 tests pass.
3. `src/engine/mobiliser-share-snapshot.json` entry for `ambitious-impact-charityevals` is 47.77131524603452, matching the share-1 headline r7 reported (47.77). `scripts/audit-model.ts` still gives 9.236 at defaults, as in r7.

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | No open high or medium. | | | |

## Sources checked
None needed: no number or source changed.

## Drivers
Unchanged from r7 (missing-data discount, mobiliser share, `win_years_counted`, `@next_dollar.ambitious_impact`, discount rate).

Verdict: pass.
