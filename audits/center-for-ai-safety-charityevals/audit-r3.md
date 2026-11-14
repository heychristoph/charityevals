# Audit: center-for-ai-safety-charityevals, round 3

Result: 1.351e-3 daly/$ = 1.35 years of healthy life per 1,000 dollars (combined range 0.030 – 61.2); the cause's other models are the Machine Intelligence Research Institute (0.066) and the Nuclear Threat Initiative (21.2), median 10.6 (×0.13); the median of all three is this model. Verdict: **pass**.
Model-sha: 5b8f26962a53dc17a7cd2b34c09e6129c0111891f2024b0ed707673fe325ddff

Scope: every programme of the Center for AI Safety in calendar 2024, unchanged since round 2 and checked against the return's page images again. Part III gives the compute cluster $2,947,497 (4a, with $256,598 of revenue), research $1,168,082 (4b), an undescribed $874,948 (4c), and other programmes $1,298,259 (4d: advocacy $777,874, field-building $520,385). The total is $6,288,786 (4e). Total expenses are $7,163,607 (Part I line 18). The CAIS Action Fund is correctly left out. charities/center-for-ai-safety.json `spending` and `lines` match.

Mechanical:
- Lint: 0 high, 0 medium, 4 low. The low ones are the four 0-valued smaller-size estimates with no range, the family's placeholder, accepted in rounds 1 and 2.
- Invariants: none violated.
- normalization-audit: no violation for this model. The INV-4 and INV-14 violations listed are other models'.
- check.ts: all models valid.
- Simulation: stable. The 5th percentile is 0.0785× the best guess, the median 1×, the 95th 14.3×. The single event misses 0% of draws, average 2.74× (smooth 2.98×).
- generated/ was restored after the scripts ran.

Previous round:
1. Misuse share of survivable catastrophes: **resolved.**
   - The facts now carry each preset's share of the risk. `ai_misuse_catastrophe_cut_per_million` = 1.826e-4 × 0.68 = 1.242e-4. The 0.68 is 0.1×50×0.505 ÷ (0.1×50×0.505 + 0.9×2×0.66).
   - `ai_misuse_extinction_cut_per_million` = 1.039e-5 × 0.1 = 1.039e-6.
   - Every input checked against Rethink's `longterm_params.py`: ratios 2 and 50; intensities norm(0.36, 0.96) and norm(0.05, 0.96), so means of 0.66 and 0.505; the 1/9 prop. They are also checked against `xrisk_interventions.py`'s `best_ai_misuse`.
   - The model recomputes: `ai_deaths_per_million` 76.0. The extinction term is 8.38e-7 × 3.13e6 = 2.62. The catastrophe term is 3.126e-5 × 2.35e6 = 73.4.
2. Unsupported 0.5 high on the misuse share: **resolved.** The fact was dropped. The misuse share is now inside the facts' ×10 range.
3. Split in the template and in `src/engine/templates.ts`: **resolved in substance; what is left belongs to the orchestrator.**
   - Round 2's comparability problem was that the template credited misalignment work 1/0.9 times what CAIS and NTI credit it. That is gone. The shared misalignment facts now carry misalignment's share, so the template's unchanged formula gives a misalignment-only model the same credit as these two.
   - What remains: the template has no misuse path, and `templates.ts` doesn't require the misuse facts. A future model with misuse work would have to add the blend by hand, as this one did.
   - That doesn't move this model. Batch agents may not edit skill files or src/, so it is acceptable for this pass. It is carried as low finding 4, to be fixed by the orchestrator.
