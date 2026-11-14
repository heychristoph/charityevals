# Audit: silverlining-charityevals, round 3 (scoped verification of commit a82f120)
Result: 0.991 tco2e/$ = 0.1218 years of healthy life per 1,000 dollars (combined range 0.00098–15.2 tco2e/$, about 0.00012–1.9 years per $1,000); cause median 0.001926 (×63). Verdict: pass.
Model-sha: 577ed04153a55b6bd9ef1a9a791734026bcaaecf71bb22d9dec3aed0615d53db
Scope: unchanged from round 2 (four branches, 2019-2024, 2024 spending from the audited Form 990). Only the changes of a82f120 were checked.
Mechanical: lint 0 high / 1 medium (outlier, INV-15 reason given in the summary) / 1 low (spread, stated in the summary); invariants none; check.ts all models valid; simulation-check stable (5% 0, 50% 0, 95% 20.3× the best guess; one single event, misses 68.2% of draws, matching the summary's "near zero at the default risk setting"). normalization-audit not re-run (no change touches what it checks: no row added, removed or re-typed, no shared figure changed). generated/ untouched; git status clean.
Previous round (round 2's findings):
- 1 resolved: `deaths_earlier_years` 21 (6-29), `timing_adj` explainer 2.3/1.2, summary and write-up figures. Arithmetic checked below.
- 2 resolved: `years_until_avoided` is 0 (0-2), explainer sends the start-time question to `deaths_earlier_years`.
- 3 resolved: `res_inhouse_share` explainer names the $889,390 of other programmes; the write-up's bullet says it sits with policy as the base for the own-science share.
- 4 not resolved (unchanged, as the caller stated): the Rethink Priorities PDF is image-only and no renderer is installed, so no quote can be added to `@climate.heat_mcc_*`. Low, stays open.

Arithmetic of the 21-year figure (computed here, flat stream discounted continuously at 4%, against the conversion's 1.04^-60 = 0.0951):
- Use of 50 years starting 18.5 years out: discount-weighted middle 39.5 years, stream worth 0.212 of deaths today (the explainer's figures); 60 − 39.5 = 20.5 years, correction 1.04^20.5 = 2.23 (the explainer's "2.23 at 4%"). 21 years gives 1.04^21 = 2.28, "2.3" in `timing_adj`: consistent.
- Start 18 rather than 18.5: 21.0 years, 2.28.
- Low end: a start 33.5 years out (about 2055) gives 5.5 years, the explainer says "about 6": consistent. A 100-year use from 18 years gives 6.7.
- High end: a start 10.5 years out (about 2032) gives 28.5, explainer "about 28", range 29: consistent.
- Other rates: exact against 1.04^21-style approximation: 1% 1.19 vs 1.23; 2% 1.44 vs 1.52; both within 5%.

Stated figures against the live model: headline 0.1218 (write-up 0.12, summary 0.12); result 0.991 tonnes per dollar (summary "about 1.0 tonne"; write-up and explainer "about $1 a tonne": 1/0.991); `tco2e_per_field_dollar` about 4 tonnes (0.3 × 240e9 × 0.1 / 1.76e9 = 4.1), ×2.28 = 9.3 tonnes, "9 after the correction" and "about 11 cents a tonne" (1/9.3): consistent. No stale 0.14, 24 years, 2.6-fold, 90 cents or 1.1 tonnes remains in the model or write-up (grep). The tornado's other drivers are unchanged in kind; the wait's 0-2 range is no longer in the top of the tornado.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | `deaths_earlier_years` explainer | "the exact ratio, 2.23 at 4%, is matched within 5% at every rate" is not true at the top of the shared discount rate's range. At 8% the exact ratio is 6.2 against 1.08^21 = 5.0 (19% low); at 1% and 2% it is 3% and 5% high. | Computed here with the same stream; the rate's range is 0.1%-8% (tornado). | Say "within 5% from 1% to 4%" (or drop "at every rate"). | none at the best guess; at 8% the rate tornado end moves slightly |

## Sources checked
No source changed in this round. The $889,390 of other programmes in the new explainer and write-up text is the Form 990 for 2024 Part III 4d figure verified in round 2; no new number was introduced. `@climate.heat_mcc_*` stays unreachable (round 2 finding 4).

## Drivers
Unchanged from round 2: the share of the benefit the field's work adds (`decision_value_share`), the shared discount rate (and the timing correction that rides on it), the chance of use, the heat-death delay, and the missing-data discount: all judgments. What would most improve the model remains a quote for the heat_mcc facts from the Rethink Priorities PDF.
