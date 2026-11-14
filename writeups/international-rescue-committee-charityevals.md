### Summary

The International Rescue Committee spent $1.33 billion in the year to September 2025. Programmes took $1.14 billion of it, in two lines. Crisis Response, Recovery and Development ($754 million) is its work in more than 40 crisis-affected countries; this model covers it. Resettlement, Asylum and Integration ($387 million, mostly in the US) is in charityevals' second IRC model, `international-rescue-committee-charityevals-resettlement`. The accounts don't split the crisis line by sector, so we split it with the IRC's own split of all programme spending by outcome (health 43%, safety 24%, economic well-being 22%, education 10%), after taking out the resettlement line's likely share of each. Each sector is then costed from the reach the IRC reports for 2025.

### How the model works

**Nutrition** (about two fifths of the result). The IRC admitted 638,187 children under five and 85,163 pregnant or lactating women for treatment. Its own cost is about $110 an admission; UNICEF and WFP supply most of the therapeutic food. Half the children are severely wasted. Untreated, about 10% of them die, and treatment averts 60% of those deaths. A moderately wasted child counts at a fifth of that. These are the same figures as charityevals' Save the Children model.

**Other health care** (about a sixth). This is primary, maternal and mental health care at 2,713 supported facilities, about $300 million once contraception, nutrition, vaccination and water are taken out. At $25 a person covered for a year, that is about 12 million people. A third of them live in acute crises, where deaths run at three times the normal rate, and the rest in protracted ones at 1.3 times. The care averts 10% of the excess.

**Cash** (about a sixth). The IRC gave $52.5 million in cash and vouchers to 1.5 million people, about $34 each. Delivery costs a further 25 cents a dollar. The cash covers about three months of needs for people who live on about $700 a year at international prices. This branch is the one measured part of the model: the dollars and the people are counted, and the transfer is itself the benefit.

**Contraception** (about a tenth). It is one of the four interventions the IRC says it will scale first, but it publishes no count. We put it at 5% of health spending, at $30 a couple-year of protection, each valued at GiveWell's figure for low-income countries.

**Vaccination, education, livelihoods, water and protection.** The IRC-led REACH consortium delivers about 8 million doses a year at about $1 a dose. Gavi and UNICEF pay for the vaccines, so the IRC gets a quarter of the credit. Education reaches 602,546 children, at the median learning gain of education trials. Livelihoods spends what is left of the economic budget. Water reaches 2.5 million people and also saves the time spent fetching it. Protection counts its mental-health gains in WELLBYs for everyone its spending reaches, not only those counted in safe spaces.

Every branch has the same delivery adjustment (85%) and funging factor (1). Every branch but cash takes the missing-data discount.

### What drives the result

The missing-data slider comes first. Next are the death rate of severely wasted children without treatment, the value of a child's death, the cost of health care per person covered, and the share of excess deaths the care averts. The combined range runs from about 0.11 to 1.3 healthy years per $1,000. That is about four times the site's global-health median and twice Save the Children: more of the IRC's money goes to malnutrition treatment and cash, whose reach it counts.

### Side effects

Time saved fetching water and cash's effects on local markets are rows in their branches. Four more are estimated against the result: violence prevented (+0.5%), the IRC's research used by others (+1%), aid diverted in conflict zones (−2%) and safeguarding failures (−0.5%). All of them count at the site's side-effect weight.

### How this model was checked

Built with charityevals' humanitarian-relief template on 14 November 2026, with nine branches over the crisis line (Convention 4). Round 1 of the independent audit had one high finding: the typed unmodelled-benefits share, now replaced by estimated side-effect rows. It also had five medium findings, all fixed: the age mix of deaths now reads the shared stand-in, the crisis death rate is split into acute and protracted settings, nutrition's judgments are anchored, the zero for goods is no longer labelled observed, and side effects are estimated. The lows are fixed too: the price level for cash, the months cash covers, the interval for mental-health prevalence, and reach counted from spending for protection. Contraception, found on the way, became its own branch. Together the changes moved the result from 0.45 to 0.39. The rounds are in `audits/international-rescue-committee-charityevals/`.

### Sources

- [IRC, consolidated financial statements, year ended September 30, 2025 (KPMG)](https://www.rescue.org/irc-document/irc-financial-statement-fy-2025)
- [IRC, 2025 Annual Report, Executive Summary](https://www.rescue.org/sites/default/files/2026-08/PO2605_2025%20Annual%20Report_Exec%20Summary.pdf)
- [IRC, 2025 Annual Report](https://www.rescue.org/sites/default/files/2026-06/Annual%20Report%202025.pdf)
- [Evans & Yuan (2022), How Big Are Effect Sizes in International Education Studies?](https://doi.org/10.3102/01623737221079646)
- [Charlson et al. (2019), New WHO prevalence estimates of mental disorders in conflict settings](https://doi.org/10.1016/S0140-6736(19)30934-1)
