# Audit: transparency-international-charityevals, round 5 (verification of the compliance-cost rule 2.21, text fixes of round 4)
Result: 3.360e-5 daly/$ = 0.03360 years of healthy life per 1,000 dollars (unchanged from round 4). Verdict: pass.
Verdict: pass
Model-sha: 6c0e54d064160a9a60e250ac8bc64d210d899450f99b488b81b2ee4afd15292f

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
Model-sha: 6c0e54d064160a9a60e250ac8bc64d210d899450f99b488b81b2ee4afd15292f
