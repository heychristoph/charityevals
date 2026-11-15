# Audit: st-jude-charityevals-research, round 1
Result: 2.046e-6 daly/$ = 0.002046 years of healthy life per 1,000 dollars (combined range 0.000172–0.0244); cause median 0.1085 (×0.019). Verdict: pass.
Model-sha: b990d34283b050fe415500452e187ca9ce9aebe875d856a86d411a93685b90de
Scope: St. Jude's own-funded research, FY2025 (year to 30 June 2025, the latest audited accounts): research $883.2M less grants $162.4M = $720.8M, split into cancer (70%, judgment) and non-cancer (30%) branches. It matches charities/st-jude.json's `research` line ($720,791,000). The other line, patient care, St. Jude Global, training and community ($731.6M), is the sibling model st-jude-charityevals. ALSAC's "public education" ($246.0M) counts as fundraising in both models. Together the two models' costs come to total expenses less insurers' and grant money: no programme is left out and no cost is counted twice.
Mechanical: lint 0 high / 1 medium (far-below: explained by its rows, see Drivers) / 2 low (unused `nc_scd_dalys_per_year`, spread); invariants none; normalization-audit none (all 474 models, 0 violations); check.ts valid; simulation stable (5% 0.21×, 50% 1×, 95% 5.24× the best guess).
Previous round: none (first audit with a receipt; no earlier findings given).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | summary; write-up "Summary", "How the model works", "What drives the result", "Biggest uncertainties" | The summary and write-up are stale. The summary gives "about 0.005" years per $1,000 and a range of "0.0004 to 0.07", "about two-hundredfold". The live result is 0.0020, with combined range 0.00017–0.024 (about 140-fold) and simulation 5–95% 0.00043–0.011. Neither text mentions St. Jude's own next-dollar figure (21%), now the second-largest driver. The write-up still says the result "is scaled by the shared 'next dollar' slider" and that the slider "moves research the most", but that slider was retired on 15 Nov 2026 (normalization.md 2.10). The summary also calls the result "low", an implicit comparison. | audit-model.ts headline and range; simulation-check.ts; facts/next_dollar.json `st_jude` 0.21 (room 0.3: years of spending in reserve); normalization.md 2.10. | Rewrite the summary's result sentence to the live figure: about 0.002, plausible range about 0.0002 to 0.02. Add one sentence: St. Jude's next dollar is counted at 21% of its past average, because it holds about 3.7 years of spending in reserve. Delete "is low because" and keep the reasons as plain causes. In the write-up, replace both "shared 'next dollar' slider" phrases with "St. Jude's own next-dollar figure (21%, from its reserves)", and change "about two-hundredfold" to the live range. | none (text) |
| 2 | low | normalization | `ca_attribution_share`, `nc_attribution_share` | The credit share puts St. Jude's research at direct cost only, without its share of hospital administration ($141.5M, 8.1% of programme spending). The field's funding is in total cost: NIH/NCI awards, the $600M+ anchor, include grantees' indirect costs. So St. Jude's share of the field is understated a little. | St. Baldrick's: NCI "spent more than $600 million" on childhood cancer research in FY2023 (award totals); accounts p. 5 hospital admin 141,472. | Multiply St. Jude's side by `(1 + hospital_admin_expenses / program_expenses)`, in the numerator and in its part of the field's total, in both branches. Or, if the field anchors are judged direct-cost, say so in `ca_field_research_funding`'s explainer, citing the anchor. | +6.7% (0.00205 → 0.00218) |
| 3 | low | missing-adjustment | `nc_flu_dalys_per_year`, `nc_field_research_funding` | The influenza burden counts under-fives only, and only 2021, a year the pandemic held down. The field funding it is divided by includes industry's all-age vaccine and antiviral work ("$0.8 billion if industry's influenza work is mostly adult and out of scope"). St. Jude's influenza work (the WHO collaborating centre, surveillance, vaccine strain work) serves every age. So the benefit side and the credit side have different scopes, and the write-up lists adults' benefit as "not modelled". | Zhang et al. 2026: 27,615 under-five deaths in 2021, "accelerated declines after 2020"; the explainer's own note that about 85% of influenza deaths are adults. | Add the all-age seasonal influenza lower-respiratory burden from a pre-pandemic GBD year (GBD 2019: deaths and YLD by age). Add its age split as a shared fact in facts/death_ages.json, valued by `@moral_weights` age bands × `$life_value_multiplier`, and keep `nc_field_research_funding` at its all-age best. Then delete the adult line from the write-up's "What isn't modelled". | about +3.6% (upper bound: 117,000 adult deaths at the 50–74 weight) |
| 4 | low | structure | `nc_scd_dalys_per_year` | This judgment (11M, 5–25M) doesn't reach the result (lint `unused`). It weights only reading rows (`nc_disease_dalys_per_year`, `share_burden_addressable`, `p_success`, `research_dalys`), so those reading rows mix a judged DALY total with an outcome built from 376,000 deaths and YLD, which the explainer says would by themselves exceed 11M. | lint; row explainer. | Delete the row. Set `nc_disease_dalys_per_year` to the built burden, `(nc_scd_deaths_per_year + nc_flu_deaths_per_year) * nc_value_per_death / $uov_per_daly + nc_scd_yld_per_year + nc_flu_yld_per_year`, labelled "for reading", so the reading averages weight by what the outcome counts. | none (reading rows only) |
| 5 | low | source | `@next_dollar.st_jude` (read by `marginal_vs_past_average`) | St. Jude's next-dollar figure cites the FY2024 accounts (net assets "about $11.3B"), while this model uses FY2025: net assets $12,561.6M at 30 June 2025, revenue over expenses $1,238.4M, cash and investments $10.59B (3.7 years of spending). | Accounts p. 5 (net assets end of year 12,561,643; revenue over expenses 1,238,437) and p. 3. | Re-source the fact to the FY2025 combined accounts with these figures. Room stays at its floor of 0.3, so the value is unchanged. | none |
| 6 | low | sensitivity | summary (lint `spread`) | The model's own ranges span about 7,940× from joint low to high (shared figures at their best). Most of that comes from the three jointly calibrated judgments in each branch: share averted, chance of success and years brought forward. | audit-model.ts. | Keep the summary's uncertainty sentence, at the live range (finding 1). No source would narrow the three judgments separately, so leave their ranges. | none |

