# Audit: sierra-club-foundation-charityevals, round 2 (verification of commit 7d83d8e)
Result: 0.01561 tco2e/$ = 0.005821 years of healthy life per 1,000 dollars (round 1: 0.005293, +10.0%, as round 1's finding 2 computed). Combined range 0.000206-0.165; own ranges joint 0.00128-0.0187; cause median 0.001672 (x3.48; the reason is unchanged and stated in the summary: Beyond Coal is the field's largest coal campaign). Verdict: pass.
Model-sha: 25844fc8815566ed1c56a638093816df07dc908fd18948c973f6d76fc0d66c3d
Scope: scoped verification of the changed rows against round 1's findings 1-6: our_wild_america_2022/2023 and the climate_spend rows, the program_expenses source notes, the five shared coal facts, the share_of_sierra_club_resources and outcome_total explainers, the write-up. Unchanged rows not re-audited.
Mechanical: audit-model.ts 0 findings, no invariant violations; check.ts all models valid. normalization-audit and simulation-check not re-run (no structural change; the added rows are observed point values).
Previous round: round 1's findings 1-6 all addressed (below).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | writeups/sierra-club-foundation-charityevals.md, "How this model was checked" | "A further check then verified these changes" names no outcome. | Write-up text. | After this round, say "A second check of the changes found no high or medium findings." | none |
| 2 | low | source | `us_retiring_coal_twh_per_gw_year` explainer | The new EIA rate (42-48% for the fleet) sits beside a 35% judgment; the gap (the plants that retire run less than the fleet) is argued but not quantified. | EIA Table 6.07.A: coal steam 48.4%, 42.4%, 42.6%; the value 3.0 TWh/GW is a 34% factor. | Optional: add the capacity factors of the retired units (EIA-860) as the reference class for 35%. | none |

## Checks (round 1 findings)
- Finding 1 (advocacy share source): fixed. Source Coglianese, Gerarden & Stock (2020), doi 10.5547/01956574.41.1.jcog; the abstract (fetched via Crossref and OpenAlex) says the falling gas price relative to coal "is responsible for 92 percent of the total decline in coal production" and that environmental regulations account for "an additional six percent". The explainer's "most ... gas prices and demand, only a few percent on regulation" matches (6%); it is called a floor for advocacy's part, with Beyond Coal's own count (389 of about 530 plants) as the upper anchor. 15% (5%-35%) is a judgment between them, stated. The source is about production, not closings, and the explainer says so ("decline").
- Finding 2 (Our Wild America): fixed. our_wild_america_2022 = 17,202,850 and _2023 = 15,021,864 (observed, quote from Part III, objects as in round 1); climate_spend_2022/2023 = beyond_coal + climate_share_other x (program_expenses - beyond_coal - our_wild_america). Result 0.005293 -> 0.005821 (+10.0%), as round 1 predicted. The write-up now names Our Wild America (2022 and 2023) as going whole to the lands model, and the lands model counts it whole.
- Finding 3 (programme lines per year): fixed. 2022: 32,282,148 + 17,202,850 + 10,926,336 + 36,938,112 = 97,349,446. 2023: 27,344,063 + 15,438,776 + 15,021,864 + 40,465,463 = 98,270,166. 2024: 17,105,894 + 15,411,909 + 8,826,175 + 46,146,427 = 87,490,405. Each sum equals the row's value.
- Finding 4 (73% anchor): fixed. share_of_sierra_club_resources explainer: conservation campaigns $83.9M (Sierra Club Part III line 4a, verified in round 1) against Foundation grants $85.6M less CGEP $15.4M and NEP $8.8M = $61.4M, 73.2%. Keeps 70% (50%-90%).
- Finding 5 (coal fact sources): fixed. Fetched: EIA Table 6.07.A file (table_6_07_a.xlsx), coal steam turbine capacity factor 2022 0.484, 2023 0.424, 2024 0.426, matching the note. EIA FAQ id=74: natural gas 0.96 pounds per kWh (2023), coal 2.31. EIA Today in Energy 67427: "retired 2.6 gigawatts", "planned to retire 8.5 GW". The J.H. Campbell example (2022 settlement, 2025 closing, three years) is in the explainer without a URL (low, accepted).
- Finding 6 (write-up placeholder): fixed, see low finding 1 for the one sentence left.
- Headline in the write-up (0.0058, $64 a tonne) matches the live 0.005821 and 1/0.01561 = $64. grep for 0.0053, $70 and 0.014 finds nothing stale in the model or write-up.
- Credit shares unchanged from round 1 (coal 40% + 10% within the 15%).

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| @climate.us_coal_retirement_advocacy_share | https://doi.org/10.5547/01956574.41.1.jcog | verified (abstract) | 92% gas prices, 6% regulations, 2008-2016 |
| @climate.us_retiring_coal_twh_per_gw_year | https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_6_07_a | verified | 48.4 / 42.4 / 42.6% (the table's file) |
| @climate.us_coal_replacement_tco2_per_mwh | https://www.eia.gov/tools/faqs/faq.php?id=74&t=11 | verified | natural gas 0.96 lb/kWh, 2023 |
| @climate.us_coal_retirement_stay_closed_share | https://www.eia.gov/todayinenergy/detail.php?id=67427 | verified | 2.6 GW retired in 2025, 8.5 GW planned |
| our_wild_america_2022/2023, programme lines | IRS TEOS objects 202322919349301827, 202402829349301810 | verified in round 1; sums re-checked here | |

## Drivers
Unchanged from round 1: win_years_counted, missing_data_discount, deaths_per_tco2e, discount_rate, the next-dollar factor, advocacy's share of the closings. Peers x3.48 of the climate median, with the reason in the summary.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
