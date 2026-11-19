# Audit: securebio-charityevals, round 9 (scoped verification)
Result: 2.181 years of healthy life per $1,000. Combined range not re-run (scoped round). Verdict: pass.
Model-sha: 408ae7012096cb5ac488bac2e8ef589402f6b699a07d53c49e8224f0923cdeca
Rules: 0.3.13
Scope: the previous round's findings only (rules never-started-weight, lives-added, never-started-prose and never-started-branches). No source or scope re-audit.
Preflight: passes (low lint range lines only)
Previous round: round 8, fix needed: survivable catastrophes' share typed as two-fifths, actually 37%.

## Checks
- Resolved: line 47 now says survivable catastrophes bring "a little over a third" (37% recomputed last round) and COVID-scale the rest (14%); no two-fifths remains. Same Model-sha as round 8.
- Spot-check: years counted 1 -> 0.4711 and 20 -> 6.658 (text 0.47 to 6.7); other typed figures (1.6 to 7.9, 0.76 to 3.8) held last round on an unchanged model.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | none | - | - | - |
