# Audit: norwegian-refugee-council-charityevals-advocacy, round 6 (verification)
Result: 2.641e-5 uov/$ = 0.0132 years of healthy life per 1,000 dollars (combined range 0.00078–0.225; cause median 0.104, ×0.127), as in round 5. Verdict: pass.
Model-sha: 1ac36864f6d139f0bb83143f48939bf7808799d74da6082caa59ea0b6a7a7178
Scope: only the change since the latest audit (round 5, checked against the model file on main): the three career rows (career_forgone_pay, career_years_stayed, career_counterfactual_share) were typed placeholders (15,000 [5,000-30,000]; 5 [2-10]; 0.3 [0.1-0.6]) and now are formulas reading `@meta.career_forgone_pay_default`, `@meta.career_years_stayed_default`, `@meta.career_counterfactual_share_default` (facts/meta.json, same values, kind judgment, sourced to the template and normalization.md 2.8). The only other diff is the `beneficiaries` object reformatted to one country per line, same keys and values.
Mechanical: lint 0 high / 0 medium / 1 low (spread, stated in the summary); invariants none; normalization-audit no violations for this model (0 violations anywhere; INV-14 clean); check.ts valid; simulation stable (5%-95%: 0.073-11.5x).
Checked: the result at the defaults is unchanged from round 5's stated figure (audit-model prints 2.641e-5); the three rows have no value or kind left, so no typed placeholder remains; careers_changed is 0, so careers_value is 0 and nothing moves; the explainers say what the rows now are ("the site's shared default (facts/meta.json)") and are right for a model with no careers changed; the shared defaults' values equal the replaced placeholders exactly.

No findings.

Verdict: pass
Model-sha: 1ac36864f6d139f0bb83143f48939bf7808799d74da6082caa59ea0b6a7a7178
