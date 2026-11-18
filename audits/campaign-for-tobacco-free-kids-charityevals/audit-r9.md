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
Rules: 0.3.7
Model-sha: 3cad0c10ffe2aa931c1f62dcc1270362811ed405e6b21f4cb8fd35cf7eb3b52f

Re-stamped (18 Nov 2026): glob_evidence_adj now reads the shared facts/tobacco.json lmic_wins_evidence_adj (same 0.8, 0.5 to 1), which the Concentric Policies model also reads. Mechanical: headline unchanged, against HEAD.
