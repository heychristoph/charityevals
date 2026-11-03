### Summary

The British Heart Foundation (BHF) is the UK's largest charitable funder of research into heart and circulatory disease. It also runs health information, support, CPR training and the national defibrillator network, and campaigns on policy. This is charityevals' own model of its research and policy work in the year to 31 March 2026. Its information, support and CPR work is a separate model, [health and support](/british-heart-foundation-charityevals-health).

We estimate **<span data-figure="headline" data-model="british-heart-foundation-charityevals">0.06</span> years of healthy life per $1,000** you give to BHF's research and policy. The health-and-support model gives **<span data-figure="headline" data-model="british-heart-foundation-charityevals-health">0.05</span>**. The charity's figure in the rankings weights the two by spending: about two thirds research and policy, one third health and support. Almost all of the research figure rests on judgment: how much of the world's heart disease a year of research averts, how many years sooner, and what share of the field BHF is. The range runs across several orders of magnitude.

### What the charity does

BHF spent £150.4m on its charitable work in 2025-26:

- **Research, £96.2m (64%):** 247 new grants worth £103.3m, mostly fellowships, programme and project grants and its research centres, across 45 UK institutions. In 2022 BHF paid for about half of the UK's public and charity cardiovascular research.
- **Health, £54.2m (36%):** health information (35 million web page views), the Heart Matters magazine, the nurse-led Heart Helpline (26,000 people), CPR training through the free RevivR app (190,000 people trained in the year), The Circuit (the defibrillator map ambulance services use), healthcare implementation grants, and policy work in all four UK nations.

BHF's 651 shops lost £6.7m on trading this year, so they don't pay for the charitable work. We count them by that net result, not their £240m of trading costs. Raising money cost £50.3m. Both costs are spread over the charitable spending, about 38p on each pound.

### How the impact happens

**Research.** Research leads to new drugs, devices, tests and guidelines, which reach practice about 17 years after the money is spent. A year of the world's cardiovascular research brings those advances forward. BHF gets credit for its share of that research.

**Policy.** BHF campaigned for decades for tighter tobacco control, and it part-funds Action on Smoking and Health. The Tobacco and Vapes Act became law in April 2026. It bans tobacco sales to anyone born on or after 1 January 2009. Each year the ban arrives sooner, one more birth cohort grows up with less smoking. That cohort is about 820,000 people, and its health gains come decades later.

### How the model works

Research is the medical-research template's chain:

- **Burden:** the world's cardiovascular burden, more than 400 million DALYs a year.
- **Share averted:** what a year of the field's research averts once adopted, 0.3% a year (one judgment, 0.05% to 1%), anchored on the long fall in rich-country heart deaths that treatments explain.
- **Timing:** brought forward 5 years, after a 17-year wait.
- **Adjustments:** our trust in the evidence (0.7), then BHF's share of the world's cardiovascular research funding (about 1%).
- **Check:** a 9% return in UK health gains with a 17-year lag, the figure for UK cardiovascular research, implies about the same healthy years per pound as the chain. The model shows both rows.

The policy branch follows the government's own impact assessment of the law:

- **Effect:** 8 percentage points of each covered cohort kept from smoking. The assessment's central scenario says 9.2.
- **Health gain:** 3 healthy years lost per young smoker, arriving about 40 years later and discounted.
- **Credit:** a fifth of the whole campaign took place this year, and BHF had a twentieth of the resources behind the law.
- **Years counted:** the site's shared years a won reform counts.

Both branches use one cost, research plus our estimate of the policy share of health spending (6%).

The result divides research spending by what past research achieved, so it is a past average. Like every such model, it counts the next dollar at the share of the average set under Your values (50% by default).

### What drives the result

- **The share of the burden a year of research averts:** moves the result about 15 times across its range.
- **Years brought forward:** 2 to 15 years.
- **BHF's share of the field:** 0.5% to 2%.
- **The next dollar against the past average** (your value judgment), **and the discount rate:** a 17-year wait makes the result sensitive to the rate.

Policy adds about 5% to the research result. It matters little to the total because the health gains come 40 years out and BHF is one of many groups behind the law.

### Biggest uncertainties

- No study measures what one funder's research is worth. The chain is calibrated on returns-to-research studies: 9% a year in health gains for UK cardiovascular research, 10% for cancer. Their authors call these best-case figures, and they count only UK gains.
- Credit is split by share of funding. Industry pays for more than half of all cardiovascular research, and we count all of it; BHF is about 1% of the total.
- The smokefree-generation effect is modelled, not observed. New Zealand repealed its own ban before it took effect.

### What isn't modelled

- Research workforce and infrastructure that later research uses (in a small unmodelled share).
- Economic gains from research (not health).
- The Act's vaping provisions and second-hand smoke.
- BHF's other policy work, such as the cardiovascular framework in England and survival funding in Scotland. These are in the policy share's cost but not counted as wins.

### How this model was checked

Mechanical checks: lint, the normalization invariants and the reference class (`scripts/audit-model.ts`). The research-to-practice lag of about 17 years was above the lint's generic 15-year bound for a reform's wait. The medical-research family now allows up to 25 years, as its own reference file expects. 
Independent audit, round 1 (3 high, 4 medium, 11 low). What changed:
- **Proxy peers:** the health model's proxy read two SoGive upper bounds. It now reads ranked best guesses only. The health result fell from 0.27 to 0.05.
- **Programme patterns:** these matched both models. They are now anchored, so each programme has its own model.
- **Generated files:** regenerated.
- **Reference row:** a reading row now holds the returns-to-research check.
- **Merged judgment:** the share of the burden averted is one judgment instead of two independent ranges.
- **Smaller fixes:** a counterfactual for trainees who would have trained elsewhere, a lower defibrillator survival gain for home arrests, and clearer anchors and sources.

Independent audit, round 2: no high findings, 3 medium, 7 low. What changed:
- **BHF's share of the field:** now counts all of industry's research, which leaves it at 1%.
- **Smoking cut:** re-anchored on the impact assessment's scenarios (8 points, 2.5 to 9.2), with leakage counted once.
- **Healthcare Implementation Fund:** stays proxied. Its earlier blood-pressure award programme reported people checked, but this year's awards are new pilots with no results yet.

### Sources

- [BHF Annual Report and Accounts 2025-26](https://www.bhf.org.uk/what-we-do/-/media/files/annual_report_and_accounts_2025-26.pdf) (audited accounts, p. 65, 108-109, 125, 136; trustees' report, p. 17-36)
- [DHSC, Tobacco and Vapes Bill impact assessment](https://assets.publishing.service.gov.uk/media/65f9bd0a9316f5001164c351/tobacco-vapes-bill-impact-assessment.pdf)
- [Glover et al. 2014, returns to UK cancer research](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4058434/fullTextXML)
- [HERG, OHE and RAND Europe 2008, Medical Research: What's it worth? (report summary)](https://www.news-medical.net/news/2008/11/21/43295.aspx)
- [BHF on UK cardiovascular research funding (UKCRC, 2022)](https://www.bhf.org.uk/what-we-do/news-from-the-bhf/news-archive/2024/may/heart-research-breakthroughs-under-threat-from-funding-shortfall)
- [Global burden of cardiovascular disease, GBD 2021 (TCTMD on Lindstrom et al., JACC 2022)](https://www.tctmd.com/news/cvd-claimed-20-million-lives-2021-disease-burden-varies-globally)
