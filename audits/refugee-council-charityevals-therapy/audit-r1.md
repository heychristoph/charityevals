# Audit: refugee-council-charityevals-therapy, round 1
Result: 3.674e-5 WELLBYs/$ = 0.002399 years of healthy life per $1,000 (combined range 0.00038-0.0150); cause median 0.081 (x0.030). Verdict: pass.
Verdict: pass
Model-sha: a4fb29f61f4364d728ba54c50fd1a81c5c3f02dd7fd2b0c29a14d29364b28711
Scope: Therapeutic Services, year to March 2025 (SOFA £1,742k incl. allocated support; matches charities/refugee-council.json `lines` therapy $2,224,534). The 303 clients are the report's count; MyView children added as a judgment (100). No programme missing.
Mechanical: lint 0 high / 0 medium / 1 low (far-below, summary gives the reason), invariants none, normalization-audit no violations, simulation stable (5% 0.30x, 95% 3.0x best guess).
Previous round: none.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | double-counting | `myview_clients` / `cost_total` | Reach adds up to 100 MyView children whose cost may sit in the Children's Services line (£4.1m, in the services model), not in the £1.74m Therapeutic Services line used for cost. Reach from one line, cost from another; if MyView is paid from Children's Services, those children's therapy is also in the services model's scope. The row's own explainer admits it "may be paid from Children's Services". | Accounts p. 8 describes MyView with no count and no line; p. 13's 303 covers Ukrainian groups, South Yorkshire child and family therapy and Lewisham. Tornado: 0 clients gives 0.0018 (-25%), 250 gives 0.0033 (+37%). | Settle which line carries MyView (ask the charity or use the cost gap: line cost ÷ a sourced cost per course). If Children's Services, set best to 0 (range 0-50) and leave MyView to the services model; keep the 0-250 range only if the Therapeutic line is confirmed to carry it. Say so in the explainer. | -25% if set to 0 |
| 2 | medium | double-counting | `evidence_adj` / `missing_data_adj` | The mix of therapies delivered (psychotherapy, art and music therapy, groups, not the trials' protocol-based CBT) is penalised twice: in `evidence_adj` external validity (0.75) and again by `missing_data_adj` (explainer: "the therapies delivered aren't the trials' protocols"). Convention 5: one question per adjustment. | Both explainers state it. Together the effect is cut to about 0.06 of the review's SD-years before the household step. | Keep the delivery-mix question in the shared missing-data step (thin because the effect is from other delivery) and reduce `evidence_adj`'s external part to population and setting only (about 0.85-0.9), re-anchoring the best to about 0.52 (0.3-0.75); or keep both and state in the `evidence_adj` explainer that its external part excludes delivery mix. | up to +15-20% |
| 3 | medium | structure | `counterfactual_adj` | Template convention: 1 when the effect is a trial's against its control arm (care as usual netted out); below 1 only for treatment these clients would get and the controls did not, with a reference class. Here 0.8 (0.6-0.95) rests on "some clients would have reached NHS Talking Therapies" with no figure, while the trials' controls were waitlist (13 studies) or treatment as usual (11) per Turrini. No anchor. | Turrini methods; explainer has no access rate. | Source the share of refugees and people seeking asylum who reach NHS Talking Therapies or specialist trauma care (NHS Talking Therapies data by ethnicity/refugee status, or the Refugee Council's referral outcomes), compare with the trials' TAU arms, and set `counterfactual_adj` = 1 minus the excess access; if no figure is found, set best 0.9 (0.7-1) and name the anchor in the explainer. | +12% at 0.9, +25% at 1 |
| 4 | low | presentation | `cost_per_person` explainer | Context line says "about $5,500 a person"; the row computes about $6,400 (cost_total $2.58m ÷ 403) and the summary says $6,400. | Row formula and summary. | Change the explainer to "about $6,400 a person" (check WWP's figure against its model). | none |
| 5 | low | source | `depression_suicide_rr` | The SMR of about 20 (Harris and Barraclough 1997) is cited by name with no URL, page or quote; the range 2-15 and best 5 rest on a mid-point judgment. | explainer only. | Add the paper's source with page and quote, and name the anchor (WWP's value) for the best. | <3% (suicides are about 3% of the WELLBYs) |
| 6 | low | source | `suicide_rate` | England and Wales general-population rate used for refugees; the Scandinavian refugee finding is in the explainer with no citation. | explainer. | Add the study as a `resources` entry or a source on the explainer. | <3% |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| therapy_spend_gbp | Charity Commission accounts, p. 34 SOFA (extract) | verified | "Therapeutic Services 678 1,064 - 1,742", year to 31 Mar 2025 (prior year 2,034) |
| total_expenses_gbp | same | verified | 19,632 |
| program_expenses_gbp | same | verified | Total Charitable Activities 16,933 |
| staff_costs_gbp | same, note 6a | verified | Total staff costs 13,360, total 19,632 |
| adults_reported | same, p. 13 | verified | "provide therapeutic support to 303 refugees" |
| initial_effect_sd | Turrini 2019 (extract) | verified | depression SMD -1.02, CI -1.52 to -0.51, 12 studies, 844 participants, I2 89% |
| effect_duration_years | Turrini abstract | verified (qualitative) | "maintained at 1 month or longer follow-up"; depression follow-up SMD -1.28 (8 studies) |
| evidence_adj | Turrini results | verified | PTSD 0.71 to 0.33 after removing five outlier studies; applying that to depression is the builder's judgment, stated |
| NHS London £340k | accounts note 5a | verified | in the extract |
| suicide_rate | ONS 2023 bulletin | not re-fetched | 11.4 per 100,000 (6,069 suicides) matches my recollection of the bulletin; low weight (suicides ~3% of the result) |

## Drivers
1. `missing_data_discount` (shared judgment): 0.00048-0.0048 over its range; the branch is thin, the explainer says why.
2. `daly_per_wellby` (shared judgment): 0.0019-0.0099.
3. `effect_duration_years` (judgment 1.5 years, 0.75-3): evidence is only a 1-month-plus follow-up; a long-follow-up trial of trauma therapy in refugees would improve it most.
4. `initial_effect_sd` (sourced, wide; I2 89%): a prediction interval would improve the range.
5. `evidence_adj` (judgment 0.45): anchored on WWP and the PTSD outlier analysis; see finding 2 on overlap with the missing-data step.

Plausibility: x0.030 of the median but the same order as the other charityevals wellbeing models (WWP 0.0016, Make-a-Wish 0.0013); cost per person of about $6,400, a 1.5-year fade and the 0.12 total adjustment explain it, and the summary says so. Structure follows the wellbeing template (all required rows and shared reads present, deaths through `wellbys_from_uov`, side effect tagged, household step on the shared spillover). No high findings.
