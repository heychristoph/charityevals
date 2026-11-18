# Audit: ambitious-impact-charityevals, round 14 (scoped verification)
Result: 3.994 years of healthy life per 1,000 dollars at defaults (`npx tsx scripts/headlines.ts ambitious-impact-charityevals`); combined range and cause median not re-checked in this scoped round. Verdict: pass.
Model-sha: bcd2c2504845ccbbe74742af23df2c0c151c84c1d328071876c93ac43121d230
Rules: 0.2.1
Scope: round 13's finding only
Preflight: pass (`npx tsx scripts/preflight.ts ambitious-impact-charityevals`: "passes")
Previous round: r13's one medium (finding 1, discount-rate bullet "about three times higher") is resolved. The model file is unchanged since r13 (same Model-sha); only the write-up changed.

## Checked
1. **The new figure is right.** With the engine's `headline` on the library at default values and `discount_rate` set to the floor of its range (0.001): 7.2895, against 3.9942 at the default 0.04, a ratio of 1.82. "About twice as high" is a fair rounding (the r13 fix text said the same). For reference, at the top of the range (0.08) the headline is 3.009.
2. **Nothing else in the discount-rate bullet or the write-up is stale.** The diff (`git diff -- writeups/ambitious-impact-charityevals.md`) is that one phrase. `grep` for "three times", "3 times" and "0.1%" finds only the corrected bullet and the unrelated "from 0 to 3 times" (the GiveDirectly multiple, whose range is unchanged). The other typed figures (60 charities, $107 million, $1.8 million, 2.5 times, 60%, eight to one, 15% to 75%) are inputs unchanged by round 13's scope, as r13 already checked.
2a. The write-up carries no typed headline number, so the 3.994 at defaults needs no update there.

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | No high or medium finding remains in scope. | Computed 7.29 vs 3.994 (1.8 times); phrase now matches. | none | none |

## Sources checked
None needed: no number or source changed; headline values computed live from the engine.

## Drivers
Unchanged from round 13.

Verdict: pass (no high or medium remains).
