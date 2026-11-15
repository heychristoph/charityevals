# Audit: earthjustice-charityevals-biodiversity, round 4 (verification of the compliance-cost rule 2.21)
Result: 7.148e-10 daly/$ = 7.148e-7 years of healthy life per $1,000 (combined range 1.008e-9–5.066e-4); cause median 0.001995 (×3.6e-4). Verdict: pass.
Model-sha: 95c98b19248e8d5c50bfcfac81feff01d3dd55ff52d32effa98145b8b68b69c8
Scope: scoped verification of the changed row (one sentence appended to `tongass_acres`' explainer); headline unchanged.
Mechanical: `audit-model.ts` exit 0; medium outlier and far-below peer findings ignored (being removed), medium spread and low range findings predate this change and are not on the changed row; invariants none.
Previous round: not applicable (verification of one changed row).

Verdict: pass

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | tongass_acres | "the 2023 rule reports no figure for the timber not cut" is imprecise: the Forest Service did prepare a Regulatory Impact Analysis (OMB-designated significant), and the Federal Register notice (88 FR 5252) says the restored protection "does not change the timber sale quantity" and would "not materially decrease timber related jobs, income, or output"; the only dollar figure it gives is $68,000–224,000 a year of recreation losses avoided. | 2023 final rule, Regulatory Planning and Review section (local copy). | Reword: "the Forest Service's regulatory analysis finds no material change in timber sales, jobs or income, so no cost is counted". | none (cost is about zero by the agency's own finding) |

The conclusion is right and now better supported than the sentence says: the agency's analysis finds a negligible timber cost, so a zero compliance cost agrees with the regulator's estimate. The model already lets timber be cut elsewhere in its benefits chain (separate row), so nothing is counted twice. No formula changed.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| tongass_acres | https://www.govinfo.gov/content/pkg/FR-2023-01-27/pdf/2023-01483.pdf | verified (9.37 million acres; cost statement as above) | |

## Drivers
Unchanged (the 2020 exemption's expected logging, years counted, discount rate; all judgments or estimates).
