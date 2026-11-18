# Audit: project-drawdown-charityevals, round 12 (scoped verification)
Result: 8.033e-4 tco2e per donor dollar = 0.0004767 years of healthy life per 1,000 dollars (unchanged from round 11). Combined range not re-run (scoped round). Verdict: pass
Model-sha: 296ed7244b200b1d7dff02c745c3730f1fa572044ee2193993c34f9a20c4ec62
Rules: 0.3.6
Scope: wording fixes from round 11 only. No source or scope re-audit.
Preflight: `npx tsx scripts/preflight.ts project-drawdown-charityevals` passes (no blocking problem; one low simulation note on @meta.prior_vs_cash, as before).
Previous round: round 11's three findings (two prose, one model summary) are checked below.

## Checks
- Model diff: `git diff` of models/climate/project-drawdown-charityevals.json is one line, the `summary` field; no row, template or source changed. The Model-sha moves from f4ac0a7d to 296ed724 only for that reason. Headline still 0.000476690 (`scripts/headlines.ts`).
- Model summary: the typed "0.0015 tonnes" is now `{{row:tco2e_per_donor_dollar}}`, which resolves to 8.0327e-4 at the defaults (finding 3 fixed).
- Row values at the defaults (library.ts): tco2e_from_uov 10540 x phil_total_adj 0.2500 = 2636 (funders); corp_downstream 200332 x 0.02042 = 4091 (companies); inv_downstream 133555 x 0.011669 = 1558 (investors); pub_downstream 6678 x 0.02431 = 162 (public); sum 8447, outcome_total 9461 (the common factor 1 + 0.15 - 0.03 scales every branch alike, so shares are unchanged).
- Shares of outcome_total by branch: companies 48.4%, funders 31.2%, investors 18.4%, public 1.9%. The branch products are all positive, so the funders' branch is positive.
- Write-up summary: "A large part of it is foundation and family giving ... valued at the ranked climate charities' figures over an ordinary climate charity's" is true (31%, the second largest) and no longer claims a negative average (finding 1 fixed).
- "What drives the result": "Companies' money is the largest part of the result, about half; funders' giving is about a third, and investors' and the public's the rest" matches 48% / 31% / 20% (finding 2 fixed; the old "funders' giving is the negative part" was wrong in sign).
- Write-up diff touches only these two paragraphs.

## Findings
| # | Severity | Type | Where | Problem | Evidence | Fix | Effect |
|---|---|---|---|---|---|---|---|
| none | | | | No high or medium finding; round 11's three findings are fixed. | | | |

## Sources checked
None (scoped round: no source read).
