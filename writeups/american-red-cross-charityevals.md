### Summary

The American Red Cross helps people after home fires and large disasters across the United States, fits free smoke alarms, supports military families, funds relief abroad, and supplies about 40% of the country's blood. The work donations pay for (disaster relief, home fire safety, military families and community services, $721 million in the year to June 2025) comes to **<span data-figure="headline" data-model="american-red-cross-charityevals">0.004</span> years of healthy life per $1,000**. Its international disaster relief (about $39 million) comes to <span data-figure="headline" data-model="american-red-cross-charityevals-international">0.2</span>. Weighted by the spending donations pay for, a gift to the Red Cross comes to about 0.015 years of healthy life per $1,000. More than half of that comes from the small international relief programme, which is about 5% of the spending. The household visits for measles vaccination campaigns (about $10 million) have a draft model that isn't published yet, so they don't count in that figure.

The blood service and the CPR and first-aid courses are paid for by hospitals and course fees, which bring in more than they cost. So a donation funds none of that work. We model them too, at <span data-figure="headline" data-model="american-red-cross-charityevals-biomedical">0.02</span> per $1,000 spent on them, but they get no weight in what a gift does.

The result is far below the site's global-health charities. Most of the value is money, goods, meals and shelter for American households. The site's one income scale values that at a small fraction of what the same dollar does for a family living on a few dollars a day.

### What the charity does

- **Domestic disaster services** ($625 million). The Red Cross responded to 55,687 home fires and more than 20 major disasters, including Hurricanes Helene and Milton and the Los Angeles wildfires. It gave $138.9 million in financial assistance to about 117,000 households and served 5.1 million meals and snacks. It provided 274,000 nights of shelter and gave grants to local recovery partners. About 13% of the spending goes on preparedness, including the Home Fire Campaign, which fits about 117,000 homes a year with free smoke alarms.
- **Services to the Armed Forces** ($81 million). The Red Cross verifies family emergencies so service members can get leave (62,000 families in the year). It also gives financial help, runs respite centres and offers "whole health" programmes.
- **Community services** ($15 million). Local partnerships for health, hunger and housing in disaster-prone counties.
- **International services** ($49 million). Grants to other Red Cross and Red Crescent societies for disaster relief in 32 countries, and household visits that bring children to measles and rubella vaccination campaigns (3 million households).
- **Biomedical services** ($2.12 billion) and **training** ($143 million). These are blood collection for about 2,500 hospitals and courses for about 6 million people. Both are paid for by fees.

### How the impact happens

1. Cash, goods, food and shelter raise the consumption of households hit by a disaster. We value them on the site's log-income scale at the households' own consumption. A dollar here does far less than in a poor country, because these households consume more to begin with.
2. Smoke alarms in homes without a working one cut the risk of dying in a fire by about half.
3. Emotional support after a disaster, and emergency messages that let service members get home in a family crisis, add a little wellbeing.
4. Abroad, relief goods are valued the same way at much lower consumption. Extra children vaccinated against measles avert child deaths.

### How the model works

- **Cost**: the three domestic programmes' expenses from the audited FY2025 statements, with fundraising and management spread over all programmes.
- **Value delivered**: the audited "financial and material assistance" lines (cash, relief items and grants, $282 million). We count 90% of them as reaching people, plus meals and shelter nights at what they would cost to buy. Spread over the 928,000 people reached plus military families, this is a few hundred dollars a person. It enters the shared log-income scale at half the average American's consumption.
- **Fire deaths**: we rebuild these from national rates rather than taking the Red Cross's count. The inputs are the US residential fire death rate (2,890 deaths in 2023) and the higher risk in homes without a working alarm (they have 57% of the deaths). We assume half of the homes the campaign serves lacked a working alarm, take NFPA's 54% lower risk with one, and count about eight years of alarm life, discounted. That gives about 17 deaths averted a year. The Red Cross credits the campaign with 295 lives saved in the year, but that count includes people who would have escaped anyway, and alarms fitted in earlier years.
- **Adjustments**: each branch has its own evidence and counterfactual adjustment, blended by its share of the value. Money and goods are taken nearly at face value. FEMA gives nothing for a single home fire, so little of that help would have come anyway; in declared disasters FEMA, insurers and other charities would have covered more than half. Fire departments run their own alarm programmes. Volunteers give about 9 million hours a year, valued at the US value of a volunteer hour, and partners contribute too, so the Red Cross's share of the resources is about 0.7. Gifts held for disasters at year end ($358 million) wait about half a year before they are spent, discounted.
- **International relief**: reach follows from the relief money and an assumed value per person, because no count of people reached is published. The relief is valued at the purchasing power of the four countries the annual report names (Brazil, Bangladesh, Myanmar, Mozambique), each standing for its region.
- **Measles** (draft, not yet published): a model of its own (vaccination is direct health work). It counts the children in the 3 million households visited, the few vaccinated only because of the visit, and the measles deaths that vaccination averts over childhood, discounted. The vaccine and vaccinators are paid for by others, so the Red Cross's share of the credit is its cost per extra child vaccinated against everyone's.
- **Blood and training**: deaths averted per product from the share of products given for acute bleeding and the risk of dying without blood, and anaemia relieved for the rest. Other blood centres would replace most of the Red Cross's supply within a year or two. CPR training counts trainees who are present at a cardiac arrest and act because of the course. Rich-country deaths are valued by five-year age weights.

