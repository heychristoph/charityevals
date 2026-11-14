# Audit: world-central-kitchen-charityevals, round 4
Result: 9.936e-5 daly/$ = 0.099 years of healthy life per 1,000 dollars (unchanged from round 3; combined range 0.022–0.448). Verdict: **pass**.
Model-sha: ec67249f4066b24199936cafa0eea81cfd552710c290c46fe0decf33e3a603c0
Scope: only the change 2cf6607..b22cf70 to the model file (explainer wording of gz_bread_meal_equiv; beneficiaries block moved after `cause`).
Mechanical: audit-model 0 findings; `beneficiary-countries.ts --check` 0 files would change; result identical to round 3 (9.936e-5).
Previous round: two lows, both resolved (below).

No findings.

## Previous round
- Finding 1 (beneficiaries block position): resolved. The block (values 0.7171, 0.1125, 0.0891, 0.0556, 0.0213, 0.0044, and the note) is byte-identical, now after `cause`; the check reports nothing to change.
- Finding 2 (bread explainer stated the 2025 share as known): resolved. It now reads "73 million loaves in Gaza between late 2023 and February 2026 ... Our judgment, as neither the 2025 share of the loaves nor a loaf's food against a meal's is published: perhaps half the loaves in 2025, at about half a meal's food each, so about 15 million meal-equivalents, from 5 to 30 million." Accurate against the source (73 million loaves since 2023, counted apart from the meals, flour in the food bill); the guesses are labelled as judgment; 15 M with range 5-30 M is unchanged.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| gz_bread_meal_equiv | https://wck.org/news/gaza-milestone/ | verified (round 3) | quote "73 million loaves of bread"; only the explainer wording changed, value and quote untouched |

## Diff check
The diff touches only the explainer string and the position of `beneficiaries` / `beneficiaries_note` (moved, content identical). No values, formulas, ranges or sources changed.
