### Summary

ShelterBox gives emergency shelter, household items and cash to families after disasters and conflict. Our model of its 2025 work comes to **<span data-figure="headline" data-model="shelterbox-charityevals">0.3</span> years of healthy life per 1,000 dollars**. That is above most relief models on the site, because most of its aid goes to very poor displaced families, for whom a few dozen dollars of shelter and goods count for a lot.

### What the charity does

ShelterBox Trust is a UK charity based in Truro. Thirteen affiliates, such as ShelterBox USA and ShelterBox Canada, raise money for it, and Rotary is a long-standing partner. In 2025 it spent £16.7m on charitable activities and £4.8m on raising funds. Of the charitable spending, £7.2m went as grants to local partners, £5.2m on aid items, freight and other direct costs, £2.9m on staff and £1.5m on support. It counts more than 231,000 people supported in 17 countries and territories.

About three fifths of its grants went to conflict and displacement: Syria, Yemen and Gaza; Sudanese refugees in Chad; displaced families in Somalia, Cameroon, Burkina Faso and Ethiopia. The rest went to disasters: Hurricane Melissa in Jamaica, typhoons and an earthquake in the Philippines, earthquakes in Myanmar and Afghanistan, and floods in Pakistan. The aid includes:

- tents, tarpaulins, toolkits and storm strapping;
- blankets, mattresses, kitchen sets, solar lights, water carriers and mosquito nets;
- cash for building materials or labour;
- in protracted crises, mudbrick and more durable shelters.

### How the impact happens

Families who have lost their homes get shelter and the basics to cook, sleep and keep dry. Most of the value is the goods themselves, counted like consumption. A smaller part comes from the deaths and illness that shelter, blankets, nets and water items avert in the months after a crisis.

### How the model works

- **Cost:** the 2025 accounts. Fundraising is spread over the programme. Donated stock and freight (£0.6m) count as others' resources, not as ShelterBox's cost.
- **Value per person:** the money that reaches people as shelter, items, materials or cash (our judgment: 65% of grants and direct costs), divided by the people reached. That comes to about 46 dollars a person.
- **Consumption:** the goods are valued against the consumption of poor households in two stand-in countries, weighted by where the grants went. Mozambique stands in for the low-income conflict settings and Bangladesh for Asia and the Caribbean.
- **Deaths averted:** the crisis's excess death rate, times the share the aid averts (our judgment: 2%), over half a year.
- **Illness averted:** acute episodes averted, times their length and disability weight.
- **Adjustments:**
  - evidence: in-kind aid is worth somewhat less to people than its cost;
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

Shelters that last beyond the year, preparedness (stock held in warehouses, training in building back safer) and tenancy support count only as small shares of the value. So do the harms: funging, crowding out local markets, and the emissions of tents and freight.

### How this model was checked

Mechanical checks (scripts/audit-model.ts, scripts/check.ts, simulation-check, normalization-audit) and independent audit rounds with the audit-cea skill, kept in audits/shelterbox-charityevals/.

### Sources

- [ShelterBox Annual Report 2025 (trustees' report and audited accounts)](https://images.shelterbox.org/site-1/2026/08/ShelterBox-Annual-Report-2025.pdf)
- [ShelterBox Annual Report 2024](https://opencharities.uk/ew/1096479/files/2024-12-31-accounts.html)
- [Maynard, Parker and Twigg 2017, shelter self-recovery evidence synthesis (executive summary)](https://fic.tufts.edu/wp-content/uploads/Shelter-Executive-Summary.pdf)
- [OCHA Financial Tracking Service, 2025 response plans by cluster](https://api.hpc.tools/v1/public/fts/flow?planId=1221&groupby=cluster)
- [Wolf et al. 2022, water, sanitation and hygiene and diarrhoea](https://doi.org/10.1016/s0140-6736(22)00937-0)
