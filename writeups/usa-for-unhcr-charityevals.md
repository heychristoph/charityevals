### Summary

USA for UNHCR raises money from Americans for UNHCR, the UN refugee agency. In 2025 it spent $95.5 million: $44.3 million as cash grants to UNHCR's operations, $10.8 million as donated clothes, hygiene kits, software and transport, and $8.2 million on awareness work in the US. Fundraising took $26.6 million and management $5.6 million, so each dollar that reaches the programmes costs about $1.51 of donations. We value the grants as what UNHCR did with its money in 2025, sector by sector, and estimate **<span data-figure="headline" data-model="usa-for-unhcr-charityevals">0.094</span> years of healthy life per $1,000**, close to the site's global-health median. Neither USA for UNHCR nor UNHCR counts who this money reached, so every branch is built from judged costs per person and the research on its kind of work, with wide ranges, and counted at half by the site's shared missing-data slider. We use USA for UNHCR's 2025 Form 990 because the audited statements on its website are behind a bot check.

### How the model works

**UNHCR's mix.** UNHCR spent $3.8 billion in 2025 (its audited accounts, programme support and management included). We split a grant dollar the way UNHCR spent: about 29% on cash, relief items, shelter and water, 7% on health and nutrition, 5% on education, 4% on livelihoods, 11% on solutions (the audited figure for impact area 4) and the rest, about 43%, on protection. Only the solutions share is audited; the others are judgments anchored on UNHCR's Global Report 2025 and Global Appeal 2025.

**Relief** (about a quarter of the result). At $60 a person reached, 60% of it as cash or goods, valued on the site's log-income scale for refugees on about $900 a year. Death rates among the people reached run 0.013 a year against a normal 0.008, and relief removes 4% of the extra deaths over half a year. Water and shelter avert some diarrhoea and respiratory illness.

**Protection** (about a third). Most of it is registration, documents, refugee status determination and legal help, at $25 a person, worth a judged 1.5% more consumption for three years (papers open hosts' services and sometimes legal work) and a few deaths averted by protection from forced return. A third is services for survivors of violence and separated children, at $80 a person, valued as mental-health gains in WELLBYs as in Save the Children's protection branch.

**Health** (about a tenth). At $15 a person-year of care in camps, removing 12% of a 0.006 yearly death rate, plus illness as a share of the deaths' value.

**Education, livelihoods and solutions** (a tenth together). Education at $150 a child, valued through later earnings as in Save the Children's model. Livelihoods at $250 a household, a 4% consumption gain for two years. Solutions: resettlement at $1,500 a refugee resettled, worth the lifetime gain from a refugee's consumption to a resettled family's, with UNHCR's share of the credit 20% and only 30% of it not happening anyway (states set the number of places); returns at $250 a person, valued as cash.

**Gifts in kind** (about an eighth). Clothes and kits at 45% of their US value to the people who get them; software and transport at half of what the same cash does through UNHCR.

**Awareness.** Each dollar is judged to bring UNHCR $0.30 more (from nothing to $1.50), valued at what the grants do.

Every branch shares credit with host governments, partners and others' resources, and is discounted for delivery losses (85%), the wait before help arrives and missing data.

### What drives the result

The missing-data slider comes first, then the value of a healthy year in units of value, what registration and documents are worth and cost, the protection branch's evidence and credit, and refugees' baseline consumption. The combined range runs from 0.02 to 0.45.

### What isn't modelled

Everything we know of is a row. Host communities gain from refugees' spending (+3%); aid can depress local prices and raise tensions (-2%). Funging between USA for UNHCR's earmarked grants and UNHCR's flexible money is in the leverage row, at 1.

### How this model was checked

Built with charityevals' humanitarian-relief template on 14 November 2026, as a portfolio of branches over UNHCR's sectors (Convention 4); the mechanical audit passes. The independent audit rounds are in audits/usa-for-unhcr-charityevals/.

### Sources

- [USA for UNHCR, Form 990 for 2025 (IRS e-file XML)](https://gt990datalake-rawdata.s3.amazonaws.com/EfileData/XmlFiles/202622319349300112_public.xml)
- [ProPublica Nonprofit Explorer: United States Association for UNHCR](https://projects.propublica.org/nonprofits/organizations/521662800)
- [UNHCR, Financial report and audited financial statements for 2025 (A/81/5/Add.6)](https://digitallibrary.un.org/record/4126985/files/A_81_5_Add.6-EN.pdf)
- [USA for UNHCR, audited financial statements 2022 and 2021](https://admin.unrefugees.org/media/slqpv1nl/usa-for-unhcr-2022-fs.pdf)
- [Charlson et al. (2019), New WHO prevalence estimates of mental disorders in conflict settings](https://doi.org/10.1016/S0140-6736(19)30934-1)
