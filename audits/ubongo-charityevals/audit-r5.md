# Audit r5: ubongo-charityevals (scoped verification)

Result: 27.7 years of healthy life per 1,000 dollars (range 5.0–122, 0% of draws at or below zero). Verdict: pass.
Model-sha: 5f166dafe58b2943a7789de94f7011fe6316b0987e3fe83c66a9cd7a8fa4dc32
Rules: 0.4.3

Scope: round 4's high and mediums and the changes made for them. Preflight passes.

| # | Severity | Row | Finding | Status |
|---|---|---|---|---|
| R4 #1 | high | `ak_gain_per_year_sd`, `uk_gain_per_year_sd`, `ln_gain_per_person` | Formulas checked: 0.213 × 1.3 / 2.5 ≈ 0.111 and 0.15 / 3 = 0.05 SD a viewing year, weighted by `preschool_share`, each show discounted by its own wait. One gain per child over the years watched. `uk_effect_sd`'s quote matches Watson Table 6.1 (PDF p. 169); 0.068–0.231 is 0.126 ± 1.96 × 0.035 over 0.841. | resolved |
| R4 #2 | medium | `evidence_adj`, `spillover_ratio`, waits | Anchors are studies and data, none another model; `uk_years_to_work` reads `@education.years_primary_programme_to_work`. | resolved |
| R4 #3 | medium | reach | One place for the doubt about regular viewers; 7–24 million across the two ranges. | resolved |
| R4 #4 | medium | `group_share` | Anchored on the 2019 group accounts; no 2024 group total is published. | resolved |

No double count between `evidence_adj` and the new rows. No new high or medium.
