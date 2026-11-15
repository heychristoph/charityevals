# Audit: drug-policy-alliance-charityevals, round 4 (verification)
Result: -4.185e-6 daly/$ native = -0.004185 years of healthy life per 1,000 dollars (combined range -0.0746 to -0.00023; simulation 5% to 95%: -0.030 to +0.0032, i.e. 7.15x to -0.77x the best guess); cause median 0.0686 (x-0.061). Verdict: pass.
Verdict: pass
Model-sha: 8e226a41f58907408adcf9c8b0fb798f9e0fa9ecb4f4dfbeb9c12413fd9712b9
Scope: unchanged from round 3 and correct (only the verification scope was checked: round-3 findings and the new changes).
Mechanical: lint 0 high / 0 medium / 0 low (audit-model "Findings (0)"). Invariants: none (INV-15 ignored, per owner). check.ts: all models valid. simulation-check: stable ("5% 7.15, 50% 1, 95% -0.769 x best guess"); the range warning (plausible range runs from harm to good) is the expected one for a net-harm model. normalization-audit not re-run (no rule change; scope was verification only).

Previous round (audit-r3.md):
1. Traffic harm leaves out Aydelotte 2019 (high): **resolved**. `can_traffic_deaths_per_million` now cites the 2019 five-year study (+1.2, +1.8 per billion VMT; about 11 and 16 per million at 9,500 miles a person), the 2017 study (+0.2), Santaella-Tenorio 2020 and Lane and Hall, and sets best 5 (0 to 16), the re-derivation asked for. `can_traffic_evidence_adj` is 0.6 (0.2 to 1) with "three of four studies find a rise" and the 2017 null named; the write-up's "third study none" is gone. The new formula inputs check: the row is multiplied by `can_sales_discounted_years` and `can_traffic_evidence_adj` and read through `can_credit_adj` in `ue_can_traffic`. Result moved -0.00272 to -0.00419, in line with the predicted -0.0039 to -0.0046 plus the other fixes.
2. `m110_period_share` set as `1` (medium): **resolved**. It is a ranged judgment 0.85 (0.6 to 1) anchored on the 2019 drafting and 2020 signature drive; the write-up says 85%.
3. `od_period_share` applied to the other harm-reduction wins (low): **resolved** by a different route. One weighted judgment 0.45 (0.25 to 0.7) (30% for the centres, about 80% for the later laws, which are a third of the branch's deaths: 2/3 x 30% + 1/3 x 80% = 47%) instead of a split row. It is a ranged judgment with its anchor stated, so one consistent figure; accepted.
4. Traffic rate multiplied by the shared years counted although averaged over five years (low): **resolved**. The row is now defined as a yearly rise while legal sales last, so the shared years-counted slider multiplies it consistently. A residual remains (new #2).
5. `can_user_ln_gain` rounding (low): **resolved**. 0.0019, "= 0.19%" with no rounding clause.
6. Write-up order and sources (low): **resolved**. Gains are listed users' gain, then the centres' overdose deaths, then records. I recomputed the branch terms after the changes: users' gain about +46.8, centres and harm reduction about +7.8, records +5.5, so the order is right; losses are traffic about -94, use disorder -50, Measure 110 overdoses about -27, so "traffic deaths and cannabis use disorder, then Measure 110" is right, and "the losses are more than twice the gains" holds (about 171 against 64). "At zero the net harm grows by nearly half" matches the tornado (-0.00602 against -0.00419, +44%). Borbely 2026, Aydelotte 2017 and 2019, and BEA are in the Sources bullets, and a round-3 note was added. The summary's figures (0.004; 0.03 lost to 0.003 gained) match the live model. No comparison with other charities, a median, an average or peers in the summary or write-up.

No new errors found in the changed rows: units (per million residents a year, times population/1e6) are consistent; `can_traffic_deaths_per_million` stays `estimate` with its source block (Santaella-Tenorio quote); the judgments name their anchors and ranges; the formula for `m110_period_share` moved from a formula to a value/kind/range without breaking its readers (lint 0).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | can_traffic_deaths_per_million (explainer) | The 2019 figures are cited from secondary sources in this audit (PubMed and ScienceDirect were behind a cookie wall or 403), and the paper has a corrigendum: Accid Anal Prev 151 (2021) 105757, doi 10.1016/j.aap.2020.105757, PMID 33360873. I could not read whether it changed any figure. Secondary reports give +1.2 (95% CI -0.6 to 2.1) over five years and +1.8 (0.4 to 3.7) from dispensary opening, matching the explainer. | Search result of a review citing the study; Minnesota DOT report TRS 2404 cites the same 1.2; Santaella-Tenorio's 37 in 2014, 123 in 2017 and mean 75 per year checked in PMC7309574 | Cite the corrigendum beside the 2019 paper in the explainer once its text is read, and put the confidence intervals in, so the "not significant" and "significant" labels rest on the numbers. If the corrigendum changed the coefficients, re-run the conversion. | none expected |
| 2 | low | comparability | can_traffic_deaths_per_million under `$win_years_counted` | The best guess of 5 blends the fading Lane and Hall step (about 2) into a yearly rate. At `win_years_counted` 20 that fading share is counted for 20 years. The lasting estimates (about 10) are weighted about half and the fading one about half, so the slider over-counts the fading part only. Small, and the default is right. | Explainer; tornado row win_years_counted (-0.0112 at 20) | Accept as is. If it is touched again, count Lane and Hall's step once, after the wait, and the lasting rate times the years counted. | none at the default |
| 3 | low | presentation | can_traffic_deaths_per_million (explainer) | "11 and 16 per million" from +1.2 and +1.8 at 9,500 miles: 1.8 x 9,500 = 17.1 per million, not 16 (1.2 gives 11.4). Within the row's own range (high 16), the best guess is unaffected. | Arithmetic | Write "some 11 and 17". | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| can_traffic_deaths_per_million (Aydelotte 2019) | pubmed 31518764; doi 10.1016/j.aap.2019.105284 | unreachable (cookie wall); verified by second source | Review citing it and the Minnesota DOT report: +1.2 per billion VMT (95% CI -0.6 to 2.1) over five years; +1.8 (0.4 to 3.7) from dispensary opening; Accid Anal Prev 132: 105284 matches the citation. Corrigendum (2021) not read |
| can_traffic_deaths_per_million (Santaella-Tenorio 2020) | PMC7309574 | verified | 37 excess deaths in 2014, 123 in 2017, "mean of 75 excess fatalities per year"; Washington 0.08 per billion VMT, probability 0.674 |
| can_traffic_evidence_adj (Aydelotte 2017) | PMC5508149 | verified (round 3) | +0.2, -0.4 to +0.9 |
| can_user_ln_gain arithmetic | model | verified | 1,625 x 1.34 x 5% / 58,000 = 0.1877%, shown as 0.19% |
| Windle et al. 2022 (review of 64 studies, named in `can_traffic_evidence_adj`) | not fetched | not checked | a supporting citation only; the judgment does not hinge on it |
| other rows | as in round 3 | unchanged | |

## Drivers
1. `can_user_ln_gain` (judgment, RAND-anchored): the largest gain; at 0 the result is -0.0060.
2. `can_traffic_deaths_per_million` (estimate, four studies) with `can_traffic_evidence_adj` (judgment, three of four designs): the largest harm now, about -94 DALYs; range 0 to 16 gives -0.0005 to -0.0123.
3. `can_cud_or_26plus` with `can_health_evidence_adj`: the second harm.
4. `m110_od_evidence` (judgment): the third harm.
5. `can_attribution_share`, `missing_data_discount` and the period shares: scale the size, not the sign.

What would most improve the model: reading the Aydelotte 2019 corrigendum (#1) and a published consumer-surplus estimate for legal cannabis, since users' gain remains the single largest unpriced input.

Verdict: pass (0 high, 0 medium, 3 low).
Model-sha: 8e226a41f58907408adcf9c8b0fb798f9e0fa9ecb4f4dfbeb9c12413fd9712b9
