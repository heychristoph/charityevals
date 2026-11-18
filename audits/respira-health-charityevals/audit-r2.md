# Audit: respira-health-charityevals, round 2
Result: 7.612e-6 uov/$ = 0.0038 years of healthy life per 1,000 dollars (combined range 0.00058–0.025). Verdict: pass.
Model-sha: 9b1751e028b8127f577c2d8f4edba4c8499fb42c98586c2c31ac25a354566f54
Rules: 0.3.6
Scope: unchanged from round 1 (one programme, April 2025 to March 2026, estimated $170,000; no accounts exist; charities/respira-health.json matches). Scoped verification only.
Preflight: pass (no blocking lines; re-run, "passes").
Previous round: finding 1 (high, mortality_reduction filed as estimate): resolved. Finding 2 (high, validity corrections double-counted on deaths): resolved. Finding 3 (high, aim-theoretical.py KEEP to REMOVE): owner-reserved, out of this model's scope; the owner handles the AIM side after merging, so it is not an open finding against this model. There were no mediums.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | n/a | scope | scripts/aim-theoretical.py | Reserved by the owner for himself (removal of respira-health-aim and oxygen-access-project-aim after merging). Not a finding against this model. | Builder's changes note, item 3 | Owner: move both ids from KEEP to REMOVE, then run aim-theoretical.py, summaries.ts, bulk-writeups.ts | None on this model |

No new high or medium found. Checks:
- mortality_reduction: now `judgment`, no source block; the explainer names the reference class (Puhan 2016 OR 0.68, 6 trials, low quality, not significant, newer trials smaller; McCarthy 2015's 65 stable-COPD trials report no deaths outcome; online-recruited milder participants, a third of the fall). Range 0.01–0.30 kept. The write-up's Deaths bullet reads "because no trial shows a fall in milder, stable disease, we take a small one".
- Validity corrections applied once each: `internal_validity_adj` = 1 with a reason; `evidence_adj` = internal x external; `external_validity_adj` is the delivery part only (0.8, 0.5–1, Cox 2021, 4 trials, 556 participants); `rh_before_after_adj` (0.75) and `rh_milder_adj` (0.8) multiply only `dalys_illness_averted_per_person`. The deaths branch carries milder disease only in `mortality_reduction`, and has no before-after correction. No double counting remains. Result moved 0.0029 to 0.0038 (+31%), within the +39% the round-1 fix estimated.
- Anchors of the new rows: the McCarthy SGRQ figures (6.89, 19 of 65 trials, 1,146 participants) were verified in round 1; Nolan baseline CAT 20.1 verified in round 1; the pilot's CAAT 16.3 is in the pilot report (round 1). Both are judgments with a named anchor and a range.
- Lows from round 1 (4 to 11) were applied: share_15_49 0.05 with its anchor, attribution 0.97 without Ambitious Impact, sessions "self-reported in WhatsApp and recorded", citation counts, write-up sentence, drivers in tornado order, 2024 COPD paper and WHO life table in the Sources. The write-up has no comparison with other charities, medians or peers (grep clean).
- Tornado (post-fix): missing_data_discount, mortality_reduction, baseline_mortality_rate, years_of_coverage, external_validity_adj; all judgments with anchors. Nothing new at a top-5 swing is unsourced.

## Sources checked
Round 2 re-verified nothing new in the web sources: the changed rows are judgments anchored on sources verified in round 1 (Puhan 2016, McCarthy 2015, Nolan 2016, Cox 2021, the pilot report). The WHO life-table anchor (nqx 60–64 0.086, 65–69 0.133) was taken from the builder's note and not independently fetched; it only anchors a judgment with a 2–8% range and moves the result under 15% across it.

## Drivers
1. `missing_data_discount` (shared slider).
2. `mortality_reduction` (judgment, now with a stated reference class; a trial or cohort of rehabilitation's effect on deaths in stable, milder COPD would improve it most).
3. `baseline_mortality_rate` (judgment, two anchors).
4. `years_of_coverage` (judgment, 2024 UK analysis).
5. `external_validity_adj` (judgment, delivery only, Cox 2021).
Once the second year's enrolment and spending are published, move the model to that year.