4. `attr_cluster` and the cluster's revenue: **resolved.** The value is 0.41 (0.27–0.65), and the explainer names the $256,598. The high end is finding 3.
5. Google post in `resources` and the write-up: **resolved.**
6. `fb_work_dollars` explainer: **resolved.** It now reads "valued at CAIS's own mix of AI work (ai_misuse_cost_share through ai_deaths_per_million)".
7. Labels of the shared AI cuts: **resolved** as the merged facts do it. Both explainers say the preset is for misalignment work, expressed per $1 million of all AI risk. A label nit remains (finding 5).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | `summary` | The summary says the misuse quarter "gives most of the result because misuse causes most deaths in survivable AI catastrophes in Rethink's model". That share explains only about 2× of it. The rest, about 210×, is that Rethink's misuse preset cuts far more risk per dollar: a 1–5% relative cut of the catastrophe risk per $0.2–20M project, against the misalignment preset's 1e-6 to 5.5e-5 per $0.2–1M. The write-up states the reason correctly. | Catastrophe cut per $1M with the 0.68/0.32 death shares stripped out: misuse 1.826e-4 against misalignment 8.6e-7. With the shares: 1.242e-4 against 2.742e-7. | Replace "because misuse causes most deaths in survivable AI catastrophes in Rethink's model" with "because Rethink's typical misuse project cuts far more risk per dollar", as the write-up says. | 0 |
| 2 | low | presentation | `attribution_share_shared` explainer; write-up adjustments table | Both say 0.62. The live blend is 0.613. | (2,947,497×0.41 + 1,168,082×0.75 + 1,298,259×0.95) ÷ 5,413,838 = 0.613 | Write "About 0.61" in the explainer and "0.61" in the write-up's table. | 0 |
| 3 | low | sensitivity | `attr_cluster` (high 0.65) | The explainer's own bounds don't reach the high end. Researcher time of $3M–$7.5M, with CAIS paying $2.69M of the $2.95M of compute, gives 2.69 ÷ (2.95 + 3) = 0.45 to 2.69 ÷ (2.95 + 7.5) = 0.26. A high of 0.65 needs only about $1.2M of researcher time behind 60 papers. | Explainer: "about 60 papers a year at half a researcher-year each is $3M to $7.5M"; Part III 4a: revenue $256,598 | Set the high to 0.45, citing the explainer's $3M lower bound. Alternatively, state a lower bound on researcher time that gives 0.65 (about a fifth of a student-year per paper, $1.2M). | Best guess unchanged. At the high end the blend falls from 0.74 to 0.63, so the tornado high falls by about 15% |
| 4 | low | comparability (skill) | template `catastrophic-risk.json` `ai_deaths_per_million` / `ai_future_per_million`; `src/engine/templates.ts` line 308 | The template still has only the misalignment preset. A future AI model with misuse work must add `ai_misuse_cost_share` and the blended formulas by hand, as this one did. A builder who doesn't know the misuse facts exist will value misuse work at the misalignment preset, which credits it about 450× less per dollar. | The template formula reads only `@catastrophe.ai_extinction_cut_per_million` / `ai_catastrophe_cut_per_million`. | For the orchestrator, since batch agents may not edit skill files or src/: add `ai_misuse_cost_share` to the template (judgment, default 0, "name the misuse work"). Use this model's two-preset formulas in `ai_deaths_per_million` / `ai_future_per_million`. In `templates.ts`, require the two `@catastrophe.ai_misuse_*` facts in those rows. | 0 here |
| 5 | low | presentation | shared `@catastrophe.ai_extinction_cut_per_million`, `ai_catastrophe_cut_per_million` | The labels "AI: share of the yearly … risk a typical $1 million of work removes" sit beside "AI misuse work: …". The explainers say the preset is misalignment's, but the label leaves it ambiguous which work the plain "AI:" figure is for. | facts/catastrophe.json, rows `ai_extinction_cut_per_million` and `ai_catastrophe_cut_per_million` | Relabel both "AI misalignment work: share of the yearly AI extinction (catastrophe) risk a typical $1 million removes, while it counts", parallel to the misuse facts. Same length; no model reads the label. | 0 |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `program_spend`, `program_expenses`, `total_expenses`, `staff_pay` | apps.irs.gov …202412_990_2026030223958680.pdf, p. 1–2 | verified | Part I line 15: 2,830,523. Line 18: 7,163,607. Part III 4e: 6,288,786. Signed 17 November 2025 |
| `spend_cluster`, `spend_research`, `spend_advocacy`, `spend_field`, `attr_cluster` revenue | same, p. 2 and Additional Data (p. 13, 15) | verified | 2,947,497 (revenue 256,598) / 1,168,082 / 777,874 / 520,385 |
| `attr_cluster`, `evidence_adj` (cluster use) | same, p. 13 (4a) | verified | "more than 400 researchers … generating 121 research papers and accumulating over 5,000 citations" |
| `ai_misuse_cost_share` (outputs) | same, p. 14 (4b) | verified | Names WMDP ("evaluating hazardous knowledge"), circuit breakers and HLE, framed as tools for "national-security risks". The 25% split is a judgment |
| `fb_people` | same, p. 15 | verified | "online course that enrolled 240 students from varied academic backgrounds" |
| `@next_dollar.center_for_ai_safety` (room) | same, p. 1 | verified | Net assets 11,609,718. Line 19: 3,071,478 (prior 7,954,742). Contributions 9,596,669 (prior 15,594,432) |
| `@catastrophe.ai_misuse_*_cut_per_million` (top driver) | github.com/rethinkpriorities/…/xrisk_interventions.py | verified | `best_ai_misuse`: prob_no_effect 0.95; xrisk lognorm 1e-4–5e-3; catastrophe lognorm 1e-2–5e-2; cost lognorm 200K–20M. Lognormal means give 1.43e-3, 0.0252 and $5.33M |
| Shares inside the AI facts (0.1; 0.68 / 0.32) | github.com/rethinkpriorities/…/ccm/world/longterm_params.py | verified | `DEFAULT_CATASTROPHE_EXTINCTION_RISK_RATIOS`: MISALIGNMENT 2, MISUSE 50. `DEFAULT_CATASTROPHE_INTENSITIES`: norm(0.36, 0.96) and norm(0.05, 0.96), clipped 0.01–0.99, so means of about 0.66 and 0.505. `DEFAULT_AI_MISUSE_TO_MISALIGNMENT_RISK_PROP = 1 / 9` |
| `evidence_adj` (HLE, WMDP) | blog.google/…; epoch.ai | verified (round 2) | unchanged |
| `counterfactual_adj` | 2023 Form 990, Part III 4a | verified (round 1) | unchanged |

