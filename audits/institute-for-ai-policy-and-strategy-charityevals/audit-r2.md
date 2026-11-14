# Audit: institute-for-ai-policy-and-strategy-charityevals, round 2 (verification round)
Result: 0.001240 daly/$ = 1.24 years of healthy life per 1,000 dollars (combined range 0.028-55; model's own ranges 0.096-4.9); cause median 5.57 (x0.22). Verdict: fail (one medium finding).
Model-sha: af20eda7991d8e7844086dee98c69fbd7b127da0722c3d6f5e6263dcb943ce8d
Scope: only round 1's fixes in commit 3d29300 (misuse share, fellowship source and split, fb_credit_share formula, bills wording, overhead high end, field_work_years source, next-dollar page reference) and the numbers the summary and write-up state.
Mechanical: audit-model lint 0/0/0, findings (0); scripts/check.ts: all models valid. Not re-run this round (scoped): normalization-audit, simulation-check.

Previous round (round 1):
- 1 (misuse share): the row is 0.2 (0.1-0.3) with the two-of-eight reasoning; the write-up now says 20% and 1.2 (headline), range "about 0.1 to about 5" (model's own 0.096-4.9, matches), "about four fifths of GovAI's" (1.240 / 1.576 = 0.79, matches), fellowship credit 16% (0.1614, matches), next dollar 38.5% (facts/next_dollar.json best 0.385, matches), branches "about half each" (deaths x branch adjustments: research about 53%, fellowship about 47%, matches). BUT the model's own `summary` field was not updated (finding 1).
- 2 (fellowship source): resolved. The archived page (fetched) says "The fellowship runs from September 1 to November 21, 2025" and "Senior Fellows will receive $22,000 and Fellows will receive $15,000 as a stipend to work full-time during the 3-month program". 22 x 15,000 + 6 x 22,000 = $462,000 holds. The 22/6 split rests on the fellows page, not re-fetched.
- 4 (field_work_years source): resolved. McAleese's post (fetched) says about 1100 FTEs in 2025 (600 technical, 500 non-technical), against about 400 in 2022; the note's "a few hundred to about 1,100 in under a decade" fits.
- 5 (fb_credit_share): resolved. Formula cost_total * fb_cost_share / (cost_total * fb_cost_share + fb_work_dollars) = 4.159M x 0.3 / (1.248M + 6.482M) = 0.161; no typed value left.
- 6 (bills): resolved; the quote "the Chip Security Act and Stop Stealing our Chips both incorporating IAPS research on location verification and a proposed BIS whistleblower program (respectively)" is on the year-in-review page (fetched). Model and write-up wording match it.
- 7 (overhead high end): resolved. 0.11 is Rethink's split at its low end (50% of $3.34M = $1.67M of central costs for the projects, over $15.65M = 10.7%); the reason for not adding the restricted-release gap is stated.
- 8 (Rethink Priorities): the explainers and charities/rethink-priorities.json now name the IAPS model (see the three Rethink rounds).
- 9 (next-dollar reference): resolved (page range corrected).
- 3 (template/gen-templates.py and 16 models with the field-building branch off still type 5 (2-10) for fb_work_years): not done, deliberately; not a model defect (switched-off placeholders cannot move a result, INV-14 exempts them); reported to the orchestrator.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | model `summary` | The model's `summary` field still has the old result and comparisons: "about 0.9 years of healthy life per $1,000, from 0.02 to 17 on the model's own ranges", "about 60% of GovAI's result" and "a smaller share of work aimed at misuse (15%, its cyber work)". The model is 1.24, its own ranges 0.096-4.9, 79% of GovAI's, and the share is 20% (the same as GovAI's 20%, so "smaller share" is also wrong). | models/catastrophic-risk/institute-for-ai-policy-and-strategy-charityevals.json line 12; audit-model | Write "about 1.2 years", "from 0.1 to 5", "about four fifths of GovAI's result, with the same share of work aimed at misuse (20%) and a larger race risk ...". | none |

## Sources checked
Archived fellowship page, McAleese's field-growth post and IAPS's year in review: verified as above. Not re-fetched: the fellows page (22 + 6), Rethink's accounts.

**Verdict: fail** (medium: the model's summary still states the pre-fix result, range, GovAI ratio and misuse share)
