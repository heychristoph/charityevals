# Audit: govai-charityevals, round 6 (verification round)
Result: 0.001576 daly/$ = 1.58 years of healthy life per 1,000 dollars (combined range 0.042-60; model's own ranges 0.12-15.8), result 1.583 -> 1.576. Verdict: fail (one medium finding).
Model-sha: 518cb29c615c49e596b97c6ac14649b14dae30105de5f52bc9d4fbd26e55a03d
Scope: only the change in commit 3d29300: fb_credit_share is now the formula cost_total * fb_cost_share / (cost_total * fb_cost_share + fb_work_dollars) in place of a typed 0.125 (0.05-0.3), and the write-up's "12.5%" wording.
Mechanical: audit-model lint 0/0/0, findings (0); scripts/check.ts: all models valid. Not re-run this round (scoped): normalization-audit, simulation-check.

The formula is right: $3.45M / ($3.45M + about $24.4M) = 12.4% (audit-model shows 0.1237), and the write-up now says "about 12% at the defaults". The result moved 1.583 -> 1.576 (-0.4%). The headline 1.6 holds. Branch shares and the next dollar (42%) are unchanged.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | model `summary`, write-up Summary | Both say the result runs "from about 0.05 to about 33" on the model's own ranges. With the credit share no longer a typed range the model's own ranges give 0.12 to 15.8. | audit-model "Joint low-high of the model's own ranges": 0.1214 - 15.82 | Write "from about 0.1 to about 16" in both. | none |

**Verdict: fail** (medium: the stated own-range 0.05-33 is stale after the credit share lost its typed range)
