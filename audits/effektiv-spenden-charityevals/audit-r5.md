# Audit: effektiv-spenden-charityevals, round 5 (scoped verification)
Result: 0.04762 uov/$ = 23.81 years of healthy life per 1,000 dollars (round 4: 25.70; combined range 6.5-86.6); cause median 0.06415 uov/$ (x371, reason stated in the summary, INV-15). Verdict: pass.
Model-sha: 5557c781e2cb70efa4fe486474dcf13826ef371155b63a3d3a1378196bba0f3b
Scope: the one change since round 4: advised gifts moved from money moved (own effect x net value) to the shared informed rule, with the explainers, summary and write-up that describe it. No source, scope, cost or reach re-audit.
Mechanical: audit-model no high or medium; check.ts gives 23.8; normalization-audit no violation for this model (INV-12 and INV-18 included; generated/ restored); simulation stable (5% 0.33x, 95% 2.55x).

## Checks
| # | Check | Result |
|---|---|---|
| 1 | Formulas | `money_moved` = `advised_moved` (advised EUR x fx x `@meta.own_effect_share`). `informed_money_value` = money_moved x shifted_dollar_value x evidence_adj x missing_data_adj, as in Longview and the template. `moved_value` = (platform_moved x moved_wait_discount x moved_dollar_net_value + informed_money_value) x (1 + side effects). Platform money keeps its net value with the new-money share; advised money is all shifted and not waited (as before). Right. |
| 2 | INV-12 | Satisfied: normalization-audit reports 0 violations; the model reads the shared informed rule rows (shifted_dollar_value, informed_money_value) and the shared new_money_share. `new_money_share` moved to its place before them without a change of value. |
| 3 | `donor_cost_share` | Now platform_moved x new_money_share: correct, because shifted advised gifts add no donor resources (explainer says so). |
| 4 | `moved_per_dollar` | (platform_moved + money_moved)/cost_total, about eight: right as context. |
| 5 | Explainers | `advised_own_effect`, `advised_moved`, `money_moved`, `evidence_adj`, `missing_data_adj`, `total_adj`, `uov_per_dollar` text all match the formulas. |
| 6 | Summary and write-up | "about 24" matches 23.8; "half of the platform giving counted as new money and the advised gifts only for the gain over where they would have gone" is right; write-up sentences on new money, advised gifts and the "Advised gifts" bullet are right. "Four audit rounds" in the write-up's checked section needs a fifth. |

## New findings
1. medium, summary (last sentence) and write-up "How the model works" (last sentence): both still say "no branch is discounted for missing data, since money moved is counted". No longer true: the advised branch now takes `missing_data_adj` (0.5), and `missing_data_discount` is in the tornado (21.0 to 27.5). The model's own `missing_data_adj` explainer says so, so the text contradicts the row. Fix: "only the advised gifts, whose redirection is judged, are discounted for missing data; platform money is counted dollars". In the write-up: "Platform money is counted, not estimated, so only the advised gifts are discounted for missing data."
2. low, write-up "How this model was checked": says four rounds; add "Round 5 checked the move of the advised gifts to the shared informed rule, and passed."

Verdict: pass (no high finding; the medium is wording only, headline unaffected).
