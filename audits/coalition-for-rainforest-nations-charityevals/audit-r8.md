# Audit round 8 (scoped verification): Coalition for Rainforest Nations

Result: -0.02525 years per $1,000 at the defaults (mobiliser share 100%), the same as round 7 states (-0.02525); a net-harm result, kept negative.

Verdict: pass

Model-sha: 318b438e0d9363b08c648239ef753ff168346ea432f71d9229bd94227fce5a3e
Rules: 0.1.1

## Scope

The mechanical rewiring after round 7 (credit rule 2.24, step 5): rows no longer read removed (`forest_country_redd_2010_2021`, `forest_country_spent_vs_donors`, `redd_resources_per_rbp_dollar`), the `rbp_committed_2010_2021` explainer, and the branch weights kept free of the mobiliser's share (`*_credit_before_shared`, `*_total_adj`, the averages for reading). Nothing else is re-audited.

## Checked

1. Used shares. `rbf_attribution_share` = `rbf_attribution_share_shared * mobiliser_share`, `itmo_attribution_share` = `itmo_attribution_share_shared * mobiliser_share`, `fin_attribution_share` = `fin_attribution_share_shared * mobiliser_share`; all three are `credit: win`, the mobiliser's share enters once each. `*_total_adj` reads the used share (with the mobiliser's share); `*_credit_before_shared` reads the `_shared` share, so the weights are free of it. Each `*_credit` is `*_total_adj * marginal_vs_past_average`; no row multiplies the mobiliser's share a second time.
2. Weighting and averaging rows. `tco2e_weight_total`, `fuel_share`, `fin_fuel_share` read `*_credit_before_shared` (the mobiliser's share cancels across branches; the values are identical at 100% and 50%: 52,580, -0.4427, 1.1503). `*_dalys_raw` weights are the same at both settings (7,369; 6,677; 264,503). The averages for reading (`attribution_share_shared`, `attribution_share`, `total_adj`, ...) read nothing upstream.
3. Costs inside the share. Run with `mobiliser_share=0.5` against the default: `rbf_credit` 4.858e-4 to 2.429e-4, `itmo_credit` 2.235e-3 to 1.117e-3, `fin_credit` 4.048e-4 to 2.024e-4 (each halved); `uov_bridged` -414.31 to -207.16 and `tco2e_bridged` 38,797 to 19,399 (halved, so the payer rows `rbf_payer_uov` and `itmo_payer_uov`, which are credited by `rbf_credit` and `itmo_credit` in `uov_bridged`, move with the share); headline -0.025250 to -0.012625 (exactly half), -0.007575 at 0.3 (0.3 x). This model has no `*_public_cost_uov` or `*_compliance_uov` rows; the payer rows are the cost of mobilised resources, and they sit inside the share.
4. Headline. `scripts/headlines.ts`: -0.0252504, equal to round 7's -0.02525; the rewiring moved nothing at the default.
5. Rows read. A script listing every row id that no formula or text placeholder reads gives only the rows for reading (the branch averages, `tco2e_per_hectare_year`, `annual_risk_reduction`), each labelled as such, plus section headings. The three removed rows appear nowhere in the model or the write-up (0 hits). `redd_support_per_rbp_dollar` is read by both `*_attribution_share_shared` rows. The `rbp_committed_2010_2021` explainer now says "the support row below sets CfRN's spending against the readiness support" (round 7 finding 2 fixed).
6. `scripts/preflight.ts`: passes (low simulation notes only).

## Findings

None.

Verdict: pass
Model-sha: 318b438e0d9363b08c648239ef753ff168346ea432f71d9229bd94227fce5a3e
