# Audit round 2 (scoped verification): Johns Hopkins Center for Health Security

Checked only the round-1 fixes and that they introduce no new error.

| Round-1 finding | Status |
|---|---|
| 1 Next-dollar factor (CDC cooperative agreement) | Settled: 0.75 x 0.85 = 0.64 (0.3 to 0.9), CDC award cited, 2019 grant "$19.9M"; 0.7 x 0.9 / 0.73 = 0.86 matches 0.85 |
| 2 Unmodelled benefits | Settled: 0.05 (0 to 0.2) with anchor in explainer |
| 3 University and school assessments | Settled: gift_assessment 0.04 (observed, giving.jhu.edu/faqs), school_assessment 0.04 (0.01 to 0.08), both in dalys_per_donor_dollar |
| 4 Leverage and funging | Settled: 0.9 (0.7 to 1.05), explainer no longer double-reads the halved grant |
| 5 Education share and Sentinel term | Settled: cg_education_share_2025 0.71 (0.6 to 0.8), sentinel_years 1.5 (1 to 3), both feed known_funding_per_year and education_per_year |
| 6 Grant figure | Settled |

New findings: none. Summary figures match the model (7.6 per $1,000, 0.4 to 134, budget $13.8M, evidence 0.73); charity file spending and line 13,822,000 equal program_spend; the new "more than ten times its peers" sentence is supported (7.55 per $1,000 against about 0.06 to 0.07 for the AI-only peers METR, Redwood and MIRI in the reference class). audit-model.ts reports no high finding (7 low: point estimates without ranges, unchanged).

Model-sha: 6f37851b06008177420f1e7165029b5bbebd077d2ed0613bb1e96c324ac1530a

**Verdict: pass**
