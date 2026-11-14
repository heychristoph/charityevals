# Audit: machine-intelligence-research-institute-charityevals, round 6
Result: 0.0000733 daly/$ = 0.0733 years of healthy life per 1,000 dollars (combined range 0.0003–17.7); cause median 0.958 (×0.077, FAR.AI included as a peer). Verdict: pass.
Model-sha: af9f1020f0a27cda4d6b427a574fbf7ee5e18e0778a27b690806b454136faa06
Scope: unchanged from round 4; scoped round: the change of `leverage_funging_adj` (0.9 → 1, range 0.7–1.05 → 0.85–1.05), the numbers it touched, and the new "under a tenth of its peers' median" sentence.
Mechanical: lint no high or medium (far-below low confirms the summary gives the reason; old range and unused lows), invariants none, normalization-audit none (27 checks, 0 violations; `generated` restored), `scripts/check.ts machine-intelligence-research-institute-charityevals` passes. simulation-check stable (5% 0.065, 95% 9.18 × best guess; single events miss 0%).
Previous round: round 4 had no open findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | double-counting | `@next_dollar.machine_intelligence_research_institute` | The change follows from the rule and the note covers the funders: room 0.5 rests on the two-year reserve target, $12.0M of assets, and the $12.9M from two donors in 2026 that took reserves "well above the target, so money is not its main constraint". The funging explainer names the same donors and the Survival and Flourishing Fund's match. | facts/next_dollar.json `machine_intelligence_research_institute` | None. | Result 0.0659 → 0.0733 (+11%), all of it the removed double count |
| 2 | low | presentation | summary, write-up | The old range "0.002 to 3" did not match audit-model's old combined range (0.00027–16.0); the new "0.0003 to 18" matches the combined range now (0.000303–17.73) and is labelled "on the combined range". It is a different kind of range from Redwood's simulation range. | audit-model | None. | none |

## Numbers checked against audit-model / simulation-check
Summary and write-up use the **combined range**.
- Summary: 0.07 (0.0733), "0.0003 to 18" (0.000303–17.73), "about 320 times below NTI" (23.59 / 0.07327 = 322): match. "Under a tenth of its peers' median" (0.0733 / 0.958 = 0.077): true. "All its work is against misaligned AI": `ai_misuse_cost_share` is 0. "Misuse work (much of FAR.AI's and the Center for AI Safety's)": 0.28 and 0.25 of their work, with the misuse preset 453 times the misalignment preset for catastrophes the world survives: true. The 170th to 260th and thousandth figures are unchanged.
- Write-up: headline 0.073 (0.07327); "0.0003 to about 18"; chance 0.009281–0.4885 → "0.009 to 0.49"; 0.1% discount 1.540 → "about 1.5": match. Funging row: matches.
- No stale number remains (searched for 0.066, 0.002, about 3, 0.008, 0.44, about 1.4). The new sentence in "How this model was checked" is accurate.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `@next_dollar.machine_intelligence_research_institute` | intelligence.org 8 June 2026 post | not re-fetched | unchanged since round 4 |

## Drivers
AI catastrophe chance, extinction cut per dollar, discount rate, years a cut counts, missing-data discount. Unchanged.

(Numbered 5 on its branch; renumbered at merge.)
