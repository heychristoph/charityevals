# Audit: future-cleantech-architects-charityevals, round 5 (verification of the round-4 fixes only)
Result: 0.001216 tco2e/$ = 7.275e-4 years of healthy life per 1,000 dollars (unchanged; combined range 1.573e-5 to 0.03364).
Model-sha: 2cce4177de9370fb287ae4de7b6bb114cc1832494e8357e23d5b9180146f55dd
Scope: only the round-4 findings' fixes. Mechanical: `audit-model.ts` reproduces the result and range; `check.ts` all models valid. No value or formula changed.

## Check of each fix
| Round-4 finding | Fix in place | Check | Status |
|---|---|---|---|
| 1 (`learn_coal_share` anchor) | Explainer now: 2/5 of the later capacity in the EU at about 15% coal, the rest at about 55%, 0.4 × 15% + 0.6 × 55% ≈ 40%, citing Ember Global Electricity Review 2025 | Arithmetic: 0.06 + 0.33 = 0.39, matches 0.4. `learn_eu_share` is 0.4. Ember (Global Electricity Trends page): coal 34.4% and gas 22% of world electricity in 2024, so "about a third" and "about a fifth" hold; coal is 61% of the two, so "over half of fossil power outside the EU" holds. The 15% and 55% are labelled judgments (EU coal falling by the 2040s). | resolved |
| 2 (`learn_smoke_factor`) | "about 0.15" | Computed 0.149 | resolved |
| 4 (`coal_tco2_per_mwh`) | "lignite, higher (about 1.0-1.1), ... is not separately counted, a small understatement of the coal end" | No longer claims the share's range covers it; accurate | resolved |
| 5 (`learn_stock_growth`) | "about 13-14 times on the central outlooks" | 56.2/4.1 = 13.7 and about 90/7 = 13; matches the round-3-verified outlooks | resolved |
| 3 (write-up shares) | "more than half from the later learning and under a third from the capacity it causes" | 57% and 30% per round 4 | resolved |
| write-up audit section | Last sentence: round 4 passed, explainers tightened, checked once more (round 5) | Accurate | resolved |

## Findings
None. No high finding.

Verdict: pass
