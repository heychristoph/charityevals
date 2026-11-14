# Audit: cool-earth-charityevals, round 3 (verification of the round-2 changes)
Result: 1.099e-4 daly/$ = 0.110 years of healthy life per 1,000 dollars (combined range 0.024-0.51). Verdict: pass (no high findings).
Model-sha: edc07ed9b87c8b08734f4966c4687d7fab50701961bf956f7c7d36a99371044e
Mechanical: lint 0/0/0, no invariant violations; check.ts: all models valid; beneficiary-countries.ts --check does not touch this model. Round-2 findings 1-5 are resolved (checks below).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `liv_mortality_ratio` | The explainer's "Peru's national 1.6%" under-five mortality is unsourced (UN IGME gives about 1.3-1.6% for Peru depending on year; only the direction matters). The rest (judgment 12%, 4-25%, anchored on the GiveDirectly model's 0.25 at about 5% mortality, low end the shared +4%) is consistent with round 2's derivation 0.25 x 3/5.1 = 0.15. | Row explainer. | Cite UN IGME for Peru and Papua New Guinea in the explainer, or drop the 1.6%. | None |

## Checks of the changes
1. `liv_mortality_ratio` x `$life_value_multiplier` is `liv_mortality_share` (0.12 at the default), side_effect "added", read by `liv_credit`. Overall result 0.111 to 0.110 with the other changes, as round 2 predicted.
2. `liv_cash_gbp` high end 1,720,000 = £2,437,731 - £713,011 = £1,724,720 (rounded down, fine); the page list adds note 15, p. 40; the explainer states the ceiling; the write-up (£0.8m-£1.7m) agrees. Tornado 0.0747-0.155.
3. `for_baseline_loss_rate` 0.14% (0.07-0.5%): the explainer reasons 0.05% with the support / (1 - 0.3) = 0.07% for the low end. `for_lasting_loss` "about 600 hectares" = 866,998 x 0.0014 x 0.5 = 607. The write-up line is updated.
4. Summary reads "(a small cut in pandemic risk, and its carbon)" and "over nine tenths" (cash is 97%); `cons_per` explainer "$3,000" matches the row (3,041).
5. `@climate.tropical_primary_loss_2023_ha` explainer now says 2023 is a typical year against 2024's fire-driven record, with WRI's wording.
6. `methane_share` is a bridges row with formula 0. The model's `dalys_from_tco2e` formula is identical to .claude/skills/build-cea/templates/conservation.json (string equality checked). The model's methane_share explainer is shorter than the template's, which is fine.
7. Beneficiaries PER 0.758, PNG 0.157, CMR 0.058, world 0.027 (sum 1.000), identical in the model and scripts/beneficiary-countries.ts; the note's 97%/3% matches. At the defaults: forest 15.0 and cash 447 healthy years after the branch adjustments, the cash rising to about 541 with its +12% mortality and +10% spillover rows, so cash 97.3%, forest 2.7% (pandemic about 2.2%, carbon about 0.5%, matching the write-up). The cash split by note 8 excluding Go Conscious Earth (PER 0.779, PNG 0.161, CMR 0.060) x 0.973 gives 0.758, 0.157, 0.058.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| liv_cash_gbp | https://opencharities.uk/ew/1117978/files/2026-01-31-accounts.md | verified (arithmetic rechecked) | Notes 7, 9, 10, 15 |
| @climate.tropical_primary_loss_2023_ha | https://gfr.wri.org/global-tree-cover-loss-data-2023 | verified in round 2 | Reason for 2023 now stated |
| liv_mortality_ratio anchor | models/global-health/givedirectly.json | checked in round 2 (ratio 0.25) | Peru's 1.6% unsourced (finding 1) |
