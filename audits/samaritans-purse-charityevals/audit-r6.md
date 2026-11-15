# Audit: samaritans-purse-charityevals, round 6
Result: 5.071e-5 daly/$ = 0.05071 years of healthy life per 1,000 dollars (combined range 0.01222–0.2104); cause median 0.1132 (×0.4478). Verdict: pass.
Model-sha: 2702135b7eb73690a56b64599ede6c1ddd29b2a6f2aec3f927a3caa9231d138c
Scope: verification of the one change since round 5: us_evidence_adj 0.95 (0.8-1) judgment to formula 1 with a new explainer, and the write-up edits ("US relief" added to the no-evidence-step list; sentence on the site-wide pass 0.047 to 0.051 in "How this model was checked"); summary and write-up figures against the live result. Not a full re-audit.
Mechanical: audit-model 0 findings; check.ts all valid; simulation-check stable (5% 0.553, 50% 1, 95% 1.8 x best); normalization-audit not rerun (coordinator ran it: none).
Previous round: round 5 had two low findings (us_evidence_adj left at 0.95; write-up list missing US relief). Both resolved.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| - | - | - | - | No findings. | us_evidence_adj is `formula: "1"`, no judgment kind; its explainer points to us_value_share, which exists (line 783) and carries the share reaching households; the row feeds us_total_adj and the weighted evidence average (us_dalys_unadjusted * us_evidence_adj), both now at 1 for this branch, so nothing is adjusted twice or left out. Result 0.05071 matches the round-5 scratch measure. | - | - |

Figures check: summary "about 0.05 ... about half the site's global-health median" matches 0.05071 vs median 0.1132 (x0.45); write-up headline figure is data-driven (0.05) and the "about half" line matches. The write-up's "0.047 to 0.051" is the site-wide pass's before and after (0.051 is the live value). "Round 5 verified it with no high or medium finding, and a sixth round checked its one fix" is accurate (round 5: two lows, one fix); the Adjustments bullet now lists US relief and matches the model.

Drivers note: unchanged; the result is still dominated by the missing-data discount (0.5 on every branch), the shoebox worth and relief cost per person. The change moves the result by +0.04%.

Verdict: pass
Model-sha: 2702135b7eb73690a56b64599ede6c1ddd29b2a6f2aec3f927a3caa9231d138c

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
