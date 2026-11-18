# Audit round 7 (scoped verification): Coalition for Rainforest Nations

Result: -0.0244 -> -0.0253 years per $1,000 (-0.02525 at the defaults, mobiliser share 100%), reproduced; a net-harm result, kept negative.

Verdict: pass

Model-sha: 318b438e0d9363b08c648239ef753ff168346ea432f71d9229bd94227fce5a3e

## Scope

Rule 2.24, step 5. Changed rows only: `redd_support_per_rbp_dollar` (replaces `redd_resources_per_rbp_dollar`), `rbf_counterfactual_adj`, `itmo_counterfactual_adj`, `rbf_attribution_share_shared`, `rbf_attribution_share`, `itmo_attribution_share_shared`, `itmo_attribution_share`.

## Checked

- Denominators. Both shares now hold CfRN's spending over readiness and implementation support (1.8 / 4.6 = 0.39 of payments, Forest Declaration Assessment 2022 p. 3, both figures quoted in the model's rows). The payers and the forest governments, who pay and carry out the protection, are out of the denominator and sit under `mobiliser_share`. No co-advocate is dropped: other readiness funders are in the 1.8 billion.
- Class. Both branches are `credit: win` and the used share is `<x>_attribution_share_shared * mobiliser_share`; the payments and the Article 6 market are deals others pay for and run, so win is right.
- Two cuts. The counterfactual rows ask whether the payments flow without any outside support (all groups together); the share then splits that support between CfRN and the others. These are different questions, and the payers are cut once (the first cut, plus the mobiliser share), not in the share's denominator. The forest that would have stood anyway stays out of the cost per tonne (synthetic control), not cut again.
- Reference class. `@climate.advocacy_share_of_policy_win` (30%, 10% to 60%, Burstein & Linton 2002) is a judgment about won climate policy due to advocacy. Here the support is mostly readiness grants and negotiating help, so the fit is loose, and the row says "no study splits it". Acceptable as a stated judgment with the anchor named; moving it to 10% or 60% scales the result in proportion.
- Text rules: no peer comparison, explainers short.
- `scripts/check.ts`: all models valid. `scripts/headlines.ts`: -0.0252504.

## Findings

1. Low. `forest_country_redd_2010_2021` and `forest_country_spent_vs_donors` are now read by no row (their only reader was the removed `redd_resources_per_rbp_dollar`). Fix: delete both rows, or keep them only if a later change reads them; no headline change.
2. Low. `rbp_committed_2010_2021` explainer still says "the attribution row below sets CfRN's spending against all the resources in the same countries". Fix: "the support row below sets CfRN's spending against the readiness support in the same countries, so the countries' share cancels."
3. Low. `itmo_attribution_share_shared` takes the market's support in the same proportion to the money paid as readiness is to donors' payments (0.39). The explainer says so; the proportion has no data anchor of its own. Fix: none needed now; keep the wording.

Re-stamped (17 Nov 2026): the round's low findings fixed in wording (and, for the rainforest model, rows no longer read removed and the branch weights kept free of the mobiliser's share); no value changed at a 100% mobiliser share.
