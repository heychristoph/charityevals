# Audit: ambitious-impact-charityevals, round 17 (scoped verification)
Result: 8.213 years of healthy life per 1,000 dollars at defaults, unchanged from round 16 (model unchanged); combined range and cause median not re-checked in this scoped round. Verdict: pass.
Model-sha: 23d8a62adaec2382067cdcfe65e488607ccd1df122d1b4e327aabec14a39a3b8
Rules: 0.3.0
Scope: round 16's finding only
Preflight: pass. `npx tsx scripts/preflight.ts ambitious-impact-charityevals` prints "passes (no blocking problem)"; its one line is the low, stale generated/distributions.json, not about this change (left as is).
Previous round: r16's one high finding (finding 1, INV-12 rejecting `wavg`) is resolved (check 1).

## Checked
1. **Checker accepts the row.** The uncommitted diff of src/engine/moved-money.ts changes only `isDestinationMix`: the stripped names become `value_global_health|value_livelihoods|avg|wavg`, and the doc comment now lists `wavg()` and `#spending:charity` weights. `#spending:<c>` is already removed by the existing `#[a-z0-9:-]+` strip, so no other change was needed. Preflight no longer lists INV-12.
2. **A typed value per dollar is still rejected.** After the strips, the remainder must match `^[\s()+\-*/,]*$`: only whitespace, parentheses, `+ - * / ,`. Any digit other than a standalone `1`, a decimal point, an exponent letter or a bare word survives the strips and fails. `wavg` is a name only; it adds no characters to the allowed class. Run against the function: `wavg(#a:x,#spending:x,#b:y,#spending:y)` true; `wavg(...)+0.02`, `#a:x*0.0003`, `wavg(...)*5e-6`, `wavg(#a:x,12000)` and `#a:x+typed` all false. The first guard (`#[a-z]` must occur) is unchanged.
3. **Model unchanged since r16.** `npx tsx scripts/audit-receipt.ts ambitious-impact-charityevals` prints the same Model-sha as round 16 (23d8a62a...39a3b8), so the formula, weights and headline (8.213) are those audited in round 16, whose weighting checks stand.

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | No high or medium finding remains. | Checks 1-3. | | None |

## Sources checked
None needed: no number or source changed.

## Drivers
Unchanged from round 16.

Verdict: pass (no high or medium remains).
