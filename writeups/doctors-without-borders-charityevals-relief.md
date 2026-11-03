### Summary

Besides medical care, Médecins Sans Frontières hands out relief items to displaced families (653,300 families in 2025) and runs search and rescue in the Mediterranean. We estimate **<span data-figure="headline" data-model="doctors-without-borders-charityevals-relief">1.1</span> years of healthy life per $1,000** for this work, about 1.7% of MSF's programme spending. The result is mostly uncertainty: MSF doesn't publish what the distributions cost, and no study measures how many deaths household items avert. MSF's main model, its medical care, is [here](/doctors-without-borders/doctors-without-borders-charityevals).

### How the model works

The distributions' cost is the families reached times our estimate of 45 euros a family (items and delivery); the items' market value is 70% of that (about 36 dollars a family), counted on the site's log-income scale for people consuming about $1.50 a day. On top, the items avert an estimated 1.5% of displaced people's excess deaths for half a year (mainly nets against malaria, plus shelter, blankets, jerrycans and soap), at a crisis death rate of 1.5 per 10,000 a day (Sphere's emergency threshold is 1, MSF's Zamzam survey found 2.5), with a small amount of illness; these health effects are discounted by half for resting on no study of kits. A 72% counterfactual reflects the badly underfunded shelter and non-food-item clusters: OCHA's tracking shows them 21% funded in the DRC, 24% in Sudan and 34% in South Sudan in 2025. The DRC's household size, prices and death rate stand in for every country MSF distributes in.

Search and rescue (3.2 million euros) had no ship at sea until November 2025 and MSF publishes no full-year rescue count (a first mission rescued 27 people), so it is valued by the proxy step: the site's model of the RNLI's lifeboats, counted at half by the shared missing-data slider.

### What drives the result

The share of excess deaths averted (0.7 to 1.7) moves the result most, then consumption (0.8 to 1.4), the counterfactual (0.7 to 1.3) and how long the items protect.

### How this model was checked

Independent audit, round 1 (no high, 4 medium, 5 low): the crisis death rate was moved from Sphere's threshold to a survey-anchored figure; the evidence adjustment was split into the goods (1) and the health effects (0.5); the share of deaths averted was built from the nets' trial effect; the items' value was tied to their cost; funging set to 1. Round 2 (1 high, 2 medium, 6 low): the waits (reserves, delivery, the months of protection) are now discounted; the unsourced counterfactual and kit cost are said to be judgments; the Zamzam survey is cited. Round 3 (no high, 2 medium, 5 low): the counterfactual now rests on OCHA's 2025 cluster funding (72%), the kit cost on UNHCR's family-kit price, and 2025 prices on the BLS index. Kept: the proxy for search and rescue (no full-year count) and MSF's own staff-cost share from its accounts.

### Sources

- [MSF International Financial Report 2025](https://www.msf.org/sites/default/files/2026-07/MSF_International_Financial_Report_2025.pdf)
- [MSF International Activity Report 2025: 2025 figures](https://www.msf.org/international-activity-report-2025/2025-figures)
