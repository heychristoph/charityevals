# Audit round 2 (scoped verification): SecureBio

Checked only the round-1 fixes, the changed rows and figures, and that they introduce no new error.

| Round-1 finding | Status |
|---|---|
| 1 Room factor (reserves) | Settled: room 0.7 (0.4 to 0.9); the note says unrestricted net assets $4,306,710 (Part X, BOY 3,579,633 / EOY 4,306,710), $3,480,943 donor-restricted, $2,580,337 receivable (all recomputed from the 990 field dump); 4,306,710 / 4,251,865 = 1.01 years, so "about a year of unrestricted reserves" is right |
| 2 Use factor | Settled: use 0.7 (0.5 to 0.9), 0.7 x 0.7 x 1.0 = 0.49, explainer and write-up "49%" match; the model shows 0.49 (0.2 to 0.8) |
| 3 evidence_adj blend | Settled: `ai_cost_share * ai_evidence_adj + (1 - ai_cost_share) * bio_evidence_adj`, 1.2 (0.5 to 1.2) and 0.75 (0.3 to 1.1), all inside the family bound; 0.22 x 1.2 + 0.78 x 0.75 = 0.85, as the write-up says; the old 0.3 to 1.3 driver is replaced by `bio_evidence_adj` (3.6 to 8.2) in the tornado |
| 4 System-card wording | Settled: explainer says references to its evaluations, VCT named only for Claude 4; write-up "evaluations are cited in system cards" |
| 5 Other-benefits anchor | Settled: about 1.5 years per $1,000 of the Observatory's spending at 5%, up to about 6 at 20%, compared with the rich-country models (about 2) |
| 6 NTI inconsistency | Settled: NTI's `ai_misuse_cost_share` explainer no longer cites the Forum and points to `bio_cost_share`; no value changed (see NTI audit-r10) |
| 7 Write-up sentence on Johns Hopkins | Settled: cut |

Figures against `scripts/audit-model.ts` (6.183 per $1,000, combined range 0.41 to 93.27, 0.1% discount 71.01, win years 1.336 to 18.88, next dollar 2.524 to 10.10, pandemic cut 3.77 to 30.3): the summary (6.2, 0.4 to 93), write-up (0.4 to 93, 71, 1.3 to 18.9, 2.5 to 10.1, "about 4 to 30") all match. `check.ts` passes; audit-model has no high or medium finding (same low point-estimate warnings as round 1).

New findings: one low, not blocking. The next-dollar range 0.2 to 0.8 is not the product of the stated component ranges (0.4 x 0.5 x 0.85 = 0.17 low, 0.9 x 0.9 x 1.05 = 0.85 high); the explainer states only the best guess and the overall range, so nothing is contradicted. Fix if wanted: state that the ends are rounded. No effect.

Model-sha: 15641125b150442a7289b9f185a5e5e1feebcb718971f4f2d50c73885fb7e89c

**Verdict: pass**
