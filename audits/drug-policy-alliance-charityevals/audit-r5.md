# Audit: drug-policy-alliance-charityevals, round 5 (verification)
Result: -4.185e-6 daly/$ native = -0.004185 years of healthy life per 1,000 dollars (combined range -0.0780 to -0.00022; simulation 5% to 95%: -0.030 to +0.0031, i.e. 7.17x to -0.74x the best guess). Verdict: pass.
Verdict: pass
Model-sha: 97eeeb4aca84298ed45f91750acdb5c48dc63497a430ea5795ff6df306a757c5
Scope: unchanged from round 4 and correct; only the change since round 4 was checked (`git diff HEAD~1 -- models`: the `can_traffic_deaths_per_million` explainer and its `high`, 16 to 17).
Mechanical: lint 0 high / 0 medium / 0 low (audit-model "Findings (0)"). Invariants: none (INV-15 ignored, per owner). simulation-check: stable ("5% 7.17, 50% 1, 95% -0.742 x best guess"); the plausible-range-crosses-zero warning is expected for a net-harm model (normalization 2.21). normalization-audit not re-run (no rule change; scope was verification only).

Previous round (audit-r4.md):
1. Aydelotte 2019 corrigendum not read, intervals missing (low): **resolved**. The explainer now gives the 95% intervals (-0.6 to 2.1 for +1.2; 0.4 to 3.7 for +1.8), so "not significant" and "significant" rest on numbers, and names the 2021 corrigendum (Accident Analysis and Prevention 151: 105757) as "not read here". The corrigendum is stated openly as unread, which is accepted: the intervals match the two independent secondary reports checked in round 4, and the best guess (5, set by the lasting and fading studies together) does not hinge on the 2019 coefficients' third digit.
2. Fading share counted for the years-counted slider (low): **accepted as is**, as round 4 advised; the default is right and the explainer is unchanged on this.
3. "11 and 16 per million" (low): **resolved**. 1.8 x 9,500 = 17.1, now "some 11 and 17", and the row's high is 17 (0 to 17), consistent with the text "5 per million a year (0 to 17)".

Checked the change itself: the only edits are the explainer text and `high` 16 to 17 on the same row. Units and arithmetic are right (1.2 x 9,500 = 11.4, 1.8 x 9,500 = 17.1 per million); the range stays an estimate range with best 5 inside it; the quote and source block are untouched. No other row, formula or write-up text changed. The result is unchanged at -0.004185 (the best guess does not read the range), and the summary's figures still match the live model (net harm about 0.004; about 0.03 lost to 0.003 gained at 5% to 95%; simulation 0.030 and 0.0031). Tornado for the row is now -0.0005 to -0.0130 at 0 and 17. The summary and write-up carry no comparison with other charities, a median, an average or peers. No new error introduced.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | can_traffic_deaths_per_million (explainer) | The 2021 corrigendum to Aydelotte 2019 is still unread (named as such in the text). The intervals are cited from secondary sources. | Explainer text; round 4 source check | Read the corrigendum when reachable; if it changed a coefficient, redo the conversion. No change needed now. | none expected |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| can_traffic_deaths_per_million (Aydelotte 2019 intervals) | doi 10.1016/j.aap.2019.105284 | verified by second source (round 4) | +1.2 (95% CI -0.6 to 2.1), +1.8 (0.4 to 3.7); matches the explainer. Corrigendum (151: 105757) not read, now disclosed |
| other rows | as in round 4 | unchanged | |

## Drivers
Unchanged from round 4: `can_user_ln_gain` (judgment, largest gain), `can_traffic_deaths_per_million` with `can_traffic_evidence_adj` (largest harm; range 0 to 17 gives -0.0005 to -0.0130), `can_cud_or_26plus` with `can_health_evidence_adj`, `m110_od_evidence`, and the attribution, missing-data and period-share judgments. Most improving: reading the corrigendum and a published consumer-surplus estimate for legal cannabis.

Verdict: pass (0 high, 0 medium, 1 low).
Model-sha: 97eeeb4aca84298ed45f91750acdb5c48dc63497a430ea5795ff6df306a757c5
Re-stamped (15 Nov 2026): side-effect tags (2.16, mechanical; headline unchanged)

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against b10cf49b.