## Drivers
1. `@catastrophe.ai_misuse_catastrophe_cut_per_million`: shared estimate from Rethink's placeholder preset, ten times either way. Range 0.19 – 12.9. It carries about 96% of `ai_deaths_per_million`.
2. `$ai_catastrophe_chance`: shared slider, from the tournament. Range 0.17 – 9.0.
3. `$win_years_counted` (0.29 – 4.1) and `$missing_data_discount` (0.27 – 2.7): shared sliders.
4. `@catastrophe.ai_catastrophe_death_share`: shared judgment. Range 0.57 – 3.4.
5. This model's own inputs:
   - `@next_dollar.center_for_ai_safety`: sourced estimate, 0.61 – 2.4.
   - `ai_misuse_cost_share`: judgment anchored on the 990's named outputs, 0.58 – 2.1. It is the lever that puts CAIS about 20× above MIRI, which is all misalignment work.
   - `evidence_adj`: judgment at the family's 1.2 ceiling.

The best-guess result stands or falls with Rethink's placeholder misuse preset, applied to a quarter of the spending. What would most improve the model:
- a sourced split of CAIS's research and cluster projects into misuse and misalignment work (its paper list or the cluster's project list);
- a better-founded misuse cut than Rethink's placeholder, which is shared and moves NTI's AI branch too.

Peers: the result sits between MIRI (0.066) and NTI (21), within a tenth of the other two models' median (10.6). The gap to NTI is stated in the summary, and the arithmetic holds: the AI deaths averted per $1M are 76, against nuclear's 1,361. Nothing was tuned toward a peer.
