# Audit: shelterbox-charityevals, round 4
Result: 2.150e-4 daly/$ = 0.2150 years of healthy life per 1,000 dollars (combined range 0.0479–0.9655); cause median 0.0898 (x2.39). Verdict: pass.
Model-sha: 71f938b14770270d903a2f8da8f27d1cf5fd2277273d736149dced77628c8079
Scope: verification round. Only the changes since round 3 (rule 1 non-durable goods, rule 2 evidence/valuation/attribution split, label fixes, write-up lines). Scope and sources unchanged.
Mechanical: audit-model no findings (the two warns, 3,000x spread and judgment share, as before), check.ts all models valid, simulation stable (5% 0.504, 50% 1, 95% 1.91 x best guess). normalization-audit not rerun (coordinator ran it).
Previous round: round 3 had one low note (summary "about 0.2"), still right at 0.2150.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | evidence_adj, total_adj | The reading-only averages weight by deaths-and-illness vs goods only; the emissions (negative, goods_total_adj) are not in the weights. No row reads them (grep: only each other's definitions; outcome_total uses the branch rows), so the result is unaffected. | Formulas at lines 763-775; outcome formula no longer references total_adj. | Optional: add the emissions' unadjusted DALYs to the goods weight, or leave as is; harmless. | none |
| 2 | low | units | durable-goods t (ln_gain_low/mid) | Rule 1 not applied to the non-durable goods: judged right. The model's explainers (tents, tarpaulins, household items about a year; ShelterBox's tent life-cycle study 12 months) support t = 1, and anything longer is already in the durable term. The cash part (some of the 65%) is spent faster, but cash buys durable items too and no cash share is modelled. With t = 0.5 for all cash it would lower the cash portion's gain about 10% at x = 0.3, a few percent on the result at most. | durable_value_share explainer; x_low about 0.3. | none needed; keep t = 1. | none |

Checks that passed: x_low and x_mid carry inkind_value_share (0.85, 0.65-1, judgment, with reason, anchor in surveys and in-kind vs cash studies and range); it multiplies the goods' value only, not the emissions. deaths_evidence_adj keeps 0.85 (0.65-1) for deaths and illness only, with the same value as before. attribution_share stays the computed own_resource_share x partner_resource_share for both parts. deaths_total_adj and goods_total_adj each include counterfactual, attribution, implementation, leverage and missing-data steps once; goods has no evidence step. uov_bridged = deaths x deaths_total_adj + goods x goods_total_adj; dalys_direct (illness) x deaths_total_adj; tco2e_bridged x goods_total_adj (emissions as far as the goods are the charity's doing: right, no evidence step on a harm); outcome_total no longer x total_adj, so no part is adjusted twice or left unadjusted. The unadjusted-weight rows use the same bridge as dalys_from_uov. Labels: "(before adjustments)" kept only on the *_unadjusted rows; wellbys_bridged, dalys_direct and tco2e_bridged labels are right. Tornado shows inkind_value_share moving the result 0.1685-0.2489. Summary says "about 0.2" (0.2150) and "46 dollars of goods a person" (before the 85% worth, as the write-up states). The write-up "worth 85% of that to the people who get it" and the evidence bullet (deaths and illness only) describe the model correctly. Before-after 0.2125 to 0.2150 (+1.2%) is the live figure: dropping goods' evidence (+) and valuing at 0.85 inside the log (small drop) and the emissions harm now without the evidence factor (-) nearly cancel; plausible and consistent.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| none new | | | Changes are structural; judgment anchors already cited in explainers |

## Drivers
Missing-data discount (shared judgment, 0.1-1), uov_per_daly, affected_consumption_share, counterfactual_adj, uov_per_ln_consumption, goods_share. The model would most improve with a sourced value for the share of grants reaching people as goods and the poorest households' consumption.

Verdict: pass
Model-sha: 71f938b14770270d903a2f8da8f27d1cf5fd2277273d736149dced77628c8079
