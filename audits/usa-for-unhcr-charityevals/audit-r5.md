# Audit: usa-for-unhcr-charityevals, round 5 (verification)
Result: 6.033e-5 daly/$ = 0.0603 years of healthy life per 1,000 dollars (combined range 0.0136-0.2681). Verdict: pass.
Scope: only the changes since round 4: share_5_14_of_over5 now reads @death_ages.crisis_share_5_14_of_over5; the file was re-indented (layout only, the fingerprint ignores it).
Mechanical: audit-model 0 high or medium (one low spread finding already carried; warn on judgment share; info on unranged inputs); check.ts "all models valid"; generated/ untouched.

Findings: none.

Checks passed:
- The row's formula is the bare fact read (@death_ages.crisis_share_5_14_of_over5); the fact is a judgment 0.2 (0.1-0.4), the same value and range as the row held before. value_per_death's formula still uses the row correctly.
- Headline 0.0603 per $1,000, unchanged from round 4 (value unchanged).
- Re-indent: no row, value or text changes beyond the one row above found in the model's rows.

Verdict: pass
Model-sha: 41bc2504c3314bb61174ce576beaaa5a78cebfd155e98e9a8fb42abe0aeb579d
