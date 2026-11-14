# Audit: sentinel-bio-charityevals, round 2
Result: 0.004722 daly/$ = 4.72 years of healthy life per 1,000 dollars (combined range 0.36–62.4; model's own ranges 1.6–10.8); cause median 5.26 (×0.90). Verdict: pass.
Model-sha: b9bbf9cee15ca5f85bb486119d373d35e8dc844c60d5769f5c597e5ee03e50a2
Scope: everything Sentinel Bio spent in its first (short) tax year, 16 May to 31 December 2024. Source: Form 990, object 202532799349300228, fetched again this round (TaxPeriodBeginDt 2024-05-16). Total $1,534,257 (programme $1,383,548, management $112,510, fundraising $38,199); grants $1,105,558.

Every dollar sits in one branch:
- three grants valued as typical pandemic work: $555,000 (EBRC $330,000, Panorama Global/rani $150,000, one individual $75,000);
- two fellowships in field-building: $163,300 (UMD Foundation $113,300, Open Molecular Software Foundation $50,000);
- two grants read live: CSR $307,258, and Epoch AI $80,000 (paid through Rethink Priorities);
- own costs, $428,699.

The $1,076,000 advised gift to JHU CHS goes through informed_money_value. Schedule I and Part IX lines 1–2 sum exactly to grants_paid. The charity record's `spending` and one `lines` entry ($1,383,548) match the accounts.

Branch shares at the defaults (scratch runs): typical grants 50%, fellowships 21%, CSR 25%, advised gift 4%, Epoch 0.1%.

Mechanical:
- audit-model lint 0/0/1: pol_cost_share unused, a context row its explainer marks as such.
- Invariants: none.
- normalization-audit: 0 violations in every invariant (generated/ restored).
- check.ts: all models valid.
- simulation-check: stable (5% 0.23×, median 1.0×, 95% 7.2× of the best guess; one single event, misses 0% of draws).

Previous round:
1. **(high, distance slider) resolved.** `beneficiaries` is "world", in the model and in scripts/beneficiary-countries.ts. `live_uov = (live_grants_uov + informed_money_value) * live_missing_data_adj`, which is exact for the three recipients today: CSR's, Epoch's and JHU CHS's models are each linear in $missing_data_discount (checked at 0.1, 0.5 and 1). With home United States at 50% a step, the result goes 4.72 → 1.33 (×0.28), as IBBIS's and CSR's do. Residual: finding 2.
2. **(high, advised gift) resolved.** The gift goes through `informed_money_value` (the shared formula, INV-12 passes). new_money_share, moved_dollar_net_value and moved_value are gone. donor_cost_share is the template's. The explainers and the write-up are rewritten.
3. **(medium, fellowships) resolved as proposed.** fb_people 2 (verified), fb_share_working 0.1 (0.03–0.25), fb_work_years @catastrophe.field_work_years, fb_credit_share by share of resources (0.41, CSR's formula). The COVID-scale share is applied to fb deaths and w_fb, which reduces to CSR's fb_covid_scale_share with an all-bio branch. Residual: finding 3.
4. **(low, fb_work_years) resolved.** The model reads the shared figure, and after the merge from main the template's row does too.
5. **(low, leverage_funging_adj explainer) resolved**, worded as proposed.
6. **(low, citations) mostly resolved.** The short tax year is in the source titles, program_spend's explainer and the write-up. Schedule I Part I line 2 is cited in own_cost_share and in the next-dollar note. The Coefficient Giving claim is gone. Not resolved: charities/sentinel-bio.json `spending.source` still says "calendar 2024" (finding 4).

| # | Severity | Category | Row | Finding | Evidence | Fix | Effect on result |
|---|---|---|---|---|---|---|---|
| 1 | medium | presentation | `summary`; write-up "What drives the result" | The branch shares are stale since the fellowships moved. Both texts say "about three fifths from three grants valued as a typical dollar of pandemic work … a tenth from two fellowships". Computed at the defaults, the three grants give half of the result and the fellowships a fifth. The other shares as stated are right: CSR a quarter, the advised gift a few percent. | w_bio × bio's total adjustments = 7,264, and w_fb × fb's = 3,071, of the 10,542 healthy years on the typical chain. Out of 14,786 in all, that is 50% and 21%; CSR 3,680 (25%), advised gift 559 (4%). Scratch run: fb_people 0 gives 4.72 → 3.72 (−21%). | In `summary`, write "about half from three grants valued as a typical dollar of pandemic work (…), a fifth from two fellowships counted through the work they add to the field, a quarter from its grant to the Council on Strategic Risks …". In the write-up, change "bring about three fifths of the result and the fellowships a tenth" to "bring about half of the result and the fellowships a fifth". | none |
| 2 | low | comparability | `prior_dollar_value` under `beneficiaries: "world"`; `live_uov` | This is the builder's open question, and it does matter, by a small amount. A "world" model reads every `#` at its neutral value (refValues: missing data 1, age discount 0). `live_missing_data_adj` restores the missing-data step exactly for JHU CHS and for #cause:catastrophic-risk, whose ranked members are wholly thin (0.016897 against 0.016950 read as a mover reads it). It cannot restore the counterfactual multiple GiveDirectly / #cause:global-health. That figure needs GiveDirectly's age discount and the thin global-health charities' missing-data step. Read neutral, the multiple is 0.397, where a money mover reads 0.635 (normalization.md 2.13: a mover reads "the counterfactual … with GiveDirectly's" own steps). So the shifted gain per dollar is 0.00834, against 0.00428 under the method Longview, Rethink Priorities and Effektiv Spenden use for the same kind of advice. Nothing in the model can repair this, because one model has only one read mode. The same gap reaches the global-health models with country shares that read `prior_dollar_value = @meta.prior_vs_cash * #givedirectly` (CGD, Tax Justice Network and others): GiveDirectly is read there without its age step, 0.00872 against 0.00792. | Scratch run of the model as "destinations" with live_missing_data_adj 1, as a reference: prior 0.010761 against 0.013412 × 0.5 here; advised gift 574 against 1,117 units of value; headline 4.635 against 4.722. At $missing_data_discount 0.1, the mover's gain is −0.0012 per dollar, against +0.0017 here. | This needs an engine change, which is the owner's decision. In `src/engine/model.ts` `run` → `other`, a model that isn't "destinations" should read the references made by rows of the `moved_money` section (value_destinations, prior_dollar_value, value_global_health) as a money mover does: each target with its own missing-data and age steps, at distance 0 (`{ ...readerValues(av, view), distance_discount: 0 }`), because the model's own distance weight applies once, to the whole. Add a sentence to normalization.md 2.13 ("Models read live") and a case to missing-data.test.ts. Then set this model's `live_uov` = `live_grants_uov * live_missing_data_adj + informed_money_value`, and cut "and of the advised gift's value" from live_missing_data_adj's explainer. Until then, nothing in the model is wrong by the rows: they are the shared ones word for word. | −1.9% (4.72 → 4.64) once fixed |
| 3 | low | units | fb_people | A whole UMD fellow is counted against only the part of the fellowship paid in the year. The fellow's later work is the outcome of the full $164,468 committed (grant page), but cost_total holds only the $113,300 paid in the short 2024 year (Schedule I). This is one year's cost against a whole fellow's career. The Rosetta fellowship ($50,000, one fellow) has no such gap. | Grant page "We provided the University of Maryland with $164,468 for a fellowship"; Schedule I: 113,300. Scratch run with fb_people 1.689: 4.72 → 4.65. | Add an observed row `umd_fellowship_committed` = 164468 (the grant page, quote as above). Set `fb_people` = `1 + grant_umd_fellowship / umd_fellowship_committed` (1.69), and say in its explainer that the UMD fellow counts in the share of the fellowship paid in 2024. | −1.5% |
| 4 | low | source | charities/sentinel-bio.json `spending.source` | The charity record still calls the return "Form 990 for calendar 2024". The year is its first tax year, 16 May to 31 December 2024 (TaxPeriodBeginDt 2024-05-16). This is round 1's finding 6, which was fixed everywhere else. | 990 XML header; Schedule A Part VI. | Write "Form 990 for its first tax year, 16 May to 31 December 2024" in `spending.source`, and "for its first tax year (May to December 2024)" in the `lines` entry's source. | none |
| 5 | low | structure | covid_scale_deaths_averted, w_pol | The policy branch points at pandemics (`pol_deaths_per_year = bio_deaths_per_year`), but its deaths are left out of `covid_scale_deaths_averted`, and `w_pol` values them at the world's age mix only. That contradicts w_pol's own explainer ("its deaths at w_bio's mix, as in covid_scale_deaths_averted"). The fellowship branch got this treatment this round; the policy branch didn't. It is switched off (pol_wins 0), so nothing moves today, but a 2025 rebuild with a win would value its deaths inconsistently. | CSR's model: `covid_scale_deaths_averted = bio_deaths_averted * bio_covid_scale_share + pol_deaths_averted * bio_covid_scale_share + fb_deaths_averted * fb_covid_scale_share`. | Set `covid_scale_deaths_averted` = `(bio_deaths_averted + pol_deaths_averted + fb_deaths_averted) * bio_covid_scale_share`, and give `w_pol` the w_fb form: `pol_deaths_averted * ((1 - bio_covid_scale_share) * value_per_death + bio_covid_scale_share * covid_value_per_death) * dalys_per_death_value + pol_future_dalys`. | none (branch off) |

## Double counting checked (no finding)

- **Fellowships.** They are out of `typical_grants`, so each dollar sits in one branch (cost_shares_total = 1). The fellowship year's own work is not counted on top of the alumni's added work. fb_counterfactual_adj is 1, because who would have entered anyway is already out of fb_share_working (as in CSR's model). `unmodelled_benefits_adj` names the fellowships' links between protein design and policy. That is beyond the fellows' own work-years, and the +5% is shared with the screening rationale, so it is not double counting.
- **The advised gift's missing-data steps.** It takes two steps: Sentinel's own (`missing_data_adj` inside informed_money_value) and the destination's (`live_missing_data_adj`). A destinations-mode mover takes the same two (the destination's through refValues, its own in the formula), so no step counts twice. The gap is only the counterfactual multiple (finding 2).
- **The live grants.** They are counted once, at each recipient's value per dollar, ×0.5 for the recipient's missing-data step. That equals CSR's and Epoch's figures as read by a mover, exactly (7,371 units of value either way).
- **Sentinel in #cause:catastrophic-risk.** As a "world" model, Sentinel now enters its cause's and area's mean. It reads #cause:catastrophic-risk itself without itself, and buildLibrary reports no cycle.

## Sources checked
| Row | URL | Status | Note |
|---|---|---|---|
| program_spend, total_expenses, program_expenses, grants_paid, staff_pay | IRS e-file XML (scripts/irs-990.py 99-3068480; batch 2025_TEOS_XML_11C; copy in the round 2 scratchpad) | verified | 1,383,548; 1,534,257; 1,105,558 (1,030,558 to organisations + 75,000 to an individual); 188,179; period 2024-05-16 to 2024-12-31. |
| grant_csr, grant_epoch, grant_umd_fellowship, grant_rosetta_fellowship, typical_grants | same, Schedule I; https://sentinelbio.org/api/wp/v2/grant?per_page=100 | verified | CSR 307,258; Rethink Priorities 80,000 "GENERAL ASSISTANCE"; UMD Foundation 113,300 "SUPPORT OF PROJECTS FOCUSED ON AI RISK" (grant page: $164,468 for "a fellowship"); OMSF 50,000 "BIOSECURITY FELLOWSHIP WITH ROSETTACOMMONS"; EBRC 330,000; Panorama Global 150,000. The 2024 grant pages sum to 1,158,526 = 1,105,558 + the UMD remainder 51,168 + the $1,800 study (own costs). |
| grant_epoch explainer (Epoch's funding page) | https://epoch.ai/our-funding | verified | "Sentinel Bio, Tracking developments in biological AI models … September 2024 $80,000". The old /funding path returns 404, and the explainer names no URL. |
| fb_people | https://sentinelbio.org/grant/open-molecular-software-foundation/; UMD grant page | verified | "an inaugural biosecurity fellowship at Rosetta Commons, with Samuel Curtis as the inaugural fellow"; UMD "a fellowship" (one fellow; finding 3 on the cost). |
| advised_gifts | https://sentinelbio.org/grant/johns-hopkins-center-for-health-security/ | verified | "advised an external donor … with $1,076,000 in general support", dated 2024-12-02. |
| @next_dollar.sentinel_bio | 990 Part I; grant pages; Support us page | verified | Net assets 9,060,916; contributions 10,582,992. Grant pages: $4.0M in 2025, $13.1M in 2026 to October (plus $750,000 advised in 2025). Grantee meetings at Schedule I Part I line 2 (verified). |
| leverage_funging_adj (1:1 match in 2025) | IGSC and IBBIS grant pages | verified | IGSC 2025-10-10 and IBBIS 2026-01-14 both "matching industry contributions 1:1". |
| shared facts (bio cuts, XPT chances, death shares, field_work_years, cost_per_work_year, own_effect_share) | facts/*.json | not re-checked | Shared figures, read unchanged. |

## Drivers
1. `$discount_rate` (shared slider): 57.7 at 0.1%, 3.96 at 8%.
2. `$win_years_counted` (shared slider): 1.02 at 1 year, 14.4 at 20.
3. `$missing_data_discount` (shared slider): 0.92 to 9.80.
4. `@catastrophe.bio_extinction_cut_per_million` and `bio_catastrophe_cut_per_million` (shared estimates; Rethink calls them placeholders): 3.1 to 21.2.
5. `@next_dollar.sentinel_bio` (this charity's sourced estimate, 0.49, 0.17 to 0.90): 1.6 to 8.7.

The model's own judgments that matter:
- bio_evidence_adj 0.8: 3.2 to 6.0;
- bio_cf_other_orgs 0.7: 3.7 to 5.4;
- fb_share_working 0.1, now a fifth of the result.

Each has a reference class (IBBIS, Ploughshares, CSR).

What would most improve the model:
- the engine read of finding 2, so advice in a non-mover model is valued as every mover values it;
- for the fellowships, any follow-up of where the 2024 fellows went;
- the 2025 Form 990 when filed: a full year, about four times the grants, and a smaller own-cost share.
