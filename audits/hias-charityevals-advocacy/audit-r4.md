# Audit: hias-charityevals-advocacy, round 4 (scoped)
Model-sha: f36e0f62b31b0b0c286e3295c86e50553237f3bb4b23ae570be4ac4dc8b12787
Scope: the reworded explainer of the read-only counterfactual_adj row.
Mechanical: audit-model 0 high / 0 medium / 1 low (spread, stated in the summary, unchanged); no files rewritten.

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| F1 | resolved | counterfactual_adj | The new wording ("Outcome-weighted average of the branches, for reading only") matches the formula (pend_refugees + pac_admitted x pac_counterfactual_adj) / (pend_refugees + pac_admitted); the pending win counts 1 and the injunction's admissions carry pac_counterfactual_adj, as stated. No input changed. | none |

**PASS** (no high findings)

**Verdict: PASS**

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (15 Nov 2026): consumption surveys carried forward by 0.7 of real growth (the shared line-up rule); 0.306 → 0.308.
