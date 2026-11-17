# Audit: council-on-strategic-risks-charityevals, round 7 (scoped verification)
Result: 0.03203 daly/$ = 32.0 years of healthy life per 1,000 dollars (combined range 1.35-758). Verdict: fix needed (one medium, text only).
Model-sha: f8e7765a625818175ca241494f74b27d391bdae283fdf9784eaa406e75dc6a79
Scope: round 6's medium (summary and unmodelled_benefits_adj) and the write-up figures the 2.4% drop could move.
Preflight: pass (only the generated/distributions.json line, ignored).
Previous round (r6): medium, unmodelled_benefits_adj: resolved (0.025, 0 to 0.1; "about a quarter of it", "1.4% (6% of the nuclear value)", "2.5% (0 to 10%) in all"; 6% x 23% = 1.4%, plus 0.5% and 0.5% = 2.4%, rounded 2.5%; result 32.81 to 32.03, -2.4% as predicted). Medium, summary: NOT fully resolved (finding 1). Low, fb_credit_share range: not applied, optional.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | model summary | The new clause is in, but the old one was not removed: the summary still reads "...counted through the discount rate; the fellowships (8% of the cost) add 17%, counted through the work their alumni add, and the climate-security work (over a third of the cost)...". It states the fellowships twice and quotes the stale 17% (now 69%). | summary text | Replace "; the fellowships (8% of the cost) add 17%, counted through the work their alumni add, and the climate-security work (over a third of the cost), valued as better use" with "; the climate-security work (over a third of the cost), valued as better use". | text only |

Write-up figures after the drop: shares unchanged (the unmodelled allowance scales every branch alike: 69 / 23 / 8 / under 0.01%). Corrected by me: bio split "from about 35 to 30" to "from about 34 to 29" (34.8 and 30.2 x 0.976); fellows' share working "17 to 67" to "17 to 65" (tornado 16.65 to 64.99). Nuclear swing "about 17 to 190" holds (16.7 to 185.8). The write-up's summary uses {{result}}, {{low}}, {{high}}, so no typed headline.

## Sources checked
None new.

## Drivers
Unchanged from round 6.
