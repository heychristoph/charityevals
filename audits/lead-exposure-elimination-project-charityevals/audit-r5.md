# Audit: lead-exposure-elimination-project-charityevals, round 5
Result: 0.0456 uov/$ = 22.8 years of healthy life per 1,000 dollars at mobiliser_share 100% (round 4: 15.2; the move is the intended 0.5 -> 0.75 on `attribution_share_shared`, 1.5x). Verdict: pass (no high or medium findings; two lows).
Model-sha: d97e17f44d3e72fc6e05c648468bc0018d5094d6ca22f1a381cc4596406d6784
Scope: credit step 5 (rule 2.24) only: `attribution_share_shared` 0.5 (0.25-0.8) -> 0.75 (0.5-0.9) and the class of `attribution_share`. No full re-audit.
Mechanical: preflight passes (only the generated/distributions.json staleness line, ignored by brief).

Checks
1. Denominator: the new explainer counts LEEP and the co-advocates (partner NGOs' own work: IPEN members, Pure Earth; the UNEP/WHO alliance). The bureaus' and ministries' staff and the manufacturers' chemists, the adopters, are out and named as under the mobiliser's share. No co-advocate from the old text was dropped. OK.
2. Factual claims: LEEP's 2025 review (fetched) confirms its role ("we used our paint study results to inform and advocate for government regulation"; free samples, testing and pigment guidance to manufacturers), $870,000 of grants to government agencies and NGO partners (in cost), and UNEP/WHO as the 90 ppm reference. It does not name IPEN, Pure Earth or the alliance as partners; the Nigeria page (quoted in `nga_credit_vs_others`) names SRADev and IPEN. See finding 1.
3. Value and range: a judgment with no arithmetic to be consistent with; three quarters (a half to nine tenths) is a defensible central guess for the campaigners' split when LEEP ran the studies and funded partners' work, and the other campaigners are named. The write-up line matches.
4. Class: one shared `attribution_share` with `"credit": "win"` = `attribution_share_shared * mobiliser_share`, used once in `total_adj`, which multiplies the regulation, market-switch and other-source branches. The other terms in `outcome_total` (`moved_value`, `careers_value`) carry `mobiliser_share` in their own rows and are not in `total_adj`: nothing taken twice or not at all. The branches' benefit is a win; no delivery-class branch exists (grants to partners and agencies are LEEP's own cost, `moved_value` is zero by its explainer).
5. Counterfactual: stays in `counterfactual_adj` (90%), `p_success`, `$win_years_counted` and `nga_credit_vs_others`; the share row does not repeat it. See finding 2 for one overlap.
6. Text: the summary quotes no share; no other explainer quotes 50% or the bureaus/chemists as contributors (grep). The write-up already reads "three quarters of the campaigners' credit (partner NGOs and UN agencies do the rest)"; no typed number is stale.

Previous round: round 4's one low (`lead_deaths_2023` quote wording) is outside this scope and unchanged.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `attribution_share_shared` | The row names IPEN members, Pure Earth and the UNEP/WHO alliance as co-advocates but carries no source for who campaigned alongside LEEP; the cited LEEP review names none of them. | https://leadelimination.org/news/2025-in-review-advancing-lead-elimination-at-scale (partners referred to only generally) | Add a `source` (LEEP's Nigeria page, which names SRADev and IPEN, or the alliance's own page) or say in the explainer that the list of co-advocates is our reading and no count of their work exists. | 0 |
| 2 | low | double-counting | `nga_credit_vs_others` / `attribution_share_shared` | Nigeria's half credit already discounts for SRADev's and IPEN's earlier campaign, and the shared share counts partner NGOs again; Nigeria's co-advocates are cut twice (explainer says "on top of the shared credit share"). Conservative, and Nigeria is about 18% of the result. | model rows 528-545 | Accept, or add to the `nga_credit_vs_others` explainer that the campaign by others is cut here and in the shared share, so the half is a slight under-count. | small, upward if removed |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| attribution_share_shared | https://leadelimination.org/news/2025-in-review-advancing-lead-elimination-at-scale | partly verified | LEEP's role and $870,000 grants confirmed; named co-advocates not on the page |
| nga_credit_vs_others | (model's cited LEEP Nigeria page) | not re-fetched | outside this scope; verified in rounds 1 and 2 |
