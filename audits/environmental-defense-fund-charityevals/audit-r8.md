# Audit: environmental-defense-fund-charityevals, round 8
Result: 0.004457 tco2e/$ = 0.001973 years of healthy life per 1,000 dollars (combined range 8.7e-5 to 0.0448); cause median 0.001672 (x1.18), against 0.001967 in round 7. Verdict: pass.
Scope: scoped verification of the change that removed the side-effect slider voc_health_share (+1.5%) and counts the EPA oil and gas methane rule's local smog deaths through extra_deaths_per_tco2e and the new row voc_deaths_per_year. Unchanged rows not re-audited.
Mechanical: audit-model.ts 0 findings; check.ts all valid; summaries + simulation-check stable (5% 0.22, 50% 1, 95% 4.37 x best guess); normalization-audit: none for this model after the fix to finding 1 (re-run, generated restored).
Previous round: round 7 had no findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | high (fixed, re-verified) | normalization | extra_deaths_per_tco2e | INV-10 fails: the headline is not proportional to $deaths_per_tco2e. The audit holds methane_share at 0 for this check, but the new formula uses the US methane rule's share of all six expected tonnes, not methane_share, so the direct deaths stay while the slider is moved. | normalization-audit: "$deaths_per_tco2e linear: 0.000696364 at default, 0.00103017 at x1.5 (47.9358%)" | Write the share through methane_share, which is the same number: `methane_share * (usmeth_expected_tonnes / (eumr_expected_tonnes + usmeth_expected_tonnes + msat_expected_tonnes + ira_expected_tonnes * @climate.ira_methane_share_2030)) * voc_deaths_per_year / usmeth_tonnes_per_year` (this is earthjustice's form, methane_share * voc_deaths_per_year / usmeth_tonnes_per_year, with methane_share's methane-only part). Then re-run normalization-audit. | None at defaults (algebraically identical); clears the violation |

## Checked
- Formula and units: voc_deaths_per_year (deaths / year) / usmeth_tonnes_per_year (t CO2e / year) = deaths per tonne of the rule's own methane; times usmeth_expected_tonnes / sum of the six expected tonnes = the rule's share of the model's average tonne. extra_deaths_per_tco2e is therefore deaths per average tonne, which is what the shared conversion (normalization.md line 261) expects. The rule's tonnes per year use the same 2024-2038 window as the EPA's 2028-2038 death range; ok. The share is taken on expected tonnes before waits, as methane_share is, and the deaths then share the tonnes' downstream credit, waits and period spreading through outcome_total. Not double-counted with the wait: the numerator is deaths per year over tonnes per year, both undiscounted.
- No double count: the shared conversion's methane ozone (@climate.ozone_deaths_per_tco2e_methane, via methane_share) is ozone formed from methane itself; the EPA figure is ozone from the rule's volatile organic compound cuts, a separate pollutant. Earthjustice does the same. The explainer states the split. No other share (unmodelled_benefits_adj, total_adj) covers it; voc_health_share is gone from outcome_total and from every reader (grep: no remaining reference in the model).
- outcome_total: (1 + unmodelled_benefits_adj) only; explainer matches.
- Shared fact climate.us_oil_gas_methane_rule_voc_deaths_per_year: 56 / 65 / 74, estimate, source the EPA RIA (2023) Tables 3-8 and 3-9, pp. 3-47 to 3-48, note "56 (2028) to 74 (2038)", retrieved date present; the best guess is the midpoint of the EPA's range. The same fact is read by earthjustice and sierra-club-foundation and the previous voc_health_share explainer cited the same tables. The EPA PDF was not re-fetched this round (checked in the earlier rounds of the Clean Air Task Force and Earthjustice audits).
- Result: 0.001967 to 0.001973 (+0.3%). The old +1.5% share was an eighth-of-heat-death guess; the direct count (65 deaths a year x the rule's ~13% of expected tonnes... per tonne, valued at air-pollution ages) is smaller, so a small rise instead of +1.5% is plausible: the share is already carried in the old headline's 0.001967 at +1.5% and the new figure keeps the same magnitude. Sits at x1.18 of the cause median; no peer gap. Headline in summary and write-up (0.0020, $220 a tonne) still agree (0.00197 rounds to 0.0020).
- The row voc_deaths_per_year reads the shared fact (`@climate...`), no retyped number; no lint finding.

## Sources checked
None re-fetched this round (see above).

Verdict: pass
Model-sha: 26a1e288b6ba5a848b81cb6247e3683074c51ced04255ce31e8ecb563f8cceee
