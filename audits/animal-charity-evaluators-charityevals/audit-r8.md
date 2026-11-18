# Audit: animal-charity-evaluators-charityevals, round 8 (scoped verification)
Result: 0.00006490 years of healthy life per $1,000 (uov_per_donor_dollar 1.298e-7; was 0.00006038, +7.5%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 701154d09126513662e90e46c1f3a33eb0925734ea9938ab225dd087e52296ba
Rules: 0.3.10
Scope: rule pain-default-10h only (inventory/rule-changes/pain-default-10h.md): `daly_per_sad` 0.0011 to 0.0011416 (9.6 to 10 hours of healthy life per day of disabling pain; assumptions/default.json). No source or scope re-audit.
Preflight: not re-run; the model file is unchanged, so lint and invariants are as in round 7.
Previous round: round 7 had no open high or medium finding; this round adds none.

## Checks
- Model unchanged: `npx tsx scripts/audit-receipt.ts animal-charity-evaluators-charityevals` equals round 7's Model-sha (701154d0).
- Re-ran the model with `daly_per_sad` at 0.0011 and at 0.0011416 on the same tree (everything else identical); the headlines and row moves below are that difference, and the headline equals `scripts/headlines.ts` and the rule's table.
- Only the rows below move. value_destinations (= moved_dollar_value = career_employer_value; the equal-formula weighted mean of the eight Recommended Charities' figures at ACE's fund split) 9.736e-7 to 1.0104e-6, x1.0378 = 0.0011416/0.0011 exactly: each of the eight charity models is itself x1.0378 (their headlines: THL 0.002354 to 0.002443, Sinergia 0.006649 to 0.006900, and so on), so the split's ratios are unchanged. prior_dollar_value (GiveDirectly / global-health mean x animal-welfare mean) 1.0095e-6 to 1.0247e-6, only x1.0151: the animal-welfare mean is an equal-weight mean over all ranked animal charities, not all of which read the rate (global health unchanged).
- Because the gain rows subtract the prior from a destination that rose more: moved_dollar_net_value 1.4067e-7 to 1.4943e-7 (x1.062); shifted_dollar_value -1.0755e-8 to -4.270e-9 (x0.397; stays negative: the ordinary-charity prior is still above ACE's split); moved_value, outcome_total, uov_per_dollar, uov_per_donor_dollar x1.0749 = the headline's move; career_change_value x1.0378.
- Arithmetic: moved_value = (donors_moved x discount x moved_dollar_net_value + grantmakers_moved x shifted_dollar_value) x (1 + side effects); the donors' term rises 6.2% and the grantmakers' negative term shrinks, which gives +7.5%. This is the rule's arithmetic, amplified by the subtraction, not a change in the model.

## Prose
Write-up writeups/animal-charity-evaluators-charityevals.md and the model summary: result figures are placeholders (`{{result}}`). The typed claims still hold: three dollars of giving per dollar spent, "do very little per dollar on the common scale", the 75% prior (a parameter, unchanged), the 30% next dollar, and "The Humane League's figure is about 5 times the next charity's" (all eight charities move by the same x1.0378, so the ratio is unchanged). "fell from 0.0017 to 0.0011" in the audit-history paragraph is a dated record of an earlier change, not a current figure. No "9.6 hours" or typed result anywhere. Nothing stale.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

## Sources checked
None (scoped round: no source read).

## Drivers
Unchanged by this round; the move comes from `daly_per_sad` alone.
