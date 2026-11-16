### Summary

ShelterBox gives emergency shelter, household items and cash to families after disasters and conflict. Our model of its 2025 work comes to **{{result}} years of healthy life per 1,000 dollars**. That is above most relief models on the site, because most of its aid goes to very poor displaced families, for whom a few dozen dollars of shelter and goods count for a lot.

### What the charity does

ShelterBox Trust is a UK charity based in Truro. Thirteen affiliates, such as ShelterBox USA and ShelterBox Canada, raise money for it, and Rotary is a long-standing partner. In 2025 it spent £16.7m on charitable activities and £4.8m on raising funds; ShelterBox USA, which raised most of the affiliates' money, spent another $4.3m of its own. Of the charitable spending, £7.2m went as grants to local partners, £5.2m on aid items, freight and other direct costs, £2.9m on staff and £1.5m on support. It counts more than 231,000 people supported in 17 countries and territories.

About two thirds of its grants went to conflict and displacement: Syria, Yemen and Gaza; Sudanese refugees in Chad; displaced families in Somalia, Cameroon, Burkina Faso and Ethiopia. The rest went to disasters: Hurricane Melissa in Jamaica, typhoons and an earthquake in the Philippines, earthquakes in Myanmar and Afghanistan, and floods in Pakistan. The aid includes:

- tents, tarpaulins, toolkits and storm strapping;
- blankets, mattresses, kitchen sets, solar lights, water carriers and mosquito nets;
- cash for building materials or labour;
- in protracted crises, mudbrick and more durable shelters.

### How the impact happens

Families who have lost their homes get shelter and the basics to cook, sleep and keep dry. Most of the value is the goods themselves, counted like consumption. A smaller part comes from the deaths and illness that shelter, blankets, nets and water items avert in the months after a crisis.

### How the model works

- **Cost:** the 2025 accounts. Fundraising, and ShelterBox USA's own costs, are spread over the programme. Donated stock and freight (£0.6m) count as others' resources, not as ShelterBox's cost.
- **Value per person:** the money that reaches people as shelter, items, materials or cash (our judgment: 65% of grants and direct costs), divided by the people reached. That comes to about 46 dollars a person, worth 80% of that to the people who get it (in-kind aid is worth somewhat less to people than its cost).
- **Consumption:** the goods are valued against the consumption of poor households in two stand-in countries, weighted by our judgment of where the people were (the grants, adjusted for ShelterBox's own deliveries). Mozambique stands in for the poorest settings (Syria, Yemen, Chad, Somalia, Afghanistan, Burkina Faso, Gaza) and Bangladesh for the rest (Cameroon, Ethiopia, the rest of Asia and Jamaica). Durable shelter and repairs count over the years they are used.
- **Deaths averted:** the crisis's excess death rate, times the share the aid averts (our judgment: 2%), over half a year.
- **Illness averted:** acute episodes averted, times their length and disability weight.
- **Emissions:** the climate harm of making and shipping the aid, through the site's climate rows.
- **Adjustments:**
  - evidence: for the deaths and illness averted only (the goods, valued at their cost, need no effect study);
  - counterfactual: shelter clusters in ShelterBox's countries were 13–27% funded in 2025;
  - credit: shared with partners, volunteers and donors of goods;
  - delivery;
  - missing data: no study measures what emergency shelter does to health.

### What drives the result

Most of the result comes from the value of the goods to very poor families. The deaths and illness averted are a small share. The result moves most with:

- the shared missing-data slider and the conversion from units of value to healthy years;
- how poor the households reached are, as a share of their country's average consumption;
- the counterfactual;
- how much of the spending reaches people as goods.

### Biggest uncertainties

- What share of the grants and direct costs reaches people, rather than staff, transport and offices. ShelterBox publishes no cost split for its responses.
- The consumption of the families reached. The model uses two stand-in countries, and there are no surveys for Syria, Yemen or Somalia.
- How many deaths shelter averts. The evidence synthesis on shelter programmes rates the evidence on health as limited and inconsistent.
- Whether people value the items as much as they cost, compared with cash.

### What isn't modelled

Preparedness (stock held in warehouses, training in building back safer) and tenancy support count only as a small share of the value. So do two harms: funging and crowding out local markets.

### How this model was checked

Mechanical checks (scripts/audit-model.ts, scripts/check.ts, simulation-check, normalization-audit) and independent audit rounds with the audit-cea skill, kept in audits/shelterbox-charityevals/. Round 1 (1 high, 2 medium, 2 low) moved the emissions of the aid into the site's climate rows, added ShelterBox USA's own costs to the overhead, valued Cameroon and Ethiopia at the middle stand-in, and spread durable shelter over its years in the main chain instead of a side-effect share. Round 2 (1 high, 2 low) removed a duplicated row, moved Afghanistan to the poorest stand-in and corrected leftover figures in the explanations. A verification round checked those changes. A later site-wide pass moved the in-kind discount out of the evidence step into the goods' value (85% of cost) and kept the evidence step for the deaths and illness only (0.2125 to 0.2150); round 4 verified it with no high or medium finding. A verification round (5) checked the site-wide methane row (0 here: the aid's tonnes are CO₂); result unchanged.

### Sources

- [ShelterBox Annual Report 2025 (trustees' report and audited accounts)](https://images.shelterbox.org/site-1/2026/08/ShelterBox-Annual-Report-2025.pdf)
- [ShelterBox Annual Report 2024](https://opencharities.uk/ew/1096479/files/2024-12-31-accounts.html)
- [Maynard, Parker and Twigg 2017, shelter self-recovery evidence synthesis (executive summary)](https://fic.tufts.edu/wp-content/uploads/Shelter-Executive-Summary.pdf)
- [OCHA Financial Tracking Service, 2025 response plans by cluster](https://api.hpc.tools/v1/public/fts/flow?planId=1221&groupby=cluster)
- [Wolf et al. 2022, water, sanitation and hygiene and diarrhoea](https://doi.org/10.1016/s0140-6736(22)00937-0)
