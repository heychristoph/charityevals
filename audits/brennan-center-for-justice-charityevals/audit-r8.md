# Audit: brennan-center-for-justice-charityevals, round 8 (scoped: fourteen rows re-pointed to shared facts)

Result: 0.0731755 years of healthy life per $1,000 (7.318e-5 DALYs per dollar), unchanged from round 7 (combined range 0.006718–0.7971); cause median 0.06898 (×1.06). Verdict: pass.
Model-sha: 7d2db34d867c991674e7b633423b9541a913341d41b5d0072fd5424805f04d6f
Scope: scoped round, not a re-audit; only the fourteen rows moved from typed values to facts/democracy.json and facts/incarceration.json (git diff against HEAD).
Mechanical: lint 0/0/0, invariants none, normalization-audit none (no violation for this model), simulation-check stable (5% 0.225, 50% 1, 95% 4.03 × best guess), check.ts valid.
Previous round: round 7's one low (dem_field_spending explainer) stays resolved; no other change to the model.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | comparability | dem_years_until_effect | Brennan's 1.5 / 2.5 / 4.5 differs from Protect Democracy's bs_years_until_effect 2 / 3 / 5. The difference is justified by the explainers: both count the 2027 midpoint of the 2026-2028 window left in the forecast, and Brennan's work year is the year to June 2025 against Protect Democracy's calendar 2024, half a year later, so 2.5 against 3. The range is a half-year to a year narrower at each end, not explained. | model rows dem_years_until_effect (line 356) and bs_years_until_effect; the 0.5 year centre offset is the whole gap. | Optional: state in the explainer that the range ends are Protect Democracy's (2 / 5) shifted by half a year, or keep the range at 2 / 5 and shift only the best guess. Not blocking. | None at the best guess; sets the wait discount at 2.5 against 3 years, under 1% of the result. |
| 2 | low | source | field_beyond_institutional (fact) | The explainer's "law firms' pro bono work comes on top" is not in the Democracy Fund report; p. 15 does say individual donors are left out. | PDF text: no pro bono mention in the report's pp. 3, 15, 16. | Reword to "individual donors are left out (p. 15)" and call pro bono our judgment, or drop it. | None (value is a judgment). |
| 3 | low | source | field_risk_cut_per_year, slide_beyond_income_share (facts) | The Boese et al. and Helliwell and Huang passages are paraphrases in the explainers, not marked quotes; Helliwell and Huang's abstract says life satisfaction is more closely linked to governance measures than to income and that electoral democratic institutions matter more as development rises, which supports "beyond income, more so in richer countries" but does not state it in those words. | Boese abstract (PMC8336576): "Fifty-nine episodes ... since 1993", "breakdown of 36 democratic regimes", "only one in five democracies manage to avert breakdown". | None needed; optionally add the Helliwell and Huang abstract sentence as `quote`. | None. |

## Checks of the scope
- Re-pointing: all fourteen model rows (dem_severity_share, dem_evidence_adj, dem_field_cut, dem_reversal_rate, dem_field_beyond_institutional, dem_field_direct_share, dem_indirect_relative_effect, dem_ue_nonincome, dem_ue_violence, dem_ue_abroad, dem_ue_backlash, jus_life_years_lost, jus_remaining_life, jus_years_until_deaths) carry only `formula` `@democracy.<fact>` or `@incarceration.<fact>`; no typed value or kind remains. Verified: PASS.
- Values: every fact's low / best / high equals the model's old HEAD value (0.3/0.6/1; 0.5/0.8/1; 0.005/0.045/0.2; 0.02/0.05/0.1; 1.2/1.5/2.2; 0.2/0.4/0.7; 0/0.2/0.5; 0.1/0.3/1; 0/0.05/0.2; 0/0.2/0.6; -0.15/-0.05/0; 0.5/2/3; 33/40/47; 1/3/8). Verified: PASS. The backlash row lost its `shape: "normal"`; the fact has none either, and the result is unchanged at 0.0731755 (headlines.ts).
- Side-effect tags: dem_ue_backlash, dem_ue_nonincome, dem_ue_violence and dem_ue_abroad keep `side_effect: "added"`; the slider still moves them. PASS.
- Result: unchanged, 0.0731755 before and after.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| slide_severity_share, democracy_effect_external_validity | economics.mit.edu Acemoglu et al. 2019 PDF | verified | Journal p. 54: a country is democratic "if Freedom House codes it as 'free' or 'partially free' and Polity IV assigns it a positive score"; panel of 175 countries 1960-2010. The 60% and 0.8 are labelled judgments. |
| slide_reversal_rate | doi 10.1080/13510347.2024.2448742 | verified | Abstract (PDF copy): "52% of all autocratization episodes become U-Turns, which increases to 73% when focusing on the last 30 years"; "The vast majority of U-Turns (90%) lead to restored or even improved levels of democracy". Quote verbatim. |
| field_risk_cut_per_year, slide_global_spillover_share, slide_violence_share | doi 10.1080/13510347.2021.1891413 (PMC8336576) | verified | Abstract: 59 episodes since 1993, 36 breakdowns, "only one in five democracies manage to avert breakdown"; judicial constraints and democratic stock matter. The size of each share is a labelled judgment. |
| slide_beyond_income_share | doi 10.1017/S0007123408000288 | verified (abstract via search) | Life satisfaction more closely linked to governance quality than to income; the weight of electoral democracy rises with development. The 2026 ARQoL paper (doi 10.1007/s11482-026-10660-0) was not fetched; low. |
| field_beyond_institutional, field_direct_share | Democracy Fund Field in Focus PDF | verified | p. 16 note 10: including 501(c)(4) funding raises 2021-2022 total "to $7.8 billion, rather than $6.9 billion" (+13%); p. 15 individual donors not accounted for; p. 3: "45 percent of survey respondents planning to increase funding and just 8 percent planning to decrease it"; p. 15 Candid taxonomy caveat. Pro bono: see finding 2. |
| life_years_lost_per_year_incarcerated, years_until_prison_deaths | pmc.ncbi.nlm.nih.gov/articles/PMC3673515/ | verified | "Each additional year in prison produced a 15.6% increase in the odds of death for parolees"; "a 2-year decline in life expectancy for each year served in prison"; "The risk was highest upon release from prison and declined over time." The model's quote joins the two with "which translated to"; the substance matches. |
| remaining_life_in_prison | same | judgment | Source line is Patterson (2013) plus BJS age mix; labelled judgment, not a measurement. |

## Drivers
Not re-assessed (scope). The moved drivers: field_risk_cut_per_year (judgment, anchored on Boese et al. and the nuclear-security cut; the biggest uncertainty), slide_severity_share and democracy_effect_external_validity (judgments, anchored on Acemoglu et al.), and the three prison figures (one estimate, two judgments). They now come from shared facts, so Protect Democracy and Prison Policy Initiative read the same values.

Verdict: pass
