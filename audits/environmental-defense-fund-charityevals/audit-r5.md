Result: 0.004353 tco2e/$ = 0.001899 years of healthy life per 1,000 dollars (combined range 7.8e-5–0.046), up from 0.001846 in round 4. Verdict: pass.
Scope: scoped verification of (1) the vehicle smoke factor's high end 0.10 to 0.11, (2) the Inflation Reduction Act's methane part in methane_share and out of fuel_share, (3) the act's fuel tonnes weighted by sector in fuel_smoke_factor, (4) the headline 0.0018 to 0.0019. Unchanged rows not re-audited.
Mechanical: audit-model.ts 0 findings (warnings as before: wide range, judgment share); check.ts all valid.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | facts climate.ira_power_share_2030 | The Bistline et al. 2023 figure (38-80%, 64% average) could not be checked against the paper: science.org returns 403 and the arXiv/EPRI PDFs could not be text-extracted here. The paper, nine models and its general finding that power dominates are confirmed by search results; the numbers are not. | WebFetch 403 / binary PDF | Re-check the figure against the arXiv version (2307.01443) when a PDF reader is at hand | none now |

## Checked
- methane_share: numerator adds ira_expected_tonnes * ira_methane_share_2030 to the two methane rules and MethaneSAT; denominator is the full sum, unchanged.
- fuel_share: ira term is ira_expected_tonnes * (1 - share); same denominator. So methane_share + fuel_share = 1 for every input: the act's tonnes are split once, no double counting, no loss.
- fuel_smoke_factor: the act's fuel tonnes ira * (1 - m) are weighted at p * us_power_smoke_factor + (1 - p) * us_vehicle_smoke_factor; the denominator is pwr + veh + ira * (1 - m), the same fuel tonnes fuel_share uses. Consistent. The coal-power and vehicle terms are unchanged.
- Facts: ira_methane_share_2030 is kind judgment, 5% (2%-12%), source CRS R48475 with a note on the charge and grants, explainer gives the reason (energy-CO2 models, methane provisions of tens of millions of tonnes a year, repeal sits in the delivered share). ira_power_share_2030 is kind estimate, Bistline et al. 2023 Science 380:1324, with page, note and explainer stating its use. Both carry a retrieved date and low/best/high ordering is valid. The 5% sits plausibly against tens of millions of tonnes on about 900 Mt (about 3-6%).
- Smoke factor high end 0.11: the fact's value and the explainer's "(0.02 to 0.11)" agree; best unchanged.
- Headline: audit-model.ts gives 0.001899, so the summary and write-up "0.0019" are right. The write-up's other figure (health and nature work, 0.0019) is the sibling model's and untouched. Tonnes per dollar unchanged at 0.004353 as expected (the shares change only health weights, not CO2e).
- Effect size: +2.9% against round 4 (0.001846), well under 2x, in the expected direction (the act's methane part now valued at methane's own warming and ozone, cars partly replacing power in the smoke factor).
- check.ts: all valid.

## Findings settled
None open besides the low-severity source check above.

## Sources checked
CRS R48475 and Bistline et al. not re-fetched (Bistline unreachable, see finding 1).

Verdict: **pass**
Model-sha: 0f69c1be619d3c56cf3066c82adacfff2eb6d3ece9e9f92ae45fb5c5f6fe2a8d
