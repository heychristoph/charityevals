# Research log: Helen Keller Intl (blind build-cea run), build date 2026-11-03

## Blind-rule incidents
- 2026-11-03 WebSearch "Helen Keller Intl vitamin A supplementation cost per child..." : summary snippet quoted GiveWell's CE estimate (deaths per $ range by country). Not followed, not used.

## Financials (FY ending 30 June 2025, audited, Tait Weller report dated 9 Feb 2026)
URL: https://helenkellerintl.org/wp-content/uploads/2026/03/Helen-Keller-Intl_FY25-Audited-Financial-Statements.pdf (retrieved 2026-11-03)
- p.4 Statement of activities FY25: US Vision 3,605,683; Nutrition, including Vitamin A 76,889,685; International Eye Health 722,776; NTD 13,112,320; Distribution of medicines (in-kind) 10,538,535; total program services 104,868,999; M&G 16,373,434; fundraising 4,639,629; total expenses 125,882,062.
- p.6 functional expenses: Total expenses before in-kind 115,343,527; program services before in-kind 94,330,464; Personnel total 46,180,105.
- Note 2: in-kind = Mectizan, $10,538,535 FY25, "for the treatment of onchocerciasis and lymphatic filariasis".
- Balance sheet: cash 36,858,719 (2025) / 46,132,313 (2024); cash intl offices 3,035,790/3,870,775; investments 91,136,492/73,165,712. Dividends and interest income 2,031,331. Deferred revenue 29,653,796. Restricted net assets Nutrition 94,725,555.
## Form 990 FY25 (tax year 2024, FYE 6/2025)
URL: https://helenkellerintl.org/wp-content/uploads/2026/04/FY25_Helen-Keller-Intl_Form-990_final_website.pdf
- Sched O 4b: "...TO REACH OVER 47 MILLION CHILDREN UNDER THE AGE OF FIVE WITH TWO DOSES OF VITAMIN A SUPPLEMENTATION" (14 African governments)
- 4c NTD: "TREAT MORE THAN 32.3 MILLION INDIVIDUALS FOR AT LEAST ONE OF THESE FIVE DISEASES IN SEVEN AFRICAN COUNTRIES"; 2,400 trichiasis surgeries; 1.6m screened for trachoma.

