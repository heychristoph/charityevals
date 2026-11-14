# Audit: 80000-hours-charityevals, round 5 (scoped verification)
Result: 0.002401 uov/$ = 1.200 years of healthy life per 1,000 dollars (round 4: 1.068; the rise is the change checked here). Verdict: **pass** (no high findings in the model; one tooling false positive, below).
Model-sha: 2fe2fb132539582d18663f08c7900153a9a26acc4c23503687b8240af433b552
Scope: only the change since round 4: in value_destinations, the two hand-typed equal-weight lists became `#cause:ai` and `avg(#cause:biosecurity, #cause:nuclear)`; explainer, summary and write-up updated.
Mechanical: `audit-model.ts` reports one HIGH, INV-18 "halving the charity's next-dollar figure doesn't lower our headline (NaN → NaN)". It is a false positive of the script: its invariant library is the closure of `#id` references found by regex (`liveIds`), which reads `#cause:ai` as owner "cause", charity "ai", so the cause's member models never load and `#cause:x` is NaN there. The full-library check (`normalization-audit.ts`) shows INV-18 with 0 failing models of 411, and `headlines.ts` gives 1.20043. Fix belongs in scripts/audit-model.ts (liveIds: for `#cause:x`, add the models of every charity with cause or area x), not in the model.

Previous round: round 4 had no findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low (tooling) | audit script | n/a | audit-model.ts closure ignores `#cause:x`, so INV-18 reads NaN on any model using it | see Mechanical | extend `liveIds` in scripts/audit-model.ts | none |

## Checks of the change
- References: AI = 7 charities with area ai (CAIS, FAR.AI, MIRI, METR, Redwood, GovAI, Epoch AI); biosecurity = Johns Hopkins CHS, SecureBio; nuclear = NTI, Ploughshares, Arms Control Association. Matches the explainer and write-up. No cycle: `causeMembers` drops any charity whose lead model has beneficiaries "destinations" (80,000 Hours) and the reader's own charity, and the figure is memoised with a cycle guard.
- Half-each split of biosecurity and nuclear: a judgment, because 80K's fact gives one share (6%) for both; the explainer says so ("the two areas half each"). Sound; the nuclear mean (about 30) is far above biosecurity (about 7), so the split matters, and it is disclosed.
- Text: explainer, summary (1.2, range 0.06 to 24, matches audit-model 0.0599 to 24.05) and write-up bullets and headline agree with the formula. No stale "five AI models" or named-list text remains.
- Summary claim "most of that comes from the few careers outside AI": AI part about 0.9 x 0.63 = 0.57 of a total of about 2.05 (years per $1,000, before the career chain), so about 72% comes from outside AI. Holds.
- Write-up claim "biosecurity and nuclear careers alone carry about half of it" (line 48): bio/nuclear = 0.06 x avg(6.8, 30.2) = 1.11; global health about 0.4 (0.02 x about 20); AI 0.57; total about 2.05 after the share sum 0.985. Bio/nuclear is 1.11/2.05, about 54%. "About half" still holds; no change needed.

## Sources checked
No source re-fetched; no source or number changed since round 4.
