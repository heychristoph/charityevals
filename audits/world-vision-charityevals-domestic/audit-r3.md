# Audit: world-vision-charityevals-domestic, round 3

Result: 5.540e-6 daly/$ = 0.00554 years of healthy life per 1,000 dollars; global-health median 0.338 (x0.016). Verdict: pass (0 high)
Model-sha: 40072a31e23a46ab0fd0988c218684a931f9bf681e0537cb01346291bdc7109a

Scope: unchanged. Only the changes after round 2 were checked.
Mechanical: audit-model.ts 0 high or medium (one low, far-below, which the summary explains); check.ts all models valid.
Previous round: no open high or medium findings.

Findings: none above low.
- Summary: the stale 0.004 figure is gone and the text still gives the reason for the gap to the median. Resolved.
- `households_reached` explainer: "about 1.1 million" matches the computed 1,144,000.
- `ue_school_share` explainer: "about 1-1.5%" is consistent with KPMG note 16 ($3.2M of school and office supplies, against $206M of goods used at home, about 1.6% of all received); wording only.
- Write-up: the live-figure fallback 0.006 matches the result (0.00554).
