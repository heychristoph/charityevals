# Research log: Against Malaria Foundation (blind build-cea run, 2026-11-03)

## Blind-rule notes
- docs/normalization.md (read for the shared rules, as SKILL.md requires) contains, in the 2.7 inventory table,
  GiveWell 2026 and HLI figures for AMF ("HLI AMF" row: deaths per $1,000 and HLI's healthy years). Seen
  inadvertently while reading the required doc; NOT used anywhere. Logged as incident.
- facts/moral_weights.json and facts/givewell_shared.json list "GiveWell, Against Malaria Foundation CEA" as the
  source of some shared facts (moral weights, years_until_income_benefits_malaria, income_discount_rate). The
  template requires these shared facts (one consistent way), so they are read by reference only; no AMF-specific
  GiveWell parameter beyond what the template prescribes. Did not open facts/givewell_common.json (holds net
  parameters typed in GiveWell sheets) nor any GiveWell-imported model in the sandbox.
- Did not open https://www.againstmalaria.com/CostEffectiveness.aspx (likely quotes evaluator estimates).

## Money
- https://www.againstmalaria.com/FinancialInformation.aspx (retrieved 2026-11-03): FY runs 1 July-30 June.
  "Our financial year runs from 1st July to 30th June". Table: FY2026 "Being audited" (revenue $346,944,339,
  LLIN costs $10,564,250, 6,394,038 nets); FY2025 audited (revenue $147,833,000; LLIN costs $171,957,961;
  non-net $4,974,347; admin $989,193; nets purchased and forward commitments 75,334,440).
- Audited accounts FY2025 (year ended 30 June 2025): https://www.againstmalaria.com/Downloads/AMF_Accounts_Global_2025.pdf
  (retrieved 2026-11-03)
  - p.21 SOFA: "Charitable activities 3, 4, 9 (178,011,823)"; total expenditure 178,011,823 (all expenditure is charitable activities; no fundraising line).
  - Note 3: Expenditure on LLINs 171,957,961; Non-net costs 4,974,347; Governance 29,629; Central costs 1,041,315; FX 8,571; total 178,011,823.
  - Note 5 (p.30) grants of LLINs FY2025 nets / US$: Chad 8,272,050 / 22,889,852; DRC 29,085,845 / 60,966,389;
    Guinea 4,751,550 / 9,895,150; Nigeria 19,045,150 / 48,866,185; South Sudan 9,502,210 / 20,924,756;
    Zambia 4,675,350 / 8,415,629; total 75,332,155 / 171,957,961.
  - Note 6 non-net costs (monitoring by local partners) 4,974,347 (DRC 2,434,921, Uganda 613,072, Nigeria 552,640 ...)
  - Note 7 staff costs: "Staff costs cover the cost of 14 individuals (12 salaried)"; total 979,393 (salaries 796,395).
  - Accounting policy p.33: "These grants are fully recognised at the point of agreement between AMF and the recipient country/organisation"; "Non-net costs are all costs associated with a net distribution excluding the cost of the nets themselves. Non- net costs include: all shipping, pre- distribution, distribution and post -distribution costs."
- DollarsPerNet.aspx (2026-11-03): "As at Nov 2026 : The current average price for a net is close to US$2.00."
- Home page counters (2026-11-03): Nets funded 474,231,180; People protected 853,616,124 (ratio 1.80).

## Co-funding and reach
- https://www.againstmalaria.com/MonitoringCosts.aspx (2026-11-03): "AMF typically funds the cost of the nets and co-funding partners fund all distribution non-nets costs." AMF funds post-distribution monitoring.
- https://www.againstmalaria.com/AMFFundingGap.aspx (2026-11-03): "This is based on the cost of a distributed net being US$4.50. Non-net costs = shipping, household registration and net distribution costs"; "1.80 (# of people that sleep under each net)"; "Actual costs per net are typically between $1.50 and $2.50". Pipeline table: monitoring $0.15-0.20/net; one approved programme where AMF pays $16.6m non-net costs for 15.1m nets (~$1.10/net) -> AMF sometimes now funds distribution costs (not in FY2025 accounts: non-net only $4.97m).
- Scates et al. 2020, Malar J 19:105, Europe PMC full text PMC7055111 (retrieved 2026-11-03), Table 2: Mali mass distributions 2015 economic cost per net distributed USD 2016: 4.37 (Ségou), 4.61 (Bamako); financial 4.19 / 4.39. "The largest single line item for the two mass distributions in the economic analysis were ITNs."
  -> partner (non-AMF) cost per net: AMF's $4.50 - $2.00 = $2.50; Scates implies ~$1.6-2.1 after a ~$2.5-2.8 net. Use 2.5 (1.5-3.0).

## Net use
- Bertozzi-Villa et al. 2021, Nat Commun 12:3589, PMC8196080 (Europe PMC full text, 2026-11-03): "35 show LLIN median retention times of under 3 years, with an overall median value of 1.64 years (IQR 1.33–2.37)"; "the aggregated all-country estimates for use rate and use gap were 87.1% (83.3, 90.1)" (2019); 2020 use rate 87.1% (83.1–90.3).
- The Life You Can Save on AMF PDM (search snippet, 2026-11-03): Equateur DRC Sept 2020 ~9 months: 95% present, 87% hung. Not opened further.
- WMR 2025 Annex 4G (https://cdn.who.int/media/docs/default-source/malaria/world-malaria-reports/wmr2025_annex_4g.xlsx, 2026-11-03): modelled % population with ITN access 2024: Chad 57.6, DRC 69.9, Guinea 53.1, Nigeria 47.7, South Sudan 65.4, Zambia 70.7. Net-weighted (FY2025 nets) 61.3%.

## Mortality
- WMR 2025 Annex 4H (wmr2025_annex_4h.xlsx, 2026-11-03), 2024 deaths point (low-high) / population at risk:
  DRC 67,676 (43,400-110,000) / 109,276,264; Nigeria 184,933 (135,000-264,000) / 232,679,477; South Sudan 6,749 (3,720-13,800) / 11,943,408;
  Chad 13,862 (10,500-19,100) / 20,076,847; Guinea 10,245 (8,480-12,600) / 14,754,785; Zambia 8,682 (7,740-10,200) / 21,314,955.
  Weighted by FY2025 nets (DRC .386, NGA .253, SSD .126, TCD .110, GIN .063, ZMB .062): 0.656 per 1,000 per year (low 0.456, high 1.009).
- WMR 2025 partner briefing (https://cdn.who.int/media/docs/default-source/malaria/world-malaria-reports/world-malaria-report-2025-partner-briefing-eng.pdf, 2026-11-03): "About 95% of these deaths (579K) were in the WHO African Region, and 75% of deaths in the African Region were among children under the age of 5".

## Effect
- Pryce, Richardson, Lengeler 2018 Cochrane CD000363.pub3, PMC6418392 abstract (Europe PMC, 2026-11-03): "Insecticide-treated nets reduce child mortality from all causes by 17% compared to no nets (rate ratio 0.83, 95% CI 0.77 to 0.89...)"; "5.6 lives (95% CI 3.6 to 7.6) each year for every 1000 children protected"; uncomplicated Pf 0.55 (0.48-0.64); "A 44% reduction in the incidence of severe malaria episodes was seen in the ITN group (rate ratio 0.56, 95% CI 0.38 to 0.82". Trials 1987-2001 (before widespread pyrethroid resistance).
- Cross-check: trial control U5 mortality ~5.6/0.17 = 33/1000; if direct malaria ~25% (8/1000), 0.45 x 8 x (1 + 0.5 indirect) = 5.5/1000, matching the all-cause result -> indirect ratio 0.5 is consistent.

## Income
- Barofsky, Anekwe, Chase 2015 J Health Econ 44:118, doi 10.1016/j.jhealeco.2015.08.002 (abstract, Europe PMC, 2026-11-03): "malaria eradication raised educational attainment by about a half year for both males and females".
- Bleakley 2010 AEJ Applied 2(2):1, PMC3810960 abstract: "cohorts born after eradication had higher income as adults" (qualitative only; full text not available via Europe PMC).
- Psacharopoulos & Patrinos 2018, Education Economics 26(5):445 (IDEAS abstract via search, 2026-11-03): private return to a year of schooling about 9% a year globally.

## Added during the audit rounds (2026-11-03)
- AMF accounts FY2025 p.8: "sleeping space coverage on day 1 (immediately post distribution) of around 95%, falling to 85-75% after 9 months, to 80-70% after 18 months and to 65-50% after 27 months" -> 2.1 coverage-years to 36 months.
- AMF accounts p.7: 21.4m nets being distributed at year end, 62.6m within 12 months, 7.0m after.
- AMF accounts SOFA: interest 12,369,574; note 15 cash 285,213,362 (2024: 184,559,223) -> 5.3% yield.
- Bertozzi-Villa 2021 Supplementary Table 1.7 (MOESM1, static-content.springer.com): COD 1.41, NGA 2.22, SSD 1.02, TCD 1.03, GIN 1.51, ZMB 1.32; net-weighted 1.525; loss curve kappa=20 -> mean/median 1.0455 (computed) -> 1.59.
- World Bank SH.DYN.STLB 2023 (UN IGME): DRC 25.9, GIN 22.7, NGA 23.9, SSD 27.6, TCD 28.4, ZMB 14 -> 24.9/1000 total births -> 0.0256 per live birth.
- WHO GHE 2023 deaths by cause/age/country xlsx (cdn.who.int ... deaths_bycountry_age_sex_2023...): malaria (GHE 220) net-weighted shares u5 0.7625, 5-14 0.0537, 15-49 0.0791, 50+ 0.1046.
- Gamble 2006 Cochrane CD003755.pub2 (PMC6532581): stillbirths/abortions G1-4 RR 0.67 (0.47-0.97).
- Okumu 2020 Malar J doi 10.1186/s12936-020-03321-6 abstract: resistance "greatly weakened the historical mass mosquitocidal effects".
- OWID malaria deaths by age (IHME): 403, non-redistributable. Mosha 2022 / Accrombessi 2023 abstracts: not retrieved (referenced qualitatively only).
- Shared facts read on auditors' advice (GiveWell-sourced, in the sandbox): @givewell.indirect_malaria_deaths_per_direct_malaria_death_2 (0.75), @givewell_common.malaria_morbidity (0.09), rebound (-0.04), internal_validity_adjustment_malaria (0.95), @givewell_shared.resource_sharing_multiplier (2); added @givewell_shared.investment_of_income_increases_nets 0.025 from docs/normalization.md's statement (GiveWell sheet not opened).
