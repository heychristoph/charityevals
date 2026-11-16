### Summary

Direct Relief ships medicines and supplies that drug companies donate, requested by health facilities abroad and by safety-net clinics in the US, and gives cash grants to local health organisations. Our model of its work abroad comes to **{{result}} years of healthy life per $1,000**; its US work, modelled separately, comes to **{{result:direct-relief-charityevals-us}} years of healthy life per $1,000**, because a year of healthy life costs far more at the margin in the US. Almost all of what Direct Relief hands out is donated: a donor's dollar pays for the sourcing, storage and shipping that get the goods to patients, and is credited with its share of the resources behind them.

### What the charity does

In the year to June 2025 Direct Relief shipped medicines, supplies and equipment worth $1.9 billion at US wholesale prices to partners in 92 countries and all 50 states: $535m to Ukraine, $193m to the Middle East (Gaza, Lebanon, Syria), $23m to Sudan, $12m to Haiti, $72m of insulin, 481,000 doses of naloxone, midwife and perinatal kits and fistula repair modules. Its own count is 312 million defined daily doses of medicine. It also gave $69m in grants: $31m abroad (Ukraine rehabilitation and mobile clinics, earthquake recovery in Turkey and Syria) and $37m in the US (health centres and free clinics, recovery after the Los Angeles fires and Hurricanes Helene and Milton). Its own cash spending was $139m, of which $123m on programmes; donated goods, expired donated stock ($250m written off) and donated freight make up the rest of the $2.3 billion of expenses in its accounts.

### How the impact happens

Medicines in the hands of a clinic that lacks them treat infections, keep people with diabetes, heart disease or cancer on their treatment, and get mothers and newborns through complications. Where a facility would have bought the products, the donation frees its budget for other care. Either way the good done is health bought at the margin of the recipient's health system. Grants pay for care directly.

### How the model works

Costs are Direct Relief's cash spending from its audited accounts for fiscal 2025, overhead spread over programmes by cash. Reach is its count of defined daily doses, as patient-years of treatment. The medicines are valued at local prices (about 30% of US wholesale value abroad, from RAND's comparison of US and other countries' drug prices; 60% in the US, where clinics buy at 340B discounts), and the health they buy is what the recipient health systems' marginal dollar buys: abroad, a year of healthy life for about 30% of income per person (Woods et al. 2016; Ochalek et al. 2018), averaged over where the aid went (a harmonic mean, as the poorer countries buy more health per dollar), of which about 60% is deaths; in the US, 5 deaths and 15 years of healthy life lost to illness per $10m (Vanness et al. 2021). The deaths are valued by age at the site's value of a death, the illness as years of healthy life. A ratio for how much more or less these medicines do than the health system's marginal dollar, our judgment, follows: 1 abroad, 1.5 in the US, where the patients would otherwise go without. Direct Relief's share of the credit for the medicines is its own cash (with overhead) over that cash plus the donated goods at local prices; the grants count in full. Each branch has its own adjustments for evidence, what would have happened anyway, delivery (much donated stock is short-dated) and missing data.

### What drives the result

The price of health at the margin in the recipient countries, the need ratio and what would have happened anyway. The credit share matters less than it seems: donated goods worth about $490m at local prices against $44m of Direct Relief's own cash give it about 8% of the credit for the medicines, so the result is close to Direct Relief's cash spent at the recipients' price of health, whatever the goods are worth. In the US, the high price of a year of healthy life at the margin keeps the result low whatever the other judgments.

### Biggest uncertainties

- How useful donated, often short-dated and branded stock is compared with what the recipients' health systems would have bought.
- The recipient health systems' cost per year of healthy life at the margin, estimated only for a few countries and with wide ranges.
- What the donated goods are worth at local prices: Direct Relief books them at US wholesale prices.
- Whether the medicines would have reached patients through other charities or purchases.

### What isn't modelled

Deaths and illness are not modelled drug by drug: both come from what marginal health spending buys. Direct Relief's data and mapping work for responders, cold-chain support and pre-positioned hurricane packs are a small side-effect share, as are the harms of donated stock: crowding out local suppliers and the disposal of products that expire at partners.

### How this model was checked

Mechanical checks (scripts/audit-model.ts, scripts/check.ts, simulation-check, normalization-audit) and independent audit rounds with the audit-cea skill, kept in audits/. Round 1 (abroad: 1 high, 3 medium; US: 2 high, 3 medium) led to deaths split out of the health bought and valued by age (shared facts for medicines abroad, Vanness et al.'s own split in the US), a harmonic mean of the recipients' incomes and a mix of its own for the grants, what would have happened anyway limited to other channels (products a clinic would have bought free its budget, already valued), evidence adjustments as biases only, the expiry adjustment re-anchored on partners' shelves, and the US side-effect share applied to the whole result.

### Sources

- [Direct Relief, audited consolidated financial statements, June 30, 2025](https://www.directrelief.org/wp-content/uploads/2026/01/Direct-Relief-2025-Audit-FS-Report-Final.pdf)
- [Direct Relief, Fiscal Year 2025 Annual Report](https://www.directrelief.org/wp-content/uploads/2026/04/Direct-Relief-Annual-Report-FY-2025-Web.pdf)
- [Woods et al. 2016, Country-level cost-effectiveness thresholds](https://pmc.ncbi.nlm.nih.gov/articles/PMC5193154/)
- [Ochalek et al. 2018, Estimating health opportunity costs in low- and middle-income countries](https://pmc.ncbi.nlm.nih.gov/articles/PMC6231096/)
- [Vanness et al. 2021, A health opportunity cost threshold for the United States](https://pure.psu.edu/en/publications/a-health-opportunity-cost-threshold-for-cost-effectiveness-analys/)
- [RAND 2024, International prescription drug price comparisons](https://pmc.ncbi.nlm.nih.gov/articles/PMC11147645/)
