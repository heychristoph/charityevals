# Audit: rewiring-america-charityevals, round 4
Result: 0.1149 tco2e/$ = 0.02783 years of healthy life per 1,000 dollars (combined range 0.00335–0.231); cause median 0.001926 (×14.45). Verdict: pass.
Model-sha: b5a40848df852ad74b4470a97a528d33bb9b1adf368a968187f8755513de7733
Scope: scoped verification of round 3's seven findings and the rows they changed; scope as in round 3 (the 2024 Form 990's single programme line, all modelled), not re-opened.
Mechanical: lint 0 high / 0 medium / 0 low (audit-model: 0 findings), invariants none, check.ts all models valid, simulation stable (5% / 50% / 95% at 0.186 / 1 / 4.89 × the best guess). normalization-audit not re-run (scoped round). generated/ unchanged.
Previous round:
1. Credits' increment, split shares: resolved. credit_increment_2023 3.8e9 (3.2–4.2) is 25D's 8/30 of $6.3B plus all of 25C's $2.1B = 3.78e9 (round 3's 3.4e9 was an arithmetic slip; 3.8 is right). credit_increment_2024_2025_per_year 8.4e9 (6–11e9) cites CRS IN12423 (fetched: RCEC "scheduled to expire at the end of 2023", the home-improvement credit at the end of 2021, $6.3B in tax year 2023). rebate_attribution_share_shared 0.35 (0.15–0.6) and credit_attribution_share_shared 0.1 (0.03–0.25) are used in ira_transfer_uov_per_year; ira_attribution_share_shared is now rebate_tonnes_share (0.17, 0.1–0.3) × the rebates' share + the rest × the credits' share = 14.25%, and its explainer's "2% × about 14%, 0.3%" checks. 25C explainer fixed.
2. Rebates' delivery: resolved. rebate_paid_share 0.55 (0.3–0.8), rebate_years_until_paid 5.5 (4–7), ira_household_delivery_vs_law 0.7 (0.35–1.1), all citing Utility Dive (fetched: 29 May 2026 guidance, published 2 June 2026, "ending the ability for households to qualify for rebates when replacing fossil fuel-fired appliances"). Write-up's "How the model works" and "Who gets the money" updated.
3. Credits counting the shared years: resolved. credit_uov uses pv_annuity_due(1, $discount_rate, min($win_years_counted, credit_years)) and the wait to the first claims (credit_years_until_paid 1.5, 1–2). At the default (5 years, capped at 3) the annuity is 2.886; independent recomputation gives about 239,000 uov, consistent with the 0.0278 result. The rebates stay counted once with the Habitat precedent stated.
4. credit_recipient_consumption_ratio source: resolved. Now CRS IN12423 (fetched: incomes of $100,000 or more received 67% of RCEC benefits); the explainer says 25C's claimants are similar.
5. unmodelled_benefits_adj label and explainer: resolved ("as a share of the tonnes counted", with the sentence that the public money is the law's alone).
6. methane_share explainer: resolved (15%).
7. Summary and write-up typed figures: resolved. The summary and write-up say 0.028, "nearly all of the result", tonnes about 1.4% (matches the beneficiaries' 0.014 and the 98.6% USA share); the stale "97%", "fortieth", "fortyfold" are replaced or kept only as the round-2 history; round 3 added to "How this model was checked". Beneficiaries in the model and in scripts/beneficiary-countries.ts are identical.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | write-up, "Biggest uncertainties" | The first bullet still says its share of the law "is our judgment, 10% to 50%", the old single share; the model now has 15–60% (rebates) and 3–25% (credits). | writeups/rewiring-america-charityevals.md, "How much of the law is its doing". | Write "35% of the advocacy behind the rebates (15% to 60%) and 10% behind the credits (3% to 25%)". | none |
| 2 | low | normalization | credit_uov | The formula takes the 2023-2025 average increment times the annuity, so at `$win_years_counted` of 1-2 it credits the average (6.9e9) rather than 2023's 3.8e9 (and 2023 plus one 2024 year). Round 3 asked for a by-year weighting. At the default 3 years it is exact. | Formula: (credit_increment_2023 + credit_increment_2024_2025_per_year * (credit_years - 1)) / credit_years * pv_annuity_due(...). | Replace the average with the sum over the counted years: credit_increment_2023 + credit_increment_2024_2025_per_year * (min($win_years_counted, credit_years) - 1) discounted by year, or accept this as a stated approximation in the explainer. | none at the defaults; slider at 1 year overstates the credits by about 1.8× |
| 3 | low | presentation | ira_household_delivery_vs_law | The explainer says the guidance ended rebates for replacing fossil equipment but not that the rebates' own tonnes now come from electric-resistance homes and new construction; ira_heat_pump_share_of_tonnes is unchanged at 0.6. | Row explainer; Utility Dive. | Add one sentence saying that is why the delivered share is 0.7; no change to the 0.6 unless the owner wants the households' net-gain tonnes reduced further. | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| rebate_paid_share, rebate_years_until_paid, ira_household_delivery_vs_law | https://www.utilitydive.com/news/doe-issues-guidance-gas-electric-appliance-rebate/821720/ | verified | 29 May 2026 guidance, published 2 June 2026; the quoted portion is there (the row's quote ends "with electric alternatives"; the fetch confirmed the sentence ends so) |
| credit_increment_2024_2025_per_year, credit_increment_2023 (prior law), credit_recipient_consumption_ratio | https://www.everycrsreport.com/reports/IN12423.html | verified | RCEC to expire end 2023, EEHIC end 2021, $6.3B in TY2023, 67% of benefits to incomes of $100,000 or more |
| credit_increment_2023 | home.treasury.gov jy2521 | verified in round 3 | unchanged source; 8/30 × 6.3 + 2.1 = 3.78 |

## Drivers
1. `missing_data_discount` and `@climate.advocacy_share_of_policy_win` (shared judgments).
2. `@next_dollar.rewiring_america` (estimate 19–84%), `uov_per_daly`, `average_spend_vs_year` (judgment).
3. `rebate_attribution_share_shared` (judgment 15–60%, now the biggest own judgment), `rebate_paid_share`, `rebate_recipient_consumption_ratio`.
Most improving: DOE's or the states' paid-out figures for HEEHR and HOMES, and IRS SOI tax-year 2024-2025 claims for 25C and 25D. The owner's survey-versus-national-accounts scale question for payers (round 3 note) still moves this result more than any input.
