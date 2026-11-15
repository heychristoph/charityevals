# Audit: shelterbox-charityevals, round 5 (scoped verification of commit 9e17551)
Result: 2.150e-4 DALYs/$ = 0.2150 years of healthy life per 1,000 dollars (combined range 0.0479-0.9655); unchanged from round 4 (0.214993). Verdict: pass.
Scope: only the methane_share change: new row methane_share and the rewritten bridge row dalys_from_tco2e.

## What was checked
1. methane_share = 0 is right: the only tonnes are tco2e_from_aid (people_reached x value_delivered_per_person x tco2e_per_usd_goods, negated into tco2e_bridged), the CO2 from fuel and materials in making and shipping the aid; no methane source is modelled. The row has format percent, section bridges, and an explainer saying why 0.
2. dalys_from_tco2e is exactly `tco2e_bridged * (<units.tco2e.to_common in assumptions/default.json>) / ($uov_per_daly)`; compared as strings by script (true). The row reads methane_share, air_pollution_weight (0) and extra_deaths_per_tco2e (0) from the model.
3. Result unchanged: headlines.ts gives 0.214993 (before: 0.214993). The write-up's only figure (0.2125 to 0.2150) still matches. check.ts passes (0 expected values, none defined).
4. `scripts/audit-model.ts`: 0 findings; no lint or invariant violation.

## Findings
None.

Verdict: pass
Model-sha: 77b73d9f45c594637e5075575cb837f5aa7013797a21b11e16532fe732c15c39
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)
