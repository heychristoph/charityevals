# Audit: international-refugee-assistance-project-charityevals, round 2
Result: 7.069e-5 daly/$ = 0.0707 years of healthy life per 1,000 dollars (combined range 0.0086-0.578); cause median 0.138 (x0.51).
Model-sha: 45c8bc74a8efe37b520b0b4355ef1060d986e03052140410d40c5581164f90b2
Mechanical: audit-model lint clean; check.ts valid; simulation stable (5%-95% at 0.31-3.14x best guess); normalization-audit 0 of 27 invariants failing (the round-1 INV-4 false positive is gone).

## Round 1 findings
1 (high, INV-4): settled (label changed, normalization-audit clean, allowlist untouched).
2 share_reaching_safety: settled (gross yearly flow, 0.10, 0.04-0.27, anchored on 4% and 27%; no "because of" wording).
3 counterfactual_adj: mostly settled; the speed-up term is in but is undiscounted (new finding A).
4 ue_legal_information: settled (formula from info_extra_moves; 10 moves is about 4%).
5 client mix: settled for consumption (wh_client_share, Honduras blend, shared fact now outside the Americas); `beneficiaries` not moved to the same split (new finding B).
6 pro bono: settled (judged $55, 36-90, anchored on the BLS lawyer wage and the volunteer hour).
7 green cards / Pacito: settled (explainers).
8 Berlin grants: settled.
9 systemic-advocacy cost share: accepted as not moved (a few percent, reason stated in other_spend).
10 deaths discounting: settled.
11 total_adj: settled (outcome_total as in the template).
12 age split / Sudan anchor: settled by explainers (family-composition anchor, Sudanese clients in Jordan); values unchanged.

## New findings
| # | Severity | Category | Row | Finding | Fix | Effect |
|---|---|---|---|---|---|---|
| A | medium | normalization | `counterfactual_adj` | The years brought forward are an undiscounted ratio `years_sooner / @irap.years_gain_lasts`. Every wait is discounted at `$discount_rate` and the slider should move this row. The explainer calls the result "a slight overstatement"; it is an understatement, because the earliest years of the gain are worth most (discounted at 3%, 1.5 years of about 27 is roughly 10%, not 5%). | `cf_never_share + (1 - cf_never_share) * pv_annuity_due(1, $discount_rate, years_sooner) / pv_annuity_due(1, $discount_rate, @irap.years_gain_lasts)`; fix the explainer. | about +7% |
| B | medium | normalization | `beneficiaries` | `wh_client_share` is 40% but HND+GTM+SLV carry 20% of the weights (the other 10% USA is asylum cases). Lives-near-and-far weights then disagree with the consumption blend (Convention 7). | Set HND 0.16, GTM 0.14, SLV 0.10 and reduce JOR, LBN, AFG, KEN, PAK proportionally to sum to 1 (in the model and in scripts/beneficiary-countries.ts). | small, only with `$home_country` |
| C | low | structure | `counterfactual_adj` label | Label still reads "Share of the moves that wouldn't have happened without IRAP's casework" although it now includes moves brought forward. | Relabel "Share of the moves' value that IRAP's casework adds (moves that wouldn't have happened, plus years brought forward)". | none |
| D | low | double-counting | `ue_legal_information` | Divides by `counterfactual_adj`, which now includes speed-up credit, while `info_extra_moves` ("who otherwise wouldn't") counts only never-happening moves; the share is therefore a little low. | Divide by `people_reached * share_reaching_safety * cf_never_share`, or state that extra moves count as brought-forward-equivalents. | under 1% |

Convention 5 and side-effect tags checked: `ue_legal_information` and `ue_other_legal_benefits` tagged `side_effect: added`; adjustments each answer one question; deaths discounted over `years_exposed`; age and mortality rows are explainer-anchored judgments. wh_client_share, years_sooner, info_extra_moves and pro_bono_hour_value are ranged judgments with anchors. No sources newly added needed fetching (the new inputs are judgments; BLS $73 lawyer median matches the 2024 figure).

Verdict: pass (no high findings; two medium, two low).
