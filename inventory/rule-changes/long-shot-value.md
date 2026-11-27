# Rule change long-shot-value (27 Nov 2026)

The risk slider counts long shots by risk-weighted expected utility (a chance p of a payoff counts p^a of it, a = 2 − log10 of the setting; 10 is the average, default 3), replacing the 5–95% quantile and the separate average option (docs/normalization.md 2.18). Applied by a patch of the engine, assumptions, tests and pages, then scripts/summaries.ts; files changed: 21. The table below is empty because the tool's headlines leave out the reader's risk factor; measured on the rankings' figures instead (years per $1,000 at the defaults, before at 50%, after at 3), 17 charities moved more than 2× or changed sign, listed under "Rankings at the default".

Rules 0.4.8 → 0.5.0 (major: figures moved more than 2× and changed sign); 0 receipts moved to 0.5.0, the 0 to verify stay on theirs until verified.

## Verification list

None.

## Before and after

| model | before | after | move | rows changed | receipt |
|---|---|---|---|---|---|

## Rankings at the default

The default 3 against the old default 50% (src/engine/figures.ts rankings, 188 charities): Spearman 0.977, the same top 10, 28 of the top 30. Setting 10 reproduces the old average exactly (the value sets that used it rank as before). Across the slider, 1 against 10: Spearman 0.975, 8 of the top 10, the median figure ×0.60; catastrophic-risk long shots fall most (ALLFED #9 → #24, Arms Control Association #5 → #14).

| charity | before (50%) | after (3) | move |
|---|---|---|---|
| terrapraxis | 0.0039 | -0.00139 | sign or from 0 |
| project-drawdown | 0.00177 | -0.00563 | sign or from 0 |
| clean-air-task-force | 0.000917 | -0.000205 | sign or from 0 |
| shrimp-welfare-project | 0.000302 | 0.00165 | ×5.47 |
| aquatic-life-institute | 4.08e-05 | 0.000293 | ×7.18 |
| good-food-fund | 1.62e-05 | 4.11e-05 | ×2.53 |
| alliance-for-reducing-microbial-resistance | 0 | 0.0394 | sign or from 0 |
| animal-policy-international | 0 | -0.0113 | sign or from 0 |
| labri | 0 | 1.18 | sign or from 0 |
| lead-research-for-action | 0 | 0.0553 | sign or from 0 |
| opportunity-green | 0 | -0.45 | sign or from 0 |
| wild-animal-initiative | 0 | 1.81e-07 | sign or from 0 |
| silverlining | -9.28e-05 | 0.0271 | sign or from 0 |
| industrious-labs | -0.000479 | -0.00203 | ×4.24 |
| carbon180 | -0.000772 | -0.00163 | ×2.11 |
| drug-policy-alliance | -0.00129 | -0.00389 | ×3.01 |
| evergreen-collaborative | -0.00167 | -0.00655 | ×3.93 |
