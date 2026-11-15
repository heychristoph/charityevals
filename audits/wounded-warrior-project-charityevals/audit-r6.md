# Audit: wounded-warrior-project-charityevals, round 6 (verification)

Result: 6.425e-6 daly/$ = 0.006425 years of healthy life per 1,000 dollars (combined range 0.0007-0.057); cause median 0.0688 (x0.093). Verdict: **pass** (no high findings).
Model-sha: 95b7779078076227402000ec0019edf1873414336824de4ab339ef2518827d5e
Scope: only the owner change of 15 Nov 2026 (docs/normalization.md 2.14): `consumption_na` deleted, `taxpayer_ln_loss_per_dollar = mcpf / (us_payer_multiple * consumption_mean)`, summary reworded. Diff against main for this model; write-up checked for stale assumptions only.

Mechanical: audit-model 1 finding (medium, far-below; it asks the summary to compare with the median, which the owner rule now forbids, so not a model finding); no invariant violation except the retiring INV-15 note.

Changes checked:
- No row reads `consumption_na` or `@united_states.consumption_per_person_2024` any more (grep over the model and its mental-health sibling: none).
- Computed values: `consumption_mean` $33,584 (CE survey 2024 x CPI to 2025 dollars, same row the veterans use); `ben_baseline_consumption` $26,867 (0.8 x mean); `taxpayer_ln_loss_per_dollar` 2.552e-5 = 1.2 / (1.4 x 33,584), so the taxpayers' cost per dollar is 1.79x the old figure (58,517 x CPI / 33,584), as the owner described. Units: dollars per dollar over dollars, one dollar year (2025) on both sides.
- Consumers of the term: `ben_taxpayer_uov` (-7,508 UoV, negative, no double count; gross 9,979, net `ben_uov` 2,462) and `adv_ln_gain_per_person_year` (advocacy, same term, retirees' gain at the 0.8 base). Both on the survey scale with the veterans. Signs correct. The real income gap between payers and veterans stays only in `us_payer_multiple` (shared fact 1.4), not in the data-source gap.
- Summary figures: "about 0.006" matches 0.0064; "About four-fifths ... benefits service": 2,462 of about 3,120 UoV across branches = 79%; "$27,000 a person" matches $26,867. The peer/median comparison is gone.
- Write-up: headline spans are live (0.01 will render as 0.006); "over four-fifths" and "$27,000" still right (the first only just: 79%, see finding 2). Nothing there assumes national-accounts consumption.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary / lint `far-below` | The lint "far-below" (0.0064 is x0.093 of the median, under a tenth) fires and its fix asks for "far below the median because ..." in the summary, which the new owner rule forbids. | audit-model Findings (1). | Retire the far-below/INV-15 text-requirement with the rule; no change to this model. | none |
| 2 | low | presentation | write-up line 5 and 33 | "Over four-fifths of the second model" is 79%, a hair under; the model summary says "About four-fifths". | `ben_uov` 2,462 / branch sum about 3,120. | Say "about four-fifths" in the write-up (the caller is updating it). | none |

## Sources checked
No source changed. `ce_expenditure_per_person_2024`, `us_federal_payer_multiple` and `mcpf` are shared facts, read not retyped.

## Drivers
`us_payer_multiple` (now the top tornado swing, 1-2: 0.0002-0.011, a shared judgment), `ben_consumption_share`, `missing_data_discount`, `uov_per_daly`, `mcpf`. The payer multiple matters more than before because the survey base is lower than national accounts, so the benefits net is more sensitive to it; it is the site's shared fact and the right place for that judgment.

Verdict: pass
