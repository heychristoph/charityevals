### Summary

Friendship Bench trains community health workers, most of them older women known as grandmothers, to give problem-solving talk therapy on wooden benches at primary-care clinics across Zimbabwe. Our estimate for 2024 is **<span data-figure="headline" data-model="friendship-bench-charityevals">5.9</span> years of healthy life per $1,000**.

The trial behind the programme found a very large effect, but today's clients get far fewer sessions than the trial's clients did: about 1.75 sessions for each client seen, against five. How much of a full course a client seen gets is the biggest uncertainty. After that come how long the effect lasts, whether the people seen have the distress the trial treated, and how WELLBYs convert into healthy years.

### What the charity does

In 2024 Friendship Bench saw 295,770 clients: 285,900 face to face on benches at 385 clinics in all ten provinces (including implementing partners' benches) and 9,870 on its WhatsApp Open Line. 2,773 community health workers deliver the therapy. Clients who want more support can join Circle Kubatana Tose peer groups, which run savings and income projects. In late 2024 the Ministry of Health and Child Care began taking the model over, with full integration planned by 2028. Friendship Bench also trains organisations abroad (Friendship Bench in a Box) and runs research with the London School of Hygiene and Tropical Medicine and others.

Its US affiliate, The Friendship Bench Inc, raises money and in 2024 sent $2,735,000 to Zimbabwe for programme services (Form 990, Schedule F). The Zimbabwe organisation is audited by Vista Chartered Accountants but doesn't publish its statements.

### How the impact happens

1. A health worker screens a client with the Shona Symptom Questionnaire and works through one of the client's problems with them, using problem-solving therapy: up to six sessions of 30–45 minutes.
2. Depression and anxiety ease, measured on the PHQ-9. The gain fades over the following years.
3. Others in the household benefit too, at the site's shared spillover share.
4. Lifting depression lowers the risk of suicide while the effect lasts.

### How the model works

The model follows the site's mental-health template (wellbeing).

- **Cost.** The Zimbabwe organisation's 2024 spending is the US grant, grossed up for the quarter of its money we judge came from other funders (WHO, the Global Fund, USAID's Development Innovation Ventures, OPHID). To that we add the US affiliate's own spending. We apply the charity's published budget split (40% support costs), and leave out research and the trainings abroad, about a tenth of programme spending. The result is about $3.6 million, or $12 per client seen.
- **Effect of a full course.** Two sources are blended. The first is the Friendship Bench trial (Chibanda et al. 2016, JAMA), with a 6.36-point PHQ-9 difference at six months, or 1.51 standard deviations at the site's one PHQ-9 spread. The second is the individual-patient meta-analysis of task-shared psychological treatment in low- and middle-income countries (Karyotaki et al. 2022, 0.32 SD). Each is weighted by its precision, using the meta-analysis's prediction interval. We then cut the trial's weight by a ranged judgment because it was delivered under research conditions. The blend is about 0.86 SD, and the effect fades linearly over about two and a half years.
- **Adjustments.** Response bias and a broader clientele than the trial's (0.8, down to 0.4 if most clients seen are below the screening cut-off). No counterfactual cut, because the trial's controls had enhanced usual care. The charity's share of resources is 0.9, since government health workers' time (about 6% of their working year, from sessions and their length) and clinics count too. Delivery is about 0.48: about 1.75 sessions per client seen against a median of five in the trial, with the effect growing less than in proportion to sessions (an exponent of 0.7, between the pilot's proportional fall and the large effects of single-session interventions). The count of follow-up sessions is uncertain, because the charity's quarterly and annual reports disagree.
- **Suicides averted** come from WHO's 2023 suicide rates for Zimbabweans aged 15–49 (4.1 per 100,000 women, 13.3 per 100,000 men), weighted by the 64% of clients who are women. To that we apply a relative risk of 5 for the distress treated and remove a fifth of the excess while the effect lasts. Each death is valued at the site's moral weight for ages 15–49, and the deaths enter only through the fixed units-of-value row. They add about 2%.
- **Your dollar's share** uses the shared staff-pay defaults for staff-delivered programmes and for health workers and field staff at nonprofits.

### What drives the result

- **The exchange rate between WELLBYs and healthy years** (a slider) moves the result most.
- **How much of a full course a client seen gets**: the dose-response's shape moves it between about 3.5 and 8.5, and the count of follow-up sessions (47,073 in the annual report, about 221,000 at the quarterly reports' rate) between about 4.4 and 6.6.
- **How long the effect lasts** (one and a half to four years) moves it between about 3.6 and 9.3.
- **The evidence adjustment** (whether the people seen have the distress treated) moves it between about 3.0 and 7.4, **the weight on the trial** between about 4.3 and 7.5.

### Biggest uncertainties

- **What a "client seen" receives.** The charity counts every client who sat on a bench. Its counts of follow-up sessions disagree: 47,073 for 2024 in the annual report, 162,276 in the first three quarterly reports alone. Its six-week follow-ups of random samples find almost all clients reached above the screening cut-off, but they reach only a minority of those sampled. A clear split of clients by number of sessions would narrow the result more than anything else.
- **Spending.** The Zimbabwe organisation's statements would replace three rows: the share from other funders, the support-cost share and the programme split.
- **The trial's size.** A 1.5 SD effect is four to five times the pooled effect of similar therapies. The blend gives it about 45% of the weight, and a replication at today's scale would settle it.
- **Duration.** No trial of this kind follows clients for several years with a control group.

