# Audit: metr-charityevals, round 5

Result: 0.108 years of healthy life per 1,000 dollars at mobiliser_share 100% (headline 0.107679, same as round 4). Verdict: pass (no findings).
Model-sha: da6e48b268a20292deaa7c687e50277284bb919ea8f047be41eb8a91e26e742c
Scope: wording-only follow-up to round 4.
Preflight: not re-run (wording only).
Previous round: round 4 low 1 (stale source quote on `attribution_share_shared`): resolved.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No findings. | - | - | None |

## Checks
1. Unchanged: headline 0.107679 as in round 4; `attribution_share_shared` still 0.8 (0.6 to 0.95), `attribution_share` still `attribution_share_shared * mobiliser_share`, class `research`.
2. Wording: `source.quote` and the quote in the explainer are now "METR has not accepted funding from AI companies, though we make use of significant free tokens, which we use for evaluations, research, and engineering, as noted above.", matching the sentence fetched from https://metr.org/about in round 4; retrieved 2026-11-17. Reads correctly.
