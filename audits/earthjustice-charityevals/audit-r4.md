# Audit: earthjustice-charityevals, round 4 (verification of the coal rows reading the shared facts)
Result: 0.00549 tco2e/$ = 0.002409 years of healthy life per 1,000 dollars (round 3: 0.002409, unchanged). Combined range 0.0000976-0.0595; cause median 0.001672 (x1.44). Verdict: pass.
Model-sha: fa7aaaa1cae3d3a37195a0d8d404f6741da883fc7ece56e7859c0c9108ed7299
Scope: scoped verification of the ten rows that now read facts/climate.json (coal_gw_2022_2023, coal_gw_2024, coal_gw_2025, coal_twh_per_gw_year, coal_tco2_per_mwh, coal_replacement_tco2_per_mwh, coal_advocacy_share, coal_years_until_avoided, coal_implementation_adj, voc_deaths_per_year); unchanged rows not re-audited.
Mechanical: audit-model.ts 0 findings, no invariant violations; check.ts all models valid.
Previous round: round 3 passed; its open item (45% split, medium, accepted) unchanged.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | `coal_twh_per_gw_year`, `coal_advocacy_share`, `coal_years_until_avoided` (explainers) | The rows' explainers are copies of the shared facts' text from before the Sierra Club Foundation round-1 fixes: the twh row still says "roughly 40% of capacity in the 2020s" (the fact now cites EIA Table 6.07.A, 42-48% in 2022-2024); the advocacy row lacks the Coglianese, Gerarden & Stock (2020) reference class and the 389-of-about-530-plants upper anchor; the years row lacks the J.H. Campbell example. | Compare the rows' explainers with the facts' `explainer` fields in facts/climate.json. | Re-copy the three fact explainers (keeping the "Shared figure ... read by every model" prefix), or cut each to the prefix and one line pointing to the fact. No value changes. | none |

## Checks
- Values and headline unchanged. Compared with `git show 0d1e64b:models/climate/earthjustice-charityevals.json` and facts/climate.json: coal GW 22.3 / 4.0 / 2.6 (observed); TWh per GW 1.75 / 3.0 / 4.4 (judgment); coal tCO2 per MWh 1.0 / 1.048 / 1.15 (estimate); replacement 0.1 / 0.25 / 0.45 (judgment); advocacy share 0.05 / 0.15 / 0.35 (judgment); years until avoided 1 / 3 / 5 (judgment); stay-closed share 0.6 / 0.85 / 1 (judgment); VOC deaths 56 / 65 / 74 (estimate). Each is identical in the facts file, with the same kind. Headline 0.002409 years per 1,000 dollars, 0.005490 t/$, to the digit.
- Every row is a formula reading @climate.<id> with its unit kept; no typed number is left. Earthjustice's own share of the advocacy (coal_attribution_share_shared) stays in the model.
- Tornado ranges unchanged for coal_attribution_share_shared (0.04-0.25) and the advocacy share (0.05-0.35).
- The Sierra Club Foundation model reads the same facts; the 15% advocacy share is credited 40% (Sierra Club) + 10% (Earthjustice) = 50%, within 100%.
- Summary and write-up figures (0.0055 t, $180 a tonne, 0.0024) remain true.

## Sources checked
The facts' sources are checked in the Sierra Club Foundation round-2 audit (Coglianese et al. 2020 abstract; EIA Table 6.07.A 48.4 / 42.4 / 42.6%; EIA FAQ 0.96 lb/kWh gas; EIA Today in Energy 67427). The gigawatt rows' EIA sources were verified in the Foundation's round 1.

## Drivers
Unchanged from round 3.
