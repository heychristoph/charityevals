# Audit: care-charityevals, round 2

Result: 3.437e-4 daly/$ = 0.344 years of healthy life per $1,000 (combined range 0.079–1.49); global-health median 0.156 (×2.21). Verdict: pass (0 high).
Model-sha: 6d76411dfd4fb9e21d8ece8718639c32fceb37ed69e4d65deeca197671720f48

Scope: unchanged from round 1 (all three programme lines of the year to 30 June 2025, $747,787k, cost $834,838k). This round checks only the changes between 01b6106 and 4b2fabd.

Mechanical: lint 0/0/0, invariants none, normalization-audit no violation for this model (the output's violations are other models'), check.ts valid, simulation-check stable (5% 0.525, 50% 1.00, 95% 1.95 × best guess). generated/ restored with `git checkout -- generated`.

Previous round: finding 1 (goods and deaths adjusted apart) resolved: `relief_goods_total_adj` has no evidence step and takes `relief_goods_attribution_share` (0.95, 0.85–1); `relief_total_adj` is on deaths (and the 0 illness) only; `relief_uov` applies each; no cycle. Finding 2 (food reach read as participants) resolved: `food_beneficiaries` = 2.75M participants × (1 + 3.47 × 0.5) = 7.5M, the same household step as savings groups; `food_household_share` is a ranged judgment with reasons. Finding 3 resolved (`implementation_adj` 0.82, range widened to 0.65–0.95; applied to every branch rather than split, acceptable at about −1%). Finding 4 resolved (`food_attribution_share` 0.85 and `education_attribution_share` 0.8 are in the totals). Finding 5 (death age split) not resolved, unchanged low, deaths are 12% of the result. Finding 6 resolved: `endowment_net_assets` 33,252k subtracted, wait 0.284 years. Finding 7 resolved: summary and `ue_health_relief_share` say three-fifths; relief is 61.7% of the result and food 15.5%, savings groups 14.8% (the write-up's "a sixth each" holds), "close to World Vision's" removed; the write-up's headline figure is live (0.34 at the default 0.344). The result rose 0.272 → 0.344 (+26%), as the write-up's "about a quarter" says.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | presentation | `evidence_adj`, `attribution_share_shared` (reading-only averages) | Both still weight the whole relief branch (deaths plus goods) by `relief_evidence_adj` and `relief_attribution_share`, although those now apply to the deaths part only and the goods take no evidence step and 0.95. The averages shown (evidence 0.769, attribution 0.803) understate the relief branch's effective values. Round 1 asked for the weighting by the two parts. | Formulas of both rows; `relief_uov` formula. | Add `relief_deaths_share_unadj` = people_reached × deaths_averted_per_person × value_per_death / relief_uov_unadjusted, and in the two averages replace the relief term by `relief_dalys_unadjusted * (relief_deaths_share_unadj * relief_evidence_adj + (1 - relief_deaths_share_unadj))` for evidence, and likewise `(relief_deaths_share_unadj * relief_attribution_share + (1 - relief_deaths_share_unadj) * relief_goods_attribution_share)` for attribution. | None (reading only). |
| 2 | low | source | `endowment_net_assets` | The PDF is encrypted and could not be text-extracted here, so the page (p. 20) and the quote "Endowment net assets, end of year $ 33,252" were not re-read. The figure is consistent with round 1's reading of note 7 ($22,397k permanent plus $10,855k time-restricted = $33,252k). | Round 1 sources table. | Keep; the next auditor with a PDF reader should confirm the page number. | +0.2% if wrong by 10%. |
| 3 | low | normalization | `share_under5` etc. | Round 1 finding 5 unchanged: all-cause response-country age split not yet in @death_ages. | audit-r1 finding 5. | As in round 1. | Under 1%. |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `endowment_net_assets` | care.org/…/2025-CARE-Financial-Statements.pdf note 7 | unreachable for text (encrypted PDF) | Number matches round 1's verified sum; page and quote not re-read (finding 2) |

## Drivers
Unchanged from round 1: the missing-data discount (judgment 0.5), `$uov_per_daly`, `affected_consumption_share`, `livelihood_consumption_gain`, `uov_per_ln_consumption`; then `food_consumption_gain`, `relief_counterfactual_adj` and `relief_goods_value_share`. The new `food_household_share` (judgment 0.2–0.9, best 0.5) is not among the 12 largest swings. At 0.344 the result is 2.2× the cause median, below Doctors Without Borders relief (0.70) and Direct Relief (0.38), so no outlier statement is needed.

Findings by severity: high 0, medium 0, low 3.
