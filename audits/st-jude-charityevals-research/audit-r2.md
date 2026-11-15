# Audit: st-jude-charityevals-research, round 2 (scoped verification of commit 70665e1e)
Result: 2.251e-6 daly/$ = 0.002251 years of healthy life per 1,000 dollars (combined range 0.000189–0.0268); cause median 0.1085 (×0.021). Verdict: pass.
Model-sha: 039448f42c9c61b1ddc65a0f1c073d4a33130dc70c62a011cd8fc4c5b405f2cd
Scope: unchanged from round 1 (own-funded research, FY2025, $720.8M); only the round-1 fixes and the rows and text changed in 70665e1e were checked.
Mechanical: lint 0 high / 1 medium (far-below, explained in round 1's Drivers; unchanged) / 1 low (spread: the summary states it); the unused-row low is gone. Invariants none. check.ts: all models valid. Normalization-audit and simulation-check not re-run (scoped round; no structural change).
Previous round: 6 findings, all resolved (table below).

## Round-1 items

| # | Round-1 finding | Status | Check |
|---|---|---|---|
| 1 (medium) | Stale summary and write-up | resolved | Summary: "about 0.002", next dollar at 21% from 3.7 years of reserves, range "about 140-fold (0.0002 to 0.03)"; live 0.002251, combined range 0.000189–0.0268 (141-fold). "is low because" removed. Write-up: "shared 'next dollar' slider" replaced by St. Jude's own figure (21%); 140-fold; the headline span is live. The research write-up is identical to `writeups/st-jude-charityevals.md`; the stale "held back" sentence is gone. No peer comparison (lint `comparison` clear). Write-up's "about a fifth" (ca share 21.5%) and "about 8%" (nc share 7.7%) match the live rows. |
| 2 (low) | Credit share missing hospital administration | resolved | `hospital_indirect_uplift` = 1 + 141,472/program_expenses = 1.0806 (live). Share = S·u / (F + S·(u−1)): numerator and St. Jude's part of the field both at the uplift, correct algebra (= S·u / (F − S + S·u)). ca share 0.2146, nc 0.0774. ALSAC fundraising correctly left out. |
| 3 (low) | Influenza counted under-fives only | resolved | New rows below; no overlap with the under-five row (see checks). Write-up's "not modelled" line now says only the illness over five is left out. |
| 4 (low) | Unused `nc_scd_dalys_per_year` | resolved | Row deleted, no reference left in models, facts, write-up or scripts; `nc_disease_dalys_per_year` rebuilt from deaths at their value plus YLDs (24.7M, reading only). Lint `unused` is gone. See finding R2-1 on the formula's form. |
| 5 (low) | `@next_dollar.st_jude` cited FY2024 | resolved | Source now the FY2025 combined accounts (pp. 3 and 5): net assets $12.56B, revenue over expenses $1.24B, cash and investments $10.59B against $2.83B expenses = 3.7 years (round 1 verified these figures against the PDF). Room 0.3 and value 0.21 unchanged. |
| 6 (low) | Spread | resolved | Summary states the live range (141-fold); lint spread now only asks to keep the sentence (8,623×, unchanged in nature). |

## Changed rows and text

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| R2-1 | low | structure | `nc_disease_dalys_per_year` | The formula converts through `dalys_from_uov / uov_bridged`, which is the constant 1/`$uov_per_daly` but is written through the result's own bridge: it divides by `uov_bridged` (0 if both branches' credited deaths were 0, giving NaN in a reading row) and hides the plain conversion. Round 1 proposed `/ $uov_per_daly`. | Row formula: `(nc_scd_deaths_per_year + nc_flu_deaths_per_year + nc_flu_deaths_over5_per_year) * nc_value_per_death * dalys_from_uov / uov_bridged + ...` | Replace `* dalys_from_uov / uov_bridged` by `/ $uov_per_daly`. | none (reading rows only) |
| R2-2 | low | source | `nc_flu_deaths_over5_per_year` (quote) | The quoted phrase "responsible for an estimated 145 000 (95% UI 99 000-200 000) deaths among all ages" could not be matched word for word: the abstract reads "145 000 (95% uncertainty interval [UI] 99 000–200 000) deaths among all ages in 2017" and the results text gives 98 000–200 000. The number, interval and year are right. | PMC6302221 abstract and results. | Set `quote` to the abstract's wording; keep low at 75,000 (99,000 less 23,500 gives 75,500; the 98,000 in the results gives 74,500). | none |

## Checks of the new rows (all passed)

- **Sources.** GBD 2017 influenza paper (PMC6302221): "145 000 (95% UI 99 000–200 000) deaths among all ages in 2017" (verified); "71 000 deaths (95% UI 50 000–95 000) among adults older than 70 years" (verified); the population attributable fraction of influenza in LRTI deaths "among children younger than 5 years (2·9% [2·0–4·0])" (verified; the paper gives the fraction, not a count, so the row's note derives the count correctly); no YLDs are reported for influenza (verified, so the explainer's "GBD 2017 gives none" is right). GBD 2017 LRI paper (Lancet Infect Dis 2020;20:60-79): 808,920 (747,286–873,591) LRI deaths under five in 2017 (verified via PubMed/LSTM abstract).
- **Arithmetic.** 2.9% × 808,920 = 23,458 (note says about 23,500). Over five: 145,000 − 23,500 = 121,500 (best), 99,000 − 23,500 = 75,500 (low, stated 75,000), 200,000 − 23,500 = 176,500 (high, stated 177,000). Share at 70+: 71,000 / 121,500 = 58.4% (fact value 0.584). Fine.
- **Value per death.** `nc_flu_over5_value_per_death` = 34.89 uov live, against 116.3 under five and 108.1 for sickle cell: monotone in age and sensible for a 58% share of deaths at 70+ (75-79 and 80-84 bands) with the rest at 15-49 and 50-74. Formula weights sum to one (1 − s70) split by under-50 share, s70 split by 80+ share; both splits are ranged judgments with anchors named. Multiplied by `$life_value_multiplier`.
- **Entry into the result.** `nc_value_per_death` (deaths-weighted, now 91.6), `nc_uov_credited` and the deaths sum all include the new row consistently; units uov, into DALYs through the one bridge (`dalys_from_uov`), no second conversion. The branch's adjustments apply unchanged.
- **No double counting.** The under-five row is GBD 2021 (27,615, 2021); the new row is the all-age 2017 total less 2017's under-fives, so no child is in both. Different years, stated in both explainers. The field funding they are credited against (`nc_field_research_funding`, all ages) now matches the burden's scope; its explainer was reworded (industry spending is vaccine manufacturing or research, 0.8 to 3 billion), which is a clearer reading of the same range.
- **Shared fact.** `@death_ages.influenza_lri_share_70plus_of_over5_world` = 0.584, kind estimate, source, quote, note and retrieval date present; valid in the library.
- **Ranges.** Deaths over five 75,000–177,000 reflect the paper's interval; the two split judgments (35%: 20–50%; 52%: 42–62%) are sensible and carry little weight (their swing in the tornado is 0.0022–0.0023).
- **Effect.** Result moved 0.002046 → 0.002251 (+10%): about +6.7% from hospital administration and about +3% from influenza over five, as round 1 estimated.

## Drivers
Unchanged from round 1: `$missing_data_discount`, `@next_dollar.st_jude`, `ca_share_burden_addressable`, `$discount_rate`, `ca_p_success`; the new influenza rows are not in the tornado's top 12.
