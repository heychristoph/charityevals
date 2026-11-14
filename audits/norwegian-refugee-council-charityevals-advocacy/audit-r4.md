# Audit: norwegian-refugee-council-charityevals-advocacy, round 4 (verification)
Result: 2.920e-5 uov/$ = 0.0146 years of healthy life per 1,000 dollars (combined range 0.00104-0.206); cause median 0.102 (x0.14). Verdict: pass.
Model-sha: 12289e2ea0888e02fdd02f2ae47fe00f95acd8423ecfa641610aaf87373ac0c5
Scope: only the mechanical changes since round 3 (git diff 7bcadf4..HEAD): the three career rows read shared defaults; the beneficiaries object re-indented (same 39 countries and shares).
Mechanical: lint 0 high / 0 medium / 1 low (spread, stated in the summary), invariants none, normalization-audit none (INV-14: 0 violations; generated/ restored).
Previous round: round 3 passed; its accepted peer-gap note (x0.14, other builders' audited models) is not touched by this round.

## What was checked
- Result at the defaults: audit-model prints 2.920e-5 uov/$ = 0.0146 years per $1,000, combined range 0.001035-0.206, identical to round 3.
- career_forgone_pay, career_years_stayed, career_counterfactual_share now read @meta.career_forgone_pay_default (15,000 [5,000-30,000]), @meta.career_years_stayed_default (5 [2-10]), @meta.career_counterfactual_share_default (0.3 [0.1-0.6]) in facts/meta.json: same values as the placeholders replaced, kind judgment, labelled as the site's default where a model has no career data, with source and explainer. careers_changed is 0, so nothing moves.
- The new explainers say the rows are unused and read the shared default; they match the formulas.
- beneficiaries: formatting only.

## Findings
none
