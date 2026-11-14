# Audit: mercy-corps-charityevals, round 2

Result: 1.677e-4 daly/$ = 0.168 years of healthy life per $1,000 (combined range 0.032–0.875); global-health median 0.207 (×0.81). Verdict: pass (0 high, 1 medium, 2 low).
Model-sha: 0429ee35b6eb98ed4a7f612282e5c9da1a8b39bab2a5c25f81e7c3340f5b4875

Scope: unchanged from round 1 (all five programme lines of the FY2025 consolidated statement of activities, $508.7M of programme services). The health line is now a water branch and a nutrition branch of the same $42.9M, so the five lines still become seven branches with no gap and no overlap (`wash_spend` = `health_expenses` × `hlt_water_share`, `hlt_spend` = `health_expenses` × (1 − `hlt_water_share`)). Branch shares of the result at the defaults: livelihoods 50%, relief 35%, recovery 6%, education 2%, peace 1.5%, water 2.4%, nutrition 2.3%.

Mechanical: lint 0 high / 0 medium / 0 low in audit-model (one LOW spread note: own ranges span 1358×, the summary says the result is mostly uncertainty). Invariants: none violated. `check.ts`: all models valid. normalization-audit: not re-run; this pass changed no shared figure or rule and added no row that reads a shared version differently from round 1. simulation-check: not re-run (inputs added are bounded judgments).

