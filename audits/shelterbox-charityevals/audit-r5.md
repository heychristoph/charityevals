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
Model-sha: f61dfc52fa14a16f2b9542566f55338e0b1f24322dcc4c457b954462a7b7a646
Rules: 0.3.13
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)
Re-stamped (15 Nov 2026): damage beyond deaths at EPA's 0.6 in the tco2e bridge copy, read through the side-effects weight (2.5, 2.16; mechanical); summary figure updated where it changed

Re-stamped (16 Nov 2026): Typed refugee-relief figures now read shared facts (@humanitarian_response.*, @ukraine.war_affected_aid_recipients_consumption_share) at the same values; judgment explainers anchored on studies and published data (pre-audit gate cleanup). Mechanical: headline unchanged, against 1a9667aa.

Re-stamped (16 Nov 2026): affected_consumption_share reads @survey_consumption.disaster_affected_share_of_survey_mean at the same value (one figure for disaster relief). Values unchanged. Mechanical: headline unchanged, against 2b148c62.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2b370f40.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against c42a537d.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.
