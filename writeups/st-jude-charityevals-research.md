### Summary

St. Jude Children's Research Hospital in Memphis treats children with cancer and other catastrophic diseases free to their families, runs one of the world's largest childhood cancer research programmes, and supports children's cancer care in other countries through St. Jude Global. Its fundraising arm, ALSAC, raises almost all of the money.

Research comes to **<span data-figure="headline" data-model="st-jude-charityevals-research">0.013</span> years of healthy life per $1,000** you give, and patient care with St. Jude Global to **<span data-figure="headline" data-model="st-jude-charityevals">0.010</span>**. Both are under a tenth of the site's global-health median. The reason isn't that St. Jude does its work badly. Its patients would otherwise be treated at other US children's hospitals with nearly as good results, and that care costs US prices. Its research pays off only after many years, and only as one funder among many.

### What the charity does

All figures are for the fiscal year to June 2025, from the audited combined accounts of St. Jude and ALSAC. St. Jude spent $2.83 billion in all:

- **Patient care ($727 million):** about 1,000 new patients a year, and more than 9,300 patients seen. Three in five new patients have cancer, most often brain tumours, leukaemia or lymphoma. The rest have blood disorders, sickle cell disease, HIV and other conditions. Insurers paid $141 million of the cost. Families pay nothing, and St. Jude covers their travel, housing and food.
- **Research ($883 million):** basic, translational and clinical research. Grants paid $162 million of it. About seven-tenths is cancer research.
- **Education, training and community services ($392 million):** two different things share this line.
  - The hospital's part ($146 million) is mostly St. Jude Global, plus the graduate school, fellowships and community programmes in Memphis.
  - ALSAC's part ($246 million) is the awareness content of its direct mail and television, which the accounts partly treat as appeal costs. We count it as fundraising.
- **Fundraising and administration ($832 million).** St. Jude also holds about $10.6 billion in cash and investments, about 3.7 years of spending.

### How the impact happens

- **Patient care.** A child treated at St. Jude has a somewhat better chance of surviving than at another US centre. In the one like-for-like published comparison, for acute lymphoblastic leukaemia, St. Jude's trial reached 93.5% five-year survival. The Children's Oncology Group's trials reached 90.4%. Families are also spared the out-of-pocket costs of treatment.
- **St. Jude Global.** Partner hospitals in middle-income countries get training, treatment protocols, consultations and, since 2025, medicines through the Global Platform for Access to Childhood Cancer Medicines, run with WHO. Survival there often starts at about half, so the same improvement saves more children. At Recife, Brazil, event-free survival from leukaemia nearly doubled within a decade of twinning with St. Jude.
- **Research.** New protocols and drugs raise survival for one childhood cancer after another. The gains come years after the research is done, wherever the results are taken up.

### How the model works

St. Jude has two models, weighted by what each part spends from St. Jude's own funds.

**Patient care and St. Jude Global** (direct health) has two branches:

- **US patients:** new patients a year × deaths averted per patient. Under standard care about 15% of children with cancer die within five years, and St. Jude cuts that by about a quarter.
  - Deaths are valued at the site's one value of a death, by age.
  - Late effects spared are counted in DALYs.
  - The costs families are spared are valued like cash.
- **Partner hospitals:** children treated × baseline deaths × the cut the partnership brings. The model then takes off the improvement that would have come anyway, and credits St. Jude only with its share of all the resources behind the care.

Insurers', governments', hospitals' and other partners' money lowers St. Jude's share of the credit. Overhead is spread over the spending St. Jude pays for itself. Every wait is discounted at the shared rate, including the 3.7 years a donation spends in the reserves, where it earns a real return. The hospital's training and community programmes publish no outcomes. They are valued at St. Jude's research result, reduced by the shared discount for programmes with no outcome data.

**Research** (medical research) starts from the world's childhood cancer burden: 11.5 million DALYs a year. It multiplies four things:

1. the share of that burden a year's advance averts;
2. the chance a year of the field's research yields one;
3. the years it brings the advance forward;
4. the wait until the advance is in practice, discounted.

St. Jude's cancer research gets its share of the field's funding, about a fifth. The non-cancer research has no outcome measure. It is valued at the nearest evaluated research programme on the site, Breast Cancer Now's, reduced by the shared discount. The cost per outcome comes from the field's past record, so the result is scaled by the shared "next dollar" slider.

### What drives the result

