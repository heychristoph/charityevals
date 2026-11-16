# Audit: silverlining-charityevals, round 4 (scoped verification of rule 2.23 and the 15 Nov fix-ups)
Result: 0.9885 tco2e/$ = 0.1944 years of healthy life per 1,000 dollars (combined range 0.0016-24.0 tco2e/$); cause median 0.001421 (x137, unchanged cause, see round 3). Verdict: pass
Model-sha: 24c12b93b1ced5e08cf8debd307e705d92fe4d55e1eca251ea1ff1a49bacd15e
Scope: commit 7e73f6cd only: new rows `public_payer_uov_per_dollar`, `pol_public_cost_uov`, `public_cost_uov_per_year`, `tco2e_from_uov` (new `bridges` section), `outcome_total` (+ `tco2e_from_uov`); the non-death damage change (0.6, side effect) as it reaches the bridge copy; the summary and write-up sentences stating the result.
Mechanical: lint 0 high / 1 medium (outlier, reason given in the summary, as round 3) / 1 low; invariants none; `check.ts` all models valid; normalization-audit not re-run (brief did not ask).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | No high or medium finding. | See below. | | |

## Checks made
- `public_payer_uov_per_dollar` = 1.2 x 1.4427 (`$uov_per_ln_consumption`, whose displayed 0.693 is the factor on the doubling scale) / (1.4 x 32,723) = 3.779e-5 units of value per dollar; the engine's value 3.7790e-5 matches. Reads only shared figures (`@public_funds.mcpf`, `us_federal_payer_multiple`, `@united_states.ce_expenditure_per_person_2024`), federal taxpayers on the survey scale as rule 2.23 and 2.14 say.
- `pol_public_cost_uov` = -(4.51e6 x 3.779e-5 = 170.4) x 0.3 (`pol_p_success`) x 4.6299 (`discounted_years` = years_pv x wait_discount, same row the branch's tonnes use; wait is 0 years) x 0.7 (counterfactual) x 0.4622 (attribution) x 0.5 (missing data) = -38.29; engine -38.293. Money is `noaa_srm_dollars` (the same dollars `pol_downstream` multiplies, 55% of the $8.2M yearly line), a fixed appropriation, so it takes `pol_total_adj` less `evidence_adj` and not `timing_adj` (a benefit-timing step), exactly the 2.23 and families/climate.md recipe. `pol_other_outputs_ratio` rightly absent (it scales research value, not money). No double count: the money is the federal payers' loss, not part of SilverLining's `cost_total`; the 0.7 counterfactual concerns displaced research value and is a different question.
- `public_cost_uov_per_year` = -38.293 / 6 (`period_years`) = -6.382, as `outcome_total` is per year of the period. ✓.
- `tco2e_from_uov`: the denominator is character-identical to the copy in Carbon180's model (heat part with `1 + $side_effect_weight * @climate.nondeath_damages_vs_deaths` once, methane and air-pollution terms, `$life_value_multiplier`); the bridge form `<input> / <unit uov per tonne>` of rule 2.6. Gives -16,228 t; against 6.177e6 t before it, -0.26%, so 0.1949 -> 0.1944, matching "0.195 -> 0.194" in 2.23. Sign negative (net harm, allowed).
- The x1.6 from non-death damage (0.122 -> 0.195) enters only through the conversion, as 2.5 states; tonnes (0.99 t/$, "about $1 a tonne" in the write-up) unchanged by it.
- Summary and write-up: 0.19 matches the live 0.1944; the rewritten "What isn't modelled" sentence no longer says non-death damage is zero and now lists only crops and tipping points, which are cooling's own effects, not counted; no comparison with other charities, medians or peers in either text (the lint's `comparison` code is clean).
- Low, no fix needed: the write-up does not mention the cost of public money; adding a line would add text, so leave it.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `@public_funds.mcpf`, `us_federal_payer_multiple` | facts/public_funds.json (judgments, Dahlby 2008 anchor) | not new to this commit | read as shared; no input of this model |
| `@united_states.ce_expenditure_per_person_2024` | https://www.bls.gov/news.release/archives/cesan_12192025.htm | not re-fetched | existing shared fact, quote $78,535 per consumer unit / 2.4 people = 32,723 checked arithmetically |
| `noaa_srm_dollars` inputs | unchanged | not in scope | used as the branch's own dollars |

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 1a9667aa.
