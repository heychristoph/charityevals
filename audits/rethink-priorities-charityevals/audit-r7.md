# Audit: rethink-priorities-charityevals, round 7 (scoped verification)
Result: 2.757e-8 uov/$ = 1.379e-5 years of healthy life per 1,000 dollars (was 2.092e-5; -34%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 70c763acd1e6c144fc38cd0d0e49cf76cb85871db7c8b2116de763fb327ba89e
Rules: 0.3.1
Scope: rule theoretical-cause-aggregates only (commit 65635d2e; inventory/rule-changes/theoretical-cause-aggregates.md). No source or scope re-audit.
Preflight: not re-run; the model file is unchanged, so lint and invariants are as in round 6.
Previous round: round 6's findings stay as they were; this round adds none to the model.

## Checks
- Model unchanged: `npx tsx scripts/audit-receipt.ts rethink-priorities-charityevals` equals round 6's Model-sha (both 70c763ac).
- Headline now 0.0000137870 (`scripts/headlines.ts`), before 2.092e-5: matches the rule's table.
- Row diff, engine at 07e611bd against the current engine on the same data: only the rows below change.
  value_destinations (= `#cause:animal-welfare`) 2.104e-6 → 2.184e-6; prior_dollar_value 1.2928e-6 → 1.6499e-6; shifted_dollar_value 2.434e-7 → 1.604e-7; informed_money_value 0.3309 → 0.2181; career_change_value 0.01315 → 0.01365; moved_value, outcome_total 0.3805 → 0.2508; uov_per_dollar, uov_per_donor_dollar 4.185e-8 → 2.757e-8.
- Animal-welfare mean ×1.038 but the prior (GiveDirectly / global-health mean × animal-welfare mean) rises ×1.276, so the gain 0.3×(2.1844e-6 − 1.6499e-6) = 1.604e-7 falls from 2.434e-7 (×0.66), the headline's move (0.659). Stays positive. Mechanism (shared by all seven): `#cause:x` is the equal-weight mean of the charities ranked in cause x. Under the rule it leaves out purely theoretical models. At the defaults the global-health mean falls 0.012888 → 0.010485 (×0.814; 22 charities with a theoretical model drop out or lose a part), animal-welfare rises 2.104e-6 → 2.184e-6 (×1.038; five charities), and ai, biosecurity, nuclear, catastrophic-risk and climate are unchanged to the last digit. Checked by evaluating `causeFigure` with the old hidden-test (`tooOld`, engine at 07e611bd) and the new one (`!ranks`) on the same data.

## Prose
Write-up writeups/rethink-priorities-charityevals.md: result figures are placeholders (`{{result}}`, `{{result:...-global-health}}`, `{{result:...-cross-cause}}`); the typed claims ("the animal part is tiny on the common scale", global health "large", cross-cause follows global health and AI) still hold at the new figures (1.4e-5, 0.055, 0.0048). Nothing stale.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

## Sources checked
None (scoped round: no source read).

## Drivers
Unchanged by this round; the move comes from the `#cause:` aggregates alone.
