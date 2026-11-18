# Audit: the-bail-project-charityevals, round 4
Result: 1.251e-5 daly/$ = 0.0125 years of healthy life per 1,000 dollars, unchanged from round 3. Verdict: pass (no high findings).
Model-sha: 4954bbc90216601306943f831fc4075492899749f22a2bdb893f64e2e2912870
Rules: 0.1.0
Scope: scoped verification of the one round-3 low and the changed text only (facts `bailouts_fy2025` source note). No values changed.
Mechanical: `audit-model.ts` on models/global-health/the-bail-project-charityevals.json: 0 findings.

Round-3 findings:
1. `bailouts_fy2025` note (low end 3,050 unexplained): settled. The note now says between 31,000 (fund page) and 31,525 (34,525 less the Chicago pilot's 3,000) were bailed out. 34,572 - 31,525 = 3,047 and 34,572 - 31,000 = 3,572, which reproduce 3,050 and 3,570, and the row's explainer and range (3,300; 3,050 to 3,570) agree with the note.

New findings: none.

Verdict: pass (0 high).
Model-sha: 4954bbc90216601306943f831fc4075492899749f22a2bdb893f64e2e2912870

Re-stamped (15 Nov 2026): one consumption scale for US public money (normalization.md 2.14); 0.0125 → 0.0135.
Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2ef0280a.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.
