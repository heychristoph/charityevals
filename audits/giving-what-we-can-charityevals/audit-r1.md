# Audit: giving-what-we-can-charityevals, round 1
Result: 0.07537 uov/$ = 37.68 years of healthy life per 1,000 dollars (combined range 7.0–202.7); cause median 0.07168 (×526). Verdict: pass.
Model-sha: ac120eaf6df9b4762e64cadbd1b5359c12e5adfd2533ff66c56f1d5c3e6e3b94
Scope: all of Giving What We Can's spending in 2023 and 2024 ($1,991,339 + $1,869,506 = $3.93M in 2024 prices), one programme of effective giving; charities/giving-what-we-can.json `spending` and its single line match the working sheet's 'Financial costs'. The UK charity's audited accounts (acc.md) were not on disk, so the £239,842 / £404,443 figures in the explainers were not re-read; the group figure is the evaluator's own and is the only one covering both years. No programme is missing (the Company Pledge is left out by the evaluator too, and the write-up says so).
Mechanical: lint 0/0/0, invariants none, normalization-audit none for this model (generated/ restored), simulation stable (5% 0.45, 50% 1.00, 95% 2.16 × best guess).
Previous round: none.

The 526× gap to the cause median has a stated reason in the `summary` (about nine dollars moved per dollar spent, mostly to top global-health charities; it sits above the charities it funds). I recomputed it: money moved $34.9M / $3.93M = 8.9, times a net value per moved dollar of 9.6 healthy years per $1,000, times 1.05 side effects, times 0.42 next dollar = 37.7. The evaluator's own multiplier is 6.0x net of staff opportunity cost (27.5M gross / 3.93M = 7.0x); ours is 8.9x of money caused before the effectiveness, new-money and destination steps. The result is consistent with its source and with the shared method.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | sensitivity | @next_dollar.giving_what_we_can (high 0.75) | The next-dollar range stops at 0.75, below the ratio GWWC's own words imply: it "expects to sustain a strong (at least 5x) average and marginal giving multiplier" against a 2023–24 average of 6x (5/6 = 0.83). The note cites "only at least 5x marginal" as a reason for a low figure, but 5x against 6x is a mild haircut, not 42%. The best guess (0.7 room × 0.6 use × 1.0 run) and the low end (CEARCH's 0.18 and 0.43) are defensible; the high end ignores the charity's own stated figure. | eval.txt: "we aim and expect to sustain a strong (at least 5x) average and marginal giving multiplier"; "Our best-guess estimate of our giving multiplier ... is 6x" | In facts/next_dollar.json set giving_what_we_can high to 0.85 (GWWC's own 5x/6x) and say in the note that this end is the charity's own target; keep best 0.42 or state why the use factor is 0.6 rather than about 0.85 | high end 67 → about 76; best guess unchanged unless the use factor is revised; the tornado's third input |
| 2 | low | normalization | @meta.gwwc_effective_share_2023_24 | The 0.8295 is weighted by recording-adjusted donations ($76.1M pledge, $25.1M other), but the model applies it to money moved, where pledges and trials are $27.9M and other donors $7.0M (80%/20%, not 75%/25%). Moved-weighted it is (27.9 × 0.774 + 7.0 × 0.997) / 34.9 = 0.819. | class.xlsx 'Value of a 10% Pledge' 0.7742; 'Realised non-pledge value' 0.997 | Split the factor per stream in the model (a pledge and a non-pledge share, each from the working sheet), or note in the fact that it is donation-weighted; do not retype | about −1.3% |
| 3 | low | sensitivity | expenses_2023, expenses_2024, pledge_recorded_per_year, other_donations | Four inputs on the result's path carry no range though the source states their uncertainty: the report says the group figure "could vary by up to $200K per year" with exchange-rate dates (about ±5% of 2024 spending), and the pledge giving figure is a fit over 2020–2023 cohorts. | audit-model "Point inputs on the result's path" | Give expenses_2024 a range 1.67M–2.07M (the source's $200K) and expenses_2023 the same ±10%; leave counted donations as points | joint low–high widens by about 5%; none moves the best guess |
| 4 | low | comparability | pledge_moved | The evaluator weights its two pledge methods 50/50 (realised $19.3M, lifetime $21.6M); the model counts only the lifetime flow. The write-up says why and gives both totals, which agree within 12%. Noted, not a rule breach. | class.xlsx 'Overall results' | none required; optionally add the realised-giving cross-check to the summary | about −5% against the evaluator's blend, by design |
| 5 | low | source | next_dollar note | The "reserves more than $1.5M" and nine-months claim cites the UK accounts, which were not available to this audit. | acc.md missing | Builder to confirm the page in the UK accounts' reserves section and add it to the note | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| expenses_2023, expenses_2024 | working sheet 'Financial costs' | verified | 1,991,339 and 1,869,506; 2023 inflation factor 1.0327 gives $3,925,908 as the explainer says |
| new_pledges | working sheet 'Lifetime pledge value' / eval | verified | Net change in 10% Pledges 1,347 |
| pledge_recorded_per_year | eval | verified | $8,491 (cohorts 2020–2023) |
| pledge_giving_years | eval, sheet | verified | 35 years, mean age 29.92, retirement 65 |
| pledge persistence (meta) | working sheet 'Inputs' | verified | first year 0.594388, decay 0.479817, floor 0.277945; the model's 6.3 discounted years matches the evaluator's 53,445 / 8,491 = 6.29 at 3.5% |
| pledge_recording_adj | 'Pledge recording coefficient' | verified | 1.1406 best, 1.0 conservative, general-pledger surveys 1.0764–1.2937 |
| pledge_own_effect | 'Pledge counterfactuality coefficient' | verified | 0.3273 best, 0.2597 conservative |
| trial_pledges, trial_recorded | working sheet 'Inputs' | verified | 1,259 and 2,205.18; the evaluator's 637 per trial pledge reproduces |
| other_donations | eval | verified | $23,237,796 restricted non-pledge, donor-years over $140K excluded |
| other_recording_adj, other_own_effect | sheets | verified | 1.082 and 0.2797 (conservative 0.1702); 7.01M attributable reproduces as 7.03M |
| gwwc_effective_share_2023_24 | 'Pledge effectiveness coefficient' | verified | 0.7742 and 0.997; weighted 0.8295 as the fact's note says |
| gwwc_high_impact_* | recip.xlsx 'Estimated overall' | verified | GHW 28.92 + 11.33 = 40.25M; animals 6.64 + 3.18 = 9.82M; catastrophic risk 8.18 + 3.33 = 11.52M; climate 6.28M; movement 9.34 + 1.53 = 10.87M |
| @next_dollar.giving_what_we_can | eval | verified (quote), judgment | the "diminishing returns" quote is present; see finding 1 |
| UK accounts reserves | Charity Commission | unreachable | not on disk; see finding 5 |

## Drivers
1. resource_shares (judgment, default off; at 1 the result is 6.98): the site's shared credit toggle, not the builder's.
2. discount_rate (judgment, shared): 0.1% gives 107, 8% gives 23.
3. next dollar 0.42 (judgment, 20–75%): sourced anchors, see finding 1.
4. daly_per_child_death and prior_vs_cash (shared judgments).
5. gwwc_effective_share (observed from the evaluator's classification) and pledge_own_effect (survey-based, observed with ranges).
Most useful improvements: finding 1 (the one judgment unique to this model that moves the result most), then a per-stream effective share (finding 2).

Checks that passed: own-split rule and INV-12 (value_destinations reads only live results and shared rows; funds that follow GiveWell take value_global_health; unmodelled catastrophic-risk recipients take the four models at equal weights; the 17% below its bar is valued at `prior_vs_cash × #givedirectly`); own effect read from the organisation's survey, with the shared new-money share as a separate step; pledge flow with the shared persistence curve at `$discount_rate` (the fading part as an annuity at (1+r)/(1−decay)−1); no unit-conversion constants; estimate_basis past_average with a sourced, dated next-dollar figure and `published: 1` keeping the average in the evaluator view; 2023 expenses inflated to 2024 prices by `@cpi`; write-up figures (38, about $34M, 107 and 23 at the discount extremes) match the live model.

Verdict: pass (no high findings).
