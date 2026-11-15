# Audit: opportunity-green-charityevals, round 2
Result: -0.01007 tco2e/$ = -0.0180 years of healthy life per 1,000 dollars (joint low-high of the model's own ranges -13.9 to 0.164; the combined-range line prints a degenerate -8e14 to -4e-19 because the best guess is near zero); cause median 0.001519 (x -11.85, a net-harm model, allowed by normalization.md 2.22). Verdict: fix needed (2 high, 1 medium, 2 low).
Model-sha: 6d1ce5fc71a43746d2e0f1049105734530200bd0c87793b1cb827e2574e99316
Scope: unchanged from round 1 (whole £2.47M charitable-activities line, year to March 2026; IMO branch, EU trading branch, 10% other work). Not re-checked.
Mechanical: lint 0/0/0 on audit-model (only the far-from-median pointer); invariants none; normalization-audit 0 violations (generated/ restored with git checkout); check.ts "all models valid"; simulation-check **UNSTABLE** (finding 1).

Previous round (round 1):
- 1 imo_jet_uov value: resolved (new fact `development_vs_cash` 0.5, 0.2-1, read in imo_jet_uov). One small leftover: the one-line pointer from `oda_vs_cash`'s explainer to the new fact was not added (finding 5).
- 2 evidence_adj on the Fund money: resolved.
- 3 displacement: not resolved as proposed. The row exists, but the displaced dollar is valued at the development figure, not at the donor's own aid (finding 2).
- 4 payer share: resolved (0.5, 0.35-0.6, UNCTADstat; the page says 59% not 58%, low, finding 4).
- 5 side_effect tag: resolved.
- 6 sources for the adoption note: not resolved. The new sources do not contain the figures (finding 3).
- 7 netting of public money: accepted, pending the site-wide rule, explainer says so.
- 8 CPI: resolved (formula multiplies by @cpi.usa_2025 / @cpi.usa_2024; both exist).
- 10 held flat: resolved (said in the explainer as a judgment).
- 11 revenue delivered share: resolved (`imo_revenue_delivered_adj` 0.8, 0.5-1).
- 12 beneficiaries "world": resolved (kept, note says why). 13 write-up sources: resolved (listed; B&D not re-fetched).
- 9 survey-scale payer consumption: non-fix reasonable for now (ranged judgment 1,500-6,000; it is the fourth-largest swing, so adding China and India survey facts remains the improvement). 14 register rounding: accepted, negligible.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | high | sensitivity | whole model | The simulation is unstable (a high for a charityevals model): 5% -346, 50% 0.0237, 95% 520 x the best guess; 2 single events miss in 48% of draws (average -7.21 against smooth -4.69). Eight inputs alone move the result tenfold or flip it (imo_jet_share x14.6/x-12.6, development_vs_cash x11.9/x-17.2, abatement cost, payer consumption, tonnes, implementation, cash, payer multiple). Cause: the result is the difference of two terms of about equal size (just-transition money against compliance costs), each carrying independent wide ranges, so the best guess sits near zero and the draws swing from large harm to large good. | simulation-check output (run on this model); audit-model tornado. | Tie the two terms to what they share so their errors do not draw independently where the source gives one cause: (a) have imo_jet_uov and imo_compliance_uov read the same `imo_implementation_adj`-type delivery factor wherever the evidence says the Fund's income and the ships' cost move together (the revenue is the payments of ships that do not switch, i.e. the compliance cost's mirror), and (b) tighten ranges that are wider than the source supports (imo_low_income_payer_consumption 1500-6000 is a four-fold span on a log-scale input; imo_jet_share 0.1-0.7). If the net is genuinely this uncertain after that, state the unstable verdict in the write-up as a conclusion ("the sign is not known") rather than a point headline, and have the owner decide whether to publish it. | Result stays about -0.018 at the best guess; the draws narrow |
| 2 | high | double-counting / normalization | imo_jet_uov, imo_jet_displaced_share | Round 1's fix 3 asked for the displaced dollar to be valued as the donor's own aid of unknown use: (aid value - displaced share x @aid_value.oda_vs_cash x cash). The model instead subtracts the share at the same 0.5 development figure: `(1 - displaced) x development_vs_cash`. The displaced money is donors' own budget aid (oda_vs_cash, about 1x cash, which includes health aid), so net value per dollar is 0.5 - 0.15 x 1 = 0.35x, not 0.425x. | Model formula; facts/aid_value.json (`oda_vs_cash` explainer: "when its use isn't known"). Scratch copy with the corrected formula run through audit-model. | Formula: `imo_fund_revenue_per_year * imo_jet_share * (@aid_value.development_vs_cash - imo_jet_displaced_share * @aid_value.oda_vs_cash) * @cash.uov_per_dollar * ...`; say so in the explainer. | -0.018 -> -0.076 (the money term falls about 18%; the near-cancelling result moves four-fold) |
| 3 | medium | source | imo_p_adopted note | The cited pages do not contain the figures they are cited for. IUMI (December 2025): no counts, only "a roll-call vote determined the outcome" with Cyprus and Greece abstaining. Climate Home News (1 May 2026): no 57-49 vote, no 21 abstentions, no mention of MEPC 85; it says the session resumes "on Friday December 4 unless governments decide otherwise" with public talks "from November 30 to December 4". So 4 December is verified, but "57 votes to 49 with 21 abstentions" and "after MEPC 85 (30 November to 3 December)" are unsupported by their citations. | Pages fetched 2026-11-15. | Either cite a page that carries the count (the IMO or a news report of the 17 October 2025 vote), or delete "57 to 49 with 21 abstentions" and "MEPC 85 (30 November to 3 December)" from the note and keep "resumes on 4 December 2026 unless governments decide otherwise". | none |
| 4 | low | source | imo_payer_low_income_share | UNCTADstat's insights page says 59% (not 58%) of 2024 seaborne trade by volume was discharged in developing economies. | UNCTADstat Maritime insights, fetched. | Write 59% in the note and the explainer. | none |
| 5 | low | presentation | summary; `oda_vs_cash` explainer | The model summary still says a "third or more" of the compliance cost is borne in poorer importing countries, while the row is now 50% (the write-up says "about half"). The one-line pointer round 1 asked for in `oda_vs_cash`'s explainer is missing. | Model summary; facts/aid_value.json. | Summary: "about half of it". Add to `oda_vs_cash`'s explainer: "For aid of a known development kind, see development_vs_cash." | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| development_vs_cash | https://cega.berkeley.edu/collection/gikuriro-rwanda-cash-benchmarking/ | verified | the passage (nutrition and WASH programme raised savings, a secondary outcome, and no primary child well-being outcome) is on the page; the 0.5/0.2/1 are judgments anchored on it, as the fact says |
| imo_payer_low_income_share | https://unctadstat.unctad.org/insights/theme/55 | verified, 59% not 58% | finding 4 |
| imo_p_adopted | Climate Home News 1 May 2026 | partly | 4 December resumption verified; vote counts and MEPC 85 absent (finding 3) |
| imo_p_adopted | IUMI Dec 2025 | unsupported | no counts (finding 3) |
| imo_nzf_abatement_cost_per_tco2e | T&E April 2025 pp. 7-8 | verified in round 1; the new label/explainer only moves dollars by CPI | CPI usa_2024 and usa_2025 exist |
| @next_dollar.opportunity_green | Charity Commission accounts | verified in round 1; the fact is unchanged | 0.6 x 0.65 x 1.0 = 0.39 matches the explainer |
| imo_jet_displaced_share | UNFCCC decision 1/CMA.6 para. 8 | not re-fetched (quote checked in round 1) | judgment 0.15 (0-0.4) with a source |

## Drivers
1. @cash.uov_per_dollar (shared estimate), development_vs_cash (shared judgment, anchored), imo_jet_share (judgment from T&E's revenue split, verified), imo_low_income_payer_consumption (judgment; the improvement is survey-scale facts for China and India), the compliance cost per tonne (sourced estimate). The best guess is the near-cancellation of two large terms, hence finding 1. What would most improve the model: the IMO's own decision on how the Fund is spent, and a volume-weighted incidence of shipping costs by income group.
2. Peers: -0.018 against a cause median of 0.0015; the gap is the sign of the compliance-cost term, which is the site's rule (2.21). Not a scope or counting error.

Verdict: fix needed (2 high, 1 medium, 2 low). Pass requires findings 1 and 2 to be fixed.
