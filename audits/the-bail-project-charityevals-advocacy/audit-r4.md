# Audit: the-bail-project-charityevals-advocacy, round 4
Result: 2.829e-6 daly/$ = 0.00283 years of healthy life per 1,000 dollars, unchanged from round 3. Verdict: pass (no high findings).
Model-sha: 8efa1a86011e43434a3473ffc29e457d18ac4f43c7e32542cd3b461ebdde7b36
Scope: scoped verification of the four round-3 lows and the changed text only. No values changed.
Mechanical: `audit-model.ts` on models/global-health/the-bail-project-charityevals-advocacy.json: 0 high / 0 medium / 2 low (far-below and spread, both said in the summary, as in round 3).

Round-3 findings:
1. `tx_delay_years` (CBS says 1 January 2026): settled. The explainer gives 19 November 2025 by the TDCAA's reading and 1 January 2026 in CBS News Texas's report, "either way" about two years; the range 1.8 to 2.2 covers both.
2. `harris_jail_population` (9,905 not on the Fox 26 page): settled in substance. The note now sources 8,581 to Fox 26 and 9,905 (2 February) and 8,961 (15 May) to a county document reported in local press (Community Impact). Search check: the 9,905 and 8,961 figures are reported as the DA's office's figures (single-day high on 2 February; 15 May update); Community Impact labels 9,905 an average daily population, which other reports call the single-day peak.
3. `personal_bond_share`, `cash_bail_unable_share`, `sjr1_noncitizen_share` (no reference class): settled; each explainer now names its reference class and keeps the value and range.
4. `ue_family_tx`, `ue_crime_tx` (no source field): settled. Both carry a source titled as charityevals' estimate for Prison Policy Initiative, URL https://charityevals.org/prison-policy-initiative-charityevals; the model exists in models/global-health and has rows `ue_dec_family` and `ue_dec_crime`, as the explainers say.

New findings:
| # | Severity | Category | Row | Finding | Evidence | Fix |
|---|---|---|---|---|---|---|
| 1 | low | source | `sjr1_noncitizen_share` explainer | Says the unauthorised share of Texas's population is "about 6% (Pew Research Center estimates for 2022)". A search of Pew's July 2024 short read (2022 estimates) gives Texas at 8% of its population (Cato's 2022 estimate is 7.1%); not confirmed on the Pew page itself. The 5% (2% to 10%) judgment still sits inside the range. | Pew Research Center, "What we know about unauthorized immigrants living in the U.S." (22 July 2024) | Change "about 6%" to "about 8%" (or the figure on the page checked), and say why the share of listed-offence defendants is taken lower (adults charged, lower arrest rates); no value change needed. |
| 2 | low | source | `harris_jail_population` note | 9,905 is described as a county document reported in press; the DA's office reports it as the single-day high of 2 February, while the row's explainer calls the 8,581 to 9,905 range the average daily population. | DA's office and Houston Public Media reports of the 15 May update | Say "the DA's office reported 9,905 on 2 February, the year's single-day high" and that the range runs from the year-end close to that high. |

No high or medium findings.

Verdict: pass (0 high).
Model-sha: 8efa1a86011e43434a3473ffc29e457d18ac4f43c7e32542cd3b461ebdde7b36
