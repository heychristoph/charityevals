# Audit: rainforest-foundation-us-charityevals, round 2
Result: 1.407e-5 daly/$ = 0.0141 years of healthy life per 1,000 dollars (combined range 0.0026–0.077); climate cause median 0.00174 (×8.1). Verdict: pass.
Model-sha: 36e79b07d9a7f60f17c7e65f5ebbe67cecb0bc3d0e2a4868e1b69e140bddac41
Scope: all of RFUS's 2025 programme spending, $9,291,415 ($11,254,243 with management and fundraising), from the audited combined statements of 2025 (p. 4), the latest audited year. The model has four branches:
- Peru's territories: 56% of the result.
- The other territories: 12%.
- Titles: 7%.
- The patrollers' pay: 25%.

Across the forest branches, pandemic risk is 60% of the result and carbon about 15%. The 2024 Form 990, Part III, splits the programmes into land rights $1,287,905, rainforest protection $1,751,791 and strengthening Indigenous organisations $4,841,866. Schedule F of that return also shows $549,616 spent in East Asia and the Pacific and $549,616 in Sub-Saharan Africa. That is about 14% of programme spending, on the Global Alliance of Territorial Communities (GATC). It has no branch (finding 1). charities/rainforest-foundation-us.json `spending` and its one line ($9,291,415, 2025) match the accounts.
Mechanical: lint 0 high / 0 medium / 1 low (spread 2,033× on the model's own ranges; the summary says so). Invariants: none. normalization-audit: no violations; generated/ restored afterwards. check.ts: all valid. simulation-check: stable (5% 0.34×, 50% 1.0×, 95% 3.6× the best guess).
Previous round:
- 1 (high, Peru thin): resolved. `terpe_*` and `tero_*` are separate branches. Peru's missing-data step is 1 and its explainer names the count and the trial. The others keep the discount. The loss-weighted counterfactual is 0.18 (0.30 for Peru on 33% of the at-risk loss, 0.12 elsewhere), close to the earlier 0.2. The summary and write-up are updated.
- 2 (medium, averages cut): resolved for the territories. Peru's evidence row is 0.85 and the others' 0.75 = 0.85 × 0.9, with no averages factor. The same reasoning survives in two other explainers (findings 5 and 6, low).
- 3 (medium, attribution): resolved. Each branch now has its own row. The other territories' row is built from the report's APA and SRDC figures, which are verified, and cites its URL. The arithmetic mixes a decade's average with this year's budgets (finding 3, low). Peru's 75% names its resources but isn't built from them (finding 4, low).
- 4 (stipend in 2025 prices): resolved (`liv_stipend_2025`, `@cpi.usa_2025 / @cpi.usa_2019`).
- 5 (copied labels): resolved. The `salary_gap` explainer now describes RFUS's staff in New York and RFUS Peru's team (the 990's phone number is a 212 number).
- 6 (overhead note): resolved ("note 2, p. 12"; the allocation by "employee time and effort" is verified).
- 7 (titles' basis): resolved (the sentence is in `land_years_protected`).
- 8 (Panama 2024 acres): resolved.
- 9 (write-up placeholder): resolved.

Branch shares at the defaults come from scratch copies with each branch's credit set to 0:

| Branch | Years per $1,000 | Share |
|---|---|---|
| Peru's territories | 0.00793 | 56% |
| Other territories | 0.00163 | 12% |
| Titles | 0.00104 | 7% |
| Pay | 0.00346 | 25% |
| Pandemic risk, across the forest branches | 0.00850 | 60% |

These match the summary ("three fifths … a quarter … Peru's territories are over half") and the write-up. The beneficiaries also check: pay is 24.6% of the result, Peru's patrollers are 291/400 of it (0.179), and Guyana's are 11.7/16.8 of the other 109 (0.047).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | scope | `program_expenses`, `tero_unmodelled_benefits_adj` | About 14% of programme spending goes to RFUS's global work: the GATC grants and support outside the four countries, and the GATC/FCLP and TFFF advocacy. Its cost is in `cost_total`, but it has no branch. Its value is only a share of the +5% unmodelled share on the other-territories branch, about 0.6% of the result. The `program_expenses` explainer says "every programme is a branch". The global work sits inside "strengthening Indigenous organizations" and has no chain to the common scale. | 2024 Form 990 Schedule F, Part I: region totals of Central America $1,138,574, South America $3,001,844, East Asia and Pacific $549,616 and Sub-Saharan Africa $549,616. Part II lists grants of $158,867 to Sub-Saharan Africa and $14,400 to East Asia. Part III: "RFUS supported the Global Alliance of Territorial Communities (GATC)…". Audited 2025 statements, note 9 (p. 16): the largest purpose-restricted balance is "Global Alliance of Territorial Communities $1,370,233", so the work continued in 2025. | Add a thin branch `glob_` on the conservation chain. Reach: the forest of the GATC member organisations RFUS funded outside the four countries. Use GATC's own territory figures for the funded members, or the hectares in the grantees' reports. Then the regional loss rate × `permanence_share` × a judged counterfactual anchored on `tero_counterfactual_adj` (organisational support, no patrols) × an attribution share of RFUS's grants against GATC's budget × `$missing_data_discount`. If no reach is published, take the TFFF Indigenous earmark (20%) through the won-reform recipe with a small judged attribution. Rewrite the `program_expenses` explainer to name the branch. | up to about +16% if it is as cost-effective per dollar as the rest; likely +2% to +8% on the thin chain |
| 2 | medium | plausibility | `terpe_counterfactual_adj`, `tero_counterfactual_adj` | Peru's 30% is anchored on the trial's two-year 37%, shaded for 1.7× the area per monitor. Peru's programme has run since the 2018-19 trial, and most of its communities are past their first year. The trial's later-year effect is about 21%: control loss of 16.2 ha in year 1 (8.4 ha was 52%), and a two-year 37% on 11.7 ha implies about 15.5 ha of control loss in year 2, cut by 3.3 ha. The authors call this "substantially attenuated". The right anchor weights first-year communities at 52% and continuing ones at about 21%. Roughly a fifth of communities are new: the 990 gives 129 communities in 2024 and the report "more than 160" in 2025. That gives about 28% before the density shading and about 23% after it. The other territories' "a third of the trial's effect" inherits the same anchor. | Slough et al. 2021: "In the second year, the effects of monitoring were substantially attenuated: Tree cover loss decreased only 3.3 ha"; the 52% and 37% figures. 2024 Form 990, Part III (307 patrollers, 129 communities); 2025 report ("over 400 … across more than 160 communities"). | Set `terpe_counterfactual_adj` to 0.23 (0.08–0.45). In the explainer, state the year-1 and later-year effects (52%, about 21%), the new-community share (about 20%, 129 → 160+) and the density shading. Set `tero_counterfactual_adj` to a third of the same anchor, 0.08 (0.02–0.25). | −13% (0.23 alone: about 0.0123); −11% with 0.25 and 0.10 (0.0125; scratch copy) |
| 3 | low | source | `tero_attribution_share` | The built share sets RFUS's decade average ($7M / 10 = $0.7M a year) against APA's and SRDC's current budgets ($1.7M + $1.1M). APA's budget grew from $153,000 over the same decade, so the decade's total budgets are far below 10 × $2.8M, and "a quarter" understates RFUS's share of the resources. The report's "facilitated approximately $7 million in combined direct and intermediated funding" also doesn't say whether the intermediated money passed through RFUS's books (then it is RFUS's cost) or went to the partners directly (then it is theirs). | 2025 annual report, Guyana: "its annual budget has increased from $153,000 to $1.7 million"; "It now has a $1.1 million annual budget"; "approximately $7 million in combined direct and intermediated funding". | Rebuild with like for like. RFUS's $7M against the two partners' summed budgets over the decade: APA's rises about linearly from $0.15M to $1.7M, about $9M, plus SRDC's, which you should source or bound. That gives roughly 40–55% for Guyana's partners. Say which way the intermediated money flowed. Keep 40% only if the rebuilt figure supports it, and widen the range to 0.25–0.75. | about +3% at 0.5 (0.0145; scratch copy) |
| 4 | low | structure (Convention 2) | `terpe_attribution_share` | The 75% names the other resources (ORPIO and its federations, the community assemblies' unpaid time, Peru's Geobosques alerts) but doesn't count them. The row carries 56% of the result, and 0.5–0.95 moves it −20% to +15%. | Row explainer; Convention 2 (volunteers' hours at the local wage; partners' and government delivery at cost). | Build a rough count. RFUS's resources: the monitors' paid days (291 × `liv_patrol_days` × `liv_stipend_2025`, about $175k) plus its Peru staff, equipment and training. Others' resources: the communities' unpaid assembly and patrol days at the same daily wage, ORPIO's coordination budget if published, and Geobosques at a small share. Give the resulting share with its range. | likely within ±10% |
| 5 | low | presentation | `land_evidence_adj` | The explainer still ends with "the loss rate is a regional figure" and "0.7 (0.4-1), as for the territories". The territories are now 0.85 and 0.75, and round 1 dropped the averages factor from the evidence rows (best guesses, spread in the ranges). The studies' quasi-experimental design and BenYishay's null are real validity questions, so 0.7 can stand on them alone. | Row explainer; round 1, finding 2. | Delete both clauses. If 0.7 included a cut for the regional loss rate, raise it to about 0.75. | none to +1% |
| 6 | low | presentation | `tco2_per_ha_lost` | The explainer ends "Inside evidence_adj.", but the evidence rows no longer cut for the averages. | Row explainers of `tco2_per_ha_lost` and `terpe_evidence_adj` ("their spread in their own ranges"). | Replace "Inside evidence_adj." with "An average standing in as a best guess; its spread is the shared fact's range." | none |
| 7 | low | source | `ter_guy_loss_rate` | The Guyana Forestry Commission MRVS figure (0.057% in 2020) still has no URL. It was noted in round 1. | Row has no `source`. | Add the GFC MRVS report (Year 2020 or the latest) as the row's source, with its page and the 0.057% quote. | none |
| 8 | low | presentation | write-up | "What drives the result" leaves out the yearly pandemic probability, which is 4th in the tornado (0.0098–0.0226). | audit-model tornado. | Replace the first bullet with "how much of the pandemic risk from land use scales with forest loss, and how likely a COVID-scale pandemic is". | none |

Checked and found sound:
- Cost, overhead and the staff share (33%) match the accounts.
- Hectares: Peru 1.05M (about 3,600 per monitor); the rest 6.80M (about 62,000 for each of 109 patrollers); `ha_per_acre` is read from the shared fact.
- One year of protection for the territories; titles over `$win_years_counted`; every wait discounted at `$discount_rate`.
- The pandemic and carbon steps read the same shared facts as Cool Earth and The Nature Conservancy, and the bridge rows are untouched.
- Deaths are valued by age band × `$life_value_multiplier`; the pay branch's deaths go through `liv_mortality_share`.
- The side effects are tagged.
- Peru's missing-data step at 1 meets the glossary's test. The pay, titles and other territories stay thin, which is right.
- `unit_cost` basis, with no next-dollar factor.
- No double counting between counterfactual and permanence, or between the territories and titles (title-equivalent hectares are about 100,000 against 7.9M).
- Peer gap: 8.1× the climate median, under 10×. It is below Cool Earth (0.11), whose cash branch reaches 40,000 people against 1,480 here.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| `program_expenses`, `total_expenses`, `staff_costs` | rainforestfoundation.org/wp-content/uploads/RFUS-Audit-Financial-Statement-2025.pdf (text) | verified | Values unchanged since round 1 (pp. 4–5) |
| `overhead_ratio` explainer | same | verified | p. 12: "employee time and effort" |
| scope (finding 1) | same, note 9 p. 16 | verified | GATC $1,370,233; Brazil 309,464; Guyana 241,199; Peru 65,000; Panama 15,000 restricted |
| scope (finding 1) | 2024 Form 990 XML, Schedule F | verified | Region totals: Central America 1,138,574, South America 3,001,844, East Asia and Pacific 549,616, Sub-Saharan Africa 549,616 (total 5,239,650) |
| `ter_*_acres`, `liv_patrollers`, `land_titled_acres`, `land_strengthened_acres` | rainforestfoundation.org/about/financials-transparency/2025-annual-report/ | verified | 11.7M Guyana, 4M Brazil, 1.1M Panama; "291 monitors patrolled over 2.6 million acres"; "over 400 community-based forest patrollers across more than 160 communities"; 67,762 titled; "over 2 million acres"; 990,297 Peru; Paramakatoi about 625,000 |
| `tero_attribution_share` | same, Guyana | verified (numbers) | APA "$153,000 to $1.7 million"; SRDC "$1.1 million annual budget"; "approximately $7 million in combined direct and intermediated funding" (finding 3 is about the arithmetic) |
| `tero_counterfactual_adj` explainer | same | verified | Arrests and seizure of equipment by the district councils; Roraima fire brigades |
| `leverage_funging_adj` | same | verified | "more than $10.5 million" |
| `terpe_counterfactual_adj`, `ter_per_loss_rate`, `terpe_attribution_share`, `terpe_implementation_adj` | pmc.ncbi.nlm.nih.gov/articles/PMC8307376/ (Slough et al. 2021, local text) | verified | −8.4 ha (CI −19.4 to 2.6), 52%; −3.3 ha year 2, "substantially attenuated"; 37% over two years; "three monitors selected by each participating community"; mean 6,493 ha; 36 of 39 participated; "the NGO that designed and implemented the monitoring program" |
| `liv_stipend_per_day` | rainforestfoundation.org/supplied-with-tech-…/ | verified in round 1 | $8 a day; now converted to 2025 prices |
| `land_baseline_loss_rate`, `land_counterfactual_adj` | PMC5402456 (Blackman et al. 2017) | verified in round 1 | Unchanged |
| `ter_guy_loss_rate` | none | not given | Finding 7 |

## Drivers
1. `@catastrophe.deforestation_share_of_land_use_risk` (shared judgment, 0.0073–0.0226). The same for every forest model.
2. `permanence_share` (judgment 0.2–0.9, anchored on the trial's year-2 fade and on Cool Earth; 0.0077–0.0226).
3. `discount_rate` (shared).
4. `@catastrophe.pandemic_probability_covid_scale` (shared estimate).
5. `missing_data_discount` (shared slider), now on the other territories, titles and pay only. Then `terpe_counterfactual_adj` (judgment anchored on RFUS's own RCT; finding 2) and `ter_per_loss_rate` (from the trial's control communities).

What would most improve the model:
- RFUS's own 2025 Peru data: which communities are new, and patrol days and pay per monitor. That would set finding 2's mix and ground the pay branch's 60 days.
- A tree-cover-loss comparison of patrolled and unpatrolled communities outside Peru, from Global Forest Watch, which RFUS already uses.
- A reach figure for the GATC work outside the four countries (finding 1).

Verdict: pass (0 high, 2 medium, 6 low).
Model-sha: 36e79b07d9a7f60f17c7e65f5ebbe67cecb0bc3d0e2a4868e1b69e140bddac41
