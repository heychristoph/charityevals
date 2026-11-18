# Audit: league-of-women-voters-education-fund-charityevals, round 5
Result: 1.118e-5 daly/$ = 0.01118 years of healthy life per 1,000 dollars (combined range 0.00059–0.213; joint low–high of the model's own ranges 0.0077–0.0193). Verdict: **pass**.
Model-sha: 673cfdefda4e8a4c3b08e722318eca80332b13564653e8c191382a60a30575e0
Rules: 0.2.1
Scope: scoped verification of round 5's change (removal of the side effect `vie_uov` and its chain rows); nothing else re-audited.
Mechanical: audit-model.ts exit 0, Findings (0); `check.ts` all models valid; `simulation-check.ts` stable (5% 0.122, 50% 1, 95% 6.65 x best guess). INV-15 ignored per instructions. normalization-audit not rerun (no standard-step row touched).

(a) Removal is right. The main `vi` branch credits the Education Fund's voter-information dollars (`vi_spend_share` 73%) in the field's yearly cut in the chance of a slide at `@democracy.field_indirect_relative_effect` (`vi_attribution_share = cost_total * vi_spend_share * bs_indirect_relative_effect / bs_field_spending`); the field's denominator already weights turnout drives and civic education at that weight, so "turnout and better-informed votes changing elections" was already inside that cut. `vie_uov` credited the same dollars again through the other-reforms chain. Spend shares partition (`vi_spend_share = 1 - bs_direct_share - maps_spend_share - oth_spend_share`), so no voter-information dollar sits in the maps or other-reform branches. No reference to any removed row (vi_cycle_share, vie_cycle_years, vie_wait, vie_discounted_years, vie_attribution_share, vie_uov, vie_dalys) remains in models, writeups, charities or facts. `uov_bridged` = bs + maps + oth + vi `_uov_adj`; `unmodelled_benefits_adj` has four terms, consistent.

(b) No other double credit found. The `vi_uov` explainer now states the dollars are not credited again in the reform chain, and matches the formulas. The `vi_*` adjustment rows (evidence, counterfactual, attribution, implementation, missing data) are each used once in `vi_total_adj`; the main branch alone is the consistent treatment, as in the family's other models.

(c) Numbers match. Branch shares from the rows (bs, maps, oth, vi over dalys_from_uov): 35.5 / 12.8 / 15.9 / 35.7%, summary and write-up say about 36 / 36 / 13 / 16% (direct, voter information, redistricting, other). Result 0.011 in both (live 0.01118). Write-up drivers sentence matches the tornado order (win_years_counted, missing_data_discount, field_risk_cut_per_year, democratization_gdp_gain, next_dollar, uov_per_daly, loss chance, discount_rate, redistricting_gain_share); summary's four named drivers are ranks 3 to 5 plus win years, with the missing-data discount named separately. "A fifth of a direct dollar" matches `field_indirect_relative_effect` best 0.2; "a third of the result" for voter information matches 36%. The side effect is gone from the voter-information bullet and the side-effects paragraph; the "How this model was checked" line is accurate.

Owner rule (no comparison with other charities, medians or peers): none remains in the summary or write-up (searched for median, peer, other charities, compared, than).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| none | | not applicable | Only rows were removed; no source or input changed. |

## Drivers
1. `$win_years_counted` (shared judgment): 0.0026–0.027.
2. `$missing_data_discount` (shared slider): 0.0022–0.022.
3. `@democracy.field_risk_cut_per_year` (shared judgment): 0.0041–0.039.
4. `@democracy.democratization_gdp_gain` (shared estimate): 0.0038–0.018.
5. `@next_dollar.league_of_women_voters_education_fund` (estimate): 0.0045–0.021.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against f281c102.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 4 rows changed, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, 1 row changed, against 7c76c006.
