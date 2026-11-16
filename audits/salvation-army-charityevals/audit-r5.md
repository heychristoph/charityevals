# Audit: salvation-army-charityevals, round 5 (verification of fc4276a5)
Result: 5.239e-6 daly/$ = 0.005239 years of healthy life per 1,000 dollars (combined range 0.000029-0.31 as check.ts prints it); cause median 0.1169 (x0.045). Verdict: pass.
Model-sha: d3dba0136c9e72f2e25d396c1ea018b6e257342c233be02f3bdbe559712a4002
Scope: verification of fc4276a5 only; not a full re-audit. Changed row: inkind_cash_equivalence (formula).
Mechanical: `npx tsx scripts/audit-model.ts models/global-health/salvation-army-charityevals.json` lint 0 high / 1 medium (far-below, 0.0448x the median; judged correct in earlier rounds) / 0 low, no invariant violations; `npx tsx scripts/check.ts salvation-army-charityevals` all models valid, 0.0052; `npx tsx scripts/simulation-check.ts salvation-army-charityevals` stable (5% 0.572, 50% 1, 95% 1.77 x best guess). normalization-audit not run (verification round).
Previous round: audit-r4 finding 1 resolved (veterans_served * veterans_help_value is now in the services term of the numerator, times @aid_value.inkind_services_vs_cash, and in the denominator).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No findings | - | - | - |

Checks passed:
- **inkind_cash_equivalence.** Numerator: meals * meal_value * food ratio + items * item_value * goods ratio + (day care, medical, trafficking, correctional, disaster, veterans terms) * services ratio. Denominator: the same eight value terms unweighted. The ratio stays a value-weighted blend between 0.7 and 0.8.
- **Same items as value_per_person.** The in-kind bracket of value_per_person lists meals, items, day care, medical, trafficking, correctional, disaster and veterans terms, the same eight as the ratio; bills paid and trial earnings stay outside it. veterans_help_value appears once in value_per_person, so there is no double count.
- **Result and write-up.** check.ts gives 0.0052 (5.239e-6 daly/$), up from 5.238e-6 in round 4, as predicted (below 0.1%). The write-up's headline 0.005, about $30 of help a person and 0.3% are unchanged and still match; "from 0.0051 to 0.0052" still holds.

## Sources checked
None; no inputs or sources changed.

## Drivers
Unchanged from round 3.

Verdict: pass

Re-stamped (16 Nov 2026): Pre-audit cleanup (16 Nov 2026): shared figures read from facts at the same values (@myanmar.household_consumption_share_of_gdp, @survey_consumption.disaster_affected_share_of_survey_mean, @volunteering.disaster_volunteer_ls_gain_year); judgments' reference classes named from sources; volunteer-hours labels name the charity. Values unchanged. Mechanical: headline unchanged, against 6992d133.
