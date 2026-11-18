# Audit: ambitious-impact-charityevals, round 7 (scoped verification)
Result: 0.01847 uov/$ = 9.236 years of healthy life per 1,000 dollars (combined range 0.74-115.1); cause median not re-checked in this scoped round. Verdict: fix needed (one medium: stale mobiliser-share snapshot).
Model-sha: d801523f5dad778dbb87b943a4fdcaf1a1da9269a9cdb02495570f7a40d48ccb
Rules: 0.1.0
Scope: unchanged from round 6; only the `value_destinations` change (two reads, explainer) and the write-up sentence.
Preflight: pass (scratchpad preflight-ai-r7.txt).
Previous round: r6 had no open high or medium.

## Checked
1. Rule: the row reads each launched charity at its primary evaluator's figure. Oxygen Access Project and Respira Health now have charityevals models (`oxygen-access-project-charityevals`, `respira-health-charityevals`, owner charityevals, audited) and their charities files carry spending and lines, so `#charityevals:<id>` is the right read; the old `#ambitious-impact:` reads were refused by the library. Resolved.
2. Nothing else references them: no other model, script, doc or write-up reads `#ambitious-impact:oxygen-access-project` or `#ambitious-impact:respira-health`. The other `#ambitious-impact:` reads in the row (Kaya Guides, ARMoR, Concentric, Novah, Learning Alliance, Lead Research for Action, LABRI, First Embrace, Opal Health, Neev, Better Season Project, Animal Policy International) have no charityevals model, so they stay on Ambitious Impact's idea-stage figure.
3. Counts: the human average has 24 reads (10 GiveWell, ACTRA, 2 charityevals, 11 Ambitious Impact), the animal average 2, unchanged in number, so the equal-weight averages and the 8:1 cause weights are untouched. "Eleven" idea-stage matches the formula; "ten" GiveWell matches; the write-up and explainer agree (two own models, eleven idea-stage). Line 38 of the write-up ("idea-stage figures of its youngest charities") and the incubation cohort explainer (row at line 191) remain true. No comparison with other charities.
4. Missing-data handling: the row applies no discount to the destination figures, each of which is already the destination model's own headline with its own missing-data steps; the destinations' values are finite (Oxygen 3.45, Respira 0.0038 at share 1). Nothing in this model needed to change.
5. Headline: `scripts/headlines.ts` gives 9.23608 at defaults, matching 9.236 from `audit-model.ts` and the builder's 9.24 (the 9.52 before is from the r6 file read in this library; the change is the two reads). The "48.46" restamp baseline is the stored mobiliser-share snapshot (headline at share 1), not a different model state: the same model at share 1 now gives 47.77 (-1.4%).

## Findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | (src/engine/mobiliser-share-snapshot.json) | The stored snapshot entry for this model is stale: `npx vitest run src/engine/mobiliser-share.test.ts` fails ("moved" list) with `ambitious-impact-charityevals: 48.456 -> 47.771`. The change is on purpose (a destination re-read), the case the snapshot's header allows refreshing. | Test output; other entries in that list (e.g. Founders Pledge, 80,000 Hours, Longview) moved from the shared survival fact edit, not from this model, so they are the other builds' to re-snapshot. | Run `npx tsx scripts/headlines.ts --snapshot ambitious-impact-charityevals` (and re-run the test; the new `oxygen-access-project-charityevals` / `respira-health-charityevals` entries come from their own builds). | none |

## Sources checked
None needed: no number or source changed.

## Drivers
Unchanged from r6 (missing-data discount, mobiliser share, `win_years_counted`, `@next_dollar.ambitious_impact`, discount rate). Respira Health's own figure is near zero, so replacing its idea-stage estimate lowers the average slightly (-3%); that is the model's result, not a tuning target.

Verdict: fix needed (finding 1 only; no high). With the snapshot refreshed, pass.
