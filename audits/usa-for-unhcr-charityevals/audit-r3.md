# Audit: usa-for-unhcr-charityevals, round 3 (verification)

Result: 6.033e-5 daly/$ = 0.0603 years of healthy life per $1,000 (combined range 0.0136-0.268); cause median 0.0994 (×0.61). Verdict: pass (no high finding; one low).
Model-sha: 2e2a78d4c923e9de42d1696380a9467d2fc5b66d995d16c1f2a16b74f2d265c5

Scope: unchanged from rounds 1-2 (all three programmes of the 2025 Form 990, $63,325,785 as reported; $52.7M in cash once the donated goods leave). Only the five changes named for this round were checked.
Mechanical: lint no high or medium; invariants none; check.ts "all models valid"; normalization-audit no violation for this model (generated/ restored); simulation stable (5% 0.49x, median 1.00x, 95% 2.32x of the best guess).
Previous round: round-2 findings 1-4 all resolved (below).

## Round-2 findings

| R2 # | Status | Check |
|---|---|---|
| 1 `liv_years` INV-14 | resolved | Own label ("Years a refugee household's livelihood gain lasts"), a ranged judgment 1 / 2.5 / 5 with its anchors (Banerjee et al. 2015 gains three years on; cheaper training fades sooner; work restrictions). The normalization audit prints nothing for this model. |
| 2 `pro_doc_rights_share` | resolved | Re-anchored: about 8% newly registered (a few million new claims over about 40 million under UNHCR's care) × 50% in hosts whose law gives some right to work (Global Refugee Work Rights reports) × half the regularisation gain = 2% (0.5-8%). 0.08 × 0.5 × 0.5 = 0.02 checks. The "so documents do less than relief cash" clause is gone. Range kept. Residual in finding 1 (low). |
| 3 `unhcr_support_markup` | resolved | Formula `unhcr_exp_total / unhcr_exp_programme` = 3,821.9 / 2,766.8 = 1.381; `unhcr_exp_all` is no longer referenced by any row. Explainer (22% support, 5.6% management, "about 1.38") and write-up ("raised by 38%") match. |
| 4 "about 60% of" | resolved | Summary and write-up both say about 60%; audit-model prints ×0.607. |

## Change 5: donated goods leave the cost

Checked against the Form 990 XML (fetched):

- `gik_goods_granted` 10,626,878 is `<GrantAmt>` of programme 2 (programme 2's `<ExpenseAmt>` is 10,810,376, so `gik_cash_spend` = 183,498, "about $0.18M" as stated). Programme expenses 44,326,241 + 10,810,376 + 8,189,168 = 63,325,785 still reproduce.
- The goods split into the Schedule F non-cash lines 62,936 + 611,081 + 3,420,232 + 59,030 + 10,000 + 232,000 + 5,459,629 = 9,854,908 and the Schedule I clothes 628,085 + 143,884 = 771,969; together 10,626,877 (one dollar of rounding against the programme line).
- `gik_cash_spend` is read by `program_spend` and `gik_attribution_share` only; `gik_spend` is read by nothing else. `total_expenses` and `program_expenses` are the reported figures less the goods, so the overhead ratio is 84,914,433 / 52,698,907 = 1.611, matching "$1.61" in the summary, write-up and explainer. `cost_total` = 52.7M × 1.611 = $84.9M: the goods are in the cost nowhere (no row reads `gik_goods_granted` or the old `gik_spend` as a cost).
- The goods enter the outcome once: `gik_people` (goods × clothes share less the US part, over value per person), `gik_uov` and `gik_wellbys` (software and transport at `gik_services_vs_cash` of a UNHCR dollar) read `gik_goods_granted`; the US clothes stay a subset (`gik_us_goods` 771,969 of the 10.6M).
- `gik_attribution_share` = cash × overhead / (cash × overhead + goods at recipient value), with clothes at `gik_inkind_equivalence` and software and transport at `gik_services_vs_cash`. This is the Direct Relief shape (`attribution_share_shared` = cash × overhead / (cash × overhead + donated goods × `price_ratio_local`)); the denominator's goods value matches the value counted in `gik_uov`, so the credit and the outcome use the same recipient value. About 6% (0.183 × 1.611 = 0.296M over 0.296M + about 4.6M).
- It reaches the result through `gik_total_adj` and `attribution_share_shared` (outcome-weighted, reading only). `staff_cost_share` now divides by cash expenses, consistent with the cost basis. The charity file's `lines` still hold the as-reported 10,810,376 and sum to the 990 programme expenses; check.ts passes.
- The result moved 0.062 to 0.060 (the credit fell from 90% to 6% while the cost fell by $10.6M × 1.5 to 1.6), a move under 10%, so nothing to re-audit. Summary (0.060, $1.61, $10.6M) and write-up (0.060, $1.61, $10.6M, "about 6%", "a small part") match. Stale strings (1.51, 0.061 as the current result, $10.8M, "a seventh") are gone from the write-up and model; the 0.061 and 0.062 left in the check history are history.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary, `overhead_ratio` wording | "mostly because a third of each dollar pays for fundraising and management in the US": on the cash basis the overhead is (26.6M + 5.6M) / 84.9M = 38% of the cost (the old 34% was on the reported total). | Summary text; overhead_ratio 1.611 means 38% of each donated dollar goes to overhead. | Say "over a third" or "about 38%". | none |
| 2 | low | source | `pro_doc_rights_share` explainer | The anchors ("a few million new claims", "about 40 million", "about half of refugees live in hosts with a right to work") carry no figure with a year or a link; it is a judgment, so only a wording gap. | Explainer text. | Name the UNHCR Global Trends year (new individual asylum applications and the population under UNHCR's care) and link the work-rights report. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `gik_goods_granted`, `gik_spend`, `unhcr_grants`, `aw_spend` | Form 990 XML (202622319349300112) | verified | GrantAmt 10,626,878 and ExpenseAmt 10,810,376 (programme 2); 44,326,241 (programme 1); 8,189,168 (programme 3). |
| `gik_us_goods` and the Schedule F non-cash total | same | verified | Schedule I 628,085 + 143,884 (new clothes for refugees); Schedule F non-cash lines sum to 9,854,908. |
| `unhcr_exp_total`, `unhcr_exp_programme` | https://digitallibrary.un.org/record/4126985/files/A_81_5_Add.6-EN.pdf | verified in round 2 | 3,821.9 = 2,766.8 + 841.6 + 213.5; not changed this round. |

## Drivers
1. `$missing_data_discount` (shared slider).
2. `$uov_per_daly` (shared).
3. `pro_doc_rights_share` (judgment 2%, now anchored on a count; tornado 0.050-0.100).
4. `pro_doc_cost_per_person` (judgment $25 delivery cost).
5. `refugee_consumption_share` (judgment 45%, anchored on the American Red Cross model's 42%).
Most useful next: a UNHCR or World Bank figure on the cost of registration or documents per person, to replace the $25 judgment.
