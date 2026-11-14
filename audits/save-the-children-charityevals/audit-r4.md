# Audit: save-the-children-charityevals, round 4
Result: 2.199e-4 daly/$ = 0.22 years of healthy life per 1,000 dollars (combined range 0.043-1.12); cause median 0.0898 (x2.45). Verdict: pass.
Scope: unchanged (Save the Children UK 2025 programmes, GBP 209m of 233.6m). Verification round on the changes of 0.2070 to 0.2199: emergencies' months rule, emergencies' goods adjusted apart, livelihoods' mortality step, summary and write-up sentences.
Mechanical: lint 0 high / 0 medium / 1 low (spread), invariants none, normalization-audit none (coordinator ran it); check.ts passes ("all models valid"); simulation stable (5% 0.458, 50% 1, 95% 2.41 x best guess).
Previous round: round 3 passed with one low finding that needed no change; nothing outstanding.

Checked and correct:
- `ln_gain_per_person` = years_exposed x ln(1 + v x ppp / (b x years_exposed)) = 0.0469 (the old form gave about 0.048): v is spent over the covered months, b is annual consumption, so b x t is the consumption of those months. Matches rule 1 and its explainer.
- `emg_goods_total_adj` = counterfactual x goods attribution 0.95 (0.85-1, judgment, reason, anchor CARE/World Vision and range given) x implementation x funging x missing data = 0.262; no evidence step, no wait discount (as `emg_total_adj` has none). World Vision's relief_goods_total_adj has the same shape. `emg_uov` adjusts deaths by `emg_total_adj` and goods by `emg_goods_total_adj`; `dalys_direct` (illness) keeps `emg_total_adj`. Nothing unadjusted, nothing adjusted twice; the price-effect side effect sits inside the goods term.
- Reading-only rows: `emg_deaths_uov_unadjusted`, `emg_uov_unadjusted`, `emg_dalys_from_uov_unadjusted`, `emg_deaths_dalys_unadjusted` are pure bridges (no adjustments); `emg_dalys_unadjusted` = unadjusted deaths and goods plus illness; `emg_deaths_share_unadj` = 0.311 (deaths and illness); `evidence_adj` weights emergencies as share x emg_evidence_adj + (1 - share) x 1. None of them feeds the result (`total_adj`, `evidence_adj` are only read by the canonical display).
- `liv_uov` x (1 + 0.2 x $life_value_multiplier): identical to World Vision's livelihood_uov; `income_mortality_uov_ratio` has reason, anchor and range 0-0.5. `liv_dalys_unadjusted` = liv_dalys / liv_total_adj stays consistent with it. Recurring livelihoods gains rightly stay over their years.
- Labels: "before adjustments" appears only on the unadjusted bridge rows. Emergencies 14,092 (was 11.2k) and livelihoods 6,405 (was 5.34k) match; the factor 1.2 for livelihoods and about 1.4x on the goods part are what the formulas give.
- Summary and write-up: 0.22 matches the live 0.2199; "about twice the site's global-health median" matches (x2.45 of 0.0898); combined range 0.04-1.1 matches 0.043-1.12; write-up sentences on goods over the months at cost with no evidence step and on livelihoods' mortality step are right.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | The summary orders the branches "then emergencies, health and livelihoods", but livelihoods (6,405 healthy years, 9.4%) is now ahead of health (5,567, 8.2%). Education 32%, nutrition 29% and emergencies 21% still read as "a third, a third, then emergencies". | branch rows emg/hlt/nut/edu/liv_dalys | Write "then emergencies, livelihoods and health". | none |
| 2 | low | presentation | write-up, "How this model was checked" | Ends the history at "The result fell from 0.29 to 0.21" while the headline is now 0.22; the reader may wonder about the gap. | write-up line 29 | Add a clause: "A later pass applying the site's rules for goods used within months, goods at cost and livelihoods' mortality step moved it to 0.22." | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| (none) | - | - | No source or observed input changed; new rows are judgments anchored on CARE's/World Vision's relief goods and the cash-income ratio. |

## Drivers
Missing-data slider, value of a healthy year (uov_per_daly), discount rate, education cost per child and effect size (tornado unchanged). The goods' attribution (0.85-1) and the mortality ratio (0-0.5) are small movers. Best improvement: a published per-child cost for the GPE grants.

Verdict: pass
Model-sha: 7daded830025ce940d64e06d365f654d6c4d912a04a3ce2d3567ac1184be5b57
