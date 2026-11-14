# Audit: blueprint-biosecurity-charityevals, round 3 (verification of round 2's two lows)
Result: 0.005892 daly/$ = 5.892 years of healthy life per 1,000 dollars, unchanged from round 2. Verdict: **pass** (no findings).
Scope: only the two round-2 settlements and that nothing else changed.

Mechanical: `audit-model.ts` on the model: 0 findings; headline dalys_per_donor_dollar 0.005892 (5.892 per $1,000), as in round 2.

Diff check: `git show 3b5dfc8 -- models facts` is exactly two text edits, no numbers touched:
1. `facts/next_dollar.json`, id `blueprint_biosecurity`, note: the clause "; its other 2024 funders included the Survival and Flourishing Fund ($78K)" is removed; the sentence now ends at the Founders Pledge citation. Value 0.37 and the rest of the note (room 0.5, use 0.7, run 1.05) are unchanged.
2. Model `ppe_spend` explainer: "Part VII),, and" became "Part VII), and".
(The same commit also adds audit-r2.md.)

Previous round: finding 1 (unsourced SFF $78K clause): resolved, clause dropped and room evidence never depended on it. Finding 2 (double comma): resolved.

No findings.

Verdict: **pass**
Model-sha: 8dbada791af3fa491b3e03448b01b51a5c529daaab6ee085f80d035b837c79b6

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.
