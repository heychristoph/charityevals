### Summary

The International Rescue Committee spent $1.33 billion in the year to September 2025. Programmes took $1.14 billion of it, in two lines. Crisis Response, Recovery and Development ($754 million) is its work in more than 40 crisis-affected countries; this model covers it. Resettlement, Asylum and Integration ($387 million, mostly in the US) is in charityevals' second IRC model, `international-rescue-committee-charityevals-resettlement`. The accounts don't split the crisis line by sector, so we split it with the IRC's own split of all programme spending by outcome (health 43%, safety 24%, economic well-being 22%, education 10%), after taking out the resettlement line's likely share of each. Each sector is then costed from the reach the IRC reports for 2025.

### How the model works

**Nutrition** (about a third of the result). The IRC admitted 638,187 children under five and 85,163 pregnant or lactating women for treatment. Its own cost is about $110 an admission; UNICEF and WFP supply most of the therapeutic food. Half the children are severely wasted. Untreated, about 10% of them die, and treatment averts 60% of those deaths. A moderately wasted child counts at a fifth of that. These are the same figures as charityevals' Save the Children model.

**Other health care** (about a quarter). This is primary, reproductive and mental health care at 2,713 supported facilities, about $330 million once nutrition, vaccination and water are taken out. At $25 a person covered for a year, that is about 13 million people. Their death rate in the crisis is 0.02 a year against a normal 0.008, and the care averts 10% of the excess.

**Cash** (about a fifth). The IRC gave $52.5 million in cash and vouchers to 1.5 million people, about $34 each. Delivery costs a further 25 cents a dollar. Recipients live on about $700 a year at international prices. This branch is the one measured part of the model: the dollars and the people are counted, and the transfer is itself the benefit.

**Vaccination, education, livelihoods, water and protection.** The IRC-led REACH consortium delivers about 8 million doses a year at about $1 a dose. Gavi and UNICEF pay for the vaccines, so the IRC gets a quarter of the credit. Education reaches 602,546 children, at the median learning gain of education trials. Livelihoods spends what is left of the economic budget. Water reaches 2.5 million people. Women's and children's protection counts its mental-health gains in WELLBYs.

Every branch has the same delivery adjustment (85%) and funging factor (1). Every branch but cash takes the missing-data discount.

### What drives the result

The missing-data slider comes first. Next are the death rate of severely wasted children without treatment, the value of a child's death, the crisis death rate and the share of it care averts, and the cost of health care per person covered. The combined range runs from about 0.13 to 1.5 healthy years per $1,000. About six times the site's global-health median, this is twice Save the Children: more of the IRC's money goes to malnutrition treatment and cash, whose reach it counts.

### What isn't modelled

Not modelled (+): contraception and safe births beyond the deaths counted, violence prevented by protection work, time saved fetching water, and the IRC's research. Not modelled (-): aid diverted in conflict zones, safeguarding failures, and programmes cut short by the 2025 US funding cuts. Together these are judged at +5%.

### How this model was checked

Built with charityevals' humanitarian-relief template on 14 November 2026, with eight branches over the crisis line (Convention 4). The mechanical audit passes. The independent audit rounds are in `audits/international-rescue-committee-charityevals/`.

### Sources

- [IRC, consolidated financial statements, year ended September 30, 2025 (KPMG)](https://www.rescue.org/irc-document/irc-financial-statement-fy-2025)
- [IRC, 2025 Annual Report, Executive Summary](https://www.rescue.org/sites/default/files/2026-08/PO2605_2025%20Annual%20Report_Exec%20Summary.pdf)
- [IRC, 2025 Annual Report](https://www.rescue.org/sites/default/files/2026-06/Annual%20Report%202025.pdf)
- [Evans & Yuan (2022), How Big Are Effect Sizes in International Education Studies?](https://doi.org/10.3102/01623737221079646)
- [Charlson et al. (2019), New WHO prevalence estimates of mental disorders in conflict settings](https://doi.org/10.1016/S0140-6736(19)30934-1)
