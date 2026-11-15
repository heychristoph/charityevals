# Audit: american-cancer-society-charityevals, round 3 (verification of the shared tobacco figures)

Result: 6.005e-6 daly/$ = 0.006005 years of healthy life per 1,000 dollars (combined range 6.1e-4 to 0.059; joint low-high of the model's own ranges 0.0015 to 0.065); cause median 0.0667 (x0.090). Before the change: 0.00332745; after: 0.006005 (x1.80). Verdict: pass.
Model-sha: e9c9e8d67930a7021d7c86b1a0767f38100bca6ba86458055105a73389b5c38c
Scope: only what commit 3e68437 changed for this model (tobacco branch `tob_*` reading facts/tobacco.json, coverage branch `adv_*` with its own figures, p_success 1 in both, write-up and summary). Programmes and year (FY to March 2026) unchanged from rounds 1 and 2.
Mechanical: lint 0 high / 0 medium / 3 low (two context rows unused, far-below, the summary gives the reason); invariants none violated; `check.ts` all models valid; `simulation-check.ts` stable (5% 0.31, 50% 1.0, 95% 3.09 x best guess; the "range spans 1,000,000x" and "90% judgment" warnings are the known ones). `normalization-audit.ts` not run: the commit's waivers (in src/engine/normalization-waivers.json) are for Cancer Research UK and Campaign for Tobacco-Free Kids rows, none for this model, and no tob_* row retypes a shared figure.
Previous round: rounds 1 and 2 had no open high or medium findings; their lows (A: research low end; B: reading-only gap row) are unaffected by this commit.

## Checks

- **Chain and units.** Recomputed from the model: tob_dalys = 9,447,628 x 0.0025 x 0.4695 (lag discount: half at the 8-year quit lag, half at the 40-year never-start lag, each at `$discount_rate`) x 1 x 4.452 (pv_annuity_due over `$win_years_counted` x policy delay) = 49,366 DALYs. Credit: tob_total_adj = 0.8 (evidence) x 1 x 0.3 x 0.9 (enforcement) x 0.5 (missing data) = 0.108. Illness 589 DALYs, deaths 6,062 UoV, both x (1 + 10.5% second-hand smoke). Same formulas as the Campaign for Tobacco-Free Kids US branch (`adv_health_lag_discount`, `adv_discounted_years`, `us_value_per_death`), so the one-way-per-concept rule holds.
- **Canonical rows.** `uov_bridged` sums all four `*_uov_credited`; `dalys_direct` sums all four DALYs x yld share; `outcome_total` includes `tob_illness_credited`; the six weighted-average rows (evidence, counterfactual, attribution shared, attribution, missing data, total) all include tob_dalys in numerator and denominator. Nothing missed.
- **No double counting.** Tobacco and coverage branches use disjoint policies (tax, flavour, youth and smoke-free rules against biomarker-testing and follow-up coverage laws and federal budgets). The coverage explainer says its tobacco wins are the tobacco branch, and the old `adv_noncancer_ratio` (which added heart and lung disease for tobacco) is removed, so smoking's non-cancer burden is counted once, in `tob_`. The research branch already credits smoking's fall to policy only. Branch shares of the result recomputed: tobacco 53.8%, coverage 26.4%, research 15.3%, screening 4.6%, matching the write-up's 54/26/15/5.
- **p_success 1.** Right for a past average of a typical year's wins against one year's spending when campaigns run 2-3 years: in a steady state, a year's work buys a slice of this year's wins and of the next years', which sum to one year's wins; the previous 0.4 applied a second "share of the campaigning done this year" on top of a figure that already was a year's wins, understating it. `us_wins_share_smoking_burden_averted` is defined as a typical year's wins by all groups, and the ACS CAN credit (30% of the coalition's resources) is a flow of resources in the same year, so the pair is consistent; it is also what the Campaign for Tobacco-Free Kids model does. The question of whether the work made a difference is carried by the credit share and `$win_years_counted`, not counted twice. The only thing lost is the old 0.2 to 0.7 range for growth or decline in spending, which is small. Accepted.
- **Coverage branch.** Share 0.05% (0.01% to 0.2%): the explainer's own arithmetic (coverage laws in a few more states reaching a few percent of people with cancer, cutting their burden a few percent) gives about 0.05%, and equals the old non-tobacco half of the previous 0.1%, so the halving is explained and the move to p_success 1 is not hidden by it. Lag 3 years (1 to 6) fits laws that act through diagnosis and treatment, and replaces the tobacco lag (10) which no longer applies. Evidence 0.6 (0.35 to 0.9) equals the screening branch's best and range and is below the tobacco shared 0.8, with the reason given. Reasoned; see finding 1 for the one weak point.
- **Side effects.** `tob_secondhand_smoke_share` is tagged `side_effect: "added"` and scales with `$side_effect_weight` (same row as CTFK's); the figure is the shared 990,985 / 9,447,628 = 10.5%. Applied to both illness and deaths. Correct.
- **Write-up and summary.** Headline 0.006 matches the live 0.006005; four branches described; summary (0.006, tobacco/coverage split) matches the rows; the claim about 46% next-dollar and the "under a tenth of the median" reason stay valid (x0.090).

## Findings

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | low | sensitivity | `adv_share_burden_averted` | The 0.05% best is a product of two unsourced "a few percent" figures, and the branch lumps biomarker-testing laws with federal budget and coverage protections (NIH and Medicaid fights), whose effect could be larger than a few more states' laws. It is the 6th tornado input (0.0047 to 0.0108). | Explainer; tornado | Split into a state-laws part and a federal part with one named anchor each (e.g. the 23 states with biomarker laws from the ACS impact page, the share of Americans with cancer they cover), or say in the explainer why the federal part is small. | Range only; best unchanged |
| 2 | low | presentation | `tob_attribution_share_shared` | Explainer hardcodes "12% in its own model" for the Campaign for Tobacco-Free Kids and CTFK's explainer hardcodes ACS CAN's 30%; if either is changed they go stale. | Both explainers | Drop the number from one side, keep "its own model's" wording. | none |
| 3 | low | presentation | write-up "How this model was checked" | Still describes rounds 1 and ends with 0.0033 era changes; no line for this change (shared tobacco branch, p_success 1, coverage figures, result 0.0033 to 0.006). | Write-up | Add one short bullet for the change and its effect on the result. | none |
| 4 | low | source | `tobacco.smoking_dalys_usa` and other GBD rows | OWID grapher cannot be fetched (403 for CSV, no page text without JavaScript), so the 9,447,628 figure could not be re-read. It is unchanged from the value in the CTFK model before this commit (git history), whose audit passed. | curl to the grapher | Add a second source the audit can read (IHME GBD Results tool citation) when convenient. | none |

## Sources checked

| Row | URL | Status | Note |
|---|---|---|---|
| tobacco.smoking_dalys_usa, shs_dalys_usa | https://ourworldindata.org/grapher/disease-burden-by-risk-factor?tab=table&time=2023 | unreachable | 403 for CSV; same number as before the commit in the CTFK model. Ratio 10.5% second-hand to smoking is consistent with GBD |
| tobacco.us_wins_share_smoking_burden_averted | derived in explainer | reasoned | -0.4 elasticity, $1 on $8, half quitting, one or two states, flavour and youth rules x1.5, arithmetic checks to about 0.25% |
| tobacco quit, never-start lags, enforcement, evidence | facts/tobacco.json | judgment | ranged, anchors named |

## Drivers

1. `missing_data_discount` (shared judgment, 0.5).
2. `win_years_counted` (shared judgment).
3. `@next_dollar.american_cancer_society` (estimate, 0.46).
4. `@tobacco.us_wins_share_smoking_burden_averted` (shared judgment with a worked derivation).
5. `discount_rate`, then `adv_share_burden_averted` (judgment). Most improved by a sourced split of the coverage share (finding 1).

Findings by severity: high 0, medium 0, low 4.

Verdict: pass

Re-stamped (15 Nov 2026): peer comparison removed from the summary; no value changed.
