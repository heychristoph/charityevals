# Audit: world-central-kitchen-charityevals, round 6
Result: 1.223e-4 daly/$ = 0.122 years of healthy life per 1,000 dollars; cause median 0.0898 (×1.36). Verdict: **pass**.
Model-sha: 4d026e4d12f4d2f2866ec81d7acec4d5ec98526e59ba66d46004a313cec33b69
Rules: 0.3.7
Scope: verification of round 5's low finding 1 only (attribution_share_shared 0.9 (0.75-1) → 0.95 (0.8-1), new explainer; summary and write-up sentences). Not the whole model.
Mechanical: audit-model 0 findings; check.ts valid; simulation-check 5% 0.533, 50% 1.00, 95% 1.84 × best guess; normalization-audit not rerun (coordinator).
Previous round: round 5 passed with one low finding (this change).

Checks done: the row has a reason (explainer), anchor (volunteers' 1-2% of spending from Form 990, CARE's relief goods at 0.95) and range 0.8-1. It names the others' share as delivery only (volunteers, UN and Jordanian convoys in Gaza), consistent with food valued from the charity's own food bill and subcontractors inside the cost. `attribution_share` still reads it by formula; no second attribution elsewhere. Result moves 0.1158 → 0.1223 (×1.056), as 0.95/0.9 gives. Summary "about 0.12" and write-up headline 0.12 match; "a little above the median" holds (×1.36). The new write-up sentence (0.10 → 0.12, round 5 no high or medium, sixth round checked its one fix) is accurate; the adjustments bullet ("its volunteers and UN logistics are others'") matches the explainer.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| none | | | | No findings. | | | |

## Sources checked
None new.

## Drivers
Unchanged from round 5: missing-data discount, the dollars-per-DALY bridge, Gaza counterfactual share, baseline consumption in Gaza, the consumption-to-UoV step.

Verdict: pass
Model-sha: 4d026e4d12f4d2f2866ec81d7acec4d5ec98526e59ba66d46004a313cec33b69

Re-stamped (16 Nov 2026): Pre-audit cleanup (16 Nov 2026): shared figures read from facts at the same values (@myanmar.household_consumption_share_of_gdp, @survey_consumption.disaster_affected_share_of_survey_mean, @volunteering.disaster_volunteer_ls_gain_year); judgments' reference classes named from sources; volunteer-hours labels name the charity. Values unchanged. Mechanical: headline unchanged, against 2b6e501e.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2b370f40.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against c42a537d.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): wording: wrong prose placeholders restored to the typed text or pointed at the evaluator view, and typed results in the summary made placeholders or recomputed at the 30% mobiliser share (no value moves). Mechanical: headline unchanged, against bc9e3979.
