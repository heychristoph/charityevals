# Audit: nuclear-threat-initiative-charityevals, round 2

Result: 0.02102 daly/$ = 21.0 years of healthy life per $1,000 (combined range 1.14 – 386); no cause median (still the only model in catastrophic-risk). Verdict: pass.
Model-sha: 8ecd82d79a7c3f32bbe8024729011148764ca17961baaa769008e676de8eec03

Scope: unchanged from round 1 and still right. Every programme of 2025 (calendar year), cost $23,281,998 (programme $17,485,927 × overhead 1.331). Nuclear 65.8%, NTI | bio 29.1%, FutureSafe 5.1%; government relations and strategic initiatives are spread in proportion. The cost-share ranges reproduce from the 990's Part III, and charities/nuclear-threat-initiative.json `spending` and `lines` match. The policy and field-building branches are at 0, with reasons.

Mechanical: lint 0 high / 0 medium / 6 low, as in round 1: the four smaller-catastrophe zeros have no range, and `pol_cost_share` and `fb_cost_share` feed only the check row. Invariants: none. normalization-audit: 0 violations in every invariant; the round-1 INV-4 false positive is waived with its reason. check.ts: valid, with the evaluator view at 50.0 = ours ÷ next dollar 0.42. simulation-check: stable (5% 0.13×, median 1.0×, 95% 8.5× the best guess; the one single event misses no draws). generated/ was restored after the runs.

Where the result comes from now: before adjustments, the $23.3M averts 102,000 expected deaths (nuclear 92,800, pandemics 9,300, AI 25) and keeps 126,000 discounted future healthy years. Deaths are 97% of the result, at 94.3 units of value (47 years) each. Nuclear is 90% of the result, and nuclear catastrophes the world survives alone are about 81%. Pandemics are 10% and AI 0.03%. Adjustments are 0.214, × 1.10 for side effects, with a next dollar of 0.42. The rise from 17.6 to 21.0 is round 1's findings 1 and 3 together: nuclear death share 0.25 → 0.45 (+80% on its part), and the cuts × 0.772.

