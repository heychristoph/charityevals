### Summary

The American Red Cross helps people after home fires and large disasters across the United States, fits free smoke alarms, supports military families, funds relief and household visits for measles vaccination abroad, and supplies about 40% of the country's blood. The work donations pay for at home (disaster relief, home fire safety, military families and community services, $721 million in the year to June 2025) comes to **<span data-figure="headline" data-model="american-red-cross-charityevals">0.003</span> years of healthy life per $1,000**. The household visits for measles campaigns abroad (about $4 million) come to <span data-figure="headline" data-model="american-red-cross-charityevals-measles">0.36</span>. Weighted by the spending donations pay for, a gift to the Red Cross comes to about 0.005 years of healthy life per $1,000, and over two-fifths of that comes from the small measles programme. The disaster relief and preparedness abroad (about $45 million) has a draft model that isn't published yet, so it doesn't count in that figure.

The blood service and the CPR and first-aid courses are paid for by hospitals and course fees, which bring in more than they cost. So a donation funds none of that work. We model them too, at <span data-figure="headline" data-model="american-red-cross-charityevals-biomedical">0.008</span> per $1,000 spent on them, but they get no weight in what a gift does.

The result is far below the site's global-health charities. Most of the value is money, goods, meals and shelter for American households. The site's one income scale values that at a small fraction of what the same dollar does for a family living on a few dollars a day.

### What the charity does

- **Domestic disaster services** ($625 million). The Red Cross responded to 55,687 home fires and more than 20 major disasters, including Hurricanes Helene and Milton and the Los Angeles wildfires. It gave $138.9 million in financial assistance to about 117,000 households and served 5.1 million meals and snacks. It provided 274,000 nights of shelter and gave grants to local recovery partners. About 13% of the spending goes on preparedness, including the Home Fire Campaign, which fits about 117,000 homes a year with free smoke alarms.
- **Services to the Armed Forces** ($81 million). The Red Cross verifies family emergencies so service members can get leave (62,000 families in the year). It also gives financial help, runs respite centres and offers "whole health" programmes.
- **Community services** ($15 million). Local partnerships for health, hunger and housing in disaster-prone counties.
- **International services** ($49 million). Grants to other Red Cross and Red Crescent societies, $21.6 million of them listed in its tax return: disaster response (59%, most of it in the Middle East and Ukraine), preparedness (33%) and household visits that bring children to measles and rubella vaccination campaigns (8%, 3 million households).
- **Biomedical services** ($2.12 billion) and **training** ($143 million). These are blood collection for about 2,500 hospitals and courses for about 6 million people. Both are paid for by fees.

### How the impact happens

1. Cash, goods, food and shelter raise the consumption of households hit by a disaster. We value them on the site's log-income scale at the households' own consumption. A dollar here does far less than in a poor country, because these households consume more to begin with.
2. Smoke alarms in homes without a working one cut the risk of dying in a fire by about half.
3. Emotional support after a disaster, and emergency messages that let service members get home in a family crisis, add a little wellbeing.
4. Abroad, extra children vaccinated against measles because of a visit avert child deaths.

### How the model works

- **Cost**: the three domestic programmes' expenses from the audited FY2025 statements, with fundraising and management spread over all programmes.
- **Value delivered**: the audited "financial and material assistance" lines (cash, relief items and grants, $282 million). We count 90% of them as reaching people, plus meals and shelter nights at what they would cost to buy. It enters the shared log-income scale at the households' own consumption: home-fire households at the poorest fifth's (two-thirds of the average American's), large-disaster survivors a little above it, since most who get disaster financial help have low incomes.
- **Fire deaths**: we rebuild these from national rates rather than taking the Red Cross's count. The inputs are the US residential fire death rate (2,890 deaths in 2023), the higher risk in homes without a working alarm (they have 57% of the deaths), and half of the homes served lacking one. A working alarm halves the risk (NFPA, and a meta-analysis of such comparisons), and an installed alarm works for about four and a half years (Dallas's door-to-door programme). That gives about ten deaths averted a year. The Red Cross credits the campaign with 295 lives saved in the year, but that count includes people who would have escaped anyway, and alarms fitted in earlier years.
- **Adjustments**: each branch has its own evidence and counterfactual adjustment, weighted by its share of the value. FEMA gives nothing for a single home fire, so little of that help would have come anyway; in declared disasters FEMA, insurers and other charities would have covered about half. Volunteers give about 9 million hours a year, valued at the US value of a volunteer hour, so the Red Cross's share of the resources is about 0.7.
- **Missing data**: a part of a model counts in full only where the charity's own count of who got the help meets a measured effect. The audited money and goods do. The meals and shelter nights (valued by judgment), the smoke alarms and the emotional support rest on research on other programmes and on judgment, so they are counted at the site's shared missing-data share (half by default), about a fifth of the domestic value. The measles, blood and training models are discounted in full.
- **Measles**: the children in the 3 million households visited, the few vaccinated only because of the visit (a quarter of Kenyan households visited by Red Cross volunteers said they would otherwise have missed the dose; we count about an eighth of that, 3%), and the measles deaths a campaign dose averts over the years left under five. Many of those children already had a dose, so the campaign dose adds less for them. The vaccine and campaign are paid for by others and national societies' volunteers give their time, so the Red Cross gets about three-quarters of the credit.
- **Blood and training**: deaths averted per product among acutely bleeding patients and transfusion-dependent cancer and blood-disorder patients, anaemia relieved for the rest, each survivor counted at a shorter remaining life than an average person's. Other blood centres would replace most of the Red Cross's supply within a year or two, and the Red Cross's product is about a quarter of the resources behind each transfusion. CPR training counts trainees who are present at a cardiac arrest and act because of the course.

