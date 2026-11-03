# Research log: Friendship Bench (blind build-cea run), 2026-11-03

All retrieved 2026-11-03 unless stated.

## Charity's own sources
- https://www.friendshipbenchzimbabwe.org (home): "1,290,861 clients seen", "3,000 CHWs trained" (last updated Oct 2026). No financials. The home page links an HLI charity listing: NOT followed (blind list).
- https://www.friendshipbenchzimbabwe.org/impactreports : links annual reports 2020-2025 and quarterly reports (Google Drive). No audited financial statements listed.
- Annual report 2024 (Drive id 1OdRIWIcOX7ZIxq_zaIWRB2WsxQ0GQrgF), downloaded via drive.google.com/uc?export=download, text with pypdf:
  - p.6 "TOTAL NUMBER OF CLIENTS SEEN BY FRIENDSHIP BENCH IN 2024" 295,770 (285,900 face-to-face incl. implementing partners; 9,870 online WhatsApp).
  - p.9 programme matrix 2024: "# of Clients seen ... 295,770"; "# of Follow-up sessions ... 47,073"; CKT groups created 280; partnerships column 7,382 clients.
  - p.7 "The Quality and Customer Satisfaction team conducted follow ups with a 10% random sample of the clients seen at 6 weeks"; 82% decrease in SSQ-14 symptoms (pre-post, no control).
  - p.7 "Total number of community health workers providing support 2773".
  - p.3 auditors: VISTA Chartered Accountants (Harare). Statements not published.
  - p.10: handover to MoHCC launched Oct/Nov 2024; national rollout by 2028.
  - p.11: Global Fund HIV/MH integration (93 cadres, 292 clients 2024); WHO FRIENDZ (6,198 clients 2024); p.12 USAID DIV ended 2025; p.13 OPHID RISE (3,797 health workers).
  - p.20 "Over the next 2 years (January 2024 -December 2025), we need to raise US$8 million: $4.9M (60%) to [programmes] ... $3.1M (40%) to Marketing, finance, HR, administration, fundraising costs which underpin programme delivery." (Same in AR 2023 p. near end.)
  - p.19 "we reached nearly 300,000 individuals"; individual funders listed.
- Annual report 2025 (Drive id 1jcoxqvNNTnkIsByD-dSK-u0gnaQzUYCQ):
  - p.10 "TOTAL NUMBER OF CLIENTS SEEN BY FRIENDSHIP BENCH IN 2025" 336,215 (328,876 face-to-face; 7,339 online).
  - p.11 follow-up sessions 2025: 3,284 (definition changed vs Q1/Q2 2025 reports, which give 82,245 and 81,295 "follow-up sessions" per quarter).
  - p.12 "From a target cohort of 13,864 clients enrolled between January and December 2025, ... completed six-weeks follow-up contacts with 5,686 individuals, achieving a 41% follow-up contact rate. Complete clinical data (baseline and follow-up SSQ14) were captured for 3,009 clients."
  - p.13 recovery 85.2% (SSQ14<=7 at 6 weeks among 2,990 symptomatic), pre-post only; "reliability issues missed counselling sessions and incomplete follow-ups by the lay health workers are the primary drivers of suboptimal satisfaction."
  - p.11 "we serve 64% of women".
  - p.20 2026 need "US$4.1 million ... delivering mental health support to 380 000 people".
- Q1 2025 report p.~7: quotes the 2025 World Happiness Report with an evaluator's WELLBYs-per-$1,000 figure for Friendship Bench. BLIND INCIDENT: seen in text extraction while grepping; not used.
- Q1 2026 / Q2 2026 reports: 88,436 and 86,832 clients seen; 2,205 / 2,726 follow-up sessions.

## Financial filings (US affiliate, The Friendship Bench Inc, EIN 85-3440548)
- ProPublica pages behind a bot check for XML/PDF; not bypassed. Summary page (projects.propublica.org/nonprofits/organizations/853440548): FY2024 revenue $1,278,819, expenses $3,103,651.
- IRS e-file XML from the IRS's own bulk archive (apps.irs.gov/pub/epostcard/990/xml/2025/2025_TEOS_XML_11B.zip, object 202543189349315039, extracted by range request):
  - TotalEmployeeCnt 0; CYTotalExpensesAmt 3103651; CYGrantsAndSimilarPaidAmt 2810000; TotalProgramServiceExpensesAmt 3030926; M&G 63225; fundraising 9500.
  - Schedule F: RegionTxt ZIMBABWE, PurposeOfGrantTxt PROGRAM SERVICES, CashGrantAmt 2735000.
  - Schedule I: London School of Hygiene and Tropical Medicine (US address) $75,000.
  - FeesForServicesOther 258,253 (program 209,378).
  - IndependentAuditFinclStmtInd false.
- FY2023 (object 202443189349309314, 2024_TEOS_XML_11A): expenses 2,797,049; Schedule F Zimbabwe 2,640,200.
- No 2025 990 in the IRS index (index_2026.csv) as of today.
- CauseIQ: grants received 2024: Rippleworks $2,000,000 and $500,000; National Philanthropic Trust $1,500,000.
- Lever for Change directory: annual operating budget "$1.1 to 5 Million" (search snippet).
- africa.com KBF prize article: "Costing just $13-16.50 per client served" (unattributed).
- Search snippet showed an HLI cost-per-person figure for Friendship Bench: NOT used (blind incident, snippet only).

