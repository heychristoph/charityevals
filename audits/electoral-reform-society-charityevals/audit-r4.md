# Audit: electoral-reform-society-charityevals, round 4 (verification round)
Result: 4.912e-5 daly/$ = 0.0491 years of healthy life per 1,000 dollars, unchanged from round 3. Verdict: pass.
Model-sha: 40c02033a6c90148c023e37e962996e1708d918d3c14ea7ac0b6397cabfbb819
Scope: scoped verification of the two low findings of round 3 against `git diff 22eb2aa 415060f` (model, facts/united_kingdom.json, audit-r3.md). The only changed model line is the spend_2021_gbp note; no inputs or formulas changed.
Mechanical: audit-model.ts: 0.04912 per $1,000, 0 findings.
Previous round:
1. england_mayoral_coverage_2028 note: resolved. It now gives 51.5% plus about 15 points (66.5%), less the few councils that stay outside a mayoral authority: 65%, which reconciles with the 0.65 best value.
2. spend_2021_gbp note: resolved. It now says the higher figure would raise the decade's average spending by about 0.5% and lower the result by about as much, matching the round-3 recomputation.

No new findings.

## Sources checked
None re-fetched; text-only changes.

## Drivers
Unchanged: the chance and share of proportional representation, whether a voting method changes governance, the next-dollar room, and the supplementary-vote share.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against e247896f.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 8 rows changed, against cc9a04dd.
