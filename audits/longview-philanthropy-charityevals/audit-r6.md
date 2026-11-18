# Audit: longview-philanthropy-charityevals, round 6 (scoped verification)
Result: 4.907e-4 uov/$ = 0.2453 years of healthy life per 1,000 dollars (was 0.2788; -12%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 95c4e79764edaedcf3114f52b2c90b90064ea2d9733292bc89be4b6b696b5fbe
Rules: 0.3.8
Scope: rule theoretical-cause-aggregates only (commit 65635d2e; inventory/rule-changes/theoretical-cause-aggregates.md). No source or scope re-audit.
Preflight: not re-run; the model file is unchanged, so lint and invariants are as in round 5.
Previous round: round 5's findings stay as they were; this round adds none to the model.

## Checks
- Model unchanged: `npx tsx scripts/audit-receipt.ts longview-philanthropy-charityevals` equals round 5's Model-sha (both 95c4e797).
- Headline now 0.245348 (`scripts/headlines.ts`), before 0.2788: matches the rule's table.
- Row diff, engine at 07e611bd against the current engine on the same data: only the rows below change.
  prior_dollar_value 2.5316e-3 → 3.1118e-3; shifted_dollar_value 6.345e-4 → 4.605e-4; moved_dollar_net_value 1.0143e-3 → 9.272e-4; informed_money_value 1843.2 → 1337.5; moved_value, outcome_total 10669 → 9388.3; uov_per_dollar 1.549e-3 → 1.363e-3; uov_per_donor_dollar 5.576e-4 → 4.907e-4. value_destinations and career_employer_value move by 2e-5 relative (0.0046467 → 0.0046466): the `#charityevals:mats/metr` reads shift in the last digits through the shared moved-money chain; negligible.
- Its destinations are ai, nuclear and biosecurity (all unchanged), so the moved value stays 4.6467e-3. Only the prior moves, through `#cause:global-health` in the denominator: ×1.229 (2.5316e-3 → 3.1118e-3). The shifted gain falls 0.3×(4.6467e-3 − 3.1118e-3) = 4.60e-4 from 6.35e-4 (×0.73), which moves the headline -12% together with the unchanged new-money part. Mechanism (shared by all seven): `#cause:x` is the equal-weight mean of the charities ranked in cause x. Under the rule it leaves out purely theoretical models. At the defaults the global-health mean falls 0.012888 → 0.010485 (×0.814; 22 charities with a theoretical model drop out or lose a part), animal-welfare rises 2.104e-6 → 2.184e-6 (×1.038; five charities), and ai, biosecurity, nuclear, catastrophic-risk and climate are unchanged to the last digit. Checked by evaluating `causeFigure` with the old hidden-test (`tooOld`, engine at 07e611bd) and the new one (`!ranks`) on the same data.

## Prose
Write-up writeups/longview-philanthropy-charityevals.md: result is a placeholder; "where shifted money would otherwise have gone" as the top driver and "at the high end, shifted money counts as a loss" still hold (shifted gain stays positive, prior 3.11e-3 below moved 4.65e-3 at the defaults, the loss appears only at a prior multiple above about 1.5). The model summary has no figure affected. Nothing stale.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

## Sources checked
None (scoped round: no source read).

## Drivers
Unchanged by this round; the move comes from the `#cause:` aggregates alone.
