# Audit: american-red-cross-charityevals-measles, round 2
Result: 1.450e-3 uov/$ = 0.7251 years of healthy life per 1,000 dollars (combined range 0.090–5.87); cause median 0.0938 (×7.7). Verdict: fix needed.
Model-sha: 1868092481719cdde24ad6a4ad2a4468fbb9c85b7783fae7ea257ecb26d79bc2
Scope: unchanged since round 1. It covers the Measles & Rubella Partnership household visits in FY2025 (year to 30 June 2025). The cost is International $48,839k × `@american_red_cross.msl_spend_share` 0.08 = $3.907m. The reach is 3 million households. charities/american-red-cross.json `lines.measles` ($3,907,120) and `spending.programme` ($769,848k) still match the accounts. No programme is missing from this line.
Mechanical: lint 0 high / 0 medium / 1 low (the spread, which the summary states). Invariants: none. normalization-audit: none for this model (generated/ restored). check.ts: all valid. Simulation stable: 5% 0.21×, 50% 1×, 95% 4.95× the best guess (generated/ restored).
Previous round:
- #1 herd immunity: resolved. `herd_immunity_share` reads `@givewell_common.herd_immunity` and is in `unmodelled_benefits_adj`'s sum. `other_unmodelled_share` has been re-estimated without it (0.17 → 0.02).
- #2 older children: resolved. There is a 5–14 branch (`msl_wide_age_campaign_share`, `msl_5_14_per_household`, `msl_5_14_risk_ratio` from the GBD Bauchi facts, `msl_5_14_years_at_risk`). `share_under5` is now outcome-weighted, and the write-up bullet is gone. New finding #3 is about one input of the branch.
- #3 indirect deaths: the structure is resolved, but the value is not. The row is now a ranged effect with a cross-check, and the lump no longer holds it. However, it is our own 0.3 where the site has a shared figure (new #1). Round 1's fix should have named that figure.
- #4 years unvaccinated: resolved. The value is 3 (2–5), with the catch-up reasoning that round 1 named as the fallback.
- #5 VE intervals: resolved (`interval` 0.5 on all three rows).
- #6 credit basis: resolved. `msl_extra_children_vaccinated` includes `implementation_adj`. Both the cost per extra child and the volunteer term divide by it.
- #7 volunteer day value: mostly resolved. The four minimum wages are cited, but the conversions are typed rather than read from `@fx` (new #6, low).
- #8 death share 87%: resolved. It is reworded as our judgment.
- #9 write-up list: resolved. "Older children" is deleted. Rubella is counted at 3% in the lump, and the bullet says what is averted.

**The move from 0.3585 to 0.7251 (×2.02) checks out.** Every factor comes from a round-1 fix (both models evaluated in a scratch run):

