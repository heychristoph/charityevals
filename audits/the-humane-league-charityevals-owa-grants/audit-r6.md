# Audit: the-humane-league-charityevals-owa-grants, round 6 (scoped verification)
Result: 0.00006762 years of healthy life per $1,000 (ced_per_donor_dollar 0.5923; was 0.00006309, +7.2%). Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 85968f574c9e391c75fc6a541b80d926756fd1bf1af40714a1f1d7b178005d6e
Rules: 0.3.11
Scope: rule pain-default-10h only (inventory/rule-changes/pain-default-10h.md): `daly_per_sad` 0.0011 to 0.0011416 (9.6 to 10 hours of healthy life per day of disabling pain; assumptions/default.json). No source or scope re-audit.
Preflight: not re-run; the model file is unchanged, so lint and invariants are as in round 5.
Previous round: round 5 had no open high or medium finding; this round adds none.

## Checks
- Model unchanged: `npx tsx scripts/audit-receipt.ts the-humane-league-charityevals-owa-grants` equals round 5's Model-sha (85968f57).
- Re-ran the model with `daly_per_sad` at 0.0011 and at 0.0011416 on the same tree (everything else identical); the headlines and row moves below are that difference, and the headline equals `scripts/headlines.ts` and the rule's table.
- Only two rows move. ced_from_uov -0.5157 to -0.4969 (x0.9636 = 0.0011/0.0011416): the compliance and other money costs are valued in units of value and converted to chicken-days of pain by dividing by `daly_per_sad`, so a worse pain-day makes the same cost fewer chicken-days. ced_per_donor_dollar 0.5735 to 0.5923 (x1.0328).
- The hens' gain is in chicken-days (1.0892 ced per donor dollar before and after: 0.5735 + 0.5157 = 0.5923 + 0.4969); the headline converts ced to healthy years with `daly_per_sad` (x1.0378). So in healthy years the gain rises 3.8% and the costs do not move: net x1.0328 x 1.0378 = x1.0718, the headline's move. This is the rule's arithmetic; the move is larger than 3.8% because the costs are about 47% of the gain and stay fixed.

## Prose
Write-up writeups/the-humane-league-charityevals-owa-grants.md and the model summary: result figures are placeholders; no typed result, no "9.6 hours". "The US and UK laws count their compliance costs ... against the hens' gain" and the side-effect percentages are unchanged and still true (net stays positive). Nothing stale.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |

## Sources checked
None (scoped round: no source read).

## Drivers
Unchanged by this round; the move comes from `daly_per_sad` alone.
