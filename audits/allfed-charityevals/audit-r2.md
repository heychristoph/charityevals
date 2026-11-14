# Audit: allfed-charityevals, round 2
Result: 0.02574 daly/$ = 25.7 years of healthy life per 1,000 dollars (combined range 0.88–750); Verdict: pass.
Model-sha: 90e172dd70115b57b2357cc21d95f9fd6d58bb929aa9175e7c0b57c92be6643d
Scope: verification round. Only the round 1 fixes were checked, for correctness and for new problems.
Mechanical: audit-model reports the numbers above; check.ts "all models valid". The next-dollar low end now shows 12.41 and the famine share's low end 16.77 in the tornado.

## Round 1 findings

| # | Finding | Status | Check |
|---|---|---|---|
| 1 | next dollar room 0.9 | settled | facts/next_dollar.json `allfed` (intact after the merge; the main-side rows are present): room 0.8 (0.6–1.0), use 0.7 (0.5–0.9), run 1.0 (0.9–1.05). 0.8 × 0.7 × 1.0 = 0.56; low 0.6 × 0.5 × 0.9 = 0.27; high 1.0 × 0.9 × 1.05 = 0.945, shown as 0.95. The note cites the 18 November 2025 update (about $400,000 for the core team, programmes and team halved) and the ACA comparison. Write-up paragraph says 56%. |
| 2 | famine share low end | settled | facts/catastrophe.json: low 0.6, best 0.94, high 0.95. The explainer gives the reason (weaker winter, Reisner et al. 2018; about 360M direct deaths against the 814M threshold gives 56%). Page: "p. 4 (PDF page 5), Table 1". The model's nuclear_famine_share explainer says "as low as 60% if the winter is weaker". The input's low end moves the result to 16.8 (from 25.7), so the doubt now shows. |
| 3 | Rethink preset wording | settled | nuclear_evidence_adj explainer says the preset is for "the threat or severity of a nuclear war" and that its figures were not set with food resilience in mind. The write-up's "Biggest uncertainties" and the summary follow. |
| 4 | grant | settled | program_spend explainer and write-up: $25,000 general-support grant to Manifold for Charity (Schedule I). |
| 5 | ALLFED UK | settled | explainer: registered January 2023, no income or spending in 2024. Write-up: "registered in 2023". |
| 6 | president's time | settled | nuclear_attribution_share explainer adds 54 hours a week at about $50 an hour for 50 weeks, about $0.135M: 1.02 ÷ (1.02 + 0.28 + 0.135 + 0.2) = 1.02 ÷ 1.635 = 0.624, so 0.62. Both branches 0.62 (0.45–0.85). The write-up table shows 0.62. |
| 7 | leverage_funging_adj wording | settled | explainer now names the room factor of @next_dollar.allfed and asks only the funging the room factor misses; value 1 (0.85–1.05). |
| 8 | page | settled | see finding 2. |

## New problems
None. The write-up's figures match the live run: headline 26 (25.7), range "about 0.9 to about 750" (0.88–750), the largest swing 3.4 to 250 (3.40–249), 0.1% discount rate "about 52" (51.8). The summary matches (26; 0.9 to 750). The "How this model was checked" section states the round 1 outcome and that a verification round checked the fixes.

Verdict: pass. 0 high, 0 medium, 0 low.

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.
