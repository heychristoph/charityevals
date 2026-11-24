# Audit: hias-charityevals-international, round 4 (scoped)
Model-sha: aa5ec88b8a75efd8ce4ee64a5dbbf502d00ea1382226b22ab47fc8c8ad603cde
Rules: 0.3.13
Scope: rsc_people (now 200, range 50-600) and the write-up's RSC line.
Mechanical: audit-model 0 high / 0 medium / 0 low; no files rewritten.

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| F1 | low | rsc_people | Figures checked: Article Eighteen (?p=15233) says "Two hundred and seventy-eight Iranian Christians were resettled in the 2024 fiscal year" (verified). J. The Jewish News headline (Asaf Elia-Shalev, 6 March 2025) gives about 700 persecuted Iranian Jews kept out by the refugee ban (headline verified; body not read). Arithmetic: about 500 a year x 4/12 = about 167, rounded to 200; consistent with best 200 and range 50-600. The 700 is a stock left waiting, not an annual flow, and Article Eighteen does not mention Vienna; both are covered by the row's "judgment" label and "roughly 500" rounding. | Optional: say "about 700 Iranian Jews were waiting" (not "left waiting a year") to make clear it is a stock; no number change. |
| F2 | resolved | write-up | The RSC line ("about 200, our judgment") matches the row. | none |

Labelled judgment with sourced basis, range plausible, no double counting with the other rows. **PASS** (no high findings)

**Verdict: PASS**

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (15 Nov 2026): consumption surveys carried forward by 0.7 of real growth (the shared line-up rule); 0.0438 → 0.0441.

Re-stamped (16 Nov 2026): Typed refugee-relief figures now read shared facts (@humanitarian_response.*, @ukraine.war_affected_aid_recipients_consumption_share) at the same values; judgment explainers anchored on studies and published data (pre-audit gate cleanup). Mechanical: headline unchanged, against 03a5c049.

Re-stamped (16 Nov 2026): Preflight cleanup: a typed figure now read from its shared fact at the same value (@depression.suicide_rr_with_depression, @meta.fundraiser_side_effects_share, @irap.years_gain_lasts); labels and explainers reworded. Mechanical: headline unchanged, against 2b148c62.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against a8d130f3.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against d150f0b2.

Re-stamped (17 Nov 2026): wording: wrong prose placeholders restored to the typed text or pointed at the evaluator view, and typed results in the summary made placeholders or recomputed at the 30% mobiliser share (no value moves). Mechanical: headline unchanged, against bc9e3979.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
