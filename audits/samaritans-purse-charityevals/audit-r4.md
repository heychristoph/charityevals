# Audit: samaritans-purse-charityevals, round 4
Result: 4.715e-5 daly/$ = 0.0472 years of healthy life per 1,000 dollars (unchanged from round 3). Verdict: pass.
Model-sha: 802af25672bbeb150c223924f9a085bf1c95f481ba65f907a08c8f79eb011d1b
Scope: verification of the one uncommitted change since round 3 (`git diff HEAD`): the `occ_inkind_equivalence` explainer. Nothing else changed.
Mechanical: audit-model lint 0 findings; result identical to round 3. `generated/` unchanged; git status shows only the model file modified.

## Round-3 findings: status
| # | Round 3 | Status | Check |
|---|---|---|---|
| E | low, Wydick co-author misnamed, unverified "1,578 children" | fixed | Crossref (10.1093/wber/lhw042) lists Bruce Wydick, Elizabeth Katz, Flor Calvo, Felipe Gutierrez, Brendan Janet; the explainer now reads "Wydick, Katz, Calvo, Gutierrez and Janet 2018". The count "1,578 children" is removed. |

## New findings
None.

## Checks
- The diff touches only the explainer string: author name and the dropped count. No value, range, formula or unit changed.

Verdict: pass.
