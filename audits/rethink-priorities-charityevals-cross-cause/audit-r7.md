# Audit: rethink-priorities-charityevals-cross-cause, round 7 (scoped verification)
Result: 9.522e-6 uov/$ = 0.004761 years of healthy life per 1,000 dollars (was 0.008805; -46%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: a47dd143fd38f5f1c8a8bb210283599981111ba0006d0859bfc045b470003d05
Rules: 0.3.7
Scope: rule theoretical-cause-aggregates only (commit 65635d2e; inventory/rule-changes/theoretical-cause-aggregates.md). No source or scope re-audit.
Preflight: not re-run; the model file is unchanged, so lint and invariants are as in round 6.
Previous round: round 6's findings stay as they were; this round adds none to the model.

## Checks
- Model unchanged: `npx tsx scripts/audit-receipt.ts rethink-priorities-charityevals-cross-cause` equals round 6's Model-sha (both a47dd143).
- Headline now 0.00476078 (`scripts/headlines.ts`), before 0.008805: matches the rule's table.
- Row diff, engine at 07e611bd against the current engine on the same data: only the rows below change.
  value_destinations 4.507e-3 → 3.839e-3; moved_dollar_value, career_employer_value likewise; prior_dollar_value 2.7693e-3 → 2.8999e-3; shifted_dollar_value 5.213e-4 → 2.819e-4; informed_money_value 86.01 → 46.51; career_change_value 28.17 → 24.00; moved_value, outcome_total 98.92 → 53.48; uov_per_dollar, uov_per_donor_dollar 1.761e-5 → 9.522e-6.
- Reads global health (25%, ×0.814), animal welfare (35%, ×1.038) and ai (30%, unchanged); the mix falls ×0.852, the prior (a GiveDirectly multiple of that mix) rises ×1.047, and the gain 0.3×(mix−prior) falls 0.5213e-3 → 0.2819e-3 (×0.54), the headline's move (×0.54). Mechanism (shared by all seven): `#cause:x` is the equal-weight mean of the charities ranked in cause x. Under the rule it leaves out purely theoretical models. At the defaults the global-health mean falls 0.012888 → 0.010485 (×0.814; 22 charities with a theoretical model drop out or lose a part), animal-welfare rises 2.104e-6 → 2.184e-6 (×1.038; five charities), and ai, biosecurity, nuclear, catastrophic-risk and climate are unchanged to the last digit. Checked by evaluating `causeFigure` with the old hidden-test (`tooOld`, engine at 07e611bd) and the new one (`!ranks`) on the same data.

## Prose
No write-up of its own; summary uses `{{result}}` only. Its remark "animal welfare's share is worth almost nothing at the site's animal weights" still holds (animal-welfare mean 2.2e-6 against 0.0105 and 0.0028). The parent write-up says the cross-cause part follows its global health and AI shares: still true.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

## Sources checked
None (scoped round: no source read).

## Drivers
Unchanged by this round; the move comes from the `#cause:` aggregates alone.
