# Research log: Dansk Vegetarisk Forening (DVF), build-cea blind run

Build date 2026-11-03. All retrievals 2026-11-03 unless stated.

## Blind-rule notes
- Never opened ACE's review/CEA/sheets for DVF, nor any other evaluator CEA of DVF.
- Incident 1: sandbox docs/normalization.md section 2.9 (read for the won-reform rules) still contains the
  phrase "Dansk Vegetarisk Forening's 70% to others" (ACE's coalition-credit split for DVF). Seen before I
  set my own attribution judgment. I did not use it; my attribution judgment (0.25) is reasoned below from
  the coalition list. Text not removed by the sandbox scrub: reported.
- Incident 2: normalization.md 2.9 also says "Denmark, Germany and China 1 (0.5-2)" for meal mix: that is the
  site's shared rule (same as the template's default), not a DVF figure; used as the template says.
- Incident 3: sandbox facts/fx.json already had usd_per_dkk_2023 (probably for the evaluator model). Not a
  CE figure. I used 2024 (added usd_per_dkk_2024).
- DVF's own narrative report says ACE recommended DVF (2024); no figure seen. Board report says ACE gave grants.

## Financials (audited, SR Revision A/S)
- Listing page: https://vegetarisk.dk/om-dansk-vegetarisk-forening/ (Årsregnskaber 2014-2024; latest 2024).
- 2024 accounts: https://vegetarisk.dk/wp-content/uploads/2025/11/regnskab-2024-underskrevet.pdf (identical
  md5 to .../2025/04/DVFaarsregnskab2025underskrevet.pdf). Income statement p.13 ("Side 13"), by nature
  ("Resultatopgørelsen er artsopdelt"): no functional/programme split.
  - "Udgifter i alt -15.678.864 -11.412.330" (2024, 2023)
  - "Regulering hensættelser -2.662.787 118.964" (net change in restricted provisions, an accounting
    transfer, not spending) -> real 2024 spending 13,016,077 DKK; 2023 11,531,294.
  - "Lønninger -8.624.778 -6.721.985" (note 14, incl. pensions, social contributions).
  - Note 16 Administrationsomkostninger "I alt 977.784 765.990".
  - Note 5: Fonden for Plantebaserede fødevarer 3,065,864 DKK income 2024 (DVF is also a grantee).
  - Board report p.8: "Omsætningen voksede fra 11,7 til knap 16,3 millioner kroner."
  - p.10: "Sekretariatet består nu af 27 medarbejdere."
- 2023 accounts https://vegetarisk.dk/wp-content/uploads/2024/05/2083-regnskab-2023-underskrevet.pdf:
  "Udgifter i alt -11.412.330 -9.762.044"; "Regulering hensættelser 118.964 -955.968".
- 2022 https://vegetarisk.dk/wp-content/uploads/2023/03/2083-regnskab-2022-underskrevet-5.pdf:
  "Udgifter i alt -9.762.044 -5.750.841"; "Regulering hensættelser -955.968 -258.147".
- 2021 https://vegetarisk.dk/wp-content/uploads/2022/06/dvf_aarsregnskab2021_underskrevet.pdf:
  "Udgifter i alt -5.750.840 -4.427.187"; 17 staff ("består nu af 17 medarbejdere").
- 2020 https://vegetarisk.dk/wp-content/uploads/2022/01/dvf-rsregnskab-2020.pdf:
  "Udgifter i alt -4.427.187 -3.243.570"; "Hensættelser, netto -602.177 51.650"; 9 staff.
- Real spending (total less provision changes): 2020 3,825,010; 2021 5,492,693; 2022 8,806,076;
  2023 11,531,294; 2024 13,016,077 DKK.
- CPI Denmark (World Bank FP.CPI.TOTL, via scripts/link-cpi.py DNK): 2020 110.805, 2021 112.843,
  2022 121.533, 2023 125.558, 2024 127.29.
