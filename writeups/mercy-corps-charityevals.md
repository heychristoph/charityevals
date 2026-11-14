### Summary

Mercy Corps, renamed Prosper Global in 2026, works in about 35 countries hit by conflict, disaster and poverty. It runs emergency response and recovery, livelihood and market programmes, peacebuilding and local governance, youth education, and nutrition. Its programmes do about **<span data-figure="headline" data-model="mercy-corps-charityevals">0.18</span> years of healthy life per 1,000 dollars**, below the middle of the site's global-health charities and near World Vision and Save the Children.

Half of that comes from livelihoods: small consumption gains for the 19 million people its economic programmes reach, most of them only indirectly. A third comes from emergency relief: cash, water and supplies, and a few excess crisis deaths averted. Recovery, water, nutrition, education and peace work make up the rest. The result is mostly uncertainty: its plausible range runs from about a fifth of it to five times it. Mercy Corps counts the people it reaches but publishes no controlled measure of what its spending achieved. So every part is built from its spending, its reach or a judged cost per person, and the research on that kind of work. Every part is discounted for missing data.

### What the charity does

Figures are the consolidated audited statements of Mercy Corps and Affiliates for the year to 30 June 2025 (programmes $509 million of $620 million spent):

- **Livelihood and economic development** ($207 million): market-systems and farming programmes, digital finance and savings groups, jobs and small-business support, climate resilience for farmers and herders.
- **Humanitarian relief** ($138 million): emergency cash, water and hygiene supplies, and shelter in Sudan, Gaza, Ukraine, Syria, the DRC, Haiti and elsewhere. $96 million of it goes through partners, including the Cash Consortium of Sudan, which Mercy Corps leads.
- **Civil society and education** ($90 million): mediation between farmers and herders, land commissions, youth and violence prevention, local governance, and youth schooling and skills.
- **Health** ($43 million), which Mercy Corps describes as water and food security: water and sanitation, and nutrition sites, malnutrition screening and referral and supplements.
- **Recovery** ($31 million): grants, seeds and livestock to restart farms and businesses, and repaired water points.

Half its spending abroad is in Sub-Saharan Africa, then the Middle East (15%), Latin America (12%), Ukraine and its neighbours (11%) and Asia (9%). USAID paid 30% of its revenue that year, and Mercy Corps cut its workforce by about 30% after the US cuts.

### How the impact happens

1. Cash, water and supplies in a crisis raise what families consume for a few weeks or months and avert some deaths from hunger and disease.
2. Recovery grants are partly consumed and partly invested in seeds, animals and businesses that pay for a few years. Higher incomes from recovery and livelihood work also avert some child deaths.
3. Livelihood programmes raise the incomes of the farmers and small businesses they train or connect to markets, and a little those of the many more they reach through firms, banks and radio.
4. Peace work averts some deaths in local conflicts and lets farming and trade go on.
5. Schooling and skills raise young people's learning and, later, their earnings.
6. Water supplies cut diarrhoeal deaths a little and save fetching time; nutrition and child health work averts some child deaths.

### How the model works

