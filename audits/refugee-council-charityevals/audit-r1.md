# Audit: refugee-council-charityevals, round 1
Result: 0.002915 daly/$ = 0.002915 years of healthy life per 1,000 dollars (combined range 0.00058-0.0146); cause median 0.0810 (x0.036). Verdict: pass.
Verdict: pass
Model-sha: 98124d55560df41c8abda3951f083934edf7c656b93ff5d7c2ee5f8e908d96a1
Scope: the four service lines of the accounts (Resettlement £5,317k, Children's Services £4,115k, Integration £2,416k, Destitution £403k = £12,251k) of the year to March 2025; Therapeutic Services (£1,742k) and Advocacy (£2,940k) are the other two models. The six lines sum to the £16,933k charitable activities on SOFA p. 34, so nothing is left out; charities/refugee-council.json `spending` (£16,933k x 1.277 = $21,623,441) and `lines` (services $15,644,527 = £12,251k x 1.277) match.
Mechanical: lint 0 high / 0 medium / 1 low (far-below, the summary gives the reason), invariants none, normalization-audit none for this model (generated/ reverted), check.ts valid, simulation-check stable (5% 0.42, 95% 2.52 x best guess).
Previous round: none.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | sensitivity | `int_value_gbp` | The third-largest driver (£200, range 80-500; tornado 0.0019-0.0054) is a bare point judgment whose own explainer does not reach it: "many get one piece of advice; a few weeks of support for the minority whose claim the help changes" at £49.18 a week gives about £40-100 averaged over all 6,519 clients, while £200 is four weeks of asylum support for every client. No reference class (clients helped, share whose support or Universal Credit claim is changed, weeks). | Explainer text vs the value; the integration branch is about 74% of the result (my arithmetic: 6,519 clients x ~0.057 ln gain x 0.137 adjustments vs resettlement 1,728 x 0.110 x 0.091). | Split into ranged judgments, e.g. `int_share_support_changed` (share of the 6,519 whose asylum-support or UC claim the help brings forward or reinstates, anchored on the 3,927 asylum clients and 1,965 hotel contacts, p. 9) x `int_weeks_secured` x £49.18 (+ the HC2/dental value); set the product from it and recentre the range if it lands near £100. | Halving the value lowers the result by about 25-30%; leaving it unexplained leaves the largest model-specific driver without a reference class. |
| 2 | low | normalization | `recipients_consumption_share` | Resettled refugees are valued at 25% of the average while the same model values newly recognised refugees (the other ~60% of Refugee Services' clients, also on Universal Credit) at the shared 18%; the anchor is a US quintile fact copied from the IRC model, not a UK one. Two shares for the same kind of person breaks "one consistent way". | Row explainer; the shared `@united_kingdom.asylum_recipients_consumption_share` text already covers newly recognised refugees on Universal Credit. | Read the shared UK figure (18%) for resettled refugees too, or add one shared `@united_kingdom` figure for resettled refugees (anchor: UC £393 a month plus council-arranged housing) that every UK refugee model reads. | At 18%: resettlement +36%, the whole result about +9%. |
| 3 | low | presentation | `leverage_funging_adj` explainer | "88% of these lines' money is restricted" is wrong: restricted column p. 34 is Resettlement £5,317k, Children's £2,569k, Integration £1,336k, Destitution £86k = £9,308k of £12,251k = 76%; unrestricted £2,943k (24%). | SOFA p. 34 (unrestricted charitable total 6,112 = 1,546+1,080+2,491+678+317, so Resettlement is wholly restricted). | Replace "88%" with "76%"; the 0.9 judgment still stands. | none |
| 4 | low | presentation | `res_share_of_refugee_clients` explainer | "about £370 an integration or destitution client" is Integration alone (£2,416k / 6,519); with Destitution (£2,819k) as modelled it is about £430. | 4,320 x 0.6 + 3,927 = 6,519 clients. | Say "about £430". | none |
| 5 | low | presentation | `cost_per_person` explainer | "about $1,150 a person" is stale: cost_total $18.14m / 15,269 people = $1,188. | audit-model peer table (cost_total 1.814e7, people_reached 1.527e4). | Say "about $1,190", or drop the number. | none |
| 6 | low | presentation | `int_homeless_ln_gain` explainer | The text "t x ln(1 + v / (b x t))" does not match the formula `t * ln(1 + v_night x 365 / b)` (an annual-rate gain for t years), which is the right one. | Row formula vs explainer. | Reword to "t years at a roof worth v a year, on consumption b: t x ln(1 + v/b)". | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `res_spend_gbp` | Charity Commission accounts PDF (acc2025.txt, p. 34) | verified | "Resettlement 5,317 - 5,317"; restricted (unrestricted charitable lines sum to 6,112 without it). |
| `chd_spend_gbp` | same, p. 34 | verified | 1,546 / 2,569 / 4,115. |
| `int_spend_gbp`, `dst_spend_gbp` | same, p. 34 | verified | 2,416; 403. |
| `total_expenses_gbp`, `program_expenses_gbp` | same, p. 34 | verified | 19,632; 16,933; fundraising 2,699. |
| `refugee_clients` | same, p. 10 (also p. 6) | verified | "we worked with 4,320 adults and families across our Refugee Services". |
| `asylum_clients` | same, p. 9 (also p. 6) | verified | 3,927. |
| `chd_people` | same, p. 7 (also p. 6) | verified | 7,022; "Over 90% were under 18". |
| `staff_costs_gbp` | same, p. 41 note 6a | verified | 13,360; 68% of total expenditure. |
| Explainer facts (Leeds £4.1m, Home Office £2.2m, note 5a) | same | verified | Leeds 4,096+137; Home Office 2,220. |
| `age_dispute_children` anchor (406 of 1,300) | The National, 23 Jan 2024 | not re-fetched (time box) | Judgment with a sourced anchor; children's branch is a few % of the result. |
| UC £393.45, NLW £11.44, asylum support £49.18 | GOV.UK 2024/25 | consistent | Not re-fetched. |

## Drivers
1. `missing_data_discount` (shared judgment 0.5; 0.1-1 moves the result 0.0006-0.0058): every branch is thin (outcomes judged, no comparison group), so correctly applied.
2. `uov_per_daly` and `uov_per_ln_consumption` (shared): read, not retyped.
3. `int_value_gbp` (judgment, finding 1): the model-specific number that most needs a reference class.
4. `@united_kingdom.asylum_recipients_consumption_share` (shared 18%) and `recipients_consumption_share` (finding 2).
5. `int_evidence_adj`, `int_counterfactual_adj`, `res_counterfactual_adj`: ranged judgments with stated anchors.
Most improving: a decomposed build for `int_value_gbp`, and any published split of Refugee Services' 4,320 between resettlement and newly recognised refugees (`res_share_of_refugee_clients`, 25-60%).

Checks that found nothing: template chain intact (domestic-services; three branches, bridges, side effects at the shared weight); `estimate_basis` unit_cost with cost and reach from one year and one FX year, as the IRC and Salvation Army peers; no funding counterfactual subtracted; deaths by age band x `$life_value_multiplier` through UoV; multi-year effects discounted; the age-dispute counterfactual cancellation (`/ chd_counterfactual_adj` then x `chd_total_adj`) is correct; no double count with the therapy or advocacy models (spend excluded); side effects tagged and estimated; gap to peers (IRC resettlement 0.0085, Salvation Army 0.0052) explained in the summary, and cost per person ($1,190) is close to the IRC's ($1,400).
