# Audit round 8 (scoped verification): Center for AI Safety
Result: 0.001576 daly/$ = 1.576 years of healthy life per 1,000 dollars (combined range 0.035-71.3); cause median of 8 ranked peers 1.271 (x1.24).

Scope: the change to attribution_share_shared since round 7 (attribution applied per branch, weighted by each branch's healthy years). No sourced input changed, so no source fetched; normalization-audit left to the builder.

## Checked
- Formulas. dalys_per_death_value = dalys_from_uov / (deaths value); it matches the template row and carries the same (1 + nondeath losses) factor as uov_bridged. In this model bio, nuclear and policy deaths and covid_scale_deaths_averted are 0, so deaths_averted = ai_deaths_averted + fb_deaths_averted and w_ai + w_fb = (ai + fb deaths) * value_per_death * dalys_per_death_value + (ai + fb) future dalys = dalys_from_uov + dalys_direct. Exact.
- evidence_adj and counterfactual_adj are single rows shared by both branches, so total_adj applied to the sum equals each branch's own adjustments applied to its own value (sum of w_i * attr_i * ev * cf * ... = attribution_share_shared * (w_ai + w_fb) * ev * cf * ...). No double count: the AI branch's spend weights act only inside ai_attribution_share, the course at attr_other, then the weights across branches; nothing else weights by spending.
- ai_attribution_share by hand: (2,947,497 x 0.41 + 1,168,082 x 0.75 + 777,874 x 0.95) / 4,893,453 = 0.577, "0.58". Overall 0.6076 (audit-model canonical row), "about 0.61"; implies the course is about 8% of value, "adds under a tenth" holds.
- Nothing unused: spend_field is gone and referenced nowhere; w_ai, w_fb, ai_attribution_share and dalys_per_death_value are all used; the row explainers for spend_cluster, spend_research and spend_advocacy point to ai_attribution_share.
- audit-model: no high or medium findings, no invariant violations (four lows, estimate rows without a range, unchanged). check.ts: all models valid. simulation-check: stable (5% 0.093, 50% 1, 95% 13.8 x best guess).
- Figures: headline 1.576 -> "1.6" (summary, write-up); range 0.0348-71.28 -> "0.03 to 71" / "about 0.03 to about 71"; tornado figures quoted match (0.2 to 11 chance, 0.2 to 15 misuse cut, 0.7 to 2.5 misuse share, about 3.3 at 0.1% discount); attribution 0.58 / 0.95 / 0.61 match.
- INV-15: 1.576 / 1.271 = 1.24x the cause median, below 10x, so no "more than ten times its peers because" wording is needed and none remains; the "far above Redwood, MIRI, METR" and "far below NTI (23)" claims are true (NTI 23.39) and give their reasons.

## Findings
New findings: none.

Model-sha: 045ae5e7d89ecfe42a7e6f8d677061e99ca9457e5d7b6e92bdac9b81eb13f19d

**Verdict: pass**
