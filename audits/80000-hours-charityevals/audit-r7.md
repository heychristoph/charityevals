# Audit: 80000-hours-charityevals, round 7 (scoped verification)
Result: 0.002108 uov/$ = 1.054 years of healthy life per 1,000 dollars (combined range 0.0542–20.50); cause median 5.255 (×0.20). Verdict: **pass**.
Model-sha: b521936a4ccb7d9a6205c82e7a3ad186f4c571d9b7c14e0ba0ac6a7f4cf4156d
Scope: only the change since round 6: the shared row `prior_dollar_value` (now the cause-split form for a mover whose money spans causes) and the summary's "about 1.2" corrected to "about 1.1". Programmes, year and sources unchanged and not re-checked.
Mechanical: audit-model prints "Findings (0)"; normalization-audit none (run by the orchestrator, 0 violations for every invariant).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | stale text | summary | Range "0.06–24" is stale; audit-model now gives the combined range 0.0542–20.50 (about 0.05–21). | audit-model, "Combined range" | Write "0.05–21" | none (text only) |

## Checks of the change
- Word for word: label, formula and explainer of `prior_dollar_value` equal the `prior_dollar_value` row printed by `scripts/moved-money.ts own-split net eighty_k_career_share_ai=ai,...` (compared in full).
- Shares: the four share terms and their divisor match `value_destinations` (ai, bio_nuclear with avg(biosecurity, nuclear), global health, animals), same weights.
- Headline unaffected by this change: `money_moved` is 0, so `moved_dollar_net_value` is multiplied by zero. `headlines.ts` gives 1.05399, the audit-model bottom line is 1.054.
- Why 1.054 and not r6's 1.200: the model file's last commit before this change is 64d4b43 (r6 state), so the change is upstream. The result reads `#cause:ai`, biosecurity and nuclear (the AI-risk and win-years shared judgments and the charities' models) and GiveWell's figures live; those models changed in later merges, and the working tree also has uncommitted edits to the GiveWell, ACE and Rethink Priorities models. I did not bisect which one. Summary "about 1.1" is correct at 1.054.
- Other summary figures: 36% next dollar, 40% share, $15,000 x 5 years, split 90/6/2/0.5 are unchanged inputs (not re-derived); only the range is stale (finding 1).

## Sources checked
None re-fetched; no source changed.
