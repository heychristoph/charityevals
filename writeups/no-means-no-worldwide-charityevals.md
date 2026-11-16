### Summary

No Means No Worldwide writes a school course that teaches girls to recognise, avoid and resist sexual assault, and boys to respect consent and step in. It trains local partners and teachers to give the course. In 2025 it does about **{{result}} years of healthy life per 1,000 dollars**.

Three cluster-randomised trials tested the course for girls against a standard life-skills class. Two found almost half fewer rapes in the year after it. The third, the only one with independent data collectors and linked surveys, found none two years on. Most of the value is the post-traumatic stress and depression that each rape averted spares. The result is mostly uncertainty.

### What the charity does

All figures are from NMNW's audited accounts for calendar 2025:

- **The No Means No course** ($1.06 million of $1.51 million total spending). NMNW adapts the curriculum, trains and certifies trainers and instructors, and funds and supports implementing partners. In 2025 that included $266,421 of grants to five partners in sub-Saharan Africa. The standard course is now 10 hours (six two-hour sessions in the trials). Girls learn awareness, boundary-setting, verbal assertiveness and simple physical self-defence; boys learn about consent, gender equity and stepping in. A new 90-minute version, "Worth Defending", keeps only the mental and verbal skills.
- **Reach.** Partners taught 128,000 young people in six countries: Nigeria, Zimbabwe, Uganda, South Africa and others. Many partners run PEPFAR-funded HIV programmes for girls. That is down from 480,213 in 2024, after US aid cuts closed many partners' programmes.

### How the impact happens

1. Girls taught the course recognise danger sooner, refuse, shout, and fight back to escape when they need to. Fewer are raped in the following months.
2. A rape averted spares months to years of post-traumatic stress and depression, and a small risk of suicide later.
3. It also spares some pregnancies, infections, injuries and lost schooling. Girls already abused disclose more often and are linked to care.

### How the model works

- **Cost**: all of NMNW's 2025 spending. Partners' and governments' own delivery costs stay out of the cost. Instead they lower NMNW's share of the credit, judged at about $3 a young person from a costing of instructor hours.
- **Reach**: the 128,000, split by judgment into the standard course (55%) and the 90-minute course. Girls are {{row:girls_share_full}} of the standard course, from NMNW's pre/post questionnaires (14,860 girls and 5,825 boys).
- **Effect**: the trials' outcome, forced sex in the past year. We judge 6% of the girls taught would be raped in a year without the course, anchored on the trials' control arms (6.6% to 13.8%) and Zimbabwe's national survey (2.4% of girls 13 to 17 in a year, in interviews that under-report). The two trials that measured the year after the course are pooled: a risk ratio of 0.56 (95% CI 0.43 to 0.73). The protection counts for that year.
- **Health per rape**: post-traumatic stress from the meta-analysis of prospective studies (75% of survivors meet the criteria a month after, 41% a year after). We judge about 1.1 years beyond what a girl would have anyway, at GBD's anxiety-disorder weights. On top come judged extra depression and a small risk of death (mostly suicide, about 0.0006 per rape). All are discounted to when they come: about 0.3 of a healthy year, plus the deaths.
- **Adjustments**: internal validity 0.6 (in the two trials pooled, the course's own instructors gave out the surveys; the trial without that problem found no effect), external validity 0.9 (other countries, a shorter course), counterfactual 0.8, delivery 0.85, NMNW's share of the resources about 80%.
- **The 90-minute course** has only pre/post questionnaires. It counts at a fifth of the full course's effect, by judgment, and is discounted for missing data.

### What drives the result

- **Whether the trials' effect is real**: the internal validity adjustment runs from 0.1 to 1, moving the result tenfold.
- **How long it protects**: one year, from half a year to two.
- **How often the girls would be raped without it**: 2.5% to 12% a year.
- **The health lost per rape**: the years of post-traumatic stress and depression.

### Biggest uncertainties

- The trials disagree. The two that found large effects used the course's own instructors to give out surveys, and could not link girls' answers over time. The one that avoided both problems found no effect two years on. Its authors suggest the earlier designs may have overstated the effect.
- NMNW doesn't publish how many girls took each version of the course, nor its partners' costs.
- The health lost per rape rests on studies of mostly adult women in the US.

### What isn't modelled

Beyond the share in unmodelled benefits (pregnancy, infections, injuries, schooling, boys' own safety, disclosure and care, with backlash and false confidence against them): NMNW's research and new curricula (digital safety, athletes, disability), and the future courses its certified trainers and government partners will give.

### How this model was checked

The mechanical audit (`scripts/audit-model.ts`) runs on the model. Independent auditors, a fresh agent each round using the audit-cea skill, checked it; the rounds are in `audits/no-means-no-worldwide-charityevals/`.

- **Round 1**: two high findings. The third trial measured the second year after the course, so pooling it into the first year's effect and also using it to limit how long protection lasts counted it twice: the pool now has the two first-year trials (0.56), and the third trial informs internal validity (0.6, 0.1 to 1). Years of post-traumatic stress per rape fell from 1.6 to 1.1, a judgment rebuilt from the meta-analysis's attrition-adjusted range. Mediums fixed: the pool's trials cited in its source, partner fidelity counted once (delivery) rather than also in external validity, and the rape rate anchored also on Zimbabwe's national survey (8% to 6%). Lows fixed: course length (10 hours), the severity mix anchored on GBD's average anxiety weight, the partners' cost costed ($4 to $3), unspent funds and a shorter summary. The result went from 0.14 to 0.12.
- **Round 2** (verification): pass, with two mediums and two lows, fixed after it: the PTSD severity mix now has GBD's three levels (mild, moderate, severe) at GBD's split of anxiety cases, the rape rate's uplift from interview surveys to the trials' self-completed ones is worked from the two anchors, and the instructor wage is labelled a judgment. The result went from 0.12 to 0.10. A scoped verification round checked those changes.

### Sources

- No Means No Worldwide, [audited financial statements, 2025 and 2024](https://nomeansnoworldwide.org/file_download/inline/c64724a0-8dd8-4a05-a2a4-a6113e895e1c) (Calibre CPA Group).
- No Means No Worldwide, [2025 Annual Report](https://nmnw.my.canva.site/2025annualreport) and [2024 Annual Report](https://nmnw.my.canva.site/2024-annual-report).
- Baiocchi et al., [A Behavior-Based Intervention That Prevents Sexual Assault: the Results of a Matched-Pairs, Cluster-Randomized Study in Nairobi, Kenya](https://doi.org/10.1007/s11121-016-0701-0), Prevention Science 2017.
- Decker et al., [Sexual violence among adolescent girls and young women in Malawi: a cluster-randomized controlled implementation trial of empowerment self-defense training](https://pmc.ncbi.nlm.nih.gov/articles/PMC6278011/), BMC Public Health 2018.
- UNICEF Zimbabwe, [Understanding Determinants of Violence in Childhood](https://www.unicef.org/zimbabwe/media/321/file) (secondary analysis of the 2011 national survey).
- Sarnquist et al., [Sexual Assault Among Young Adolescents in Informal Settlements in Nairobi, Kenya: Findings from the IMPower and SOS Cluster-Randomized Controlled Trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC11111490/), Prevention Science 2024.
- Dworkin et al., [PTSD in the Year Following Sexual Assault: A Meta-Analysis of Prospective Studies](https://pmc.ncbi.nlm.nih.gov/articles/PMC8766599/), Trauma, Violence, & Abuse 2023.
- Dworkin et al., [Sexual assault victimization and psychopathology: A review and meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC5576571/), Clinical Psychology Review 2017.
