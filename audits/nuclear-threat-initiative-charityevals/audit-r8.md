# Audit: nuclear-threat-initiative-charityevals, round 8
Result: 0.02359 daly/$ = 23.6 years of healthy life per 1,000 dollars (combined range 1.23–452); cause median 0.0733 (×322). Verdict: pass.
Model-sha: 331aac18c5271c700e13f44ec1cd61dee2a71b0241181c96f35a9a1b20afe7bf
Scope: unchanged from round 6; scoped round: the change of `leverage_funging_adj` (0.9 → 1, range 0.7–1.05 → 0.85–1.05) and the numbers it touched.
Mechanical: lint no high or medium (four range lows and two unused lows are old), invariants none, normalization-audit none (27 checks, 0 violations, INV-15 included; `generated` restored), `scripts/check.ts nuclear-threat-initiative-charityevals` passes. simulation-check stable (5% 0.128, 95% 8.77 × best guess; single events miss 0%).
Previous round: round 6 had no open findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | double-counting | `@next_dollar.nuclear_threat_initiative` | The change follows from the rule: room 0.6 is "is money the constraint" (net assets $73.9M, three years of spending, deficits of $6.4M a year, no stated funding gap, Carnegie's final core grant, MacArthur's exit from nuclear grantmaking). The note does not mention Coefficient Giving's biosecurity grants, which the funging explainer cites, so the large funder's response is only implicit in the room figure. | facts/next_dollar.json `nuclear_threat_initiative` note | In the next-dollar note add one clause on the biosecurity funder (Coefficient Giving's $7.8M over three years from 2023 is committed; no gap is stated), so the one place that asks the question answers it. | none (wording) |

## Numbers checked against audit-model / simulation-check
Summary and write-up use the **combined range** (1.232–451.9).
- Summary: 24 (23.59), "1 to 450" (1.23–451.9), "more than ten times its peers" (×322; INV-15 passes): match. Write-up: headline 24, "about 1 to about 450": match. Funging row 1: matches.
- Sensitivities: nuclear cut 6.569–193.8 → "7 to 194"; 0.1% discount 103.0 → "about 100": match.
- No stale number remains (searched for 21, 410, 6 to 174, about 90). The new sentence in "How this model was checked" is accurate. Other models' text that quotes NTI's figure (CAIS "24", MIRI "320 times") matches.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `@next_dollar.nuclear_threat_initiative` | ProPublica 990 for 2025 | not re-fetched | unchanged since round 6 |

## Drivers
Nuclear cut per dollar, years a cut counts, missing-data discount, discount rate, evidence adjustment. Unchanged.

