# Audit: blueprint-biosecurity-charityevals, round 2 (verification of round 1's fixes)
Result: 0.005892 daly/$ = 5.892 years of healthy life per 1,000 dollars (combined range 0.301–115.4; the model's own ranges, shared figures at their best, 0.741–20.15); cause median 1.576 over 13 catastrophic-risk models (×3.74). Verdict: **pass** (no high or medium findings; two low).
Model-sha: 8b6fb835cebed64f06d49d3c1027f5b0e539808cd7ddb1345fe1a06681b54fdb
Scope: unchanged from round 1 (all four Part III programmes of the 2024 Form 990, $2,398,911 programme expenses); only the five round-1 settlements and the main merge were checked.
Mechanical: audit-model lint 0 high / 0 medium / 0 low, invariants none; check.ts: all models valid (warnings only: joint span, 62% judgment share, 17 point inputs). Not re-run: normalization-audit, simulation-check (no structural change; the result moved 5.77 to 5.89).
Previous round: finding 1 (next-dollar URLs, policy grants, Founders Pledge, run 1.05): resolved. Finding 2 (ppe_evidence_adj 0.8, explainers): resolved. Finding 3 (2024 PPE advocacy in govt_spend, govt_evidence_adj, pol_cost_share): resolved. Finding 4 (uvc_spend grants awarded in 2024, paid 2024-2025): resolved. Finding 5 (PPE link, June/May dates): resolved.

Merge check: `git diff main -- facts/next_dollar.json` is 19 insertions, 0 deletions: only the `blueprint_biosecurity` entry is added after the Common Cause Education Fund entry; every other entry is identical to main. The entry is intact: 0.37 (0.135-0.79), explainer 0.5 × 0.7 × 1.05 = 37% (13.5% to 79%) matches the note's room 0.5 (0.3-0.8), use 0.7 (0.5-0.9), run 1.05 (0.9-1.1).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | source | `@next_dollar.blueprint_biosecurity` note | "Survival and Flourishing Fund ($78K)" has no URL and could not be found: not on the Founders Pledge page, the Longterm Wiki Blueprint page, or the SFF pages tried. | curl of the cited pages | Add the SFF recommendation page that lists the $78K, or drop the clause (room evidence does not depend on it). | none |
| 2 | low | presentation | `ppe_spend` explainer | Double comma: "(paid $165,211 in 2024, Part VII),, and work on stockpiling". | model JSON | Replace ",," with ",". | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| next_dollar, Oct 2024 $900,000 | longtermwiki.com/grants/RHPf0LOCCH | verified | "General Support (2024)", Oct 2024, 900,000. |
| next_dollar, $7,112,990 | longtermwiki.com/grants/o5HULFB828 | verified | amount on page. |
| next_dollar, $3,242,000 | longtermwiki.com/grants/P4zVgbtco7 | verified | amount on page. |
| next_dollar, $6.4M | longtermwiki.com/grants/pUIIzflpiX | verified | "three grants totaling $6,400,000 over two years ... general support". |
| next_dollar, Founders Pledge | founderspledge.com/research/blueprint-biosecurity | verified | "highly capable team of experts", "significant ability to absorb more funding", updated 27 June 2024. |
| next_dollar, SFF $78K | none cited | unsupported | finding 1. |
| govt_spend, pol_cost_share, govt_evidence_adj | Form 990 2024 XML (f2024.txt) | verified | Part III 4b "ADVOCATING FOR ADVANCED PPE FOR CRITICAL WORKERS IN THE US"; Schedule C TotalDirectLobbyingGrp 3,044. |
| resources (PPE) | blueprintbiosecurity.org/program/ppe/ | verified | HTTP 200. |
| uvc_spend explainer | Form 990 2024 (Schedule I, Part IX 11g) | accepted | figures as round 1 verified ($12,500; $96,410 SRA). |

Consistency of the changed texts: ppe_evidence_adj 0.8 (0.4-1.2) is consistent across the row, `bio_years_until_effect` ("carried into an FAS policy memo by its own PPE lead"), the write-up table and "how it was checked"; `bio_evidence_adj` computed from the formula is 0.7456 (about 0.75, as its explainer and the write-up say). Write-up numbers match audit-model: headline 5.9 (5.892); range 0.3 to 115 (0.301-115.4); discount 84 / 4.7 (84.32 / 4.724); years counted 1.3 / 18 (1.272 / 17.99); extinction cut 3.0 / 35 (3.009 / 34.71); next dollar 2.2 / 12.6 (2.150 / 12.58); about four times the median (3.74); 37%, 13.5% to 79%. Model summary (5.9, 0.3 to 115, 37%) matches. Write-up dates (June 2024 PPE Blueprint, 2024 awards paid 2024-2025) match the model.

## Drivers
Unchanged from round 1: discount rate, years counted, the shared catastrophe cuts, the missing-data slider, then the next-dollar figure (2.15-12.58) and the counterfactual judgment.
