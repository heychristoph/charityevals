# Audit: rethink-priorities-charityevals, round 8 (scoped verification)
Result: 0.000007386 years of healthy life per $1,000 (uov_per_donor_dollar 1.477e-8; was 0.000007276, +1.5%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 70c763acd1e6c144fc38cd0d0e49cf76cb85871db7c8b2116de763fb327ba89e
Rules: 0.3.10
Scope: rule pain-default-10h only (inventory/rule-changes/pain-default-10h.md): `daly_per_sad` 0.0011 to 0.0011416 (9.6 to 10 hours of healthy life per day of disabling pain; assumptions/default.json). No source or scope re-audit.
Preflight: not re-run; the model file is unchanged, so lint and invariants are as in round 7.
Previous round: round 7 had no open high or medium finding; this round adds none.

## Checks
- Model unchanged: `npx tsx scripts/audit-receipt.ts rethink-priorities-charityevals` equals round 7's Model-sha (70c763ac).
- Re-ran the model with `daly_per_sad` at 0.0011 and at 0.0011416 on the same tree (everything else identical); the headlines and row moves below are that difference, and the headline equals `scripts/headlines.ts` and the rule's table.
- Rows that move: value_destinations (= `#cause:animal-welfare`) 1.2916e-6 to 1.3110e-6, prior_dollar_value 1.0095e-6 to 1.0247e-6, informed_money_value, shifted_dollar_value 8.463e-8 to 8.591e-8, career_employer_value, career_change_value, moved_value, outcome_total, uov_per_dollar, uov_per_donor_dollar: all x1.01506 exactly, the headline's move.
- Mechanism: this model reads only the animal-welfare cause mean (the equal-weight mean of the ranked animal charities), which rises 1.5% because not all of those charities read the rate (the corporate-campaigns line, for example, rises 3.8%); the prior is the same mean times GiveDirectly / global-health (unchanged), so gain and prior move together and nothing is amplified. Rule's arithmetic through the cause mean.

## Prose
Write-up writeups/rethink-priorities-charityevals.md and the model summary: result figures are placeholders (`{{result}}`, `{{result:...-global-health}}`, `{{result:...-cross-cause}}`, `{{row:marginal_vs_past_average}}`); the typed percentages (15%, 2%, 17%, 31%, 70%) are judgments, untouched. No "9.6 hours". Nothing stale.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

## Sources checked
None (scoped round: no source read).

## Drivers
Unchanged by this round; the move comes from `daly_per_sad` alone.