Previous round:
1. (high, death share) **Resolved.** There are now per-area facts (nuclear 0.45, bio 0.15, AI 0.25) and per-area `<area>_deaths_if_catastrophe` rows in the template and the model. The nuclear range misreads its own anchor, though; see finding 1 below.
2. (high, experts' medians) **Resolved by the owner's decision.** docs/ai-safety-research.md, "Decided (2026-11-04)", says: "Slider default: 3% (the forecasting tournament's domain experts), unless the owner says otherwise." The decision is committed (8e60ea0), so the experts' figure is the site's rule for AI and not this build's choice. Using a different forecaster group for nuclear and pandemics would make AI, bio and nuclear charities incomparable, so one consistent way favours applying the same rule to every area. Each fact's explainer and normalization.md 2.19 now state the rule, with the superforecasters as the low end. Whether to move every area to a pooled figure is the owner's call, not a rule breach in this model.
3. (medium, backfire) **Resolved.** The six cuts × 0.772 reproduce round 1's expected values × 0.772. I re-checked the step against RP's code. `_adjust_results_for_backfiring` flips (1 − 0.7) × 0.3 ÷ (0.7 + 0.09) = 11.4% of results, a net 0.772. The intensity modifiers (`_intensity_modifiers`) enter only RP's default cost function, which the presets bypass with their own cost, so 0.772 is the whole step. The harm rows are at best 0 (low −5%), and the template's are at 0 with the "riskier than typical" rule and the −23% anchor.
4. (medium, losses beyond deaths) **Resolved.** `@catastrophe.nondeath_losses_vs_deaths` (0, 0–0.3) follows the site's climate stance (`@climate.nondeath_damages_vs_deaths`, best 0). It is in `uov_bridged` and named in the write-up. There is a small formula scope issue; see finding 4.
5. (medium, INV-4) **Resolved.** The waiver is present with its reason, and normalization-audit is clean.
6. (medium, documentation) **Resolved.** normalization.md 2.19 is written. The 2026-11-03 paragraph is updated (8 years at 4%, 960 at 0.1%). families/catastrophic-risk.md and conservation.md are updated, and TNC reads `future_years_per_person`.
7. (low, bio scope and survey) **Resolved in substance.** The explainers name engineered-only scope and the post-tournament survey (footnote 31). The effect size they state is wrong; see finding 3.
8. (low, AI preset) **Resolved.** Misalignment is kept: misuse differs by 3.5% on a branch that is 0.03% of the result. The explainer no longer gives an unstated reason.
9. (low, cut ranges) **Resolved.** The explainers now state the ratio of means, the ×10 range as ours and the independent draws.
10. (low, write-up) **Resolved.** The write-up is live: 21, about 1–390, about 90 at 0.1%, the tornado's 6–174 and the death shares. It names losses beyond deaths and the post-tournament survey.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | sensitivity | `@catastrophe.nuclear_catastrophe_death_share` | The range (0.30–0.75) is narrower than its own anchor, and the explainer misreads it. Xia et al.'s Table 1 has five scenarios above the tournament's 10% threshold. They kill (direct + without food at the end of year 2, of 6.7 billion) 15% (16 Tg), 23% (27 Tg), 33% (37 Tg), 40% (47 Tg) and 81–85% (150 Tg). So India–Pakistan wars are not "about 30%" but 15–40%, and a US–Russia war is 81–85%, not about 75%. RP's CCM intensity for nuclear runs to 0.96. The best guess, 0.45, is fine (between Xia's median scenario, 33%, and RP's 0.36–0.96). This is a top-10 driver (tornado 15.3 – 32.4). | Xia et al. 2022, Nature Food, Table 1 (nature.com/articles/s43016-022-00573-0/tables/1); scratch runs. | Set the range to low 0.15 (Xia's 16 Tg: 52M + 926M of 6.7bn) and high 0.85 (150 Tg: 360M + 5,341M), keep best 0.45, and rewrite the explainer: "Xia et al.'s wars above the 10% threshold kill 15–40% (India–Pakistan, 16–47 Tg) and 81–85% (US–Russia, 150 Tg)". Update the write-up's "Biggest uncertainties" bullet (30%–75% → 15%–85%). | Best unchanged (21.0); tornado 9.7 – 36.2 (was 15.3 – 32.4). |
| 2 | medium | presentation | model `summary` | The summary still gives round 1's result. It says "about 18 years of healthy life per $1,000, from 1 to 290". The live result is 21.0 (combined range 1.14 – 386), as the write-up and normalization.md 2.19 already say. | audit-model output; model line 13. | Change it to "about 21 years of healthy life per $1,000, from 1 to 390 on the combined range". | None (text). |
| 3 | low | source | `@catastrophe.bio_extinction_cut_per_million`, `bio_catastrophe_cut_per_million` (explainer) | The explainer says applying RP's engineered-pandemic preset to natural and COVID-scale pandemics is "about 5% of a typical pandemic model's result". That was round 1's effect on NTI's whole result, not on a pandemic model. At the defaults, natural pathogens and the COVID-scale size are about 30% of the pandemic branch's value: per $1M, 68.6 of 308 deaths a year come from the COVID-scale size and 30 more from natural catastrophes. In this model they are 2.9% of the result. A shared fact that understates this will mislead the next pandemic build. | Scratch run: COVID-scale at 0 and pathogens at the engineered-only medians (3%, 1%) gives 20.4 (−2.9%); the bio branch is 9.7% of the result. | Replace with "about a third of a pandemic branch's value at the defaults (3% of NTI's result)". | None. |
| 4 | low | units | `uov_bridged` (`@catastrophe.nondeath_losses_vs_deaths`) | The factor multiplies every death averted, extinction-level ones included. Extinction leaves no survivors, so losses beyond deaths are 0 there. Extinction deaths are about 12% of the deaths' value (8.5% of nuclear's, 45% of pandemics'). This matters only away from the best guess of 0. | Scratch run: at 0.3 the result is +29.2%, against about +26% with extinction deaths left out. | In the template, apply `(1 + nondeath_losses_vs_deaths)` to the survivable and smaller sizes only. Split `deaths_averted` into extinction and other deaths (sum the `<area>_extinction_per_year * deaths_if_extinct` parts apart), or say in the fact's explainer that the high end slightly overstates for this reason. | None at the default; about −3.5% at the high end. |

## Double counting

- The harm rows against RP's backfire: no overlap. The rows are at best 0, and the template reserves them for work riskier than typical.
- `nondeath_losses_vs_deaths` against `unmodelled_benefits_adj`: they are different things (survivors' losses in the catastrophes counted, against terrorism and laboratory accidents outside them). Both are 0 or named.
- `counterfactual_adj` against `years_of_impact`, and `evidence_adj` against `missing_data_adj`: as in round 1, different questions.
- The COVID-scale size against the bio catastrophe size: the sizes are disjoint (2% a year at 14.9M deaths, against over 10% of people), and each takes its own cut.

## Sources checked

| Row | URL | Status | Note |
|---|---|---|---|
| @catastrophe.*_cut_per_million (backfire step) | https://raw.githubusercontent.com/rethinkpriorities/cross-cause-cost-effectiveness-model-public/main/ccm/interventions/xrisk/xrisk_interventions.py | verified | Lines 34–36: PROB_GOOD 0.7, INTENSITY_BAD 0.3. Lines 285–294: the flip proportion is 0.09 / 0.79, a net 0.772. Lines 297–311: the intensity modifiers enter only `_base_xrisk_impact_magnitude`, which feeds only the default cost function. 2.62e-4, 4.61e-4, 1.69e-4, 2.98e-4 and 1.11e-6 × 0.772 equal the facts. |
| @catastrophe.nuclear_catastrophe_death_share | https://www.nature.com/articles/s43016-022-00573-0 and /tables/1 | best supported, range mismatch | Abstract: "more than 2 billion people could die … India and Pakistan, and more than 5 billion … United States and Russia". Table 1 gives the scenarios as in finding 1. |
| @catastrophe.nondeath_losses_vs_deaths | facts/climate.json `nondeath_damages_vs_deaths` | consistent | The same stance (best 0, stated so it shows). |
| @catastrophe.*_by_2100, ai_catastrophe_vs_extinction | https://forecastingresearch.org/pdf/existential-risk-persuasion-tournament.pdf | verified in round 1, values unchanged | Only the explainers changed (the owner's rule, footnote 31). |
| $ai_catastrophe_chance default | docs/ai-safety-research.md "Decided (2026-11-04)" | verified | "Slider default: 3% (the forecasting tournament's domain experts), unless the owner says otherwise." |
| program_spend, cost shares, @next_dollar.nuclear_threat_initiative | ProPublica Form 990 for 2025 | verified in round 1, values unchanged | The share ranges re-derived: 0.6273 / 0.6580 / 0.6740 etc. |

## Drivers

1. `@catastrophe.nuclear_catastrophe_cut_per_million` (RP preset × backfire, an estimate RP calls a placeholder; the ×10 range is ours): 5.7 – 174.
2. `$win_years_counted` (shared slider): 4.5 – 64.
3. `$missing_data_discount` (shared slider): 4.2 – 42.
4. `$discount_rate` (shared slider): 92 at 0.1%, 18.5 at 8%.
5. `evidence_adj` (judgment, anchored on NTI's senior access and adopted products against communications' longer path): 7.9 – 31.5.

Next come the next dollar (0.42, sourced), the nuclear catastrophe chance (XPT, the owner's rule), `daly_per_child_death`, `counterfactual_adj` and the nuclear death share (finding 1). The model would improve most from a sourced per-dollar cut for nuclear policy work in place of RP's placeholder. The cut is the largest swing, and nothing NTI-specific narrows it.

Verdict: pass. Findings: 0 high, 2 medium, 2 low.
