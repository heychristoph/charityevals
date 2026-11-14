# Audit: animal-charity-evaluators-charityevals, round 3 (scoped)
Result: 3.393e-6 uov/$ = 0.0017 years of healthy life per 1,000 dollars (combined range 6.8e-8 – 1.3). Verdict: pass.
Model-sha: 7247bdb0ebb3decfcbfd7fd55f749628166d41ea56d46f9dc0510001f9cf8222
Scope: only the changes after round 2 (findings 2-4), checked against the model at the defaults. `audit-model.ts`: 0 findings. `check.ts`: model valid.

Round 2 fixes:
- **Finding 2 (next dollar).** Implemented. facts/next_dollar.json now has 30% (10-72%), use 0.5 (low 0.4 x 0.3 x 0.85 = 10%, high 0.85 x 0.85 x 1.0 = 72%), the 28 October 2026 post in the source title and note, and the line that use covers money passed on beyond plan. The model's explainer and the write-up say 30%. `marginal_vs_past_average` = 0.3 at the defaults.
- **Finding 3 (recording_adj).** Implemented. `donors_moved` = (13,500,000 + (13,500,000 - 5,039,347) x 0.1) x 0.31837 = $4,567,362, which matches "$4.6M" in the explainer and write-up. The `recording_adj` explainer says direct gifts only.
- **Finding 4 (wording).** (a) $1,837,446 is correct. (b) The `ace_counterfactual_share` explainer's last sentence is as proposed; the share is 45.5%, "45%" stands. (c) `careers_changed` now cites the giving-metrics page with a `page` field and no quote. (d) The summary is shortened.

Figures at the defaults: `money_moved` $5,667,362 ("$5.7M" in the explainer and summary), `moved_per_dollar` 3.30 ("three dollars", "about three dollars" in the write-up), `grantmakers_moved` $1,100,000, cost $1,715,789 ("$1.72M"), headline 0.0017 as in the write-up and summary. The `marginal_vs_past_average` explainer's 30% (10-72%) matches the fact. The `donors_moved` explainer's "about $4.6M" and the write-up's "$4.6 million" match.

Quote: the restructuring post (https://animalcharityevaluators.org/blog/announcing-latest-influenced-giving-metrics-2026/, fetched 2026-11-14) says "ACE is restructuring our recommendations and grantmaking" and "which will require an overhaul of our approach to assessing our impact". The new funds are in early 2027: "In early 2027, we will tell you more about the new funds that we're launching." The note paraphrases this without quotation marks, which is accurate.

## Findings (0)
None.

Verdict: pass
