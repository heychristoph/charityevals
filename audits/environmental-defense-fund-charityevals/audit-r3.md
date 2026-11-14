# Audit: environmental-defense-fund-charityevals, round 3 (verification)
Result: 0.004353 tco2e/$ = 0.001846 years of healthy life per 1,000 dollars (combined range 7.4e-5–0.046); cause median not re-derived. Verdict: pass.
Model-sha: 6d57fd651ed51eb9fe3c04e3fab2b64b906bd01c3e02f6db724916bfebe90020
Scope: scoped verification of commit 2e6db2d against round 2's one finding (audit-r2.md); unchanged rows not re-audited.
Mechanical: audit-model.ts 0 findings; check.ts all valid. The summary and write-up say 0.0018 per $1,000 and about $230 a tonne; the live result is 0.001846 and 1/0.004353 = $230. Both match.
Previous round: round 2's #1 (45Q mixed bases) resolved.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

## Findings settled
- Round 2 #1: `ira_tonnes_per_year`'s explainer now states that the capture figure (cut to what is being built) and REPEAT's projection are on different bases, that about 125 Mt of projected but unbuilt capture stay in this branch before its delivered share, and that about 0.3% of the value is on a mixed basis, accepted. The formula is unchanged, as the round-2 fix allowed ("or note the basis in the explainer").
- The new FY2022 term uses `@environmental_defense_fund.health_nature_share_2022` (0.37, 0.32–0.40) as 1 minus it; the health-nature model uses the share itself, so FY2022's cost is split exactly. The change moved the result from 0.001862 to 0.001846 (−0.9%), as predicted (about −1%).
- Summary (0.0018) and write-up (climate 0.0018 at about $230 a tonne, health and nature 0.0016, "74% at 70 or older", round-2 text) match the live results of both models.

## Sources checked
No new sources in this model.

## Drivers
Unchanged from round 2.
