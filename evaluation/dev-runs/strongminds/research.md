# StrongMinds build-cea research log (blind run, 2026-11-03)

## Blind-rule incidents
- docs/normalization.md (required reading by SKILL.md) section 2.7 tables state evaluator CE figures for StrongMinds in our view: HLI 22.2 -> 2.52, FP 2.38 -> 4.85, SoGive 0.816 -> 0.568 (healthy years per $1,000). Seen involuntarily while reading the required doc; not used to set any input.
- facts/wellby_factors.json and facts/depression.json cite HLI's StrongMinds/Friendship Bench spreadsheet and SoGive's StrongMinds sheet as sources of the shared figures (wellbys_per_sd_year 2, spillover 16.24%, phq9_sd 4.21). Used as the site's shared facts (required); did not open those URLs.
- facts/household_size.json uganda explainer mentions HLI's household figure 4.73 (not a CE figure).

## Money (FY2024, calendar year)
- URL: https://strongminds.org/wp-content/uploads/2025/06/StrongMinds-2024-Combined-Audited-Financial-Statements.pdf (retrieved 2026-11-03; downloaded, text via pypdf)
- Combined statement of activities, p.? (Exhibit B): "Program Services 6,030,178"; "General and Administrative 3,105,514"; "Fundraising 1,011,289"; "Total expenses 10,146,981".
- Functional expenses (Exhibit C, p.8): Salaries total 5,306,165; Employee benefits 843,387; Payroll taxes 483,364 -> staff 6,632,916 = 65.4% of total. Program column: salaries 2,819,601, benefits 439,567, payroll taxes 261,596 (3,520,764 = 58.4% of program). Consultants 639,424 total. Mobilization and facilitation 663,992; Partners 253,271.
- Combining schedule (Schedule 2, pp.21-22): Program services USA 7,218,690 (incl. grants to SMU/SMZ), Uganda 4,303,055, Zambia 1,063,901, eliminations (6,555,468). USA direct program = 663,222. Total expenses Uganda 5,664,329; Zambia 1,285,467; USA 9,752,653.
- Note 1: "In 2022, Strongminds, Inc. launched efforts to deliver its programs in the United States. Those activities ceased effective December 31, 2024."
- Auditor: SMU and SMZ statements audited by other auditors (total assets 785,769 / 201,690).
- FY2023 (same PDF comparative): program 5,698,135; fundraising 789,778; total 9,742,249.

