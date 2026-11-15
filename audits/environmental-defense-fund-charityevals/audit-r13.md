# Audit: environmental-defense-fund-charityevals, round 13 (scoped verification of rule 2.23 and the 15 Nov fix-ups)
Result: 0.001792 t CO₂e/$ = 0.001033 years of healthy life per $1,000 (combined range 2.109e-6–0.5056), against 0.0020 after the non-death change (about -48%). Verdict: fail.
Model-sha: 83d541d0a1472b28ecc2ee6f91d3b3c4235c2bb478901934da6c0d41119e6a0c
Scope: the rows added or changed by commit 7e73f6cd: ira_public_usd_per_year, ira_public_cost_uov, uov_counted_per_year, the bridge row tco2e_from_uov (the 0.6 side-effect form), the summary and the write-up sentences stating the result. Programmes and sources of earlier rounds not re-audited.
Mechanical: audit-model exit 0, "Findings (0)" (warns only: range runs from harm to good; judgment share 84%); check.ts all valid.
Previous round: round 12's one low (summary wording) was fixed earlier; not re-examined.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | summary; write-up Summary | The summary still says a dollar "averts about 0.0031 tonnes of CO₂e (about $320 a tonne), after" the money rows. The result is now 0.001792 tonnes a dollar (tco2e_per_donor_dollar), $558 a tonne; the write-up's "about $320 a tonne of CO₂e, less what the Inflation Reduction Act's public money costs taxpayers" repeats it. | tco2e_per_dollar 0.005779 × marginal 0.31 = 0.001792; the law's public money alone takes tco2e_from_uov from about -0.74M to -1.87M tonnes. | Summary: "averts about 0.0018 tonnes of CO₂e (about $560 a tonne)"; write-up: "about $560 a tonne of CO₂e, after what the Inflation Reduction Act's public money costs taxpayers". | none |
| 2 | medium | presentation | write-up "What drives the result" (Climate) | Says the won rules' compliance costs "take about a third off" and does not mention the law's public money. At the defaults (tonnes per uov 867.6): compliance -868 uov a year = 0.75M of 3.13M gross tonne-years = 24%; the law's public money -1,310 uov a year = 1.12M = 36%; households +20 uov = +0.6%. | Rows ira_public_cost_uov -5,242 /4, compliance_uov_per_year -868.2, ira_transfer_uov_per_year +20.2, tco2e_from_uov -1,872,527. | Replace the clause with "the won rules' compliance costs take about a quarter off and the law's public money, which costs taxpayers, about a third". | none |

## Sources checked
- ira_public_usd_per_year: 65e9 × (1-0.15) - 60e6 × $85 = 55.25e9 - 5.10e9 = $50.15e9 (evaluated 50,150,000,000). The household share is removed once (the rebate and credit rows value that money as recipients' gain less taxpayers' cost); the 45Q money is removed with exactly the tonnes the row ira_tonnes_per_year drops (ira_45q_capture_tco2_per_year, 60M t a year); no double netting. The household rows weigh EDF's share at ira_household_focus_adj 0.5 while the 15% is removed from the public row at full share: no double count, a slight under-netting (at most a few percent of the public cost), acceptable.
- ira_public_cost_uov: -50.15e9 × 2.6194e-5 (mcpf 1.2 / (1.4 × $32,723)) × 1.4427 × 0.3 × 4.116 × 0.00224 = -5,241.9 (evaluated). The factors p_success, discounted_years and ira_total_adj are those of ira_downstream in outcome_total (ira_downstream × ira_total_adj), including evidence and delivered share, as rule 2.23 says for money paid per unit built; payer figure is the US federal one (ce_expenditure_per_person_2024, us_federal_payer_multiple), as the home rows. Divided by period_years in uov_counted_per_year like the other two terms.
- tco2e_from_uov: the 0.6 side effect enters as `1 + $side_effect_weight × @climate.nondeath_damages_vs_deaths`, the unit's conversion form; the rest unchanged.
- Facts: CRFB (6 July 2023) fetched: "have risen by about two-thirds, to $660 billion through 2031 and to $790 billion through 2033" present; (790 - 660)/2 = $65 billion a year. 26 U.S.C. 45Q fetched: "12-year period beginning on the date the equipment was originally placed in service", "substituting “$36” for “$17”", "multiplied by 5" present ($85, $180 per tonne). ira_household_cost_share is a judgment with its arithmetic shown (8.4 + 8.8 spread over years against 65).
- Result: 0.0020 → 0.0010 follows from the rule: net uov per year goes from -848 to -2,158 against a gross of about 3,600 uov a year; the tornado shows the law's cost at its low and high ends moving the result 0.0014 to 0.0002.
- Summary and write-up headline 0.0010 match 0.001033; no comparison with other charities.

## Drivers
The law's public money (36% of the gross tonnes' value) is now the largest deduction; the cost figure, the payer multiple and the law's attribution share set it.

Verdict: fail (two medium findings, both wording: the stale tonnes and dollars a tonne, and the drivers sentence).
Model-sha: 83d541d0a1472b28ecc2ee6f91d3b3c4235c2bb478901934da6c0d41119e6a0c
