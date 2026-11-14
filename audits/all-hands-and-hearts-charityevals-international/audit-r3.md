# Audit: all-hands-and-hearts-charityevals-international, round 3
Result: 8.657e-5 daly/$ = 0.0866 years of healthy life per 1,000 dollars (combined range 0.0147-0.509); cause median 0.0754 (x1.15). Verdict: pass (no findings).
Model-sha: 26ff360829429b2b1128b31d8156ff6acadf5bf76ea85afed4da42a64ef5d2f2
Scope: unchanged; only the changes of commit 001c6e4 since 95fed69 were checked (`git diff 95fed69 001c6e4 -- models/ writeups/`).
Mechanical: lint 0 high / 0 medium / 0 low ("Findings (0)"); invariants none; check.ts all models valid; normalization-audit and simulation-check not re-run (one explainer changed).

Previous round (round 2 lows):
- rel_people explainer did not say the 13,000 may include people reached after 31 August: resolved. It now says the low end of 9,000 is for the case the totals overlap or the 13,000 (counted in a report of November 2025) includes people reached after 31 August. The inputs (9,000 / best / 13,000) are unchanged.
- Age mix of the deaths: kept as a judgment, as agreed; no change needed.

Diff check: the model has exactly one edit (the rel_people explainer). Nothing else changed in it; the result is identical to round 2 (0.0866).

No new findings.

Verdict: pass.
