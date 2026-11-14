### Summary

The Innocence Project frees people wrongly convicted in the United States and campaigns for laws that stop wrongful convictions. Counting its spending over fiscal years 2021 to 2025 against what those years achieved, our model comes to **<span data-figure="headline" data-model="innocence-project-charityevals">0.0005</span> years of healthy life per $1,000**. That is far below the site's other global-health models. The organisation spends over five million dollars per exoneration, and each one frees one person from about a dozen more years in prison. About three fifths of the result comes from the reforms, a quarter from its own exonerations and the rest from its support for other innocence groups. The next dollar counts at a third of the past average, because the organisation holds over three years of spending in reserve.

### What the charity does

The Innocence Project was founded in 1992 as a clinic at Cardozo School of Law in New York and became a separate charity in 2004. In the year to June 2025 it spent $31.5 million, $22.8 million of it on programmes. The largest is legal services ($9.1 million): reviewing letters from prisoners (1,781 that year), taking cases where DNA or other new evidence can prove innocence, and helping clients after release. Next come policy ($3.3 million) and strategic litigation ($2.0 million: test cases, more than 35 amicus briefs, trainings for judges). The other $8.4 million goes to research, communications and support for the 74 groups of the Innocence Network. It has helped free more than 250 people.

### How the impact happens

The model has three branches.

- **Exonerations.** The Innocence Project exonerated 24 clients in fiscal years 2021 to 2025 (its Forms 990 and 2024 annual report). We judge that 70% were still in prison until its work freed them. Each person freed is spared about 12 more years inside (our judgment, 5 to 25). Each of those years is valued two ways, from the site's shared figures in facts/incarceration.json. One is the life satisfaction a year in prison costs (1.2 points out of 10). The other is the deaths it causes: about 2 years of life lost per year served (Patterson 2013), valued at the ages the deaths come. A few clients are on death row, so executions averted are counted too. Compensation from states or civil suits counts as a transfer: what the money is worth to a poor exoneree's household, less what it costs the taxpayers who pay it.
- **Reforms.** The window's wins include Indiana's first eyewitness identification law, limits on police use of facial recognition, bans on deceiving children in interrogations, the defence of discovery laws in New York and Texas, and better compensation laws in Florida and Oklahoma. We judge that 2% of people in US prisons are innocent, anchored on the one careful estimate, at least 4.1% of death sentences (Gross et al. 2014). We also judge that the window's reforms remove 0.6% of that wrongful imprisonment (0.2% to 2%). Each year averted is valued as in the first branch. The compensation laws' extra payments count as transfers.
- **The Innocence Network.** Innocence organisations took part in 53 of the 147 US exonerations of 2024 (National Registry of Exonerations). The Innocence Project trains and coaches these groups and runs their annual conference, and we credit it with 3% of their results.

### How the model works

The cost is the average real spending of fiscal years 2021 to 2025, with management and fundraising included. Credit goes by share of resources. That is half of each exoneration, which comes with co-counsel, pro bono firms and law students, and 35% of the reforms, which were won in coalitions with state innocence groups and defenders. A quarter of the years freed we judge others would have ended anyway, since many innocence groups and prosecutors' conviction integrity units now do this work. A won reform counts for the site's shared number of years, after a 4-year wait to the prison-years it averts. Every branch takes the shared missing-data discount. Three side effects are rows of their own. Families with a parent home add 15%. Real perpetrators identified by exonerations add 5% to the exoneration branches. Guilty people missed under stricter lineup rules take 5% from the reforms.

### What drives the result

Deaths averted are most of the result, because the shared figure says a year in prison costs about 2 years of life. Life satisfaction and compensation add a few percent each. The largest swings are the share of prisoners who are innocent, the share of that the reforms remove, the years a reform counts, the missing-data discount and the next-dollar figure.

### Biggest uncertainties

- How many people in US prisons are innocent. Nobody has measured it outside death sentences.
- How much the reforms cut wrongful convictions in practice. The evidence is mostly from laboratory studies and case reviews.
- How long the freed would otherwise have served: parole, death in prison or another group's work could have ended it sooner.
- The Innocence Project's share of the coalition campaigns and of the Network's results, both our judgments.

### What isn't modelled

Wins from before 2021 aren't counted, though they still work today: post-conviction DNA testing laws in every state, and eyewitness and interrogation-recording reforms in many. Their cost isn't counted either. The cost of a case to the courts and the trust that public exonerations may restore aren't counted.

### How this model was checked

Audit rounds are in audits/innocence-project-charityevals/.

### Sources

- The Innocence Project, Inc., Forms 990 for fiscal years 2021 to 2025 (IRS e-file; ProPublica Nonprofit Explorer).
- Innocence Project, Annual Reports 2024 and 2025, and its exonerations data page.
- Bureau of Justice Statistics, Prisoners in 2023.
- Gross, O'Brien, Hu and Kennedy (2014), Rate of false conviction of criminal defendants who are sentenced to death, PNAS.
- Criminal Legal News (April 2025), reporting the National Registry of Exonerations' 2024 annual report.
- Patterson (2013) and the World Database of Happiness, through the site's shared incarceration figures.
