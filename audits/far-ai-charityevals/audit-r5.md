# Audit: far-ai-charityevals, round 5
Result: 0.000958 daly/$ = 0.958 years of healthy life per 1,000 dollars (combined range 0.020–47.0); cause median 0.0733 (×13.1). Verdict: pass.
Model-sha: 8e4db94fe2008d6b5b0a9357896c8384a0a562b76e45b54c951eaaf78101cb78
Scope: unchanged from round 3 (all four programmes, 2024, $7.52M of $8.60M); scoped round: only the change of `leverage_funging_adj` (0.85 → 1, range 0.6–1.05 → 0.85–1.05), the numbers it touched, and the new "more than ten times its peers' median" sentence.
Mechanical: lint no high or medium (six lows, none new), invariants none, normalization-audit none (27 checks, 0 violations, INV-15 included; `generated` restored), `scripts/check.ts far-ai-charityevals` passes. simulation-check stable (5% 0.086, 95% 15.3 × best guess; single events miss 0%).
Previous round: round 3 had no open findings.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | double-counting | `@next_dollar.far_ai` | The change follows from the rule. The room factor (0.45, 0.25–0.75) is explicitly "is money the constraint": its note cites $22.5M of net assets (2.6 years of spending), a $15.7M surplus and over $30M of new commitments from several funders in 2025, which is exactly the large funders filling gaps the old 0.85 asked about. The new explainer names the funders and says so (Convention 5, normalization.md 2.10). | facts/next_dollar.json `far_ai` note; model row `leverage_funging_adj` explainer | None needed. | Result 0.814 → 0.958 (+18%), all of it the removed double count |
| 2 | low | presentation | summary | "About 12 times MIRI's" was replaced by "more than ten times its peers' median", which is correct (0.958 / 0.0733 = 13.1; INV-15 passes), and the reason is true of the rows: `ai_misuse_cost_share` is 0.28 here and 0 in Redwood, MIRI and METR; the misuse preset (`@catastrophe.ai_misuse_catastrophe_cut_per_million` best 1.242e-4) is 453 times the misalignment preset (2.742e-7), matching "about 450 times". The write-up's "about 13 times MIRI's" (0.958 / 0.0733) and "close to the Center for AI Safety's" (1.59, ×1.7) are true. | audit-model peers table; facts/catastrophe.json | None. | none |

## Numbers checked against audit-model / simulation-check
Both texts use the **combined range** of audit-model (0.0195–47.0); the simulation's 5–95% (0.082–14.7) is not quoted for FAR.AI.
- Summary: 0.96 (0.9578), "0.02 to 47" (0.0195–47.01), 450× (453), "over a quarter" (0.28): match. Write-up: headline 0.96, "about 0.02 to about 47", "about 13 times MIRI's": match. Funging table row 1 ("Counted once"): matches the model.
- Sensitivities (tornado): misuse cut 0.1332–9.205 → "0.13 to 9.2"; catastrophe chance 0.1213–6.386 → "0.12 to 6.4"; misuse share 0.4008–1.351 → "0.40 to 1.4": all match.
- No stale number remains in summary, write-up or explainers (searched for 0.81, 0.0814, 12 times, 40, 5.4, 1.1, 0.34, 7.8; the remaining "from 25% to 23%" and "by a quarter" are history of earlier rounds). The "How this model was checked" sentence on the funging change is accurate.
- The next-dollar explainer (0.45 × 0.45 × 1.0 = 20%) does not read the funging row and is unaffected.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `@next_dollar.far_ai` | far.ai/news/30m-multi-funder-support | not re-fetched | verified in round 3; unchanged |

## Drivers
Misuse cut per dollar (estimate), AI catastrophe chance (judgment), years a cut counts (judgment), missing-data discount (judgment), next-dollar figure (estimate). Nothing in this round changes them.

(Numbered 4 on its branch; renumbered at merge.)
