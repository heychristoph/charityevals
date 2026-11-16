### Summary

Samaritan's Purse is an evangelical Christian relief organisation based in North Carolina. It runs emergency relief in wars and disasters abroad and disaster relief at home, mission hospitals and field hospitals, and Operation Christmas Child, which sends shoebox gifts to children in over {{row:heart_value_per_death}} countries. Its work does about **{{result}} years of healthy life per 1,000 dollars**.

Most of that is goods valued as what people consume: about four months of food rations a person abroad, and the shoeboxes' contents. Few deaths are averted. US rebuilding counts little: a few thousand dollars means little to an American household, and most of the Hurricane Helene money will wait years before it is spent. The Christian education and evangelism lines get no value on this scale beyond the material aid inside them. Samaritan's Purse publishes no outcome figures, so every part is built from its spending, its own counts and judged costs, and every part is discounted for missing data.

### What the charity does

Figures are the audited consolidated accounts for 2025, with the US parent's Form 990 for the splits:

- **Emergency relief and recovery** ($480 million). Of this, $185 million is North American disaster relief and rebuilding: 15 disasters, 16,000 volunteers, 144 homes repaired or rebuilt in western North Carolina. The other $295 million is relief abroad: food, water, shelter, health care and livelihoods in Sudan, South Sudan, the DRC, Gaza, Lebanon and Syria, Ukraine, Myanmar and Jamaica. In South Sudan alone it gave nearly 40 million pounds of food to 302,000 people. It drilled or repaired 920 water points for 274,530 people.
- **Operation Christmas Child** ($490 million). 10.9 million shoeboxes packed by donors, valued at $30.89 each at US retail ($352 million of the line is the boxes themselves). They are shipped abroad and handed out through local churches, along with The Greatest Journey, a discipleship course.
- **Medical ministry** ($72 million). Doctors and dentists sent to mission hospitals (606 in 2025), grants and equipment for those hospitals, the air-lifted Emergency Field Hospital, and cataract and cleft-lip programmes.
- **Children's ministry, other** ($8 million). Mostly the Children's Heart Project, heart surgery for children from poor countries.
- **Christian education and other ministry services** ($103 million). Bibles, training for pastors, evangelistic outreaches and church buildings, plus help for persecuted Christians and retreats for wounded veterans.

### How the impact happens

1. Food rations in a food crisis raise what families eat for a few months and avert some deaths from hunger and the infections it worsens.
2. A new or repaired water point cuts diarrhoeal deaths a little and saves time fetching water.
3. Operations avert deaths and disability; outpatient care averts a few child deaths.
4. Heart surgery saves children who would otherwise die young.
5. A shoebox's soap, school supplies, clothes and toys are worth something to a poor child.
6. Cleanups, repairs and rebuilt homes help US disaster survivors return home.

### How the model works

- **Cost**: each line's expenses from the audited accounts, with management and fundraising ($183 million) spread over all of them. Donated boxes and volunteer doctors' time are in the accounts, so they count as cost.
- **Relief abroad**: people reached are spending divided by South Sudan's cost per person fed, about {{row:relief_cost_per_person}} (its $61 million, less its water work, over 302,000 people). The food is about 60 kg a person, roughly four months of full rations, valued at local market prices over those months on the site's log-income scale: against crisis-hit Sub-Saharan consumption for the half in famine-risk settings, and against Ukraine's and Lebanon's for the rest. For the half of people judged to be in famine-risk settings, excess deaths are the gap between a crisis death rate and the countries' normal rate, a tenth of it averted over those months.
- **Clean water**: Samaritan's Purse's own count of people, a judged $60 a person, and the same diarrhoea and time-saving chain as World Vision's water model.
- **Medical**: operations and consultations are spending over judged full costs. Their risks of death and the share averted are anchored on MSF's model, with the cataract and cleft operations' share of surgery valued for their restored sight and repaired lips, and a lower risk of death for outpatients in stable settings than in crises.
- **Heart surgery**: a judged 70 children a year, half of whom would die without surgery. Credit is shared with the hospitals that donate the surgery.
- **Shoeboxes**: each box is worth 35% of its US retail value to the child (local prices are lower, and a trial of donated shoes found they mostly replaced what children would have had), against the consumption of poor children in Africa, Latin America and Asia.
- **US disaster relief**: a judged 9,000 households (5,580 families helped in deployments, the rebuilt homes and the grants to individuals). Half the spending reaches them, spread over three years at low-income US consumption. The money waits about {{row:us_gift_to_grant_years}} years: $613 million of restricted disaster funds against $185 million spent in the year.
- **Faith lines**: a fifth judged to be material aid, valued as goods; the evangelism has no value on this scale but its cost stays in.
- **Adjustments**: each branch has its own evidence, counterfactual and attribution rows and its own waits. Goods valued at their worth (food, shoeboxes, material aid, US relief) take no evidence step. Every branch is discounted for missing data.

