# Audit: allfed-charityevals, round 7 (scoped verification, credit rule 2.24)
Result: 0.02741 daly/$ = 27.4 years of healthy life per 1,000 dollars at mobiliser_share 100% (was 25.7). Verdict: pass.
Model-sha: e9294637452911fca5371515928ef1e0d4dc841d3967970a3802b450f1894e20
Scope: only `nuclear_attribution_share_shared` and `bio_attribution_share_shared` (0.62 (0.45-0.85) -> 0.66 (0.5-0.88)) and the classes added on the used shares.
Preflight: pass (only the generated/distributions.json out-of-date line, ignored by instruction).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | nuclear_attribution_share_shared | The range explainer still says the high end is "if partners' time is small"; partners' (government workshop staff) time is no longer in the denominator, only co-authors' is. | explainer text | Replace "if partners' time is small" with "if co-authors' time is small". | none |
| 2 | low | presentation | writeups/allfed-charityevals.md | Said "co-authors' and partners' time". Edited by this audit to "co-authors' time". | line under the adjustments table | done | none |

## Checks
1. Denominator: ALLFED $1.02M, 61 volunteers (about $0.28M), president's unpaid time (about $0.135M), co-authors (about $0.1M). Government staff in workshops removed (the audience that may act; mobiliser's share). No co-advocate named in the old text was dropped except those government staff. Arithmetic: 1.02 / 1.535 = 0.664, so 0.66. Consistent.
2. Facts: 61 volunteers, 54 hours a week unpaid president, and ALLFED's spending were checked against the 2024 Form 990 in round 1 (findings 6, settled in round 2); not re-fetched (large IRS e-file zip). The $0.1M for co-authors is a judged half of the old $0.2M, named as judgment, not anchored to another charity.
3. Value and range: best guess for the named contributors, not conservative or optimistic; 0.5 (volunteers at a day a week) to 0.88 (small co-author time) agree with the explainer's own logic.
4. Classes: ai, bio, nuclear, fb shares are `research`, pol is `win`; each is `<branch>_attribution_share_shared * mobiliser_share`, entering total_adj once through attribution_share (via the value-weighted attribution_share_shared). Nothing is taken twice, none missed. Unused branches (ai, pol, fb) have share 1 and weight 0.
5. "Would it have happened anyway": stays in `nuclear_counterfactual_adj` / `bio_counterfactual_adj` (0.75) and `$win_years_counted`; the share holds only co-contributors' resources. Not lost, not doubled.
6. Text: summary quotes no share; writeup table shows 0.66 (matches); the writeup sentence on partners edited (above). No 0.62 left in model, writeup or summary. No peer comparison text added.

Headline check: `npx tsx scripts/headlines.ts allfed-charityevals` = 27.4056 (25.7 x 0.66/0.62 = 27.4). Matches.

## Sources checked
Form 990 2024 (volunteers, president): verified in round 1, not re-fetched.

**Verdict: pass** (no high or medium finding; two lows)
