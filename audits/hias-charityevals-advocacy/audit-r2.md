# Audit: hias-charityevals-advocacy, round 2
Result: 3.242e-4 daly/$ = 0.324 years of healthy life per 1,000 dollars (combined range 0.016–6.44; joint low–high of the model's own ranges 0.002–28.8); cause median 0.0810 (×4.0). Verdict: pass.
Model-sha: 97a344b711bb67e305a742e504834509191f331d03b9c76ab3291672fde4d0a3
Scope: unchanged from round 1 (HIAS US advocacy, community engagement and litigation, fiscal 2025, a $3.0M judgment carved out of US operations; the three HIAS models still add up to cash programme spending).
Mechanical: lint 0 high / 0 medium / 1 low (spread, the summary says so); normalization-audit: no violation for this model (INV-15 no longer needed, the result is 4× the median); check.ts: all models valid; simulation-check: stable (5% 0.02×, 50% 0.107×, 95% 0.615× the best guess; single event misses 0% of draws; mean 1.89 against 1.52 smooth). `generated/` restored with git checkout.

## Round-1 findings: status
| # | Round 1 | Status | Check |
|---|---|---|---|
| 1 | p_success, reach, wait (high) | fixed | `p_success` 2% (0.5–6%) cites the 5 March 2026 ruling; IRAP page confirms the Ninth Circuit reversed the processing and admissions order and affirmed only services funding. Reach 10,000 (2,000–50,000) with the ceilings "125,000 (fiscal 2025) and 7,500 (fiscal 2026), annual report PDF p. 5": p. 5 says 7,500, "a fraction of the 125,000 authorized in the prior year". `years_until_effect` 2 (1–3). The "ten times its peers" sentence is gone and the result is under 10× the median. |
| 2 | counterfactual_adj | fixed | Formula `1`, explained by Convention 5. |
| 3 | one year's cost vs whole case | fixed | `pend_period_share` 0.5 (0.33–1) is in `pend_refugees` only; the injunction's admissions stay whole. |
| 4 | attribution basis | fixed (as a judgment) | 15% (5–30%) now has a stated resource split (IRAP and co-counsel three-fifths, three organisational plaintiffs and individuals the rest, about an eighth each). It is a judgment with a stated anchor; no case budgets are published, so a row build would rest on invented inputs too. Accepted. |
| 5 | advocacy cost anchor | fixed (low residual, see R2-2) | 990 Part VII pay verified (990 PDF p. 58: $253,493 and $235,952). Schedule O wording verified (educate, organise, mobilise; statewide coalitions; New York and Los Angeles). Cases now cited to the annual report, PDF pp. 7–8 (verified). |
| 6 | host consumption | fixed | Kenya, Egypt, Peru, Bangladesh survey rows, equal weight, stated as stand-ins; the survey facts exist for all four; Ukraine removed (beneficiaries sum to 1, GTM added). |
| 7 | pac_admitted | fixed | 150 (100–400); IRAP says "more than a hundred". |
| 8 | implementation_adj on the injunction branch | fixed | Inside `pend_refugees` only; `total_adj` has no `implementation_adj`. |
| 9 | missing side effects | fixed | `ue_family_share` and `ue_services_share` added, tagged `side_effect: added`, summed in `unmodelled_benefits_adj`; the `ls_gain_per_person_year` explainer points to `ue_family_share`. |
| 10 | citations | fixed | Annual report PDF p. 5 (ceilings, vigils), p. 7 (284 congregations, 20,400 and 41,600 contacts, 20+ vigils in 14 states), p. 8 (Pacito, Global Health Council): all verified against the extracted text. |
| 11 | spread | fixed | Summary says the result is mostly uncertainty. |

## New findings
| # | Severity | Category | Row | Finding | Fix |
|---|---|---|---|---|---|
| R2-1 | low | source | `pac_admitted` | The "more than a hundred admitted" figure is IRAP's (verified on its 5 March 2026 page) but the row gives no URL; the explainer names IRAP only. | Add the IRAP URL used in `p_success` to the `pac_admitted` explainer. |
| R2-2 | low | source | `@hias.us_advocacy_cost_fy2025` | "About fifteen at roughly $120,000 each" is $1.8M; the remaining $1.2M for campaigns is unsupported, and the chief global policy officer's role is global, not US-only (round 1 asked for a share to be taken out). The range 1.5–6M still covers it. | Say the best guess is staff $1.8M plus campaign and coalition costs of about $1.2M, and that the lead's pay is only partly US advocacy; or lower the best guess. Effect about ±20% at most. |
| R2-3 | low | presentation | writeups/hias-charityevals.md | "How this model was checked" points to `audits/hias-charityevals/` only; the international and advocacy rounds are in `audits/hias-charityevals-international/` and `audits/hias-charityevals-advocacy/`. | Name all three directories or say "audits/hias-charityevals*". |
| R2-4 | low | structure | `wellbys_bridged` | Uses `p_success` and `discounted_years` without `implementation_adj` and `pend_period_share`. Harmless while `ls_gain_per_person_year` is 0, wrong if someone sets it. | Replace `people_affected_per_year * p_success * discounted_years` with `pend_refugees`-style terms (`ls_gain_per_person_year * (pend_refugees + pac_admitted)`). |

## Sources checked
| Row | Status | Note |
|---|---|---|
| `p_success` (IRAP 5 March 2026) | verified | Reversed processing and admissions order; services funding affirmed |
| `pac_admitted` | verified (IRAP) / annual report p. 8 quote verified | "More than a hundred refugees are estimated to have been admitted under the injunction" |
| `people_affected_per_year` | verified | Annual report PDF p. 5: 7,500, "125,000 authorized in the prior year" |
| `ue_mobilisation_share` | verified | PDF p. 7 |
| `us_advocacy_cost_fy2025` | verified (pay, Schedule O, lobbying $12,240); team size and campaign costs judgment | Form 990 |
| `marginal_vs_past_average` (`@next_dollar.hias`, 25/49/75%) | verified | Forbearance agreement in the accounts (note 5, through 31 December 2026); room × use × run arithmetic 0.9×0.6×0.9 = 0.486 and 0.8×0.4×0.8 = 0.256, 1×0.75×1 = 0.75 |
| write-up | consistent with the model | 2%, about 10,000, half the case's cost, 15%, 49%, headline 0.3 |

## Drivers
Missing-data discount and years counted (shared sliders), `p_success` (0.10–0.91), HIAS's share (0.11–0.65), reach (0.15–0.62), advocacy cost. All judgments with stated anchors; the combined range is 0.016–6.4, about 400-fold, down from 8,000-fold joint spread in round 1.

No high or medium findings remain; the four lows are optional tidy-ups.

**PASS**

Model-sha: 97a344b711bb67e305a742e504834509191f331d03b9c76ab3291672fde4d0a3
