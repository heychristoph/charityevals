# Audit: kids-in-need-of-defense-charityevals, round 2
Result: 1.354e-5 daly/$ = 0.0135 years of healthy life per 1,000 dollars (combined range 0.0016–0.118); cause median 0.0866 (x0.16). Verdict: **pass** (no high finding; one low residual, F3).
Model-sha: f6b19418441339c55672dce1203f6712bf03e874ad455d5834d68489f9e94f13
Rules: 0.3.3
Scope: scoped verification of round 1's F1-F8 and the changed rows only; scope of the model unchanged (2024, legal services plus regional columns with overhead, now including the other children served outside the US).
Mechanical: lint 0/0/0 (audit-model: Findings (0)), invariants none, simulation stable (5% 0.351, 95% 2.7 x best guess). normalization-audit not re-run (scoped round; no standard-step row changed).
Previous round: F1 resolved, F2 resolved, F3 partly resolved (source still unchecked, anchor argument improved; now low), F4 resolved, F5 resolved, F6 resolved, F7 resolved, F8 resolved.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| F3 (residual) | low | source | @kind.p_removed_without_status | The explainer now gives the lifetime argument, notes 2025 enforcement, and cross-checks against the IRC model's 50% (30-80%) for adults with children lower. That makes 30% (10-60%) a coherent judgment, but the MPI quote is still unverified (403; no archive copy) and no cohort anchor was added. | facts/kind.json; MPI press release | When the archive or the DHS Enforcement Lifecycle tables are reachable, add the archived URL or the cohort share. Not blocking: the range stays wide and the judgment is internally consistent with the IRC model. | Range 10-60% moves the result 0.0069-0.0235 |

## Round-1 findings checked
| # | Check | Result |
|---|---|---|
| F1 | children_served_global 13,000 (observed, p. 5 and p. 9 quote on 13,000 / 8,500 in the US); oth_people = 13,000 - 8,500 - psy_people (2,366) - cam_people (323) = 1,811; oth_wellbys_unadjusted = oth_people * psy_wellbys_per_person; evidence adj 0.3 (0.15-0.6), counterfactual linked to psy_counterfactual_adj, attribution 0.7 (0.4-0.9), missing-data step shared, total_adj includes implementation_adj and leverage_funging_adj like the other branches; oth_dalys_unadjusted has the same form as psy_ and is in all three outcome-weighted averages; wellbys_bridged includes the branch; ue_gender_migration 0.01 (0-0.03) as an added side effect; people_reached explainer, summary and write-up (line 20, line 47) updated. No double count: overlap with other branches is handled in the evidence adjustment. Effect on result is small (0.0132 to 0.0135). | resolved |
| F2 | case_years_vs_2024 is a ranged judgment 0.8 (0.67-0.86), explainer carries the 990 totals 2019-2024 and the windows; matches the ProPublica figures I verified in round 1. | resolved |
| F3 | see the residual row | partly resolved (low) |
| F4 | facts/united_states.json cites doi:10.1086/339611 with the abstract quote (6 percent by 1992), the 14-24% penalty and Pan (2010) in the explainer; 0.1 (0.04-0.25) kept as judgment. | resolved |
| F5 | pro_bono_rate 770 (700-850), anchored on 2023 report p. 11 ($118M / 158,000 hours = $747); checked against ar2023.txt in round 1. | resolved |
| F6 | value_per_death now brackets the whole mix before `* $life_value_multiplier`. | resolved |
| F7 | people_reached format is integer. | resolved |
| F8 | write-up says about 10% more consumption. | resolved |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| children_served_global, people_reached | KIND annual report 2024 (local text extract) | verified | 13,000 globally, 8,500 in the US, as in round 1 |
| pro_bono_rate | KIND FY23 impact report p. 11 (local text extract) | verified | $118,000,000, 158,000 hours |
| legal_status_ln_consumption_gain | doi:10.1086/339611 | verified in round 1 (abstract) | now cited correctly |

## Drivers
Unchanged from round 1: the shared missing-data discount, the value-per-DALY and discount sliders, p_removed_without_status (F3), other_counsel_share and the TRAC relief ratio.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against e247896f.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): wording: wrong prose placeholders restored to the typed text or pointed at the evaluator view, and typed results in the summary made placeholders or recomputed at the 30% mobiliser share (no value moves). Mechanical: headline unchanged, against bc9e3979.
