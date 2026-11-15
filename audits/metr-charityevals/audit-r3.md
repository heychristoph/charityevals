# Audit: metr-charityevals, round 3

Result: unchanged from round 2 (0.0565 years of healthy life per 1,000 dollars). Verdict: pass (no high, medium or low findings).
Model-sha: fc2f24985a741d06029a6bb5ecda52f94c0fac6221321c9b470e599d63a77215
Scope: the one round-2 finding. Mechanical: `check.ts metr-charityevals` all models valid; `audit-model.ts` shows no high findings (only low range, unused-input and far-below notes, as before). `generated/` restored after the scripts.
Previous round: round 2 (one low).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No findings. | - | - | None |

## Round-2 finding, checked

| R2 # | Status | Check |
|---|---|---|
| 1 `contractor_pay` explainer | fixed | `git diff` on the model shows this explainer as the only change: "at most 4%" became "about 4%". Round 1 computed 4.4% (donor_cost_share 0.810 to 0.774), so "about 4%" is accurate. No numbers moved. |

Re-stamped: mechanical shared-fact change (INV-14): fb_work_years reads @catastrophe.field_work_years, the same 5 (2 to 10) every catastrophic-risk model had typed; result unchanged.

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
Re-stamped (15 Nov 2026): pandemic and nuclear extinction chances read the new sliders (same defaults; mechanical)
