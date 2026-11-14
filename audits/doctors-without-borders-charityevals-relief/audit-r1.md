# Audit: doctors-without-borders-charityevals-relief, round 1 (verification of the t-rule changes)
Result: 7.008e-4 daly/$ = 0.7008 years of healthy life per 1,000 dollars (combined range 0.154-3.19); cause median 0.0898 (x7.8). Verdict: pass.
Model-sha: 29e3c56d756016ea3adc4b9d521020a4498036fdb7277fad07ac39f918781228
Scope: only the changes: ln_gain_per_person (rule 1), wellbys_bridged label (rule 4), goods_evidence_adj and attribution (rule 2), the write-up sentence on the goods' period. Stated move 0.7032 -> 0.7008 is consistent with a 0.5% lower goods gain on a small goods share.
Mechanical: lint (check.ts) 0 high, 2 old warns (range span, judgment share); invariants none; normalization-audit none (coordinator ran it)
Previous round: no earlier audit file (model grandfathered).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | units | years_exposed / ln_gain_per_person | The period t = years_exposed (0.5, range 0.25-1) also drives the deaths branch, so one period covers the whole kit. Shelter sheeting fits half a year; jerrycans, blankets and cooking sets last longer, and t x ln(1 + v/(b t)) rises with t, so 0.5 is slightly conservative for them. | Rule 1: an item lasting longer is spread over its life; the kit's mix is not split by item life. | Optional, no change needed: reason and range on the row are adequate. | well under 1% |

Checks passed:
- ln_gain_per_person = years_exposed x ln(1 + value x price_2017_per_2025 x ppp_factor / (baseline_consumption x years_exposed)) matches rule 1 and its explainer. value_delivered_per_person is the kit less nets per person (nets are counted as deaths), so no double count; baseline_consumption is annual and divided by t correctly. It feeds relief_uov, then uov_bridged and outcome_total; unmodelled_benefits_adj applied once.
- Wait discount uses benefit_midpoint_years = years_exposed x 0.5 and relief_net_wait uses years_exposed: consistent with the same period.
- Rule 2: goods_evidence_adj best 1 (judgment, low 0.8, with reason); attribution_share 0.95 (judgment, 0.8-1, with reason). Confirmed, no change needed. evidence_adj is reading only (not on the result's path); its weights use ln_gain_per_person so they follow the change.
- Rule 4: wellbys_bridged is 0 and outcome_total adds dalys_from_wellby with no adjustment; label correct now.
- Summary (JSON) carries no figures and does not mention the goods' period, still true. Write-up: headline figure-bound (0.70 matches 0.7008); new clause "over the half year the items protect a family" matches years_exposed best 0.5; no leftover "a year's goods" text in model or write-up.
- Scripts: audit-model bottom line 0.7008; check.ts "all models valid"; simulation-check 5% 0.447, 50% 1, 95% 2.66 x best guess.

## Sources checked
No new sources in this round.

## Drivers
Missing-data slider (0.1-1), cost per family (25-90 EUR), crisis mortality rate, net lifetime, uov_per_daly. The goods period is a minor driver (goods are a small share of the result); the best improvement is a sourced kit cost per family.

Verdict: pass
Model-sha: 29e3c56d756016ea3adc4b9d521020a4498036fdb7277fad07ac39f918781228
