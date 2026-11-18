# Audit: center-for-global-development-charityevals, round 6
Result: 4.28 years of healthy life per $1,000 at mobiliser_share = 100% (unchanged from round 5). Scoped verification of round 5's findings. Verdict: pass.
Model-sha: 5f04ca26a207d91a10a086fdf831bdbea10b44eb3d7759a463363b4489739eab
Rules: 0.3.2
Preflight: not re-run to completion (it timed out); text-only change, headline unchanged at 4.28334.
Previous round: finding 1 (medium, summary quoted old shares) resolved: the summary now reads {{row:a_cgd_share}}, {{row:b_cgd_share}} and {{row:c_cgd_share}}, so the shares render from the rows (40%, 10%, 30%); the second "10%" in the MCC clause is c_improvement_share and is correct. Finding 2 (medium, other_work_share anchor) resolved: it now says "about a seventh and a twentieth", matching 0.15 and 0.047 of the AMC branch; the 0.4 value stands. Finding 3 (low, a_cgd_share) resolved: the explainer names who holds the rest. No value or range changed.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | `other_work_share` | The range end "100% (3ie as large as the AMC branch, the other six like MCC: about 96%)" still does not add up (3ie alone as large as the AMC branch is already 100%; six MCC-like wins add 0.28 more). Builder knows; pre-existing. | explainer text | Reword the end to "100% (3ie as large as the AMC branch alone)". | none |

## Sources checked
No new sources; round 5's list stands (the cgdev.org pages stay unreachable).

Re-stamped (17 Nov 2026): credit rule 2.24: the verification round's low findings fixed (wording, no value change). Mechanical: headline unchanged, against 2b24b73c.

Re-stamped (17 Nov 2026), rule credit-switch-co-funders: Credit rule 2.24, step 6: the co-funder switch counts co-funders only; the donors whose money a mover moves are mobilised (under mobiliser_share), so their new money leaves donor_cost_share. Only results with the switch on move. Mechanical: headline unchanged, against the tree before the rule.
