# Audit: lead-exposure-elimination-project-charityevals, round 7
Result: 0.01084 uov/$ = 5.419 years of healthy life per 1,000 dollars (combined range 0.19–68.8 on the model's own ranges); cause median 0.1196 (×45.3). Verdict: fix needed (one medium, a wording fix in the write-up).
Model-sha: 57a4bef046f163fda1ef72892c28e0116bb697cb99cc1e555e7cb89601aac19c
Rules: 0.1.0
Scope: a scoped verification of the changes since round 6 only (the four typed figures moved to shared facts; the age-structure scaling of adults' lead deaths and its write-up text). Programmes and year modelled are unchanged from round 6.
Preflight: passes (no blocking line). One medium peer-mention line on the write-up (finding 1); two low "generated" lines (stale generated/distributions.json and usage.json, the builder's to refresh with `npx tsx scripts/summaries.ts`).
Previous round: round 6 had no high or medium; nothing to resolve.

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | write-up, "How this model was checked" | The new sentence says adults' deaths were scaled "as the site's other lead models do". Site text never compares with other models or charities (lint `peer-mention`). | Write-up: "...scaled to the protected countries' age structure, as the site's other lead models do: their populations are much younger than the world's...". Preflight output flags the same phrase. | Delete the clause "as the site's other lead models do"; keep the reason ("In November 2026 adults' lead deaths were scaled to the protected countries' age structure: their populations are much younger than the world's, ..."). | 0 |
| 2 | low | presentation | generated files | generated/distributions.json and generated/usage.json are out of date (preflight lows). | Preflight output. | Run `npx tsx scripts/summaries.ts`. | 0 |

Checked and fine:
- **New rows' source figures.** I fetched OWID's "Population by broad age group" CSV (UN WPP 2024) and read 2023, 65+: all 14 countries match the row's `source.page` and total exactly (Madagascar 1,040,394; Sierra Leone 271,295; Liberia 180,041; Burundi 343,641; Niger 672,581; Peru 3,041,088; Nigeria 6,900,487; Pakistan 10,385,763; Malawi 546,872; Zimbabwe 591,139; Ghana 1,227,069; Colombia 4,903,516; Senegal 649,053; South Africa 4,112,801; sum 34,865,740). The world's 65+ in 2023 is 808,366,312, matching `@lead.older_adults_2023_world`. Malawi's 546,872 in facts/malawi.json matches. Unit, year and variant are as stated; `retrieved` is dated.
- **The 14 countries are the counted wins.** They are the same 14 as the `beneficiaries` keys; `births_protected` sums all 14 births rows (13 typed plus `@malawi.births_2023`), 22,390,270.
- **Formula, applied once.** age_structure_adj = (34,865,740 / 22,390,270) / (808,366,312 / 132,110,264) = 1.5571 / 6.1188 = 0.2545, as stated. `age_structure_adj` appears in exactly one downstream formula, `adult_deaths_value_per_birth`; `lead_deaths_2023`, `world_births_2023` and the other terms are unchanged, so the scaling is not applied twice. Its direction is right (young countries, fewer deaths per birth). Adults' blood lead is left at the world's, as the explainer says; no second proxy for it.
- **Moved figures keep their values.** `@malawi.births_2023` 662,289 (was typed 662,289); `@lead.deaths_2023_world` 3,500,000; `@lead.births_2023_world` 132,110,264; `@lead.years_exposure_to_working_age` 14 / 17 / 20, kind judgment, as the typed row had. The shared facts carry the same sources and quotes as the rows they replace. The one dropped `drawn_with: births_mdg` on the Malawi row goes with the typed range it never had; no effect.
- **Result.** audit-model gives 5.419 years per $1,000, the figure the change note states (from 6.841 before the scaling, a fall of 21%, in line with the 0.2545 factor acting on one side-effect term). The write-up uses `{{result}}`, so it stays live; its figures (about a quarter, 3.5 million deaths, 17 years) match the rows.
- **Write-up text otherwise.** The side-effect bullet and the new checked-sentence are accurate. The rewritten `adult_deaths_value_per_birth` explainer no longer calls the world ratio conservative; consistent with the new row.
- **Gap to the cause median** (audit-model's far-above, ×45.3): this change lowered the result; the row behind the gap was not part of it and earlier rounds accepted it. Not re-opened here.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| older_adults_protected | https://ourworldindata.org/grapher/population-young-working-elderly | verified | All 14 countries' 65+ in 2023 and the sum match; CSV read. |
| @lead.older_adults_2023_world | https://ourworldindata.org/grapher/population-young-working-elderly | verified | World 2023: 808,366,312. |
| @malawi.older_adults_2023 | https://ourworldindata.org/grapher/population-young-working-elderly | verified | Malawi 2023: 546,872. |
| moved figures (births, deaths, years to working age) | as before | verified as unchanged | Values equal the typed rows' values; no new source claim. |

## Drivers
Unchanged by this round: discount_rate, mobiliser_share, win_years_counted (all site judgments), paint_share (a judgment, 4% to 40%), missing_data_discount. The new factor is sourced (UN WPP) and moves the side-effect term only. Most improving the model: a sourced paint share of children's blood lead in these countries.

Fix the one medium (delete the clause) and this round passes; no re-audit needed for a pure wording deletion.
