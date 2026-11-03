# Audit: strongminds-charityevals, round 3
Result: 0.05085 wellby/$ = 3.319 years of healthy life per $1,000 (joint 0.035–110.5; 0.050–25.2 with shared assumptions at their defaults); cause median 7.423 (×0.45). Verdict: **pass** (no high or medium findings; 2 low).
Scope: unchanged from round 2 and still right. The model covers StrongMinds' one programme, six-week group IPT in Uganda and Zambia and through partners in Ethiopia, Kenya, Malawi and Nigeria. The year is 2025, the latest with audited accounts (auditor's report dated June 25, 2026), and reach is for the same year (Q4 2025 report). StrongMinds America ceased on December 31, 2024, so all 2025 programme spending is IPT-G.
Mechanical: lint 0/0/0. Invariants: no violations (audit-model, 0 findings). check.ts: the model itself is clean. Its 7 errors are all `the-life-you-can-save-founders-pledge` sandbox artifacts. normalization-audit: as in round 2, it stops on the same 7 missing bulk-model errors (tried for 90 s). Run it in the full repo before merging.

Previous round:
- #1 (medium, duration): **resolved**. Best is now 2.6 (1.5–4), on the per-attender shape. The arithmetic checks: 0.5 × (0.73 + 0.58) + 0.5 × 0.58 = 0.945; 0.945 / 0.365 = 2.59. The first-stage explanation is right: 0.354 / 0.730 = 49% and 0.404 / 0.578 = 70%. The explainer now says why StrongMinds' own follow-ups aren't used, and the high end's adult argument is kept.
- #2 (low, attribution): **resolved**. The governments' term is $0.65m: 0.09 / 0.91 × $6.57m, where $6.57m is Uganda plus Zambia programme spending. It is consistent with the report's "$0.89–$3.69 per patient" (about $1.2 per Ugandan and Zambian client). Kenya and Malawi add about $0.05m. NGO partners treated 21% of clients, about 156k, at $3–10 each, so about $1m. That gives 11.39 / 13.09 = 0.870 and a high of 11.39 / 12.09 = 0.94. Two small gaps remain in this row (finding 1).
- #3 (low, rct_weight explainer): **resolved**. It adds the 36% adolescents (267k + 478k = 745k, confirmed in the Q4 2025 chart), 14 vs six sessions and the 3% staff-delivered share, and says these are counted in evidence_adj.
- #4 (low, write-up wording): **resolved**, except one figure (finding 2). The suicide wording ("the population as a whole"), the adolescent share and the 3% staff-delivered share are fixed. The duration sentence (1.9 to 5.0) matches the tornado, and the headline 3.3 is live.
- #5 (low, uganda_share): **resolved**. High is 0.72, cited as printed p.21.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | attribution_share_shared | The new dollar arithmetic has two gaps. (a) The judged $3–10 of NGO-partner cost per client has no anchor. Two published figures bracket it: governments' in-kind support costs $0.89–3.69 per patient, and StrongMinds' own programme cost is $9.82 per client ($7.32m / 745k). (b) The volunteer facilitators' time beyond their stipends is in the low end only, with no number. Government volunteers and peers run 76% of groups (about 566k clients), and the credit-by-resources rule counts every contributor's resources in the best guess. This reverses my round-2 suggestion to put volunteer time in the low end only. | Q4 2025 report p.6: "Uganda and Zambia each contributed ~9% of total program costs, about $0.89–$3.69 per patient, depending on the therapy delivery channel"; p.3: NGO partners 21%, government partners 53%, peer 23%, StrongMinds 3%. 2025 audit p.6. | (a) In the explainer, anchor the $3–10 on those two figures: above the governments' in-kind $0.89–3.69, because partners deliver with their own staff, and at most StrongMinds' own programme cost of $9.82. (b) Price the volunteers' unpaid time in the best guess. For example, about 2 hours per client (six 2-hour sessions for groups of about 10, plus preparation) × a sourced rural wage (Uganda or Zambia, from the World Bank or the national labour force survey). That comes to roughly $0.3–0.6m. Recompute the best, about 0.84, and the low (state the dollars the 0.75 assumes). | 3.32 → about 3.21 (−3%) |
| 2 | low | presentation | write-up, "What drives the result" | "StrongMinds' trial result, the evidence discount and the weight on the trial each move it by between a fifth and a third either way." The trial result moves it −37% / +37% (2.10–4.54), which is more than a third. The evidence discount moves it −33% / +27%, and the weight −24% / +19%. | Tornado (audit-model): rct_effect_phq_points 2.097–4.542, evidence_adj 2.213–4.205, rct_weight 3.961–2.517, against 3.319. | Write "each move it by between a fifth and nearly two-fifths either way", or give the three ranges. Re-derive after fix 1. Also add the round-3 line to "How this model was checked". | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| attribution_share_shared (governments) | https://strongminds.org/wp-content/uploads/2026/03/2025-Q4-report-8.5x11-3-19-26-FINAL.pdf | verified | p.6: "Uganda and Zambia each contributed ~9% of total program costs, about $0.89–$3.69 per patient"; "Of the above contributions, 97% came in the form" of government staff time; Kenya "7%–19% of total program costs"; Malawi "~10%". In 2024 StrongMinds put government contributions at "roughly 5%". |
| attribution_share_shared (delivery mix) | same, p.3 | verified | "CLIENTS TREATED BY THERAPY DELIVERY METHOD": NGO Partners 21%, Government Partners 53%, Peer 23%, StrongMinds 3% |
| rct_weight / write-up (adolescents) | same, p.3 chart | verified | 2025 bars 267k and 478k (sum 745k); chart labels partly garbled in the text layer, values unambiguous |
| people_reached | same, p.4 | verified | "reaching 745,224 people with depression in 2025"; p.1 "754,224" (typo, as the explainer notes) |
| cost_per_person | same, p.1 and p.4 | verified | "USD $15"; "average cost to $15 per person" |
| program_expenses, total_expenses, staff_pay, uganda_share anchors | https://strongminds.org/wp-content/uploads/2026/08/2025-Audit.pdf | not re-fetched (re-downloaded; values unchanged since round 2's verification) | 7,316,320; 11,390,353; 7,163,392; Uganda 4,703,501, Zambia 1,868,116 (p.21) |
| rct_effect_phq_points, effect_duration_years | Baird et al. WPS 10849 | verified in round 2; numbers unchanged | LATE −0.730 / −0.578 / +0.192; ITT −0.354 / −0.404 / +0.275 |
| prior_effect_sd | Cuijpers et al. 2018 | verified in round 2; unchanged | 0.51 (0.34–0.69) |
| suicide rates, RR | World Bank API; PMC8095367 | verified in rounds 1–2; unchanged | |

