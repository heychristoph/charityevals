# Audit: save-the-children-charityevals-advocacy, round 6 (verification)
Result: 8.331e-4 uov/$ = 0.42 years of healthy life per 1,000 dollars (combined range 0.056–3.12; global-health median 0.0866, ×4.8), as in round 5. Verdict: pass.
Model-sha: 3c9c946196fbd159d8bd179db8cfe43a130d4446ea687339aa0c4ab7ed92b746
Scope: only the change since the latest audit (round 5, checked against the model file on main): the three career rows (career_forgone_pay, career_years_stayed, career_counterfactual_share) were typed placeholders (15,000 [5,000-30,000]; 5 [2-10]; 0.3 [0.1-0.6]) and now are formulas reading `@meta.career_forgone_pay_default`, `@meta.career_years_stayed_default`, `@meta.career_counterfactual_share_default` (facts/meta.json, same values, kind judgment, sourced to the template and normalization.md 2.8). The only other diff is the `beneficiaries` object reformatted to one country per line, same keys and values.
Mechanical: lint 0 high / 0 medium / 1 low (spread, stated in the summary); invariants none; normalization-audit no violations for this model (0 violations anywhere; INV-14 clean); check.ts valid; simulation stable (5%-95%: 0.13-4.3x).
Checked: the result at the defaults is unchanged from round 5's stated figure (audit-model prints 8.331e-4); the three rows have no value or kind left, so no typed placeholder remains; careers_changed is 0, so careers_value is 0 and nothing moves; the explainers say what the rows now are ("the site's shared default (facts/meta.json)") and are right for a model with no careers changed; the shared defaults' values equal the replaced placeholders exactly.

No findings.

Verdict: pass
Model-sha: 3c9c946196fbd159d8bd179db8cfe43a130d4446ea687339aa0c4ab7ed92b746
