### Summary

The American Cancer Society (ACS) is the largest US cancer charity. It funds cancer research and does its own, campaigns on policy through its advocacy affiliate ACS CAN, promotes screening and prevention, and supports patients with free lodging, rides to treatment and a 24/7 helpline. This is charityevals' own model of its research, advocacy and screening promotion in the year to 31 March 2026. Its patient services are a separate model, [Hope Lodge, rides and the helpline](/american-cancer-society-charityevals-support).

We estimate **{{result}} years of healthy life per $1,000** you give to this work. The patient-services model gives **{{result:american-cancer-society-charityevals-support}}**. The charity's figure in the rankings weights the two by spending: about two thirds this model, one third patient services. Almost all of it rests on judgment, and the range runs across several orders of magnitude. No branch has measured outcomes for ACS's own spending, so each is discounted for missing data.

### What the charity does

ACS spent $674.8m on its programmes in the year to March 2026 (audited accounts; it moved its year end from December to March in 2025):

- **Patient support, $426.5m (63%):** cancer information and the helpline (284,000 calls, chats, emails and texts), 565,000 free nights at its Hope Lodge communities, 93,000 volunteer rides to treatment, and prevention and early-detection work: screening guidelines, partnerships with health systems and community health centres, national roundtables on colorectal, lung and breast cancer screening, and public education. The accounts don't split this line. We judge prevention and early detection at about 45% of it (30% to 60%): $41.9m of donated advertising for prevention and screening and $76.3m of mail and digital appeals with prevention messages are booked here.
- **Research, $193.3m (29%):** $128.5m of grants (934 active grants at 219 institutions; $123.9m of new grants in the year) and its own research on cancer statistics, cancer disparities and the Cancer Prevention Study cohorts.
- **Advocacy, $55.1m (8%):** ACS CAN's work on tobacco taxes and smoke-free laws, insurance coverage of screening and biomarker testing, Medicaid and federal cancer-research budgets.

Management and fundraising cost $155.4m, spread over the programmes, about 23 cents on each dollar.

### How the model works

Four branches on the medical-research template:

- **Research:** a year of the world's cancer research brings new drugs, tests and risk findings into use sooner. The world's cancer burden is 261 million DALYs a year (WHO Global Health Estimates 2023). A year of the field's research averts about 0.25% of it once in use (one judgment, 0.05% to 0.6%), brought forward 5 years, after a 15-year wait (Glover et al. 2014). ACS is credited with its share of all funders' cancer research, about 0.25%, drug companies' research (about $50-65bn a year, from $252bn of cancer-medicine sales) included.
- **Tobacco advocacy:** a typical year's US tobacco wins by everyone (state tax rises, flavour and youth rules) avert about 0.25% of the US smoking burden, 9.4 million DALYs a year, once in effect. Half the gain comes from smokers quitting, about 8 years later, half from young people who never start, about 40 years later; less second-hand smoke adds 10%. These are the site's shared tobacco figures, which our Campaign for Tobacco-Free Kids, Cancer Research UK and British Heart Foundation models also read. ACS CAN has 30% of the coalition's resources.
- **Coverage advocacy:** the year's coverage and budget wins (biomarker testing, screening follow-up, cancer-research budgets) avert about 0.05% of the US cancer burden (0.01% to 0.2%), about 3 years after they take effect. ACS CAN has 30% of the coalition's resources.
- In both, a year's work is credited with a typical year's wins, since each campaign runs two to three years, and a won policy counts the site's shared number of years.
- **Screening:** US screening coverage rises about 0.8 points a year across colorectal, breast, cervical and lung cancer. Half of that is due to promotion, and ACS has 15% of the promotion's resources. People brought up to date have about a quarter fewer deaths from the screened cancer (trials: 0.74 for sigmoidoscopy), counted for 3 years, about 6 years later.

