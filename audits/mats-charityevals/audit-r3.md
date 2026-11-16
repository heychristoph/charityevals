# Audit: mats-charityevals, round 3 (verification round)
Result: 0.000811 daly/$ = 0.81 years of healthy life per 1,000 dollars (combined range 0.018-36; model's own ranges 0.072-4.4); cause median 5.26 (x0.15). Verdict: pass.
Model-sha: 0dcd3c6474d79af99eea773e9f41e1f20f76f3d9272f2a01194a637bc5e0eec7
Scope: only round 2's fixes (commit 772e4ae): the scholars' research during the programme moved into the training branch (fb_research_weeks, fb_research_value_share, fb_research_dollars, the two fb_* outcome rows, unmodelled_benefits_adj 0.05), the 37% wording, "four months or longer", three verbatim quotes, and the summary and write-up figures.
Mechanical: audit-model lint 0/0/0, findings (0); check.ts all models valid; simulation-check stable (5% 0.103, 50% 1, 95% 13.2 x best guess; no missed draws); normalization-audit no violation (generated/ restored with git checkout).

Previous round (round 2):
- 1 (medium, double counting/undervaluation): resolved. The research phase is now valued in the training branch. fb_research_dollars = fb_people (153) x 10/52 x 0.25 x $250,000 = about $1.84M. It sits outside fb_credit_share, correctly: that share splits the alumni's later work with their employers (MATS's resources over resources plus fb_work_dollars), while the research is done on MATS's own resources (cost, stipends, mentors). MATS's share of it comes through fb_attribution_share (1.574M / (1.574M + 2.186M) = 0.419) in attribution_share_shared, once; the alumni work is credited by fb_credit_share first, then the branch's attribution, as before. No overlap with fb_work_dollars (later work, years after) or the extension branch (ai_*, the four-month research). unmodelled_benefits_adj no longer mentions the research (5%, 2-20%, below GovAI's 15% and IAPS's 10%). fb_cost_share's explainer is updated. The judgment fb_research_value_share (25%, 10-50%) gives a reason and anchor: a third of a typical week for early-career mentored work, times about three quarters for those who would have done alignment research anyway (24% independent without a mentor, 13% with one, multiple answers allowed; both figures verified on the retrospective page).
- Figures checked against audit-model: result 0.8106 ("about 0.8"); model's own range 0.07184-4.423 ("0.07 to 4", summary and write-up); branch split: w_fb = 791.9 x 47.16 + 642.1 = 37,990, w_ai = 194.2 x 47.16 + 157.4 = 9,315; branch factors fb 1 x 0.85 x 0.419 = 0.356 and ai 0.72 x 0.6 x 0.5 = 0.216, so training 13,510 of 15,520 = 87% ("nearly nine tenths"); other benefits +5%; about two thirds of IAPS's 1.240 (0.654). Total check: 15,520 / 47,300 x 0.5 missing-data = 0.164 = total_adj. The tornado's top swings match the summary's list (chance of a catastrophe, Rethink's cut for misuse work, years a cut counts, missing-data discount).
- 2 (low, the 37% wording): resolved. ai_counterfactual_adj now says 24% independent research without a mentor and 13% with one, several answers allowed (verified); no "37%" remains in the model.
- 3 (low, extension length): resolved. "four months or longer" in the summary, years-of-impact and research-uptake explainers.
- 4 (low, quotes): resolved. "Evaluations: 17 scholars (22%)", "Oversight & control: 24 scholars (31%)" and "Estimated Value: $35,000 (Late 2024)" appear verbatim on their pages.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No finding. | - | - | - |

## Sources checked
- MATS Winter 2023-24 retrospective (LessWrong): "For reference, MATS research phase was 10 weeks long." present verbatim; 24% / 13% counterfactual answers, multiple responses allowed.
- MATS mentor selection (LessWrong): both track quotes verbatim.
- MATS transparency page: Anthropic API credits "Estimated Value: $35,000 (Late 2024)" verbatim.

**Verdict: pass** (no high or medium finding)
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against ee138d3d.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.
