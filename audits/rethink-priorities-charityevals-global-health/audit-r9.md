# Audit: rethink-priorities-charityevals-global-health, round 9 (scoped verification)
Result: 1.114 years of healthy life per $1,000 (uov/$ 0.002228; range 0.07787 to 12.91, 1% of draws at or below zero, as audit-model prints them). Verdict: pass.
Model-sha: 9ec6cd264e5e630070880fabaaca1631726afa995c2a75b4e26716b8fb5a0593
Rules: 0.4.0
Scope: scoped verification of round 8's findings for rule cause-portfolios only; no source or scope re-audit.
Preflight: passes (no blocking problem); lows only.
Previous round: round 8's medium (value_destinations explainer contradicts the write-up): resolved.

## Checks
- value_destinations explainer now reads 'valued at the global-health portfolio, GiveWell's Top Charities weighted by its funds (#cause:global-health)'; the clause 'not at GiveWell's Top Charities' is gone (git diff of the model). Resolved.
- writeups/rethink-priorities-charityevals.md line 34 says the programme money it informs (family planning, education, credit) is valued at the global-health portfolio, GiveWell's Top Charities: consistent with the row. No comparison with peers.
- The moved_dollar_value-related explainer also reads 'global-health portfolio' now. Result unchanged by the wording (1.114).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No open or new high or medium. | - | - | - |

## Verdict
Pass: no open high or medium.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.

Re-stamped 27 Nov 2026: source link points to the model's page (the old /<model-id> address was a 404); values unchanged.
