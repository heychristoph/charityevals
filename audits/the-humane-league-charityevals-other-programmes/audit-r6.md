# Audit: the-humane-league-charityevals-other-programmes, round 6 (scoped verification)
Result: -0.0001231 years of healthy life per $1,000 (ced_per_donor_dollar -1.0782; was -0.0001287, magnitude -4.3%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 97bee8689e49c3449bfe830c7662c538b0740a0a7c051a58fb2c79b10bf722a0
Rules: 0.3.9
Scope: rule pain-default-10h only (inventory/rule-changes/pain-default-10h.md): `daly_per_sad` 0.0011 to 0.0011416 (9.6 to 10 hours of healthy life per day of disabling pain; assumptions/default.json). No source or scope re-audit.
Preflight: not re-run; the model file is unchanged, so lint and invariants are as in round 5.
Previous round: round 5 had no open high or medium finding; this round adds none.

## Checks
- Model unchanged: `npx tsx scripts/audit-receipt.ts the-humane-league-charityevals-other-programmes` equals round 5's Model-sha (97bee868).
- Re-ran the model with `daly_per_sad` at 0.0011 and at 0.0011416 on the same tree (everything else identical); the headlines and row moves below are that difference, and the headline equals `scripts/headlines.ts` and the rule's table.
- Only two rows move. ced_from_uov -2.5117 to -2.4202 (x0.9636 = 0.0011/0.0011416: money costs, mainly Proposition 12 compliance, are converted to chicken-days by dividing by `daly_per_sad`). ced_per_donor_dollar -1.1697 to -1.0782 (x0.9218).
- The hens' gain is unchanged in chicken-days (1.3420 before and after: -1.1697 + 2.5117 = -1.0782 + 2.4202); the headline converts with `daly_per_sad` (x1.0378): in healthy years the gain rises 3.8%, the costs stay fixed, so the net negative shrinks by 4.3%. It stays negative, consistent with the rule's table. This is the rule's arithmetic.

## Prose
Write-up writeups/the-humane-league-charityevals-other-programmes.md: the claim "the result is below zero in expectation because defending the state laws also keeps their cost to shoppers ... that cost outweighs the animals' gain from this whole line" still holds (net -0.0001231). Result figure is a placeholder; no typed result, no "9.6 hours". Nothing stale.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

## Sources checked
None (scoped round: no source read).

## Drivers
Unchanged by this round; the move comes from `daly_per_sad` alone.