Double counting with the sibling (st-jude-charityevals): none material.
- Costs: both models apply the same overhead ratio to own-funded spending, so together they make up exactly total expenses less insurers' and grant money.
- St. Jude Global: it credits better delivery of existing care, net of improvement that would have come anyway. This model credits the adoption of new advances (explainers on both sides say so).
- Graduate school: it credits graduates' extra research output over a career, mostly elsewhere.
- St. Jude's own patients: about 90 cancer deaths a year against 144,000 in the burden, so the overlap with the US patient-care branch's survival gain is under 0.1%.
- Reserves: the reserve wait (×0.979) and the next-dollar room factor (0.3) answer different questions, timing and marginal value.

Other checks passed:
- Deaths are taken out of GBD's DALYs and valued by age × `$life_value_multiplier` through the uov bridge, with the survivors' remaining-life fact on cancer deaths.
- Every wait (12-year lag, years brought forward, 3.7-year reserve wait) is at `$discount_rate`.
- The counterfactual is answered once, in years brought forward (counterfactual_adj 1).
- Both branches take `$missing_data_discount`, which is correct: no outcome measure of St. Jude's own.
- `estimate_basis` past_average reads `@next_dollar.st_jude` with `published` 1.
- The overhead counts ALSAC's joint-cost public education as fundraising, shown in the explainer.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| total_expenses | St. Jude/ALSAC combined FS FY2025 (stjude.org PDF) | verified | p. 5: total expenses 2,833,905 (in 000s). The PDF is scanned; read from its embedded page images. |
| combined_program_expenses, patient_care_expenses, research_expenses, combined_et_expenses | same | verified | p. 4: 2,002,082; 726,650; 883,216; 392,216. |
| patient_service_revenue, research_grants_revenue | same | verified | p. 4: 141,306; 162,425. |
| hospital_admin_expenses | same | verified | p. 5: Administrative and general—Hospital 141,472. |
| cash_and_investments | same | verified | p. 3: unrestricted 8,444,862; restricted 1,587,521; cash 557,709 (total assets 13,096,768 less the other lines). |
| research_salaries | same | verified | p. 6: salaries and benefits, research column 525,277. |
| long_run_return (anchor) | same | verified | p. 4: net investment income 939,270. |
| hospital_total_expenses | https://projects.propublica.org/nonprofits/organizations/620646012 | verified | FY ending June 2025: expenses $1,897,571,834. |
| ca_disease_dalys_per_year | https://doi.org/10.1016/s0140-6736(26)00200-x | verified | Abstract (via repository copies; Lancet page 403): "144 000 deaths (131 000–162 000), and 11·7 million (10·7–13·2) DALYs". Deaths fell 27.0% since 1990; LMICs 94% of DALYs (so high-income about 6%), as used in the check row. |
| nc_scd_deaths_per_year | https://doi.org/10.1016/s2352-3026(23)00118-7 | verified | Abstract: total mortality 376,000 (303,000–467,000), cause-specific 34,400. |
| nc_flu_dalys_per_year | https://doi.org/10.21037/jtd-2025-aw-2363 | verified | Abstract: 27,615 deaths, 2,460,833 (1,796,287–3,280,725) DALYs, under-fives, 2021. |
| ca_field_research_funding (anchor) | https://blog.stbaldricks.org/?p=36179 | verified | NCI "more than $600 million" on childhood cancer in FY2023 ($643.9M in FY2025). |
| ca_p_success, ca_burden_fall_per_year (anchor) | https://www.cancer.gov/types/childhood-cancers/child-adolescent-cancers-fact-sheet | verified | Mortality under 20 "declined by more than 50% from 1975 to 2022", 5.1 → 2.2 per 100,000 (1.8% a year). |
| field_dalys_per_dollar (anchor) | https://doi.org/10.1186/1741-7015-12-99 | verified (partly) | £15bn 1970–2009 (2011/12 prices), 17% attributable, 15-year lag, IRR about 10%: confirmed from abstract copies (the publisher redirects to a login). The 5.9M QALYs figure was not reachable; take it from the PMC copy (PMC4058434). |
| ca_years_until_effect (anchor) | https://doi.org/10.1258/jrsm.2011.110180 | verified | The title's 17-year lag. |
| marginal_vs_past_average | facts/next_dollar.json `st_jude` | dated FY2024 | See finding 5. |

