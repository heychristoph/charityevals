### Summary

CARE USA is the largest member of CARE International, a confederation founded in 1945 (the first "CARE packages"). It runs emergency response and long-term development through its own country offices and local partners, mostly in Sub-Saharan Africa and the Middle East. Its programmes do about **<span data-figure="headline" data-model="care-charityevals">0.34</span> years of healthy life per 1,000 dollars**.

About three-fifths of that is relief: food, cash and goods for some 15 million people in crises, and a few excess deaths averted. Food security and savings groups for women are about a sixth each; maternal and newborn health, education and water make up the rest. CARE counts the people it reaches for the whole confederation but publishes no outcome figures for CARE USA's own spending. So every part is built from its spending, a judged cost per person and the research on that kind of work, and every part is discounted for missing data.

### What the charity does

Figures are CARE USA's audited consolidated statements for the year to 30 June 2025 (Ernst & Young):

- **Humanitarian** ($397 million, 53% of programmes). Emergency response, preparedness and recovery; the largest responses were in Ethiopia, Turkey, Yemen and Sudan. It includes $44 million of US government food and other goods in kind, and $90 million of subgrants to partners.
- **Development** ($344 million). Food and nutrition security and farming, water and hygiene, maternal, newborn and reproductive health, Village Savings and Loan Associations and women's enterprise, girls' education and climate resilience.
- **Public information** ($7 million). Informing the US public and policymakers about poverty and aid.

Fundraising ($56 million) and management ($31 million) bring total expenses to $835 million. US government funding fell by a third in the year, and stop-work orders ended about $130 million of awards early.

### How the impact happens

1. Food, cash and goods in a crisis raise what families consume for a few months and avert some deaths from hunger and the infections it worsens.
2. Community health workers' visits in pregnancy and after birth cut newborn deaths and stillbirths; some child health and nutrition work averts later child deaths.
3. Savings groups and enterprise support raise members' households' consumption a little and give women more say.
4. Farmer training, inputs and resilience work raise what families grow and consume.
5. Hygiene promotion and water points cut diarrhoeal deaths a little and save fetching time.
6. Community schools and girls' education raise learning and, later, earnings.
7. Public information may keep a little US foreign aid.

### How the model works

- **Cost**: each programme line from the audited statements, with fundraising and management spread over all of them. US government food aid is in CARE's costs, so it is counted as CARE's spending; the donors' own shipping and handling are not, so relief gets an attribution share.
- **Relief**: people reached are the spending at the confederation's cost per person ($529 million in euros for 21.9 million people in fiscal 2024, about $26 each). Excess deaths are the gap between a crisis death rate and the normal rate of Ethiopia, Yemen and Sudan, 8% of it averted over about three months. The goods are valued on the site's log-income scale at crisis-affected people's consumption. The goods and the deaths take their own adjustments: the goods, valued at a share of CARE's own spending, need no effect study and owe little to others' resources; the deaths averted take an evidence discount and a share for the donors' and partners' part.
- **The development split**: CARE doesn't split development spending by sector. We take it from its development grants abroad by purpose (Form 990 Schedule F): 24% health, 26% savings groups and women's enterprise, 10% water, 8% education, the rest food security and resilience.
- **Health**: births covered are spending over a judged $250 per birth. Newborn deaths and stillbirths fall by the Cochrane review's effect for community newborn packages. Later child deaths fall by a judged 3%.
- **Savings groups**: members are spending over a judged $45 each, anchored on CARE's 5.6 million people reached by women's economic work. Their households' consumption rises 1.2% for two years, from the randomised trials of CARE's own groups.
- **Food security, water and education**: participants reached over judged costs ($40, $60 and $80). Farming gains are shared with half the rest of each participant's household; a small consumption gain, a judged fall in diarrhoeal deaths, and a small learning gain carried into adult earnings.
- **Adjustments**: each branch has its own evidence, counterfactual and attribution adjustments; delivery is a little lower than usual because US stop-work orders ended about $130 million of awards midway. Every branch is discounted for missing data.

### What drives the result

- **The missing-data slider**: every branch is thin, so it scales the whole result.
- **The savings-group gain**: the trials find little on consumption, so a small change here moves a fifth of the result.
- **Relief**: what other agencies would have delivered anyway, the goods' worth to the people who get them, and the share of crisis deaths averted.
- **Crisis-affected people's consumption**: the poorer they are, the more the same goods are worth.

### Biggest uncertainties

- CARE USA doesn't publish how many people its own spending reached, nor how its development money splits between sectors.
- No mortality evaluation of CARE's health work exists; the effect comes from trials of similar packages under study conditions.
- Food assistance's effect on deaths in crises rests on weak evidence.

### What isn't modelled

Beyond the side-effect rows (emergency health and protection services, women's say and safety, food aid's effect on local prices): climate adaptation's longer-run benefits, gender-based violence prevented, and the confederation's advocacy outside the US.

### How this model was checked

The mechanical audit (`scripts/audit-model.ts`) runs on the model, and independent auditors (a fresh agent each round, using the audit-cea skill) checked it; the rounds are in `audits/care-charityevals/`.

- **Round 1**: no high finding, two medium. The relief goods' value had been discounted by the evidence and attribution steps meant for the deaths averted; goods and deaths now take their own adjustments. The food-security branch counted participants without their households, unlike the savings groups; it now shares the gain with half the rest of the household. Lows fixed: food and education got attribution shares, the delivery adjustment takes the 2025 stop-work orders, endowments left the unspent-money wait, and the summary's shares were corrected. Together these raised the result by about a quarter.
- **Round 2** (verification of those changes): no high or medium finding. Left as they are: the reading-only average adjustments weight relief by its deaths' factors (no effect on the result), and the crisis deaths' ages follow the site's diarrhoea split as a stand-in, as in the peer relief models.

### Sources

- CARE, [Consolidated Financial Statements, years ended 30 June 2025 and 2024](https://www.care.org/wp-content/uploads/2025/11/2025-CARE-Financial-Statements.pdf) (Ernst & Young).
- CARE, [Form 990 for the year to 30 June 2025](https://www.care.org/wp-content/uploads/2025/12/2024-PUBLIC-DISCLOSURE-COPY-CARE-990.pdf).
- CARE International, [Financial Overview FY2024](https://www.care-international.org/sites/default/files/2025-12/21842_CARE_financial_overview_2024.pdf).
- CARE, [2024 Annual Report](https://www.care.org/wp-content/uploads/2025/05/CARE-FY2024-Annual-Report.pdf) and [FY2025 Annual Report](https://www.care.org/wp-content/uploads/2026/04/CARE-FY2025-Annual-Report.pdf).
- Lassi and Bhutta, [Community-based intervention packages for reducing maternal and neonatal morbidity and mortality](https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007754.pub3/full), Cochrane 2015.
- Karlan et al., [Impact of savings groups on the lives of the poor](https://www.pnas.org/doi/10.1073/pnas.1611520114), PNAS 2017.
