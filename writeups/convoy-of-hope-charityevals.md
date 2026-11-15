### Summary

Convoy of Hope is a faith-based humanitarian charity in Springfield, Missouri. It passes donated food, clothing, household goods and medicines to partner churches and charities in the US and abroad, gives a school-day meal to 635,000 children in poor countries, trains farmers and women, holds community events in US cities and sends relief supplies to disasters. Its work does about **<span data-figure="headline" data-model="convoy-of-hope-charityevals">0.06</span> years of healthy life per 1,000 dollars**.

Most of that is the school meals, valued as food for very poor children, then the farmers' and women's training and the goods and medicines sent abroad. Goods handed out in the US add little on the site's log-income scale: a box of groceries is a small share of what even a poor American household spends. Over four fifths of Convoy's expenses are donated goods; they are the donors' resources, so Convoy is credited with its own spending's share of everything behind them. Convoy publishes counts of people served but no outcome measures, so every part is built from its spending, its own counts and judged prices, and every part is discounted for missing data.

### What the charity does

Figures are the audited consolidated accounts for 2024, the latest audited year (total expenses $655 million, of which $532 million were donated goods distributed at the donors' wholesale values and $123 million Convoy's own spending), and the 2024 annual report (Hope Quarterly issue 37):

- **Partner resourcing** ($338 million, $327 million of it donated goods). Food, clothing, household goods and medical supplies from corporate donors, passed from Convoy's distribution centre, or shipped straight from the donor, to churches, pantries and charities in the US and abroad.
- **Community development** ($121 million, $84 million donated goods). Children's Feeding, a school-day meal for more than 635,000 children in Central America and the Caribbean, East and West Africa, Asia and Moldova, through local churches; agriculture training for 39,000 farmers; women's and girls' empowerment for 61,000; rural initiatives in small US towns (37,711 people served); and volunteer field teams.
- **Community events** ($72 million, $69 million donated goods). Outreach events, mostly in US cities: groceries, children's shoes, medical and dental screenings, haircuts and job help for 205,686 guests, with 3,393 organisations and churches.
- **Disaster response** ($67 million, $52 million donated goods). Food, water, hygiene kits, tarps and cleanup supplies in 53 US disasters (713,473 people served, Hurricanes Helene and Milton the largest) and 46 abroad (3.0 million people, 27.3 million meals).

### How the impact happens

1. A school-day meal adds to what a poor child eats; it frees what the family would have spent on that food.
2. Food and goods passed to partners add to what the families they serve consume.
3. Donated medicines abroad give partner clinics care they would otherwise have had to buy or go without.
4. Farmers and women trained earn a little more for a few years.
5. Relief supplies after a disaster cover a family's food, water and cleanup for some days, and avert a few deaths.

### How the model works

- **Cost**: Convoy's own spending on each programme, with all of its fundraising and management spread over it. Donated goods are left out of the cost and enter the credit share instead; a donor's money pays for the sourcing, warehouses, trucks, staff and partners' grants that move them.
- **Goods' worth**: donated food at its US retail value (about a quarter above the wholesale value it is booked at), clothing and household goods a little below their booked value, both lower abroad at local prices (about a third of US prices), then a step for goods given in kind rather than chosen (80% for food, 70% for other goods). Donated medicines abroad are valued at about 30% of their US list price, and what they buy in health at the recipient health systems' cost of a healthy year at the margin.
- **School meals**: the donated food at local prices plus the food bought locally, divided over 635,000 children, about 40 dollars of food a child a year, against the consumption of poor households in the programme countries (about 730 dollars a person a year).
- **Partner resourcing**: about 30% of the goods judged to go abroad; the people served are Convoy's total of 45 million less the other programmes' counts. Goods in the US are valued against the consumption of food-aid recipients.
- **Training**: a judged 1.5% gain in household consumption for two years, discounted.
- **Disasters**: about 55% of the response judged to be in the US. US survivors' goods count against low-income US consumption over a month; abroad, over the four days of meals per person served, with excess deaths a small share of a small post-disaster rise in the death rate.
- **Adjustments**: what other channels would have delivered anyway (60% of the donated goods would not have reached similar people otherwise, 85% of the school meals), Convoy's share of the resources (its own spending over that plus the donated goods at local value plus partners' and volunteers' work: about 6% for partner resourcing, 53% for community development), goods lost or double counted, the ten months a gift waits in reserves and five weeks in the warehouse. Goods valued at their worth take no evidence step; the training and the deaths averted do. Every branch is discounted for missing data.
- **Side effects**: schooling and nutrition from the school meals (+4%), the events' screenings and job help, wells and water filters, surplus kept out of landfill (each small and positive), free goods undercutting local sellers (−1%) and aid tied to church outreach (−0.5%).

### What drives the result

- **The missing-data slider**: every branch is thin, so it scales the whole result.
- **How poor the children fed are**: the school meals are about two thirds of the result.
- **The livelihood gain from training**: zero to 5% of consumption moves the result by about a sixth.
- **The goods' worth**: the food's local price and its in-kind worth, and how much of the donated goods go abroad.

### Biggest uncertainties

- Convoy publishes no split of partner resourcing between the US and abroad, no country split, and no split of community development's spending between its programmes.
- The goods' booked values are the donors' own wholesale valuations, which for surplus stock may overstate what they would sell for.
- Nothing measures whether the school meals improve children's nutrition or schooling, or whether the training raises incomes.
- The counts of people served are Convoy's own and unaudited, and partner resourcing's count is a remainder.

### What isn't modelled

Beyond the side-effect shares: Convoy's faith outreach has no value on this scale (no programme line is evangelism; the cost of any church connection stays in). Excess deaths after disasters in the US are not counted, and illness averted by relief food is left in the unmodelled share.

### How this model was checked

The mechanical audit (`scripts/audit-model.ts`) runs on the model, and independent auditors (a fresh agent each round, using the audit-cea skill) check it; the rounds are in `audits/convoy-of-hope-charityevals/`.

### Sources

- Convoy of Hope, consolidated financial statements for the years ended December 31, 2024 and 2023 (Batts Morrison Wales & Lee), `Convoy-of-Hope-Financial-Statements-BMWL-2023-2024.pdf` on [convoyofhope.org](https://convoyofhope.org/financials/).
- Convoy of Hope, Hope Quarterly issue 37 (Spring 2025, Annual Report 2024), `HQissue37_FINAL.pdf` on [convoyofhope.org](https://convoyofhope.org/).
- Snilstveit et al., [The impact of education programmes on learning and school participation in low- and middle-income countries](https://www.3ieimpact.org/evidence-hub/publications/systematic-reviews/impact-education-programmes-learning-and-school), 3ie systematic review 24, 2016.
- Wydick et al., [Shoeing the children: the impact of the TOMS shoe donation program in rural El Salvador](https://doi.org/10.1093/wber/lhw042), World Bank Economic Review 2018.
