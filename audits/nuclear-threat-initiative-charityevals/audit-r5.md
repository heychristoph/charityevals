# Audit: nuclear-threat-initiative-charityevals, round 5 (verification)

Result: 0.02123 daly/$ = 21.23 years of healthy life per $1,000 (combined range 1.103 – 408.8). Verdict: **pass**.
Model-sha: 28ba8891dd80aa2a26f5cd150f3430b946a1cb2493dd20fb91dc1cdabf3e5961

Scope: verification round, only the change since round 4: the shared misalignment cuts in facts/catastrophe.json are now per $1M of all AI risk (extinction cut 7.712e-7, catastrophe cut 2.742e-7); the misuse facts `ai_misuse_extinction_cut_per_million` (1.039e-6) and `ai_misuse_catastrophe_cut_per_million` (1.242e-4) are expressed the same way; the NTI rows `ai_misuse_risk_share` and the fact `ai_misuse_share_of_risk` are gone; `ai_deaths_per_million` and `ai_future_per_million` weight the two presets by `ai_misuse_cost_share` only. Nothing else re-checked.

Mechanical: audit-model gives 21.23 (round 4: 21.05), range 1.103 – 408.8; no high or medium finding, only the same low lint items (point inputs with no range, a wide plausible range, share of judgment). The tornado order is unchanged. `check.ts nuclear-threat-initiative-charityevals` passes ("all models valid"). The write-up headline span and the model summary both say 21, matching 21.23. generated/ was rewritten by the scripts and restored with `git checkout -- generated`.

Previous round: round 4's one low (the `ai_misuse_share_of_risk` explainer claimed a 50% high end from "Rethink's own alternative scenario", which longterm_params.py does not contain): moot. The fact and the row that used it are removed, and no text citing a risk-share range remains (no `ai_misuse_share_of_risk` or `ai_misuse_risk_share` in models/ or facts/). Resolved by removal.

Facts against Rethink's source (xrisk_interventions.py `best_ai_misuse`, fetched; longterm_params.py, fetched):
- Preset parameters match the fact's source note: prob_no_effect 0.95; effect_on_xrisk lognormal 1e-4 to 5e-3; effect_on_catastrophic_risk lognormal 1e-2 to 5e-2; cost lognormal $200k to $20M. longterm_params.py: catastrophes per extinction misalignment 2, misuse 50; share killed norm(0.36, 0.96) for misalignment (mean 0.66) and norm(0.05, 0.96) for misuse (mean 0.505); "AI default risks split as 90% misalignment and 10% misuse" (ratio 1/9). All match the notes.
- Arithmetic recomputed (lognormal means of the 90% ranges): cost mean $5.328M; extinction cut mean 0.0014340; catastrophe cut mean 0.025203. Extinction: 0.05 × 0.001434 / 5.328M × 1e6 × 0.772 × 0.1 = 1.0389e-6 (fact 1.039e-6). Catastrophe share 0.1×50×0.505 / (0.1×50×0.505 + 0.9×2×0.66) = 2.525 / 3.713 = 0.6800; 0.05 × 0.025203 / 5.328M × 1e6 × 0.772 × 0.68 = 1.2416e-4 (fact 1.242e-4). Both match; the explainers' 0.00143, 0.0252, $5.33M, 0.1 and 0.68 are right, and 0.68 is the exact complement of the misalignment fact's 32%.
- Consistency with the misalignment facts: same method (ratio of lognormal means, 0.772 backfire step, ranges ours ten times either way); the misalignment extinction fact is 0.9 × its earlier 8.569e-7 = 7.712e-7 and the same method on its preset gives 7.73e-7 (0.2% apart, immaterial); the catastrophe fact carries 0.32. The two pairs are now on the same base (all AI risk), so weighting by cost share alone is correct, with no separate risk-share weight, and the misuse explainers say this.

Formulas: with s = ai_misuse_cost_share, deaths = ((1−s)·ext_misalign + s·ext_misuse) × extinction risk × deaths_if_extinct + ((1−s)·cat_misalign + s·cat_misuse) × (catastrophe + smaller-size deaths); future = the extinction blend × ai_future_per_year. Terms are paired correctly (extinction cuts with extinction risk, catastrophe cuts with the survivable sizes including the smaller one, as the explainer says); at s = 0 it reduces to the misalignment preset alone, at s = 1 to the misuse preset alone. The row explainers describe this accurately. `ai_misuse_cost_share` (0.7, 0.4 – 1, judgment, reason stated) was accepted in round 4 and is unchanged.

Effect: the blended AI cuts at default are about 9.6e-7 (extinction) and 8.7e-5 (catastrophe), dominated by the misuse preset, whose catastrophe cut is large because Rethink gives it a 1e-2 to 5e-2 effect on catastrophic risk. The headline moves 21.05 → 21.23 (+0.8%) because the AI branch is a small part of NTI's value.

Findings: none.

Verdict: **pass**. Findings: 0 high, 0 medium, 0 low.
