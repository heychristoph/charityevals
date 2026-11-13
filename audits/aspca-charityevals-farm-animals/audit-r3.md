# Audit: aspca-charityevals-farm-animals, round 3

Result: 0.3714 ced/$ = 4.085e-5 years of healthy life per $1,000 (combined range 3.38e-8 – 4.94e-2); cause median 4.872e-4 (×0.084). Verdict: pass.
Model-sha: 2ceed9c1d18e9c3998af87cbc0473a9a4d5f23f7f218a00c1eed73e70631fd15

Scope: unchanged from round 2. This round checks only the changes made since round 2 and whether they brought new problems. 0 high, 1 medium (carried), 1 low (carried); no new findings.

Mechanical: audit-model lint 0 high / 0 medium / 1 low (far-below, with the summary's reason). The result is unchanged (the edits touch the draw and the text, not the best guesses). simulation-check: stable; 5% of draws at 0.019×, the median at 0.061× and 95% at 0.27× the best guess; 2 single events, 0% of draws miss; the 4.45% of draws at or below zero in round 2 are gone. generated/ untouched.

Previous round:
1. `def_coalition_spend` (medium): **not done as the fix asked, accepted for a pass, carried as medium.** The coalition total stays a typed judgment ($8.5m, 3.5–20.5m before overhead) kept in line by value with THL's other-programmes model ($8m + $0.44m = $8.44m), because editing THL's audited model would void its receipt. Two numbers equal today are an acceptable state for a pass: the result is not wrong, the credit shares come from about one total, and nothing in the model is inconsistent at the defaults. The risk is only drift if one is changed later, and the reference class (members' Schedule C lobbying) is still missing. It should be made a shared fact the next time THL's models are opened.
2. `def_p_override_with` / `_without` (medium): **resolved in this model.** `def_p_override_with` now has `drawn_with: "def_p_override_without"` beside `single_event: {with: "eats"}`; the engine's group takes one z for both (src/engine/montecarlo.ts, line 97), the simulated draws below zero are gone, and the spread narrowed. The explainer says "Drawn together with the chance without it". THL's two models still draw the pair independently; left alone on purpose (their receipts), and the branch is a small part of their results. Carry to their next round.
3. `def_evidence_adj` (low): **resolved.** The explainer names the direction (eggs in processed and combination foods outside the sales laws, Nevada's emergency suspension, both making the count too high). Value 0.9 (0.7–1) unchanged.
4. `farm_share_of_lobbying` (low): **resolved.** The "largest single federal campaign" clause is gone; the explainer lists what Schedule O names. The 40% is still a judgment (the LD-2 anchor was optional).
5. `def_sows` high end (low): **resolved.** 900,000, the same range as THL's model. `def_pop_share` high end kept at 0.27, the same as THL's models, for consistency: fine.
6. "Testimony" and summary (low): **resolved.** `def_p_override_without` now says "farmers' views". The summary names how many hens and sows would go back into cages and the coalition's total among the biggest uncertainties (the revert share is covered by "how many hens and sows would go back").

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | source | `def_coalition_spend` | Carried from round 2: one judgment typed in two models, with no reference class in the members' reported spending. Tornado 1.81e-5 – 9.65e-5 around 4.09e-5. | Row; THL other-programmes `def_coalition_spend`. | Shared fact `coalition_spend_2025` built from the members' Schedule C and federal lobbying disclosures; both models read it. | None at the defaults; +40% at $6m, -28% at $12m. |
| 2 | low | sensitivity | THL's two models | The pair of override chances is drawn independently in THL's other-programmes and owa-grants models. Outside this audit. | Those models' rows. | Add `drawn_with` at their next round. | Small there. |

## Double counting
Unchanged from round 2: the defence and the market branch are split by the farm share of the policy line; no overlap added by the edits.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `def_p_override_without` | https://www.aspca.org/about-us/press-releases/us-house-agriculture-committee-holds-hearing-proposition-12 | verified (round 2) | Quote unchanged; "views" now matches "gathered perspectives". |
| `def_sows` | https://nppc.org/wp-content/uploads/2025/07/Holly-Cook-Prop.-12-House-Ag-Written-Testimony-07.23.25.pdf | verified (round 2) | Source unchanged (the NPPC document is written testimony, so "testimony" is right there). |
| other rows | as in round 2 | unchanged | |

Does the model pass: yes. No high; the medium that remains does not change the result at the defaults.
