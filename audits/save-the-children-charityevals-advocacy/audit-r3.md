# Audit: save-the-children-charityevals-advocacy, round 3
Result: 8.514e-4 uov/$ = 0.43 years of healthy life per 1,000 dollars (combined range 0.06-3.1); cause median 0.338 (x1.26). Verdict: pass.
Model-sha: 6e870748a6a734776dce1b2d8b13385d06c3400b57c8776510ecd1ff95c30080
Scope: unchanged from rounds 1 and 2 (advocacy line GBP 13.473m plus Elrha GBP 11.161m, 2025). Verification round: the model is unchanged since round 2; only the write-up's "How this model was checked" section was reworded, which is what the new fingerprint covers.
Mechanical: lint 0 high / 0 medium / 1 low (spread), invariants none, normalization-audit none.
Previous round: round 2 #3 (write-up said "Round 2 checked the changes" before the round existed) resolved: it now reads "checked the changes and passed, keeping the earlier years' spending as its one medium finding", matching round 2 (verdict pass; one medium, adv_average_spend_vs_year, carried from round 1 #4). Round 1's four medium findings are described as in round 1 (Elrha's dollar at 0.3, Gavi counterfactual and other wins anchored, earlier years' spending a ranged judgment; 0.49 to 0.43). Round 2 #1 (earlier years' accounts unread) remains open as a medium, accepted by the builder with reason; #2 low, unchanged.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | sensitivity | adv_average_spend_vs_year | Carried from rounds 1 and 2: the 2022-23 accounts are still unread; the ratio scales every win. Not new; the write-up now states it plainly. | explainer | Read the advocacy line of the 2022-24 accounts, deflate with @cpi, set the ratio to mean real spend over each campaign's years over 2025's. | about +-10% on the wins |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| (none) | - | - | Models unchanged; sources were checked in rounds 1 and 2. |

## Drivers
Unchanged from round 2: gavi_counterfactual_adj, missing_data_discount, uov_per_daly, gavi_attribution_share, @next_dollar.save_the_children. Best improvement: a published estimate of advocacy's effect on replenishments.
