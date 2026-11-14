# Audit: ambitious-impact-charityevals, round 4
Result: 0.02920 uov/$ = 14.6 years of healthy life per 1,000 dollars (combined range 1.4–155). Scope: verification of round 3 fixes. Mechanical: audit-model shows no lint or invariant errors; check.ts all models valid; summary ("about 15") and write-up (15, round 3 paragraph) match the headline 14.6.

Round 3 fixes: 1 resolved (f2g_missing_data_adj = $missing_data_discount, multiplied into f2g_money, named in summary and write-up bullet); 2 resolved with a small inconsistency (finding 1); 3 resolved (egi_budget_per_org $0.5M, 0.15–1.5M, egi_costs_value subtracted in moved_value at gh_prior_dollar_value); 4 resolved (both rows in moved_money, explainer says why a second set); 5 resolved (circles explainer); 6 resolved (labels cover all its work); 7 resolved ("fast 30 Millionen Euro" is in facts/meta.json; write-up bullet lists giving organisations and companies).

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | f2g_donations_per_company | The reference chain reads "about 50% pledged, 25% to 50% given" with 0.1 × $3M × 0.5 = $150,000. The stated pledged share (50%) times "perhaps half is given" would be 25% ($75,000), so the factor 0.5 is ambiguous. | Say "about half of proceeds is given (pledge about 50% to 100%, half to all kept)", or state one factor of 0.5 (the share of proceeds given). |
| 2 | low | egi_costs_value | The formula omits the success and failure weighting, which is correct only because egi_budget_per_org is already an expected lifetime figure; this is stated in the budget's explainer. The shared moved-money rows were not registered in src/engine/moved-money.ts (outside this build's files), so INV-12 does not check gh_prior_dollar_value and gh_dollar_net_value word for word. | none for this build; register the two rows in src/engine/moved-money.ts when that file is open. |

Verdict: pass
Model-sha: a3d0d207c8e59bb94ed867de0f38c957e4a8e1c161635dbf9d9706097db649ff
