# Audit: samaritans-purse-charityevals, round 2
Result: 4.715e-5 daly/$ = 0.0472 years of healthy life per 1,000 dollars (combined range 0.0114–0.195); cause median 0.207 (×0.23). Verdict: pass.
Model-sha: 68a89a110bff2bcc400b3063e47a0c6aacaf6a94b6921814886b114fd017b792
Scope: verification of the changes between 3538df8 and 4c8d1a4 (model and write-up). Scope of the model itself unchanged from round 1.
Mechanical: audit-model lint 0 high/0 medium/0 low, no invariant violation; check.ts: all models valid; simulation-check stable (5% 0.56×, 50% 1.00×, 95% 1.73× the best guess). normalization-audit not re-run (no change to shared steps; the new rows read the same shared facts: `@cpi`, `@survey_consumption`, `@ukraine`, `@lebanon`). `generated/` restored with `git checkout -- generated`.
Previous round: 2 medium, 8 low; all ten fixed (table below).

## Round-1 findings: status
| # | Round 1 | Status | Check |
|---|---|---|---|
| 1 | medium, consumption ignores the regional split | fixed | New `other_consumption` = avg(Ukraine and Lebanon national-accounts consumption × survey-to-NA ratio) × `affected_consumption_share` (about $1,700; ratios exist in facts/survey_consumption.json), and `ln_gain_per_person` weights the two settings by `famine_setting_share`. This also fixes finding 3 in the same formula (`years_exposed` in both denominators and as the outer factor). Units consistent (2024 US$ per person; value delivered is deflated to 2024). Myanmar left out with a stated reason. |
| 2 | medium, in-kind equivalence anchor | fixed | `occ_inkind_equivalence` 40% (20–70%) → 35% (15–60%); explainer now gives price and use parts, the TOMS trial and Cunha 2014 as reference class, and how 35% is reached. See low finding A on the sources. |
| 3 | low, rations spread over a year | fixed | In `ln_gain_per_person` (see 1). |
| 4 | low, South Sudan water double count | fixed | New observed `ss_wash_people` 60,000 (Form 990 Part III 4c, quote, URL, date); `relief_cost_per_person` takes `ss_wash_people * wash_cost_per_person` out. Cost per person $203 → $191; explainer and write-up say $190. |
| 5 | low, price years | fixed | `value_delivered_per_person` and a new `aid_value_2024` (feeding `aid_ln_gain_per_person`) times `@cpi.usa_2024 / @cpi.usa_2025`, labels say 2024 US$; also applied to `us_value_per_household` (not required, consistent). |
| 6 | low, volunteer valuation | fixed (equivalent) | New judged `occ_volunteer_rate_ratio` 3 (2–4.7) in `occ_attribution_share`, anchored on the shared $36.14 hour against the $7.25 minimum wage and a warehouse wage. No hours are published, so a ratio is the only available form. |
| 7 | low, surgery disability | fixed | Built from `med_general_disability_dalys` 0.3, `med_cc_share` 5% (counts in the explainer: about 1,200 cataract and 200 cleft a year over about 24,000), `med_cc_dalys` 1.5 discounted (0.5–4). Formula and weights correct. |
| 8 | low, outpatient risk | fixed | `med_outpatient_risk_untreated` = field share 15% × MSF's 0.2% + the rest × a stable-setting 0.1% (0.05–0.2%). Field share has a count anchor (about 10,000 patients, fact sheet). |
| 9 | low, `us_value_share` explainer | fixed | Reads "the line's grants are $72M of its $185M (Part III 4b)". |
| 10 | low, typed shares in write-up | fixed | Percentages removed; "about three-quarters" remains (see low finding B). |

## New findings
| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| A | low | sources | `occ_inkind_equivalence` explainer | The two new references (Wydick, Katz, Calvo and Janet 2018, World Bank Economic Review; Cunha 2014, AEJ: Applied) are cited by name only, with no URL or quote, and I did not fetch them in this time-boxed round. The statements that the shoes "largely replaced shoes the children would have had" and that Mexican recipients "valued in-kind food below its cost" are the builder's paraphrase and should be checked against the papers. | Explainer text. | Add the papers' DOIs and the one result each is used for, and soften any paraphrase the abstracts don't support. | none (a judgment either way, 35% within its range) |
| B | low | presentation | write-up "What drives the result" | "with the shoeboxes, about three-quarters of the result" is a typed share that will go stale after any change; round 1's finding 10 asked for removal or a live figure. | Write-up. | Replace with "the two largest branches" or a live figure. | none |
| C | low | judgment | `occ_volunteer_rate_ratio`, `med_general_disability_dalys` | The ratio's high end 4.7 is below the 5× the explainer cites (shared hour over federal minimum wage). `med_general_disability_dalys` cites GBD weights "0.1-0.3 for years" without a table or a duration. Both are anchored but loosely. | Explainers. | Set the volunteer ratio high to 5 (the minimum-wage case); name the GBD fracture weight and a duration in the surgery row. | below 1% |
| D | low | unsourced | `food_price_per_kg` | Reworded correctly as an unsourced judgment (no bulletin checked), but it remains a top-8 driver with no external reference class. | Explainer; tornado 0.0424–0.0539. | Add a dated WFP or FEWS NET price bulletin for South Sudan or Sudan when available. | about ±12% across its range |

## Checks
- Formulas, units, price years: all new rows in 2024 US$ or dimensionless; no literal constants outside the lint's allowed set (lint 0). The CPI ratio is applied once each to food, aid and US household value, and not to anything already in 2024 prices (`occ_value_2024` unchanged).
- Double counting: water is out of South Sudan's per-person relief cost and in the water branch only. The medical split (field share, cc share) partitions each population, so no overlap. `other_consumption` and `baseline_consumption` partition the people by `famine_setting_share`, the same split as the deaths step. No new unit error.
- Write-up: headline 0.05 and "a quarter" match the model (×0.23); "about a quarter" lowering matches 0.0632 → 0.0472 (−25%); the relief, medical, shoebox and round-1 lines match the rows.
- Peers: ×0.23 of the cause median, explained in the summary.
- Top drivers: missing-data slider, `$uov_per_daly`, `occ_inkind_equivalence`, `$uov_per_ln_consumption`, `occ_recipient_consumption_share`; no new unranged or unexplained input.

Verdict: pass.
