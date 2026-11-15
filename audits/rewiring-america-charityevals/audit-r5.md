# Audit: rewiring-america-charityevals, round 5
Result: 0.0278 years of healthy life per 1,000 dollars at the defaults (unchanged from round 4's 0.02783; 0.027771 with the shared years counted at the default 5). Verdict: pass.
Model-sha: 155a7fd1761222690ee809e4b24388c0ef7dc7d84bce0b58bd27ea6db9741836
Scope: scoped verification of the last commit's rows (the law's public-money inputs moved to shared facts `ira_home_*`, new row `credit_years_counted`, new `credit_uov`, reworded `ira_household_delivery_vs_law`, the summary and write-up lines on the peer models) and of round 4's two open lows. The rest of the model not re-opened.
Mechanical: audit-model 0 findings; check.ts rewiring-america-charityevals "all models valid" (the usual "about 90% of the uncertainty is judgment" warning and the 13 inputs without published range, as before); generated/ untouched (git status clean). normalization-audit not re-run (scoped round).
Previous round:
1. Round 4 low 2, `credit_uov` averaging the increment across years: resolved. The formula is now credit_increment_2023 × min(n, 1) + credit_increment_2024_2025_per_year × (pv_annuity_due(1, r, n) − min(n, 1)), n = credit_years_counted = min($win_years_counted, credit_years), times the per-dollar value and the wait to the first claims. Recomputed by hand (2023's increment in year 1, then 2024-2025's in each later year, discounted year by year, a fractional last year per the engine's pv_annuity_due: that fraction of the payment discounted at n years) at win_years_counted 1, 1.5, 2, 3 and 5: the ratio credit_uov / hand present value of dollars is the same constant 1.2051e-5 in all five (1: 45,795 uov on $3.8B; 1.5: 93,519 on $7.76B; 2: 143,134 on $11.88B; 3 and 5 (capped at 3): 236,728 on $19.64B). The slider's floor is 1 (a set 0.5 is clamped to 1); for under one year the formula gives credit_increment_2023 × n, matching the engine's rule (that fraction of the first payment, undiscounted). At the default the headline is 0.02777 (3 years: 0.02786).
2. Round 4 low 3, delivery explainer: resolved. It now says the rebates' tonnes come only from electric-to-electric upgrades and new homes after DOE's May 2026 guidance, and that the home provisions lost more of the law's delivered share (0.7, 0.35 to 1.1). ira_heat_pump_share_of_tonnes unchanged at 0.6 (as round 4 allowed).
3. Round 4 low 1 (write-up's "Biggest uncertainties" bullet still saying "10% to 50%"): not in this commit's scope; not re-checked.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| | | | | No findings in scope. | | | |

## Checks in scope
- Facts match the old values and sources exactly: ira_home_electrification_rebates_usd 4.5e9 (Canary Media, quote "$4.5 billion in direct rebates"); ira_home_efficiency_rebates_usd 4.3e9 (same page, "It allocates $4.3 billion to states"); ira_home_rebates_paid_share 0.3/0.55/0.8 and ira_home_rebates_years_until_paid 4/5.5/7 (Utility Dive, same title, URL and quote); ira_home_rebates_recipient_consumption_ratio 0.45/0.6/0.85 (judgment, no source, as before); ira_home_credits_increment_2023_usd 3.2e9/3.8e9/4.2e9 (Treasury jy2521, same note); ira_home_credits_increment_2024_2025_usd_per_year 6e9/8.4e9/11e9 (CRS IN12423, same quote and note); ira_home_credits_years 3 (observed, IRS FAQ, same page text); ira_home_credits_years_until_paid 1/1.5/2; ira_home_credits_recipient_consumption_ratio 1/1.3/1.8 (CRS, same quote). Kinds (observed/judgment) unchanged. Model rows are now plain `@climate.ira_home_*` reads with unchanged values; the headline did not move.
- The summary and write-up figures: 0.028 (matches the 0.0278 headline), $8.8B of rebates (4.5 + 4.3), 35% rebate share (rebate_attribution_share_shared 0.35), the tonnes' 1.4% (beneficiaries, as in round 4). "The climate peers' models count the same money at their shares of 0.5% and 1%": the Union of Concerned Scientists' model has ira_attribution_share 1% × ira_household_focus_adj 0.5 = 0.5%, the Environmental Defense Fund's 2% × 0.5 = 1%; the order (Union of Concerned Scientists', then Environmental Defense Fund's) in the write-up matches. The "How this model was checked" addition is accurate.
- credit_years_counted is a plain min of two existing rows and is only read by credit_uov.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| ira_home_* facts | Canary Media, Utility Dive, Treasury jy2521, CRS IN12423, IRS FAQ | unchanged from the model's earlier versions | the commit diff shows the same titles, URLs, quotes and notes moved verbatim; the pages were fetched and verified in rounds 3 and 4 (not re-fetched in this scoped round) |

## Drivers
Unchanged from round 4: `missing_data_discount` and `@climate.advocacy_share_of_policy_win`, `@next_dollar.rewiring_america`, `uov_per_daly`, `rebate_attribution_share_shared`, `rebate_paid_share` (now `@climate.ira_home_rebates_paid_share`, shared with the two peers), `rebate_recipient_consumption_ratio`. Most improving: DOE's or the states' paid-out figures for the home rebates (now moving three models at once) and IRS SOI tax-year 2024-2025 claims for 25C and 25D.

Verdict: pass

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
