# Audit: nuclear-threat-initiative-charityevals, round 4 (verification)

Result: 0.02105 daly/$ = 21.05 years of healthy life per $1,000 (combined range 1.08 – 410.2). Verdict: pass.
Model-sha: e76701e5c039fc57100b7b11efa2fd645f982432f2c6a42cd6b90fb0319b92e3

Scope: only the change since round 3 (the AI branch split into misuse and misalignment; new facts `ai_misuse_extinction_cut_per_million`, `ai_misuse_catastrophe_cut_per_million`, `ai_misuse_share_of_risk`; new rows `ai_misuse_risk_share`, `ai_misuse_cost_share`; reworked `ai_deaths_per_million`, `ai_future_per_million`).

Mechanical: audit-model gives 21.05 (round 3: 21.02) and the same range 1.08 – 410.2; no high finding. The same low lint findings as before (point inputs with no range, a wide plausible range). The tornado is unchanged in order and size; the new inputs move the result by at most 21.0 – 21.2. `check.ts nuclear-threat-initiative-charityevals` passes ("all models valid"). generated/ untouched.

Facts against Rethink's source (xrisk_interventions.py, `best_ai_misuse`; longterm_params.py):
- Preset parameters match the fact's source note: prob_no_effect 0.95; effect_on_xrisk lognormal 1e-4 to 5e-3; effect_on_catastrophic_risk lognormal 1e-2 to 5e-2; cost lognormal $200k to $20M.
- Recomputed with lognormal means of the 90% ranges: cost mean $5.328M; extinction cut mean 0.001434; catastrophe cut mean 0.02520. (1 − 0.95) × mean ÷ cost × 0.772 gives 1.0389e-5 and 1.8260e-4. The facts say 1.039e-5 and 1.826e-4. Match. The same method on the misalignment preset (0.964, 1e-6 to 5.5e-5, $200k–1M) gives 8.59e-7, the existing fact's 8.569e-7, so the method is the same as the existing ai_*_cut facts. The explainers' 0.00143, 0.0252 and $5.33M are right.
- Share of risk: `DEFAULT_AI_MISUSE_TO_MISALIGNMENT_RISK_PROP = 1 / 9`, commented as 90% misalignment, 10% misuse. Matches the best of 0.1.

Formulas: with s = ai_misuse_cost_share and r = ai_misuse_risk_share, misuse work enters at weight s × r with the misuse preset, other work at (1 − s)(1 − r) with the misalignment preset; both are applied to the whole-AI yearly risks and the cut facts are per share of their own risk part, so the weights are the right ones. Both extinction and catastrophe terms, and the future-years row (extinction cut only), are consistent with each other and with the old form at s = 0, r = 0. At the default (s = 0.7, r = 0.1) misuse work gets 0.07 weight and other work 0.27, so the AI branch is smaller than before for non-misuse work and larger for misuse work; the net headline move (+0.03) is plausible since the AI branch is a small part of NTI's value. Explainers describe the formulas accurately.

Judgment (`ai_misuse_cost_share`, 0.7, 0.4 – 1): the reason given (most of FutureSafe's $851,168 goes to AI x bio and AI x nuclear work, which is misuse or accident rather than misalignment; NTI publishes no split) is sound and is flagged as judgment with a range. It is the right kind of row for the model, not a hidden constant.

Findings:
1. (low, fact explainer) The `ai_misuse_share_of_risk` explainer says the 50% high end is "Rethink's own alternative scenario with a larger misuse share". longterm_params.py defines no alternative value of the ratio; the nearest alternatives are per-era risk shares (misalignment 0.2, misuse 0.05 for era 3), which don't give 50%. Fix: drop the clause and say the range is ours (5% to 50%, a wide band around Rethink's 10% default, since Rethink marks the split as a placeholder: "in the absence of specific estimates"). Wording only, no number changes.

Verdict: **pass**. Findings: 0 high, 0 medium, 1 low.