- FX: IRS yearly average 2024 Denmark Krone 6.896 -> 0.14501 USD/DKK
  (https://www.irs.gov/individuals/international-taxpayers/yearly-average-currency-exchange-rates).

## Programmes (narrative report 2024)
- https://vegetarisk.dk/wp-content/uploads/2024/12/Aarsrapport-2024-web_Final.pdf, p.3: six programme
  areas (Politik, Erhverv, Uddannelse, Inspiration og oplysning, Samarbejde, Internationalt). No spending split.
- p.3: "Vi har inspireret politikerne til at afsætte yderligere 420 millioner til projekter målrettet
  plantebaserede fødevarer i regi af Fonden for Plantebaserede Fødevarer, som samtidig er blevet gjort permanent."
- p.7: coalition on green tripartite: "Plantebranchen, Rådet for Grøn Omstilling, World Animal Protection,
  Greenpeace og Klimabevægelsen"; ad with 51 other actors; "Det var især SF og Radikale, som fik forhandlet
  disse ting ind i aftalen".
- p.14: Grøn Januar 53 companies (42 in 2023); 409 products with Det Grønne Hjerte, 190 with V-label.
- p.11: inspiration sheets delivered to 5,000 eateries; 50 educational institutions in Grøn køkkenrejse.
- p.3: "i dag er vi 24 ansatte" (Dec 2024).
- No meals-replaced or outcome counts for Erhverv/Uddannelse/Inspiration programmes.
- Politik page https://vegetarisk.dk/politik/ : priorities incl. "Flere midler til Fonden for
  Plantebaserede Fødevarer", green option in all public kitchens; staff listed: 6 (2026 page).
- 2021 narrative https://vegetarisk.dk/wp-content/uploads/2021/12/dvfaarsrapport2021.pdf p.4:
  "Der afsættes 675 millioner kroner over 8 år til en ny fond for plantebaserede fødevarer";
  "Den plantebaserede satsning i landbrugsaftalen skyldes nogle visionære og engagerede politikere, der
  undervejs har modtaget faglige input via DVF samt vores tværgående samarbejder ... med især
  Plantebranchen, Økologisk Landsforening og andre grønne organisationer." Also 580 M DKK CAP premium for
  food crops, national action plan (not modelled).
- Search snippet (not opened): bill notes say recommendations from organisations incl. DVF; DVF holds a board seat.

## Plant fund (Plantefonden)
- https://www.plantefonden.dk/hvem-er-vi/om-plantefonden : "Fonden blev i 2023 finansieret med 675 mio. kr.
  fra 2023 til 2030." "... blev Plantefonden stadfæstet som en permanent ordning. Samtidig tilførtes
  Plantefonden yderligere finansiering for i alt 420 mio. kr. i årene fra 2025 til 2030."
  Law adopted 23 Feb 2023; first grants Nov 2023.
- Home page plantefonden.lbst.dk: 4 rounds, 154 grants, 589 M DKK; 2026 round 195.5 M DKK, 38 projects.
- Årsberetning 2025 https://www.plantefonden.dk/Media/639264338316372413/Fonden_for_Plantebaserede_Fødevarer_Årsberetning_2025.pdf
  p.4: "I 2025 har Plantefonden givet tilsagn til 45 nye projekter for et samlet beløb på 213,1 mio. kr."
  (50 M of it a research special pool from another agreement). p.13: 57% demand, 23% supply, 20% sector.
  p.14: 34% of 2025 pool to professional kitchens/foodservice. p.34 (Grøn skolemad, 10,518,097 kr):
  "Målet er, at der serveres minimum 1.440.000 plantemåltider i projektperioden." -> 0.137 plant meals/DKK target.
  p.38: 19 completed projects; success-rate goal 70% met (by the fund's own grading).
  Effect model introduced only in 2025: no measured meal outcomes yet.
- 2024 round: 122.6 M DKK, 35 projects (search snippet of tilsagnskatalog 2024).

## Inaccessible
- ft.dk parliamentary documents (403 / bot check): appropriation by year.
- plantefonden.lbst.dk older PDFs returned HTML (bot page).

## Judgments (my own)
- Policy share of spending 2020-2024: 0.3 (0.15-0.45): policy team ~4-6 of 9-27 staff plus comms support;
  DVF's 2020-21 reports describe mostly political work, later growth in projects (PBV, FØL, Plant fund).
- DVF share of advocacy resources behind the fund: 0.25 (0.1-0.5).
- Meals replaced per DKK of fund grants: 0.03 (0.003-0.15): anchored on the school-food project's 0.137
  plant meals/DKK target; about half of the pool in comparably direct meal projects; part of plant meals
  would have been served anyway; persistence and supply/R&D effects partly offset.

## After audits (r1-r3)
- policy_share 0.3 -> 0.25 (staff page: 9 under policy, 6 of them the EU diplomacy project); meals split into
  meals_in_project_per_dkk 0.025 x (1 + persistence 1, discounted to stream middles); wait 1.7; unmodelled other
  wins 8% (crop premium 580M, action plan, research money incl. 50M pool, DVF's 988,000 DKK provision for research work).
- Anchors added by auditors and checked: Thorsen et al. 2010 PHN 13:1647-52 (4/5 canteens sustained at 5 years);
  Garnett et al. 2019 PNAS (no compensation at evening meal). First grants Nov 2023 (plantefonden.dk/om-plantefonden).
- Final: 0.7596 ced/$ = 0.277 years of healthy life per $1,000.