Previous round: 12 findings.
- 1 (reach overlap) resolved: `liv_reach_line_share` and `peace_reach_line_share` (0.75, 0.5–0.95), anchored on the 56M against 36M and the 38% multi-outcome share, multiply the reach in `liv_uov` and `peace_uov`.
- 2 (relief reach text, `years_exposed`) resolved: the explainer cites the 37.6M, the 19M and 10M counts and Schedule F; `years_exposed` = `relief_cost_per_person` / `relief_cost_per_person_year` ($170, 60–500), so a lower cost per person now means shorter cover. The result is unchanged at the defaults (0.147 years).
- 3 (health scope) resolved: split by `hlt_water_share` (0.4, 0.2–0.6) into a water branch on World Vision's chain (diarrhoea deaths through the `@death_ages.diarrhoea_ssa_*` mix and `$life_value_multiplier`, `@givewell_shared` indirect deaths, $80 a person) and the nutrition branch; both carry `$missing_data_discount`.
- 4 (income mortality) resolved: one row `income_mortality_uov_ratio` (0.2, 0–0.5) × `$life_value_multiplier` multiplies `rec_uov` and `liv_uov`, as cash-income's step. Using one row for both branches is consistent with "one concept". The World Vision and Save the Children livelihood branches are still without it; that is a gap in those models, not this one, and worth the same fix in a pass over them (about +10% each).
- 5 (unvalued list) resolved: `ue_empowerment_share` +1%, `ue_research_influence_share` +0.5%, `ue_ventures_share` 0 (0–1%) added, tagged `side_effect`, summed in `unmodelled_benefits_adj` (now 2.5%); `liv_years` high 6; the write-up's list is gone.
- 6 (Schedule F grants) resolved: region rows now include grantmaking and the numbers match the 990 (SSA 98,854,423 + 45,860,947; Asia 8,069,001 + 6,687,066 + 4,073,636 + 7,110,315; MENA 32,976,502 + 9,075,653; Eurasia 28,393,093 + 2,925,485; LAC 7,693,582 + 16,017,202 + 411,097 + 10,215,561). `beneficiaries` and the OURS note match (52 / 15 / 11 / 12 / 9%; per-country shares recomputed and sum to 1).
- 7 (page 25), 8 (8% of revenue), 9 (drivers text) resolved.
- 10 (principal) resolved: `rec_principal_recovered` 0.3 (0–0.6) and its term, discounted over the return years.
- 11 (household members) partly resolved, see finding 1 below.
- 12 (peace_people, Haiti) resolved: best stays 8M with the reason (same source as the other counts, 14M as the top); `cons_lac` explainer states why Haiti is a small part.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | normalization | `liv_household_gain_multiplier`, `liv_people` explainer | The household-sharing factor for direct livelihood participants is a typed judgment (1.5, 1–3) although the site has the shared figure the sibling models read: World Vision's livelihood branch uses `avg(@household_size.kenya_rural, uganda_rural, malawi_rural)` and Save the Children's `avg(@household_size.malawi_rural, nigeria, drc, bangladesh_rural)`. The explainer itself says the count is of participants and cites 4.5 for Nigeria, but the row doesn't read it, so this model credits each direct participant's gain to 1.5 people where the other two credit it to the household (about 4.5–6). The explainer's "counts participants (p. 22)" also rests on p. 22's table, which gives participant reach for Mercy Corps Europe's own programmes (economic opportunity 9.7M); the 19M on p. 25 is a different, wider count ("interventions reached"), so whether it is participants only is not shown. | `scripts` evaluation at the defaults: multiplier 1 → 0.146, 1.5 → 0.168, 3 → 0.234, 4.5 → 0.300 per $1,000. MCE p. 22 (participant reach 9.7M economic opportunity) vs p. 25 (19M). World Vision and Save the Children formulas above. | Replace the typed range by shared figures: `liv_household_gain_multiplier` = `liv_participants_only_share` × `avg(@household_size.<the region's surveys, e.g. nigeria, kenya_rural, uganda_rural, malawi_rural, drc>)`  + (1 − `liv_participants_only_share`) × 1, with `liv_participants_only_share` a judgment (best 0.5, 0.2–0.8, anchored on p. 22 saying "participant reach" and on p. 25's 19M being the wider count, 2× the Europe-only figure). At the defaults the multiplier becomes about 3, +40% on the result (0.168 → about 0.234); alternatively keep the judgment and state in the explainer why it sits well under the household size. Reword "counts participants (p. 22)" to say that p. 22 defines the Europe-funded KPI as participant reach and the 19M is assumed on the same basis. | about +40% if the shared figure is read at a 50% participants-only share; the range already allows it |
| 2 | low | source | `relief_cost_per_person` explainer | "the World Vision partnership's relief and rehabilitation cost $30 a person reached (its 2025 report)" is carried from round 1 unchanged and is not checked against a cited page (the World Vision model gives the same $30 as its own judgment, "the partnership's $30 a person"). | World Vision model summary: "at the partnership's $30 a person". | Cite the report and page in the explainer, or say "as World Vision's model". | none |
| 3 | low | presentation | write-up | The write-up now ends with a "Round 1" bullet listing what the audit changed and the result before and after. That is a log of the build process, not a description of the estimate, and it will be stale after the next change. | writeups/mercy-corps-charityevals.md, last bullet. | Delete the bullet (the batch log keeps the history). | none |

## Sources checked

| Row | URL | Status | Note |
|---|---|---|---|
| sf_ssa, sf_asia, sf_mena, sf_eurasia, sf_lac (grantmaking lines) | prosperglobal.org …/irs-990-fy25.pdf | verified | Schedule F continuation, PDF p. 40: 45,860,947 / 4,073,636 / 7,110,315 / 9,075,653 / 2,925,485 / 411,097 / 10,215,561; programme services lines as in round 1 |
| peace_people (8M; 14M top) | MCE FY25 pp. 27–28; 990 Part III line 4c | verified | as round 1 |
| hlt_water_share anchor (8M water, 17M food security; "Health – water and food security") | 990 Schedule O | verified | as round 1 |
| relief explainer: 37.6M, 19M, 10M, $34.1M cash grants | 990 Part III 4b; MCE pp. 24, 29; Schedule F Part III | verified | as round 1 |
| liv_reach_line_share anchor: 38% multi-outcome, 56M vs 36M | MCE pp. 22, 24–29, 14 | verified | arithmetic 19 + 19 + 8 + 10 = 56 |
| liv_people "counts participants (p. 22)" | MCE p. 22 | partly | p. 22 lists "participant reach" for Mercy Corps Europe's programmes only (9.7M, 6M, 5.2M, 2M), not the 19M (finding 1) |
| ue_ventures_share ($7.6M programme-related investments, p. 6) | audited statements | verified | statement of financial position: program-related investments, net 7,567 ($ thousands) |
| leverage_funging_adj (8%) | statement of activities | verified | (44.7 + 3.3) / 601.5 = 8.0% |
| liv_household_gain_multiplier (Nigeria 4.5) | facts/household_size.json | verified | 4.5, NG2024 DHS |
| relief_cost_per_person ($14 a person across all work) | MCE p. 14 | verified | 509M / 36M = $14 |
| World Vision partnership $30 a person | World Vision 2025 report | unverified | not fetched; finding 2 |

## Drivers

1. `$missing_data_discount` (shared slider): every branch is thin, so it scales the whole result.
2. `$uov_per_daly`, `$uov_per_ln_consumption` (shared).
3. `liv_direct_gain` (judgment, 3%, 0.5–8%), `liv_years` (judgment, 2, 1–6), `liv_direct_share` (judgment, 20%).
4. `liv_household_gain_multiplier` (judgment, 1.5, 1–3): finding 1.
5. `liv_evidence_adj`, `liv_reach_line_share`, `implementation_adj`.

The mortality ratio, the reach shares and the water and nutrition split each move the result by under 10% across their ranges. What would most improve the model: Mercy Corps' OOM definition of participant reach and its household-member rule, which would settle finding 1, and any controlled evaluation of a market-systems programme.
