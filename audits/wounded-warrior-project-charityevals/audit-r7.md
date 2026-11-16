# Audit: wounded-warrior-project-charityevals, round 7 (verification)
Result: 6.4620e-6 daly/$ = 0.006462 years of healthy life per 1,000 dollars. Verdict: pass.
Model-sha: 53d011f2a32d37088cb161dda90e9a055f0a1c091d91c08dd0d43392055e898a
Scope: only the change of commit 480880ba: `phys_event_years` 0.25 (0.05-0.5) -> 0.125 (0.05-0.25) with a new explainer.
Mechanical: preflight no high or medium lines (two lows: a simulation note on the shared payer multiple, stale generated distributions); lint 0 high/0 medium; headline 0.0064628 -> 0.00646196.

Changes checked:
- Source (PubMed 37492451, fetched): Walter et al. 2023, Front Psychol 14:1207633, National Veterans Summer Sports Clinic, 74 veterans, follow-up at 3 months: "significant benefits were shown during the program but rebounded by the 3-month follow-up". The explainer says this.
- Value: a lift gone by three months, fading through them, counts about half of 0.25 years, 0.125; range 0.05-0.25 caps at the three-month follow-up. Follows from the source. Unit (years) and use unchanged: `pv_annuity_due(1, $discount_rate, phys_event_years)` in the event-lift row; still a ranged judgment naming its reference class.
- Explainer has no comparison with other charities, medians or peers and no mention of effective altruism.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| phys_event_years | https://pubmed.ncbi.nlm.nih.gov/37492451/ | verified | Benefits rebounded by the 3-month follow-up. |

## Drivers
Unchanged from round 6.

Verdict: pass