### What drives the result

- **The exchange rate between a doubled income and a year of healthy life** (a shared slider) moves the domestic result by more than any choice of ours.
- **The counterfactual**: how much survivors would have received anyway from FEMA, insurers and others.
- **The recipients' consumption**: how far below average the households are.
- **Measles**: how many extra children a visit brings in, the measles death risk of an unvaccinated child where the visits happen, and the missing-data slider.
- **Blood**: how much other blood centres would replace, and the risk of dying without blood.

### Biggest uncertainties

- The Red Cross publishes reach as households times an average household size, not as verified unique households.
- The fire deaths rest on observational comparisons of homes with and without working alarms. Whether the homes served lacked alarms before isn't audited.
- The measles effect rests on a self-reported survey without a comparison group. The Red Cross publishes no coverage comparison between visited and unvisited areas, nor the year's campaign countries.
- The blood model's deaths averted per product rest on judgments about survival without transfusion. Its counterfactual (other blood centres would expand) is the largest single question.

### What isn't modelled

We list these without counting them, beyond a share in unmodelled benefits:

- deaths averted by evacuation shelters before hurricanes and floods
- burns averted by smoke alarms
- the durable value of home repairs
- preparedness apps and education
- the "whole health" programmes for military families
- rubella and older children vaccinated in the measles campaigns

### How this model was checked

The mechanical audit (`scripts/audit-model.ts`) runs on each model, and independent auditors (a fresh agent each round, using the audit-cea skill) checked them. The models were first built on 3 November 2026 (three rounds) and rebuilt on 4 November 2026 to the site's new rules: no programme valued at other models' results, and every branch marked measured or discounted for missing data. The rebuild had three more rounds per model.

- **Round 1**: 6 high findings across the models. Domestic: the households' consumption was set below its own anchor; it now reads the site's shared poorest-fifth figure. Blood: survivors were valued as if they had a normal remaining life, and transfusion-dependent patients' deaths were left out; both are now in. Measles: every extra child was treated as never vaccinated, at an infant's vaccine efficacy, and the under-five share of deaths was typed instead of read from the shared figure; both fixed. Also: meals and shelter given their own missing-data marker, the smoke alarms' working life taken from Dallas's follow-up, the Red Cross's share of blood resources computed from hospital cost studies, volunteers' time in the measles credit, and the measles counterfactual built from the Kenyan survey.
- **Round 2**: 3 high findings. A new shared figure for the value of a volunteer hour left another model's typed copy behind (fixed). Measles: the death rate counted vaccinated children's deaths against unvaccinated children (fixed). International relief: the share of grants reaching people rested on one appeal's plan.
- **Round 3** (the last): no high finding in the domestic, blood and measles models; 3 in the international relief draft, from the tax return's list of grants abroad (where the money went, how much was preparedness) and the appeals' spending reports. We rebuilt the relief model on them, and the measles share of the programme from 20% to 8% (from the same list), which raises the measles result about two and a half times. Because no fourth audit checked the relief fixes, that model stays a draft. We also added the measles visits' age-specific risk. One medium finding was not adopted: putting the fundraising cost only on the donor-funded programmes, since every model spreads overhead over all programmes in proportion to cost.

### Sources

- American Red Cross, [Consolidated Financial Statements, June 30, 2025](https://www.redcross.org/content/dam/redcross/about-us/publications/2025-publications/2025-Consolidated-Financial-Statement.pdf) (KPMG).
- American Red Cross, [Annual Report FY2025](https://www.redcross.org/content/dam/redcross/about-us/publications/2025-publications/510901-02-FY25-Annual-Report-EN-Final.pdf) and [Disaster Relief Report FY2025](https://www.redcross.org/content/dam/redcross/about-us/publications/2025-publications/fy25-disaster-relief-report.pdf).
- American National Red Cross, [Form 990 for FY2025, Schedule F](https://projects.propublica.org/nonprofits/organizations/530196605/202640829349300109/IRS990ScheduleF) (grants abroad).
- Ahrens, NFPA (2019), [Smoke Alarms in U.S. Home Fires](https://www1.maine.gov/dps/fmo/sites/maine.gov.dps.fmo/files/inline-files/nfpa_smoke_alarms_in_u.s._home_fires.pdf); Rohde et al. (2016), [smoke alarms and death rates, a meta-analysis](https://doi.org/10.1016/j.firesaf.2016.01.008); Istre et al. (2014), [Dallas smoke alarm installation programme](https://doi.org/10.1136/injuryprev-2013-040823).
- U.S. Fire Administration, [Residential fire estimates](https://www.usfa.fema.gov/statistics/residential-fires/).
- Congressional Research Service, [FEMA Individual Assistance grants, R48310](https://www.everycrsreport.com/reports/R48310.html).
- Mbabazi et al. (2014), [Kenya measles campaign house visits](https://doi.org/10.1093/heapol/czu042); Uzicanin and Zimmerman (2011), [measles vaccine field effectiveness](https://doi.org/10.1093/infdis/jir102); Yitbarek et al. (2025), [measles vaccination strategies, a meta-analysis](https://doi.org/10.1136/bmjgh-2024-016647).
- Kamper-Jørgensen et al. (2008), [survival after blood transfusion](https://pubmed.ncbi.nlm.nih.gov/18673342/); Shander et al. (2010), [activity-based costs of transfusion](https://pubmed.ncbi.nlm.nih.gov/20003061/).
- Hasselqvist-Ax et al. (2015), [Early CPR in out-of-hospital cardiac arrest](https://doi.org/10.1056/NEJMoa1405796), *NEJM*.
