# Audit: refugee-council-charityevals-advocacy, round 1
Result: 8.157e-6 daly/$ = 0.00816 years of healthy life per 1,000 dollars (combined range 0.0009-0.0736); cause median 0.081 (x0.10). Verdict: pass.

Verdict: pass
Model-sha: c0ecaaeca12773a4d3bc2bc8e0cb9a07200d4025280c1b127b2157412ba59cf5
Scope: advocacy and awareness raising line, years to March 2024 and 2025 (£1.305m, £2.94m; p. 34 and note 6a verified in the extracted accounts). Matches the other two Refugee Council models' split.
Mechanical: lint 0 high / 1 medium (spread 1183x on own ranges) / 1 low (attribution_share diagnostic; explainer already says "for reading only"); invariants none; normalization-audit no violations for this model; simulation stable (5% 0.24, 50% 1.0, 95% 3.56 x best guess).
Previous round: none.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | source | mvo_lasting_days (lasting branch of mvo_uov) | The lasting 42-day move-on period (March 2026) is the model's lasting move-on win but no source is cited anywhere in the model; the cited Home Office evaluation says single adults returned to 28 days on 1 September 2025 and never mentions 42 days. It is an operational policy that could be changed at any time (NRPF Network). | Evaluation s.1.4: pilot "ended on 1 September 2025 for single adults". Web: 42 days applies to grants from 9 March 2026 (Homeless Link; Right to Remain); the Refugee Council challenged it. | Add a source to mvo_lasting_days (Homeless Link "New 42-day asylum move-on period confirmed" or the Home Office Ceasing Section 95 Support instruction, 9 March 2026); say in the explainer it is guidance, reversible, and that the Refugee Council campaigned for 56 days and challenged the 42. | Row is #7 in the tornado, 0.0052-0.0119 |
| 2 | medium | double-counting / timing | program_spend, mvo_uov | Cost window is the two years to March 2025, but the lasting 42-day change took effect in March 2026, after the window (and September 2025 to March 2026 at 28 days is not credited). Convention 11: cost and wins from the same period. | Dates above; accounts end 31 March 2025. | Either drop the lasting branch (credit only the pilot, whose dates fall in the window) or add the year to March 2026 to the cost once its accounts exist; meanwhile state in the mvo_lasting_days explainer that the lasting win is credited to the earlier campaign. | Lasting branch is most of mvo_uov; up to about -60% of the result if dropped |
| 3 | medium | sensitivity | ima_ls_gain, ima_limbo_years | The "panel surveys of refugees in Germany" anchor behind 0.4 points is named without a citation. | No source on a judgment that sets the processing branch. | Cite the study (e.g. IAB-BAMF-SOEP papers on legal status and life satisfaction) with the effect size, or name the reference class. | Branch is small (its adjustments multiply to about 0.5%), so under 5% of the result |
| 4 | low | presentation | mvo_pilot_years | Labelled judgment but built from dated policy events (0.73 years for single adults from the evaluation); the 1.25 high end assumes 56 days for everyone until 42 days. | Evaluation 1.4. | Make it an estimate with the evaluation as source, or show the weighting of families. | none |
| 5 | low | sensitivity | grants_per_year | Point value carried for 20 years of a lasting reform from a year whose grants were 35% below the previous year. | gov.uk: "35% fewer than in the previous year". | Give it a range (about 35,000-70,000) or note the trend in the explainer. | modest |
| 6 | low | sensitivity | own-range spread (mechanical) | Own ranges span 1183x; 90% of the uncertainty is judgment. | audit-model. | Summary already says "mostly judgment"; fixing 1-3 narrows it. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| adv_spend_2425_gbp, adv_spend_2324_gbp | accounts (extracted text) | verified | "Advocacy and Awareness Raising 2,491 449 - 2,940 948 357 - 1,305" |
| adv_staff_gbp, adv_direct_gbp | accounts note 6a | verified | "597 916 1,513 1,427 2,940" |
| grants_per_year | gov.uk immigration statistics YE Mar 2025 | verified | 45,084 |
| ima_arrivals_per_year | gov.uk YE Dec 2024 irregular arrivals | verified | 36,816 |
| mvo_pilot_days | gov.uk move-on evaluation | verified | 41 to 56 days, six months either side of 9 Dec 2024 |
| mvo_pilot_years | same, 1.4 | verified | ended 1 Sep 2025 for single adults |
| mvo_lasting_days | none | unsupported | see finding 1 |
| next_dollar refugee_council | facts/next_dollar.json | verified | 0.8 x 0.55 x 0.95 = 0.42, from accounts pp. 21-25, dated within a year |
| mvo_value_per_day_gbp (£49.18) | gov.uk asylum support | not fetched | judgment with range; low impact |

## Drivers
1. missing_data_discount (shared slider). 2. win_years_counted (shared). 3. mvo_counterfactual_adj (30%, judgment, anchored on Baumgartner and consistent with the Feeding America model's 5-25%). 4. mvo_attribution_share (25%, judgment, coalition named). 5. next_dollar (sourced estimate). Template chain intact (all template rows present); counterfactual and credit are asked once each, as in Feeding America. Plausibility: x0.10 of the cause median with a stated reason in the summary, between the Refugee Council services model (0.0029) and Feeding America advocacy (0.018). Best improvement: source and date the lasting win (findings 1-2) and give the processing branch a cited effect size.
