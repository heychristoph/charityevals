# Audit: americares-charityevals-emergency, round 3 (verification of the rule 1/2/4 changes)
Result: 4.125e-5 daly/$ = 0.04125 years of healthy life per 1,000 dollars (combined range 0.00846–0.2011); cause median 0.1100 (×0.37). Verdict: pass.
Model-sha: 53bd998bdab4066ca852804afbff843e9dcd271ac040385835c8ba4a421fb050
Scope: verification only: ln_gain_usa/_lebanon/_ukraine/_myanmar, the split of the single adjustment branch into deaths-and-illness and goods, the reading-only averages, bridge/outcome labels, the summary and the write-up sentences on the emergency model. Programmes and year unchanged (emergency response, year to June 2025, 40.1M cash). Rule 3 (livelihood mortality step) does not apply: the model has no livelihood branch.
Mechanical: lint 0 findings (3 info/warn notes: range width, judgment share, 8 point inputs), invariants none, normalization-audit none (coordinator's run; not rerun), check.ts all valid, simulation-check stable (5% 0.384, 50% 1, 95% 2.33 x best guess).
Previous round: round 2 passed with no open findings; nothing carried over.

Stated before → after: 0.0367 → 0.0413. Verified: the pre-change model run from main gives 3.670e-5 (0.03670); the live model gives 4.125e-5 (0.04125). Correct.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | ln_gain_usa | The US stand-in applies the t × ln(1 + v ÷ (b·t)) form to goods, water and cash alike. Rule 1 keeps rich-country cash over the year, but the US value is mostly goods and water to low-income survivors, and the US gain is negligible either way. | v ≈ 19 dollars against a US baseline of about 5,000: x ≈ 0.004, so ln(1+x) is the same at t = 0.25 or 1. | None needed; leave as is. | none (< 0.1%) |

No other findings. Checked and correct:
- The four ln_gain rows: formula, explainer and units agree (value × cpi [× PPP] ÷ (baseline × years_exposed), times years_exposed). years_exposed is the same ranged judgment (0.25, 0.1-0.5, anchor American Red Cross relief) that drives the deaths, so ranges move both together. ln_gain_per_person weights them by w_*; explainer is accurate.
- Split: deaths_total_adj = deaths_evidence_adj × counterfactual × attribution × implementation × leverage × wait × missing-data; goods_total_adj is the same without the evidence step. deaths_evidence_adj keeps 0.8 (0.6-1) with reason, anchor and range. Attribution stays attribution_share_shared (0.60, computed from cash, donated goods at local prices and partners' resources); the rule allows this because the value counted includes donated goods. No part is unadjusted or adjusted twice: uov_bridged = deaths_uov_unadjusted × deaths_total_adj + goods_uov_unadjusted × goods_total_adj; dalys_direct (illness) × deaths_total_adj; outcome_total no longer multiplies by total_adj, only by (1 + unmodelled_benefits_adj). Reconciles with audit table: outcome_total 2122 / cost 5.144e7 = 4.125e-5.
- evidence_adj (0.953) and total_adj (0.127) are outcome-weighted averages with weights from the four *_dalys_unadjusted rows (deaths_part includes illness, goods_part the goods); they appear in no formula on the result's path (grep: no other row reads them). Labels say "for reading only". Deaths-and-illness share of unadjusted outcome is about 23%.
- Labels: "(before adjustments)" kept only on deaths_uov_unadjusted and goods_uov_unadjusted (true); removed from wellbys_bridged and dalys_direct; uov_bridged says "after each branch's adjustments".
- Summary: "about 0.04" matches 0.04125; it makes no claim about the evidence step. Write-up: the emergencies bullet ("over the months they cover ... goods take no evidence step, being valued at their cost") describes the changes correctly; headline figure 0.04 matches.

## Sources checked
None needed: no source or observed input changed.

## Drivers
Missing-data discount (shared), uov_per_daly (shared), counterfactual_adj (judgment, 0.3-0.8, OCHA funding anchor), em_goods_share (judgment, 0.15-0.5), affected_consumption_share (judgment). All judgments carry anchors; result remains 0.37 × the cause median, explained in the summary (US third, few deaths averted per person reached).

Verdict: pass
Model-sha: 53bd998bdab4066ca852804afbff843e9dcd271ac040385835c8ba4a421fb050

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
