### Summary

World Vision is a Christian humanitarian organisation. World Vision US raises money, mostly through child sponsorship, and receives US government and UN food grants. It passes them to World Vision's field offices for community development and disaster and food-crisis response, mostly in Sub-Saharan Africa. Its international programmes do about **{{result}} years of healthy life per 1,000 dollars**.

More than half of that is relief: food and cash for people in food crises, and a few deaths averted. Livelihoods work, child health and nutrition, clean water and education make up the rest. World Vision US publishes no outcome figures for its own spending, so every part is built from its spending, judged costs per person and the research on that kind of work. Every part is discounted for missing data.

Its US programme passes donated goods to churches, schools and nonprofits. It does about {{result:world-vision-charityevals-domestic}} per 1,000 dollars, because the goods go to people in a rich country, where they add little to what a family consumes.

### What the charity does

Figures are World Vision US's Form 990 for the year to 30 September 2025:

- **International programmes** ($988 million). Almost all of it ($950 million) is grants to World Vision field offices and partners abroad, 71% of them in Sub-Saharan Africa. The money pays for child-sponsorship area programmes (health and nutrition, water and sanitation, education, child protection, savings groups and farming, church work) and for emergency response. Much of the emergency money is food from the World Food Programme and US government grants ($512 million of public grants in all).
- **Domestic programmes** ($231 million). Corporate donations of clothing, household goods, hygiene items, school supplies and building materials ($206 million at wholesale value) are passed from World Vision's warehouses to US churches, schools and nonprofits.
- **Public awareness and education** ($3.4 million). Advocacy to US officials and the public on global poverty.

### How the impact happens

1. Food rations and cash in a food crisis raise what families consume for a few months and avert some deaths from hunger and the infections it worsens.
2. Community health workers' visits in pregnancy and after birth cut newborn deaths and stillbirths; malnutrition treatment, nets and child health care avert some later child deaths.
3. A new water point cuts diarrhoeal deaths a little and saves hours of fetching water.
4. Savings groups and farming support raise household consumption a little; reading programmes raise learning and, later, earnings.
5. Donated clothing, household goods and supplies, shipped abroad or handed out in the US, save families some spending.
6. Advocacy may keep a little US foreign aid.

### How the model works

