# Audit: jesuit-refugee-service-charityevals-advocacy, round 2 (scoped verification)
Result: 2.699e-5 uov/$ = 0.0135 years of healthy life per 1,000 dollars (combined range 0.00053–0.34). Verdict: **PASS** (no high findings; none open).
Model-sha: 343cb9f7794a2cc228b4e5a206eb7ce0c324d3fd6603df133363bb9c23764a5e
Scope: only the round 1 findings and the rows changed for them; no new source verification beyond the anchors recomputed below.
Mechanical: audit-model lint 0 high / 0 medium / 1 low (spread, already in the summary); check.ts all valid; scripts/beneficiary-countries.ts --check: 0 files would change.
Previous round: 1 resolved (evidence_adj = 1, reason in the explainer; the 0.8 tilt is gone). 2 resolved (attribution_share_shared 0.4%, 0.15–1.5%, anchored on the southern regions' $55.7m against $16.6bn = 0.34%, with the Europe and North America $27.4m stated as outside the appeals; the "a little larger than its budget" step to 0.4% is a stated judgment). 3 resolved (fund_gain_years removed; years_of_impact = min($win_years_counted, 1), years_until_effect = 0, each with its reason; discounted_years now about 1, matching NRC's funding branch, and the tornado no longer carries a years swing). 4 resolved (aid_value_per_dollar explainer says the live read is at a missing-data discount of 1 and the slider applies once; matches the engine). 5 resolved by reasoned exclusion: the career rows are left out and outcome_total's explainer gives the reason (kept, their typed placeholders would repeat across five models, INV-14); acceptable because the finding was low and the stated reason is specific. 6 resolved (the summary drops the global-health-median comparison and says 0.013, range 0.0005–0.34, matching the computed 0.01349 and 0.00053–0.342). 7 resolved (beneficiaries are the southern regions only, summing to 1.0, with beneficiaries_note giving the reason; the script check is clean).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | attribution_share_shared, summary | The anchor computes to 0.34% and the best guess is 0.4%; the explainer says "a little larger than its budget" but the summary says "0.4%, its southern regions' spending against the appeals' funding", which reads as the bare ratio. | 55.7 ÷ 16,600 = 0.336%. | Optional: say "about 0.4%" in the summary, or leave it (the range 0.15–1.5% covers both). | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| attribution anchor ($55.7m southern regions, $16.6bn appeals) | AR 2025 p. 33; ALNAP SOHS 2026 | verified in round 1 | $55.7m of $83.9m is on the p. 33 regional breakdown (checked in round 1); ALNAP $16.6bn checked in round 1; unchanged. |
| aid_counterfactual_vs_jrs anchor (about 0.84) | sister model, recomputed | verified | counterfactual_adj = 0.8435 after the sister's round (explainer's 1.19 = 1 ÷ 0.84 still holds). |
| aid_mix_vs_jrs anchor (education over 90% of value from 43% of spending; emergency aid about a quarter of the average) | sister model, recomputed | verified | Education 91.7% of unadjusted value from 42.9% of spending; emergency 3.2% of value from 12.6% of spending, so 0.25× the average. The sister's result moved 0.40 → 0.37; this model's result moved 0.0173 → 0.0135, as the three fixes (evidence ×1.25, share ×0.67, years ×1.02) and the sister's 0.925× predict. |

## Drivers
1. fund_aid_moved_share (judgment, 1%, 0.2–4%): 0.0027–0.054.
2. attribution_share_shared (judgment, 0.4%, 0.15–1.5%): 0.0051–0.051.
3. $missing_data_discount (shared slider): 0.0027–0.027.
4. fund_displaced_share (judgment, 60%, 30–90%): 0.024–0.0034.
5. aid_mix_vs_jrs (judgment, 0.6, 0.25–1.5): 0.0056–0.034.
No input range stems from an unsourced figure; what would most improve the model is still a sourced estimate of NGOs' collective effect on humanitarian budgets.