| Change | Rows | Factor |
|---|---|---|
| Fewer unvaccinated cohorts (4 → 3), so a higher death rate | `msl_years_unvaccinated` → `baseline_mortality_rate` 0.000989 → 0.001319 | ×1.333 |
| Deaths after measles | `indirect_deaths_ratio` 0 → 0.3 | ×1.300 |
| Older children | `msl_5_14_deaths_per_u5_child` (8.7% of deaths) | ×1.095 |
| Credit per child actually vaccinated, older children and a $3 volunteer day | `attribution_share_shared` 0.744 → 0.795 | ×1.070 |
| Age mix of the value of a death | `value_per_death` 116.25 → 117.79 | ×1.013 |
| Lump re-estimated, herd immunity added | `unmodelled_benefits_adj` 0.42 → 0.395 | ×0.982 |
| Product | | ×2.02 |

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | high | normalization | `indirect_deaths_ratio` | The deaths after measles are our own judgment (0.3, 0–1), but the site already has a shared figure for this concept. `@givewell.mortalities_indirectly_attributable_to_vaccine_preventable_d` = 0.75 ("Mortalities indirectly attributable to vaccine-preventable disease per mortality directly caused by vaccine-preventable disease"). new-incentives reads it for both its under-five and its 5–14 branches (Main CEA!H45, H55). doctors-without-borders-charityevals reads it as "the site's one figure" for measles. One consistent way: an own judgment of a question that has a shared figure is a replacement. The row is the 7th driver (0.56–1.12). | facts/givewell.json `mortalities_indirectly_attributable_to_vaccine_preventable_d` 0.75. models/global-health/new-incentives.json rows `mortalities_indirectly_attributable_to_vaccine_preventable_d(_2)`. models/global-health/doctors-without-borders-charityevals.json `measles_indirect_deaths_ratio`. | Set `indirect_deaths_ratio` to formula `@givewell.mortalities_indirectly_attributable_to_vaccine_preventable_d` and drop its `value` and `kind`. Keep Mina et al. 2015 in the explainer as the mechanism, with GiveWell's figure as the number. Applying it to both branches is right, as in New Incentives. Rewrite the cross-check at the new figure: 0.001319 × 0.8 × 1.75 ≈ 1.8 measles-related deaths per 1,000 unvaccinated child-years at the protected ages. Then update the write-up's measles share of the gift (see #2). | +34.6% (0.7251 → 0.976) |
| 2 | medium | presentation | write-up, Summary | "Weighted by the spending donations pay for, a gift to the Red Cross comes to about 0.012 … about a third from the relief abroad and nearly a third from the small measles programme" is typed. It is not a live figure, and it moves with this model. Today it is right: (721.0 × 0.005 + 3.907 × 0.725 + 44.93 × 0.069) / 769.8 ≈ 0.0124, with measles at 30%. After #1 it becomes about 0.0137, with measles at 36%. Write-ups have only `data-figure="headline"`, so the combined figure can't be made live. | writeups/american-red-cross-charityevals.md line 3. | Delete that sentence (less text; the charity page already shows the spending-weighted figure). If the shares must stay, keep only "most of a gift's value comes from the work abroad" with no numbers. | none |
| 3 | medium | units | `msl_5_14_per_household` | The best guess of 1.3 is derived in the explainer from "DHS household sizes of 4.2–4.6". Those are exactly the shared `@household_size.kenya_rural` (4.2), `malawi_rural` (4.3), `nigeria` (4.5) and `mozambique_rural` (4.6), retyped. The checklist says household size reads `@household_size.<place>`, not a typed figure. | facts/household_size.json. Row explainer. | Add `msl_5_14_share_of_household`, a judgment of 0.29 (0.22–0.35) anchored on the DHS household age tables of Kenya 2022 and Nigeria 2018. Set `msl_5_14_per_household = (@household_size.kenya_rural + @household_size.malawi_rural + @household_size.nigeria + @household_size.mozambique_rural) / 4 * msl_5_14_share_of_household`. Keep the explainer's point that targeted households have about as many. | −0.2% (1.3 → 1.28) |
| 4 | low | missing-adjustment | `herd_immunity_share`, `unmodelled_benefits_adj` | Every GiveWell vaccine sheet that carries herd immunity (+12.5%) also carries "lower likelihood of infecting others" (+6%, `@givewell_common.lower_likelihood_of_infecting_others`, the same sheet, Main CEA!H219) as a separate item beside it. new-incentives sums both. Suvita and Notify carry only the +6%. This model reads only the herd figure. | facts/givewell_common.json rows `lower_likelihood_of_infecting_others` and `herd_immunity`. models/global-health/new-incentives.json `total_supplemental_intervention_level_adjustment`. | Add `infecting_others_share` (adjustments) = `@givewell_common.lower_likelihood_of_infecting_others` and add it to `unmodelled_benefits_adj`'s sum. The sum row is the one tagged `side_effect`, so the new row needs no tag of its own. | +4.1% (0.7251 → 0.755) |
| 5 | low | sensitivity | `msl_5_14_years_at_risk` | The explainer shortens the protection "where the next campaign three to four years on would reach the child anyway". Its sibling `msl_wide_age_campaign_share` says follow-up campaigns cover only 9–59 months, so a 5–14 child is not reached again. The average child of 9.5 has 5.5 years to fifteen, so the best guess of 4 sits below that reasoning. | Row explainers. | Set the best to 5 (3–5.5), with the explainer "about 9.5 on average, so 5.5 years to fifteen, less late routine doses for the youngest". Delete the next-campaign clause. | +2.2% |
| 6 | low | units | `msl_volunteer_day_value` | The explainer converts the wages with typed rates. `@fx.usd_per_kes_2024` and `@fx.usd_per_ngn_2024` exist: KES 15,202 → $112.8 a month, $4.3 a day; ₦70,000 → $47.3, $1.8 a day. It also says "about $3 a day, net of stipends", but $3 is the gross average of the four wages (4.5, 1.7, 2, 3.8). | facts/fx.json. Row explainer. Kenya's order was raised 6% (to KES 16,114) from 1 November 2024. | Reword: "about $3 a day at 2024 exchange rates (@fx for KES and NGN); stipends the grants pay, already the Red Cross's cost, lower the unpaid value, from 0 to 5". Keep 3 (0–5). | none |

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `indirect_deaths_ratio` | doi 10.1126/science.aaa3662 (via ScienceDaily and Princeton news, 7 May 2015) | verified (citation) | Mina et al. 2015, Science 348(6235):694: a lag of about 28 months between measles and non-measles infectious deaths in US, UK and Danish data. The 0.3 is not in the source (our judgment), which is superseded by #1. |
| `msl_5_14_risk_ratio` | facts/givewell_common.json (GBD 2021 Bauchi, GiveWell NI sheet) | verified (shared) | 0.5 × 0.000258566 / 0.001684193 = 0.0768. Under five's probability is over 5 years and 5–14's over 10, so 0.5 is right. |
| `msl_wide_age_campaign_share` | doi 10.1371/journal.pone.0199786 | verified in round 1 | "19 million children aged 9 months–14 years". |
| `msl_volunteer_day_value` (Mozambique) | tradingeconomics.com/mozambique/minimum-wages | verified | MZN 6,338 a month in 2024. |
| `msl_volunteer_day_value` (Kenya, Nigeria, Malawi) | not fetched | not checked | The figures match the 2022 Kenyan order, Nigeria's 2024 Act and Malawi's February 2024 rate (MWK 90,000 / 26). The row is 13th or lower in the tornado and a judgment. |
| top-5 inputs (`msl_report_to_behaviour`, `msl_spend_share`, `msl_setting_risk`, `msl_households_visited`, financials) | as in round 1 | verified in round 1, rows unchanged | not refetched |

## Drivers
1. `$missing_data_discount` (shared slider, 0.15–1.45). Being marked thin is right.
2. `msl_report_to_behaviour` (judgment 0.12, 0.04–0.38; 0.25–1.99). It is anchored on Benin's refusal conversions and the coverage cross-checks.
3. `@american_red_cross.msl_spend_share` (estimate 0.08, 0.03–0.15). It comes from Form 990 Schedule F.
4. `msl_setting_risk` (judgment 1.4, 0.8–2.5). It comes from MMWR 73(45) Table 2.
5. `msl_years_unvaccinated` (judgment 3, 2–5). It now has catch-up reasoning, but still no survey anchor.
Then `daly_per_child_death` (shared) and `indirect_deaths_ratio` (a shared point once #1 is applied).

**Peers.** Today the result is ×7.7 the global-health median. After #1 (0.976) it is about ×10.4, and audit-model will then print `far-above`. The rows behind that are a low cost per child reached ($1.43 a household with overhead) and the measles death rate where the visits happen. With #1 the chain is the same as GiveWell's vaccine models (GiveWell's indirect-death figure and herd adjustment). The steep discounts stay: 3% of children counted as extra, missing data at 50%, 80% credit. The evidence supports the gap. The next round should note it in the audit and never in the summary or write-up.

What would most improve the model:
- the partnership's FY2025 campaign list with target age bands, which would settle `msl_wide_age_campaign_share` and `msl_setting_risk`;
- a coverage comparison between visited and unvisited households, which would replace the discounted self-report in `counterfactual_adj`.

Verdict: fix needed (1 high: #1).