- **Cost**: each programme's expenses from the Form 990, with World Vision US's management and fundraising spread over all of them. The grants count as the work they fund. Donated goods and the US government and WFP food commodities are left out of the cost; World Vision gets its own spending's share of the resources behind them.
- **The split**: World Vision US doesn't say how its international money divides. We judge 45% relief, a bit above the whole World Vision partnership's 39%, since World Vision US receives the partnership's US public grants. We split the development money by judgment: 30% health and nutrition, 25% water, 6% church work (no value on this scale), the rest livelihoods and education. Donated goods shipped abroad are taken out first and valued as goods.
- **Relief**: people reached are the spending at the partnership's cost per person reached ($1,060 million for 35.6 million people). Excess deaths in the crisis are the gap between a crisis death rate and the countries' normal rate, a tenth of it averted over about two months. The food and cash are also valued on the site's log-income scale at crisis-affected people's consumption, over the months they cover.
- **Health**: children covered are spending over a judged $150 per child. Newborn deaths and stillbirths fall by the Cochrane review's effect for community newborn packages. Later child deaths fall by a judged 6%.
- **Water**: people served are spending over a judged $150 a person, anchored on the partnership's 2.8 million people given water and World Vision US's share of the development money. Diarrhoeal deaths fall by a judged 12% over the water point's working years, discounted. Time saved is worth about 0.75% of consumption.
- **Livelihoods and education**: households reached over a judged $180 each (anchored the same way on the partnership's reach), a 1.5% consumption gain for two years, plus the child deaths higher incomes avert (a fifth of the gain's value, the cash-income ratio); children reached over a judged cost, a small learning gain carried into adult earnings.
- **Goods shipped abroad** ($43 million of clothing, furniture and supplies): their value to the people who get them, at 45% of US wholesale value, on the log-income scale, credited for the judged handling cost (10% of their value) against the goods at local prices.
- **Domestic**: the goods' value over a judged $180 per household, worth 60% of that to the family, on the log-income scale at low-income American families' consumption (the poorest fifth's per person, judged lower for families with children); a third of the goods would have reached similar families anyway.
- **Adjustments**: each branch has its own evidence, counterfactual and attribution adjustments. Goods valued at their cost (relief and donated goods) take no evidence step. Every branch is discounted for missing data.

### What drives the result

- **The missing-data slider**: every branch is thin, so it scales the whole result.
- **The livelihoods gain**: the trials of savings groups find little, so a small change here moves a few percent of the result.
- **Relief**: what other agencies would have delivered anyway, and the share of crisis deaths food assistance averts.
- **Costs per person**: health, water and livelihoods reach are spending over a judged cost.

### Biggest uncertainties

- World Vision US doesn't publish how its international money splits between relief and development or between sectors, nor how many people its own money reached.
- No mortality evaluation of World Vision's health work exists; the effect comes from trials of similar packages under study conditions.
- Food assistance's effect on deaths in crises rests on weak evidence.
- The domestic model's reach and the goods' worth to families are judgments.

### What isn't modelled

Beyond a share in unmodelled benefits: child protection (birth registration, ending child marriage), sanitation's and hygiene's own health effects, women's empowerment, the sponsorship relationship, land restored, and the harms of funging and aid dependency.

### How this model was checked

The mechanical audit (`scripts/audit-model.ts`) runs on both models, and independent auditors (a fresh agent each round, using the audit-cea skill) checked them; the rounds are in `audits/world-vision-charityevals/` and `audits/world-vision-charityevals-domestic/`.

- **Round 1**: one high finding in the international model and two in the domestic one. The unmodelled-benefits share was a typed 5% shared by several models and counted funging and faith twice; it is now a sum of signed, sized items in both. The domestic goods were understated: KPMG's note on gifts-in-kind used at home ($206 million) replaced the 990's grants line ($163 million). Mediums fixed: livelihoods and water costs per person anchored on the partnership's reach (they had implied more people than the whole partnership reported), donated goods abroad split out as their own branch, relief given an attribution share for WFP's costs off World Vision's books and a counterfactual about who would have been helped, the crisis deaths' ages taken from the site's WHO split, and the domestic model's consumption anchor, counterfactual and overlapping adjustments reworked. Together these lowered the international result by about a fifth and raised the domestic one by about a third.
- **Round 2** (verification, both models): no high finding. Fixed after it: the domestic summary's stale figure, the water cost per person ($100 to $150, by its own anchor's arithmetic), and explainer wording; a third, short verification round checked those changes.
- **Round 4** (verification of a site-wide pass): relief goods counted over the months they cover, goods valued at cost without an evidence step and at 95% credit, and the livelihoods' mortality step. The result went from 0.26 to 0.29. No high or medium finding; its lows (wording) were fixed.

### Sources

- World Vision, Inc., [Form 990 for the year to 30 September 2025](https://projects.propublica.org/nonprofits/organizations/951922279/202611209349301676/full) (IRS e-file object 202611209349301676).
- World Vision International and World Vision, Inc., [Combined Financial Statements, 30 September 2025](https://app.fac.gov/dissemination/report/pdf/2025-09-GSAFAC-0000419272) (KPMG, Federal Audit Clearinghouse).
- World Vision International, [Global Annual Report 2025](https://www.wvi.org/sites/default/files/2026-05/WVI%20Global%20Annual%20Report%202025.pdf).
- Lassi and Bhutta, [Community-based intervention packages for reducing maternal and neonatal morbidity and mortality](https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007754.pub3/full), Cochrane 2015.
