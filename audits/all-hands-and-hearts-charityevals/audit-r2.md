# Audit: all-hands-and-hearts-charityevals, round 2
Result: 2.809e-6 daly/$ = 0.0028 years of healthy life per 1,000 dollars (combined range 0.00058-0.0137); cause median 0.0866 (x0.032). Verdict: pass (no high or medium findings; 2 low).
Model-sha: ea4a90f688a862e7edbafca9393bb574ad04f12ad0b51a40fe41783f2296d328
Scope: unchanged from round 1; only the changes of commit 95fed69 were checked.
Mechanical: audit-model lint no new findings (result moved 0.00278 to 0.00281); invariants none; check.ts all models valid; normalization-audit and simulation-check not re-run (round 1 clean; changes are values and explainers only).

Previous round:
- 1 (prices) resolved in substance: ranges now anchored on cost guides. mg_price 5,000 (2,500-10,000) sits above Angi's 3,822 average (typical 1,361-6,282) with a stated reason (gutted-to-studs jobs are larger than the average water-damage job); ms_price 2,200 (1,100-4,000) matches Bob Vila; sm_price keeps 8,000 and now cites HomeAdvisor's 3,107-51,243 range. Still judgments, as they should be.
- 2 (resp_inkind_value) resolved: one question only, 0.9 (0.7-1), self-help left to resp_counterfactual_adj.
- 3 (vol_hours) resolved: Team Rubicon 47 h/volunteer reference class plus a jobs cross-check (about 80,000 on-site hours, 130,000 with overhead, about 65 each) bracketing 90.
- 4 (count floors) resolved: lows are 800/370, best 830/385.
- 5 (rep_homes), 6 (lines): kept, stated in the rows; acceptable.
- 7 (unmodelled_benefits_adj) partly resolved: now sized item by item (finding 2 below).
- 8 (writeup) resolved: sister figure is a live span, World Bank marked as the abroad model's.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | ms_price | Bob Vila's figures are cited as "$1,100 to $3,400, average $2,200"; the page says $1,125 to $3,439, average $2,254 (rounded; the Angi 2,225 average could not be checked). | Fetched bobvila.com/articles/mold-remediation-cost/. | Quote the exact figures ($1,125-$3,439, $2,254). | none |
| 2 | low | double-counting | unmodelled_benefits_adj | The item sizes sum to +13% (6+3+3+2-1), not the +15% best. | explainer text | Set best to 0.13 or add the missing 2 points to an item. | -2% |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| ms_price | bobvila.com/articles/mold-remediation-cost/ | verified (rounded) | $1,125-$3,439, average $2,254 |
| mg_price | angi.com water-damage cost guide | unreachable | HTTP 403 to automated fetch; the cited 3,822 and 1,361-6,282 are not checked; archived copy requested |
| sm_price | homeadvisor.com fire and smoke cost guide | unreachable | HTTP 403; range and average not checked |
| vol_hours_per_volunteer | Team Rubicon model | not re-fetched | 47 h/volunteer (284,485 / about 6,000) is the sister model's own figure, taken as given |

## Drivers
Unchanged: missing_data_discount (shared), uov_per_daly (shared), resp_counterfactual_adj, mg_price (now 0.0021-0.0041), resp_vs_poorest_fifth, vol_hours_per_volunteer. All judgments, now with references. The writeup edits are consistent with the model (prices, 90%, live international figure).

Verdict: pass.
