# Audit: center-for-global-development-charityevals, round 3 (scoped verification)
Result: 0.003333 uov/$ = 1.666 years of healthy life per 1,000 dollars (combined range 0.119–23.3); cause median 0.0642 (×26.0). Verdict: pass.
Model-sha: 8eb761466a42366e6bcbfe1b4f6d3e2c393868ccea3ca5cb8a0bc937dd57c28b
Scope: only the round-2 fixes, plus the merge of main. Programme scope unchanged.
Mechanical: audit-model lint clean, no invariant violation; check.ts valid. (Normalization-audit and simulation not rerun: no structure change.)
Previous round (r2):
1. Resolved. `a_value_per_year` multiplies deaths and income by (1 + supplements); (1.3065)(1.395) = 1.82, "about 80% more" is right; explainers and label updated; result 1.551 → 1.666 as predicted.
2. Partly resolved (finding 1). Range 10%–100% (best 40%) set, "a fifth" is right; the other ratios are slightly stale.
3. Resolved. Anchor (seven contributors, about 14% each) is in the explainer and the arithmetic holds.
4. Resolved. 18.5 bn (16–20) with "signed, before terminations"; Madagascar page fetched, quote verbatim; `c_mcc_budget` = 880.95 m × CPI ratio = US$1.197 bn a year, matching "about US$1.2 billion".
5. Resolved for (a): the Gavi evaluation page was fetched and the quote is verbatim. (b) The BCG PDF could not be text-extracted here; the quote was verified in round 2 and the citation is unchanged in substance.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | `other_work_share` | The explainer's ratios were not recomputed after the MCC budget moved to 2025 prices and the AMC's value rose. Now the banks' branch is 20.0% and MCC's 4.2% of the AMC's (20,435 and 4,290 against 101,923 uov a year), so MCC is "about a twenty-fifth", not "a thirtieth". The high end is (1 + 6 × 0.042) / 1.243 = 101%, not "about 96%". Best guess (1.5 × 0.20 + 5.5 × 0.042) / 1.243 = 43%, still "about 40%". | Computed with the engine from `a_outcome`, `b_outcome`, `c_outcome`. | Change "a thirtieth" to "a twenty-fifth" and "about 96%" to "about 100%". | none |
| 2 | low | presentation | `facts/next_dollar.json` (note only) | Main has since gained a `campaign_legal_center` row; this branch lacks it because main moved after the merge. Against the merge base the file only adds CGD's entry (73 rows vs 72; nothing lost). The CGD entry is intact. `git diff main` shows the swap until main is merged again. | Row ids compared against merge base 13ae589 and main. | Merge main again before the final merge; keep both entries. | none |

Summary and write-up state 1.7 years per 1,000 dollars (result 1.666), and "together about 80% more" is in the write-up. No new problem found.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `c_compact_years` | https://www.mcc.gov/where-we-work/program/madagascar-compact | verified | "In April 2005, the Millennium Challenge Corporation signed a four-year, $110 million compact" |
| `a_children_2009_2014` | https://www.gavi.org/our-impact/evaluation-studies/pneumococcal-amc-outcomes-and-impact-evaluation | verified | "49 million children have been fully immunised with 3 PCV doses between 2009 and 2014" |
| `a_ue_herd_immunity` | https://www.gavi.org/news/document-library/pneumococcal-amc-outcomes-and-impact-evaluation | not re-fetched in text | PDF opens (200) but text not extractable here; passage verified in round 2 |