### What isn't modelled

- Research and Friendship Bench in a Box trainings abroad (about a tenth of programme spending, with no split or outcome data). The result covers talk therapy in Zimbabwe only.
- The income from Circle Kubatana Tose savings groups, and the HIV outcomes of integrated care. Both are plausible, but neither has a controlled estimate.
- The value of handing the model to the government, which could keep benches running after Friendship Bench's own spending ends.

### How this model was checked

The mechanical audit (`scripts/audit-model.ts`: lint, the normalization invariants, tornado and reference class) was run on every draft, and independent audits by a separate reviewer followed.

- **Round 1** (no high, five medium, nine low findings). Delivery became a formula, sessions per client over the trial's median, times a ranged judgment on the dose-response's shape: the best guess fell from 0.3 to 0.23, because the cited pilot shows no front-loading. Whether clients seen have the distress treated is now asked once, in the evidence adjustment, anchored on the published shares above the cut-off (range down to 0.4). The effect's duration rose from 2 to 2.5 years to fit full effects at 6 and 12 months. The charity's share of resources was rebuilt from the health workers' hours (0.8 to 0.9). The staff pay gap now reads the shared health-and-field figure. Smaller corrections went into the anchors and explainers.
- **Round 2** (one high, one medium, five low findings). The high: the annual report's 47,073 follow-up sessions contradict the charity's own 2024 quarterly reports (162,276 in Q1–Q3), so follow-ups became a ranged estimate at the quarterly rate (about 221,000, range 47,073 to 316,000) and the dose-response judgment now covers only its shape (0.5–1.6). Delivery rose from 0.23 to 0.35 and the result by about half. The trial's weight discount was anchored on evidence that single-trial effects shrink at scale; the Q3 2024 caseness figure was added; caseness was removed from the suicide relative risk; the write-up was brought up to date.
- **Round 3** (one high, one medium, three low findings). The high: suicide rates came from all-ages crude rates of an older WHO release times an adult factor; they now are WHO's Global Health Estimates 2023 for ages 15–49 by sex, which are about a third as high (the result fell about 3%). The medium: delivery assumed the effect grows in proportion to sessions on the strength of a pilot that observed only 3 to 6; it is now the dose share to a ranged exponent (0.7, 0.35–1.2), anchored on single-session meta-analyses and the dose-effect curve, which raised the result by about a third. Page references and wording were corrected. No fourth audit round was run (the skill allows three), so these round-3 fixes passed the mechanical audit only.

### Sources

- Friendship Bench, [quarterly impact reports 2024](https://www.friendshipbenchzimbabwe.org/impactreports) (Q1–Q3).
- Friendship Bench, [Annual report 2024](https://drive.google.com/file/d/1OdRIWIcOX7ZIxq_zaIWRB2WsxQ0GQrgF/view) and [Annual report 2025](https://drive.google.com/file/d/1jcoxqvNNTnkIsByD-dSK-u0gnaQzUYCQ/view).
- The Friendship Bench Inc, [Form 990 for 2024](https://projects.propublica.org/nonprofits/organizations/853440548) (read from the IRS e-file archive).
- Chibanda et al. 2016, [Effect of a primary care–based psychological intervention on symptoms of common mental disorders in Zimbabwe](https://jamanetwork.com/journals/jama/fullarticle/2594719), JAMA.
- Karyotaki et al. 2022, [Association of task-shared psychological interventions with depression outcomes in low- and middle-income countries](https://cquin.icap.columbia.edu/wp-content/uploads/2023/06/jamapsychiatry_karyotaki_2022_oi_220009_1664919228.58277.pdf), JAMA Psychiatry.
- Cuijpers et al. 2018, [Psychotherapies for depression in low- and middle-income countries](https://research.vu.nl/ws/files/105028031/Psychotherapies_for_depression_in_low_and_middleincome_countries.pdf), World Psychiatry.
- Chibanda et al. 2011, [Problem-solving therapy for depression and common mental disorders in Zimbabwe: piloting a task-shifting intervention](https://europepmc.org/article/PMC/PMC3210104), BMC Public Health.
- [RE-AIM evaluation of the Friendship Bench scale-up](https://europepmc.org/article/PMC/PMC9682765), BMC Health Services Research 2022.
- World Bank / WHO Global Health Estimates, [suicide mortality rates, Zimbabwe](https://api.worldbank.org/v2/country/ZWE/indicator/SH.STA.SUIC.FE.P5?format=json).
- WHO, [Global Health Estimates 2023 summary tables](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-leading-causes-of-death): deaths by cause, age and sex, Zimbabwe.
- Schleider & Weisz 2017, Little treatments, promising effects? Meta-analysis of single-session interventions for youth psychiatric problems, J Am Acad Child Adolesc Psychiatry.
