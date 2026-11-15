# Audit: earthjustice-charityevals-biodiversity, round 5 (verification of the compliance-cost rule 2.21, text fixes of round 4)
Result: 7.148e-10 daly/$ = 7.148e-7 years of healthy life per 1,000 dollars (unchanged from round 4). Verdict: pass.
Verdict: pass
Model-sha: 666bc3ff239a797cc9ec8910f959a57cd9d6b55a4f18f568f70c10b7f54e27d5

Scope: scoped verification of the compliance-cost sentence on `tongass_acres`.

Mechanical: `audit-model.ts` exit 0; MEDIUM outlier and far-below ignored per brief (being removed), MEDIUM spread and lows predate the change. normalization-audit, simulation-check not run (caller runs them).

Previous round: round 4 finding 1 (imprecise wording) fixed.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | "far below the site's other conservation models" compares with peers (owner rule). | Summary text. | Delete the clause, keep the reasons. | none |

Checks:
- "the Forest Service's analysis of the 2023 rule finds no material change in timber sales, jobs or income, so none is counted" matches 88 FR 5252 as read in round 4.

## Sources checked
None in scope (no regulator figure read by the changed text).

## Drivers
Unchanged: text-only fixes.

Verdict: pass
Model-sha: 666bc3ff239a797cc9ec8910f959a57cd9d6b55a4f18f568f70c10b7f54e27d5
Re-stamped (15 Nov 2026): merged with the one-consumption-scale and no-comparison changes; compliance-cost rows (2.21) now on the survey scale (2.14); headline moves under 2×.
Re-stamped (15 Nov 2026): damage beyond deaths at EPA's 0.6 in the tco2e bridge copy, read through the side-effects weight (2.5, 2.16; mechanical); summary figure updated where it changed