## Literature
- Chibanda et al. 2016, JAMA 316(24):2618 (https://jamanetwork.com/journals/jama/fullarticle/2594719): 573 randomized, cluster RCT, Harare; 6 sessions PST by lay health workers ("grandmothers") + optional peer group; control enhanced usual care. SSQ-14 6 months AMD −4.86 (−5.63 to −4.10). PHQ-9 continuous (not prespecified) AMD −6.36 "(95% CI, −6.45 to −5.27)" [CI as printed, not centred on the estimate]; Table 2 arm means 4.50 (3.95–5.05) vs 11.01 (9.78–12.24). Median 5 sessions (IQR 4–6); 39.9% all 6. Suicidal ideation 2.3% vs 12.3% at follow-up. Median follow-up 171 days.
  - Derived SE of difference from arm CIs: SE_i=(5.05−3.95)/3.92=0.281, SE_c=(12.24−9.78)/3.92=0.628, SE_diff=sqrt(0.281²+0.628²)=0.688 points.
- Karyotaki et al. 2022 JAMA Psychiatry 79(5):430 (IPD-MA task-shared psychological interventions, LMICs; PDF https://cquin.icap.columbia.edu/wp-content/uploads/2023/06/jamapsychiatry_karyotaki_2022_oi_220009_1664919228.58277.pdf): "The 2-stage IPD-MA resulted in a g of 0.32 (95% CI, 0.18-0.46; P < .001) ... The PIs ranged from g = −0.12 to 0.76." Conventional MA of 13 trials g 0.48 (0.26–0.68). Chibanda 2016 is not among the IPD trials (Table 1); Abas 2018 Zimbabwe PST pilot is.
- Cuijpers et al. 2018 World Psychiatry 17(1):90 (https://research.vu.nl/ws/files/105028031/...): non-Western g 1.10 (0.91–1.30), after trim-and-fill 0.73 (0.51–0.96); low risk of bias studies g 0.51 (0.34–0.69).
- RE-AIM evaluation of FB scale-up (Europe PMC PMC9682765, BMC HSR 2022): routine FB data "not reliably available"; reach 9–34% by clinic size; programme "up to 6 sessions of PST"; CHWs are "employed as health promoters by the respective city health authorities" with a basic salary.
- Weobong et al. 2017 PLoS Med (HAP 12-month): gains held from 3 to 12 months (search summary; abstract via ideas.repec.org).
- Suicide: World Bank API (source WHO GHE), Zimbabwe 2021 crude per 100,000: total 17.34, male 23.57, female 11.71 (https://api.worldbank.org/v2/country/ZWE/indicator/SH.STA.SUIC.FE.P5, .MA.P5).
- WHO GHO API returned server error 500 (not accessible).
- PMC direct pages behind bot check; used Europe PMC REST and author PDFs instead.

## Not accessible
- Friendship Bench Zimbabwe PVO audited financial statements (not published).
- ProPublica 990 PDF/XML (bot check), WHO GHO API (500), PMC pages (bot check).

## Checks added during the build
- Chibanda et al. 2011 BMC Public Health 11:828 (Europe PMC abstract, PMC3210104): "The drop in SSQ scores was proportional to the number of sessions attended." 8% of potentially eligible excluded for high suicide risk.
- Chesney, Goodwin & Fazel 2014 World Psychiatry 13(2):153 (Europe PMC abstract, DOI 10.1002/wps.20128): "Borderline personality disorder, anorexia nervosa, depression and bipolar disorder had the highest suicide risks." No RR in the abstract; RR 5 (2.5-15) is a judgment.
- World Bank SP.POP.0014.TO.ZS Zimbabwe 2024: 40.87% of population aged 0-14.

## Round-2 additions (2026-11-03)
- Q1 2024 impact report (Drive 11JxYcf8HFB9U6RRzlIXnSOjDMpRNyiTP) p.4: clients seen 69,721; follow-up sessions 4,707.
- Q2 2024 (1rpPGQcpWhn-eRIBSHncfk-x09HXVtjVZ) p.4: 71,388; 75,256.
- Q3 2024 (1Tn-Yt4UVmPet18vFSkj5_AnCdaxPS5qp) p.5: 76,087; 82,313. p.6: "4,050 clients were randomly sampled from the Q3 2024 reach ... managed to call 1003"; 966 with SSQ14 >8 at baseline; 851 <=7 at six weeks.
- Q1-Q3 2024 totals: 217,196 clients, 162,276 follow-ups (0.747/client) vs annual report 47,073 for the full year: contradiction; best guess 0.747 x 295,770 = 220,980.
- The Standard article on USAID (thestandard.co.zw ... 200038695) returns 404: DIV amount dropped.
- WHO GHO API still HTTP 500 at round 2.
- Vivalt 2020 JEEA and Bold et al. 2018 J Public Econ cited qualitatively as anchors for trial_weight_discount (from my own knowledge, not fetched).

## Round-3 additions
- WHO GHE 2023 summary tables (Sept 2026), deaths by country/age/sex xlsx (downloaded by the round-3 auditor from the WHO GHE page; verified by me with openpyxl): ZWE 15-29 F pop 2290.681k, self-harm 0.0648k; 30-49 F 2018.464k, 0.1105k; M 2169.345k/0.1908k and 1589.479k/0.3100k → F 4.07, M 13.32 per 100k ages 15-49.
- Schleider & Weisz 2017 JAACAP (Europe PMC abstract): SSIs g = 0.32 across 50 RCTs; depression 0.21.
- Kopta 2003 J Clin Psychol summary of Howard et al. 1986 dose-effect study (Europe PMC record).
