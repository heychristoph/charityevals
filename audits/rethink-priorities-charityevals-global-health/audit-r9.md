# Audit: rethink-priorities-charityevals-global-health, round 9 (scoped verification)
Result: 1.114 years of healthy life per $1,000 (uov/$ 0.002228; range 0.07787 to 12.91, 1% of draws at or below zero, as audit-model prints them). Verdict: pass.
Model-sha: bd7aabf9b5434fa406bc1f7d7b18e3b5ac019f1a3d79b7d6744751e2a576bac8
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
