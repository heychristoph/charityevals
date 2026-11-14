### Summary

USA for UNHCR raises money from Americans for UNHCR, the UN refugee agency. In 2025 it spent $95.5 million: $44.3 million as cash grants to UNHCR's operations, $10.8 million as donated clothes, hygiene kits, software and transport, and $8.2 million on awareness work in the US. Fundraising took $26.6 million and management $5.6 million, so each dollar that reaches the programmes costs about $1.51 of donations. We value the grants as what UNHCR did with its money in 2025, sector by sector, and estimate **<span data-figure="headline" data-model="usa-for-unhcr-charityevals">0.061</span> years of healthy life per $1,000**, about two-thirds of the site's global-health median. UNHCR counts its resettlement departures but not who this money reached otherwise, so every branch is built from judged costs per person and the research on its kind of work, with wide ranges, and counted at half by the site's shared missing-data slider. We use USA for UNHCR's 2025 Form 990 because the audited statements on its website are behind a bot check.

### How the model works

**UNHCR's mix.** UNHCR spent $3.8 billion in 2025. Its audited accounts split this into four impact areas; we split those further by judgment. A grant dollar goes about 33% to cash, relief items, shelter and water, 7% to health and nutrition, 5% to education, 4% to livelihoods, 11% to solutions and 40% to protection. A quarter of UNHCR's spending is its own programme support and management, so every judged delivery cost is raised by 38%.

**Relief** (a third of the result). At $60 a person reached, 60% of it reaches people as cash or goods. It is valued on the site's log-income scale for refugees on 45% of their host country's survey consumption, weighted by USA for UNHCR's grants by region. Death rates among the people reached run 0.013 a year against a normal 0.008, and relief removes 4% of the extra deaths over half a year. Water and shelter avert some diarrhoea and respiratory illness.

**Protection** (about a quarter). Most of it is registration, documents, refugee status determination and legal help, at a $25 delivery cost a person. For a judged 2% of them, the papers bring legal work or host services. That is worth the 48% consumption gain Colombia's regularisation of Venezuelans brought (Ibáñez et al. 2024), for three years. Protection from forced return averts a few deaths. A third of protection is services for survivors of violence and separated children, valued as mental-health gains in WELLBYs as in Save the Children's protection branch.

**Health** (about a tenth). Care costs a $15 delivery cost a person-year in camps. It removes 12% of a 0.006 yearly death rate, plus illness as a share of the deaths' value.

**Education, livelihoods and solutions** (an eighth together). Education costs $150 a child and is valued through later earnings, as in Save the Children's model. Livelihoods cost $250 a household for a 4% consumption gain over two years. Resettlement costs about $1,700 a refugee: UNHCR's resettlement spending over its 37,237 departures in 2025. It is worth the lifetime gain from a refugee's consumption to the lowest US quintile's. UNHCR's share of the credit is 20%, and only 30% wouldn't have happened anyway, because states set the number of places. Returns cost $250 a person and are valued as cash.

**Gifts in kind** (about a seventh). Clothes and kits count at 45% of their US value, abroad at refugees' consumption and in the US at the lowest quintile's. Software and transport count at half of what the same cash does through UNHCR.

**Awareness.** Each dollar is judged to bring UNHCR $0.30 more, from nothing to $1.50. That money is valued at what the grants do.

Every branch shares credit with host governments, partners and others' resources. Each is discounted for delivery losses (85%), the wait before help arrives and missing data.

### What drives the result

The missing-data slider and the value of a healthy year in units of value come first. Then the share of refugees whose papers bring rights and what documents cost. Then how poor the people reached are, against their hosts. The combined range runs from 0.014 to 0.26.

### What isn't modelled

Every effect we know of is a row. Host communities gain from refugees' spending (+3%). Aid can depress local prices and raise tensions (-2%). Funging between USA for UNHCR's earmarked grants and UNHCR's flexible money is in the leverage row, at 1.

### How this model was checked

Built with charityevals' humanitarian-relief template on 14 November 2026, as a portfolio of branches over UNHCR's sectors (Convention 4). The mechanical audit passes. Round 1 of the independent audit passed with three medium and five low findings, all fixed:

- Every delivery cost now carries UNHCR's 38% support markup.
- The documents gain is a share of refugees who gain rights times a sourced regularisation effect.
- Refugees' baseline consumption comes from the site's survey consumption for four stand-in countries.
- Gifts in kind and awareness take the delivery and missing-data steps once.
- US-bound clothes are valued at US consumption.
- The relief share is the audited impact area 2 less health and education.
- Resettlement's cost comes from UNHCR's audited departures.
- Resettled consumption reads the shared US figures.

The result fell from 0.094 to 0.061. A verification round checked the changes; the rounds are in audits/usa-for-unhcr-charityevals/.

### Sources

- [USA for UNHCR, Form 990 for 2025 (IRS e-file XML)](https://gt990datalake-rawdata.s3.amazonaws.com/EfileData/XmlFiles/202622319349300112_public.xml)
- [ProPublica Nonprofit Explorer: United States Association for UNHCR](https://projects.propublica.org/nonprofits/organizations/521662800)
- [UNHCR, Financial report and audited financial statements for 2025 (A/81/5/Add.6)](https://digitallibrary.un.org/record/4126985/files/A_81_5_Add.6-EN.pdf)
- [USA for UNHCR, audited financial statements 2022 and 2021](https://admin.unrefugees.org/media/slqpv1nl/usa-for-unhcr-2022-fs.pdf)
- [Ibáñez et al. (2024), Life out of the Shadows: The Impacts of Regularization Programs on the Lives of Forced Migrants](https://poverty-action.org/sites/default/files/2025-05/Ib%C3%A1%C3%B1ez%20et%20al.%20%282024%29%20Life%20Out%20of%20The%20Shadows%20%282%29_0.pdf)
- [Charlson et al. (2019), New WHO prevalence estimates of mental disorders in conflict settings](https://doi.org/10.1016/S0140-6736(19)30934-1)
