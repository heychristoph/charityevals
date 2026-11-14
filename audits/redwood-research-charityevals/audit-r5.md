# Audit: redwood-research-charityevals, round 5
Result: 0.0000685 daly/$ = 0.0685 years of healthy life per 1,000 dollars (simulation 5%–95%: 0.0046–0.655; audit-model's combined range is far wider, 0.00006–83); cause median 0.958 (×0.071, FAR.AI included as a peer). Verdict: pass.
Model-sha: 85e87787db6edc39562966150143e27c3b7491d0a3f9d52971f8ab0d046d657b
Scope: unchanged from round 4; scoped round: the change of `leverage_funging_adj` (0.8 → 1, range 0.55–1.05 → 0.85–1.05) and the numbers it touched.
Mechanical: lint no high or medium (far-below low confirms the summary gives the reason; four range lows and two unused lows are old), invariants none, normalization-audit none (27 checks, 0 violations; `generated` restored), `scripts/check.ts redwood-research-charityevals` passes. simulation-check stable (5% 0.067, 95% 9.57 × best guess; single events miss 0%; misuse share 0–0.15 moves the result ×13.2).
Previous round: round 4 had no open findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | double-counting | `@next_dollar.redwood_research` | The change follows from the rule, and the next-dollar note covers the funder: room 0.5 rests on $6.5M of net assets (2.2 years), contributions of only $9,659 in 2024 (the year ran on Open Philanthropy's earlier general support), a $1.1M grant in 2025 and "no stated funding gap and no donation page". The funging explainer names Coefficient Giving as almost the only funder. | facts/next_dollar.json `redwood_research`; model explainer | None. | Result 0.0548 → 0.0685 (+25%), all of it the removed double count |
| 2 | low | presentation | summary | The summary's range "0.005 to 0.7 in 90% of the simulation's draws" is the simulation's (0.0046–0.655), as before, and is labelled as such; the write-up's "about 0.005 to about 0.7" matches. | simulation-check | None. | none |

## Numbers checked against audit-model / simulation-check
- Summary: 0.07 (0.0685); "0.005 to 0.7 in 90% of draws" (simulation 5%–95%: 0.0046–0.655); "13 times" for the misuse share (×13.2): match. "Under a tenth of its cause's median" (×0.071) and "close to MIRI's" (0.0685 vs 0.0733): true. "Carries most of FAR.AI's and the Center for AI Safety's results": true (misuse shares 0.28 and 0.25; the misuse preset is 453 times the misalignment preset).
- Write-up: headline 0.068 (0.06847); range "0.005 to 0.7" (simulation); chance 0.008672–0.4564 → "0.009 to 0.46"; misalignment cut 0.01789–0.5743 → "0.018 to 0.57"; misuse paper 0.9029 → "0.90"; 0.1% discount 1.412 → "about 1.4": all match. "Close to MIRI's (0.07)": true. Funging row: matches.
- No stale number remains (searched for 0.05, 0.004, 0.5, 0.007, 0.37, 0.014, 0.46, 0.72, about 1). "From 0.26 to about 0.05" is a past round's history. The new sentence in "How this model was checked" is accurate.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `@next_dollar.redwood_research` | IRS e-file 990 for 2024 | not re-fetched | unchanged since round 4 |

## Drivers
AI catastrophe chance, misalignment cut per dollar, discount rate, years a cut counts, misuse share. Unchanged.
