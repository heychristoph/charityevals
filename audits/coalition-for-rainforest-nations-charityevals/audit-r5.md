# Audit r5: coalition-for-rainforest-nations-charityevals

Model-sha: bb2af9cec529982d93e4c36e23f87ef1e216c519786c59ac646027c0dbb2db5a

Scope: scoped verification of the changes since round 4 (passed with low notes).

- `git diff HEAD~1` on the model: two explainer strings only (`fin_mitigation_cost_per_tco2e`, `unmodelled_benefits_adj`); no values, ranges or formulas changed.
- Source check against cp2024.txt: 286 projects, 3.1 billion tonnes abated, USD 15.9 billion GCF funding, USD 61.5 billion portfolio including co-financing, 44% (USD 4.3 billion) mitigation in grant-equivalent terms, 54% mitigation in nominal terms. All match.
- Arithmetic: co-financing = 61.5 - 15.9 = $45.6bn; 0.54 x 0.25 x 45.6 = 6.16; 4.3 + 6.16 = 10.46 (about $10.5bn); / 3.1bn t = $3.37 (about $3.4). The $1.4 (4.3/3.1) is unchanged. Correct. The x3 haircut is now stated as judgment, giving $10 with the range unchanged.
- `unmodelled_benefits_adj` wording matches how the model applies it (share of outcome_total, either sign).
- `npx tsx scripts/audit-model.ts`: runs clean; 2 LOW findings, both unchanged from round 4 (unused hectares_protected; wide joint spread, already stated in the summary).

Findings: none new.

Verdict: pass
