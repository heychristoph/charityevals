### Summary

Bandhan-Konnagar, a non-profit society in Kolkata, gives the poorest women-headed households in 16 Indian states an asset, a weekly stipend and two years of coaching, so they can earn their way out of extreme poverty. It also runs health, education, skills, financial literacy and farming programmes. Our own model of its fiscal year 2024-25 (April 2024 to March 2025) comes to **<span data-figure="headline" data-model="bandhan-charityevals">6.0</span> years of healthy life per $1,000**.

The result rests on a randomized trial of Bandhan's own programme in West Bengal that followed households for ten years. The range is wide, mostly because the trial was small, ran in 2007, and stopped at year ten.

### What the charity does

Bandhan-Konnagar began in 2001 as a microfinance organisation. Its lending grew into Bandhan Bank, and the society kept the development work. Its main programme, Targeting the Hardcore Poor, picks the poorest households in a village with the villagers' help. Each woman chooses an asset, usually goats, a cow or stock for a small shop, and gets a weekly stipend until the asset pays. Staff visit her every week for two years to coach her on the business, saving and health, and help her get government entitlements. In 2024-25 it enrolled 11,201 households, 198,081 since 2006.

The accounts don't split spending by programme. From the grants given for each programme and the staff it employs, Targeting the Hardcore Poor is about half of the charitable spending. The rest goes to:

- a health programme of volunteer health workers and village health forums;
- remedial learning centres, low-fee academies and three schools;
- skill centres that train young people and place them in jobs;
- financial literacy classes for women;
- small farming and business-training pilots;
- a technical team that helps Bihar's government run its own version of the programme.

It also sells training to Bandhan Bank, which our model leaves out because the bank pays for it.

### How the impact happens

1. The asset and stipend let a woman start earning from livestock or a small business while the coaching helps her keep it going.
2. Household consumption rises. In the trial, households that took part spent 22% to 56% more per person than the control group at 18 months, 3, 7 and 10 years. The gain grew to year 7 as members found better work, often by migrating.
3. Consumption is valued on a log scale, the site's shared way, so a gain counts for more the poorer the household.
4. The other programmes add newborn lives saved, children's later earnings and small income gains.

### How the model works

The [model](/bandhan/bandhan-charityevals) follows the site's cash and income template, with each programme as a branch.

- **Cost:** all charitable spending in 2024-25 from the audited accounts, ₹108.8 crore once administration is taken out, less the training sold to Bandhan Bank. Administration is spread over every programme. Each programme's share is a judgment, but the result barely depends on them, because every branch counts its own reach against the same total.
- **Reach:** the 11,201 households enrolled, from the charity's own count, at India's household size scaled down because women-headed households are smaller.
- **Effect:** the trial's effect at each survey, for the years around it: 18 months for years 1 and 2, 3 years for years 3 to 5, 7 years for years 6 to 8, 10 years for years 9 and 10. Each is divided by the share of households that took the programme when offered (52%), since the count is of households that took part. After year 10 the gain fades 10% a year for 10 more years (both judgments).
- **Adjustments:** trust in the trial (0.75), what would have happened anyway (0.9), Bandhan-Konnagar's share of the resources (0.95), households counted but not served (0.95), other money freed or pulled in (0.95), and the wait while a gift sits as an unspent grant (about a third of a year) and before the first gains.
- **Other programmes:** each is built from research on its kind of work and the charity's own counts, and discounted for missing data. Health uses a review of community health trials for newborn deaths, education a remedial-teaching trial in India, skills the trials of vocational training. Financial literacy and the farming pilots use judged gains. The Bihar help counts the government trial's gain, credited by Bandhan-Konnagar's share of the money.
- **Side effects:** effects on neighbours add 5%. Health, mental health and other effects not counted in consumption add 10% net of harms such as lost animals or debts.
- **Your dollar:** staff are mostly local coaches, so the shared figures for staff-delivered programmes and local pay apply.

### What drives the result

- **The value of a year of healthy life against a doubled income** and **the discount rate** (shared sliders) move every income model.
- **Trust in the trial** (0.5 to 0.95) moves the result from about 0.7 to 1.25 times the best guess.
- **The ten-year effect** and **how long the gain lasts after year 10** come next. With no gain after year 10 the result is about 0.7 times the best guess.

### Biggest uncertainties

- **A small trial.** 978 households, half offered the programme and half of those taking it. The effect on participants depends on assuming the women who refused were not affected.
- **Then and now.** The trial ran in one district in 2007 with 18 months of coaching. Today the programme runs in 16 states with 24 months. A large randomized trial of Bihar's government version, which Bandhan-Konnagar designed and supports, found consumption 27-30% above the control group two and three years on. That is as large as the West Bengal trial's effect at the same point.
- **After year 10.** Nothing is measured. In Ethiopia's graduation pilot, control households caught up by year 7.
- **Programme shares.** The accounts give no split, so the size of the smaller programmes' branches is a judgment.

### What isn't modelled

- Women's say in the household and their standing in the village, except through consumption.
- The water treatment plants of the health programme and the children's health in the education programme.

### How this model was checked

The mechanical audit (lint and the site's invariants) passed before review.

- **Round 1:** 3 high, 1 medium and 5 low findings. The trial's effect now uses the consumption column that counts migrant members, which the paper calls the better estimate. The duration rows of the smaller branches have their own labels, so they are not mistaken for the site's shared figure. The cost of the training sold to Bandhan Bank is a ranged judgment. The wait uses the year's average of unspent grants. The education count is explained as cumulative, the survey-years rule is stated, and the Bihar reach cites J-PAL's update. One finding, regenerating the site's generated files, is left to the merge step, as the batch rules say. The result went from 5.5 to 6.0.

### Sources

- Bandhan-Konnagar, [Annual Report 2024-25](https://www.bandhan.org/wp-content/uploads/2025/10/Bandhan-Konnagar-24-25_AR_20-09_25.pdf), with the audited financial statements for the year ended 31 March 2025.
- Bandhan Bank, [Annual Report 2024-25](https://bandhan.bank.in/sites/default/files/2025-07/Annual-Report-FY24-25-2-BBL.pdf): its grants to Bandhan-Konnagar's programmes and the training it buys.
- Banerjee, Duflo and Sharma, [Long-term Effects of the Targeting the Ultra Poor Program](https://www.nber.org/system/files/working_papers/w28074/w28074.pdf), NBER Working Paper 28074 (*AER: Insights*, 2021).
- Banerjee, Duflo, Orduña Correcher, Mukhopadhyay, Sabarwal and Sharan, [Does the Graduation Program Scale? Evidence from India](https://www.povertyactionlab.org/sites/default/files/SJY-Does-the-Graduation-Program-Scale-Evidence-from-India.pdf) (2026).
- Lassi and Bhutta, [Community-based intervention packages for reducing maternal and neonatal morbidity and mortality](https://doi.org/10.1002/14651858.CD007754.pub3), Cochrane review (2015).
- Banerjee, Cole, Duflo and Linden, [Remedying Education](https://econpapers.repec.org/article/oupqjecon/v_3a122_3ay_3a2007_3ai_3a3_3ap_3a1235-1264..htm), *QJE* (2007).
- McKenzie, [How Effective Are Active Labor Market Policies in Developing Countries?](https://econpapers.repec.org/article/oupwbrobs/v_3a32_3ay_3a2017_3ai_3a2_3ap_3a127-154..htm), *World Bank Research Observer* (2017).
- Office of the Registrar General, India, [Sample Registration System Statistical Report 2022](https://ruralindiaonline.org/en/library/resource/sample-registration-system-statistical-report-2022).
