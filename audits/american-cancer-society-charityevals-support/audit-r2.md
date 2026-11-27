# Audit: american-cancer-society-charityevals-support, round 2 (verification of the changes since round 1)

Result: 3.630e-6 daly/$ = 0.00363 years of healthy life per $1,000 (combined range 8.4e-4 – 0.0157); cause median 0.338 (x0.011). Verdict: pass.
Model-sha: 835ab703aae44e267365f3839bf0ebdfc1f685fd4528e98a6f8245b4ac0d5806
Rules: 0.3.13

Mechanical: `scripts/audit-model.ts` gives 0 high, 0 medium, 1 low (far-below; the summary's reason still matches the rows). Result moved from 0.00378 to 0.00363 (-4%), inside the builder's stated 0.0038 to 0.0036. Peers unchanged (Red Cross 0.0045, Salvation Army 0.0052, Habitat 0.0054). Only the changes were checked; no new source other than Ambroggi was fetched.

## Round-1 findings

| # | Finding | Status | Check |
|---|---|---|---|
| 1 | info_evidence_adj counted the dose | settled | The explainer now names small trials, shrinking pooled effects and self-selected callers, and says the dose is in the effect rows. 0.7 (0.4-0.95) is a judgment with those reasons; no double count remains. |
| 2 | info doses and patient share off BHF's basis | settled | BHF-health rows: personal dose 0.1 (0.03-0.3), reading dose 0.01 (0.003-0.03); x0.25 SD gives 0.025 (0.0075-0.075) and 0.0025 (0.00075-0.0075), exactly the new rows. `info_patient_share` 0.7 (0.5-0.85) multiplies the WELLBYs (`info_wellbys_total`); the explainer says why it differs from BHF's 0.22 (BHF's readers are the general public). See new low 1. |
| 3 | cash-equivalent share, two questions in one row | settled | `cash_equivalent_share` 0.8 (0.6-0.95) equals Habitat's; the explainer is the one question (cash value of in-kind help). "Would have paid less" moved to `lodge_counterfactual_adj` (0.7, 0.5-0.9) and `rides_counterfactual_adj` (0.6, 0.4-0.85), whose explainers name it and no longer point back at the share row. Net is the -4% above, as predicted. See new low 2 (not a shared fact). |
| 4 | lodge deaths averted had no named anchor | settled | Ambroggi M et al., The Oncologist 2015;20(12):1378-85 (PubMed 26512045) exists: 27 studies, 716,153 patients; "increasing travel requirements are associated with more advanced disease at diagnosis, inappropriate treatment, a worse prognosis". The explainer's description matches ("in most of the studies" is slightly stronger than the abstract, which says associated; see low 3). The 5% x 4% chain is still a judgment, now with a named reference class. |
| 5 | implementation_adj applied to lodge and rides | settled | Removed from `lodge_total_adj` and `rides_total_adj`; remains in `info_total_adj` only. Label and explainer say so. |
| 6 | helpline contacts include bookings | settled | The explainer now puts bookings for lodging and rides in the 0.9 (0.8-1), applied to the information branch. Adequate for a low. |
| 7 | volunteers' vehicle costs | open, low | Unchanged; under 1% of the result. |
| 8 | illness averted at 0 | settled | The explainer now gives a reason (kept-alive patients live on with the illness of cancer and treatment, so the net could go either way). Accepted; about +2% foregone. |
| 9 | in-kind patient lodging and grants | partly settled | `lodge_donated` is now the verified $3.634m land leases only (note 4 quote), and the explainer says why the $2.7m is left out. The $24.0m of grants still has no stated branch; unchanged, low. |

## New findings

| # | Severity | Category | Row | Finding | Fix |
|---|---|---|---|---|---|
| 1 | low | sensitivity | info_patient_share | The 0.7 (0.5-0.85) has no reference for the share of callers who are patients or close caregivers; ACS may publish the mix of helpline callers. Effect of the full range on the result: about +-1%. | Cite the caller mix if ACS gives one, otherwise keep as a judgment. |
| 2 | low | comparability | cash_equivalent_share | The value is Habitat's but typed in this model; Habitat has its own row at 0.8 and Salvation Army's `inkind_cash_equivalence` is 0.8 too, so the three agree today, but a slider or change in one doesn't move the others. Round 1 asked for a shared fact. | Make a shared fact for the cash value of in-kind help (0.8, 0.6-0.95) and have all three read it. |
| 3 | low | wording | lodge_deaths_averted_per_household | "in most of the studies it covers" is a little stronger than the abstract's "associated with". | Say "associated with" without the "most of". |
| 4 | low | write-up | writeups/american-cancer-society-charityevals.md line 5 | The write-up's fallback figure for this model reads 0.004 while the model is 0.00363 (0.0036) and the same file says "moved from 0.0038 to 0.0036" in the checked section. Other figures use two significant digits (0.0033). The span is a live figure, so only the stored text is off. | Set the span text to 0.0036. |

The write-up's lines on this model otherwise match: information doses with BHF's and the patient share, the evidence adjustment, Habitat's 80% with other options in the counterfactual rows, the review of distance and cancer care, delivery doubt on the information branch only, illness averted left at 0 with its reason.

No change introduced a unit error, double count or breach: the counterfactual and cash-value questions are now separate rows, the dose is taken once (dose rows) and trust once (evidence adjustment), and the patient share is applied once, in the WELLBY total.

Verdict: pass. Findings: 0 high, 0 medium, 4 new low (plus round-1 lows 7 and 9 open).

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against bebc953e.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): wording: wrong prose placeholders restored to the typed text or pointed at the evaluator view, and typed results in the summary made placeholders or recomputed at the 30% mobiliser share (no value moves). Mechanical: headline unchanged, against bc9e3979.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.

Re-stamped (25 Nov 2026): the plain-words story (docs/story.md) added; no value changed.

Re-stamped 27 Nov 2026: source link points to the model's page (the old /<model-id> address was a 404); values unchanged.
