# Audit: central-square-foundation-charityevals, round 3 (scoped to the round 2 fixes)
Result: 0.001704 uov/$ = 0.852 years of healthy life per 1,000 dollars (combined range 0.054–13.4); cause median 0.0803 (×10.6). Verdict: pass (no high findings; 0 medium beyond the far-above judged in round 2, 1 low).
Model-sha: a16ddbb89e4b6e9e1e599010f7614a5c5e7001ccf1d253d98ceaadbabd72129b
Scope: unchanged from round 2 (every programme, year to 31 March 2026). This round checks only the seven round 2 findings and the rows they changed.
Mechanical: lint 0 high / 1 medium (far-above, judged right in round 2; the fixes don't change its reason: the same chain, the level 0.905 → 0.852) / 0 low. Invariants: none violated. normalization-audit, check.ts and simulation-check were not rerun (scoped round; the changed rows are formulas and judgment rows only).
Previous round:
1. `nipun_utilisation` PM POSHAN figures: **resolved**. The explainer now anchors only on Samagra Shiksha's 54.9% of its 2025-26 budget estimate (the article's own figure), with the year's last weeks to come; 0.8 (0.55-1) kept.
2. `gov_years_per_student`: **resolved**. New row 3 (2-4) `judgment`, anchored on the Grades 6-9 and 5/8 coverage and the persistent level effect; `gov_downstream_value` = students ÷ years × value × `p_success` × `discounted_years`. Governance credit fell by a third (value 10,491).
3. NIPUN end wording: **resolved**. `nipun_central_inr` explainer, the `central_square_foundation` note in facts/next_dollar.json and the write-up (next-dollar bullet and uncertainty bullet) all use "set to be wound up this financial Year" (2025-26) with "unless extended".
4. `govt_share_primary`: **resolved**. The explainer reads 12.16 of 23.29 crore (52%), government schools not government-aided. Checked against the UDISE+ text: Primary-to-HS total 232,885,600; government 121,589,911; aided 24,761,526 (2024-25 column).
5. Typed attribution shares: **resolved**. `gov_attribution_share` and `hps_attribution_share` are formulas of the same form as the other branches; the new judgment rows (`gov_disclosure_share` 0.4, `gov_district_inr` ₹3 crore, `hps_pilot_share` 0.5, `hps_partners_inr` ₹2 crore) have ranges, and each explainer's figures match its range. At the defaults governance is 0.500 and the STEM pilot 0.446, matching the write-up's "about 50%" and "about 45%", and raising `gov_spend_share` or `hps_spend_share` now raises their own credit.
6. Write-up sources: **resolved**. Banerjee et al. is gone; the PAL brochure, the UDISE+ summary and the CGD blog (Rossiter et al., which is in facts/education.json) are listed with the URLs the rows use.
7. `ece_first_time_share`: **resolved**. 0.6 (0.4-0.8) `judgment`, multiplying `ece_state_inr` in `ece_attribution_share`; the early-childhood credit is 5.6%, as the write-up says ("about 6%").

Figures: the summary and write-up say 0.85, which matches the live headline (0.852). The write-up's branch split ("about half FLN, over a quarter adaptive learning") holds: about 55% and 27% at the defaults (governance now about 4%). The "How this model was checked" section is accurate: round 2 passed with one medium and six low findings, all fixed, and the result went 0.905 → 0.85. The sum of the fixes is roughly -6%, in line with the estimated effects (governance about -8% of its 13%, early childhood small).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | `gov_value_per_student_year`, `gov_gain_sd` | The labels still say "per student-year", though round 2's fix makes the gain a per-child level effect credited once (`gov_years_per_student` divides the students). `gov_gain_sd`'s label reads "Learning gain per student-year". | Row labels; `gov_downstream_value` explainer ("students ÷ the years each is covered"). | Relabel to "per child" ("School governance: value per child of disclosure"; "Learning gain per child from school report cards for parents") and say in the `gov_gain_sd` explainer that the gain is a one-time level effect. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `govt_share_primary` | UDISE+ 2024-25 summary (extraction) | verified | 12.16 crore government, 23.29 crore total Primary-HS, aided 2.48 crore |
| `nipun_central_inr`, `nipun_utilisation` | Careers360, 25 Mar 2026 | verified (as recorded in round 2) | "set to be wound up this financial Year"; 54.9% of the BE; the PM POSHAN figures are no longer used |

## Drivers
Unchanged from round 2: the discount rate, the missing-data slider, `uov_per_daly`, the next-dollar slider and persistence into adulthood. The changed rows (governance, early childhood, STEM) are all under 5% of the result each.
