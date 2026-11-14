### Summary

The Norwegian Refugee Council (NRC) spent NOK 8.7 billion ($837 million) in 2025, almost all of it government and UN grants. It works with people displaced by conflict and disaster in 38 countries, the largest operations in Ukraine, Sudan, Palestine, South Sudan and Ethiopia. We model its NOK 7.7 billion of programmes: food security, shelter, education, water and sanitation, legal assistance, protection, cash (the accounts' "other" line), and NORCAP's 613 expert secondments to UN agencies and governments. We estimate **<span data-figure="headline" data-model="norwegian-refugee-council-charityevals">0.15</span> years of healthy life per $1,000**, a little above the site's global-health median. NRC counts the people each programme reached (10.6 million different people), but publishes no controlled evaluation of its own. Each branch is therefore built from its spending, its reach and the research on its kind of work, with wide ranges, and counted at half by the site's shared missing-data slider. Its advocacy and information work is in a second model, [here](/norwegian-refugee-council/norwegian-refugee-council-charityevals-advocacy).

### How the model works

**Education** (NOK 1,016m, 1.29 million children and youth; about 30% of the result). Emergency learning spaces, accelerated education and the Better Learning Programme's classroom psychosocial support. We take the median learning gain of randomised education evaluations in poor countries, 0.1 standard deviations (Evans & Yuan 2022). Of that, 40% lasts into adult life, where each standard deviation is worth 20% more earnings, valued on the site's log-income scale over a working life after a ten-year wait. The psychosocial support adds a small mental-health gain for the 22% of children in conflict settings with a disorder.

**Cash** (NOK 2,003m, 1.8 million people; about a quarter). Half the line is cash and vouchers handed to people, about $55 a person, valued as consumption: Ukraine's 40% at displaced Ukrainians' consumption, the rest at about $700 a year (2017 PPP). Outside Ukraine the cash also averts a small share of the crisis's excess deaths, as food security does.

**Food security** (NOK 1,145m, 1.69 million people; about a fifth). Food, cash for food, seeds, tools and support to bakeries, about $36 a person delivered. In half a year of crisis, mortality averages 0.02 a year against a normal 0.008, and the support removes 2% of the extra deaths; the rest of its value is consumption, plus a side effect for cheaper bread for non-participants.

**Shelter** (NOK 1,049m, 1.4 million people), **water and sanitation** (NOK 713m, 4.3 million people), **legal assistance** (NOK 662m, 1.5 million) and **protection** (NOK 380m, 0.77 million). Shelter is valued as goods used over two years, plus a little illness and death from exposure averted. Water and sanitation cut diarrhoeal deaths and illness by 15% for a year of service. Legal assistance counts only the resolved cases (half of the 30% who get counselling or assistance), each worth 5% more consumption for three years. Protection improves the mental health of participants with a disorder by 0.2 standard deviations for a year.

**NORCAP** (NOK 711m, 613 assignments, about $120,000 each). Each expert shapes about $2 million of a host's programmes and improves its value by 5%, at half the value of cash per dollar.

Every branch has the same delivery adjustment (85%) and the missing-data discount. Credit is shared with governments, partners and hosts where they put in resources (60-90%), and others would have filled about 30% of the relief gaps in a year when appeals were 35% funded.

### What drives the result

The missing-data slider, the value of a healthy year in units of value and the discount rate come first, then the education chain (learning gain, earnings per standard deviation, persistence) and the consumption of the people reached. The combined range runs from 0.03 to 0.77.

### What isn't modelled

Gains for people who got only legal information or protection without a disorder, violence averted by mediation, livelihoods' later income, NRC's coordination roles and surge deployments (+). Aid diverted or taxed by armed groups and tension with host communities (-). Together these are a judged +5%.

### How this model was checked

Built with charityevals' humanitarian-relief template on 14 November 2026, as a portfolio of branches over NRC's audited 2025 accounts (Convention 4); the mechanical audit passes.

### Sources

- [Norwegian Refugee Council, Annual Accounts 2025](https://www.flyktninghjelpen.no/globalassets/pdf/annual-accounts/2025/nrc-annual-accounts-2025_130826.pdf)
- [Norwegian Refugee Council, Annual Report from the Board 2025](https://www.nrc.no/globalassets/pdf/annual-reports/2025/global/annual-report-from-the-board-2025.pdf)
- [ALNAP, The State of the Humanitarian System 2026: the reality of funding gaps](https://alnap.org/help-library/resources/sohs-2026/chapter-1-prioritisation-under-pressure/1-1-the-reality-of-funding-gaps/)
- [Evans & Yuan (2022), How Big Are Effect Sizes in International Education Studies?](https://doi.org/10.3102/01623737221079646)
- [Charlson et al. (2019), New WHO prevalence estimates of mental disorders in conflict settings](https://doi.org/10.1016/S0140-6736(19)30934-1)
