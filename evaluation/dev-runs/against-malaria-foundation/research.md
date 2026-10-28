# Research log: Against Malaria Foundation (build-cea, blind run)

"Today" = 2026-10-28. Blind list respected: no givewell.org pages/sheets on AMF/ITNs/malaria nets, no HLI pages on AMF/nets, no existing charityevals AMF model/write-up (none exists in SANDBOX/models; charities/against-malaria-foundation.json is only the name/website record and was read).

Note: the shared fact `facts/moral_weights.json` (uov_per_death_under5 = 116.25, uov_per_death_over5 = 73.19) is sourced in the repo to GiveWell's AMF CEA spreadsheet. I use it via `@moral_weights.*` as SKILL.md requires (shared moral weights) but did not open that spreadsheet.

## Money

1. AMF website, Financial information — https://www.againstmalaria.com/FinancialInformation.aspx (2026-10-28)
   - Links to audited accounts by FY; FY ends 30 June. FY26 accounts "Being audited" (so FY2025 = year to 30 June 2025 is the latest audited year).
   - "Easier-to-understand" table, FY25: Revenue $147,833,000; LLIN costs $171,957,961; Administrative costs $989,193; "# of nets purchased and forward commitments" 75,334,440.
   - Homepage counters (same page): "Nets funded" 473,789,870; "People protected" 852,821,766 (ratio 1.80 people per net).

2. AMF Annual Report and Financial Statements for the year ended 30 June 2025 (Global, audited by Crowe U.K. LLP) — https://www.againstmalaria.com/Downloads/AMF_Accounts_Global_2025.pdf (2026-10-28; text extracted with pypdf)
   - p.21 SOFA: "Charitable activities 3, 4, 9 (178,011,823)" → total expenditure $178,011,823 (all charitable activities).
   - p.27 note 3: "Expenditure on LLINs 171,957,961"; "Non-net costs (see note 6) 4,974,347"; "Governance costs 29,629"; "Central costs 1,041,315"; "Foreign exchange 8,571".
   - p.30 note 5: nets granted FY25 by country: Chad 8,272,050 ($22,889,852); DRC 29,085,845 ($60,966,389); Guinea 4,751,550 ($9,895,150); Nigeria 19,045,150 ($48,866,185); South Sudan 9,502,210 ($20,924,756); Zambia 4,675,350 ($8,415,629). Total "75,332,155 171,957,961".
   - p.25 accounting policy: "Non-net costs include: all shipping, pre- distribution, distribution and post - distribution costs." But note 6 (p.31) shows what AMF itself funds is monitoring: "AMF identifies partners in-country that have the experience and staff to carry out monitoring activities ... AMF funds the costs of these activities."
   - p.32 note 7: "Staff costs cover the cost of 14 individuals (12 salaried)"; "Salaries and wages 796,395"; "Pension contributions 63,349"; "Social security costs 107,836"; subtotal 897,688; "The CEO chooses not to draw a salary."
   - p.7: "In the financial year, 7.1 million LLINs were distributed in three distributions in two countries protecting 12.8 million people"; "18 distributions of 62.6 million LLINs to protect 113 million people were scheduled to be completed in the next 12 months" (1.80 people/net).
   - p.8: "sleeping space coverage on day 1 (immediately post distribution) of around 95%, falling to 85-75% after 9 months, to 80-70% after 18 months and to 65-50% after 27 months."
   - p.6: "100% of funds received via fundraising activities or via direct donations, are used to buy LLINs."
   - p.8: "AMF has focused on widening the use of nets which use a combination of insecticides e.g. pyrethroid and chlorfenapyr."

## Effect

3. Pryce, Richardson & Lengeler (2018), Insecticide-treated nets for preventing malaria, Cochrane CD000363.pub3 — abstract via Europe PMC REST API (PMID 30398672), https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:30398672 (2026-10-28). Cochrane site returned 403; PubMed/PMC showed a reCAPTCHA page.
   - "The included studies were conducted between 1987 and 2001."
   - "reduce child mortality from all causes by 17% compared to no nets (rate ratio 0.83, 95% CI 0.77 to 0.89; 5 trials, 200,833 participants, high-certainty evidence)"
   - "a saving of 5.6 lives (95% CI 3.6 to 7.6) each year for every 1000 children protected"
   - "uncomplicated episodes of Plasmodium falciparum malaria by almost a half (rate ratio 0.55, 95% CI 0.48 to 0.64" → incidence_reduction 0.45 (0.36–0.52); mortality_reduction 0.45 (0.30–0.60), our derivation.
   - severe malaria "rate ratio 0.56, 95% CI 0.38 to 0.82".