## Reach (2024)
- Q4 2024 report https://strongminds.org/wp-content/uploads/2025/03/2024-Q4-report-8.5x11-03-10-2025-FINAL.pdf (retrieved 2026-11-03), p.1: "In 2024, StrongMinds provided life-changing depression treatment to 426,642 clients—a remarkable 78% increase from 2023." Cost per person USD $23 (charity's own). PHQ-9 "ACTUAL: 12.1 point decrease" pre-post, "externally validated 2-weeks post-therapy" (uncontrolled).
- p.4: "In 2024 alone, 233,185 clients received treatment through government partnerships, supported by more than 1,700 government-paid volunteer therapy group facilitators." Global partnerships "reaching 33,000 people across Ethiopia, Kenya, Malawi, and Nigeria". Psychoeducated 601,731 (not modelled).
- p.3 delivery mix bar: 3% / 21% / 53% / 23% (SM staff, NGO partners, Gov't partners, Peer facilitators (Zambia only)) - label order ambiguous in extracted text.
- p.5: StrongMinds America closed end 2024: "Continued iterations of our group therapy model in the US(including video groups and single-session interventions) proved ineffective."
- Q4 2025 report https://strongminds.org/wp-content/uploads/2026/03/2025-Q4-report-8.5x11-3-19-26-FINAL.pdf (retrieved 2026-11-03), p.6: "Uganda treated 236,292 clients in 2024, at a reported CPP of $18." "In 2024 we estimated government contributions at roughly 5%"; 2025: "Uganda and Zambia each contributed ~9% of total program costs—about $0.89–$3.69 per patient"; 97% government staff time. p.7: "We have completed all 2024 audits without findings" (2025 audit not yet published; tried 3 guessed URLs for 2025 audited FS: 404). 2025: 745,224 treated, CPP $15 (context only). Age chart p.3: 2024 ~212k adolescents (15-24) and ~215k adults (sum 427k); 2025 478k/267k.
- ProPublica 990 XML: bot check (not bypassed). Part III programme split not obtained.

## Effect
- Baird, Ozler, Dell'Aira, Parisotto, Us-Salam (2024) World Bank PRWP 10849 "Therapy, Mental Health, and Human Capital Accumulation among Adolescents in Uganda", https://openknowledge.worldbank.org/bitstreams/106e58e5-6f97-468b-b0c9-38e643886f83/download (retrieved 2026-11-03; text). Published JDE 176 (2025). Cluster RCT, 106 ELA clubs, StrongMinds Uganda IPT-G, adolescent girls PHQ-8>=10.
  - Table A4 LATE, Panel A (immediate): PHQ-8 -0.730 (SE 0.552), control SD 4.816; GHQ-12 -0.880 (0.354), SD 3.159. Panel B 12 mo: PHQ-8 -0.578 (0.551); Panel C 24 mo: +0.192 (0.866).
  - Table 6 ITT: immediate PHQ-8 -0.354 (0.297); 12 mo -0.404 (0.277); 24 mo +0.275.
  - Attendance ~52-55% at least one session; 28% attended 12 of 14.
  - Authors' own cost: "approximately USD 48 per individual offered the program (the cost per attendee was closer to USD 88)" and their own CE ($18,413 PPP per DALY) - researchers' figure in the RCT, not used as an input.
  - "this evaluation was of a first attempt by StrongMinds to provide IPT-G to adolescents and to work through partner organizations"
- Cuijpers et al. 2018 World Psychiatry 17:90-101, "Psychotherapies for depression in low- and middle-income countries: a meta-analysis", https://research.vu.nl/ws/files/105028031/Psychotherapies_for_depression_in_low_and_middleincome_countries.pdf (retrieved 2026-11-03). Table 2: all g=1.10 (0.91-1.30); pub-bias adjusted 0.73 (0.51-0.96); risk of bias 4 (low) n=6 g=0.51 (0.34-0.69); group format 0.94.
- Bass et al. 2006 BJP 188:567-573 (6-month follow-up of Bolton 2003): sustained effect at 6 months (from index abstract; https://www.mentalhealthdataprizeafrica.aphrc.org/repository/paper/15854/...).
- Suicide: World Bank SH.STA.SUIC.P5 (WHO), https://api.worldbank.org/v2/country/UGA;ZMB/indicator/SH.STA.SUIC.P5?format=json (retrieved 2026-11-03): Uganda 2021 5.5, Zambia 2021 7.13 per 100,000.
- Moitra et al. 2021 J Psychiatr Res 137:242-249, https://pmc.ncbi.nlm.nih.gov/articles/PMC8095367/ : MDD adjusted RR of suicide 7.64 (4.3-13.58) (abstract via search; not opened full text).

## Baselines
- Zambia household size: DHS API HC_MEMB_H_MNM ZM2024DHS 4.7 (2018: 5.0) -> added facts/household_size.json zambia. Uganda 4.7 existing fact.
- Blind incident: read the first 40 lines of models/global-health/friendship-bench.json (to see model formatting); its source is HLI's joint "StrongMinds and Friendship Bench" report. Stopped reading; no StrongMinds figure seen in those lines (only the "published" values 2.0, 3.918, 0.1624 for shared factors in a grep).

## Round 1 audit -> rebuilt on 2025
- 2025 audit exists: https://strongminds.org/wp-content/uploads/2026/08/2025-Audit.pdf (retrieved 2026-11-03; my earlier guessed URLs were wrong). Auditor's report dated June 25, 2026.
  - Statement of activities 2025 (p.6): "Program Services 7,316,320"; G&A 3,115,986; Fundraising 958,047; "Total expenses 11,390,353".
  - Functional expenses 2025 (p.8): Salaries 5,729,000; Employee benefits 942,229; Payroll taxes 492,163 (=7,163,392); Consultants 502,455.
  - Combining schedule (p.22): program USA 8,506,589, Uganda 4,703,501, Zambia 1,868,116, eliminations (7,761,886) -> USA direct 744,703.
  - Note 1 again: US activities "ceased effective December 31, 2024".
- Reach 2025: Q4 2025 report p.2 "2025 ACTUAL: 745,224" (p.1 says 754,224, typo); CPP $15. No 2025 country split published.
- Female suicide rates WDI SH.STA.SUIC.FE.P5 2021: Uganda 2.27, Zambia 3.09 per 100,000 female (https://api.worldbank.org/v2/country/UGA;ZMB/indicator/SH.STA.SUIC.FE.P5?format=json).

## Audit rounds
- R1: 1 high (2025 audit published -> rebuilt on 2025), 2 medium (rct_weight anchor, duration), 8 low. All fixed.
- R2: 0 high, 1 medium (duration 2.9 -> 2.6), 4 low. All fixed.
- R3: 0 high, 0 medium, 2 low (volunteer time priced in attribution 0.87 -> 0.84; write-up range). Fixed. Final 3.205 years/$1,000.
