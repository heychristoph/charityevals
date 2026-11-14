### Summary

The Norwegian Refugee Council (NRC) spent NOK 8.7 billion ($837 million) in 2025, almost all of it government and UN grants. It works with people displaced by conflict and disaster in 39 countries, the largest operations in Ukraine, Sudan, Palestine, South Sudan and Ethiopia. We model its NOK 7.7 billion of programmes: food security, shelter, education, water and sanitation, legal assistance, protection, cash (the accounts' "other" line), and NORCAP's 613 expert secondments to UN agencies and governments. We estimate **<span data-figure="headline" data-model="norwegian-refugee-council-charityevals">0.20</span> years of healthy life per $1,000**, above the site's global-health median. NRC counts the people each programme reached (10.6 million different people) and the cash it hands out, but publishes no controlled evaluation of its own. The cash transfers are therefore counted in full, and every other part is built from spending, reach and the research on its kind of work, with wide ranges, and counted at half by the site's shared missing-data slider. Its advocacy and information work is in a second model, [here](/norwegian-refugee-council/norwegian-refugee-council-charityevals-advocacy).

### How the model works

**Education** (NOK 1,016m, 1.29 million participants; about 30% of the result). Emergency learning spaces, accelerated education and the Better Learning Programme's classroom psychosocial support. A tenth of participants are taken to be in structured or accelerated education for children otherwise out of school, at half a standard deviation, between the 0.40 for boys and 0.65 for girls that a randomised trial of village schools in Afghanistan found (Burde & Linden 2013). The rest get the median learning gain of randomised education evaluations in poor countries, 0.1 standard deviations (Evans & Yuan 2022). Of the gain, 40% lasts into adult life, where each standard deviation is worth 20% more earnings, valued on the site's log-income scale over a working life after a ten-year wait. The psychosocial support adds a small mental-health gain for the 22% of children in conflict settings with a disorder.

**Cash** (NOK 2,003m, 1.8 million people; about 35%). Half the line is cash and vouchers handed to people, about $55 a person, valued as consumption: Ukraine's 40% at displaced Ukrainians' consumption, the rest at about $700 a year (2017 PPP). The rest of the line is the cost of delivering it, counted at nothing. Outside Ukraine the cash also averts a small share of the crisis's excess deaths, as food security does.

**Food security** (NOK 1,145m, 1.69 million people; about 15%). Food, cash for food, seeds, tools and support to bakeries, about $36 a person delivered. In half a year of crisis, mortality averages 0.02 a year against a normal 0.008, and the support removes 2% of the extra deaths; the rest of its value is consumption, plus a side effect for cheaper bread for non-participants. NRC is phasing this line out by 2027.

**Shelter** (NOK 1,049m, 1.4 million people), **water and sanitation** (NOK 713m, 4.3 million people), **legal assistance** (NOK 662m, 1.5 million) and **protection** (NOK 380m, 0.77 million). Shelter is valued as goods used over two years, plus a little illness and death from exposure averted. Water and sanitation cut diarrhoeal deaths and illness by 15% for a year of service. Legal assistance counts only the resolved cases (half of the 30% who get counselling or assistance), each worth 5% more consumption for three years. Protection improves the mental health of participants with a disorder by 0.2 standard deviations for a year.

**NORCAP** (NOK 711m, 613 assignments, about $120,000 each). Each expert shapes about $2 million of a host's programmes and improves its value by 5%, a dollar of that work valued like the site's relief models before their missing-data step (0.25 times cash).

Every branch has the same delivery adjustment (85%). Credit is shared with governments, partners and hosts where they put in resources (60-90%), and others would have filled about 30% of the relief gaps in a year when appeals were 35% funded.

### What drives the result

The value of a healthy year in units of value, the missing-data slider and the discount rate come first, then the education chain (the access share and its gain, earnings per standard deviation, persistence) and the consumption of the people reached.

### What isn't modelled

Gains for people who got only legal information or protection without a disorder, violence averted by mediation, livelihoods' later income, NRC's coordination roles and surge deployments (+). Tension with host communities and funging inside the response (-). Together these are a judged +5%.

### How this model was checked

Built with charityevals' humanitarian-relief template on 14 November 2026, as a portfolio of branches over NRC's audited 2025 accounts (Convention 4); the mechanical audit passes. Round 1 of the independent audit verified every spending line, reach count and key source, and found one high, three medium and six low findings. The cash transfers now count in full (measured), education mixes access and in-school gains, NORCAP's value per dollar follows the site's relief models, and the smaller points were fixed. The ages of crisis deaths stay ranged judgments: the site has no shared split for crises, and they move the result by about 1%. The result rose from 0.15 to 0.25 in round 1. Round 2 passed with two medium findings, both fixed: the access share in education fell from a quarter to a tenth (NRC's accelerated programmes are small), and the rest of the cash line is now its delivery cost, valued at nothing, as NRC's report gives no other activity for it. The result is 0.20; a final check covered these changes. Later, from the audit of charityevals' Danish Refugee Council model: the share of deaths aged 5-14 reads the relief models' shared figure, and food security's and cash's consumption gains are spread over the months the aid covers, as the template does; the result stays 0.20.

### Sources

- [Norwegian Refugee Council, Annual Accounts 2025](https://www.flyktninghjelpen.no/globalassets/pdf/annual-accounts/2025/nrc-annual-accounts-2025_130826.pdf)
- [Norwegian Refugee Council, Annual Report from the Board 2025](https://www.nrc.no/globalassets/pdf/annual-reports/2025/global/annual-report-from-the-board-2025.pdf)
- [ALNAP, The State of the Humanitarian System 2026: the reality of funding gaps](https://alnap.org/help-library/resources/sohs-2026/chapter-1-prioritisation-under-pressure/1-1-the-reality-of-funding-gaps/)
- [Evans & Yuan (2022), How Big Are Effect Sizes in International Education Studies?](https://doi.org/10.3102/01623737221079646)
- [Burde & Linden (2013), Bringing Education to Afghan Girls: A Randomized Controlled Trial of Village-Based Schools](https://doi.org/10.1257/app.5.3.27)
- [Charlson et al. (2019), New WHO prevalence estimates of mental disorders in conflict settings](https://doi.org/10.1016/S0140-6736(19)30934-1)
