# Audit: 80000-hours-charityevals, round 10 (scoped verification)
Result: 0.2487 years of healthy life per $1,000 (uov/$ 4.975e-4; range 0.03627 to 1.617, 0% of draws at or below zero). Verdict: pass.
Model-sha: 15ab64e31324accf2c16549f1dccbd1b552302f82310071ee9d04ac0cdda67da
Rules: 0.4.0
Scope: scoped verification of round 9's findings for rule cause-portfolios only; no source or scope re-audit.
Preflight: passes (no blocking problem); lows only.
Previous round: round 9's medium (stale 'about half' for biosecurity and nuclear): resolved.

## Checks
- Write-up line 48 reads: about two fifths from global health careers, two fifths from AI, a fifth from biosecurity and nuclear. At the defaults (round 9's computation, model unchanged, same sha): 0.9 x 0.001419 : 0.06 x 0.01095 : 0.02 x 0.0615 = 40 : 21 : 39 percent. Matches. The old 'about half' sentence is gone. Resolved.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No open or new high or medium. | - | - | - |

## Verdict
Pass: no open high or medium.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.

Re-stamped 27 Nov 2026: source link points to the model's page (the old /<model-id> address was a 404); values unchanged.
