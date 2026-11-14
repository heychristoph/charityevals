# Audit: protect-democracy-charityevals, round 3
Result: 1.953e-5 daly/$ = 0.0195 years of healthy life per 1,000 dollars (combined range 0.00093–0.41); cause median 0.069 (×0.28). Verdict: pass.
Model-sha: 7f9cbf177500b3daf1efd6d032354d7e25b51a7d079e063f3dae8a05c72009ab
Scope: unchanged from round 2: Protect Democracy Project (501(c)(3)), calendar 2024, its one Form 990 programme ($28,277,727 of $34,368,875), in two branches (backsliding 93% of spending; proportional representation 7%, 18.5% of the result by a scratch run with ref_value set to 0). Protect Democracy United (501(c)(4)) correctly out of scope.
Mechanical: lint 0 high / 0 medium / 1 low (spread 16,417× on the model's own ranges, stated in the summary); invariants none; normalization-audit no violation for this model (no row mentions it; generated/ restored with git checkout); check.ts all models valid; simulation stable (5% 0.11×, 50% 1×, 95% 7.51× best guess).
Previous round:
- r2 #1 reversal: resolved. bs_reversal_rate (judgment 5%, 2%–10%, Nord et al. 2025) and bs_rate = $discount_rate + bs_reversal_rate are in both terms of bs_discounted_years; the wait stays at $discount_rate (bs_wait_discount). Arithmetic: shifted-ramp PV at r = 9%, N = 5, T = 25 is 1.67; × 1.04^-3 (0.889) = 1.48, and audit-model prints 1.486. I recomputed it independently. The tornado places it at 0.0139–0.0254 (11th).
- #2 risk cut: resolved. 4.5% (0.5%–20%), the geometric middle of about 1% (0.8%–1.3% from Boese et al.'s one in five) and 20%: sqrt(0.01 × 0.2) = 4.5%. The explainer now states the rule.
- #3 side effects: resolved. unmodelled_benefits_adj = ue_freedom_wellbeing + ue_backlash, applied to both branches through outcome_total; bs_slide_side_factor multiplies bs_uov. Backsliding then counts (1 + f + b + v + g), the reform branch (1 + f + b). Linear under the side-effects slider: with every ue_* scaled by s, bs_uov × (1 + s(f+b)) = base × (1 + s(f+b) + s(v+g)).
- #4 wait: resolved (3, range 2–5, reason stated). #5 people covered: resolved (230,000). #6 repeal fact explainer: resolved (names the shifted-ramp rule with r = discount + repeal); the family file is the builder's skill report. #8 philanthropy note and field_beyond_institutional wording: resolved (downward biases named). #9 FairVote: resolved (priced 2023 to 2024 with @cpi). #10 2026 study: resolved (cited in ue_freedom_wellbeing).
- #7 write-up: mostly resolved. The drivers list now follows the tornado minus the site's sliders; the reform-branch share is stale (new #2).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | bs_discounted_years (explainer) | The explainer says "at the defaults about 1.6 full-effect years". The row, which includes the wait, is 1.49 (1.67 before the wait). | audit-model canonical rows: wait_discount 0.8893, discounted_years 1.486 | Say "about 1.5 full-effect years". | none |
| 2 | low | presentation | writeups/protect-democracy-charityevals.md; summary | Both say the reform branch is "about a sixth of the result". With ref_value set to 0 the result falls 0.01953 → 0.01592, so the branch is 18.5%. | Scratch run of audit-model | Write "about a fifth" in the write-up and the summary. | none |
| 3 | low | presentation | writeups/protect-democracy-charityevals.md "What drives the result" | The list is by swing but not in order: the forecast (0.0109–0.0441) swings more than the next dollar (0.0089–0.0413), and people covered (0.0167–0.0473) more than the GDP gain (0.0069–0.0311). The new reversal hazard (0.0139–0.0254) is the one model-specific input not listed. | audit-model tornado | Reorder as risk cut, forecast, next dollar, people covered, GDP gain. No change needed to the content. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| bs_reversal_rate | doi 10.1080/13510347.2024.2448742 (Nord et al. 2025) | verified earlier (round 2: 52%, 73% last 30 years, 90% restore democracy) | not refetched; quote unchanged in the explainer |
| bs_field_risk_cut lower anchor | doi 10.1080/13510347.2021.1891413 (Boese et al. 2021) | verified (round 2: one in five avert breakdown; 36 of 59) | explainer now matches; 0.8%–1.3% arithmetic checked (a fifth × a fifth to a third × one year in five) |
| bs_discounted_years | computation | verified | 1.67 × 0.889 = 1.48 |
| bs_slide_side_factor | computation | verified | linear in the slider |
| facts/democracy.json electoral_reform_repeal_rate, us_democracy_philanthropy_per_year notes | facts file | verified | wording matches Field in Focus pp. 15–16 as checked in round 2 |
| ref_movement_resources_other | computation | verified | FairVote 2023 × @cpi.usa_2024 / @cpi.usa_2023, in the formula |
| program_expenses, total_expenses, @next_dollar | 990 | verified in round 2 | unchanged |

## Drivers
1. bs_field_risk_cut: judgment (0.5%–20%) with two quantitative anchors and a stated rule (swing 0.0054–0.074).
2. @democracy.us_democracy_loss_chance_2030: estimate from two verified thin markets (0.011–0.044).
3. @next_dollar.protect_democracy: estimate from the verified 990 (0.0089–0.041).
4. ref_people_covered: judgment anchored on Portland (0.017–0.047).
5. @democracy.democratization_gdp_gain: estimate, verified (0.0069–0.031). The sliders win years, missing-data discount, value of a DALY and discount rate also rank high.

What would most improve the model: an empirical estimate of what a field's litigation and election protection do to breakdown risk; a sourced per-charity next-dollar figure (deferred by owner decision).

Verdict: pass (0 high, 0 medium, 3 low).
