# Audit: johns-hopkins-center-for-health-security-charityevals, round 5 (scoped verification, credit step 5a)
Result: 0.01068 daly/$ = 10.7 years of healthy life per 1,000 dollars at mobiliser_share = 100% (was 7.52, x1.42; moved on purpose by rule 2.24). Verdict: pass.
Model-sha: 36fdcd057290cdcf35d3a54c933d75915c4c829db1d9f57894c623464cc6bc6b
Scope: fb_credit_share (pro-rata share now a judged 1, 0.5 to 1), attribution_share_shared (0.85 to 0.9, 0.7 to 1), the class on attribution_share (research), and text that follows. No full re-audit. Sources: the model's cited ones were not re-fetched (the changed rows' claims are about the model's own arithmetic and the Center's structure, already checked in rounds 1-4; the CDC CORI cooperative agreement is the model's cdc_cori_grant row).

| # | Row | Check | Severity | Finding / fix |
|---|---|---|---|---|
| 1 | fb_credit_share | Employers (a mobilised career) are out of the denominator. 1 (0.5-1) holds: the model and its sources name no other programme that trained or placed the same fellows or doctoral students (ELBI and the Health Security Scholars are paid from the Center's general funds and Coefficient Giving grants, the doctoral scholarships by the Center's own grant). | ok | none |
| 2 | attribution_share_shared | Counts partners in exercises and meetings only; CDC and the health departments (adopters) are out, CDC's grant money stays in the Center's spending (cdc_cori_grant is in program_spend). Arithmetic consistent: 0.85 means 15% outside; a third of it is CDC's and the departments' part, so 0.85 + 0.05 = 0.90; range 0.7-1 brackets it. No co-advocate named before was dropped. | ok | none |
| 3 | attribution_share (class research) | One shared row for all branches: attribution_share_shared x mobiliser_share, used once in total_adj. Research is right: the policy and pandemic work is adopted by others; the training's alumni careers are mobilised (employers' pay); CORI's use by CDC is adoption. Nothing takes the mobiliser's share twice or not at all. | ok | none |
| 4 | Would it have happened anyway | Lives in counterfactual_adj (0.7), years_of_impact and the per-person share working; not in the share. No loss or double count from the change. | ok | none |
| 5 | fb_share_working, fb_work_years, fb_evidence_adj, counterfactual_adj | None was set low on the assumption that fb_credit_share would cut the branch: share working is stated as only the added work (10% of fellows, 30% of students), work-years are the shared field figure, the evidence multiplier is the policy one. Still best guesses. counterfactual_adj (0.7) is a field-wide figure that also touches the training branch on top of the added-work shares; mild overlap, kept as one factor, no change needed. | ok | none |
| 6 | Text: fb_credit_share explainer | Names "fb_attribution_share", a row that does not exist in this model (one shared attribution_share). | low | In fb_credit_share's explainer replace "(fb_attribution_share)" with "(attribution_share)". |
| 7 | Text: summary, other explainers | No typed old share or sentence about credit by resources in the summary or other explainers. | ok | none |
| 8 | Text: writeups/<id>.md | Stale: training "gets its share of the credit by cost"; share-of-resources row 0.85 "CORI works with CDC's own staff"; "only the training's share depends on [the budget]". | fixed here | Rewritten in the write-up (see below). |

Writeup edits made: (1) the Training bullet now says the training gets the full credit for the added work-years (half if another fellowship shares them) and that employers are mobilised, not a co-funder; (2) the table row "The Center's share of the resources" 0.85 became 0.9 with partners' staff time in, CDC and health departments out as adopters; (3) the budget bullet no longer says the training's share depends on the budget.

Mechanical: headline 10.6848 reproduced by scripts/headlines.ts; preflight passes (only the out-of-date distributions line, ignored).

**Verdict: pass** (no open high or medium; one low for the builder).
