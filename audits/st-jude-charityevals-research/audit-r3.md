# Audit: st-jude-charityevals-research, round 3
Result: 2.251e-6 daly/$ = 0.002251 years of healthy life per 1,000 dollars (combined range 0.000189–0.0268); cause median 0.1085 (×0.021). Verdict: pass.
Model-sha: 0a989f7499e1160ea78786f828c23910b7308ae6985e456c5130e0ef78769f13
Rules: 0.3.8
Scope: scoped verification of commit a1555789 (the corrected quote in `nc_flu_deaths_over5_per_year`) and round 2's items. Scope of the model (own-funded research, FY2025) unchanged.
Mechanical: lint 0 high / 1 medium (`far-below`, explained in round 1's Drivers, unchanged) / 1 low (`spread`, the summary states it). Invariants: none. `scripts/check.ts st-jude-charityevals-research`: all models valid. normalization-audit and simulation-check not re-run (no structural change). generated/ untouched.
Previous round: R2-1 not applied, and the reason holds (below); R2-2 resolved.

## Round 2 items
| # | R2 sev | Status | Check |
|---|---|---|---|
| R2-1 | low | not applied, reason holds: withdrawn | Tested in a scratch copy: replacing `* dalys_from_uov / uov_bridged` with `/ $uov_per_daly` in `nc_disease_dalys_per_year` gives `[HIGH] INV-2b (nc_disease_dalys_per_year $uov_per_daly): row reads $uov_per_daly but the evaluator view doesn't pin it`. docs/normalization.md states "Rows that read a cross-cause rate are still forbidden (INV-2b)"; the only rows that may read `$uov_per_daly` are conversion rows (here `dalys_from_uov`, formula `uov_bridged / ($uov_per_daly)`). `dalys_from_uov / uov_bridged` is exactly 1/`$uov_per_daly` through that one bridge, so the site's rate still moves the row and there is no second conversion. The NaN case (`uov_bridged` 0) needs every credited death count to be 0, which no range reaches, and the row is read-only. Keep the row as it is. |
| R2-2 | low | resolved | `quote` now reads "145 000 (95% uncertainty interval [UI] 99 000–200 000) deaths among all ages in 2017", the abstract's wording. Low stays 75,000, as proposed. |

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Checks of the changed rows
- Result and range identical to round 2 (0.002251; combined 0.000189–0.0268). The care model's deleted rows (`hospital_total_expenses`, `research_expenses`) belong to the care model only; this model still defines and uses both (they appear among its path inputs), and nothing here references a deleted id.
- Tornado and drivers unchanged: `$missing_data_discount`, `@next_dollar.st_jude`, `ca_share_burden_addressable`, `$discount_rate`, `ca_p_success`.

## Sources checked
Quote for `nc_flu_deaths_over5_per_year` verified against the abstract wording confirmed in round 2 (PMC6302221). Nothing else changed.

## Drivers
Unchanged from round 2.
Re-stamped (15 Nov 2026): side-effect tag on unmodelled_benefits_adj (2.16, mechanical; headline unchanged)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 6e174700.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 3 rows changed, against cc9a04dd.

Re-stamped (17 Nov 2026), rule mobiliser-share-30: the summary's typed range replaced by placeholders rendered from the model (the mobiliser's share now defaults to 30%). Mechanical: headline 0.002251 → 0.0006754 (−70%), 20 rows changed, against 7c76c006.
