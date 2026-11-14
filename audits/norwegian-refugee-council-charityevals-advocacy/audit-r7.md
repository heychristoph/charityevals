# Audit: norwegian-refugee-council-charityevals-advocacy, round 7 (verification; numbered 6 on its branch)
Result: 3.284e-5 uov/$ = 0.0164 years of healthy life per 1,000 dollars (combined range 0.00098–0.276); cause median 0.074 (×0.222). Verdict: pass.
Scope: only commit 191dbdb: (1) the missing-data wording in the summary and aid_value_per_dollar's explainer, (2) fund_evidence_adj changed from a 0.8 (0.5-1) judgment to formula 1.
Mechanical: audit-model lint 0 high / 0 medium / 1 low (spread, stated in the summary); check.ts "all models valid"; result 0.01321 -> 0.01642 years/$1k as the commit says.

Previous round: round 5 passed, no open findings.

Checks:
- Missing-data wording: facts/aid_value.json is a fixed judgment (0.2, 0.05-0.8) anchored on the relief models "before the missing-data step", and its explainer says a model applying it "applies its own missing-data step once". The model's only slider path is $missing_data_discount via acc_/fund_missing_data_adj (and careers_). No row of the fact or the model applies it a second time. The new wording matches the fact and the model; nothing claims the slider applies twice.
- fund_evidence_adj = 1: the old 0.8 (0.5-1) explainer already said the advocacy-moved doubt is "in the share above" (fund_aid_moved_share, 0.002-0.04), and aid effectiveness is in @aid_value (relief models with their own evidence adjustments), so the discount counted both. Removing it removes a double count. No gap: the funding-total is measured; the moved-share range and the aid-value range (0.05-0.8) carry the doubt. Result moves x1.24, within the old judgment's range.
- The summary's figures are stale against the run (finding 1). Branch split (about 97%/3%) still holds: the blended evidence_adj is 0.9957, so the funding branch dominates.
- Asymmetry (finding 2): acc_evidence_adj stays a 0.8 (0.5-1) judgment whose explainer says "aid per person and its value are averages", the same aid-value doubt now removed from the funding branch. The access branch is about 3% of the result, so the effect is small.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | summary | The summary's figures predate the run: "about 0.013 years ... (combined range 0.001-0.23), an eighth of the site's global-health median". The run gives 0.016, combined range 0.001-0.28, and the median is now 0.074 over 77 models (this model x0.222), about a fifth. | audit-model: 0.01642; 9.773e-4 – 0.2759; "median of 77 global-health models: 0.07404 (this model ×0.2218)" | Change to "about 0.016 years ... (combined range 0.001-0.28), about a fifth of the site's global-health median". | none |
| 2 | low | double counting | acc_evidence_adj | Access branch keeps a 0.8 evidence discount partly for "aid per person and its value are averages", which the shared aid value's range now carries (the reasoning that removed fund_evidence_adj). | row explainer; aid_value_per_dollar uses @aid_value | Either reduce the explainer to the part that is not in the ranges (the gains are NRC's own report of partial progress, already in acc_aid_gain_share 0.01-0.2) and set the row to 1, or keep 0.8 and drop the "averages" clause. | up to x1.25 on the 3% access branch, under 1% of the result |

Verdict: pass
Model-sha: 1962c04fa15397a665b76fed393d48c237885863ed24cb5df65b07ee453d0d60
