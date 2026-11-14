# Audit: brennan-center-for-justice-charityevals, round 9 (scoped: round 8's three lows)

Result: 0.0731755 years of healthy life per $1,000 (7.318e-5 DALYs per dollar), unchanged from round 8 (combined range 0.006718–0.7971); cause median 0.06898 (×1.06). Verdict: pass.
Model-sha: a6b345366ebd3f436f91f7d16a4767876fb4ce0dca6350f5896d124ac2e83c4e
Scope: scoped round, not a re-audit; only dem_years_until_effect's explainer, the field_beyond_institutional fact wording, and the sources of the facts remaining_life_in_prison (facts/incarceration.json) and slide_beyond_income_share (facts/democracy.json).
Mechanical: audit-model findings (0), invariants none; simulation-check stable (5% 0.225, 50% 1, 95% 4.03 × best guess). Normalization-audit not re-run (no structural change since round 8).
Previous round: finding 1 (dem_years_until_effect) resolved (see below); finding 2 (pro bono) resolved; finding 3 (paraphrase vs quote) was optional and is unchanged, still low.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | dem_years_until_effect | The explainer says Protect Democracy's range is "moved half a year later in the work year", which reads backwards: Brennan's work year (to June 2025) is half a year later, so its wait to the same date is half a year shorter. The figures are right. | Brennan 1.5 / 2.5 / 4.5 against Protect Democracy bs_years_until_effect 2 / 3 / 5: all three ends differ by exactly 0.5. | Optional rewording: "Protect Democracy's range (2 / 3 / 5) minus half a year, because the work year is half a year later." | None. |

## Checks of the scope
- dem_years_until_effect: the explainer now says why the figure differs from bs_years_until_effect: same slide-date window (2026 to 2028, middle 2027), measured from a different work year (to June 2025 against calendar 2024). Consistency: 2027 minus mid-2024-to-June-2025 work year gives 2.5 against 3, and the low and high ends (1.5 / 4.5 against 2 / 5) are the same half-year shift, so the ranges are consistent with the stated reason, and the earlier worry that the ends were narrower than Protect Democracy's is gone (all three points shifted by 0.5, same width). Protect Democracy's explainer states the same reconciliation from its side. Resolved. Wait discount at 2.5 against 3 years moves the result under 1%.
- field_beyond_institutional (facts/democracy.json): the source note now lists only what the Democracy Fund report supports (501(c)(4) +13%, p. 16 note 10; individual donors left out, p. 15; 45% more against 8% less, p. 3) and says "The multiple is our judgment." The explainer marks pro bono legal work as "(our judgment)" and the x1.15 for individual donors and pro bono as a judged factor. Resolved.
- remaining_life_in_prison (facts/incarceration.json): `kind: judgment`; title says "charityevals' judgment, anchored on Patterson (2013)'s example: about 10 years of life lost for a man of 30 serving 5 years"; URL pmc.ncbi.nlm.nih.gov/articles/PMC3673515/ (the paper checked in round 8); the note says the 40 years (33 to 47) is our judgment, not from the paper. The 10-years example is consistent with the paper's 2 years of life lost per year served (5 × 2), which the sibling fact quotes verbatim. Verified as an honest judgment source.
- slide_beyond_income_share (facts/democracy.json): doi 10.1017/S0007123408000306 resolves (Cambridge Core) to Helliwell and Huang (2008), How's Your Government? International Evidence Linking Good Government and Well-Being, British Journal of Political Science 38(4), 595-619. Abstract: life satisfaction tracks governance measures more closely than real per capita income, and the weight of electoral democratic institutions rises with development. This supports "beyond income, depending on development" in the explainer. The round 8 audit cited doi ...288 for this paper; ...306 is the right one and the fact has it. The 2026 ARQoL paper (doi 10.1007/s11482-026-10660-0) is named in the note and was not fetched (abstract-level claim, low). The 30% (10 to 100%) is labelled judgment. Verified.
- Result: unchanged, 0.0731755.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| slide_beyond_income_share | doi.org/10.1017/S0007123408000306 | verified | Cambridge Core page: title, authors, journal, volume 38(4), 2008 and the abstract match the fact's claim. |
| remaining_life_in_prison | pmc.ncbi.nlm.nih.gov/articles/PMC3673515/ | judgment | Patterson (2013) checked in round 8; the 40 years is declared our judgment. |
| field_beyond_institutional | democracyfund.org Field in Focus PDF | verified (round 8) | The pages cited (3, 15, 16) were checked then; the wording now matches them and no longer claims pro bono. |

## Drivers
Not re-assessed (scope).

Verdict: pass