- **St. Jude Global's effect at partner hospitals:** the cut in deaths, the children reached, the evidence discount and the partners' own spending. St. Jude Global is 15% of the patient-care model's cost but brings most of its result.
- **Your values:** the value of a healthy year against a doubled income, and the value of a life. US patient care is almost all deaths averted.
- **Research:** the chance a year's research yields an advance and how much of the burden it averts. Both are judgments, anchored on published returns to medical research. The model's reading row for the whole field, before St. Jude's share, is close to what the UK's roughly 10% a year health return on cancer research implies. The shared "next dollar" slider moves research the most.

### Biggest uncertainties

- How much better St. Jude's survival is than other US centres' once you allow for which patients it takes. The comparison is between trials; no children were randomised between centres.
- How many children St. Jude Global's support reaches, and how much it improves their survival. There is no controlled evaluation, and St. Jude publishes no count.
- The research chain is almost entirely judgment. Its plausible range spans about seventyfold, and the patient-care model's about fiftyfold.

### What isn't modelled

- ALSAC's awareness messaging, counted as fundraising rather than as a programme.
- Lost parental earnings during treatment, which St. Jude doesn't replace.
- The knowledge St. Jude's patient care produces through its trials, which is in the research model rather than counted twice.

### How this model was checked

Mechanical checks run on both models (scripts/audit-model.ts, scripts/normalization-audit.ts), then independent audits, each by a fresh reviewer with the audit-cea skill.

- **Round 1** found 3 high, 4 medium and 8 low issues. All were fixed:
  - the write-up is filed under the charity's main model;
  - partner hospitals' costs follow the review's middle-income figures ($10,000 a child, was $5,000);
  - other partners' contributions moved from the counterfactual into St. Jude's share of resources, so they are no longer counted twice;
  - the non-cancer research moved to the proxy rows, with the shared missing-data discount;
  - the twinning evidence cites the JAMA paper, with St. Jude's own account of its twinnings as a reference class;
  - overhead goes on own-funded spending only;
  - ages come from the patients' age table;
  - the paediatric out-of-pocket figure is used;
  - late effects and the reserves' return are built from their parts.
- **Round 2** found no high issues, 2 medium and 10 low. Fixed:
  - stale numbers in the text;
  - a wider low end for St. Jude Global's effect, since no partner results besides Recife's are published;
  - current Global Alliance counts, with sources;
  - the paediatric out-of-pocket figure quoted and put in 2024 prices;
  - the families' savings discounted only for the reserves' wait;
  - the research split between the share of the burden and the chance of an advance restated, with the check against UK cancer research's returns shown;
  - the payers' side explained.
  
  Left as judgments: the late-effect disability weights, which are typed from the GBD table rather than added as shared facts.

### Sources

- [St. Jude and ALSAC, combined audited financial statements FY2025](https://www.stjude.org/content/dam/en_US/shared/www/about-st-jude/financial-information/2025%20St.%20Jude%20-%20ALSAC%20combined%20FS%20-%20ADA%20compliant.pdf)
- [St. Jude, Form 990 FY2024](https://www.stjude.org/content/dam/en_US/shared/www/about-st-jude/financial-information/st-jude-financials-990-irs-form-2024.pdf); [ProPublica, St. Jude's FY2025 990](https://projects.propublica.org/nonprofits/organizations/620646012)
- [St. Jude, Community Health Needs Assessment 2022](https://www.stjude.org/content/dam/en_US/shared/www/patient-support/sjcrh-chna-report-2022.pdf) (new patients FY2019–21)
- [Pui et al., J Clin Oncol 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4567699/) (leukaemia survival by study group)
- [National Cancer Institute, Cancer in Children and Adolescents](https://www.cancer.gov/types/childhood-cancers/child-adolescent-cancers-fact-sheet)
- [Force et al., Lancet Oncology 2019](https://doi.org/10.1016/S1470-2045(19)30339-0) (global childhood cancer burden)
- [Fung et al., BMJ Global Health 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6830048/) (costs and cost-effectiveness of childhood cancer treatment in low- and middle-income countries)
- [Howard et al., JAMA 2004](https://doi.org/10.1001/jama.291.20.2471) (Recife twinning) and [Ribeiro, Cancer Control 2014](https://www.cancercontrol.info/wp-content/uploads/2014/08/106-110-Ribeiro.pdf) (St. Jude's twinning model)
- [Iragorri et al., Current Oncology 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8025828/) (out-of-pocket costs of cancer care)
