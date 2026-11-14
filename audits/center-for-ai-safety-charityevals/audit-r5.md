# Audit: center-for-ai-safety-charityevals, round 5
Result: 0.001590 daly/$ = 1.590 years of healthy life per 1,000 dollars (combined range 0.035–71.4); cause median 0.0733 (×21.7). Verdict: pass.
Model-sha: 6e3120d3ce68755b8e242c8a89e310227ec91e57cbca12ea61e3278061a8d9e5
Scope: unchanged from round 4; scoped round: the change of `leverage_funging_adj` (0.85 → 1, range 0.6–1.05 → 0.85–1.05), the numbers it touched, and the new "more than ten times its peers' median" sentence.
Mechanical: lint no high or medium (four lows, none new), invariants none, normalization-audit none (27 checks, 0 violations, INV-15 included; `generated` restored), `scripts/check.ts center-for-ai-safety-charityevals` passes. simulation-check stable (5% 0.079, 95% 13.2 × best guess; single events miss 0%).
Previous round: round 4 had no open findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | double-counting | `@next_dollar.center_for_ai_safety` | The change follows from the rule: room (0.6) is "is money the constraint" and its note rests on net assets of $11.6M (1.6 years of spending), surpluses of $8.0M and $3.1M, "no stated funding gap" and contributions falling from $15.6M to $9.6M. It says nothing, however, about the large funders' response, which is what the removed 0.85 asked. | facts/next_dollar.json `center_for_ai_safety` note; funging explainer | In the next-dollar note add one clause naming the large donors' behaviour (they fund most of it; no gap is stated, so none is assumed to be filled by them), so the one place that asks the question visibly answers it. | none (wording) |

## Numbers checked against audit-model / simulation-check
Summary and write-up use the **combined range** (0.0354–71.38).
- Summary: 1.6 (1.590), "0.04 to 71" (0.0354–71.38), NTI "24" (23.59): match. Write-up: headline 1.6, "0.04 to about 71", "Nuclear Threat Initiative's 24": match. Funging row 1: matches.
- INV-15 sentence: "more than ten times its peers' median" is true (1.590 / 0.0733 = 21.7; peers FAR.AI 0.958, METR 0.0565, Redwood 0.0685, MIRI 0.0733, NTI 23.6). "Because of that misuse work (Redwood's, MIRI's and METR's is all misalignment work)" is true of the rows: `ai_misuse_cost_share` is 0.25 here and 0 in all three; the misuse preset is 453 times the misalignment preset for catastrophes the world survives. "Far below NTI" (23.6 vs 1.59): true.
- Sensitivities: catastrophe chance 0.2013–10.60 → "0.2 to 11"; misuse cut 0.2279–15.21 → "0.2 to 15"; misuse share 0.6806–2.499 → "0.7 to 2.5"; 0.1% discount rate 3.339 → "about 3.3": all match.
- No stale number remains (searched for 1.4, 61, 21, 0.03, 9, 13, 0.6, 2.1, 2.8). The "How this model was checked" sentence is accurate. The removed `source` on the funging row (Form 990 contributions) is fine for a judgment that is now 1.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `@next_dollar.center_for_ai_safety` | IRS e-file 990 for 2024 | not re-fetched | unchanged since round 4 |

## Drivers
Misuse cut per dollar, AI catastrophe chance, years a cut counts, missing-data discount, AI catastrophe death share. Unchanged.
