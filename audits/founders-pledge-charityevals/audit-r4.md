# Audit: founders-pledge-charityevals, round 4 (scoped verification)
Result: 7.2406e-3 uov/$ = 3.620 years of healthy life per 1,000 dollars (was 3.771; -4.0%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: b52eab0ad71020c66d2b318cb4358e8bb008c82b638bfeec1969b3e8b68351e3
Rules: 0.3.2
Scope: rule theoretical-cause-aggregates only (commit 65635d2e; inventory/rule-changes/theoretical-cause-aggregates.md). No source or scope re-audit.
Preflight: not re-run; the model file is unchanged, so lint and invariants are as in round 3.
Previous round: round 3's findings stay as they were; this round adds none to the model.

## Checks
- Model unchanged: `npx tsx scripts/audit-receipt.ts founders-pledge-charityevals` equals round 3's Model-sha (both b52eab0a).
- Headline now 3.62029 (`scripts/headlines.ts`), before 3.771: matches the rule's table.
- Row diff, engine at 07e611bd against the current engine on the same data: only the rows below change.
  value_destinations 0.010599 → 0.0097931; moved_dollar_value, career_employer_value likewise; prior_dollar_value 5.1128e-3 → 5.1405e-3; shifted_dollar_value 1.6457e-3 → 1.3958e-3; moved_dollar_net_value 2.4126e-3 → 2.1669e-3; informed_money_value 13686 → 11608; career_change_value 66.25 → 61.21; moved_value, outcome_total 2.7543e5 → 2.6442e5; uov_per_dollar 0.022855 → 0.021941; uov_per_donor_dollar 7.542e-3 → 7.241e-3.
- Education (31.1%) and health money not itemised read `#cause:global-health` (×0.814), climate and catastrophic-risk (unchanged) and the itemised grantees are untouched, so value_destinations falls 7.6%. The prior is GiveDirectly over the global-health mean times a mix that is partly global health, so the global-health parts cancel and it rises only 0.5%. The shifted gain falls 15%, and with the new-money part unchanged the headline falls 4.0%. Mechanism (shared by all seven): `#cause:x` is the equal-weight mean of the charities ranked in cause x. Under the rule it leaves out purely theoretical models. At the defaults the global-health mean falls 0.012888 → 0.010485 (×0.814; 22 charities with a theoretical model drop out or lose a part), animal-welfare rises 2.104e-6 → 2.184e-6 (×1.038; five charities), and ai, biosecurity, nuclear, catastrophic-risk and climate are unchanged to the last digit. Checked by evaluating `causeFigure` with the old hidden-test (`tooOld`, engine at 07e611bd) and the new one (`!ranks`) on the same data.

## Prose
Write-up writeups/founders-pledge-charityevals.md and the model summary: result and next-dollar figure are placeholders. Typed claims unaffected: the cause split (31.5%, 31.1%, 27.4%, 2.8%), "about sixteen dollars to recommended charities per dollar spent" (a spending ratio), "its climate third adds almost nothing" (climate untouched). Round 3's "cause median 0.06519 (×122)" is a past round's figure, not prose. Nothing stale.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

## Sources checked
None (scoped round: no source read).

## Drivers
Unchanged by this round; the move comes from the `#cause:` aggregates alone.
