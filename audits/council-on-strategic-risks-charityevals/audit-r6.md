# Audit: council-on-strategic-risks-charityevals, round 6 (scoped verification, field-building credit)
Result: 0.03281 daly/$ = 32.8 years of healthy life per 1,000 dollars (combined range 1.39-777 on the audit-model run). Verdict: fix needed (text only: one low and one set of stale model-text replacements; no open high; one medium).
Model-sha: 5bde380550c20cdf6eb5e5546a9c48700f9bae749ce93e3321e02d754db4e608
Scope: fb_credit_share, fb_attribution_share_shared and the fb rows that the pro-rata cut used to dampen; branch shares and text that follow.
Preflight: pass (only the generated/distributions.json line, ignored).
Previous round: r4 finding 1 (fb_credit_share): resolved. Employers are out of the denominator and under `mobiliser_share` only; r5 had passed.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | summary, unmodelled_benefits_adj | Model text quotes the old branch shares. Engine now (the earlier branch products scaled by the audit-model result): fellowships 68.6%, nuclear 23.1%, biological 8.3%, climate security under 0.01% (was 16.5 / 63.4 / 20.1). The summary says "about 63% ... nuclear ... a fifth the biological ... the fellowships add 17%"; unmodelled_benefits_adj says "about 60% of it ... the nuclear branch's" and "4% (6% of the nuclear value)". | audit-model: 32.81 = 12.28 x 2.67; fb product rose by 1/0.088 | Summary: replace "after each branch's adjustments, about 63% of that is the nuclear work (about a quarter of the cost) and a fifth the biological work (about a third), each dollar valued as ... and the future lost counted through the discount rate; the fellowships (8% of the cost) add 17%, counted through the work their alumni add, and the climate-security work" with "after each branch's adjustments, about 69% of that is the fellowships (8% of the cost), counted through the work their alumni add, about 23% the nuclear work (about a quarter of the cost) and 8% the biological work (about a third), each dollar of the field work valued as ... counted through the discount rate; the climate-security work". Add to the uncertainty sentence: "and how many fellows work on these risks because of the fellowships (no alumni survey is published)". unmodelled_benefits_adj explainer: "about a quarter of it, after adjustments, the nuclear branch's"; the 4% line is a share of the nuclear value, so re-derive: 6% of nuclear value is 1.4% of the total, and set the row to 0.025 (0 to 0.1), writing "1.4% (6% of the nuclear value)" and the total "2.5% (0 to 10%) in all". Without this, the side-effect allowance is 17% of the nuclear value, not the 6% the explainer judges. | text only; the unmodelled row change lowers the result by about 2.4% |
| 2 | low | plausibility | fb_credit_share | 1 (0.5 to 1) has its best at the top of the range. No other programme named in the model or its sources trains the same people (Spiez, Robert Koch Institute and HERA staff are the international cohort, but nothing shows a second fellowship placing them), so 1 is a fair best guess; but mid-career biosecurity staff typically attend several courses. | fb_share_working explainer | Keep 1; set the range to 0.4 to 1 so the uncertainty is not one-sided. Not required. | none at best |

Checks for the field-building branch:
- fb_credit_share 1: right for the model's evidence (finding 2).
- fb_share_working 10% (3% to 25%): explainer anchors on who the fellowship moves into or keeps in the work, with mid-career entrants already in the field; nothing in it was set low to compensate for the pro-rata cut (the cut was applied separately and the explainer predates it). Keep. It is now the main fellowship driver (tornado 17 to 67) with no survey: a judgment with its reference class stated, acceptable; the writeup says so.
- fb_counterfactual_adj 1: explicit that entrants-anyway are already out of fb_share_working. Right, no double cut. fb_evidence_adj 1: alumni valued at a typical dollar, no further step. fb_work_years 5 (shared). All hold as best guesses and none was set low on the assumption of the pro-rata cut.
- fb_attribution_share_shared 0.95 (0.7 to 1): co-deliverers of the training only (reworded correctly); employers under s. Right class (research). s multiplies once (tornado mobiliser_share 0.05 gives 1.64, 1 gives 32.81).
- Leverage plausibility: alumni work is valued at about ten dollars of typical work per dollar of cost; within the fellowships' plausible reach given the 10% share, but check on the next audit that no unmodelled netting of the employers' own alternative use is needed: the people moved into the work would otherwise do work of far smaller value on this scale, so no netting, consistent with 2.24.

Write-up corrections made (writeups/council-on-strategic-risks-charityevals.md):
- Summary: branch shares now 69% / 23% / 8% (fellowships, nuclear, biological); range typed 0.8 to 180 replaced by {{low}} to {{high}}.
- "How the impact happens": fellowship credit sentence now says full credit unless another programme trained the same people, employers under the shared mobiliser setting.
- "What drives the result": 69 / 23 / 8 / under 0.01%; the fellowships' weight explained by about ten dollars of typical work per dollar of cost and the 10% share without a survey.
- Uncertainties: nuclear swing "about 17 to 190"; bio split "about 35 to 30" (scratch runs at 45% and 80%: 34.8 and 30.2); new bullet for fb_share_working (17 to 67).
- "How this model was checked": one sentence for the credit change.

## Sources checked
No new sources; the branch's facts (36 fellows, $350,000 cost, 10% share) are unchanged and were verified in rounds 1-3.

## Drivers
mobiliser_share, win_years_counted, the nuclear cut per million, missing_data_discount, discount rate; among the branches the fellows' 10% share working (judgment, no survey) now carries 69% of the result.
