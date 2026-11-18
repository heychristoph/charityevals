# Audit: the-humane-league-charityevals-corporate-campaigns, round 6 (scoped verification)
Result: 0.00011005 years of healthy life per $1,000 (was 0.00010604, +3.8%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 10800bc0f86924c96a30df4dca0d463e0728f3582420333c8a82af225489acac
Rules: 0.3.8
Scope: rule pain-default-10h only (inventory/rule-changes/pain-default-10h.md): `daly_per_sad` 0.0011 to 0.0011416 (9.6 to 10 hours of healthy life per day of disabling pain; assumptions/default.json). No source or scope re-audit.
Preflight: not re-run; the model file is unchanged, so lint and invariants are as in round 5.
Previous round: round 5 had no open high or medium finding; this round adds none.

## Checks
- Model unchanged: `npx tsx scripts/audit-receipt.ts the-humane-league-charityevals-corporate-campaigns` equals round 5's Model-sha (10800bc0).
- Re-ran the model with `daly_per_sad` at 0.0011 and at 0.0011416 on the same tree (everything else identical); the headlines and row moves below are that difference, and the headline equals `scripts/headlines.ts` and the rule's table.
- No row of the model changes in its own units: the model's rows are hens, shares and chicken-days of pain, none reading money costs. Only the headline's conversion to healthy years uses `daly_per_sad`, so the headline moves by exactly x1.03782 = 0.0011416/0.0011 (the rule's "close to 10/9.6" is 1.0417; the old value 0.0011 was 9.64 hours, hence 1.0378 rather than 1.0417).
- No cost or cause-aggregate row is in this model, so there is no amplification.

## Prose
Write-up writeups/the-humane-league-charityevals-corporate-campaigns.md and the model summary: result figures are placeholders; the "Verification" bullet in the review history is dated history without figures; no typed result, no "9.6 hours". Nothing stale.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

## Sources checked
None (scoped round: no source read).

## Drivers
Unchanged by this round; the move comes from `daly_per_sad` alone.
