# Audit: earthjustice-charityevals-health, round 4 (verification)
Result: 1.684e-5 uov/$ = 0.00842 years of healthy life per 1,000 dollars (combined range 0.00055–0.130; model's own ranges 0.0026–0.021); global-health median 0.0686 (×0.123). Round 3: 0.00735, so +15%. Verdict: pass.
Verdict: pass
Model-sha: 1ae75cc9e99753e396ec5582b06c89e3f28a71251acf04fc204f96d70e36b957

Scope: verification of round 3's seven findings and of the rows changed to resolve them (`pm_evidence_adj`, new fact `us_pm_naaqs_2024_evidence`, `us_pm_naaqs_2024_years_until_effect`, `evidence_adj`, `pm_total_adj`, `pm_attribution_share_shared`, `pfas_dbp_share`, `pfas_dbp_illness_share`, `dalys_bridged`, `pfas_illness_dalys_per_death`, `cancer_value_per_death`, `pfas_value_per_death`, `pfas_dbp_deaths`, the docs line on deaths over 74, the summary and write-up). No full re-audit.

Mechanical: audit-model lint 0 findings; check.ts "all models valid"; summaries.ts ran; simulation stable (5% 0.152×, median 1×, 95% 5.9× the best guess). normalization-audit left to the caller. `generated` restored.

## Round 3 findings
| # | Status | Check |
|---|---|---|
| 1 evidence_adj on PM | resolved | New shared fact `us_pm_naaqs_2024_evidence` 1.0 (0.7–1.2), judgment, with reason (causal finding; doubt about the two estimates already in the deaths fact). `pm_evidence_adj` reads it; `pm_total_adj` uses `pm_evidence_adj`; `evidence_adj` 0.8 (0.5–1.1) stays for PFAS and its explainer says so. EDF's `pm_evidence_adj` row reads the same fact. Result moves as predicted (0.00735 → 0.00842 together with #2, #6; +24% and −7% net about +15%). |
| 2 wait | resolved | Fact now 9 (7–11). Explainer matches RIA text (designations assumed late 2025, Moderate attainment late 2032, RIA lines 924–928, 2210–2213, i.e. pp. 2–3); court-ordered February 2027 per EELP (checked in round 3). 9 years from 2024 is 2033, consistent with "near 2034" less earlier cuts. Note field says RIA pp. 2-3; round 3 cited pp. 3 and 37. No numeric effect. |
| 3 attribution | resolved | Designation-order sentence gone; explainer credits the 2024–25 briefing and the June 2026 outcome only as context. 25% (10–45%) kept. Acceptable. |
| 4 docs line | resolved | normalization.md now says 42 above 74 only where broad bands are known, and five-year weights (70–74, 75–79, 80+) for 70+ deaths in rich countries mixed by `*_80plus_of_70plus_*`. Matches the models. |
| 5 pfas_dbp_share | resolved | Formula now `pfas_dbp_deaths * cancer_value_per_death / ((pfas_deaths_total - pfas_dbp_deaths) * pfas_value_per_death)`: valued at cancer ages, as a share of the branch. `pfas_value_per_death` denominator is the 7,000 non-byproduct deaths, matching. Explainers of `cancer_value_per_death`, `pfas_value_per_death`, `pfas_dbp_share` agree. |
| 6 illness of dev deaths | resolved | `pfas_illness_dalys_per_death` = (cvd × cvd_yld_share_gbr / cvd_deaths_per_daly_gbr + `pfas_cancer_deaths` × cancer_yld_share_usa / cancer_deaths_per_daly_usa) / 7,000; infants add none; explainer says so. New `pfas_dbp_illness_share` gives the bladder-cancer deaths their own illness with the same US cancer ratio over the branch's illness; `dalys_bridged` multiplies the PFAS term by (1 + that share), consistent with the deaths side. Units DALYs per death; consistent. |
| 7 page cite | resolved | `pfas_dbp_deaths` page "p. 2, table"; the quote is on fact-sheet page 2 (pfas.txt lines 84–88: Bladder Cancer $380 million 2,600 deaths and 7,300 illnesses). |

## New findings
| # | Severity | Category | Row | Finding | Fix |
|---|---|---|---|---|---|
| 8 | low | source | @climate.us_pm_naaqs_2024_evidence | A judgment with a reasoned anchor but no quote; the claim "EPA's causal determination" is not cited to a page. | Add a note naming the ISA causal finding (EPA Integrated Science Assessment for PM, 2019) with its URL, or leave. No effect. |
| 9 | low | source | @climate.us_pm_naaqs_2024_years_until_effect | Explainer says "serious areas get longer" and "some cleanup comes earlier through permits and other rules"; neither is sourced. The note cites RIA pp. 2-3 while round 3 found the Moderate-attainment text also on p. 37. | Cite RIA p. 37 and the Clean Air Act attainment deadlines for Moderate and Serious areas in the note. No effect. |
| 10 | low | housekeeping | repo root | Untracked `scratch-vals.ts` sits in the worktree. | Delete it before commit. |

No high or medium finding.

## Figures
Summary and write-up read 0.0084, matching the live 0.008421. Write-up PM line (2,100 and 4,500, we take 3,000), the age-valuation sentence (PM and PFAS heart deaths at US heart-death ages, kidney cancers at cancer ages, infants for birth-weight deaths), and the summary (3,000 a year, 9,600 over decades) match the model.

## Sources checked
| Row | Status | Note |
|---|---|---|
| RIA text (ria.txt lines 924–928, 2205–2213, 2239) | verified | EPA assumes designations late 2025 and Moderate attainment late 2032, hence 2032 as analysis year. |
| PFAS fact sheet (pfas.txt lines 82–88) | verified | Developmental 1,300; Cardiovascular 3,700 deaths, 15,600 illnesses; Kidney 2,000, 7,000; Bladder (co-removal) 2,600, 7,300. Sum 9,600. |
| EELP tracker designation order | verified in round 3, not refetched | Order by 6 Feb 2027, EPA appealing. |

Verdict: pass (0 high, 0 medium)
Model-sha: 1ae75cc9e99753e396ec5582b06c89e3f28a71251acf04fc204f96d70e36b957
