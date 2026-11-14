# Audit: norwegian-refugee-council-charityevals-advocacy, round 8 (verification; numbered 7 on its branch)
Result: 3.284e-5 uov/$ = 0.0164 years of healthy life per 1,000 dollars (combined range 0.00098–0.276); cause median 0.074 (×0.222). Verdict: pass.
Scope: only the two uncommitted edits answering round 7: (1) the summary's figures, (2) acc_evidence_adj's explainer (value unchanged, 0.8).
Mechanical: audit-model lint 0 high / 0 medium / 1 low (spread, stated in the summary); result unchanged at 0.01642 years/$1k, so the edits are text only.

Previous round: round 6 passed with two lows (summary figures stale, acc_evidence_adj explainer double counting); both are closed below.

Checks:
- Summary figures: "about 0.016 years of healthy life per $1,000 (combined range 0.001-0.28), about a fifth of the site's global-health median" matches the run (0.01642; 9.773e-4 – 0.2759; this model x0.2218 of the 0.07404 median over 77 models). Closed round 6 finding 1.
- acc_evidence_adj explainer: now rests only on NRC's self-reported partial progress ("no outside account of how much access changed on the ground") and says how well the aid works is in the shared aid value. The "aid per person and its value are averages" clause that duplicated the aid-value range is gone, so the 0.8 (0.5-1) no longer discounts what @aid_value carries. Consistent with fund_evidence_adj = 1. Value unchanged; the access branch is about 3% of the result. Closed round 6 finding 2.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| (none) | | | | | | | |

Verdict: pass
Model-sha: 498e334c39818b8aab68d36cf3374c58a14c55284eadbf72d8c9d31ac85a7a70

Re-stamped after merge: this round's model combined with round 6's verified change on main (the unused career rows read the shared defaults in facts/meta.json; careers_changed is 0, result unchanged at 0.0164).
