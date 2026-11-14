# Audit: rainforest-foundation-us-charityevals, round 3 (verification)
Result: 1.175e-5 daly/$ = 0.01175 years of healthy life per 1,000 dollars (combined range 0.0022-0.062); climate cause median 0.00174 (x6.7). Verdict: pass.
Model-sha: c82e767f38cca7148ee1891d2978d4d222509a4733b50af5553025d65649b4ca
Scope: the changes in commit 7fea785, checked against the round-2 findings. The full battery was not re-run.

Mechanical: audit-model lint 0 high / 0 medium / 1 low (spread 2,926x on the model's own ranges; the summary says the result is mostly uncertainty). No invariant violations. check.ts: all models valid. generated/ untouched (git status clean).

## Round-2 findings

| # | Round 2 | Status | Check |
|---|---|---|---|
| 1 | medium, global work has no branch | resolved | `glob_*` is a full thin branch: `glob_ha` 958M ha (Woodwell quote "customarily hold and use at least 958 million hectares (mha) of land in the 24 reviewed countries", verified live; the page also describes GATC as representing communities in 24 countries); loss rate, lasting loss, tCO2e and pandemic UoV rows; evidence 0.6, counterfactual 0.1% (0.01-0.5%), attribution 10% (3-30%), delivery 0.8, `$missing_data_discount`; `glob_credit` includes the side-effect share. It is wired into the risk per hectare, the future-life bridge (with `protection_years`), the pandemic and carbon rows and every averages row (evidence, counterfactual, attribution, delivery, missing data, total, unmodelled). `tero_unmodelled_benefits_adj` is 0 (-30% to +30%) and its explainer says the global work is its own branch, so nothing is counted twice. The `program_expenses` explainer and summary name the branch. The 958M ha includes the four countries' territories; the `glob_ha` explainer says so, and at a 0.1% effect the overlap is negligible. |
| 2 | medium, Peru counterfactual | resolved | 0.23 (0.08-0.45). The explainer states year 1 at 52% (8.4 of about 16.2 ha) and year 2 at about 21% (3.3 of about 15.5 ha), a fifth of communities new (129 in 2024, more than 160 in 2025), 0.2 x 52% + 0.8 x 21% about 27% (I get 27.2%), shaded for 1.7x the trial's area per monitor. `tero_counterfactual_adj` 0.08 (0.02-0.25), "a third of Peru's 23%", with its density reasoning. |
| 3 | low, other territories' attribution | resolved, with a small residue (A below) | Rebuilt like for like over the decade: APA $0.153M to $1.7M gives about $9M, SRDC about $6M (stated as a guess), about $15M against RFUS's $7M; says the intermediated money part-passes to partners directly. 45% (25-75%). |
| 4 | low, Peru attribution | resolved | A rough count: RFUS's 291 x 60 x about $10 = $175k (I get $174.6k) plus its Peru team, $0.6-0.9M; others' unpaid days, the federations and Geobosques $0.2-0.4M; 70% (45-90%). |
| 5 | low, `land_evidence_adj` | resolved | The averages clauses are gone; 0.7 (0.4-1) rests on the quasi-experimental design and BenYishay's null. |
| 6 | low, `tco2_per_ha_lost` | resolved | "An average standing in as a best guess; its spread is the shared fact's range." |
| 7 | low, Guyana MRVS URL | resolved | The Guyana Forestry Commission's MRVS Year 2020 report is cited by URL in the explainer. The PDF is reachable. The text was not extractable here (no pdftotext), so the 0.057% was confirmed through the search summary of that report, not by reading the page. |
| 8 | low, write-up drivers | resolved | The first bullet now names both the land-use share and the COVID-scale probability. |

## Figures against the model
Branch shares at the defaults, from scratch copies with each branch's credit set to 0 (base 0.01175):

| Branch | Share | Summary / write-up says |
|---|---|---|
| Peru's territories | 48.3% | "about half" |
| Other territories | 9.9% | none stated |
| Global work | 3.4% | "about 3%" |
| Titles | 8.9% | none stated |
| Patrollers' pay | 29.5% | "three tenths" |
| Pandemic risk (all forest branches; risk_per_ha_year zeroed) | 56.5% | "nearly three fifths" |

- The summary says "five branches", lists them, and the write-up's model section lists five. The write-up table (Peru 23%, 70%, 0.85; elsewhere 8%, 45%, 0.75; delivery 90% in both; hectares per patroller 3,600 and 62,000) matches the rows.
- The write-up says the decade's budgets "came to about twice what RFUS raised for them": $15M against $7M, matching the explainer.
- Beneficiaries: world 0.705 (pandemic risk and carbon), pay 0.295 split Peru 0.2146 (291/400), Guyana 0.056 (109/400 x 11.7/16.8), Brazil 0.019, Panama 0.005. These agree with the pay share and the patroller split.
- The audit-model result (0.01175) is the figure in the summary and write-up (0.012).

## New findings (all low)

| # | Severity | Row | Finding | Fix | Effect |
|---|---|---|---|---|---|
| A | low | `tero_attribution_share` | The explainer builds RFUS's share of Guyana's partners as "about 30-50%", then says Guyana is 70% of the area and that Brazil's and Panama's partners have other funders, state agencies and unpaid patrols. That implies about 35-40% overall, but the best guess is 45%, the top of Guyana's own range. | Set the best guess to about 0.38 (range unchanged), or say why the other countries sit above Guyana's share. | about -2% |
| B | low | `glob_attribution_share` | The explainer lists the other contributors but doesn't count them (Convention 2): it gives RFUS's $1-1.5M a year and then 10% by judgment. | Add the alliance's published budget or its funders' totals to the count, if published; otherwise say none is. | within the branch (3% of the result) |
| C | low | `glob_ha`, `glob_loss_rate` | `glob_ha` is all the 24 countries' community-held land, not the member networks RFUS funds, and the 0.1% loss rate is anchored on the Amazon only. The tiny counterfactual (0.1%) carries the downscale, so the branch is thin but not misleading. | None needed; if a reach figure for the funded networks is published, use it. | none to branch |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `glob_ha` | woodwellclimate.org/significance-of-community-held-territories-in-24-countries-to-global-climate/ | verified | "customarily hold and use at least 958 million hectares (mha) of land in the 24 reviewed countries"; the page mentions GATC and its 24 countries |
| `ter_guy_loss_rate` | redd.unfccc.int/uploads/2_296_guyana_mrvs_and_accuracy_assessment_report_-_year_2020.pdf | reachable; figure via search summary | 0.057% annualised national rate for 2020 (10,232 ha) |
| `terpe_counterfactual_adj` | Slough et al. 2021 (checked in round 2) | unchanged | the 52%, 3.3 ha and 37% figures unchanged; the year-2 control loss of about 15.5 ha is derived, as in round 2 |
| Schedule F and note 9 figures in `glob_ha` | checked in round 2 | unchanged | |

Verdict: pass (0 high, 0 medium, 3 low).
Model-sha: c82e767f38cca7148ee1891d2978d4d222509a4733b50af5553025d65649b4ca
