# Audit: hias-charityevals-advocacy, round 4 (scoped)
Model-sha: 040d475799bd997edfeec7329356e69be1274f3d5ed90b5382165f93210da614
Scope: the reworded explainer of the read-only counterfactual_adj row.
Mechanical: audit-model 0 high / 0 medium / 1 low (spread, stated in the summary, unchanged); no files rewritten.

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| F1 | resolved | counterfactual_adj | The new wording ("Outcome-weighted average of the branches, for reading only") matches the formula (pend_refugees + pac_admitted x pac_counterfactual_adj) / (pend_refugees + pac_admitted); the pending win counts 1 and the injunction's admissions carry pac_counterfactual_adj, as stated. No input changed. | none |

**PASS** (no high findings)

**Verdict: PASS**
