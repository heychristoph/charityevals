# Audit: wounded-warrior-project-charityevals-mental-health, round 5 (verification)

Result: 2.478e-5 wellby/$ = 0.001618 years of healthy life per 1,000 dollars (combined range 0.00036-0.0072); cause median 0.104 (x0.0155). Verdict: **pass** (no high findings).
Model-sha: b0c67ced47b7a282e2a5e1d5b2c4b2fa0fc04ce6ae6f3fcf695e31d8cb513a21
Rules: 0.1.1
Scope: only the changes since round 4 (diff 09393a2..HEAD; main was merged in between, so the median moved).

Mechanical: audit-model 0 high / 0 medium / 1 low (far-below; the summary gives the reason and "under a fiftieth" matches x0.0155). normalization-audit: no violation for this model; `git checkout -- generated` run afterwards.

Changes checked:
- `iop_evidence_adj` and `opt_evidence_adj` 0.64 to 0.60 (0.45-0.9). The explainer's arithmetic holds: precision-weighting Foa (0.58, SE 0.24) with the rest of the pool (1.31, SE 0.31) gives (0.58 x 17.4 + 1.31 x 10.4) / 27.8 = 0.85 SD, which is 0.70 of the pooled 1.22; 0.70 x 0.85 = 0.595 = 0.60. 0.60 sits within the quoted HLI discounts (0.5-0.7). The `opt_evidence_adj` explainer says 0.60 and the write-up (paragraph on mental health) says 0.60 in the same place; no 0.64 remains in the model, the write-up or the summary. Foa's SE of 0.24 was not re-fetched against the paper here (earlier rounds verified the 0.58 and the pool's 1.22).
- `opt_family_dose_vs_iop` explainer now says it is the model's judgment with no published effect found, and the row is `kind: judgment`; consistent with the explainer's other claims (about a third of the veterans' effect, 0.3 in 0.1-0.6). The earlier unanchored "0.2-0.4 SD in trials" claim is gone.
- `opt_dose_vs_iop` explainer: "28% of patients in outpatient mental health settings began trauma-centred CBT, and initiation was higher where staff had more exposure to the therapy (odds ratio 2.3)" reads as a faithful paraphrase of van den Berk Clark et al. 2019 as quoted in earlier rounds; the source row and URL (PMC6702958) are unchanged. The odds ratio itself was not re-fetched in this round.
- Summary ratio: "under a fiftieth" against x0.0155 is correct. Result moved by about -6% on the evidence step alone (0.64 to 0.60), as expected for the intensive and outpatient branches.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `opt_dose_vs_iop` | The odds ratio 2.3 and the 28% were not re-fetched this round; they rest on earlier rounds' check of the paper. | Scope of a verification round. | Re-check against PMC6702958 if the explainer is edited again. | none |
| 2 | low | carried over | `opt_family_dose_vs_iop` | The 0.3 family dose has no published anchor (now said so). It stands as a judgment inside a branch that is already discounted for missing data. | Row explainer. | None needed; the label is honest. | small; family branch is a minor share |

## Sources checked
None re-fetched for this model (see items above); the arithmetic of the 0.60 was recomputed.

## Drivers
`iop_evidence_adj`, `iop_counterfactual_adj`, `wellby_factors.wellbys_per_sd_year`, effect duration, `missing_data_discount` on the therapy and support branches.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against e247896f.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.
