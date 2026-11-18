# Audit: learning-alliance-charityevals, round 2
Result: 0.03881 uov/$ = 19.40 years of healthy life per 1,000 dollars (combined range 1.52–247.5); cause median 0.1169 (×166). Verdict: pass.
Model-sha: c8de47d2aae10719a0649679cb2f2e0398bde24e95bb667a0c5a2c59fa291add
Rules: 0.2.2
Scope: unchanged from round 1 (one programme, calendar 2025, $240,000 all-in, over 20,000 pupils, 75 schools in Iganga District). Scoped verification: round 1's one medium and the changes made for it, plus any new high or medium those changes introduced. No full re-audit.
Preflight: pass (la-preflight2.txt; no blocking lines).
Previous round: finding 1 (medium, decoding_weight / learning_gain_sd): resolved. Findings 2–7 (low) were the builder's; each was also checked and is applied (below), none re-opens the round.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | subtask_correlation | The anchor is a between-school slope in raw units ("about 5 extra words per minute for every 10 extra sounds", Midline p. 9), not a pupil-level correlation, so it supports "the two rise together" but not the value 0.6. The explainer words it as "across the charity's schools", which is accurate, and the range 0.4–0.8 is wide enough to cover the floor effect. | Midline p. 9: "Across schools, those that gained more sounds also gained more passage-reading words — on the order of 5 extra words per minute for every 10 extra sounds"; p. 1 and p. 4: 51% of P1 pupils read no words. | Optional: add "a between-school pattern, not a pupil-level correlation" to the explainer. | none |

## Round 1 finding 1: verification
- **Explainer (a)**: rewritten as asked. Says the index (principal-components weighted, renormalised) rose as much as the sound subtask (0.638 against 0.647), words at 0.22–0.37, equal weighting is K&T's unweighted-index convention. Resolved. The K&T figures are those round 1 verified in Table 2 (not re-fetched).
- **Explainer (c)**: the midline's endline expectation is now the reason for the low end. Checked: Midline p. 1, "we do not yet think these are likely to exceed control gains at endline". Resolved.
- **Correlation row (b)**: new ranged judgment `subtask_correlation` 0.6 (0.4–0.8), anchored on Midline p. 9 (verified, as above) and the P1 floor (verified, 51% of P1 pupils read no words). 0.6 rather than 0.7 is explained and inside the suggested 0.5–0.85 range. Resolved.
- **Formula**: `learning_gain_sd` = (w·SPM + (1−w)·WPM) / sqrt(w² + (1−w)² + 2·w·(1−w)·ρ), written with products. Checked by hand at the defaults: 0.25 / sqrt(0.5 + 0.3) = 0.2795; the model's ln_gain_per_person rose 0.551 → 0.615 (×1.12, with the July-share change). The formula, units and sign are right. Resolved.
- **Result**: 17.81 → 19.40, from the correlation (+12% on the effect), the 6% sponsor fee (−6%) and july_dose_share 0.4 (implementation_adj = (14,000 + 6,000 × 0.4) / 20,000 = 0.82). Each moves the way round 1 predicted.

## Round 1 lows, checked
| # | Status | Note |
|---|---|---|
| 2 fiscal sponsor fee | applied | `fiscal_sponsor_fee` 0.06 observed (ppf.org/faqs quote as round 1 verified); `total_expenses` = spending / (1 − fee) = $255,319; `program_expenses` = $240,000; overhead_ratio 1.064. The explainers say the fee is on top of the charity's reported spending. |
| 3 july_dose_share | applied | 0.4 (0.25–0.55); arithmetic checked: 25 July schools ≈ 12 government (dose ≈ 0.2) + 13 private (≈ 0.6) → 0.41. The 28.5% private share in the February panel (Pilot Report p. 12, table "Private (n, %) 294 (28.5%)") and "35 of our 47 government program schools" are in the report; the split is stated as our inference. Private schools "continued teaching" through the strike (report p. 8 area, lines on private schools unaffected). |
| 4 Primary 3 | applied | `spm_effect_sd` and `evidence_adj` explainers and the write-up say Primary 3 pupils take the P1–P2 effect (p. 13; uncontrolled gains as large, p. 15). |
| 5 wording | applied | counterfactual_adj says the report names no other structured-literacy programme in comparison schools; attribution_share_shared says localised by Read for Life, a partner NGO based in Gulu (p. 7), and "English phonics lessons in school time (website)". |
| 6 typed figures | applied | Summary and write-up use `{{row:program_expenses}}`, `{{row:pupils_2025}}`, `{{row:fiscal_sponsor_fee}}`, `{{row:learning_gain_sd}}`; the opening says "mostly government ones". "75 schools" and "26 programme schools" remain typed: no row holds them, acceptable. No peer comparison in the summary or write-up. |
| 7 K&T citation | applied | "abstract and Table 2". |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| decoding_weight (low end) | EGRA Midline 2026 (learningalliance.net …d508cc15….pdf) | verified | p. 1: no controls in the midline; endline November 2026; "we do not yet think these are likely to exceed control gains at endline". |
| subtask_correlation | EGRA Midline 2026 | verified (as a school-level slope) | p. 9: 5 extra words per minute for every 10 extra sounds across schools; p. 1 and p. 4: 51% of P1 pupils read no words (24% P2, 8% P3). Finding 1. |
| july_dose_share | 2025 Pilot Report (…1ca12f7a….pdf) | verified | 28.5% private in the February panel; 35 of 47 government schools sampled; private schools continued teaching through the strike. |
| fiscal_sponsor_fee | ppf.org/faqs | verified in round 1 | 6% of deposits. Not re-fetched. |

## Drivers
Unchanged in kind: `$discount_rate`, `$uov_per_daly`, the shared persistence, resource-sharing and earnings figures, then the model's own `decoding_weight` (judgment, 10.95–27.35 at its ends), `evidence_adj` (judgment, 12.47–26.33), `spm_effect_sd` and `wpm_effect_sd` (measured, verified). `subtask_correlation` does not appear in the top 12. The model's own joint range is −0.41 to 93. The November 2026 endline would improve the model most.

Re-stamped (18 Nov 2026): round 2's optional low applied: subtask_correlation's anchor called a between-school pattern (wording only). Mechanical: headline unchanged, against f7576c62.
