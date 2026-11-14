# Audit: save-the-children-charityevals-advocacy, round 4 (verification)
Result: 8.514e-4 uov/$ = 0.4257 years of healthy life per 1,000 dollars (combined range 0.058-3.12); cause median 0.338 (x1.26). Verdict: pass.
Model-sha: 15ec426204ae970db3d30c380dcb99a08de9de124c947a6466ebe29f37778269
Scope: only the mechanical changes since round 3 (git diff 7bcadf4..HEAD): the three career rows read shared defaults; elrha_aid_vs_cash reads the shared fact @humanitarian.response_dollar_vs_cash; the beneficiaries object re-indented (same countries and shares).
Mechanical: lint 0 high / 0 medium / 1 low (spread, stated in the summary), invariants none, normalization-audit none (INV-14: 0 violations; generated/ restored).
Previous round: round 3's one medium (adv_average_spend_vs_year, the 2022-23 accounts) is untouched by this round and still stands; no high finding open.

## What was checked
- Result at the defaults: audit-model prints 8.514e-4 uov/$ = 0.4257 years per $1,000, identical to round 3 (0.43). The combined range prints 0.058-3.12 against round 3's rounded 0.06-3.1, so the lower Elrha bound has not moved it visibly.
- career_forgone_pay, career_years_stayed, career_counterfactual_share now read @meta.career_forgone_pay_default (15,000 [5,000-30,000]), @meta.career_years_stayed_default (5 [2-10]) and @meta.career_counterfactual_share_default (0.3 [0.1-0.6]) in facts/meta.json: same values as the typed placeholders, kind judgment, labelled "the site's default where a model has no career data", with source and explainer. careers_changed is 0, so nothing moves.
- facts/humanitarian.json response_dollar_vs_cash: 0.3 (0.15-1), format multiple, kind judgment, source note gives the anchor (Save the Children's emergencies about 0.2x, MSF's relief distributions about 0.4x) and the reasons for low and high; explainer says what reads it and how a model with a reason to differ adjusts.
- Row explainers match their formulas; elrha_value_per_dollar still reads elrha_aid_vs_cash; the write-up's "0.3 of cash" is still correct.
- Range change on elrha_aid_vs_cash (low 0.1 to 0.15): acceptable. The best guess is unchanged; the low end now matches the one figure every advocacy model uses; Elrha is under a tenth of the result, so the effect on the combined range is invisible at two figures.

## Findings
none