Each branch's DALYs are split into the illness part and the deaths behind the rest, and each death is valued at the site's value of a death by age (WHO's age split: 62% of US cancer deaths come at 70 or older). Each branch is multiplied by the shared missing-data discount. The result is a past average, counted at ACS's next-dollar figure, 46% (reserves of about 7 months, inside its own policy, and a surplus in the year).

### What drives the result

- **The share of the burden the year's policy wins avert:** tobacco advocacy is about 54% of the result, coverage advocacy about 26%.
- **The missing-data discount, the years a won policy counts and the next dollar against the past average** (your value judgments and the shared figure).
- **The share of the burden a year of research averts, and ACS's share of the field.** Research is about 15% of the result, screening about 5%.

### Biggest uncertainties

- No study measures what one funder's research is worth. The returns-to-research check (10% a year for UK cancer research) implies more per dollar than the chain; most of the gap is that the check credits UK research far beyond its share of funding.
- Policy wins are a portfolio with no published count. Their effect is worked out from tobacco price elasticities (the site's shared figure) and judged for coverage laws.
- The split of patient support between prevention and services is our judgment.

### What isn't modelled

- ACS's cancer statistics, used by researchers and health departments everywhere, and the researchers it trains (in a small unmodelled share).
- Harms of more screening: overdiagnosis and false positives (in the same share, negative).
- Economic gains from research (not health).

### How this model was checked

Mechanical checks: lint, the normalization invariants and the reference class (`scripts/audit-model.ts`). Rounds are in audits/american-cancer-society-charityevals/ and audits/american-cancer-society-charityevals-support/.

First build (2026-11-13), independent audit round 1 of each model. This model passed with 2 medium and 5 low findings; patient services passed with 4 medium and 5 low. What changed:
- **Tobacco's other diseases:** the non-cancer share of the policy wins now matches the worked numbers (0.9, from 0.5). The result rose from 0.0027 to 0.0033.
- **ACS's share of the field:** drug companies' oncology research is now anchored on IQVIA's $252bn of cancer-medicine sales, which puts ACS at 0.25% (from 0.2%).
- **Smaller fixes:** the policy wait is no longer discounted twice, the screenable share's range uses WHO's 2023 figures, and smoking's fall is credited to policy only.
- **Patient services:** the information doses now match the British Heart Foundation's helpline and reading doses, with a patient share; the evidence adjustment no longer counts the dose twice; the cash value of help in kind is Habitat's 80%, with families who had other options in the counterfactual rows; the lodging health effect cites a review of distance and cancer care; delivery doubt applies to the information branch only. Its result moved from 0.0038 to 0.0036.
- **Left as they are:** illness averted stays at 0 in patient services, since treatment kept on track can add illness as well as remove it, and two reading-only reference rows the lint flags as unused.

Shared tobacco figures (2026-11-14), verification round 3: a pass. Tobacco advocacy became its own branch on the site's shared tobacco figures, coverage advocacy kept its own, and both now credit a year's work with a typical year's wins (from 40%), as in our Campaign for Tobacco-Free Kids model. The result rose from 0.0033 to 0.006.

### Sources

- [ACS Consolidated Financial Statements, year ended March 31, 2026](https://www.cancer.org/content/dam/cancer-org/online-documents/en/pdf/policies/combined-financials-2026.pdf) (p. 7-8, 17-19)
- [ACS, Our impact](https://www.cancer.org/about-us/what-we-do/our-impact.html) and [Help save lives](https://www.cancer.org/donate/hope) (the year's lodging, rides, helpline and grants)
- [WHO Global Health Estimates 2023](https://xmart-api-public.who.int/DEX_CMS/GHE_FULL) (cancer deaths and DALYs by age, world and US)
- [Glover et al. 2014, returns to UK cancer research](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4058434/fullTextXML)
- [Lin et al. 2021, colorectal screening evidence for the USPSTF (abstract)](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:34003220%20AND%20SRC:MED&resultType=core&format=json)
- [Euronews 2025 on Head et al., The Lancet Oncology](https://www.euronews.com/health/2025/09/02/which-countries-spend-the-most-money-on-cancer-research) (public and philanthropic cancer research funding)