### What drives the result

- **The missing-data slider**: every branch is thin, so it scales the whole result.
- **The shoeboxes' worth to the children** (15% to 60% of retail): the shoeboxes are the largest branch.
- **The relief's cost per person and the food's local price**: relief abroad is the next largest.
- **Recipients' consumption**, in the crises and among the shoebox children.

### Biggest uncertainties

- Samaritan's Purse publishes no total of people reached by its relief abroad, and no split of its medical or children's spending.
- The value of a box of gifts to a child has never been measured.
- Food assistance's effect on deaths in crises rests on weak evidence.
- Some of the South Sudan food may be WFP's, off Samaritan's Purse's books, which would make its own cost per person lower than it looks.

### What isn't modelled

Beyond a share in unmodelled benefits: deaths and illness averted by relief outside famine settings, a child's joy at a gift beyond its contents' value, food aid lowering local farmers' prices, and the harm when aid tied to evangelism deters people or strains relations with other faiths. The value of evangelism itself is outside the site's scale.

### How this model was checked

The mechanical audit (`scripts/audit-model.ts`) runs on the model, and independent auditors (a fresh agent each round, using the audit-cea skill) check it; the rounds are in `audits/samaritans-purse-charityevals/`.

- **Round 1**: passed (no high finding). Fixed after it: relief abroad's food is valued against each setting's consumption (Ukraine's and Lebanon's for the half outside famine settings) and over the months it lasts, not a year; South Sudan's water work taken out of relief's cost per person; the shoeboxes' worth anchored on the TOMS shoe trial and in-kind transfer evidence (40% to 35%); 2025 prices put in 2024 dollars; surgery's disability built from the cataract and cleft share; outpatient risk split between crisis and stable settings; shoebox volunteers valued at the site's volunteer hour. Together these lowered the result by about a quarter. A verification round checked the changes. A later site-wide pass took the evidence step off goods valued at their worth (the relief food, shoeboxes, material aid and US relief; it stays on the deaths), moving the result from 0.047 to 0.051; round 5 verified it with no high or medium finding, and a sixth round checked its one fix.

### Sources

- Samaritan's Purse, [consolidated financial statements and compliance reports, 31 December 2025](https://app.fac.gov/dissemination/report/pdf/2025-12-GSAFAC-0000425886) (Forvis Mazars, Federal Audit Clearinghouse).
- Samaritan's Purse, [Form 990 for 2025](https://projects.propublica.org/nonprofits/organizations/581437002/202632459349300243/full) (IRS e-file object 202632459349300243).
- Samaritan's Purse, [2025 Year-End Report](https://www.samaritanspurse.org/our-ministry/2025-year-end-report/) and [fact sheet](https://samaritanspurse.org/media/fact-sheet-samaritans-purse).
- Wolf et al., [Effectiveness of interventions to improve drinking water, sanitation, and handwashing with soap on risk of diarrhoeal disease in children in low-income and middle-income settings](https://doi.org/10.1016/S0140-6736(22)00937-0), Lancet 2022.
