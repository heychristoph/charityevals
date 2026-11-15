# Audit: world-vision-charityevals, round 6 (verification)
Result: 2.903e-4 daly/$ = 0.29 years of healthy life per 1,000 dollars (combined range 0.072-1.174); cause median 0.0866 (x3.35). Verdict: pass.
Scope: scoped verification of the shared change only (section 2.20 of docs/normalization.md, facts/aid_value.json, the advocacy branch's `aid_value_vs_cash` now `@aid_value.oda_vs_cash`, previously a judgment 1x, 0.3-2.5). Programmes and year unchanged since round 5.
Mechanical: lint none, invariants none, normalization-audit not rerun (0 violations per the brief); `check.ts` passes ("all models valid"); headline 0.2903, unchanged at the defaults.
Previous round: round 5 passed with no findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | aid_value.oda_vs_cash (note) | The note says cost-equivalent cash "did as well as the benchmarked programme". The CEGA page says the programme had no effect on the primary child outcomes and cash at that size had none on child health either, though cash did raise savings, debt repayment and assets. "At most as well as cash" is what it supports; 0.5x rather than 1x for other development is then a judgment, not read off the trial. | CEGA page fetched: the quote is present; $142 per household is the cost of the cash arm, of which about $114 reached households. | Reword the note to "the programme did not beat cost-equivalent cash on its primary outcomes, so other development is set below cash at 0.5x (judgment)". | none |
| 2 | low | presentation | aid_value.oda_vs_cash (note) | The mix arithmetic checks at the best (0.25 x 3 + 0.25 x 0.2 + 0.5 x 0.5 = 1.05; Gavi 0.007/0.00335 = 2.09x, Global Fund 0.015433/0.00335 = 4.6x, 3 sits inside that range, below its 3.35 midpoint). The low and high shares aren't fully stated: low health a fifth at 2x plus development 0.2x comes to about 0.5 to 0.56 with the humanitarian 0.2x, not exactly 0.4; the high is about 2.0 to 2.1. | Recomputed from facts/givewell_shared.json and facts/cash.json. | State the shares for the low and high mixes, or call 0.4 and 2 rounded ends. | none; range only |

Rule applied correctly: the row is a `formula` of `@aid_value.oda_vs_cash`, no value, no kind, and it multiplies `@cash.uov_per_dollar` once in the downstream rows. Fits this model: the advocacy branch keeps US foreign aid whose use is not known (the budget as a whole), so the whole-budget fact is the right one, not the humanitarian fact or a vaccine pledge. A quarter global health is reasonable for US aid. Range effect: the branch is $3.4 million of $988 million, so the headline and its range barely move.

Summary and write-up: both match the live result (0.29, about three times the median); neither states the aid multiple, so nothing is stale. The section 2.20 text matches the change (World Vision's US aid unchanged at 1x, range 0.3-2.5 to 0.4-2).

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| oda_vs_cash | https://cega.berkeley.edu/collection/gikuriro-rwanda-cash-benchmarking/ | verified | quote present; see finding 1 on wording |
| cf_value_gavi, cf_value_global_fund | facts/givewell_shared.json, facts/cash.json | verified | 2.09x and 4.6x cash |
| humanitarian_vs_cash | the site's 17 relief models | not recomputed | an anchor only; this model's advocacy branch reads `oda_vs_cash`; the humanitarian fact is read inside it only as the 0.2 in the mix |

## Drivers
Unchanged: missing_data_discount, uov_per_daly, relief_counterfactual_adj, affected_consumption_share, health_cost_per_child. The aid multiple is not among them.

Verdict: pass
Model-sha: 7a88fff98eda5b7fdb8981b1281295770189822093a419ff4a4fbe28a6e24491

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
