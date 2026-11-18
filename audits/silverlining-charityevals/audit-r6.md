# Audit: silverlining-charityevals, round 6 (scoped verification of round 5's fixes)
Result: 0.9885 x 0.1989 / 0.1944 = 1.01 tco2e/$ = 0.1989 years of healthy life per 1,000 dollars at mobiliser_share 100%; range not re-run (scoped). Verdict: pass.
Model-sha: db7a88fb33060263e1ab2a3148d8a210350d5a3ba608c123013cd1ceef29438d
Rules: 0.3.12
Scope: round 5's two findings and the text they touch.
Preflight: headline 0.198924 reproduced; no blocking line seen (the generated-distributions line ignored as briefed).
Previous round: finding 1 (medium, summary figures) resolved: the summary now says "about 1.0 tonne of CO2, about 0.20 years", matching 1.01 tonnes and 0.199. Finding 2 (low, `dir_attribution_share_shared` above `res`) resolved: 0.65 (0.4-0.9), explainer names the researchers who pitched and the host institutions' staff, computing and overheads, funders and their staff stay out as adopters.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | No high or medium finding. | | | |

Checks: write-up branch shares recomputed from round 5's branch values with `dir` scaled by 0.65/0.75 (res 10.79, eng 8.62, dir 11.36, pol 7.54 of 38.31): 28.2% / 22.5% / 29.7% / 19.7%, matching the write-up's about 28 / 23 / 30 / 20. No other typed share or result in the write-up or summary quotes old figures; no comparison with other charities or peers. No write-up edit needed.

## Sources checked
None new (round 5 fetched the SilverLining 5-years page).

## Drivers
Unchanged from round 5.

Re-stamped (17 Nov 2026), rule mobiliser-share-30: typed results in the model's text made placeholders or recomputed at the 30% mobiliser share, and wrong prose placeholders corrected; no row changes. Mechanical: headline 0.1989 → 0.05968 (−70%), 17 rows changed, against 2b24b73c.
