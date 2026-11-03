### Summary

New Incentives (All Babies Are Equal Initiative in Nigeria) pays caregivers in eleven states of northern Nigeria small cash incentives for bringing their infants to government clinics for routine vaccines. Our own estimate for its 2025 work comes to **<span data-figure="headline" data-model="new-incentives-charityevals">14</span> years of healthy life per $1,000**.

No evaluator's cost-effectiveness analysis was used: the model is built from the charity's audited 2025 accounts and annual report, an independent randomised trial of the programme, the charity's own coverage surveys, and the site's shared disease-burden and vaccine figures.

### What the charity does

At 7,189 government clinics in 205 local government areas, New Incentives' field staff enrol infants and pay caregivers in cash after each of four vaccination visits: BCG at birth, Penta and PCV at 6, 10 and 14 weeks, and measles at 9 months. The incentives were ₦500 for each early visit and ₦2,000 for measles in the trial; in 2025 the charity paid ₦16.0 billion ($10.4 million) to the caregivers of the 1.85 million infants it enrolled, about ₦8,700 per infant. It also runs community awareness work and helps clinics restock vaccines. The vaccines themselves are paid for by Gavi and the Nigerian government. In May 2025 it began a small pilot handing out oral rehydration salts, under 1% of spending and not modelled.

### How the impact happens

1. **More children vaccinated.** In IDinsight's randomised trial (167 clinics in Katsina, Zamfara and Jigawa, 2017-2020), children in programme areas were 16 points more likely to have had BCG, 21 points more likely to have had a first Penta dose, 14 points more likely to have had measles vaccine, and 27 points more likely to be fully immunised. The charity's later coverage surveys in new areas show rises of about the same size.
2. **Fewer deaths.** Each extra vaccinated child is protected against pneumonia and meningitis (PCV and Hib), whooping cough, diphtheria and tetanus (Penta), rotavirus diarrhoea (given at the same visits), measles and tuberculosis (BCG). Most of the deaths averted are under five.
3. **Smaller effects:** hepatitis B deaths decades later, illness averted, treatment costs saved, herd immunity, a little more schooling and later income, and the cash itself, which raises poor households' consumption.

### How the model works

The model follows the site's direct-health template. Reach is every child born in the clinics' catchment areas (enrolled infants divided by an enrolled share of 65%), because the trial's effects are averages over all children there. For each disease it multiplies Bauchi's chance of dying of it before five (Global Burden of Disease 2021, a shared figure), the share of those deaths after the age of vaccination, the vaccine's efficacy (discounted for this setting, as the site's measles figures show for northern Nigeria) and the rise in coverage of the vaccine that prevents it. The deaths are then scaled for today's states and for unvaccinated children's higher risk, and the site's shared figure for indirect deaths (0.75 per direct death) is added. Deaths at older ages (5-14, 15-49, 50-74) are built the same way, plus hepatitis B deaths from cirrhosis and liver cancer prevented by Penta's hepatitis B doses, from Bauchi's risks at those ages, with the site's shared figures for waning protection and falling death rates, and discounted for the longer wait. A death is valued at the site's moral weight for its age.

Then come the adjustments: trust in the trial and its fit to today's programme, the share New Incentives can claim, funging, and the wait before a gift is spent (New Incentives holds about 2.8 years of spending in treasuries, whose interest roughly offsets the discount). The Gavi and government costs of each extra vaccinated child count in the credit: New Incentives is credited with its share of all the resources behind the extra vaccinations, about half.

### What drives the result

- **Credit shared with Gavi and the government.** Partners spend about $63 for each extra child vaccinated (the site's shared figures), which comes to about as much per child in the catchment areas as New Incentives spends there. With full credit the result would be about twice as high.
- **Funging.** Most of the charity's money comes from one large funder, and it holds funding to 2028, so a marginal gift partly frees that funder's money (0.85, range 0.6-1).
- **Today's death rates and the trial's fit.** The death risks come from Bauchi in 2021, and the coverage effects from three states in 2017-2020.
- **PCV's efficacy and pneumococcus's share of pneumonia deaths.** Pneumonia is the largest single cause of the deaths averted.

### Biggest uncertainties

- The trial's public brief doesn't report the third-dose Penta and PCV effects. We scale the trial's first-dose effect by the ratio of the dose rises in the charity's coverage surveys (22.5 points for the third dose).
- Deaths are built from cause-specific risks and efficacies, not measured. The indirect-deaths figure (0.75 per direct death) nearly doubles them; it is consistent with the large all-cause falls seen after PCV and measles vaccination, but rests on modelling.
- The enrolled share of all children in the catchment areas (65%, range 50-80%) isn't published.

### What isn't modelled

- The oral rehydration salts pilot (2025, under 1% of spending).
- Effects of the programme on the health system beyond vaccine stock (more clinic visits, trust in vaccination) and any lasting effect after the incentives end.
- Room for more funding and organisational strength.

### How this model was checked

The mechanical audit (lint and every normalization invariant) passes. An independent audit (round 1) found 2 high, 5 medium and 4 low issues, all fixed: internal validity now reads the site's shared figure for the trial; deaths after five are built band by band from shared risks and discounted for their wait; partners' cost counts only the extra vaccinations the outcome counts; the pneumococcal share is GBD's own figure; the shared 'fewer infections passed on' adjustment is included; external validity now weighs the incentive's lower real value; the unvaccinated-risk scaling is lower; and the income gain is no longer discounted twice. Round 2 found no high issues (2 medium, 4 low), also all fixed: rotavirus coverage relative to Penta now comes from WHO and UNICEF's 2025 estimates; the cash is valued with the cash-income template's steps (consumed share, later returns, spillovers, child mortality); hepatitis B deaths are now modelled; and the efficacy rows cite their reviews. Round 3 found no high or medium issues (4 low): hepatitis B deaths no longer take the indirect-deaths multiplier, carriers' death risk now cites its source with a survival step, and the hepatitis B prevalence range is the review's confidence interval; the fourth, basing illness only on deaths, was not taken, to keep the template's base for GiveWell's supplementary shares.

### Sources

- New Incentives, [Audited Consolidated Financial Statements, December 31, 2025](https://drive.google.com/file/d/18Ksmv_6qF7lXcYeJIhf4gD0deBGzSRO7/view), and [Annual Report 2025](https://drive.google.com/file/d/18Fo7FD1WuR04i8IEDiBoGNjIlv32FICt/view).
- IDinsight, [Impact of Conditional Cash Transfers on Routine Childhood Immunizations: Evidence from North West Nigeria](https://cdn.prod.website-files.com/5f7c51bf9fac9b5ed62aa37b/5fae20fa406525d30087de19_New%20Incentives%20Evaluation%20Brief.pdf) (2020).
- New Incentives, [coverage report: baseline and follow-ups for cohorts 1-8 and 11](https://drive.google.com/file/d/1nJkNCgCkJ6s30yJVEyUpWcTCKa5pUT0g/view) (2024).
- GBD 2016 Lower Respiratory Infections Collaborators, [Lancet Infectious Diseases 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC6202443/); Cochrane review of [pneumococcal conjugate vaccines](https://www.cochrane.org/evidence/CD004977_vaccines-against-overwhelming-blood-infection-due-pneumococcus-bacteria-and-lung-infection-pneumonia); Anekwe et al., [measles vaccination and schooling](https://pmc.ncbi.nlm.nih.gov/articles/PMC4570928/) (Vaccine 2015); National Bureau of Statistics, [Poverty and Inequality in Nigeria 2019](https://nigerianstat.gov.ng/elibrary/read/1092).
