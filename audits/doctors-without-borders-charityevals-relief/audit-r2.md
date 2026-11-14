# Audit: doctors-without-borders-charityevals-relief, round 2 (verification)
Result: 7.008e-4 daly/$ = 0.7008 years of healthy life per 1,000 dollars (combined range 0.1539-3.191). Verdict: fix needed.
Scope: only the change since round 1: share_5_14_of_over5 now reads @death_ages.crisis_share_5_14_of_over5.
Mechanical: check.ts "all models valid"; audit-model 1 HIGH (INV-15, below) and 1 low spread finding; generated/ untouched.

Checks passed:
- The row's formula is the bare fact read; the fact is a judgment 0.2 (0.1-0.4), the same value and range as before. value_per_death still uses it correctly. Headline unchanged at 0.7008 (round 1: 0.7008).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | high | plausibility (INV-15) | summary | audit-model reports 0.701 years per $1,000 is 10.1x the median of 83 global-health models (0.0693) and the summary does not say why. Round 1 recorded x7.8 against a cause median of 0.0898; the peer median has since moved, so the multiple crossed the ten-times line without any change to this model. The summary says "the result is mostly uncertainty" but names no multiple or driver. | scripts/audit-model.ts INV-15; model summary. | Add the reason to the summary, as the invariant asks ("more than ten times its peers because ..."): the search-and-rescue branch (deaths at sea averted, from the route death rate, at a small ship cost) drives the figure; the tornado shows which input. | none (text) |
| 2 | low | uncertainty | summary | Model's own ranges span 1026x; the summary should keep its sentence on uncertainty (it says "the result is mostly uncertainty"). | audit-model spread finding. | Optional: state the span. | none |

Verdict: fix needed (INV-15: the headline is above ten times the peer median and the summary gives no reason; the share_5_14_of_over5 change itself is correct)
Model-sha: 5e91ddd5fb66fb98bda92138dd6862c458605604fc9930b992cb0a706b2e07f7
