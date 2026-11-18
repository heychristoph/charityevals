# Audit: international-refugee-assistance-project-charityevals-advocacy, round 3 (scoped to the round-2 changes)
Result: 2.317e-4 daly/$ = 0.232 years of healthy life per 1,000 dollars (combined range 0.027-2.03), unchanged from round 2 (explainer-only edits).
Model-sha: e53108661b0cffaa144097a3c914fa50d9f93768d438f5f386ff0a6d80885dee
Rules: 0.2.1
Mechanical: `scripts/audit-model.ts` lint: one low (spread, 1685x of the model's own ranges, already stated in the summary); nothing new.

| Round-2 finding | Status | Check |
|---|---|---|
| 3 `siv_p_success` unsupported "revised plan June 2025" | settled | Clause removed; the explainer now rests on the 14 June 2020 order, the CRS R43725 pause, the late 2022 district ruling and the D.C. Circuit June 2024 decision, with IRAP's case page and the opinion named as sources. Value 0.2 (0.08-0.5) unchanged and still describes defence/revision only. |
| 2 `usrap_counterfactual_adj` unsourced figure | settled | Names UNHCR's yearly Projected Global Resettlement Needs and gives "well over a million" against 100,000-200,000 departures; this is a looser but safer statement than the earlier "about 2 million" (the 2025 report is around 2.5 million, 2024 about 2.8 million, so "well over a million" holds). Value 0.85 (0.7-1) still follows. |
| 1 `usrap_p_success` no dated source | settled | Cites the Presidential Determination on Refugee Admissions of 3 May 2021 (62,500 ceiling) and "the previous administration's 15,000 ceiling", a correct description. Judgment 8% (2%-20%) unchanged. |
| 4 spread | accepted | Low, stated in the summary. |

Formulas, units, discounting and Convention 5 untouched (text-only changes to three explainers); no new rows. No new issues.

Verdict: pass

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): Preflight cleanup: judgments' explainers name their reference class (or say plainly there is none); labels and unit labels say what the rows are; no value changed. Mechanical: headline unchanged, against migrate/data-model.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 480880ba.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 4 rows changed, against cc9a04dd.
