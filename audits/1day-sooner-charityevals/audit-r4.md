# Audit: 1day-sooner-charityevals, round 4 (scoped verification: credit step 5, rule 2.24)
Result: 5.46 daly/$ = 5.464 years of healthy life per 1,000 dollars (combined range 0.26–113). Verdict: pass.
Model-sha: 557086332719910fd4c66f08cba7a351efd749345b56b8dc21b4edb8964a56cc
Scope: only `hcv_attribution_share_shared`, `mal_attribution_share_shared` and the classes on the used shares (rule 2.24); no re-audit.
Preflight: pass (only the out-of-date distributions line, ignored).
Previous round: round 3 had no open high or medium.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | model `summary` | Says hepatitis C and malaria "add about 23%"; at the new share they are 25% (malaria 16%, hepatitis C 9%). | Branch contributions computed from w_b × adjustments × used share at s = 1: bio 67%, malaria 16%, hepatitis C 9%, California 7%. | Replace "add about 23%" with "add about 25%". (Not editable by this audit: model JSON.) | none |
| 2 | low | presentation | writeups/1day-sooner-charityevals.md | Branch-share table quoted the old shares (69/17/8/6). | Same computation. | Edited by this audit to 67/16/7/9. Typed sensitivities in "Biggest uncertainties" (60, 4.1, 1.4, 15, 3.3 to 25, 2.2 to 9.1, 4.5 to 8.8) were computed at 5.25 and are about 4% low; refresh with `npx tsx scripts/audit-model.ts` (tornado: discount 60.8 / 4.18; win years 1.58 / 15.6; next dollar 2.30 / 9.49; malaria children 4.75 / 9.03). | none |
| 3 | low | double-counting | `mal_counterfactual_adj` explainer | Says PATH's and Malaria No More's advocacy "could have absorbed" 1Day's part. These are also co-advocates in the share's denominator. Both cuts are legitimate (replaceability vs. pro rata), but the text should say so to avoid reading as a second share. | Rule 2.24: "would it have happened anyway" lives in the counterfactual row, the share only splits what was caused. | Append: "(replaceability of its part; its pro rata share of the effort is in mal_attribution_share_shared)". | none |

Checks on the changed rows
- **hcv_attribution_share_shared, 0.85 (0.6 to 1)**: denominator is 1Day plus others who pressed for faster design (unpaid participant-case contributors). The University Health Network study team (adopter, approves and runs the changes) is correctly outside, under `mobiliser_share`. No co-advocate named in the old text was dropped without reason (the old text's only other party was the UHN team). Source (1Day funding proposal, "Case Study: UHN Study Design Improvements"): "We successfully advocated for the modifications" and "Other study team members did not make substantial efforts to focus on speed in study design, so we believe our proposals ... were the main drivers" verified. The anchor is the charity's own account, a self-report; the explainer says so and the trust in the 1.5 years sits in `hcv_evidence_adj`. 0.85 with a range down to 0.6 is a defensible best guess given that account and no named co-pressers. Arithmetic consistent. Class `research` is right (adoption of research/design advice by a study team).
- **mal_attribution_share_shared, 5% (1% to 15%)**: unchanged value; explainer now excludes African governments' rollout work as the adopters'. Denominator lists PATH, RBM, Malaria No More, WHO, Gates partners: co-advocates and technical-support funders, correct. "marked more by frustration than success" verified in the proposal (2024 malaria narrative). $630,000 matches `mal_cost_share` (26% of spend). `mal_field_children_added` still names African health ministries among groups pushing for faster rollout, which is the field's total effect (numerator) and consistent with the share counting only 1Day's slice of advocacy. Class `win` is right (children vaccinated by governments and Gavi money). Gavi's displaced money is netted inside `mal_net_value_share`, before the share, so the mobilised cost takes s as rule 2.24 requires.
- **Classes**: bio, ai, nuclear, fb, hcv `research`; pol, mal `win`. Each used share is `<branch>_attribution_share_shared * mobiliser_share` and enters the pooled `attribution_share_shared` formula once. Headline at s = 1, 0.5, 0.25: 5.464, 2.732, 1.366 (exactly linear), so s is taken once, none twice, none missed. No branch reads delivery (none is own services: all are advocacy or advice).
- **Would it have happened anyway**: untouched; it stays in `hcv_carry_share` (stated), `mal_counterfactual_adj`, `mal_field_children_added`, `pol_counterfactual_adj`, `$win_years_counted`.
- **Headline move 5.25 to 5.46**: reproduced (hcv credit 0.5 to 0.85 on a 9% branch).

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| hcv_trial_years_saved / hcv_attribution_share_shared | https://docs.google.com/document/d/1tm5QXyFBd0uQrU9NiUlsJaeadyVY7c5cCk34sAe88KA (text export) | verified | "successfully advocated", 1.5 fewer years as of July 2024, other team members made no substantial effort on speed |
| mal_attribution_share_shared | same | verified | "more by frustration than success" |

## Drivers
Not re-assessed (scoped). For the changed rows: hcv share is a judgment anchored on 1Day's own account (sourced, self-reported); malaria share a judgment anchored on spending proportions (1Day $630k vs. far larger field budgets).