4. Mosha et al. (2024) Lancet Infect Dis, doi 10.1016/S1473-3099(23)00420-6, abstract via Europe PMC (2026-10-28): "Overall usage of study nets was 1023 (22·3%) of 4587 people at 36 months"; chlorfenapyr-PY vs PY "odds ratio 0·57, 95% CI 0·38-0·86". Used qualitatively in evidence_adj and net_use_years low end.
5. Accrombessi et al. (2024) Lancet Infect Dis, doi 10.1016/S1473-3099(24)00002-1, abstract via Europe PMC (2026-10-28): third year chlorfenapyr HR "0·80, 0·56-1·17"; "people living in the chlorfenapyr-pyrethroid LLIN group no longer benefited from greater protection". Qualitative, evidence_adj.
6. Barofsky, Anekwe & Chase (2015) J Health Econ, doi 10.1016/j.jhealeco.2015.08.002, abstract via Europe PMC (2026-10-28): "malaria eradication raised educational attainment by about a half year for both males and females ... almost 40% rise in the likelihood of male wage employment" → schooling_gain_full_childhood 0.5 (0.2–0.8).
7. Bleakley (2010) AEJ Applied — abstract via https://www.aeaweb.org/articles?id=10.1257/app.2.2.1 (2026-10-28): "cohorts born after eradication had higher income as adults". No magnitude taken. (NBER working paper link returned HTML, not PDF.) Did NOT open files.givewell.org Roodman replication (GiveWell file; malaria-income input of their nets/SMC CEAs: avoided under blind rule).
8. Psacharopoulos & Patrinos (2018), WB WPS 8402 — from search snippet of https://documents1.worldbank.org/curated/zh/442521523465644318/pdf/WPS8402.pdf (2026-10-28): "The private average global return to a year of schooling is 9% a year." → return_to_schooling 0.09 (0.06–0.12). Quote seen in search result text, PDF not opened.

## Baselines

9. WHO malaria mortality rate per 100,000 (World Malaria Report), via OWID CSV https://ourworldindata.org/grapher/death-rate-from-malaria.csv (2026-10-28). 2024: DRC 61.931107, Nigeria 79.47972, South Sudan 56.50816, Chad 69.04471, Guinea 69.435104, Zambia 40.731964. Net-weighted (FY25 note 5 shares) = 65.62 per 100k → 0.000656. Also OWID number-of-deaths-from-malaria-who: Nigeria 2024 184,933; DRC 67,676. WHO GHO OData API returned 500; OWID IHME-based charts not downloadable (403 licence).
10. WHO malaria fact sheet https://www.who.int/news-room/fact-sheets/detail/malaria (2026-10-28): "Globally in 2024, there were an estimated 282 million malaria cases and 610 000 malaria deaths"; "Children under 5 accounted for about 75% of all malaria deaths in the Region." (page also says 76% elsewhere) → u5_share 0.75 (0.70–0.80).
11. World Bank API SP.POP.0014.TO.ZS 2024 (2026-10-28): DRC 46.03, Guinea 40.90, Nigeria 41.01, South Sudan 38.92, Chad 46.06, Zambia 41.46 → net-weighted 43.26%.

## Costs of others

12. Copenhagen Consensus, Expanded malaria intervention (2023) https://www.copenhagenconsensus.com/sites/default/files/2023-03/Expanded%20malaria%20intervention.pdf (2026-10-28), p.2: "Winskill et al (2019), who estimated the cost/net at $2.24 and in-country delivery cost/net at $2.65, for a total of $4.89"; also "can be protected from a net is 1.8 (Winskill et". → anchor for partner_cost_per_net judgment $2.0 ($1–3).
13. Search snippet (not opened): WHO/Hoyer presentation "USD 2.0 Operational cost/LLIN" (endmalaria.org) — anchor only.
14. Wisniewski et al. (2020) Acta Trop, cost of ITN distribution review — abstract only, no per-net figure in abstract.

## Blind-rule incidents

