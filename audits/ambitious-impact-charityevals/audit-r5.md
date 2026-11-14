# Audit: ambitious-impact-charityevals, round 5
Result: 0.02920 uov/$ = 14.6 years of healthy life per 1,000 dollars (combined range 1.4–155), unchanged from round 4. Scope: scoped verification of the diff against main (rows renamed to informed_money and the gh destination set; shared rule informed_money_value; INV-12 destination sets). Mechanical: audit-model 0 findings (no lint or invariant violations); check.ts all models valid; `moved-money.ts set gh global-health` matches the model's gh_moved_dollar_value, gh_prior_dollar_value and gh_moved_dollar_net_value word for word (gh_shifted_dollar_value and gh_informed_money_value are not in the model, which is allowed); no old id (gh_moved_money, gh_dollar_net_value, money_moved) remains in the model or in writeups/ambitious-impact-charityevals.md; no published or expected field names a renamed row.

Checked: informed_money (grantmaker training and research changed) is read only by informed_money_value; donor_cost_share reads raised_money + gh_money_moved (gross new money) times new_money_share, never informed_money; gh_money_moved = egi_money + f2g_money is valued through gh_moved_dollar_net_value in moved_value and in the context multiple; egi_costs_value multiplies cost by gh_prior_dollar_value (a cost, subtracted in moved_value, not a gain), allowed by the INV-12 product rule; explainers use the new ids.

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| None | | | | |

Verdict: pass
Model-sha: 138576b6202612bce8bf2885a63c8a7bdcf42e805d6e0ffc8b7dc25c84e2ab33
