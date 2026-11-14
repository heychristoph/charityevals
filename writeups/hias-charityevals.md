### Summary

HIAS is a Jewish humanitarian organisation, founded in 1881, that serves refugees and asylum seekers. In the US it resettles refugees with about 30 local partner agencies, runs immigration legal services with pro bono lawyers, and campaigns and litigates for refugee admissions. Abroad it runs legal protection, mental-health support, violence prevention, cash assistance and economic inclusion in about 15 countries. We model each of its three lines on its own.

- **US resettlement and legal services**: about **<span data-figure="headline" data-model="hias-charityevals">0.003</span> years of healthy life per 1,000 dollars**, far below the site's global-health charities. The help goes to people in the US, where a dollar is a small gain on the log-income scale. And another resettlement agency would have taken most of the same refugees with the same federal money.
- **Programmes abroad**: about **<span data-figure="headline" data-model="hias-charityevals-international">0.05</span>**, below the middle of the site's humanitarian charities.
- **US advocacy and litigation**: about **<span data-figure="headline" data-model="hias-charityevals-advocacy">0.3</span>**, mostly uncertainty. Even a small chance of restoring refugee admissions is worth a lot, because each refugee resettled gains decades at US consumption.

HIAS counts the people it serves but publishes no controlled measure of its results. So every part is built from its spending, its counts and the research on that kind of work, and every part is discounted for missing data.

### What the charity does

Figures are HIAS's audited consolidated accounts for the year to 30 September 2025 (programmes $128.5 million of $153.4 million spent):

- **US operations** ($80.4 million): payments to the local resettlement partners ($43.9 million), case management, employment and social services, and legal services for 1,433 people. $18.7 million of the line is pro bono lawyers' time booked at their firms' rates. We count it as the law firms' contribution, not HIAS's cost. About $3 million (our estimate) is advocacy, community engagement and litigation, modelled on its own.
- **International operations** ($48.1 million): eastern Chad for Sudanese refugees, Colombia, Ecuador, Panama, Mexico, Costa Rica, Venezuela, Kenya, Ukraine, Moldova, Israel and others, and the State Department's Resettlement Support Center in Austria, which processed refugees for the US until admissions stopped.

In January 2025 the US suspended refugee admissions and terminated HIAS's federal awards. HIAS laid off staff, cut from 20 countries to 15, and its spending fell from $204 million to $153 million.

### How the model works

- **Resettlement**: about 13,500 people served besides the legal clients (HIAS counts 13,400 in calendar 2025; the fiscal year starts before the suspension). A judged 20% of the spending reaches them as rent, furniture, food and cash; most of the partners' money pays case managers. Before the January 2025 suspension another agency would have taken most of the same refugees; after it, HIAS's private money kept services going that others dropped. That money is valued on the site's log-income scale at newly arrived refugees' consumption, plus a short head start in finding work.
- **Legal services**: HIAS's 1,433 clients. For the half whose case decides whether they may stay, representation raises the chance of winning by about 29 points: the unrepresented win 18% of asylum cases, the represented more than two and a half times as often (TRAC). That gap is halved for selection. A client who would have lost is removed with a judged 40% chance, about three years later when the case ends. They lose the consumption they would have had in the US against their home country's for about 20 years, and their family loses the remittances. Removal also carries a small risk of being killed. The other clients gain a little life satisfaction from family reunions and green cards. The pro bono hours are valued at a lawyer's wage, not the firms' rates, in HIAS's share of the credit.
- **Abroad**: each activity follows its own research. Cash and goods, from the accounts' payments and supplies, are valued at displaced people's consumption in Chad and Latin America, with a few deaths averted in Chad's camps. Legal status is valued from Colombia's regularisation of Venezuelans (48% more consumption), less elsewhere. Mental-health, survivors' and children's support follows humanitarian trials, counted for people in distress. Economic inclusion follows the graduation trials for the 1,100 graduation participants, a lighter gain for the rest. The Resettlement Support Center's departures (about 200, our judgment) count by the consumption refugees gain in the US, mostly credited to the government and to whoever else would have run the centre.
- **Advocacy**: the Ninth Circuit reversed most of the Pacito v. Trump injunction in March 2026, so a 2% chance that the case still restores about 10,000 admissions a year for the years the site counts a won reform, fiscal 2025 carrying half the case's cost. The more than 80 refugees the 2025 injunctions let travel count as won, less a share who might have travelled anyway. HIAS gets 15% of the credit, and the next dollar counts at HIAS's own 49%.
- **Adjustments**: each branch has its own evidence, counterfactual and attribution adjustments. Side effects are rows: integration support, health enrolment, legal clients' work permits and social services, effects on host towns, travel-loan collection, spending in host economies, child protection, aid diversion, the foreign-aid lawsuit, community mobilisation and backlash.

### What drives the result

- **The missing-data slider** scales every part.
- **US services**: what other agencies would have done anyway, and how many losing clients would be removed.
- **Abroad**: displaced people's consumption, and how much of the cash spending reaches people.
- **Advocacy**: the chance of winning, HIAS's share of the litigation, and the years a win counts.

### Biggest uncertainties

- HIAS's counts are calendar 2025 and partly cover people reached only indirectly. The accounts don't split spending by activity, country or advocacy.
- The value of legal representation rests on uncontrolled national comparisons.
- The advocacy result depends on a court case whose outcome is a judgment.

### How this model was checked

The mechanical audit (`scripts/audit-model.ts`) runs on each model, and independent auditors (a fresh agent each round, using the audit-cea skill) checked them; the rounds are in `audits/hias-charityevals/`, `audits/hias-charityevals-international/` and `audits/hias-charityevals-advocacy/`.

- **Round 1** failed all three. US services: the gain from staying now waits for the case to end, uses clients' later consumption and counts remittances home; the resettlement counterfactual is split before and after the January 2025 suspension; the cash share was rebuilt from the Form 990's direct assistance (0.0026 to 0.0031). Abroad: the Resettlement Support Center in Austria and child protection became branches, cash is valued where its recipients are and rebuilt from the accounts, reach is scaled to the fiscal year, and the graduation effect is limited to its 1,100 participants (about 0.048 either way). Advocacy: the Ninth Circuit's March 2026 reversal of the Pacito injunction cut the chance of success to 2% and the admissions a win restores to 10,000 a year, and fiscal 2025 carries half the case's cost (1.9 to 0.32).
- **Round 2** (verification) passed all three, with low findings and one medium (the Resettlement Support Center's departures are a judgment without a published count).

### Sources

- HIAS, Inc. and Related Entities, [Consolidated Financial Statements for the year ended 30 September 2025](https://hias.org/wp-content/uploads/HIAS-2025-Consolidated-Financial-Statements.pdf) (GRF CPAs & Advisors).
- HIAS, [Form 990 for October 2024 to September 2025](https://hias.org/wp-content/uploads/HIAS-2025-990.pdf).
- HIAS, [2025 Annual Report](https://hias.org/wp-content/uploads/HIAS-Annual-Report-2025.pdf) and [2024 Annual Report](https://hias.org/wp-content/uploads/HIAS-Annual-Report-2024-Final.pdf).
- TRAC, [asylum decisions, fiscal 2022](https://tracreports.org/whatsnew/email.221129.html).
- Ibáñez et al., [Life Out of the Shadows](https://www.jointdatacenter.org/literature_review/life-out-of-the-shadows-the-impacts-of-regularization-programs-on-the-lives-of-forced-migrants/).
- Charlson et al. (2019), [mental disorders in conflict settings](https://doi.org/10.1016/S0140-6736(19)30934-1), The Lancet.
