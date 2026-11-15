# Audit: mercy-corps-charityevals, round 4

Result: 1.721e-4 daly/$ = 0.172 years of healthy life per $1,000 (combined range 0.032–0.940); global-health median 0.099 (×1.73). Verdict: pass (0 high, 0 medium, 1 low).
Model-sha: 6a154600ee37c7b1609c00f64bb48d6624e70efcf30eaae34571eb6b38ca9774

Scope: only commit 9a98fcc (`git show 9a98fcc -- models writeups`): the within-a-year transfer rule for relief and recovery, the anchor of `liv_participant_only_share`, summary and write-up figures.

Mechanical: audit-model 0 high / 0 medium (LOW spread notes only); `check.ts`: all models valid. normalization-audit and simulation-check not re-run: no shared reads changed.

Previous round: 1 low finding (participant-only share unanchored). Resolved in form: the explainer now cites two report passages and says why the multiplier sits near 1.7; see finding 1 for the remaining inference.

Checks:
- Rule: relief `ln_gain_per_person` = `years_exposed * ln(1 + value_delivered_per_person / (baseline_consumption * years_exposed))`, the same form as World Central Kitchen's `years_exposed * ln(1 + value / (baseline * years_exposed))` (its CPI/PPP factors are that model's own units step). Recovery's consumed part is `rec_consumption_years * ln(1 + value*(1-invested_share) / (baseline * rec_consumption_years))`; the invested part's yearly returns and end principal are unchanged. `rec_consumption_years` is a judgment (0.5, 0.25–1) with an explainer and unit. Other ln terms (livelihoods, peace, education, water) are multi-year or percentage gains, not transfers consumed within a year; nothing missed.
- Figures: 0.1721 and 0.0315–0.9399 give the summary's 0.17 and 0.03–0.94 and the write-up's 0.17; the write-up's Round 3 history is stated as a result.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | judgment | `liv_participant_only_share` | The quotes are accurate (Sudan CCS '1.9M individuals' through multi-purpose cash, p. 24; ALCP '9,169 rural households', p. 26), but they show only the unit of count (individuals, households), not that those individuals include every household member or that household counts are converted to people. "Counted as individuals in their households" and "become people when the outcome areas are totalled" are inferences, and the first quote is a cash (relief) programme, not a livelihood count. | mce.txt p. 24 line 1294, p. 26 line 1424; share 0 / 0.2 / 0.6 gives 0.141 / 0.172 / 0.234 | Reword the explainer's two claims as "appear to" or say the report does not state how households are converted; keep value and range. | within the existing range; no change |

## Sources checked

| Row | Source | Status | Note |
|---|---|---|---|
| liv_participant_only_share | Mercy Corps Europe report, p. 24 ('1.9M individuals through multi-purpose cash assistance and group cash transfers', Cash Consortium of Sudan) | verified | counts individuals; household inclusion inferred |
| liv_participant_only_share | same report, p. 26 ('ALCP interventions resulted in 9,169 rural households increasing their income') | verified | household count; conversion to people not stated |
| ln_gain formulas | world-central-kitchen-charityevals.json `ln_gain_per_person` | verified | same form |
| summary and write-up figures | audit-model output | verified | 0.1721; 0.0315–0.9399 |
| all other rows | unchanged since round 3 | not re-checked | |

## Drivers

Unchanged: `$missing_data_discount`, `liv_direct_gain`, `$uov_per_daly`, `liv_years`, `liv_direct_share`, `liv_participant_only_share`.

Re-stamped after merge: finding 1 applied as suggested (explainer of liv_participant_only_share reworded to "appear to" and says the report does not state how households become people); value and range unchanged.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (15 Nov 2026): the income-mortality ratio read from the shared fact; consumption surveys carried forward by 0.7 of real growth (the shared line-up rule); 0.172 → 0.172.
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)
