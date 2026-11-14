# Audit: 1day-sooner-charityevals, round 2 (verification of round 1)
Result: 0.005255 daly/$ = 5.26 years of healthy life per 1,000 dollars (combined range 0.37–75). Verdict: no high findings.
Previous round: audit-r1.md (two high, five medium, three low). Scope of this round: only whether those ten findings are fixed and whether the fixes introduced errors.

Mechanical: audit-model lint 0 high / 0 medium / 1 low (the spread, stated in the summary); check.ts all valid (headline 5.255e-3 daly/$, 5.3 years/$1k); simulation-check stable (5% 0.137×, 50% 0.993×, 95% 7.73× the best guess; the one single event missed in 0% of draws); normalization-audit lists nothing for this model. `generated/` restored after the run.

| # | R1 finding | Status | Check |
|---|---|---|---|
| 1 (high) | `mal_net_value_share` typed 40% | fixed | `mal_gavi_budget` 1.27bn and `mal_gavi_children` 50M (observed, note 27 quote), `mal_cost_per_child` = their ratio ($25.4), `mal_net_value_share` = 1 − cost × `@givewell_shared.cf_value_gavi` ÷ (deaths per child × under-5 value × multiplier × (1 + malaria_morbidity)), exactly as asked; explainer says the displaced money is at Gavi's counterfactual dollar. About 78%, matching r1's arithmetic. |
| 2 (high) | policy win calibrated on one size | fixed | `pol_deaths_averted` and `pol_future_dalys` use `bio_deaths_per_million` / `bio_future_per_million` × `pol_coalition_spend`/1e6 × `pol_win_multiple` × `pol_discounted_years`; `pol_relative_cut` is a reading row only and feeds nothing; `covid_scale_deaths_averted` = (bio + pol deaths) × share; `w_pol` uses w_bio's age mix. |
| 3 (medium) | `pol_win_multiple` unanchored | fixed | 1 (0.4–5), explainer names Blueprint's `uvc_evidence_adj` 0.8 (0.4–1.2) as the reference class. |
| 4 (medium) | "$3M" wording | fixed | next-dollar note: "its previous proposal ... brought $3M over three years ... asked for $5M ... no 2025-26 grant is published"; write-up: "Its previous proposal to Coefficient Giving brought $3 million over three years; for 2025–26 it asked for $5 million". |
| 5 (medium) | double counting in hepatitis C | fixed | `hcv_counterfactual_adj` is gone from the model (no references left); `hcv_carry_share` explainer holds the would-have-come-anyway question, with its 0.4 kept; `hcv_evidence_adj` 0.85 (0.6–1.1), explainer limits it to whether the protocol's 1.5 years holds and points the resubmission to `hcv_carry_share` and the self-report to the missing-data discount. |
| 6 (medium) | malaria stock instead of per year | fixed | `mal_field_children_added` 167,000 a year (33,000–833,000), unit children/year; `mal_deaths_averted` multiplies by `pv_annuity_due(1, $discount_rate, years_of_impact)` (years_of_impact = `$win_years_counted`, 5 at the defaults) and the wait discount; `mal_years_until_effect` 2 (1–4). The branch now moves with the slider (the tornado shows the children row at 4.5–8.8). |
| 7 (medium) | hepatitis C ages and illness typed | fixed | `hcv_value_per_death` and `hcv_morbidity_ratio` read `@death_ages.hepatitis_c_share_{under5,5_14,15_49,50plus}_world` and `hepatitis_c_yld_share_world`; `hcv_share_15_49` is gone. Numbers checked against WHO's xmart API (GHE_FULL, 2023, TOTAL sex, causes 200, 662, 1232, all 183 countries): summing the age groups (excluding the TOTAL, D0T27 and M1T11 rows) gives about 488.7k deaths and the quoted age shares (699 / 974 / 95,132 / 391,903 → 0.143% / 0.199% / 19.47% / 80.19%); YLD ÷ DALYs = 0.02298 (the fact's 0.023, from 346,163 ÷ 15.05M). The shares are correct. |
| 8 (low) | `staff_eor` explainer | fixed | Reworded as payroll providers and employers of record, counted as staff; the $105,947 for Europe is stated. |
| 9 (low) | `pol_counterfactual_adj` explainer | fixed | The "amended later" clause is gone; the explainer is only about whether the bill would have passed. |
| 10 (low) | "40%" wording | fixed | "Coefficient Giving ... aims to provide about 40% of its funding." |

## New errors introduced by the fixes
None that change the result. Two small points, both low:
- `pol_relative_cut`'s explainer says "about 0.004%"; the model computes 5.15e-5, i.e. about 0.005%. Say "about 0.005%". (Reading row only.)
- The hepatitis C age shares come from WHO GHE with about 488.7k deaths for the three causes, twice the 239,000 deaths of the WHO fact sheet that `hcv_deaths_per_year` uses. Only the shares are used from GHE, so the result is unaffected, but a one-line note in the shares' explainer would stop a reader from mixing the two totals. Not a reason to hold.

## Write-up against the model
- Headline 5.3: model 5.255. Matches.
- Branch shares (each branch's input set to zero in a scratch copy, results 4.854 / 4.360 / 4.956 / 1.595 against 5.255): SB 1308 win 7.6% (write-up 8), malaria 17.0% (17), hepatitis C 5.7% (6), pandemic field work 69.7% (69; the summary says "about 70%"). Matches.
- Tornado figures: discount rate 59.97 / 4.128 ("about 60 / 4.1"), win years 1.370 / 15.43 ("1.4 / 15"), extinction cut 3.27 / 25.1 ("3.3 / 25"), next dollar 2.21 / 9.13 ("2.2 / 9.1"), malaria children 4.54 / 8.82 ("4.5 / 8.8"). Matches.
- Range "about 0.4 to about 75": combined range 0.3665–75.35. Matches.
- "78% of the value is left", "raised the malaria share from 40% to 78%", "5.7 to 5.3", "2 to 1" match the model and r1.
- Not re-checked this round: "3.3 times the median for this cause" and the peer figures (SecureBio 6.1, Johns Hopkins 7.5); r1 gave the cause median 1.58 and 5.255 / 1.58 = 3.3.

## Sources checked this round
| Row | Source | Status |
|---|---|---|
| hepatitis_c_* death_ages facts | https://xmart-api-public.who.int/DEX_CMS/GHE_FULL (causes 200, 662, 1232, 2023, TOTAL sex), fetched 2026-11-14 | verified (see finding 7) |
| mal_gavi_budget, mal_gavi_children | proposal note 27, as in r1 | quote as r1 read it |

Verdict: no high or medium findings left; all ten round-1 findings fixed as asked, and the fixes introduced no error that moves the result (two low presentation points above).
Model-sha: ebdfc3c0c7e2030bcffe85d37a80e5040fec843be4fae5fc0adf08f1259d248f
