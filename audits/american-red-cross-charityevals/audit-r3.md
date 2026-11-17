# Audit: american-red-cross-charityevals, round 3 (verification of the r2 fixes)
Result: 4.296e-6 daly/$ = 0.004296 years of healthy life per 1,000 dollars (combined range 0.001812–0.01018); cause median 0.2028 (×0.021). Verdict: pass.
Model-sha: e3bfbace5f9e5a45a14027bd4ce0ae7429ae5b58b9ebb25fa2bcf3d2463e546b
Scope: scoped to the two r2 fixes only: volunteer_hours (now 10,300,000, FY2025) and the hf_counterfactual_adj explainer (NFPA sentence).
Mechanical: lint not rerun beyond audit-model (far-below medium as in r2, summary gives the reason), invariants none, check.ts all valid, simulation-check stable (5% 0.613, 50% 1, 95% 1.56 x best guess), normalization-audit not rerun (coordinator: none).
Previous round: r2 finding 1 (volunteer_hours 9M vs 10.3M) resolved: row is 10,300,000, observed, FY2025 report with the quoted sentence; result 0.004428 to 0.004296 (-3.0%), as predicted. r2 finding 2 (unsourced NFPA 99%/16%) resolved: sentence removed, replaced by a sourced one. r2 finding 3: no action needed.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| volunteer_hours | https://www.redcross.org/content/dam/redcross/volunteer/pdfs/SS_RED_CROSS_VOLUNTEERSERVICES_2025ANNUALREPORT_Final.pdf | verified | "Engaged more than 325,000 volunteers who dedicated over 10.3 million hours in service of the Red Cross mission" (r2 fetch of the same PDF) |
| hf_counterfactual_adj | https://www.nfpa.org/education-and-research/research/nfpa-research/fire-statistical-reports/smoke-alarms-in-us-home-fires | verified | Key findings: "Nearly three out of five (59 percent) home fire deaths were caused by fires in properties with no smoke alarms (43 percent) or smoke alarms that failed to operate (16 percent)" (2018-2022 fires). Supports "three in five"; the URL is right. |

## Drivers
Unchanged: uov_per_daly, inc_cf_large, uov_per_ln_consumption, unmodelled_benefits_adj, large_vs_poorest_fifth. The explainers still make no comparison with other charities or models and no effective-altruism mention.

Verdict: pass
Model-sha: e3bfbace5f9e5a45a14027bd4ce0ae7429ae5b58b9ebb25fa2bcf3d2463e546b

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 768b765f.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.
