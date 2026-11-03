# Research log: Sociedade Vegetariana Brasileira (blind build-cea run), 2026-11-03

## Blind-rule incidents
- 2026-11-03: a repo-wide grep for "vegetariana|svb" inside the sandbox (to find existing records) printed lines of
  facts/sad_factors.json, docs/normalization.md and src/engine/normalization-waivers.json that quote ACE's SVB figures
  (an ACE per-meal SADs figure for SVB, and before/after normalization figures for the ACE SVB model in normalization.md tables).
  Not followed or used; these lines are not read further. The shared fact @sad_factors.sads_per_meal_replaced is used as the template requires.

## Money
- https://svb.org.br/a-svb/prestacao-de-contas/ (2026-11-03): links balance sheets 2014-2023; latest = 2023:
  https://svb.org.br/wp-content/uploads/2024/08/FinanceiroSVB2023.pdf (retrieved 2026-11-03). Demonstrações Contábeis 2023 e 2022,
  signed by accountant Aguinaldo Luiz de Lima CRC/SP 160005/O-5 (prepared by accountant; NOT an independent audit report).
  p.2 DRE 2023: Receitas operacionais 2.244.685,21; "CUSTOS COM PROGRAMAS(ATIVIDADES) (2.837.379,73)"; Despesas operacionais (194.513,70)
   (Administrativas 175.732,18; Depreciação 8.656,20; Financeiras 10.125,32). Deficit 787.208,22.
  2022: programme costs 2.098.514,85; desp. operacionais 173.073,85; contributions & donations 3.270.745,86.
  p.9 note 12, 2023: Custos com Pessoal 276.015,52; Assessorias e Consultorias 1.683.375,40; Comunicação 283.772,22; Viagens 139.129,46;
   Custos Gerais 455.087,13. 2022 personnel 0, consultancies 889.088,70 (staff largely contracted as PJ consultants).
  Total expenses 2023 = 2.837.379,73 + 194.513,70 = 3.031.893,43 BRL. No split by programme.
  Revenue 2023: donations 1.601.014,52; services (e.g. Selo Vegano certification) 382.156,70; financial income 261.513,99.
- FX: IRS yearly average table https://www.irs.gov/individuals/international-taxpayers/yearly-average-currency-exchange-rates (2026-11-03):
  Brazil Real 2023 = 4.994 per USD (2025 5.593, 2024 5.392, 2022 5.165). Added facts/fx.json usd_per_brl_2023 = 1/4.994.
- No 2024 or 2025 accounts on the prestação de contas page (checked 2026-11-03): 2023 is the latest year with financials.

## Programmes / headcount
- https://svb.org.br (2026-11-03) programmes: Segunda Sem Carne, Opção Vegana, Selo Vegano, campaigns (Bomba Relógio etc.), VegFest, Green Team, Clube SVB.
- https://brazilianvegetariansociety.com.br/ (2026-11-03): four programmes: 1 Meat Reduction Programs ("brings plant-based meals into schools,
  hospitals, and community kitchens through training, workshops, and menu support"; "Over 530 million plant-based meals have been served since
  this program started in 2009"); 2 Advocacy / Sustainable Municipal Menu ("14 plant-based meal bill proposals being officially submitted");
  3 Movement building (700+ volunteers, 50+ cities); 4 Content & social media (30+ e-books).
- https://svb.org.br/a-svb/sobre-a-svb/equipe-e-departamentos/ (2026-11-03, current page, not 2023): 42 names; Políticas e Programas
  Alimentares 3, Programas e Parcerias Institucionais 1, Relações Governamentais 1, Gastronomia 1, Saúde e Nutrição 7 (1 = Coordenadora de
  Desenvolvimento de Projetos), Certificação 4, Eventos 3, Voluntariado 2, Financeiro 2, Arte/Design 2, Comunicação 1, Imprensa 1, Marketing 1,
  Captação 1, Filiação 1, Comunidade 1, Restaurantes 1, Mercado Vegano 1, Meio Ambiente 1, Veterinária 1, board-only 4, others 2.
  Institutional meals + municipal policy ≈ 6–8 of ~38 working staff ≈ 15–21%; plus share of leadership/comms → judgment 25% (15–40%).

