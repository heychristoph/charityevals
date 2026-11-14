# Audit: campaign-for-tobacco-free-kids-charityevals, round 4 (verification)

Model-sha: e0d85431640dde0d581f47da525cc2e09b90c4a2a66cdb18d443236966a0c575

Checked:
- `git diff c306ee5~1 c306ee5 -- models/` is one line in one file: the adv_short_term_share explainer now ends "0.5, 0.4 to 0.8." No other content change.
- The row's value is {low 0.4, best 0.5, high 0.8}, so the explainer matches it and the "40% to 80%" in its body.
- `scripts/audit-model.ts`: Findings (0).
- `scripts/check.ts`: all models valid.

## Findings

none

**Verdict: pass**
