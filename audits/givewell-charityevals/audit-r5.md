# Audit: givewell-charityevals, round 5 (scoped verification)
Result: 0.07209 uov/$ = 36.04 years of healthy life per 1,000 dollars (combined range 14.27–91.05); cause median 0.06312 (×571). Verdict: **pass**.
Model-sha: 42d226d1ce0249244ba20d17ad05e4353cadab496e52d7ac47bc890d166a1a52
Scope: only the new row `shifted_dollar_value` and `moved_value` reading it (docs/normalization.md 2.8, src/engine/moved-money.ts, INV-12). Sources unchanged, not re-fetched.
Mechanical: audit-model "Findings (0)"; normalization-audit 0 violations (orchestrator ran it; not rerun).
Previous round: r4 passed; nothing open.

## Checks of the change
1. Row `shifted_dollar_value` in the model equals the shared row printed by `scripts/moved-money.ts own-split informed` word for word: id, section `moved_money`, label, format `small`, formula `moved_dollar_value - prior_dollar_value`, explainer.
2. `moved_value` differs from r4 only in `open_philanthropy_moved * shifted_dollar_value` replacing `open_philanthropy_moved * (moved_dollar_value - prior_dollar_value)`; the rest is unchanged. The two expressions are identical.
3. Headline unchanged: `scripts/headlines.ts` gives 36.0434 (before 36.0434); audit-model 36.04.
4. audit-model: no high finding (0 findings).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Sources checked
Unchanged; none re-fetched by instruction.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.

Re-stamped (16 Nov 2026): pre-audit cleanup: shared facts read (US layers, preemption chance, market leakage, evaluator side effects), reference classes named, ranges widened where evidence is thin; headline unchanged. Mechanical: headline 36.04 → 36.23 (+0.50%), 10 rows changed, against e247896f.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 1b0eb29e.
