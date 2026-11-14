# Audit: givewell-charityevals, round 4 (scoped: donor_cost_share change)
Result: 0.07209 uov/$ = 36.04 years of healthy life per 1,000 dollars (combined range 14.27–91.05); cause median 0.06415 (×562, explained in the summary: a dollar ends with GiveWell's grantees). Verdict: pass.
Model-sha: 7dd0897f9cc6dd762e7a9d15bfda6f0049be5a87c9de414d669048a16a914d14
Scope: unchanged from round 3 (2024 operations, $20.7M audited); only `donor_cost_share` and its explainer changed. Sources not re-fetched.
Mechanical: lint 0 findings (audit-model "Findings (0)"), invariants none, check.ts "all models valid", normalization-audit none (orchestrator ran it; not rerun).
Previous round: r3 passed with no high findings; nothing open.

## Checks of the change
1. `donor_cost_share` = `cost_total / (cost_total + if($resource_shares, salary_sacrifice + donors_moved * new_money_share, 0))`. `moved_value` = `(donors_moved * moved_dollar_net_value + open_philanthropy_moved * (moved_dollar_value - prior_dollar_value)) * (1 + moved_side_effects)`: donors' money is valued with `new_money_share` of it as new, Open Philanthropy's all as shifted. The credit's resources now match the valuation exactly: only `donors_moved` (which contains `influenced_funding * survey_response_adj`) carries `new_money_share`; `open_philanthropy_moved` adds none. Using `money_moved` counted half of Open Philanthropy's money as new, contradicting `moved_value`. Consistent.
2. ACE (`animal-charity-evaluators-charityevals`, `donor_cost_share`) uses `salary_sacrifice + donors_moved * new_money_share + inkind_advertising` with grantmakers' money all shifted: same rule (ACE's extra in-kind term is its own co-funder, not relevant here).
3. Headline recomputed with src/engine/model.ts (headline at `av` and `{...av, resource_shares: 1}`): 36.043 at the defaults (unchanged; matches audit-model 36.04) and 28.576 with resource_shares = 1 (matches the tornado's 36.04 → 28.58, the stated 28.4 → 28.6). The slider moves this model (tornado row `resource_shares`).
4. Explainer is accurate and short. Summary is not stale: it quotes the defaults (36 years, Open Philanthropy all shifted, 59% donors). Write-up line 17 and 23 (Open Philanthropy all shifted, half of other donors' giving new) agree with the formula.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | writeup "Staff time" bullet | The bullet says credit by share of resources concerns staff pay only; with the slider on it now also shares the outcome with other donors' new money (the larger part of the 36.0 → 28.6 move). | writeups/givewell-charityevals.md line 42 vs formula | Reword to "We credit the resources behind the outcome, staff's forgone pay and other donors' new money, as in every model (credit by share of resources, off by default)." Net text length unchanged. | none (text only) |

## Sources checked
Unchanged since round 3; none re-fetched by instruction.

## Drivers
`next_dollar_freed_for_grants` (judgment, 62.1–27.4), `daly_per_child_death` (judgment), `discount_rate` (judgment), `uov_per_daly` (judgment), `side_effect_weight` (judgment); `resource_shares` now 36.0–28.6. Unchanged; the model is well anchored on the audited accounts and survey, with a sourced reason for being over 10× the median.
