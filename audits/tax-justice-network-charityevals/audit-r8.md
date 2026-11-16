# Audit: tax-justice-network-charityevals, round 8 (verification of the compliance-cost rule 2.21, text fixes of round 7)
Result: 0.002507 uov/$ = 1.253 years of healthy life per 1,000 dollars (unchanged from round 7). Verdict: pass.
Verdict: pass
Model-sha: ee04d950789719569ff8e20da23aa9194e992c94370569aa6fdcf9a8d641153a

Scope: scoped verification of the label of `a_unmodelled_benefits_adj`. No formula changed.

Mechanical: `audit-model.ts` exit 0; one low (spread). normalization-audit, simulation-check not run (caller runs them).

Previous round: round 7 finding 1 (label) fixed; its write-up half and finding 2 (peer comparison in summary) still open, low.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | writeups/tax-justice-network-charityevals.md line 23 | The bullet still lists banks' reporting costs under "side effects" (round 7 finding 1, second half). | "side effects: ... banks' reporting costs take away 2%." | Take the 2% clause out of the side-effects bullet and give it its own line as the compliance cost. | none |
| 2 | low | presentation | summary | Compares with peers (round 7 finding 2). | Summary text. | Drop the clause. | none |

Checks:
- Label now "Transparency standards: side effects and compliance costs, as a share of the branch"; formula a_ue_deterrence + a_ue_other_reforms + a_ue_compliance matches it.

## Sources checked
None in scope (no regulator figure read by the changed text).

## Drivers
Unchanged: text-only fixes.

Verdict: pass
Model-sha: ee04d950789719569ff8e20da23aa9194e992c94370569aa6fdcf9a8d641153a
Re-stamped (15 Nov 2026): merged with the one-consumption-scale and no-comparison changes; compliance-cost rows (2.21) now on the survey scale (2.14); headline moves under 2×.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 1807d315.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against c42a537d.
