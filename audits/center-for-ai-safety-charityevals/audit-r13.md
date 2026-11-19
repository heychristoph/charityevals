# Audit: center-for-ai-safety-charityevals, round 13 (scoped verification)
Result: 3.892 years of healthy life per $1,000. Combined range not re-run (scoped round). Verdict: pass.
Model-sha: ec0d655e26152b9e92d08b28335ed81dbf32aa4b2ce8bd381882a7f143461af4
Rules: 0.3.13
Scope: the previous round's findings only (rules never-started-weight, lives-added, never-started-prose and never-started-branches). No source or scope re-audit.
Preflight: passes (low lint range lines only)
Previous round: round 12, fix needed: slider default typed as 3% beside the shared 5%.

## Checks
- Resolved: writeups/center-for-ai-safety-charityevals.md line 19 now reads "You can move the 5% with a slider."; slider best is 0.05; no 3% remains. Same Model-sha as round 12.
- Spot-check: AI chance 50% -> 38.92 (text 39); the other typed figures (0.30, 0.53 to 37, 1.7 to 6.1, 1.3 to 10) held last round on an unchanged model.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
