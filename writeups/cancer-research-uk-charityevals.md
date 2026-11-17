### Summary

Cancer Research UK is the world's largest charitable funder of cancer research. It also campaigns on cancer policy and runs public cancer information. This is charityevals' own model of all its charitable work in the year to 31 March 2026: research, policy and information.

We estimate **{{result}} years of healthy life per $1,000** you give. Almost all of it rests on judgment: how much of the world's cancer a year of research averts, how many years sooner, and what share of the field Cancer Research UK is. The range runs across several orders of magnitude. None of the three branches has measured outcomes for Cancer Research UK's own spending, so each is discounted for missing data.

### What the charity does

Cancer Research UK spent £474.0m on its charitable work in 2025/26:

- **Research, £441.4m (93%):** grants to universities and hospitals (£313.5m), its own institutes, clinical trials units and Cancer Research Horizons (£115.5m), and support costs. On a cash basis it spent £416m: £88m on basic biology, £185m on research into specific cancers (bowel, lung, brain and leukaemia lead), £87m on research relevant to all cancers, £24m on turning results into drugs and tools, and the rest on administration and royalty shares.
- **Cancer information and influencing, £32.6m (7%):** policy campaigns in all four UK nations, and public information (its website, Cancer Chat, a nurse helpline, roadshows and workshops: about 27 million interactions).

The accounts don't split information from influencing; we judge policy at about 40% of it.

Raising money cost £140.2m. The shops and events cost £0.9m more than they brought in. Both are spread over the charitable spending, about 30p on each pound.

### How the impact happens

**Research.** Research leads to new drugs, tests, screening programmes and treatment guidelines, which reach practice about 15 years after the money is spent. A year of the world's cancer research brings those advances forward. Cancer Research UK gets credit for its share of that research.

**Policy.** Through its Smokefree UK campaign, Cancer Research UK pressed for the Tobacco and Vapes Act, which became law in April 2026. It bans tobacco sales to anyone born on or after 1 January 2009. Each year the ban arrives sooner, one more birth cohort grows up with less smoking. That cohort is about 820,000 people, and its health gains come decades later.

**Information.** People who know the signs of cancer and their screening invitations go to their doctor sooner. Cancer found at an earlier stage is more often cured.

### How the model works

Research is the medical-research template's chain:

- **Burden:** the world's cancer burden, 255 million DALYs a year (WHO Global Health Estimates 2021).
- **Share averted:** what a year of the field's research averts once adopted, 0.13% a year (one judgment, 0.03% to 0.5%). The US cancer death rate fell 34% from 1991 to 2022. About half of that came from earlier detection and better treatment, the rest mostly from less smoking. Rich countries carry under a quarter of the world's cancer burden, uptake elsewhere is lower, and about half of the gain is uptake of older advances rather than new research.
- **Timing:** brought forward 5 years, after a 15-year wait.
- **Adjustments:** our trust in the evidence (0.7), then Cancer Research UK's share of the world's cancer research funding, about 0.6%. All funders together spend about $100bn a year: some $16bn from governments and charities, and some $85bn from industry, for which cancer is the largest area (38% of its new trials).
- **Check:** the 10% return in UK health gains found for UK cancer research implies about 30 times the chain's figure per pound. That study credits UK research with UK gains generously and calls itself a best case. The world also spends several times as much on cancer research as on heart research, for a smaller burden. The model shows both rows.

The policy branch follows the government's impact assessment of the law. Its figures are the site's shared tobacco figures:

- **Effect:** 8 percentage points of each covered cohort kept from smoking.
- **Health gain:** 3 healthy years lost per young smoker, arriving about 40 years later and discounted.
- **Side effects:** less second-hand smoke ({{row:adv_secondhand_smoke_share}} more), less the harm of those who vape instead (3%).
- **Credit:** a fifth of the whole campaign took place this year. Cancer Research UK has a quarter of the campaigning groups' resources behind the law; the government and Parliament that made it are credited through the mobiliser's share.
- **Years counted:** the site's shared years a won reform counts.

The information branch works at UK scale:

- **Burden:** the UK's cancer burden, 3.7 million DALYs a year.
- **Share averted:** a year of everyone's cancer information and awareness work averts about 0.1% of it, through earlier diagnosis. The anchor is the national Be Clear on Cancer lung campaign: 3.1 percentage points more lung cancers found at the earliest stage and 2.3 points more operations, about 0.03% of the UK burden from one campaign.
- **Adjustments:** trust 0.6. Cancer Research UK has a fifth of the resources: the NHS and Macmillan Cancer Support do more.

**Deaths by age.** The DALYs in every branch are mostly years lost to deaths, mostly at older ages. As everywhere on the site, each DALY is split into its illness part and the deaths behind the rest, and each death is valued at the site's value of a death by age (WHO's age split: 47% of the world's cancer deaths come at 70 or older, 70% of the UK's).

