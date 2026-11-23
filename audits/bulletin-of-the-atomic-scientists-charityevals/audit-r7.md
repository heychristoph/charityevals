# Audit: bulletin-of-the-atomic-scientists-charityevals, round 7 (scoped verification)
Result: 4.761 years of healthy life per $1,000 (was 4.866, -2.2%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 0aa3d6029c4db2e6fff108ece090aaafe7f6b9f3a8651f139b8fb848077203cc
Rules: 0.3.13
Scope: rules never-started-weight, lives-added, never-started-prose and never-started-branches only (inventory/rule-changes/). No source or scope re-audit.
Preflight: passes (one low prose line: nuclear_cost_share typed as "45%", not blocking)
Previous round: round 6 was "fix needed" (one medium: one-year figure 1.1 should be 1.0); resolved, the write-up now reads "from 1.0 to 15".

## Checks
- Diff vs origin/main: only never_started marks on the five *_future_dalys rows, reworded explainer on future_dalys_averted, descendants:false on value_per_death and covid_value_per_death, the new future_animal_harm row, the dalys_direct formula, and the summary's future clause. Nothing else.
- verify.mts: lives_added off + never_started_weight 1 = 4.866030 = origin/main defaults. Headline 4.761379 = scripts/headlines.ts (4.76138) = never-started-branches.md "after" (4.761, +0.067% from 4.758).
- Weights at weight 0: w_ai 8962 (main 9021 minus ai_future 58.5), w_bio 20673 (main 22939 minus 2264), w_nuclear 454436 (main 463080 minus 8601), differences within the population term; w_pol, w_fb 0. No future in any w_<branch>.
- Preflight: passes.

## Prose
Summary and write-up read. Shares from w_ times the adjustments (missing-data discount common): nuclear 95.4%, pandemic 3.4%, AI 1.1%, climate under 0.1%; the stated 95/3/1 hold. Long-run value set 18.80 (about 19). Years a cut counts: 1 gives 1.028, 20 gives 14.54 (1.0 to 15). Nuclear catastrophe cut at its low/high ends: 1.019 and 42.18 (1.0 to 42). "Future does not count by default" holds (future_dalys_averted is 0 at the defaults).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

Re-stamped (23 Nov 2026), rule cause-portfolios: Money to a cause with no named recipient (#cause:x) is valued at the cause's portfolio: named charities weighted by a published fund's grants (assumptions portfolios), not the average of the charities on the site, so adding a charity moves no other figure (normalization 2.8). Mechanical: headline 4.761 → 4.761 (−0.00061%), 12 rows changed, against the tree before the rule.

Re-stamped (23 Nov 2026), rule input-domains: Every input states its kind of number (domain); the simulation draws each by its kind, so no draw is a number it can't be (normalization 2.18, INV-27). Mechanical: headline unchanged, against the tree before the rule.
