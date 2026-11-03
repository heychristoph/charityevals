### Summary

Village Enterprise helps the poorest households in rural East Africa start small businesses: a year of business training, two small seed grants to groups of three entrepreneurs, mentoring, and savings groups. Our own model of its fiscal year 2025 (July 2024 to June 2025) comes to **<span data-figure="headline" data-model="village-enterprise-charityevals">4.2</span> years of healthy life per $1,000**.

The result rests on two randomized trials of the program itself, one of its core program in Kenya and Uganda and one of DREAMS, its program for refugees and host communities in Uganda. The range is wide, mostly because nobody yet knows how many years the consumption gains last.

### What the charity does

Village Enterprise picks the poorest households in a village and trains one adult from each for four months. The trainees form business groups of three, which get a seed grant and then a second, smaller grant six months later, and they are mentored for eight more months. Thirty entrepreneurs form a savings group that keeps lending after the program ends. The grants are small: about $50 to $100 per household in the core program and about $200 in DREAMS.

In fiscal year 2025 it trained 47,505 entrepreneurs, about 17,700 businesses, in Uganda, Kenya, Rwanda, Ethiopia and Tanzania. It spent $17.1M on programs and $21.0M in total, about $440 per household. About a third of program spending went to DREAMS, which runs in refugee settlements in Uganda and Ethiopia with Mercy Corps, and through local organisations Village Enterprise trains in Tanzania. Smaller parts were a version of the model adapted to child nutrition in northern Kenya (Nawiri, cut short when USAID closed in 2025) and work helping the Kenyan and Rwandan governments run graduation programs themselves.

### How the impact happens

1. The grants, training and mentoring let households start businesses: retail, livestock, crops, tailoring.
2. The businesses' profits raise what households can spend on food, school fees, clothing and other needs. In the trials, household consumption was 7.3% higher in Kenya, 3.6% in Uganda and 17% in DREAMS (13% for its refugee households) than in comparable households that weren't offered the program.
3. The gains keep coming for some years after the program ends, and the savings groups keep lending.
4. Money spent in the village may raise neighbours' incomes too (spillovers).

Consumption is valued on a log scale, the site's shared way, so a gain counts for more the poorer the household.

### How the model works

The [model](/village-enterprise/village-enterprise-charityevals) follows the site's cash and income template.

- **Cost:** all program spending in fiscal year 2025, with management and fundraising spread over it, from the audited financial statements. Every program is a version of the same model, so all of it is set against all the entrepreneurs it trained.
- **Reach:** 47,505 households, about 6.5 people each, split by country with the charity's own counts. Household size starts from the site's survey figure for each country, weighted by where the charity worked. It is then raised by the ratio the trial measured: the poorest households the program enrols are about 1.4 times the national rural average.
- **Effect:** each group of households gets the effect measured closest to it. Kenya and Uganda's core program get their own country's result from IDinsight's 2017–2021 trial for the development impact bond (7.3% and 3.6%), and Rwanda gets the mean of the two. DREAMS in Uganda and Tanzania gets the DREAMS trial's result (17%; IDinsight, 2026). Ethiopia's all-refugee camps get the trial's refugee result (13%), cut further because the camps differ from Uganda's settlements. These figures are for all households offered the program; the model uses the slightly larger effects on households that took part. Each group's effect has its own evidence adjustment: 0.87 for the core program and Tanzania, which run in settings the trials didn't cover, 0.95 for DREAMS Uganda, the trial's own setting, and 0.81 for Ethiopia. The gain fades 5% a year and stops after 8 years in our best guess, discounted at the shared rate.
- **Adjustments:** what would have happened anyway (0.95), the share of the resources that are Village Enterprise's (0.85), counting errors and programs cut short in 2025 (0.98), and half a year to a year's wait before the gains start. Spillovers add 10%. Other effects add 13%: assets left over, governments copying the model and nutrition gains, minus competition with other traders and wastage.
- **Your dollar:** staff pay is 42% of Village Enterprise's spending (audited figure). Its staff, mostly local business mentors, earn the shared pay gap below other jobs, which counts as their in-kind donation when credit is shared by resources.

### What drives the result

- **How long the gains last, and how fast they fade.** From 3 to 12 years, the result moves from about half to 1.3 times the best guess; no fade to 20% a year moves it from 1.2 to 0.65 times. Across the core trial's cohorts, 0.5 to 2.5 years after the program, the consumption effect showed no significant differences apart from one cohort hit by COVID-19. Only Kenya's cohorts hint at fade, and in DREAMS the cohort followed longest gained most. Heavier graduation programs have kept their gains for 7 to 10 years, and cash grants for trades in Uganda faded by year nine. A similar Ugandan livelihoods program, Raising the Village, is counted 3 years on the site.
- **The value of a year of healthy life against a doubled income** (a shared slider). It moves every income model the same way.
- **Other benefits and harms not modelled** (−18% to +28%), **the credit shared with partners** (−18% to +18%), **spillovers to neighbours** (−9% to +27%) and **the size of the Ugandan core effect** (−16% to +15%) come next. The trust put in the core trial moves it by −10% to +7%.

