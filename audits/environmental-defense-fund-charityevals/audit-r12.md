# Audit: environmental-defense-fund-charityevals, round 12 (scoped verification of the restated drivers and the INV-4 waivers)
Result: 0.003094 t CO₂e/$ = 0.001369 years of healthy life per $1,000 (combined range 3.083e-5–0.06083); cause median 0.002152 (×0.64). Verdict: pass.
Model-sha: 382a6aa8ed3f2213050872b75309d7600a83d5c81d68608c56b6d2fd0dc8f007
Scope: scoped to what changed since round 11: the summary and write-up drivers, and the INV-4 waivers for usmeth_first_year in src/engine/normalization-waivers.json. Programmes and sources of earlier rounds not re-audited.
Mechanical: audit-model exit 0, "Findings (0)"; normalization-audit: 0 violations anywhere, INV-4 included.
Previous round: the round-11 findings are not re-examined here.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | "it is low because each win is shared…" and "EDF's climate spending is large" grade the result without saying against what; the write-up's own sentence says nothing of the kind. | Model summary | Start the clause "each win is shared with many groups…" and drop "and EDF's climate spending is large". | none |

## Checked
- Waivers: the two entries for `environmental-defense-fund-charityevals usmeth_first_year` (against the power-plant and vehicle rules' final years, both 2024) are a checked false positive: usmeth_first_year is the first year of EPA's methane-rule tonnes (2024 to 2038), a different quantity from the year another rule was final; reason stated; the allowlist stays `{}`. The same entries for Clean Air Task Force and Earthjustice read the same fact the same way.
- Summary: 0.0031 tonnes a dollar (0.003094), about $320 a tonne (1000/3.094 = $323), 0.0014 years of healthy life per $1,000 (0.001369); household money "under 1%" (evaluated +0.7% of the gross-tonne value); compliance costs "about a third off" (−31%); "about two thirds of the gross tonnes from the two methane rules" (EU Methane Regulation 2.09M plus the US methane rule 4.47M of 9.64M tonne-years = 68%).
- Write-up drivers: the two methane rules about two thirds (68%), the Inflation Reduction Act's tonnes about a quarter (24%), the money it won for households under 1% (0.7%), "the repealed rules and MethaneSAT the rest" (power-plant 1.4%, vehicle 3.6%, MethaneSAT 2.9%: 8%), compliance costs about a third off (31%); the headline span 0.0014 and "about $320 a tonne" match; EDF's next-dollar figure (31%, 14% to 71%) is the fact's.

## Drivers
Unchanged: the discount rate, the years a won reform counts, the missing-data discount, deaths per tonne and the shared advocacy share (judgments or estimates); the US methane rule's attribution and counterfactual rows set its 46% of the tonnes.

Verdict: pass (no high or medium finding; one low).
Model-sha: 382a6aa8ed3f2213050872b75309d7600a83d5c81d68608c56b6d2fd0dc8f007
Re-stamped (15 Nov 2026): summary wording only, the round's two lows: no value changed
