# Audit round 9 (scoped verification): campaign-for-tobacco-free-kids-charityevals
Result: 2.111e-4 daly/$ = 0.211 years of healthy life per 1,000 dollars at the defaults (round 8: 0.208). Verdict: pass.

## Scope
Only the round 8 findings: `us_attribution_share_shared`, the summary's typed shares, the `ghai_attribution_share_shared` explainer.

## Checked
- Finding 1 fixed: `us_attribution_share_shared` is 0.15 (0.06 to 0.30); health departments and agencies are out ("under the mobiliser's share"); no other charity's model is cited as anchor; the anchor (about five national partners plus the Action Fund, equal split about 15%, CTFK a lead but not the largest) is stated as a judgment. Row stays `"credit": "win"` via the used row.
- Finding 2 fixed: the summary reads `{{row:us_attribution_share_shared}}` and `{{row:glob_attribution_share_shared}}`; no typed share left.
- Finding 3 fixed: GHAI explainer says "one of about six outside supporters", about 17%, 20% (8% to 40%).
- `scripts/check.ts` passes (all models valid); headline 0.211.

## Findings
None.

Verdict: pass
Model-sha: 1b4f9df4a878a643ac07dc8d6565a7ba4c0896fd2a3c0bf6567a2d9aade6d843
