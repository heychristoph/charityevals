# Audit: doctors-without-borders-charityevals-advocacy, round 3 (verification)
Result: 1.304e-4 uov/$ = 0.0652 years of healthy life per 1,000 dollars (combined range 0.0069–0.614; cause median 0.1042, ×0.63), as in round 2. Verdict: pass.
Model-sha: a6bfa318cc36bd096c3d5226d3775ac527f5a1496a6c9ad1b7e091b4329cc947
Scope: only the change since the latest audit (round 2, checked against the model file on main): the three career rows (career_forgone_pay, career_years_stayed, career_counterfactual_share) were typed placeholders (15,000 [5,000-30,000]; 5 [2-10]; 0.3 [0.1-0.6]) and now are formulas reading `@meta.career_forgone_pay_default`, `@meta.career_years_stayed_default`, `@meta.career_counterfactual_share_default` (facts/meta.json, same values, kind judgment, sourced to the template and normalization.md 2.8). The only other diff is the `beneficiaries` object reformatted to one country per line, same keys and values.
Mechanical: lint 0 high / 0 medium / 0 low; invariants none; normalization-audit no violations for this model (0 violations anywhere; INV-14 clean); check.ts valid; simulation stable (5%-95%: 0.25-3.7x). The model is on audits/grandfathered.json (built before receipts); it has an audits folder, so this round is written and its receipt can replace the grandfathering.
Checked: the result at the defaults is unchanged from round 2's stated figure (audit-model prints 1.304e-4); the three rows have no value or kind left, so no typed placeholder remains; careers_changed is 0, so careers_value is 0 and nothing moves; the explainers say what the rows now are ("the site's shared default (facts/meta.json)") and are right for a model with no careers changed; the shared defaults' values equal the replaced placeholders exactly.

No findings.

Verdict: pass
Model-sha: 60bc506dd437ccb4a02b22cdb487ab6618a3d61469de7d5e30b598b3fab809e3

Re-stamped (shared rule change, applied mechanically): the shared moved-money rows read each destination at its charity's figure on the rankings (#givewell:<charity>, src/engine/moved-money.ts); no money moved reaches this model's result, which is unchanged.
