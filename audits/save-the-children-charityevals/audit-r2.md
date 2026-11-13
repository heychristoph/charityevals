# Audit: save-the-children-charityevals, round 2
Result: 2.070e-4 daly/$ = 0.21 years of healthy life per 1,000 dollars (combined range 0.04-1.09); cause median 0.39 (x0.53). Verdict: pass.
Model-sha: b9c57c83b88375f343a157b34d88eb6ec3650316a1d1efe9e2c775e8373ebcce
Scope: unchanged from round 1 (Save the Children UK 2025 programmes, GBP 209.0m of 233.6m charitable activities; advocacy and Elrha in the sister model). This round checks only the changes since 6bbda00.
Mechanical: lint 0 high / 0 medium / 1 low (spread), invariants none, normalization-audit none.
Previous round: #1 edu cost resolved ($130, 60-250; GPE $20m / 150,000 = $133 recomputed; 190,000 / 19,000 / 12,000 counts match r1's page refs). #2 resolved (summary and write-up reworded; hlt explainer anchored: $30 x 1.74m children is consistent with 967,434 + ~150,000 counted; branch kept thin since the effect is judged, defensible). #3 resolved (edu/liv/pro 0.8 (0.6-1), emg 0.9 (0.7-1), uk 0.9 (0.7-1); each branch's total_adj points to its own row; health 0.5 and nutrition 0.6 unchanged; no second use of attribution_share_shared in the other branches). #4 not changed, reason accepted (shared death_ages has no crisis split; explainer now says the shares move the result about 2%). #5 resolved (explainer anchors 0.6 on the paper's small-versus-large gap; 0.1 x 0.6 = 0.06 SD, consistent with the stated 0.04-0.06). #6 bare 0.5 left as an allowed literal (low, accepted). #7 resolved (renamed liv_ln_gain_per_person; the one reference in the bridge row updated, model loads). #8, #9 low, no change needed.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | write-up, "How this model was checked" | Says round 1 had "five medium findings, all fixed", but #4 (age shares) was kept as a ranged judgment, not fixed. | Round 1 table #4; model rows share_under5 etc. unchanged apart from the explainer. | Reword to "four fixed, the age shares of emergency deaths kept as ranged judgments (about 2% of the result)". | none |
| 2 | low | presentation | summary, write-up Summary | Branch order "then emergencies, health and livelihoods": computed DALYs are emergencies 11.2k, health 5.6k, livelihoods 5.3k, so the order is right; shares "a third from education, a third from nutrition" check (21.9k and 19.8k of 64.1k = 34% and 31%). No change needed; noted as checked. | Branch dalys rows. | none | none |
| 3 | low | sensitivity | uk_attribution_share, pro_attribution_share | Both branches are under 1% of the result, so their new rows carry no weight; harmless but they add four judgment rows on the page for 0.5% of the result. | Branch DALYs: protection 0.3k, UK 0.04k of 64.1k. | Optional: fold protection and UK into one shared 0.8 row to cut rows (memory rule: less text). Not required. | none |

No new double counting: reach is still the charity's spending over the full cost of a unit, and the attribution rows now credit partner resources once per branch; implementation_adj, leverage_funging_adj and missing_data_adj are separate factors with different explainers. Result moved 0.29 to 0.21 (-28%): education cost (-19%), attribution (about -9%), as r1 predicted; no unexplained move.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| edu_cost_per_child | GPE Afghanistan / accelerated grant pages (as in r1) | arithmetic re-checked, page not refetched | $20m / 150,000 = $133; AR p. 33 "nearly 190,000" taken from r1's verification |
| hlt_cost_per_child | AR pp. 7, 15, 31 (967,434; BOOST) | taken from r1's verification | consistent with 1.7m implied children |
| edu_evidence_adj | Evans & Yuan 2022 | taken from r1's verification | "almost three times" small-versus-large quartile |

## Drivers
Missing-data slider (0.04-0.41), value of a healthy year (uov_per_daly), discount rate, education effect size and cost per child ($60-250, now a top-5 swing of 0.29-0.17), earnings per SD. Best improvement: a published per-child cost for the GPE grants Save the Children UK runs (Afghanistan, Myanmar).
