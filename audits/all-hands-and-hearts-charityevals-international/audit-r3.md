# Audit: all-hands-and-hearts-charityevals-international, round 3
Result: 8.657e-5 daly/$ = 0.0866 years of healthy life per 1,000 dollars (combined range 0.0147-0.509); cause median 0.0754 (x1.15). Verdict: pass (no findings).
Model-sha: 2659057b05ed1233e12141ca9acb14b38c353717b5d96172a44da6e7ba388e03
Rules: 0.3.13
Scope: unchanged; only the changes of commit 001c6e4 since 95fed69 were checked (`git diff 95fed69 001c6e4 -- models/ writeups/`).
Mechanical: lint 0 high / 0 medium / 0 low ("Findings (0)"); invariants none; check.ts all models valid; normalization-audit and simulation-check not re-run (one explainer changed).

Previous round (round 2 lows):
- rel_people explainer did not say the 13,000 may include people reached after 31 August: resolved. It now says the low end of 9,000 is for the case the totals overlap or the 13,000 (counted in a report of November 2025) includes people reached after 31 August. The inputs (9,000 / best / 13,000) are unchanged.
- Age mix of the deaths: kept as a judgment, as agreed; no change needed.

Diff check: the model has exactly one edit (the rel_people explainer). Nothing else changed in it; the result is identical to round 2 (0.0866).

No new findings.

Verdict: pass.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): shared in-kind, water-time and shelter-night facts (consistency, mechanical)

Re-stamped (16 Nov 2026): Pre-audit cleanup (16 Nov 2026): shared figures read from facts at the same values (@myanmar.household_consumption_share_of_gdp, @survey_consumption.disaster_affected_share_of_survey_mean, @volunteering.disaster_volunteer_ls_gain_year); judgments' reference classes named from sources; volunteer-hours labels name the charity. Values unchanged. Mechanical: headline unchanged, against bebc953e.

Re-stamped (16 Nov 2026): typed figures in the model's text replaced by placeholders rendered from the model (scripts/prose-numbers.ts). Mechanical: headline unchanged, against 2b370f40.

Re-stamped (16 Nov 2026): peer mentions removed from the text (no value change). Mechanical: headline unchanged, against 32b69cd7.

Re-stamped (16 Nov 2026): text only: typed figures replaced by placeholders (prose-numbers detection widened) and comparisons with other models removed; no value changed. Mechanical: headline unchanged, against 5724c36c.

Re-stamped (17 Nov 2026): credit rule 2.24: branch classes (no value change). Mechanical: headline unchanged, against cc9a04dd.

Re-stamped (17 Nov 2026): wording: wrong prose placeholders restored to the typed text or pointed at the evaluator view, and typed results in the summary made placeholders or recomputed at the 30% mobiliser share (no value moves). Mechanical: headline unchanged, against bc9e3979.
