# Audit: americares-charityevals, round 2 (verification)
Result: 2.964e-5 uov/$ = 0.0148 years of healthy life per 1,000 dollars (combined range 0.0026-0.0838); cause median 0.338 (x0.044). Verdict: pass (no high or medium finding).
Model-sha: e86d81c4ea858534f9ebea1da2f7a15df9515c809180de432adc63f490ec556b
Rules: 0.3.13
Scope: unchanged from round 1 (FY2025, Access to Medicine and Clinical Services and Community Health = 92,962k cash of the 133,068k programme total; Emergency is the separate model).
Mechanical: lint 0 high / 0 medium / 4 low (attribution_share diagnostic, unused hs_clinic_share, far-below, spread), invariants none, normalization-audit none (generated/ reverted).
Previous round:
- #1 hs_clinic_share listed as a biggest uncertainty: resolved (bullet replaced by the training-gain uncertainty; the row remains a reading-only context row, lint low).
- #2 age mixes not anchored: resolved. pap_share_15_49 = cvd_share_15_49_gbr / (cvd_share_15_49_gbr + cvd_share_50_69_gbr) = 0.0229 / (0.0229 + 0.1541) = 12.9%, matching the explainer's "about 13%". The don_share_under5, don_share_15_49_of_over15 and hs_share_under5 explainers cite figures that match facts/death_ages.json (malaria SSA under-5 63.2%, diarrhoea SSA under-5 55.0%, CVD world under-5 0.2%; adult diarrhoea 15-49 0.139 / (0.139 + 0.234) = 37%; adult HIV 0.630 / (0.630 + 0.295) = 68%; CVD world 15-49 7.0%). The ranges stay judgments, stated as such.
- #3 med_people / hs_people overlap: resolved by explanation ("medicine alone" read as excluding clinic patients; overlap bounded at under a tenth, about 3%).
- #4 proj_dalys / don_people overlap: resolved (accepted in the explainer, "at most a few percent").
- #5 Rowe 2018 URL: resolved (DOI 10.1016/S2214-109X(18)30398-X in the explainer).
- #6 AUDIT_ROUNDS placeholder: resolved (section filled; the text says round 1 passed and a verification round checked the fixes).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | hs_clinic_share | Still unused by the result (lint low); the explainer already calls it reading-only. | audit-model low "unused" | Delete the row or leave as context. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| program_expenses 133,068k | https://www.americares.org/wp-content/uploads/2025-Americares-Foundation-UG.pdf p. 7 | verified (round 1 fetched "Other program expenses 133,068"; same URL as the model's 12 other statement citations) | explainer arithmetic 1,878,619 - 1,745,551 = 133,068 holds; total_expenses = program_expenses + mgmt_general + fundraising = 170.7M, formula in place |
| death_ages shares | facts/death_ages.json | verified | all values quoted in the explainers match the fact file |

## Drivers
Unchanged from round 1: the training-gain per patient (judgment, Rowe 2018 reference class), the donated-medicine mortality effect and counterfactual share, the donated-goods credit share, the missing-data slider, and the age mixes (now anchored, effect under 15%). Most improving: a measured effect of donated medicine against stock-outs.

Verdict: pass. No high or medium finding; all six round-1 findings resolved.

Re-stamped: mechanical template-rule change (direct-health outcome_total: bridged DALYs inside the side-effect share, as the template now has it); result 0.01482 → 0.01517 healthy years per $1,000.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): Pre-audit cleanup (16 Nov 2026): shared figures read from facts at the same values (@myanmar.household_consumption_share_of_gdp, @survey_consumption.disaster_affected_share_of_survey_mean, @volunteering.disaster_volunteer_ls_gain_year); judgments' reference classes named from sources; volunteer-hours labels name the charity. Values unchanged. Mechanical: headline unchanged, against e247896f.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2b370f40.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