### What drives the result

- **The exchange rate between a doubled income and a year of healthy life** (a shared slider) moves the domestic result by more than any choice of ours.
- **The counterfactual**: how much survivors would have received anyway from FEMA, insurers and others.
- **The recipients' consumption**: how far below average the households are right after their loss.
- **International relief**: the consumption of the people helped (the poorest countries count for most) and how much other donors would have given anyway.
- **Measles** (draft): the measles death risk of an unvaccinated child where the visits happen, how many extra children a visit brings in, and what others pay to vaccinate each of them.

### Biggest uncertainties

- The Red Cross publishes reach as households times an average household size, not as verified unique households.
- The fire deaths rest on an observational comparison of homes with and without working alarms. Whether the homes served lacked alarms before isn't audited.
- The international branch's reach and the measles effect are judgments with wide ranges. The Red Cross publishes no coverage comparison between visited and unvisited areas.
- The blood model's deaths averted per product rest on judgments about survival without transfusion. Its counterfactual (other blood centres would expand) is the largest single question.

### What isn't modelled

We list these without counting them, beyond a share in unmodelled benefits:

- deaths averted by evacuation shelters before hurricanes and floods
- burns averted by smoke alarms
- the durable value of home repairs
- preparedness apps and education
- the "whole health" programmes for military families
- disaster preparedness abroad
- humanitarian-law and family-tracing work

### How this model was checked

The mechanical audit (`scripts/audit-model.ts`) runs on each of the four models (three published, one draft), and independent auditors (a fresh agent each round, using the audit-cea skill) checked them.

- **Round 1**: 3 high, 8 medium and 9 low findings. The site's present-value function counted any effect shorter than a year as a full year; we fixed it for every model (the emotional-support effect had counted five times over). The international model now reads shared purchasing-power facts for the countries it names, instead of a typed blend. Measles moved out of the relief model into a direct-health model of its own. We also made these changes:
  - evidence and counterfactual adjustments by branch
  - discounting of funds held at year end
  - five-year age weights for deaths over 50
  - anchors for the blood judgments
  - shared US population and anaemia disability weights
- **Round 2**: 1 high, 7 medium and 8 low findings. The high one: the Red Cross's share of the credit for measles is now computed from its own cost per extra child vaccinated against what others pay (about three-quarters), instead of a typed quarter. The measles death risk now comes from WHO's global figures (107,500 deaths, 22 million children missing their first dose), and the coverage gain cites the Cochrane review. We also made these changes:
  - International relief valued country by country, at each country's own consumption (new World Bank facts) and in one price year.
  - The two models share the measles spending split as one fact.
  - The large-disaster counterfactual is anchored on FEMA's awards after Helene.
  - Doubled doubts were removed from the validity adjustments.

- **Round 3** (the last): 2 high, 1 medium and 5 low findings, all but three lows in the measles model. Its death rate was per unvaccinated child under five, but the model had applied it to children up to 14 for four years each. Others' cost was GiveWell's figure for a full routine schedule, not for one campaign dose. We fixed both:
  - under-fives only, for their years left under five
  - a campaign dose at about $3
  - the settings' measles risk anchored on the African region's share of deaths

  Because no fourth audit checked the fixes, the measles model stays a draft and isn't published. In the other models, the relief's country weights now always add to one, and labels and record texts were corrected.

### Sources

- American Red Cross, [Consolidated Financial Statements, June 30, 2025](https://www.redcross.org/content/dam/redcross/about-us/publications/2025-publications/2025-Consolidated-Financial-Statement.pdf) (KPMG).
- American Red Cross, [Annual Report FY2025](https://www.redcross.org/content/dam/redcross/about-us/publications/2025-publications/510901-02-FY25-Annual-Report-EN-Final.pdf) and [Disaster Relief Report FY2025](https://www.redcross.org/content/dam/redcross/about-us/publications/2025-publications/fy25-disaster-relief-report.pdf).
- Ahrens, NFPA (2019), [Smoke Alarms in U.S. Home Fires](https://www1.maine.gov/dps/fmo/sites/maine.gov.dps.fmo/files/inline-files/nfpa_smoke_alarms_in_u.s._home_fires.pdf).
- U.S. Fire Administration, [Residential fire estimates](https://www.usfa.fema.gov/statistics/residential-fires/).
- Hasselqvist-Ax et al. (2015), [Early CPR in out-of-hospital cardiac arrest](https://doi.org/10.1056/NEJMoa1405796), *NEJM*.
