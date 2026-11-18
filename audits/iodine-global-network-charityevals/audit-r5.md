# Audit: iodine-global-network-charityevals, round 5 (scoped verification, credit rule 2.24)
Result: 0.006344 uov/$ = 3.17 years of healthy life per 1,000 dollars (combined range 0.094-107). Verdict: pass (one medium text fix open, no high).
Model-sha: 0823a4c8da7a6692278a2d93936b77c300087732ac1394dc7fab4552d1b91642
Scope: only the re-judged rows `leb_`, `qa_`, `dav_`, `net_attribution_share_shared` (and the unchanged `vnm_`, `reg_` ones), the `credit: "win"` classes on the six `<b>_attribution_share` rows, and text that follows.
Preflight: pass (one low: generated/distributions.json out of date, ignored as told).
Previous round: round 4 had no open high or medium.

Checks:
1. Denominators. Lebanon (UNICEF, AUB, Tripoli Chamber of Commerce testing), producer QA (CENIN, ANLIS Malbran / provincial laboratories, UNICEF), Davao (other partners beside IGN) and reviews and tools (national coordinators, WHO, UNICEF) now count only those working alongside IGN; ministries, inspectors, FDA/DTI, the city government, Bolivia's Ministry of Health, the Madagascar government and producers' own spending are named as adopters under the mobiliser's share. No co-advocate in the old texts was dropped; the explainers name the old adopters on purpose. Vietnam (National Institute of Nutrition, WHO, UNICEF) and regional (WHO, Belgian government, Kiwanis, EUsalt, UNICEF, industry, coordinators) hold only co-advocates and co-funders, so leaving 0.2 and 0.25 is right.
2. Facts, checked in the Annual Report 2025 (fetched): Lebanon "working with UNICEF, the American University of Beirut and government partners", Tripoli Chamber of Commerce testing partnership, Rapid Response Fund grant (p. 15-16); Salta CENIN, provincial laboratories, ANLIS Malbran and SUNIBROM monitoring, producers' joint purchase of potassium iodate, Bolivia's Ministry of Health programme, Madagascar with UNICEF and the Government (p. 18-21); Davao: IGN worked with local government and partners, the plan coordinates with FDA and DTI (p. 22); Vietnam: Ministry, NIN, WHO, UNICEF (p. 24); Gates Foundation funding for the tools; Belgian government and Kiwanis support for the Brussels meeting, UNICEF supporting the South Asia meeting. All hold. "Unpaid time" of national coordinators is an inference from "alongside their national responsibilities", as in the old text.
3. Values. 45% (25-70), 45% (20-70), 60% (30-85), 55% (30-80) are defensible best guesses for IGN among 3-4 named co-workers each with IGN leading or doing the analysis; no explainer arithmetic to reconcile beyond the printed value and range, which match the rows.
4. Classes. All six shares read `<b>_attribution_share_shared * mobiliser_share` with `credit: "win"`; each is used once in `<b>_total_adj` and `<b>_health_adj`, and nothing else multiplies by `mobiliser_share` on these paths. Test: the headline at mobiliser_share 5% is 0.1586, exactly 5% of 3.172, so it enters once. The aggregate `attribution_share(_shared)` rows are for reading only. No compliance or public-money cost rows exist to read the used share (the producers' iodate and upgrade spending is simply not netted; logged in 2.24 as deferred).
5. "Would it have happened anyway" stays in `*_counterfactual_adj`, `vnm_p_final`, `$win_years_counted`; the share rows hold none of it. No double count.
6. Text. The model `summary` still says "about 2.4 years" (stale, now 3.17). The write-up's credit line ("20% to 60%") matches the rows (0.2 Vietnam to 0.6 Davao). Write-up said Vietnam's decree "decides about a quarter of the result"; with vnm_p_final at 0 the headline falls 3.17 -> 2.54, i.e. a fifth: corrected. No row explainer quotes the old shares.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | summary | The summary quotes a typed result, "The result, about 2.4 years of healthy life per 1,000 dollars", stale after this change (now 3.17). | Headline 2.41 -> 3.17. | Replace "about 2.4 years of healthy life per 1,000 dollars" with "about {{result}} years of healthy life per 1,000 dollars" (the placeholder other models' summaries use). | none |
| 2 | low | source | dav_attribution_share_shared | "other partners advising beside it" names none; the report says only "local government and partners" and "national and local stakeholders" (p. 22). | AR p. 22 | Say "the report names no other partner" in the explainer, or keep as is; range 30-85% already wide. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| leb_, qa_, dav_, vnm_, net_, reg_attribution_share_shared | https://ign.org/app/uploads/2026/08/12175-IGN-%E2%80%93-Annual-Report-1.4.pdf | verified | Partners named in each explainer appear in the report; "unpaid" coordinators inferred. |

## Drivers
Unchanged from round 4 (missing-data discount, years a won change counts, discount rate, mobiliser share, severity).

Verdict: pass

Write-up edit made (by this round): "decides about a quarter of the result" -> "about a fifth".
