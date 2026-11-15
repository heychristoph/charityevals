# Audit r4: Union of Concerned Scientists (climate, transport and western states)

Result: 0.006919 tCO2e/$ = 0.001796 years of healthy life per $1,000 (combined range 0.00006-0.055; model's own ranges 0.00026-0.0089); cause median 0.002238 (x0.80). Verdict: pass.
Model-sha: c6e1c464911811a35a8da669a87b0b2ea14f0a9b433fbaf55a74bc4da0628d53
Scope: only what HEAD (53b88fe) changed: the public-money branch for the Inflation Reduction Act's home rebates and credits (rows `ira_payer_cost_per_dollar`, `ira_rebate_uov`, `ira_credit_years_counted`, `ira_credit_uov`, `ira_household_focus_adj`, `ira_transfer_uov_per_year`, bridge `tco2e_from_uov`, `outcome_total`), the shared `climate.ira_home_*` facts as read here, summary, beneficiaries (and scripts/beneficiary-countries.ts), write-up figures. Rest of the model not re-opened.
Mechanical: lint 0/0/0 (audit-model findings: 0), invariants none, normalization-audit none for this model, check.ts all models valid.
Previous round: r3 had no findings.

## Checks
- Build against Rewiring America's branch: the formulas of `payer_cost_per_dollar`, `rebate_uov`, `credit_years_counted`, `credit_uov` are identical; recomputed values match RA's to all digits (payer cost 1.4648e-5, rebate 204,203 uov, credit 236,728 uov). `ira_transfer_uov_per_year` uses one attribution x focus (0.01 x 0.5) where RA uses 0.35 (rebates) and 0.1 (credits) shares; p_success 0.3, `ira_counterfactual_adj` 0.8, missing-data 0.5, /4 years the same. Result 66.14 uov a year.
- Double counting: the money is a separate channel from the tonnes (2% of the act's tonnes are home provisions, per the focus explainer; the heat-pump tonnes and the transfer are different goods, as in RA). `unmodelled_benefits_adj` multiplies only the tonnes sum (`tco2e_from_uov` is added outside the factor), and that row lists other state laws and accountability science, not the act's money. No double count.
- Bridge: `tco2e_from_uov = ira_transfer_uov_per_year / (tco2e to_common)` has RA's form exactly (input x 1 uov / tonnes conversion), in section `bridges` (`ours`), reading the model's own `methane_share`, `air_pollution_weight`, `extra_deaths_per_tco2e` under the conversion-row rule. Lint and INV-2b/INV-10 pass; the part brought in moves with `$uov_per_ln_consumption` and not with the climate sliders.
- Move: with `ira_household_focus_adj` 0 the result is 0.001463 (matches r3), so the branch adds 0.000333, 0.001463 to 0.001796 (+22.8%). Bridge share of tonnes 127,404 of 688,092 = 18.5%: beneficiaries USA 18.5% / world 81.5% right at defaults (beneficiary-countries.ts entry and model note agree).
- Summary/write-up: 0.0018 (summary, write-up headline figure), "adds about a fifth" (18.5%), "act gives about three-fifths" (act's years: 0.000775 + 0.000333 = 0.001108, 62% of 0.001796), EDF 0.0021 (live 0.002067), CATF 0.0067 (0.006699): all match. "About three-fifths ... a fifth from the public money" in the write-up matches.
- Sensitivity of the new judgment: focus 1 gives about 0.0021 (+19%), 0.2 gives about 0.0016 (-11%).

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | ira_household_focus_adj | The judgment (0.5, 0.2-1) is worded identically to EDF's row with the name swapped and has no UCS-specific source; its premise, that the home provisions were Rewiring America's and the solar industry's asks and UCS's part was clean-power and farm analyses plus support for the whole package, rests on the existing `ira_attribution_share_shared` explainer and the annual report (pp. 8-11, cited elsewhere in the model), which I could not render here (no PDF tools; WebFetch returned raw bytes). The anchor (half its whole-law share, within the whole-law range 0.3-3%) is a stated reference class, so not medium. | Model row; r2 audit's anchoring of the 1% on EDF's 2%. | Add a `source` to the row quoting the annual report passage on UCS's IRA work (and, if the report names distributed solar or efficiency work, raise or lower the 0.5 accordingly). | -11% to +19% across its range |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| ira_household_focus_adj (premise) | ucs.org 2025 annual report PDF | unreachable as text | PDF could not be rendered; not verified |
| @climate.ira_home_* (facts, as read by this branch) | various | not re-fetched | identical reads and values to Rewiring America's model, audited in its own rounds |

## Drivers
Top inputs for the new branch: the focus judgment (0.5), `ira_attribution_share_shared` (1%, judgment anchored on EDF's 2%), `$win_years_counted` (caps credits at 3), the shared recipient consumption ratios (judgments) and `ira_home_rebates_paid_share` (judgment). Best improvement: a UCS-specific source for the focus share.

Verdict: pass

Re-stamped (15 Nov 2026): one consumption scale for US public money (normalization.md 2.14); 0.0018 → 0.00151.
