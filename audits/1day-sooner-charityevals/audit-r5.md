# Audit: 1day-sooner-charityevals, round 5 (verification of wording fixes)
Result: 5.46 daly/$ = 5.464 years of healthy life per 1,000 dollars (unchanged from round 4). Verdict: pass.
Model-sha: 2d8abdb9800394d4c9c604450fae95c32d26ee468557b02e6a4205a8331a55cf
Scope: wording changes since round 4 only.
Preflight: pass.
Previous round: round 4 lows: #1 summary "add about 23%" resolved (now "add about 25%"); #3 mal_counterfactual_adj explainer resolved (appended "That is how replaceable its part was; its pro rata share of the effort is in mal_attribution_share_shared"); #2 write-up typed sensitivities not resolved (low, builder's).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | writeups/1day-sooner-charityevals.md "Biggest uncertainties" | Typed sensitivities still at the 5.25 headline, about 4% low. | audit-model tornado at 5.464: discount 60.8 / 4.18; win years 1.58 / 15.6; next dollar 2.30 / 9.49; malaria children 4.75 / 9.03. | Replace the typed figures with these. | none |

Checks: headline 5.46441 equals round 4; hcv and mal shares (0.85, 5%), formulas and classes (research, win) unchanged; both wording fixes present and read correctly; no new factual claim.

## Sources checked
None needed.

Re-stamped (17 Nov 2026): credit rule 2.24: fb_credit_share is the skeleton's row (unused here, or wording only): no value change. Mechanical: headline unchanged, 1 row changed, against 2b24b73c.
