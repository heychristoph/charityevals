# Audit: direct-relief-charityevals, round 2
Result: 3.778e-4 daly/$ = 0.378 years of healthy life per 1,000 dollars (combined range 0.070–2.05); cause median 0.338 (×1.12). Verdict: pass.
Mechanical: audit-model 0 findings; simulation stable (5% 0.31×, median 1.0×, 95% 3.6× best guess); normalization-audit reports no violation for this model (it checks 0 models in this sandbox); the share_under5 waiver is a checked coincidence (different quantity, same round value).
Previous round (1 high, 3 medium, 3 low): all settled.

| Round-1 finding | Status | Check |
|---|---|---|
| 1 gdp_pc_mix / other_gdp_pc | settled | `gdp_pc_mix` is the aid-weighted harmonic mean; `other_gdp_pc` $2,000 ($1,200-4,000) anchored on the $1,985 harmonic figure; note no longer says aid shares are result shares. |
| 2 counterfactual_adj | settled | 0.75 (0.5-0.9), other channels only; the "would have bought" reason is explicitly left to the threshold. |
| 3 evidence_adj | settled | 1 (0.8-1.1), bias only; "not measured" left to the missing-data step. |
| 4 implementation_adj | settled | the warehouse write-off is stated as outside the distributed goods; anchor is partners' shelves. |
| 5 grants' GDP mix | settled | `grt_cost_per_daly` harmonic, Ukraine $19.7m (p. 44, verified in round 1). |
| 6 need_vs_marginal | settled | stays 1; difference from the US model's 1.5 explained (threshold here is the whole system's margin). |
| 7 write-up sentence | settled | the grants sentence corrected. |

New changes (deaths split by age): `deaths_averted_per_person` and `grt_deaths` = health bought x (1 - yld_share) x deaths_per_daly, valued by `value_per_death` (shared age weights x `$life_value_multiplier`) in `uov_bridged`; illness in DALYs. The chain is consistent with no double count (the two shares partition the DALYs), both branches are treated alike, and both shared rows are ranged judgments with reasoning.

| # | Severity | Row | Finding | Fix |
|---|---|---|---|---|
| 1 | low | `medicines_lmic_deaths_per_daly`, `share_under5` | The fact assumes about 30 years of life lost per death, while the model's age mix (25% under five, about 88 years each) and the site's value of a death imply nearer 35-38 DALYs per death (value_per_death 77 uov, half a DALY per uov). Small gap, inside the fact's 20-45 range. | Optionally state the mix-implied years in the fact's explainer, or nudge best to 0.028; moves the result about -10% at most. |
| 2 | low | `yld_share` | 40% illness is a judgment with only "about a third" worldwide as anchor; the explainer is honest about it. A GBD YLD share for low and lower-middle income countries would anchor it better. | Cite that GBD figure. |

No high or medium finding.

Verdict: **pass** (0 high, 0 medium, 2 low).
Model-sha: 0e12a6636d0aa5e53adfbebd4d46e03ca5ea19abfc5a3c2707d5f9b1549f4e3b

Re-stamped (16 Nov 2026): Preflight cleanup: judgments' explainers name their reference class (or say plainly there is none); labels and unit labels say what the rows are; no value changed. Mechanical: headline unchanged, against migrate/data-model.
