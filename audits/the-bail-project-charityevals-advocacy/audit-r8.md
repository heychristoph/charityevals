# Audit round 8: the-bail-project-charityevals-advocacy (scoped to one explainer)

Scope: since round 7 only the explainer of ue_family_tx was reworded (diff: one line). `audit-model.ts` runs clean: only the two standing LOW notes (far below the median, spread), both covered by the summary; result 0.0028 years of healthy life per $1,000, unchanged.

## Findings

1. [OK] The explainer now reads "Months of pretrial detention separate families as a prison term does: the shared share of a prison-year's value that falls on partners and children (facts/incarceration.json, Wakefield and Wildeman 2013), 15%, from 0 to 40%." It matches the shared fact family_share_of_incarceration_value (judgment, 0 / 15% / 40%, "Partners and children ... lose income, contact and care: 15% of the value of the prison-year") and no longer says "most of the harm a prison term does". Round 7's low finding is resolved.
2. [OK] Nothing else changed: formula (@incarceration.family_share_of_incarceration_value), side_effect "added", label and use in unmodelled_benefits_adj (tx_weight and t25_weight only, no overlap with ue_family) are as audited in round 7.

Previous round: round 7's low finding (explainer wording) resolved.

Verdict: pass (no high, no medium, no low)
Model-sha: 61c964339b7fb251c90f017d12bc56ea743dd86846b820b6219023ec04491143
Rules: 0.2.1

Re-stamped (15 Nov 2026): one consumption scale for US public money (normalization.md 2.14); 0.00283 → 0.00305.
Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 44d23366.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 4 rows changed, against cc9a04dd.
