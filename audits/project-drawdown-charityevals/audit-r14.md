# Audit: project-drawdown-charityevals, round 14 (scoped verification)
Result: -2.388e-4 years of healthy life per $1,000 (tco2e/$ -4.025e-4; range as audit-model prints it -0.002078 to 0.008125, 48% of draws at or below zero). Verdict: pass.
Model-sha: a8c8926305fb34021ba749bf60241ad618922b57e0f822a76de5181b764162e0
Rules: 0.4.0
Scope: scoped verification of round 13's findings for rule cause-portfolios only; no source or scope re-audit.
Preflight: passes (no blocking problem); lows only.
Previous round: round 13's high (blocking simulation line): resolved; its medium (stale/false write-up on what drives the result): resolved.

## Checks
- Preflight: no blocking line; the five simulation lines are now lows, and normalization-waivers.json `simulation` carries a reason for project-drawdown-charityevals (net near zero, sign follows the portfolio's). Resolved.
- Write-up 'What drives the result' now says the result is a small net harm and why (portfolio worth less than an ordinary charity); 'companies about half, funders a third' and 'forest protection is among them' are gone (grep finds neither). Matches the trace (funders' branch -28,700 tCO2e against companies +8,752). Resolved.
- Not done, both low and not re-opening: the summary still says 'a dollar given comes to the equivalent of about {{row:tco2e_per_donor_dollar}} tonnes' without saying it is negative, and 'the ranked climate charities' figures' remains in the summary and write-up lines 3 and 40. Builder's to fix.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No open or new high or medium. | - | - | - |

## Verdict
Pass: no open high or medium.

Re-stamped (23 Nov 2026): Wording only: the summary says the climate portfolio (the charities the Giving Green Fund paid), not the ranked climate charities (round 14's low); no value changed. Mechanical: headline unchanged, against HEAD.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.

Re-stamped 27 Nov 2026: source link points to the model's page (the old /<model-id> address was a 404); values unchanged.