## Drivers
1. `$daly_per_wellby`: shared slider (2.56–13.78). The visitor sets it.
2. `effect_duration_years`: estimate from StrongMinds' RCT, verified (1.94–5.02).
3. `rct_effect_phq_points`: estimate, verified (2.10–4.54).
4. `evidence_adj`: judgment, anchored by its stated multiple of the RCT (2.21–4.21).
5. `@wellby_factors.household_spillover_ratio_psychotherapy`: shared estimate (2.47–4.36). Then `prior_effect_sd`, a verified estimate, and `rct_weight`, a judgment with a precision reference class.

What would most improve the model is StrongMinds' announced RCT of its current six-week model (Q4 2025 report p.4). It would settle both the effect and the persistence for adults and for non-staff delivery. After that, the most useful data would be a published 2025 client split by country and channel, with partners' own costs.

Peers: 3.32 against a global-health median of 7.42 (×0.45), inside 10×. Among the hand-built WELLBY models it sits between pallium-india-hli (2.23) and against-malaria-foundation-hli (9.21), alongside the other wellbeing programmes. The change since round 2 (3.60 → 3.32) is the duration fix (−10%), partly offset by the attribution share rising from 0.855 to 0.87. Nothing is unexplained.

## Blind-list notes
- scripts/audit-model.ts printed `friendship-bench` (HLI, blind-listed) at 2.804 in its reference-class list. I did not open that model and did not use it.
- I read only StrongMinds' own Q4 2025 report and the 2025 audit (both downloaded from strongminds.org), plus the sandbox's model, write-up, skill and earlier audits. I ran no web search and saw no evaluator's cost-effectiveness figure for StrongMinds.
