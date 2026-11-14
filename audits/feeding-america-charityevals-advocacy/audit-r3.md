# Audit: feeding-america-charityevals-advocacy, round 3 (verification)
Result: 2.084e-4 uov/$ = 0.1042 years of healthy life per 1,000 dollars (combined range 0.0093-1.165); cause median 0.2528 (x0.41). Verdict: pass.
Model-sha: 77b6cf9bd4f476170da28270acf017850ed09f4282c3c8a15959aad4d999bffd
Scope: only the mechanical changes since round 2 (git diff 7bcadf4..HEAD): the three career rows read shared defaults; beneficiaries and file end re-formatted.
Mechanical: lint 0 high / 0 medium / 0 low, invariants none, normalization-audit none (INV-14: 0 violations; generated/ restored).
Previous round: round 2 passed; its two lows (counterfactual_adj and total_adj explainers) are not touched by this round.

## What was checked
- Result at the defaults: audit-model prints 2.084e-4 uov/$ = 0.1042 years per $1,000, combined range 0.009325-1.165, identical to round 2.
- career_forgone_pay, career_years_stayed, career_counterfactual_share now read @meta.career_forgone_pay_default (15,000 [5,000-30,000]), @meta.career_years_stayed_default (5 [2-10]), @meta.career_counterfactual_share_default (0.3 [0.1-0.6]) in facts/meta.json: same values as the placeholders replaced, kind judgment, labelled as the site's default where a model has no career data, with source and explainer. careers_changed is 0, so nothing moves.
- The new explainers say the rows are unused and read the shared default; they match the formulas.
- beneficiaries (USA 1) is only re-indented.

## Findings
none
