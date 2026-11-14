# Audit: the-bail-project-charityevals-advocacy, round 3
Result: 2.829e-6 daly/$ = 0.00283 years of healthy life per 1,000 dollars (combined range 0.00031-0.0255); cause median 0.0682 (x0.041). Verdict: pass.

Scope as in round 2 (policy advocacy, public education and research, fiscal 2023-2025 past average); only round-2 fixes and changed rows checked.
Mechanical: lint 0 high / 0 medium / 2 low (far-below and spread, both said in the summary); `check.ts` all valid; simulation stable (5% 0.177, 50% 1, 95% 5.6 x best guess). The summary's "about 0.003" matches the result.

Round-2 findings:
1. denial_sought_share / SB 1318: resolved. 0.05 (0.01-0.2) estimate citing the Houston Chronicle's "fourth requested by District Attorney Sean Teare's office since the voter-approved amendment took effect in November" (verified). SB 1318 has its own term (`sb1318_people_per_year` = eligible flow / Harris share x `personal_bond_share` x `cash_bail_unable_share`), and its explainer says it does not scale with denial motions. Computed: 889 SJR 44 people plus about 1,300 SB 1318 people a year.
2. Units: resolved. `harris_eligible_released` 2,400 (KWBU quote, observed); people first, detention = people x `tx_days_held` / 365; the "about 900 people a year" explainer matches (2,400 / 0.135 x 0.05).
3. SJR 87: resolved. Sized on the sponsor's 0.0084% (Texas Tribune quote verified) x Census population row, plus SJR 1, both x (1 - `denial_sought_share`); `t25_vs_prop3` gone.
4. Long-detention mortality and family: resolved. Shared fact `long_pretrial_mortality_vs_prison` 0.7 (0.3-1.2, anchored on Patterson 2013) read by `deaths_per_long_detention_year` in `tx_uov` and `t25_uov`; the bailouts keep the 0.5 fact; `ue_family_tx` 15% weighted by branch weight against the shared 10% for the bailouts (formula checked).
5. harris_jail_population: resolved as an estimate 9,000 (8,581-9,905). Fox 26 verified for 8,581 and "steady decrease ... from January 2025".
6. Explainer number: resolved.
7. Source fields: resolved, with one wrinkle (finding 1 below).
8. Form 990: resolved. The ProPublica page carries the e-file id 202620619349300142 and total expenses 13,872,645.
9. Florida/Oklahoma caveat: kept. The cb branch reads the shared `bailouts_fy2025` and days per bailout (81,732 / 3,300 = 24.8, as stated).

New findings:
| # | Severity | Category | Row | Finding | Evidence | Fix |
|---|---|---|---|---|---|---|
| 1 | low | source | tx_delay_years | The cited CBS News Texas page says "Proposition 3 will take effect Jan. 1, 2026", while the explainer says 19 November 2025 (attributed to TDCAA; the Houston Chronicle also says it took effect in November). The row's two-year best guess survives either date (range 1.8-2.2). | CBS News Texas article text | Cite the TDCAA page for the 19 November date, or say the CBS page gives 1 January 2026. |
| 2 | low | source | harris_jail_population | Fox 26 gives only the November figure and the January-to-November decline; the 9,905 upper end (February) is not on the page. | Fox 26 page text | Add the second source for the February figure or lower the high to the sourced range. |
| 3 | low | judgment | personal_bond_share, cash_bail_unable_share, sjr1_noncitizen_share | Ranged judgments name no reference class beyond "a minority" / "often those without money". Together they set the SB 1318 and SJR 1 sizes (about 60% of Texas's people). | Row explainers | Anchor on Harris County's personal-bond share of releases (county pretrial services data) when available. |
| 4 | low | source | ue_family_tx, ue_crime_tx | Anchored on "Prison Policy Initiative's ue_dec_family/ue_dec_crime" (rows of another model) with no source field. | Row explainers | Add the model's source as `source`. |

No high or medium findings.

Verdict: pass
Model-sha: e3a9a16f827580def34fa6df93ac6d31272a02d06f5ead174252e3317fe34292