## Drivers
Top inputs (tornado):
1. `$missing_data_discount`: shared slider, ×10 swing.
2. `@next_dollar.st_jude`: shared per-charity estimate, 0.21 (0.1–0.5), sourced to the reserves.
3. `ca_share_burden_addressable`: judgment, 2% (0.8–6%). Anchor: one advance's survival gain × the adopting countries' share of the burden.
4. `$discount_rate`: shared.
5. `ca_p_success`: judgment, 25% (8–60%), calibrated jointly with `ca_years_brought_forward` (judgment, 5) against two check rows. The share of the burden a year's advances remove (0.5%) sits between the high-income frontier alone (0.1% of the world's burden) and half the observed worldwide fall (0.3–0.7%). The field's result per dollar (4.7e-5, discounted) is in line with the UK return (about 5–6e-5).

All the model's own drivers are judgments with named reference classes, which is the right form for research with no outcome measure of its own. The best improvement would be a traced-impact source: a count of protocols and drugs from St. Jude trials adopted as standard care (for example COG and SIOP protocol lineages, or FDA paediatric approvals citing St. Jude trials). That would replace the jointly calibrated three-judgment split with St. Jude's own record.

Peers (audit only, never site text): the result is 0.019× the global-health median (lint far-below). The rows behind the gap are research's structure, not an error:
- St. Jude's share of each field (about 20% and 7%);
- a 12-year lag discounted at the shared rate (×0.62);
- credit for only 3–5 years brought forward;
- the missing-data discount (×0.5);
- the next-dollar figure (×0.21);
- overhead ×1.74 (with ALSAC's public education as fundraising).

It sits among the medical-research family's other models (Cancer Research UK 0.0015, American Cancer Society 0.0060, British Heart Foundation 0.010), so no row is out of line with its family.
