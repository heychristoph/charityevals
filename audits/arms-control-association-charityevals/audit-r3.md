# Audit: arms-control-association-charityevals, round 3
Result: 0.04134 daly/$ = 41.3 years of healthy life per 1,000 dollars, unchanged from round 2. Verdict: pass.
Scope: verification round. Only the change since round 2 (uncommitted `git diff` of the model: one line, the attribution_share_shared explainer) and the one round-2 finding. The rest of the model was passed in earlier rounds and is not re-audited.
Mechanical: audit-model lint 0 findings (dalys_per_donor_dollar 0.04134); the diff touches only the explainer text of attribution_share_shared, no value, range or other row.

Previous round:
1. Worked count sums to $265,000 but text said "about $0.25M" and 0.87: resolved. The explainer now reads "About $0.27M beside $1.69M of cost: 0.86, so 0.9". Arithmetic: $90,000 + $50,000 + $55,000 + $70,000 = $265,000, about $0.27M; 1.69 / (1.69 + 0.265) = 1.69 / 1.955 = 0.864, stated 0.86, rounds to 0.9. Value 0.9 (0.75 to 1) unchanged.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No new findings | - | - | none |

## Sources checked
None needed; no source, figure or value changed.

Verdict: pass (no findings)
Model-sha: 319f2f0d5b5bd828232c7872b6eb45001220e7705f077b59f46c4abf664eb562
