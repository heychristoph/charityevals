# Audit: macmillan-cancer-support-charityevals, round 4 (verification of the changes since round 3)

Result: 2.110e-6 daly/$ = 0.002110 years of healthy life per $1,000 (combined range 4.1e-4 – 0.0108; joint low–high on the model's own ranges 8.4e-5 – 0.047); cause median 0.3585 (×0.0059). Verdict: pass.
Model-sha: d768fb055c6d048b585faabc8e652ef56c06964e208e12da30318fe63b2fe9ee
Rules: 0.2.2

Scope: only the changes in commit 4cfb259 (model rows, write-up). Mechanical: audit-model.ts gives 0 high / 0 medium / 5 low, the same five as round 3 (evidence_adj diagnostic, three unused context rows, far-below with its explanation in the summary). The result moved from 2.111e-6 to 2.110e-6 daly/$ (under 0.1%), as expected from adding `wait_discount` to a branch worth about 4%. generated/ untouched (git status clean apart from this file).

Round 3's findings:
1. low, `program_spend` arithmetic: **resolved**. The explainer now reads "£32.0m new, less £11.7m of old grants released, plus £3.8m of discounting: £24.1m of grant expenditure in the statement's £104.2m of charitable spending"; 32.0 − 11.7 + 3.8 = 24.1.
2. low, posts branch adjustments: **resolved**. `posts_total_adj` = support_evidence_adj × posts_counterfactual_adj × attribution_share × leverage_funging_adj × `wait_discount` × new `posts_missing_data_adj` (= `$missing_data_discount`, explainer fits the posts). `prof_practice_share`'s explainer says first-year posts are credited in the posts branch. The `posts_dalys / posts_total_adj` unadjusted row still divides by the same row, so it stays consistent.
3. low, `posts_wellbys` effect: **resolved**. The explainer says the effect is anchored on better care against usual care, so using it for a specialist against none is an assumption, likely on the low side.
4. Write-up "How this model was checked": **resolved**. It names round 3 as passed and round 4 as the check of its fixes. Nothing else in the write-up changed.

No other row changed; `prof_missing_data_adj` still feeds the professionals branch only.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|

Re-stamped (15 Nov 2026): one consumption scale for US public money (normalization.md 2.14); 0.00211 → 0.00167.
Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against bebc953e.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against 32b69cd7.