- Search "LLIN mass campaign operational cost per net..." returned a givewell.org result (Malaria Consortium LLIN campaigns in Ondo/Anambra, givewell.org/node/3621) whose snippet, relayed by the search tool, said procurement/shipping was 67% of that campaign budget. Not opened, not used.
- Search for Bleakley 2010 returned a files.givewell.org Roodman replication PDF link; not opened.
- No snippet showing an evaluator's cost per life saved for AMF was seen.
- Shared fact @moral_weights.* is sourced (in the repo) to GiveWell's AMF CEA; used as required by the skill, sheet not opened.

## Model (first version, before audit)

Bottom line 0.0299 uov/$ = 3.48× GiveDirectly, joint 0.11–97.7×. Mechanical audit: 0 findings. check.ts: exit 0.

## Audit round 1 (audit-r1.md): 1 high, 2 medium, 6 low

Sources added while fixing:
15. Eigbiremolen et al. (2026) Malaria Journal, doi 10.1186/s12936-026-05829-9, abstract via Europe PMC (2026-10-28): "Unit distribution costs were $0.74 per net in Ondo and $0.57 in Anambra." "Financial costs comprised 98% of total economic costs in Ondo and 97% in Anambra." "ITN campaign economic costs in this study were lower than most estimates from other African countries."
16. Arroz et al. (2019) BMC Res Notes, doi 10.1186/s13104-019-4620-6, abstract via Europe PMC (2026-10-28): "The total financial cost of delivering LLINs was US$ 231,237.30 and US$ 174,790.14 in the intervention (302,648 LLINs were delivered) and control districts (219,613 LLINs" → $0.76 and $0.80 per net.
17. OpenAlex abstract of Psacharopoulos & Patrinos 2018 (api.openalex.org/works/doi:10.1596/1813-9450-8402, 2026-10-28): "the private average global rate of return to one extra year of schooling is about 9 percent a year" (replaces paraphrased quote).
18. World Bank API SH.DYN.MORT / SH.DYN.NMRT 2024 (2026-10-28): U5MR DRC 89.7, GIN 92.1, NGA 115.6, SSD 96.7, TCD 97.3, ZMB 48.4 (net-weighted 95.6); NMR 23.6, 29.8, 39.0, 39.5, 30.4, 21.4 (30.5). Post-neonatal U5 ≈ 65/1000 births ≈ 13.5/1000 child-years; trial control ≈ 5.6/0.17 = 33/1000 → today's equivalent all-cause effect ≈ 2.3/1000 (2.8 with no-net uplift). Used to calibrate indirect_deaths_ratio.

Changes: H1 added indirect_deaths_ratio 0.5 (0.2–0.8) into baseline_mortality_rate; M1 partner_cost_per_net 2.0 (1–3) → 1.5 (0.6–3.0); M2 partner costs out of cost_total into attribution_share_shared = amf_cost_share × unpriced_contrib_adj; L1 years_to_benefit 2 (1–3) + timing_discount on deaths and income; L2 counterfactual_adj restricted to existing protection, low 0.65→0.7; L3 mortality high 0.00085→0.00095, u5 share low 0.70→0.60 (IHME not accessible); L4 write-up sensitivity claim fixed; L5 not changed (shared fact, out of scope); L6 quote fixed.
Result: 3.48× → 4.99× GiveDirectly (0.0429 uov/$), joint 0.10–189×. Mechanical: 1 medium (spread 1839×), answered in summary.

## Audit round 2 (audit-r2.md): 0 high, 3 medium, 5 low — loop stops (no high findings)

19. Alaii et al. (2003) AJTMH 68(4 Suppl):137, doi 10.4269/ajtmh.2003.68.137, abstract via Europe PMC (2026-10-28): "The overall percentage adherence was 72.3%."; "Approximately 30% of ITNs present were unused."; "a ratio of 1.46 persons per ITN" → trial_usage 0.72 (0.60–0.85), now kind estimate.

Changes: trial_usage 0.8 judgment → 0.72 estimate; mortality_reduction range 0.30–0.60 → 0.35–0.55 with correlation note (also in indirect_deaths_ratio); cost-per-death wording fixed (≈$3,200 all costs, ≈$1,900 AMF-only with full credit); stale explainers (uov_per_dollar, cost/outcome sections) updated; income now discounted with years_to_distribution (1 yr) instead of timing_discount (2 yrs); IHME bounds labelled as judgment. Not changed: indirect deaths applied at all ages (low, ~−5%); @moral_weights citation (shared fact).
Final: 0.0480 uov/$ = 5.59× GiveDirectly, joint 0.127–196×. Mechanical: 1 medium (spread 1546×, answered in summary). check.ts exit 0.
