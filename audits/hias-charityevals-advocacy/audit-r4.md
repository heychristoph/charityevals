# Audit: hias-charityevals-advocacy, round 4 (scoped)
Model-sha: 10bf30a3bd7c944da96afde8bbb1bf0d93dde8c260d36a6beb8bc0510b67799c
Rules: 0.3.13
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

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against a8d130f3.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 1 row changed, against cc9a04dd.

Re-stamped (17 Nov 2026), rule mobiliser-share-30: typed results in the model's text made placeholders or recomputed at the 30% mobiliser share, and wrong prose placeholders corrected; no row changes. Mechanical: headline 0.3078 → 0.09235 (−70%), 6 rows changed, against 7c76c006.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.
