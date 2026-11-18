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
Model-sha: c6adb6297abe6f8097c3e8d9b1a3192bb6a5feeeda096c0e4308e62903379baa
Rules: 0.2.2

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against ee138d3d.

Re-stamped (16 Nov 2026): unit labels state per $1M (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against e8ecb2b3.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 7dbeec92.

Re-stamped (16 Nov 2026): the summary's typed combined range replaced by the page's plausible range (placeholders). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): credit rule 2.24 wired at s = 1 (no value change). Mechanical: headline unchanged, 6 rows changed, against HEAD.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against ca214e5f.

Re-stamped (17 Nov 2026): credit rule 2.24: fb_credit_share is the skeleton's row (unused here, or wording only): no value change. Mechanical: headline unchanged, 1 row changed, against 2b24b73c.