## Reach (Segunda Sem Carne institutional meals)
- Greenpeace Brasil blog (~Oct 2019, 10th anniversary; image path /2019/10/), https://www.greenpeace.org/brasil/blog/voce-pode-trocar-sua-carne-de-segunda-por-uma-saborosa-refeicao-vegetariana/ (2026-11-03):
  "mais de 327 milhões de refeições vegetarianas e veganas foram oferecidas desde 2009" (Monica Buava, SVB).
- SVB 18/10/2024, https://svb.org.br/comemoracao-dos-15-anos-da-segunda-sem-carne-no-brasil-reuniu-parceiros-amigos-e-jornalistas/ (2026-11-03):
  "já foram servidas mais de 530 milhões de refeições com proteína vegetal"; partners prefeituras, empresas, assistência social, hospitais; honoured CEJAM and CODAE.
- => (530 − 327) / 5 years = 40.6M meals/yr average Oct 2019–Oct 2024 (includes 2020–21 school closures).
- Flow points: 2017 ~47M (Folha 2018 via pt.wikipedia); 2018 67M (SVB headline https://svb.org.br/2501-segunda-sem-carne-atinge-marca-de-67-milhoes-de-refeicoes-em-2018/);
  2019 ~80M (pt.wikipedia citing A Lavoura). Search snippet: >500M by Feb 2024 (SVB note, not opened) -> Feb–Oct 2024 at most ~30M, ≈ ≤45M/yr.
- 2023 flow judgment: 1.1 × average (0.8–1.6): schools reopened after 2020–21; 2019 peak 80M = 2.0× avg is above the high end because
  the 2024 gain suggests ~45M/yr.
- Counting method never published; self-reported by SVB from partner data; meals are "proteína vegetal" (vegetarian, may contain egg/dairy).
- SMADS São Paulo (2018 article): planned 11.5M meals/yr in 1,200 social-assistance establishments.
- Ubatuba 2022: plant-based Wednesdays for >12,000 students (search snippet of svb.org.br post).
- 2019 balanço https://svb.org.br/2578-... : SSC trained 1,239 cooks and 52 nutritionists in 2019.

## Effect / evidence
- Garnett et al. 2019 PNAS 116(42):20923-9 (PubMed 31570584; summaries via search 2026-11-03): doubling veg options 25→50% raised veg sales
  14.9/14.5 pp (observational) and 7.8 pp (experimental); "no detectable rebound effects" at other mealtimes. Used as anchor for limited compensation.

## Blind-rule incidents (continued)
- Search snippets (2026-11-03) mentioned that ACE recommended SVB / rated its institutional meat reduction work as cost-effective (no figure).
  The link to ACE's SVB review (animalcharityevaluators.org/charity-review/sociedade-vegetariana-brasileira-svb/) and a news article
  ("ONG brasileira é reconhecida como uma das mais eficazes no mundo") appeared in results; not opened.

## Audit-driven additions (verified against SVB statements in scratchpad/svbdl, extracted by auditor r2)
- Total expenses: 2014 278.800,33; 2015 728.993,34; 2016 528.975,59; 2017 878.853,52; 2018 1.269.406,52; 2019 1.482.943,78 (2020 stmt comparative);
  2020 1.490.675,23; 2021 1.632.580,53 + 294.574,32; 2022 2.098.514,85 + 173.073,85; 2023 3.031.893,43. IPCA (IBGE) 2015 10.67, 2016 6.29, 2017 2.95,
  2018 3.75, 2019 4.31, 2020 4.52, 2021 10.06, 2022 5.79, 2023 4.62. Real 2015–2023 sum R$15,991,453; 2014 real R$465,205.
- 2019 meals 81M: thesis https://axis.ghc.com.br/bitstreams/b8125e84-7f9a-4ed9-8b20-3da5a5b331b3/download (quoted via search snippet; auditor r1 verified).
Final: 29.76 ced/$ = 10.87 years of healthy life per $1,000.
