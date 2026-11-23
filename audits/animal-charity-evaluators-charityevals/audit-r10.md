# Audit: animal-charity-evaluators-charityevals, round 10 (scoped verification)
Result: 1.517e-4 years of healthy life per $1,000 (uov/$ 3.033e-7; range 4.834e-5 to 4.863e-4, 0% of draws at or below zero). Verdict: pass.
Model-sha: 052dd43da393273d2f5345bf41352ff32ee32bb55961d7341211e07eb2eb3507
Rules: 0.4.0
Scope: scoped verification of round 9's findings for rule cause-portfolios only; no source or scope re-audit.
Preflight: passes (no blocking problem); lows only.
Previous round: round 9's medium (stale 'about 75%'): resolved.

## Checks
- grep of writeups/animal-charity-evaluators-charityevals.md finds no '75%'; line 21 now states the rule without a figure (an ordinary animal charity is to the animal portfolio as GiveDirectly is to the global-health one). No stale number remains. Resolved.
- Model unchanged (same sha as round 9).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No open or new high or medium. | - | - | - |

## Verdict
Pass: no open high or medium.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
