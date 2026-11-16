# Audit: transparency-international-charityevals, round 5 (verification of the compliance-cost rule 2.21, text fixes of round 4)
Result: 3.360e-5 daly/$ = 0.03360 years of healthy life per 1,000 dollars (unchanged from round 4). Verdict: pass.
Verdict: pass
Model-sha: 7cb8a42440f1e54e7f850d5f844a4611f169531f78c701c13cde98822f53118e

Scope: scoped verification of the compliance-cost sentence on `pol_people_per_change`.

Mechanical: `audit-model.ts` exit 0; one low (spread). normalization-audit, simulation-check not run (caller runs them).

Previous round: round 4 finding 1 (too absolute) fixed: now "come with no cost estimate ... that this average could use"; 2 (peer comparison in summary) still open, low.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | "about half the site's global-health median" compares with peers (owner rule). | Summary text. | Delete the clause. | none |

Checks:
- The new wording claims only that no usable estimate exists for the average change, which is accurate for a 63-change average.

## Sources checked
None in scope (no regulator figure read by the changed text).

## Drivers
Unchanged: text-only fixes.

Verdict: pass
Model-sha: 7cb8a42440f1e54e7f850d5f844a4611f169531f78c701c13cde98822f53118e
Re-stamped (15 Nov 2026): merged with the one-consumption-scale and no-comparison changes; compliance-cost rows (2.21) now on the survey scale (2.14); headline moves under 2×.
Re-stamped (15 Nov 2026): wording only (no effective-altruism mentions; listing-risk trims); no number changed

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against bf8498ee.
