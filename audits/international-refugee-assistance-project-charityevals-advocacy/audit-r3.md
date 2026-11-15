# Audit: international-refugee-assistance-project-charityevals-advocacy, round 3 (scoped to the round-2 changes)
Result: 2.317e-4 daly/$ = 0.232 years of healthy life per 1,000 dollars (combined range 0.027-2.03), unchanged from round 2 (explainer-only edits).
Model-sha: 46e1918b55b03a6c9cfd29c9441a35d11462127fce2d3db4a021c507899367ad
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