Each branch is multiplied by the shared "How much we count a programme whose results aren't measured", because none has measured outcomes. The result divides spending by what past work of the kind achieved, so it is a past average. The next dollar counts at Cancer Research UK's own share of that average (56%): it spends more than it raises and is drawing its reserves down to fund research.

### What drives the result

- **The missing-data discount** (your value judgment).
- **The share of the burden a year of research averts:** 0.03% to 0.5%.
- **The discount rate:** a 15-year wait makes the result sensitive to it.
- **Years brought forward** (2 to 15) and **Cancer Research UK's share of the field** (0.3% to 1.2%).
- **The next dollar against the past average:** 30% to 85%.

Research is about 34% of the result, policy about 62% and information about 4%. Per pound, the policy work does about sixty times as well as research and the information work about twice as well, but together they are 7% of the spending.

### Biggest uncertainties

- No study measures what one funder's research is worth. The chain is calibrated on the record of falling cancer death rates and on returns-to-research studies, and the two disagree by about 30 times.
- Credit is split by share of funding. Industry pays for most cancer research, and we count all of it.
- The smokefree-generation effect is modelled, not observed.
- What a standing information service does to diagnosis has not been measured; campaign evaluations are before-and-after comparisons.

### What isn't modelled

These get a share of the unmodelled benefits (7%, -8% to 27%), not a chain of their own:

- Other policy wins this year: limits on junk-food advertising came into force, and the National Cancer Plan for England adopted targeted lung screening and earlier-diagnosis commitments, mostly announced before.
- The research workforce, institutes and tools that later research uses; the start-ups Cancer Research Horizons forms.
- The Act's limits on youth vaping.
- Research effort drawn from other diseases, and overdiagnosis from awareness work.

### How this model was checked

Mechanical checks: lint, the normalization invariants and the reference class (`scripts/audit-model.ts`).

Independent audit round 1 (1 high, 0 medium, 2 low). What changed:
- **Cancer Research UK's share of the field:** industry's cancer research was scaled from the share industry pays of all US medical research. Cancer is industry's largest area (38% of its new trials), so industry's part is now global pharmaceutical R&D times cancer's share. The share fell from 1.5% to 0.6%, and the result from 0.003 to 0.002.
- **Smaller fixes:** the half of the fall in cancer deaths credited to detection and treatment is labelled as our judgment; the royalty shares passed on are said to be counted as cost.

Independent audit round 2: a pass, with no high findings, 1 medium and 2 low. What changed:
- **The medium** was in another model and is fixed there.
- **The lows:** the range of the share of the field now says what widens it beyond its anchors, and the check against the returns study gives the right ratio, about 30 times.

Verification round 3: a pass. It corrected one figure in the share of the field's explainer; a last verification checked those.

Verification round 5 (2026-11-14): a pass. The policy branch now reads the site's shared tobacco figures, with credit as Cancer Research UK's share of the campaigning groups' share, and second-hand smoke and vaping as side-effect rows in place of part of the unmodelled share. The result moved by under 1%.

### Sources

- [Cancer Research UK, Annual report and accounts 2025/26](https://downloads.ctfassets.net/u7vsjnoopqo5/5mIQtPIZ43jHIbMTdSfRYe/21a6487f12a000bcab5e7c43daa6908a/Cancer_Research_UK_annual_report_and_accounts_2025-26.pdf) (research spend p. 9; financial review p. 8-13; policy and information p. 26-29, 34-35; reserves p. 51-52; statement of financial activities p. 78; notes 4, 5 and 9, p. 88-90)
- [WHO Global Health Estimates 2021](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates) (cancer DALYs and deaths by age, world and UK)
- [DHSC, Tobacco and Vapes Bill impact assessment](https://assets.publishing.service.gov.uk/media/65f9bd0a9316f5001164c351/tobacco-vapes-bill-impact-assessment.pdf)
- [Glover et al. 2014, returns to UK cancer research](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4058434/fullTextXML)
- [American Cancer Society, Cancer statistics 2025](https://pressroom.cancer.org/2025CancerFactsandFigures)
- [National Cancer Institute, Fact Book FY2024](https://www.cancer.gov/about-nci/budget/fact-book/archive/fy24-fact-book.pdf)
- [IQVIA, therapeutic areas driving clinical trial growth (2026)](https://www.iqvia.com/blogs/2026/05/therapeutic-areas-driving-clinical-trial-growth); [BioSpace on 2024 pharmaceutical R&D (Evaluate Pharma)](https://www.biospace.com/business/undeterred-by-political-economic-headwinds-pharma-ups-r-d-investment-in-2024-and-beyond)
- Moses et al., JAMA 2015 (who pays for medical research); Ironmonger et al., Br J Cancer 2015 (Be Clear on Cancer lung campaign); Wong, Siah and Lo, Biostatistics 2019 (drug development success rates)
