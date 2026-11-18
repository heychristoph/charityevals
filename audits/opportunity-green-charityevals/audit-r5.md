# Audit: opportunity-green-charityevals, round 5 (scoped verification of rule 2.23 and the 15 Nov fix-ups)
Result: -0.2352 tco2e/$ = -0.4376 years of healthy life per $1,000 (combined range -10.92 to -0.0175). Verdict: pass.
Model-sha: d61f409590b687c9b462d9466a9cc36c093949fc71f3eda382d1bedaa7ebda60
Rules: 0.3.7
Scope: only the rows changed in commit 7e73f6cd (imo_low_income_payer_consumption, new imo_levy_payer_uov, uov_per_year, explainers of imo_fund_revenue_per_year and imo_jet_uov, the bridge's side-effect-weight term) and the summary and write-up sentences stating the result.
Mechanical: lint 0 findings (3 warn/info only), invariants none, normalization-audit none for this model; check.ts all models valid.
Previous round: round-4 findings all resolved and unaffected.

Split of -0.11 to -0.44 (scratch copies, rows swapped): lower payer consumption alone (levy row zeroed) -0.11 to -0.26; the levy row adds -0.18 on top. The consumption step is large because the result is a net of a gain (jet_uov) and the cost, so a 30% rise in the cost per dollar moves the net by more than 2x. Arithmetic and sign are right.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | normalization | imo_levy_payer_uov | Rule 2.23 says a fixed sum (grants, appropriations, levies) takes all but the evidence step; the row multiplies by `evidence_adj`. It matches imo_jet_uov (same revenue, same ex-ante modelling), which is what the explainer says, so net of the Fund's own flows it is consistent, but it departs from the rule's wording. | Row formula vs 2.23 text "a fixed sum (grants, appropriations, levies) all but the evidence step". | Either drop `evidence_adj` from the levy row, or state in 2.23 that a levy netted against a spending row of the same revenue takes that row's evidence step. | Dropping it: -0.44 to -0.48 (10%). |
| 2 | low | presentation | write-up, Summary | Last sentence runs two "and" clauses ("... cost those who pay them, and the part the fund would send ... makes up only part of that, and even the sign ..."). | writeups/opportunity-green-charityevals.md line 3. | Split into "... cost those who pay them. The part the fund would send to climate-vulnerable countries makes up only part of that, and even the sign of the result is uncertain." | none |

Other checks, no finding: imo_low_income_payer_consumption = 3,109 × 0.68 = about $2,114, on the survey scale as 2.14 asks; the levy row's chain (revenue, payer uov per dollar, evidence, adoption, success, years, credit, period share, delivered share, missing data) matches jet_uov's apart from the evidence point above; no cost of public funds on the levy (rule 2.23); the compliance row still carries the resource cost; uov_per_year adds the row once; the bridge reads `1 + $side_effect_weight × nondeath_damages_vs_deaths` as the unit's conversion does; imo_fund_revenue_per_year and imo_jet_uov explainers match their formulas (the "pending" gross wording is gone); summary and write-up give -0.44 and name the levy cost with no comparison with other charities.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| facts survey_consumption.lmy_na_consumption_per_person_2024 | https://api.worldbank.org/v2/country/LMY/indicator/NE.CON.PRVT.CD?format=json&date=2024 | verified | Low & middle income, 2024: 20,904,671,580,531 current US$ |
| same, population | https://api.worldbank.org/v2/country/LMY/indicator/SP.POP.TOTL?format=json&date=2024 | verified | 6,722,971,301; quotient 3,109.4, matches the fact (3,109) |

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 1a9667aa.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against HEAD.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against ca214e5f.

Re-stamped (17 Nov 2026), rule mobiliser-share-30: typed results in the model's text made placeholders or recomputed at the 30% mobiliser share, and wrong prose placeholders corrected; no row changes. Mechanical: headline -0.4376 → -0.1313 (+70%), 15 rows changed, against 2b24b73c.