## 2025 Annual Report (FY25), https://helenkellerintl.org/wp-content/uploads/2026/04/HKIntl_2025AnnualReport_Donor-List.pdf (retrieved 2026-11-03)
- p.2 "You helped us reach more than 47 million children with vitamin A"; p.4 "94 Million vitamin A capsules distributed"
- p.5 NTD: "Reached more than 32 Million individuals with treatment for at least one neglected tropical disease, protecting their livelihoods for about 75 cents each."
- p.5 "Vitamin A costs just a little more than $1 a dose"
- letter: termination of US government funding during the year.
- Board active "Fiscal Year 2025 (July 1, 2024 – June 30, 2025)" => report covers FY25.
- annual-reports page (https://helenkellerintl.org/who-we-are/annual-reports/?pdf-id=22776) is behind a Cloudflare bot check: not bypassed; used direct upload URL from search.

## Vitamin A pages
- https://helenkellerintl.org/combatting-vitamin-a-deficiencies/ (2026-11-03): "in 2025 ... more than 94.4 million capsules of vitamin A"; "a little more than $1 a dose".
- https://helenkellerintl.org/support-our-vitamin-a-work/: "Reach 47 million children under five", "Distribute 94.4 million vitamin A capsules".
- N4G pledge: https://globalnutritionreport.org/resources/naf/commitment-tracker/helen-keller-intl-o4v6-2/provide-lifesaving-vitamin-supplementation/ : "commits at least US$35 million per year" 2025-2027 "to reach around 40 million children between 6–59 months of age", nine African countries.

## Country one-pagers 2025 (https://helenkellerintl.org/wp-content/uploads/2026/05/HKIntl_Country1Pg_<X>_2025.pdf), VAS children:
Niger 7.3m ("Reached more than 7.3 million children under the age of five with two doses of vitamin A"); Mali 3.6m; Burkina Faso (BurkinaFaso) 1.6m; DRC 10.8m (96%); Guinea 3.7m; Cameroon 6m; Cote-dIvoire 4.7m (96%); Kenya 948,860; Madagascar >1m; Mozambique 1.4m; Tanzania 492,000 (100%); Senegal 570,000. Sum 42.11m; remainder 4.89m to 47m assigned Nigeria (no sheet found; Nigeria/Sierra Leone URLs return HTML).
Operating budgets (context): Niger $5.1m, Mali $5.1m, BF $3.9m, DRC $8.5m, Guinea $2.8m, Cameroon $7.2m, CIV $5.4m, Kenya $3.1m, Madagascar $1.8m, Mozambique $2.38m.

## Mortality: UN IGME via World Bank API (SH.DYN.MORT, SP.DYN.IMRT.IN, SH.DYN.NMRT), 2023, retrieved 2026-11-03
https://api.worldbank.org/v2/country/NER;MLI;.../indicator/SH.DYN.MORT?date=2023
BFA 77.4/44.9/24.2; CIV 66.5/46.2/27.9; CMR 67/41.3/25.2; COD 91.3/57.2/23.9; GIN 95/61.4/30.3; KEN 39.6/34.7/21.1; MDG 63.6/43.7/23.3; MLI 76.2/49.3/28.7; MOZ 61.7/44.9/25.6; NER 113.5/66.9/33.2; NGA 116.8/70.1/39.2; SEN 38.2/30/21.7; SLE 93.8/56.3/28.8; TZA 38.5/29.7/20.6
Method: deaths 6-59m per 1000 births D = U5 - NMR - f(IMR-NMR), f=share of post-neonatal infant deaths at 1-5 months (0.5; 0.3-0.7); survivors at 6m S=1000-NMR-f(IMR-NMR); rate = D/S/4.5. Reach-weighted: 0.01054 (f .3: 0.01169; f .7: 0.00938). Reach-weighted U5MR 86.8.

## Effect
- Imdad et al. 2022 Cochrane, PubMed https://pubmed.ncbi.nlm.nih.gov/35294044/ (2026-11-03): all-cause mortality "risk ratio (RR) 0.88, 95% confidence interval (CI) 0.83 to 0.93; high-certainty evidence", 19 trials, 1,202,382 children. Diarrhoea RR 0.88 (0.79-0.98); measles 0.88 (0.69-1.11).
- Hamory et al. 2021 PNAS, abstract via Europe PMC REST (PMC8040658; pnas.org 403, PMC bot check): "Individuals who received two to three additional years of childhood deworming experienced a 14% gain in consumption expenditures and 13% increase in hourly earnings."

## Round-1 fixes sources
- Miguel & Kremer 2004 Econometrica, https://emiguel.econ.berkeley.edu/wordpress/wp-content/uploads/2021/03/Paper__Worms.pdf (2026-11-03), p.168: "Ninety-two percent of surveyed pupils had at least one helminth infection and thirty-seven percent had at least one moderate-to-heavy helminth infection"; "schools with geohelminth prevalence over 50 percent were mass treated with albendazole every six months".
- Blind incident (reported by auditor r1): src/engine/normalization-waivers.json holds a waiver for the excluded helen-keller-vas model stating an evaluator's VAS income/mortality ratio (0.245). I did not open it; I used the shared @givewell_shared.income_to_mortality_value_ratio (0.30647, the malaria-model figure) as New Incentives does.
- Search snippet incident (round 1 research): Kristof / NYT page on HKI site mentions "$380 million to reach 190 million children" (HKI's own figure; not an evaluator CE). Not used.

## Round-2 fixes sources (found by auditor r2; abstracts re-read by me via Europe PMC REST, 2026-11-03)
- Burkina Faso schistosomiasis 16 districts 2023-24, PMID 39913556 (PMC11813138): "The overall prevalence of schistosomiasis was 2.4% ... overall prevalence of HI infection of 0.9%".
- Sierra Leone STH 2016, PMID 31262367: "any STH 18.3%"; "three (0.08%) children had heavy infections and nine (0.25%) children had moderate infections" (hookworm).
- HKI 2025 AR p.5: "Vitamin A costs just a little more than $1 a dose" -> campaign cost per dose 1.05 (1.0-1.25).