### Biggest uncertainties

- **Persistence.** No follow-up of this program goes beyond 2.5 years after it ended, and the DREAMS trial measured only 6 to 18 months after.
- **The core trial ran during COVID-19.** Effects were smaller for Ugandan households surveyed after the lockdown, so the core effect may understate a normal year. Against that, the program now runs in harder places (pastoral drylands, Somali refugee camps) and in lighter-touch digital versions the trials didn't test.
- **DREAMS' share of the households.** The annual report gives DREAMS' reach only since the project began. The fiscal-year share, about 28%, is built from Ethiopia's and Tanzania's yearly counts (all DREAMS) and Uganda's cohort schedule.
- **Ethiopia's camps.** No trial has run there. The model uses the Ugandan trial's refugee result and cuts it further (0.85).
- **The yearly reach is the charity's own count.** In the trial, disbursements were verified independently.

### What isn't modelled

- Child nutrition gains in the Nawiri program beyond what higher consumption captures, and gains in women's decision-making and wellbeing, which the DREAMS trial measured. Both enter only as part of the 13% for other effects, or not at all.
- Households reached by governments that adopted the model with Village Enterprise's help (Kenya's KSEIP, Rwanda's national graduation strategy). Its spending on that help is in the cost, but only a small share for those households is in the result.
- Room for more funding and organisational strength aren't scored.

### How this model was checked

The mechanical audit (lint and the site's invariants) passed before review. A separate reviewer then audited the model against its sources.

- **Round 1:** no high-severity findings, 5 medium and 4 low, all fixed. The core trial's effect is now taken country by country, not pooled. Ethiopia's refugee camps take the DREAMS trial's refugee effect, with their own evidence cut. Tanzania is counted as DREAMS. The persistence reasoning was corrected (Kenya's cohorts hint at fade), a 10% yearly fade was added and the Raising the Village anchor named. The double cut for non-take-up was removed, and the evidence adjustment now names its anchor. The result went from 4.0 to 3.3.
- **Round 2:** no high-severity findings, 2 medium and 6 low, all fixed. The model summary was corrected. The fade now names its anchors. The program's own trials show no detectable fade over 2.5 years, so the best guess fell from 10% to 5% a year. Each branch got its own evidence adjustment, which removed a double cut for Ethiopia and the cut for settings DREAMS Uganda's trial already covers. Ethiopia's and Tanzania's households are counted at the charity's own people-per-entrepreneur figures there. The refugee effect and its control mean now come from the same table. The result went from 3.3 to 4.2.
- **Round 3:** no high or medium findings, 5 low, all fixed (wording, one basis for the effect percentages, section placement of the branch evidence rows, the drivers' figures). The result stayed at 4.2.

### Sources

- Village Enterprise, [consolidated financial statements for the years ended June 30, 2025 and 2024](https://villageenterprise.org/wp-content/uploads/2026/03/Village-Enterprise-Fund-FY25-Financial-Statements.pdf) (audited) and [Form 990 for fiscal year 2025](https://villageenterprise.org/wp-content/uploads/2026/06/Village-Enterprise-Fund-Form-990-Public-Disclosure-Copy-Fiscal-Year-End-June-2025.pdf).
- Village Enterprise, [2025 Annual Report](https://2025annualreport.villageenterprise.org/other/VillageEnterprise_2025AnnualReport.pdf).
- IDinsight (2021), [Village Enterprise Development Impact Bond Evaluation Findings](https://www.idinsight.org/wp-content/uploads/2022/03/FinalReport-Village-Enterprise.pdf).
- IDinsight (2026), [DREAMS Impact Evaluation, Uganda Endline Report 1](https://europe.mercycorps.org/sites/default/files/2026-06/dreams-uganda-impact-report-1.pdf).
- Sedlmayr, Shah and Sulaiman (2020), [Cash-plus: Poverty impacts of alternative transfer-based approaches](https://doi.org/10.1016/j.jdeveco.2019.102418), *Journal of Development Economics*.
- Banerjee et al. (2015), [A multifaceted program causes lasting progress for the very poor](https://pubmed.ncbi.nlm.nih.gov/25977558/), *Science*; Bandiera et al. (2017), [Labor markets and poverty in village economies](https://doi.org/10.1093/qje/qjx003), *QJE*; Banerjee, Duflo and Sharma (2021), [Long-term effects of the Targeting the Ultra Poor program](https://doi.org/10.1257/aeri.20200667), *AER: Insights*; Blattman, Fiala and Martinez (2020), [The long-term impacts of grants on poverty](https://www.aeaweb.org/doi/10.1257/aeri.20190224), *AER: Insights*.
- The DHS Program, mean household size by country (STATcompiler).
