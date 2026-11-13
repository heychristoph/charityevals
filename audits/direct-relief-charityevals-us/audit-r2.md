# Audit: direct-relief-charityevals-us, round 2 (verification)

Result: 6.475e-6 uov/$ = 0.00324 years of healthy life per $1,000 (combined range 0.00068-0.0154; was 0.0014). audit-model: 0 high / 0 medium / 1 low (far-below, reason in the summary still matches). check.ts: all models valid. The x2.3 move matches the round-1 projection (x1.73 deaths, x1.2 counterfactual, x1.05 side-effect share, 0.85 to 0.9 internal validity).

## Round-1 findings

| # | Status | Check |
|---|---|---|
| 1 high | settled | `vanness_deaths_per_10m` 5 (3-11) and `vanness_qaly_illness_per_10m` 15 (6-32), interval 0.95, quotes match the abstract; `deaths_per_dollar` and `illness_dalys_per_dollar` = per $10m / 1e7 x cpi2019/cpi2025 (right direction); deaths in both branches go to `deaths_averted` x `value_per_death` (share_under5 and share_5_14 0, share_15_49 0.3 (0.2-0.4)); the 81 death-QALYs are not used, so nothing is counted twice. The life-value slider now reaches the model (uov_deaths 333 of 384). |
| 2 high | settled | `counterfactual_adj` 0.6 (0.35-0.85), explainer limited to other channels (patient-assistance programmes, Medicaid, other charities, other funders); the replaced-purchase argument is only in `need_vs_marginal`. |
| 3 medium | settled | `outcome_total` applies the side-effect share to `uov_from_daly` and deaths; the row now moves the result (it is in the tornado). The template change is outside this build's files (reported as a skill problem). |
| 4 medium | settled | `internal_validity_adj` 0.9 (0.6-1.1) is a bias judgment anchored on Oregon HIE versus Miller et al. 2021; the "not measured" and "wide interval" reasons are removed. |
| 5 medium | partly settled | `need_vs_marginal` now names naloxone (~$400/QALY, Coffin and Sullivan 2013) as a reference point, but only one side of the mix and no weighting by product categories. `grt_need_vs_marginal` (1, 0.4-2, a top-three driver in the tornado) still has no number or reference class. See finding A. |
| 6 low | settled | interval 0.95 on both Vanness rows. |
| 7 low | accepted | Freight left out ($346k, -0.2%): negligible. |
| 8 low | settled | share rows set for US adults. |

## New findings

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| A | medium | `grt_need_vs_marginal` | A top-three judgment driver (0.0009-0.0023 over its range) with pros and cons only; round-1 finding 5 asked for an anchor on how the $37.5m splits between clinic operating grants and disaster recovery (annual report p. 44). | Name the split and a cost-per-QALY or threshold comparison for each part, then set the value from it. Not high: the range already carries the doubt. |
| B | medium | `value_per_death`, `uov_deaths` | Stale after finding 1: the explainers say "multiplied by zero deaths here" and "zero here", and the label says "(none)", but deaths are now 87% of the outcome. A reader is told the opposite of the model. | Rewrite: "The site's one value of a death, by age band, times your value of a life"; label "Units of value from deaths averted"; explainer "Deaths times the value of a death." |
| C | low | `internal_validity_adj` explainer | Says the Oregon experiment "found no significant effect on mortality"; it was underpowered for mortality, so "could not detect" is the better wording. | Reword. |

No high findings. The summary and the write-up (deaths valued by age, the Vanness split, the round-1 list) match the model.

Model-sha: bde10e7c642d1629eaa2451029bdc4afe6d9c6051e7ff07d7dd40db8f6414879

**Verdict: pass** (0 high; 2 medium, 1 low).
