# Audit: feeding-america-charityevals-advocacy, round 2

Result: 2.084e-4 uov/$ = 0.1042 years of healthy life per $1,000 (combined range 0.0093 – 1.165); cause median 0.2528 (×0.41). Verdict: **pass**.
Model-sha: df37c8aa008d07d04d58a23b4f282b47cd53c144a9bb180aa51a63927b79813f

Mechanical: audit-model 0 high / 0 medium / 2 low (counterfactual_adj and total_adj are summaries of the branches, not applied: their labels already say "for reading only"; add the same words to their explainers, which are missing). check.ts: all models valid. Branch structure (three branches, each its own counterfactual and total_adj, summed in `outcome_total`) is consistent; the shared figures (@snap.benefit_share, @snap.cash_equivalence, @public_funds.mcpf, @public_funds.us_federal_payer_multiple, @united_states.food_aid_recipients_consumption_share) are read, and the food network model reads the same ones (10 reads there). generated/ not rewritten.

## Round 1 findings, one by one

| R1 | Status | Check |
|---|---|---|
| F1 (win inventory) | settled, except (b) | One branch per win with sources: TFP 21% verified (GAO-23-105450 highlights: "21 percent increase in the cost of the TFP and the maximum SNAP benefit"); Summer EBT $2.67bn verified (CRS IF11633, FY2024 preliminary federal spending, participating states only, so (c) is settled); House $300bn and final $200bn (CBO $186bn as low end) from the annual report (PDF unreachable here, as in round 1). (b) temporary wins (Dec 2020 15% increase, ARP, emergency allotments, Pandemic EBT) are still neither counted nor named as left out: see N1. |
| F2 (cost period) | settled | `program_spend` = FY2025 × `average_spend_vs_year`, CPI-adjusted FY2021-FY2025. Column check: the four earlier years' quoted rows (columns 4, 5, 7 = awareness, policy, research, as in the FY2025 facts' row) add to 57.403m, 53.058m, 34.186m and 21.630m, as set. Keeping FY2025 as the base year is acceptable: the wins' campaigns all fall in FY2021-FY2025, the sister model's reach is FY2025, and no FY2026 annual report exists yet; the cost and the wins now come from the same five years. See N5. |
| F3 (counterfactuals) | settled | Per-win 0.12 / 0.25 / 0.05, each ranged, each naming Baumgartner et al. 2009 and Bergan and Cole 2015 and the win's own reasoning. Values differ slightly from r1's suggestion but the alternative anchors the same way. |
| F4 (children's long-run gains) | settled | +5% inside `unmodelled_benefits_adj` (best 0.08, range -0.05 to 0.25) with Hoynes et al. 2016 and Bailey et al. 2024 named; tagged `side_effect`. |
| F5 (evidence_adj) | settled | 0.85 (0.6-1); the reversal reason is only mentioned as belonging to `$win_years_counted`. |
| F6 (awareness donations) | settled | Removed; `money_moved` 0 with the reason (no published count; moved-money rows would not favour it). `moved_dollar_value` explainer no longer says the template text. |
| F7 (coalition share) | partly settled | Qualitative anchor only, no budgets: see N3 (low). |
| F8 (consumption share) | settled | Reads @united_states.food_aid_recipients_consumption_share (0.3, 0.2-0.5), same as the food network model. |
| F9 (explainers, summary, write-up) | settled | Summary states the chain and gives the reasons for the gap (US recipients only a few times poorer than payers; coalition caused a small share). Write-up describes the three wins, drivers and the audit fixes; headline figure is live (`data-figure`), 0.1. |
| F10 (payer cost) | settled | Both models read @snap.benefit_share and divide the payer cost by it. |

## New findings

| # | Severity | Category | Row | Finding | Fix | Effect |
|---|---|---|---|---|---|---|
| N1 | medium | missing-adjustment | `tfp_money`, summary | The temporary wins in the FY2021-FY2025 window (the 15% benefit increase of Dec 2020 to Sep 2021, American Rescue Plan extension, emergency allotments, Pandemic EBT) are still neither counted nor named as left out (round 1 F1b). A past average over five years that leaves out the window's largest temporary food-money wins understates the numerator. | Either add a fourth branch counting these once at their actual dollars (no `$win_years_counted`, only the wait discount) with its own counterfactual (most were mandated by Congress or USDA under emergency law, so a low one), or say in the `won_money_per_year` explainer and the write-up that temporary wins are left out and why (for instance the coalition's share of emergency law cannot be separated). The first is the site's rule (model everything). | Roughly +10-30% depending on the counterfactual. |
| N2 | low | double-counting | `tfp_people`, `benefit_share` | `tfp_money` is built from benefits only (`benefit_per_person_year` × participants), yet `tfp_people` multiplies it by `benefit_share` (0.92), as for Summer EBT and the House-vs-final cut, whose figures include administration. Households get 100% of the TFP money. (The payer cost correctly divides by `benefit_share`.) | In `tfp_people` drop `* benefit_share`, and say in the `benefit_share` explainer that it applies to the two branches whose money includes administration. | About +5% on the result (TFP is about 60% of the weighted value). |
| N3 | low | sensitivity | `attribution_share_shared` | The explainer says FRAC, Share Our Strength and the other organisations are "each smaller on federal policy than Feeding America" and that Feeding America is "the largest single funder" without a source; the coalition's budgets are not cited. The range 0.1-0.5 is wide enough, but a statement of fact should have a source. | Cite Form 990 programme spending (FRAC, Share Our Strength, CBPP's food assistance team) or reword as judgment ("we judge ..."). | Within the range. |
| N4 | low | presentation | `counterfactual_adj`, `total_adj` | Lint diagnostic: the labels say "for reading only" but the explainers are empty. | Add "the outcome-weighted average of the three wins' values, for reading only" as the explainer. | None. |
| N5 | low | normalization | cost year | The next dollar (@next_dollar.feeding_america) is from the FY2026 audited statement and the July 2025 law falls in FY2026, while the cost window ends FY2025. Acceptable as chosen (see F2); the summary could say in one clause that FY2026 is not yet counted. | One clause in the `program_spend` explainer or the write-up; move the window for both Feeding America models together when an FY2026 annual report exists. | None now. |
| N6 | low | source | `obbba_counterfactual_adj` | "Feeding America counts a million advocacy actions" is given without a source in the explainer (annual report unreachable here). | Quote it in the row's source or drop the figure. | None. |

## Sources checked

| Row | Status |
|---|---|
| tfp_increase (GAO-23-105450) | verified: "The reevaluation resulted in a 21 percent increase in the cost of the TFP and the maximum SNAP benefit." |
| sebt_money (CRS IF11633) | verified: "preliminary federal spending on Summer EBT was approximately $2.67 billion" (FY2024). |
| spend_fy2021-24 | quoted rows consistent with the columns used and with the FY2025 facts' columns; PDFs not reachable here. |
| house_cut, final_cut | Feeding America annual report: PDF not extractable here; the $300bn is consistent with CBO's House estimate and $186bn is CBO's for the law (round 1). |
| benefit_per_person_month, snap_participants | verified in round 1 (CRS R42505). |

## Drivers (tornado)

`$win_years_counted` (0.023-0.32), `$missing_data_discount` (0.021-0.21), `attribution_share_shared` (0.042-0.21), `$uov_per_daly`, `tfp_counterfactual_adj` (0.055-0.20), next dollar (0.053-0.19). All judgments or shared sliders with named anchors; the tornado is now spread across several inputs and no longer rests on one mixed counterfactual. The result is 0.41 of the cause's median, with the gap explained in the summary.

Verdict: pass. Findings: 0 high, 1 medium, 5 low.
