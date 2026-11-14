# Audit: machine-intelligence-research-institute-charityevals, round 4 (verification of round 3's two lows)

Result: 6.594e-5 daly/$ = 0.0659 years of healthy life per $1,000 (combined range 0.0016–2.65). The cause's other model, the Nuclear Threat Initiative, is at 21.0 (×0.0031). Verdict: pass.
Model-sha: 21fe7ed19da4cf118f15cfcad1b84f67d0aa381f84a69e0a645953969e54fd1d

Scope: only the changes in commit 5a46d31 (facts/catastrophe.json, the model summary, the write-up, the family reference table).

No findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Checked:
1. Round 3 low 1 (misalignment's share by deaths): **resolved.** 0.9 × 2 × 0.66 = 1.188; 0.1 × 50 × 0.505 = 2.525; share 1.188 ÷ 3.713 = 0.3200 (0.31996). 8.569e-7 × 0.31996 = 2.7417e-7, which is the fact's 2.742e-7 (range 2.742e-8 to 2.742e-6, ten times either way). Round 3's suggested 2.734e-7 used a share rounded to 0.319; the difference is 0.3%. The source page and explainer carry the formula with the mean shares killed (0.66, 0.505) and the 32%. The family table says "32% of survivable catastrophes' deaths". `ai_extinction_cut_per_million` is unchanged at 7.712e-7.
2. Round 3 low 2 (explainers): **resolved.** Both AI explainers now say Rethink extrapolated the small project's cut linearly from the megaproject and took a similar chance of no effect, 96.4% against the megaproject's 97.3%, as round 3 found in `xrisk_interventions.py`.
3. Summary and write-up against `audit-model.ts`: result 0.06594 gives "about 0.07" (summary) and 0.066 (write-up headline); 21.02 ÷ 0.06594 = 319 gives "about 320" in both; the slider range 0.00835–0.4396 gives "0.008 to 0.44"; the combined range 0.0016–2.65 gives "0.002 to 3"; at the 0.1% discount rate 1.386 gives "about 1.4". Ratios from facts/catastrophe.json: extinction 7.712e-7 against pandemics 1.305e-4 (1/169) and nuclear 2.023e-4 (1/262), "a 170th to a 260th"; catastrophes 2.742e-7 against pandemics 2.301e-4 (1/839) and nuclear 3.559e-4 (1/1,298), "about a thousandth". "About a third of the deaths" matches 32%. Deaths of people alive now: about 4,577 of 5,379 (97.04 deaths averted at about 47.2 DALYs each, 802 future), 85.1%, "about 85%". The write-up's checking paragraph describes rounds 1 to 3 correctly (a tenth, then about a quarter; the quarter is the old result's drop and is not restated).
4. `npx tsx scripts/check.ts machine-intelligence-research-institute-charityevals`: all models valid. audit-model: unchanged mechanical picture (the two lows on `pol_cost_share` and `fb_cost_share` only). The result moved +3.2% (0.0639 to 0.0659) as round 3 predicted. generated/ was not changed by the runs.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `@catastrophe.ai_catastrophe_cut_per_million` | https://github.com/rethinkpriorities/cross-cause-cost-effectiveness-model-public | not re-fetched | Mean shares killed and the 96.4% / 97.3% were verified in round 3; this round checks the arithmetic and the text against them. |

Re-stamped: template-alignment change, result unchanged (before 0.066, after 0.066).
