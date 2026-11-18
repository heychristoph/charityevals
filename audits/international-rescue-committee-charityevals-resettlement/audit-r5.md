# Audit: international-rescue-committee-charityevals-resettlement, round 5

Result: 8.355e-6 daly/$ = 0.00836 years of healthy life per $1,000 (combined range 0.00165-0.0423). Verdict: **pass** (no findings above low; none open).
Model-sha: f3a2eaa04eb1f368719c2ff1c962bf1c86c7c5f0ad705a518eba22c78a6f7d22
Rules: 0.3.0

Scope: scoped verification of one change since round 4 (`git diff d38a65b~1`): `legal_undocumented_ln_gap` changed from a model-own judgment 0.15 (0.05-0.35) to the shared fact `@united_states.legal_status_ln_consumption_gain` (0.1, 0.04-0.25). The beneficiaries field was only reformatted.

Mechanical: `audit-model.ts` bottom line 8.355e-6 daly/$ (0.00836), combined range 0.001649-0.04234; it was 0.00848 before, a move of -1.5%, as expected for a gap row that applies only to the non-removal half of lost legal cases. 0 findings from the script.

Checks:
- Same concept: yes. The row's label is the yearly gain in ln(consumption) from status for someone who would have stayed without it; `legal_ln_gain_per_case` weights it by (1 - `legal_removal_share`) over `pv_annuity_due(legal_years)`, the stayed-undocumented branch. The shared fact's label, "for an immigrant who would otherwise stay in the US undocumented", is the same quantity.
- Fact sound and sourced: 0.1 (0.04-0.25) is a judgment with a source block (Kossoudji & Cobb-Clark 2002, doi:10.1086/339611, the DOI confirmed in round 3; the quote of the 6% wage benefit matches the abstract figure confirmed in round 4). The explainer cites the 6% and 14-24% figures and Pan (2010) at about 5%; 0.1 sits above the wage-only estimates and below the full penalty plus benefits. The range is slightly lower than the old 0.05-0.35 (high 0.25), which is defensible: the full unauthorised penalty of 14-24% is ln 0.13-0.22, and 0.25 adds benefits on top. I did not re-fetch the publisher page (403 in rounds 3-4).
- Double counting: none. The removal-relief gain sits in the other branch (`legal_ln_gain_per_year`, staying vs returning, weighted by `legal_removal_share`); the shared fact's explainer states that relief from the risk of removal is not in it. The row is not used elsewhere in the model (only line `legal_ln_gain_per_case`). Reunification and services chains do not read it.
- Result change: -1.5%, no driver reordering; tornado unchanged in kind.

No new findings.

Verdict: **pass** (no findings; the swap to the shared fact is the same concept, sourced, and moves the result by -1.5%).
Model-sha: f3a2eaa04eb1f368719c2ff1c962bf1c86c7c5f0ad705a518eba22c78a6f7d22

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against e247896f.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against d150f0b2.
