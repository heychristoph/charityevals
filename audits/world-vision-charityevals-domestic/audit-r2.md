# Audit: world-vision-charityevals-domestic, round 2

Result: 5.540e-6 daly/$ = 0.00554 years of healthy life per $1,000 (combined range 0.00118–0.0260); global-health median 0.338 (×0.016). Verdict: pass (0 high)
Model-sha: ced33516754c9443ff27aa91b25585c6f49be140d179abdf7ddad60d3f99eb75

Scope: unchanged from round 1 (Form 990 Part III 4b domestic line, $230,992,460, fiscal 2025). Only the round-1 high and medium findings and the changes made for them were checked.

Mechanical: lint 0 high / 0 medium (one LOW far-below, with the summary's reason), invariants none, normalization-audit none for this model (INV-14 no longer flags it), check.ts all valid, simulation-check stable (5% 0.451, 50% 1, 95% 2.02 x best guess). generated/ restored to HEAD.

Previous round:
- 1 (high, goods understated): resolved. `@world_vision.domestic_gik_expense` = 205,975,000. KPMG note 16, PDF p. 29, reads "Domestic programs $ 205,975" (thousands). `goods_granted` reads it; write-up and summary say $206 million.
- 2 (high, INV-14): resolved. `unmodelled_benefits_adj` is a formula (+0.3%, +1%, -0.5% = +0.8%); the typed 5% is gone and the durability item is dropped.
- 3 (medium, consumption anchor): resolved. `poorest_fifth_per_person_share` uses the shared formula (0.669); the judged `recipients_vs_poorest_fifth` 0.67 (0.45-1.05) gives 0.448, with its anchor named.
- 4 (medium, one doubt in three rows): resolved. `evidence_adj` is 1 (0.9-1); `inkind_cash_equivalence` covers only choice and donor valuation; unused goods are only in `implementation_adj`.
- 5 (medium, counterfactual without reference class): resolved in substance. It is now split into other-charity, liquidation share and liquidation value share, each ranged and reasoned. No published split exists to source (see finding 2).
- 6, 7, 8 (low): resolved. The cash grants drop out, the write-up names both audit folders, and the $163M is gone.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | `summary` | The summary still says "a dollar does about 0.004 years of healthy life per $1,000". The live result after the fixes is 0.00554. A stale result in the summary is a medium. | audit-model: 0.005540. | Change to "about 0.006" (or drop the number, as the site shows it live). | None |
| 2 | low | sensitivity | `cf_other_charity_share`, `cf_liquidation_share`, `cf_liquidation_value_share` | They are judgments with reasoning but no numeric reference class. The builder found no Good360 or Optoro split. The three together move the result about 0.0039-0.0068 (cf_other_charity_share alone). | Tornado. | If a figure for the share of US excess inventory donated, liquidated or landfilled turns up, anchor the three on it; otherwise keep. | Within the existing range |
| 3 | low | presentation | `ue_school_share` explainer | "$3.2M of $206M" mixes note 16's all-sources received total for school and office supplies (3,218 across the international, domestic and donor-restricted columns) with the domestic goods used. The domestic-restricted column is $1.85M. The share is about 1% to 1.5%, and the item is a judged +0.3% (0 to +1%) either way. | KPMG note 16 table, PDF p. 28. | Say "about 1% to 1.5% of goods" and cite the table. | None |
| 4 | low | presentation | `goods_per_household`, `households_reached` explainers | The explainer says "about 900,000 households" but the figure is now 1.14 million ($206M / $180). | audit-model: households_reached 1.144e6. | Change to "about 1.1 million". | None |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `@world_vision.domestic_gik_expense` | https://app.fac.gov/dissemination/report/pdf/2025-09-GSAFAC-0000419272 | verified | The scratchpad text of the KPMG statements gives "GIK expense was utilized as follows ... Domestic programs $ 205,975" ($ thousands, PDF p. 29). The value, unit and year match. |
| `@united_states.ce_lowest_quintile_vs_all_2024`, `@household_size.*` | facts/ | shared facts, read | The formula is the site's per-person anchor, as the Red Cross and Habitat models compute it. |
| Note 16 product mix | same | verified | School and Office Supplies 969 / 1,852 / 397 = 3,218 (finding 3). |

## Drivers
1. `$missing_data_discount` (shared; thin is right).
2. `$uov_per_daly` (shared).
3. `recipients_vs_poorest_fifth`: judgment, anchored on the shared per-person figure, range 0.45-1.05.
4. `inkind_cash_equivalence`: judgment on choice and donor valuation, with the anchor named.
5. `cf_other_charity_share`: judgment, the most useful improvement if a disposition split can be sourced.

Peers: American Red Cross 0.0045, Salvation Army 0.0052, Habitat 0.0054; this model at 0.0055 is in line with them. The gap to the cause median is explained in the summary.
