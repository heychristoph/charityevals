# Audit: center-for-ai-safety-charityevals, round 4 (verification round)

Result: 1.351e-3 daly/$ = 1.351 years of healthy life per 1,000 dollars, unchanged from round 3 (combined range 0.030 to 61). Verdict: **pass**.
Model-sha: 281f9680b8f154f51af9b26666cd0be894ee4157edc616a0f17b37ebc53ef718

Scope: scoped verification of the fixes in commit e40e20f for round 3's five lows. Nothing else was re-audited.

Mechanical:
- audit-model.ts: headline 0.001351 daly/$ (1.351 per $1,000), 0 high, 0 medium, the same 4 low (the 0-valued smaller-size estimates with no range).
- check.ts: all models valid.
- The summary's 1.4 and 0.03 to 61 and the write-up's 1.4 and "about 0.03 to about 61" match the model.
- generated/ unchanged (git status clean).

Round 3 lows:
1. Summary reason: **resolved.** It now says the misuse quarter gives most of the result "because Rethink's typical misuse project cuts far more risk per dollar", as the write-up does.
2. Attribution 0.61: **resolved.** The explainer and the write-up table both say 0.61; the blend recomputes to 0.6129. No "0.62" remains in either file.
3. `attr_cluster` range: **resolved.** The explainer now gives researcher time of $1.2M to $7.5M. With CAIS paying $2.69M of the $2.95M of compute, 2.69 / (2.95 + 1.2) = 0.65 and 2.69 / (2.95 + 7.5) = 0.26, matching the 0.65 and 0.27 bounds. The best guess 0.41 is unchanged. Nit, no action: "about $4M at the middle" gives 0.39, and 0.41 corresponds to about $3.6M; both are "about $4M".
4. Template has no misuse path: **open, not fixable in this batch** (agents may not edit skill files or src/). Carried to the orchestrator as a skill problem. Fix as stated in round 3: add `ai_misuse_cost_share` to the template, use this model's two-preset formulas in `ai_deaths_per_million` / `ai_future_per_million`, and require the `@catastrophe.ai_misuse_*` facts in `src/engine/templates.ts`. No effect on this model.
5. Shared misalignment labels: **resolved.** `ai_extinction_cut_per_million` and `ai_catastrophe_cut_per_million` in facts/catastrophe.json are now "AI misalignment work: ...", parallel to the misuse facts. Nothing else moved.

New findings: none. Open items: low 4 only (orchestrator).
