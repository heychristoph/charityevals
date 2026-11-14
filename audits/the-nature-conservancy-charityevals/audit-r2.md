# Audit round 2 (scoped verification): The Nature Conservancy (charityevals model)

Scope: verify the only change since round 1: the combined range in the model's `summary` and the write-up, closing round 1's out-of-scope item O2.

Checked:
- `git diff` of models/climate/the-nature-conservancy-charityevals.json: a word diff shows exactly one change, in `summary`, "0.00005-0.0035" to "0.00005-0.0021". No branch, row, value or source changed.
- `git diff` of writeups/the-nature-conservancy-charityevals.md: one line, same replacement ("combined range 0.00005-0.0021").
- `npx tsx scripts/audit-model.ts` prints "Combined range ... 4.928e-5 – 0.002147", which rounds to 0.00005-0.0021, matching both texts. The point result 0.0004 is unchanged.

Findings: None.

Verdict: pass
Model-sha: 5db2bf4515d446a5a2b2cfce54f39ed498c11cd1055172089a00315d5f1b8aa1

Re-stamped after merge: the pandemic and forest-loss rows now read the shared facts Cool Earth added (same values); result unchanged at 3.25e-4.
