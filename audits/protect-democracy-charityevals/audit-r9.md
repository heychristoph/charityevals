# Audit: protect-democracy-charityevals, round 9
Result: 1.737e-5 daly/$ = 0.0174 years of healthy life per 1,000 dollars (combined range 0.00074–0.41); cause median 0.0693 (×0.25). Verdict: pass.
Model-sha: 37c3498d2b0d9440b6d8fcaed6116598fef9b4d1837f6ce8427dd951bf787278
Scope: scoped verification of commit 61b6097 only (the answer to round 8's 1 low finding): facts/democracy.json's us_pr_movement_resources_per_year (best $3.4M, its note and explainer), the model's ref_attribution explainer, the write-up. The backsliding branch and everything else not re-audited.
Mechanical: audit-model lint 0 findings; invariants none; check.ts "all models valid"; simulation-check stable (5% 0.109×, 50% 1.00×, 95% 8.57× the best guess); normalization-audit not re-run (scoped; no checked row kind changed). Working tree clean (no generated/ written). Result moved from 0.01733 to 0.01737 (+0.2%), no move above 2×.
Previous round (r8):
1. Charter Commission's $0.3M unsourced (low): **resolved as a labelled judgment.** Note: commissioners' time 20 × 78 weeks × 10 hours × $35 = $546,000 (recomputed), staff and consultants judged $1.5M, about $2.05M over the decade = $0.2M a year; $0.9M (FairVote $4.7M × 20% = $0.94M) + $0.8M (Protect Democracy 7%) + $1.5M + $0.2M = $3.4M (3.44 unrounded); best 3,400,000 in the fact. The commission's own budget was not found (search of City of Portland pages), as the note says. Remaining softness of the inputs: finding 1 below.

## Formulas and stated numbers (all checked)
- ref_attribution_share (cost_total × ref_spend_share / $3.4M): computed 0.7076, explainer "about 71%" matches (was 69% at $3.5M). ref_implementation_adj 0.41 unchanged (local_offices_weight 0.5 × pr_offices_share 0.8247, as in round 8). ref_spend_share 0.07.
- Reform branch share: without ref_uov the result is 0.01592, so the branch is 8.3% of the result: "about a twelfth" (summary, write-up) matches; "about 7% of spending" (write-up) = ref_spend_share 0.07.
- Summary and write-up: 1.3% (field share), 11%, 4.5%, 35% next dollar, "about 0.02" and "about a quarter" (×0.25), $3.4 million, 103,000 people, 5%, +20%, -10%: match the model and facts. Explainer for the movement figure "$3.4 million" matches the fact, as does the FairVote model's "$3.4 million".
- No stale $3.5 million or 69% remains in either model, the facts, charities or write-ups.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | @democracy.us_pr_movement_resources_per_year | The commissioners' 78 weeks, 10 hours a week and $35 an hour, and the $1.5M of staff and consultants, are uncited judgments; the commissioners' terms ran 3 December 2020 to 3 December 2022 (104 weeks). | portland.gov Charter Commission pages (terms); fact note. | Explain the 78 weeks or take the FY 2021-22 adopted budget line when found. | none: $0.2M of $3.4M, inside the 2-7M range |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| @democracy.us_pr_movement_resources_per_year | ProPublica Form 990s (FairVote 541635649, Protect Democracy) | verified in earlier rounds | parts and sum recomputed here |

## Drivers
Unchanged from round 8. No finding above low.

Verdict: pass (0 high, 0 medium, 1 low).
