# Audit: first-embrace-charityevals, round 2
Result: 0.01050 uov/$ = 5.248 years of healthy life per 1,000 dollars (combined range 1.980–13.91); cause median 0.1196 (×43.9). Verdict: pass.
Model-sha: 25bc434312c9bd10916a477e8209b623a701a9e45e51a24aec59f23d11c2e1b4
Rules: 0.3.3
Scope: unchanged programme (kangaroo care, Kano State), now calendar 2026 at both hospitals: spend $273,930 less set-up spread over its years = $256,245, 1,450 newborns enrolled. charities/first-embrace.json `spending` and its one line carry the same $273,930 with both sources; no accounts exist yet.
Preflight: pass (one low simulation line on `@newborn_care.kmc_mortality_rr`, checked in round 1: the Cochrane 95% CI). `npx tsx scripts/summaries.ts --check` passes.
Previous round: scoped verification of round 1's two highs and one medium.
- 1 (high, baseline at the lower bound): resolved. The lost newborns' expected deaths are built from sourced rows (`cohort_mortality` 0.224 = round 1's 15.9/71, formula checked: 12 + 25 × (0.69 × 0.11 + 0.31 × 12/46) = 15.9). The "low if anything" and "matches the national figure" wording is gone and the unit is fixed. The best guess is then a blend (`cohort_weight` 0.5, 0.25–0.8) with a Kano reference for newborns past day 1 (0.151), giving 0.188 rather than 0.22. See note A: a judged best guess with its reasons, not a conservative bound, so resolved.
- 2 (high, idea-stage AIM model still shown): not resolved here, by the owner's instruction not to touch models/grants/ambitious-impact/, inventory/ambitious-impact-models.json or scripts/aim-theoretical.py. Judged in that light it is an owner action after merge (move `first-embrace-aim` from KEEP to REMOVE in scripts/aim-theoretical.py), not a defect of this build, and does not hold the round. The one in-scope consequence is handled: `ambitious-impact-charityevals` `value_destinations` now read `#charityevals:first-embrace` and `#charityevals:kaya-guides` (formula and explainer consistent; result finite, 9.362).
- 3 (medium, pilot standing in for the year): resolved. Calendar 2026 at both hospitals; `program_spend`, `people_reached`, charity record and line all agree; the $110 run-rate is stated in the `cost_per_person` explainer as context (Convention 9 allows context or a range end); the ranges are consistent with each other (spend range from `months_after_seed`, reach 1,300–1,600). See low 2.
- Lows 4–13: not re-opened. Each also checked while verifying: 4 (80%, source cell verified), 5 (3.6 hours, verified), 6, 7, 9, 10, 11, 12 (the shared figures equal GiveWell's typed 0.15 and 0.10, kept in `published`; no value moves), 13 (`--check` passes) are done.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| A | low | sensitivity | `cohort_weight` | The blend weight 0.5 names its reasons (71 newborns in one month, a third lost; referred newborns; the programme's own 9%) but no precision anchor. By inverse variance (cohort SE about 0.05–0.06, Kano reference SE about 0.02 from its 0.18–0.30 range) the cohort's weight would be about 0.15–0.3, though the Kano figure is a different population (not hospital-referred), which argues for more. The best guess sits inside the range and the swing is under 10%. | Tornado: 4.74–5.86; `baseline_mortality_rate` 0.188 against the template's plausible bound of 0.2 (not a lint; the explainer states the choice). | State the precision calculation in the explainer and keep 0.5 as the judgment between it and the population mismatch. | about ±10% across the range |
| B | low | scope | `program_spend` | The second hospital's set-up ($10,537, a sheet standard) is subtracted (× 2/3) from 2026 spend although it is not shown that it was in the $163,150 or the July–September average. If it was not in them, the subtraction removes about $7,000 too much. | Sheet "Set-up per new hospital (one-time) $10,537"; forum 4.3 seed grant. | Say in the `setup_second_hospital` explainer that it is taken to be inside the 2026 monthly spend. | about +3% if wrong |
| C | low | sensitivity | `months_after_seed`, `people_reached` | The cost per newborn's range does not reach the $110 run-rate (joint about $150–$235). Convention 9 is met by the context sentence; a range end would be better. | `cost_per_person` explainer. | Optional: widen `monthly_spend` low to the sheet's July–September figure less the seed months, or leave. | none at defaults |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `monthly_spend`, `setup_second_hospital`, `implementation_adj`, `gift_to_grant_years`, `staff_cost_share` | https://docs.google.com/spreadsheets/d/1WUFh0SpvjWNjqop0h49RDnwee4CbB_Wtc1YR3P4VTpg/edit (CSV) | verified | "Average monthly spend, July to September 2026 $27,695"; "Set-up per new hospital (one-time) $10,537"; "Effective Kangaroo care rate (adherence over 2 hours a day) 80.0%"; "Cash in the bank $236,000"; Co-Executive Director salary $55,000 × 2; "254 babies in September 2026 and 214 so far in October"; 40% referred caseload; hospitals active 2 |
| `seed_spend`, `setup_first_hospital`, `kano_lbw_mortality` | https://forum.effectivealtruism.org/posts/wGXCuedzsubqNDAca/introducing-first-embrace-an-ambitious-impact-incubated | verified | "$163,150 of deployable capital … 7 months of programming after charity setup"; set-up $15,990; Kano 59/1000, 78.2%, 19.4%, 23.8% (national 17.9%); "730 (960 x 80%)" |
| `base_cohort`, `base_known_deaths`, `base_lost`, `base_lost_discharged_share`, `base_traced_survival`, `base_early_deaths`, `base_all_deaths` | https://firstembrace.org.uk/updates/pilotbaseline | verified | "Registered cohort (post-hoc) 12/71 17% 10–27%"; "Those nine deaths come out of the numerator and the denominator alike"; "Among 80 newborns, 21 deaths were recorded. Follow-up was completed for 55 (69%)"; 25 lost; 69% discharged alive, 89% survival among traced, "higher mortality estimates are less plausible"; complete case 21/55 |
| `people_reached` | https://firstembrace.org.uk/impact | verified | "1,104 premature and underweight newborns cared for"; 801 of 885 alive at day 28 |
| `external_validity_adj` anchor | https://firstembrace.org.uk/updates/first6months | verified | "Mean Kangaroo Care hours are 3.6 per day so far" |
| `@newborn_care.kmc_mortality_rr`, shares | Cochrane, GiveWell sheet | verified in round 1 | unchanged |

## Drivers
1. `@newborn_care.kmc_mortality_rr`, estimate (Cochrane 2026): 9.12–0.28 across its CI.
2. `daly_per_child_death`, shared slider: 3.15–7.35.
3. `external_validity_adj`, judgment 0.9 (0.7–1.1): 4.08–6.41.
4. `implementation_adj`, estimate from the charity's sheet (80%, 0.6–0.9): 3.94–5.90.
5. `baseline_mortality_rate` (blend of a 71-newborn cohort and a Kano reference): the best guess is a judged blend; a longer registered baseline at the new hospitals with lost newborns traced would settle it.

Peers (audit only): ×43.9 the cause's median. As in round 1, the gap comes from the programme (a direct neonatal mortality intervention at a high baseline risk), not a counting rule; reach, scope and persistence are one year's flow against one year's cost. Open high or medium: 0.
