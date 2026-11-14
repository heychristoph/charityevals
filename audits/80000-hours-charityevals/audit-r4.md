# Audit: 80000-hours-charityevals, round 4 (scoped verification)
Result: 0.002136 uov/$ = 1.068 years of healthy life per 1,000 dollars, unchanged from round 3. Verdict: **pass** (no high findings).
Model-sha: 3c5944816e76efa2b9dc29d25bc0ebd64d0eeb790b36e33072980961592e4ae5
Scope: only the two changes since round 3: staff_cost_share is now kind "judgment" with the $100,000 per staff-year marked as our assumption, and the write-up driver bullet says biosecurity and nuclear careers carry about half of the result.
Mechanical: `audit-model.ts` 0 findings; headline 1.06781 years per $1,000 (round 3: 1.068).

Previous round:
1. Round 3 low 1 (staff_cost_share unsourced $100,000 inside an "estimate" row): resolved. kind is "judgment"; explainer says "our judgment (the $100,000 is our assumption, not a published figure)"; value 0.5 (0.4-0.65), source and FTE arithmetic unchanged.
2. Round 3 low 2 (write-up silent on bio/nuclear share): resolved; claim checked below.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| (none) | | | | | | | |

## Write-up claim check
"biosecurity and nuclear careers alone carry about half of it" (writeups line 48). Parts of value_destinations in years per $1,000 (headlines.ts): AI average of CAIS 1.590, FAR.AI 0.958, MIRI 0.073, METR 0.057, Redwood 0.068 = 0.549, times 0.90 = 0.494. Bio/nuclear: average of NTI 23.39 and Johns Hopkins CHS 7.554 = 15.47, times 0.06 = 0.928. Global health 0.02 times about 20 (AMF 24.2, New Incentives 3.98, the other two not separately shown, weighted 50/29/18/4) is about 0.4; animals 0.005 times 0.008 is negligible. Total about 1.85 after dividing by the share sum 0.985, so bio/nuclear is about 0.93/1.85 = 50%. The claim holds. (Global health figure is approximate; a ±5 change in it moves the share by about 3 points.)

## Sources checked
No source re-fetched; no source or number changed since round 3.
