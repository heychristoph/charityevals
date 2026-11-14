# Audit: prison-policy-initiative-charityevals, round 5 (verification)
Result: 2.852e-5 daly/$ = 0.0285 years of healthy life per 1,000 dollars (combined range 0.0030–0.272); cause median 0.0693 (×0.41). Verdict: pass.
Model-sha: b7621d9eec67d5d83adbe933c18cbf8ee20051f70690c6bab2d365b5f0787198
Scope: unchanged (one programme column, four branches). Scoped to the round-4 fix (git diff HEAD~1 HEAD -- models at ae71bf3: one explainer line).
Mechanical: audit-model runs (0.0285, unchanged from r4); 0 findings; check.ts valid; 0 generated/ changes.
Previous round:
- N4 (`copay_fee_savings`): resolved. The explainer no longer names Nevada or Virginia or "about 30,000 people"; it says "a few state prison systems" and "tens of thousands of people" at copays of 2 to 5 dollars, and the 2M (0.5–8M) judgment is stated as ours. The value and range are unchanged, and the diff touches only this explainer, so nothing else in the model moved.

No new findings.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| copay_fee_savings | none (explainer only) | no unsourced specifics remain | N4 resolved |
