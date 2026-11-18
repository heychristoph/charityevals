# Audit: rethink-priorities-charityevals-global-health, round 7 (scoped verification)
Result: 1.1015e-4 uov/$ = 0.05507 years of healthy life per 1,000 dollars (was 0.1067; -48%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 7d47652790859ca5abbc6ec0c5a36c6cc13e3d581f813a193fddb4aa6cdd86dc
Rules: 0.3.3
Scope: rule theoretical-cause-aggregates only (commit 65635d2e; inventory/rule-changes/theoretical-cause-aggregates.md). No source or scope re-audit.
Preflight: not re-run; the model file is unchanged, so lint and invariants are as in round 6.
Previous round: round 6's findings stay as they were; this round adds none to the model.

## Checks
- Model unchanged: `npx tsx scripts/audit-receipt.ts rethink-priorities-charityevals-global-health` equals round 6's Model-sha (both 7d476527).
- Headline now 0.0550730 (`scripts/headlines.ts`), before 0.1067: matches the rule's table.
- Row diff, engine at 07e611bd against the current engine on the same data: only the rows below change.
  value_destinations (= `#cause:global-health`) 0.012888 → 0.010485; moved_dollar_value, career_employer_value likewise; shifted_dollar_value 1.4907e-3 → 7.697e-4; informed_money_value 1721.7 → 889.03; career_change_value 80.56 → 65.53; moved_value, outcome_total 2066.1 → 1066.8; uov_per_dollar, uov_per_donor_dollar 2.1331e-4 → 1.1015e-4. `prior_dollar_value` (GiveDirectly, fixed) is unchanged.
- Size: the model reads only `#cause:global-health` (×0.814). The gain is mean minus GiveDirectly's value (0.00792), so (0.010485−0.00792)/(0.012888−0.00792) = 0.516, which is the headline's move (0.05507/0.1067 = 0.516). Large because the gain over GiveDirectly is a small difference of two close figures. Mechanism (shared by all seven): `#cause:x` is the equal-weight mean of the charities ranked in cause x. Under the rule it leaves out purely theoretical models. At the defaults the global-health mean falls 0.012888 → 0.010485 (×0.814; 22 charities with a theoretical model drop out or lose a part), animal-welfare rises 2.104e-6 → 2.184e-6 (×1.038; five charities), and ai, biosecurity, nuclear, catastrophic-risk and climate are unchanged to the last digit. Checked by evaluating `causeFigure` with the old hidden-test (`tooOld`, engine at 07e611bd) and the new one (`!ranks`) on the same data.

## Prose
No write-up of its own; the summary uses placeholders only (`{{result}}`, `{{row:informed_money}}`, `{{row:marginal_vs_past_average}}`). Row explainers carry no typed result. The parent write-up writeups/rethink-priorities-charityevals.md says the global health part "is large because it steers foundations' money towards the global health charities": still true (0.055 against 1.4e-5 and 0.0048).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

## Sources checked
None (scoped round: no source read).

## Drivers
Unchanged by this round; the move comes from the `#cause:` aggregates alone.
