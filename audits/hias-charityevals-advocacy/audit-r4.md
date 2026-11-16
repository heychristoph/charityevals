# Audit: hias-charityevals-advocacy, round 4 (scoped)
Model-sha: ea162618df6b55380da8d291b203119183f49b5bbb8ce1c312f4736451b87fe3
Scope: the reworded explainer of the read-only counterfactual_adj row.
Mechanical: audit-model 0 high / 0 medium / 1 low (spread, stated in the summary, unchanged); no files rewritten.

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| F1 | resolved | counterfactual_adj | The new wording ("Outcome-weighted average of the branches, for reading only") matches the formula (pend_refugees + pac_admitted x pac_counterfactual_adj) / (pend_refugees + pac_admitted); the pending win counts 1 and the injunction's admissions carry pac_counterfactual_adj, as stated. No input changed. | none |

**PASS** (no high findings)

**Verdict: PASS**

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (15 Nov 2026): consumption surveys carried forward by 0.7 of real growth (the shared line-up rule); 0.306 → 0.308.

Re-stamped (16 Nov 2026): Preflight cleanup: a typed figure now read from its shared fact at the same value (@depression.suicide_rr_with_depression, @meta.fundraiser_side_effects_share, @irap.years_gain_lasts); labels and explainers reworded. Mechanical: headline unchanged, against 03a5c049.