- **Cost**: each programme line's expenses from the audited statements, with management and fundraising spread over all of them.
- **Relief**: people reached are the spending over a judged $25 a person. Mercy Corps' average across all its work is $14 a person, and a month of cash costs much more; its own relief count is its organisation-wide total. Each person is covered for that spending over a judged $170 a person-year, about two months. Excess deaths are the gap between a crisis death rate and the countries' normal rate, 8% of it averted over those months. The cash and goods, 62% of the cost (the Sudan consortium's own figure), are valued on the site's log-income scale at crisis-affected people's consumption.
- **Recovery**: people reached are the spending over a judged $40 a person. 55% reaches them as grants and goods: 60% consumed at once, 40% invested at a 10% yearly return for five years, with 30% of it left at the end, discounted. Deaths averted by the higher incomes add a judged fifth of the consumption value, as in the site's cash models.
- **Livelihoods**: Mercy Corps' count of 19 million people reached, three-quarters of it credited to this line (its outcome areas overlap and cross its accounting lines). A judged fifth take part directly and gain 3% in consumption for two years, shared with their households where Mercy Corps counts only the participant (a judged fifth of them); the rest gain a tenth of that. Deaths averted by the higher incomes add a fifth, as for recovery.
- **Peace**: Mercy Corps' count of 8 million people reached, three-quarters credited to this line, in places with a judged 1.5 conflict deaths per 10,000 people a year. The work averts 2% of them and adds a small consumption gain.
- **Education**: a judged fifth of the civil-society-and-education line, at $150 a young person, a small learning gain carried into adult earnings.
- **Water**: a judged 40% of the health line, at $80 a person given a new or repaired supply. Diarrhoeal deaths fall by a judged 12% over the supply's working years, discounted, and fetching time saved is worth about 1% of consumption.
- **Nutrition**: children covered are the rest of the health line over a judged $40 a child, with 4% of their deaths averted.
- **Consumption**: the household-survey means of stand-in countries for each region, weighted by Mercy Corps' spending and grants by region.
- **Adjustments**: each branch has its own evidence, counterfactual and attribution adjustments. Market programmes and health work share credit with the firms, ministries and UNICEF that put in their own resources. Every branch is discounted for missing data. Side effects are rows of their own: cash's boost to local traders, higher prices in thin markets, aid diverted to armed groups, protection and dignity, women's say in household decisions, Mercy Corps' research used by others, and its social-enterprise investments.

### What drives the result

- **The missing-data slider**: every branch is thin, so it scales the whole result.
- **The livelihoods gain**: the gain for direct participants, how long it lasts, how many of the 19 million take part directly, and how many people share it.
- **Relief**: crisis-affected people's consumption, and what other agencies would have delivered anyway.

### Biggest uncertainties

- Mercy Corps' reach counts overlap across its outcome areas, cross its accounting lines and include people reached indirectly; its relief count is its organisation-wide total.
- No controlled evaluation measures what its livelihood spending does to consumption; the gains are judged from trials of graduation, savings-group and farming programmes.
- The effect of peace work on deaths rests on one trial of a similar campaign, one null trial of Mercy Corps' own, and poor violence data.
- Cash's and water's effect on deaths in crises rests on weak evidence.

### How this model was checked

The mechanical audit (`scripts/audit-model.ts`) runs on the model, and independent auditors (a fresh agent each round, using the audit-cea skill) checked it; the rounds are in `audits/mercy-corps-charityevals/`.

- **Round 1**: no high finding; five medium. Fixed: the livelihood and peace reach counts are credited to their lines only in part (they overlap other lines); relief's months of cover now follow its cost per person; the health line, which Mercy Corps describes as water and food security, is split into water and nutrition branches; recovery and livelihood income gains carry the cash models' mortality step; effects the write-up had listed without a value became side-effect rows. Lows fixed: grants added to the regional weights, recovery's invested principal counted at the end, a household-sharing multiplier for direct livelihood participants, two citation slips. Together these raised the result from 0.145 to 0.17.
- **Round 2** (verification): no high finding. Fixed after it: the household-sharing multiplier is now built from the site's household sizes and a judged share of participants counted without their households (0.17 to 0.18), and a cost anchor cites its source.
- **Round 3** (verification): passed with one low finding left: the share of participants counted without their households (a fifth) has no published anchor.

### Sources

- Mercy Corps and Affiliates, [Consolidated Financial Statements, 30 June 2025 and 2024](https://www.prosperglobal.org/sites/default/files/2026-02/2025-audited-financial-statement.pdf) (Grant Thornton).
- Mercy Corps, [Form 990 for the year to June 2025](https://www.prosperglobal.org/sites/default/files/2026-02/irs-990-fy25.pdf).
- Mercy Corps Europe, [Annual Report and Financial Statements FY2025](https://europe.prosperglobal.org/sites/default/files/2026-03/mce-annual-full-report-fy25.pdf).
- Mercy Corps, [2025 Annual Impact Summary](https://www.prosperglobal.org/sites/default/files/2026-03/2025-annual-report-v032026.pdf).
