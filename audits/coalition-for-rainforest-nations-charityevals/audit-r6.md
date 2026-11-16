# Audit: coalition-for-rainforest-nations-charityevals, round 6 (scoped verification of rule 2.23 and the 15 Nov fix-ups)

Result: -0.0212 -> -0.0244 years per $1,000 (commit 7e73f6cd), reproduced at the defaults; no high or medium finding.

Verdict: pass

Model-sha: 276960f00abdaa7e679086ffd12b3378c141389b4f1dbb6acfc0202369b61482

Scope: the rows changed in 7e73f6cd (`donor_payer_uov_per_dollar`, `fin_uov_per_year`, `rbf_payer_uov`, `itmo_payer_uov`, `uov_bridged`, `rbf_dalys_raw`, `itmo_dalys_raw`), the summary and write-up sentences that state the result, and the bridge formula of `climate_dalys` against the unit's conversion for the 0.6 non-death damage (mechanical).

Mechanical: `scripts/check.ts` passes ("all models valid"); `scripts/audit-model.ts` runs clean with 2 LOW findings, both unchanged from round 5 (unused `hectares_protected`; wide joint spread, stated in the summary). Defaults reproduce: `dalys_per_dollar` -2.439e-5, i.e. -0.0244 per $1,000; with `donor_payer_uov_per_dollar` set to 0 the same model gives -0.0212, so the change is exactly the payer rows. The bridge's `(1 + $side_effect_weight * @climate.nondeath_damages_vs_deaths)` is the same text as the unit's conversion.

| Severity | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|
| low | summary, write-up | Neither says that the finance goal's new money also costs the donors' taxpayers (about 6% of the finance branch's loss). "Nearly all of it is the finance goal" and "aid lost slightly outweighs..." still read right. | Gross finance value -3.05e6 uov a year, payer term -1.75e5. | None needed (less text); optionally nothing. | none |
| low | summary | "Zero at about half new, positive above" still holds: break-even moved from about 47% to about 48% new (headline +0.0059 at 50%, -0.0244 at 40%). | Re-run at `fin_new_aid_share` 0.4, 0.5, 0.55, 0.6, 0.7: -0.0244, 0.0059, 0.0210, 0.0361, 0.0664. | None. | none |

Checks, all passing:
- `donor_payer_uov_per_dollar` = 1.2 x (1/ln 2) / (1.4 x 32,412 x 0.842) = 4.531e-5 uov per $; follows 2.23 (mcpf over payer multiple x consumption on the survey scale, rich donors at `consumption_per_person_2024 x survey_to_na_gbr`). The US federal multiple as stand-in is stated as judgment in the explainer.
- `rbf_payer_uov` = -460e6 x 4.531e-5 x 0.9246 = -19,271 (matches). Same `protection_years` (wait and discounting) as `rbf_tco2e`. Bridged with `rbf_credit / rbf_evidence_adj`: all adjustments of the branch (attribution, delivery, missing data, next dollar) except the evidence step; correct, as the payments are a fixed sum (committed $460m a year) and the evidence step shrinks the tonnes per dollar, not the dollars.
- `itmo_payer_uov` = -200e6 x 0.5 x 4.531e-5 x 0.9246 = -4,189 (matches); only the country-buyer share (companies' purchases are their own money). `itmo_evidence_adj` is 1 and the evidence step sits inside the forest tonnes, so `itmo_credit` unchanged is consistent.
- `fin_uov_per_year`: new money for all uses (adaptation and mitigation) x payer cost; moved money costs taxpayers nothing more; scales through `fin_p_success`, `fin_years`, `fin_credit` with the aid term, no double count (the finance branch's weight row `fin_dalys_raw` reads `fin_uov`, so needs no change).
- `uov_bridged` = 0 (livelihood) + 1.122 + 1.122 - 392.38 - 6.81 - 3.40 = -400.35 vs the model's -400.37 (rounding); `dalys_from_uov` -200.2. No other row reads the payer rows (no double counting with the tonnes).
- `rbf_dalys_raw`, `itmo_dalys_raw`: weights include the payer rows, for the averages only.
- Summary and write-up: the headline figure renders -0.02 (-0.0244); "harmful in about three draws of five": simulation gives 64% of 4,000 draws at or below zero; no comparison with other charities.

## Sources checked

- facts/public_funds.json `mcpf` (1.2, judgment) and `us_federal_payer_multiple` (1.4, judgment): read, as 2.23 and the explainer state.
- facts/united_kingdom.json `consumption_per_person_2024` (32,412, World Bank NE.CON.PRVT.CD / SP.POP.TOTL) and facts/survey_consumption.json `survey_to_na_gbr` (best 0.842): exist and are read as 2.23 prescribes; unchanged since earlier rounds.
- docs/normalization.md 2.23 and 2.5 ("Damage beyond deaths"); climate recipe "Public money". No new observed or estimate input in this model to fetch.

Re-stamped (16 Nov 2026): Why the simulation is too wide to use, said in outcome_total's explainer (normalization.md 2.18); values unchanged. Mechanical: headline unchanged, against 1a9667aa.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 8904b83b.
