### Summary

NOVAH (No Violence At Home) makes Twubakane ("Let's build together"), a radio drama about a Rwandan couple whose marriage strains under one-sided decisions and money worries, and who learn to decide together. Its aim is to prevent violence against women by their husbands or partners. In 2025 it does about **{{result}} years of healthy life per 1,000 dollars**.

2025 was NOVAH's first full year. Its first six-episode season aired on one regional station and about 27,000 adults followed it. The same year's money also made a second season and prepared a large trial of it, which ran in 2026 and has no published result yet. Whether the drama reduces violence at all is the biggest uncertainty.

### What the charity does

All figures are from NOVAH's activity report for 2024-2025, whose management accounts cover both its Dutch foundation and its US fiscal sponsor:

- **Spending.** $173,600 in 2025 on one programme:
  - the two co-directors and international subcontractors, $80,013;
  - Season 1's broadcast and evaluations, $15,530;
  - Season 2's production and evaluation and the trial's preparation, $65,478;
  - events and administration.

  Partners' in-country costs are paid by NOVAH: RWAMREC (a Rwandan violence-prevention organisation), Urunana Development Communication (scripts and recording) and Innovations for Poverty Action. The Dutch foundation's own accounts are compiled, not audited.
- **Season 1** (six 20-minute episodes, written after focus groups and a test of three storylines) aired in February 2025 on RC Musanze, the national broadcaster's station in northern Rwanda. NOVAH's survey of 500 adults a week later counted about 27,000 active listeners, 7% of the adults in the station's area: people who could answer a question about the story.
- **A pilot study** in mid-2025 played Season 1 to 140 couples in Eastern Province and compared them with 60 couples elsewhere.
- **Season 2** (12 episodes) was made in 2025 and aired in 2026 as the treatment in a randomised trial with 2,400 couples in 96 villages, run with Innovations for Poverty Action. A national broadcast is planned.

### How the impact happens

1. Couples hear a story in which a husband who decides alone learns to share decisions about money, drink less and seek help early.
2. Some couples change how they argue and decide, and fewer husbands hit or force their wives.
3. Each year of violence averted spares some depression, anxiety, injuries and HIV infections, and a small risk of death.

### How the model works

- **Cost**: all of NOVAH's 2025 spending. It also paid for Season 2, which aired in 2026. That is counted the way an ongoing programme's year is: one year's delivery against one year's cost.
- **Reach**: the 27,000 active listeners (from 31 listeners in the survey, so 16,500 to 32,600). 84% of them were married (26 of the survey's 31 listeners), and we judge 1.5 married listeners per couple reached. That gives about {{row:broadcast_couples}} couples, plus the pilot's 140.
- **Effect**: without the drama, 23.6% of married women in Rwanda suffer physical or sexual violence from their partner in a year (DHS 2019-20). We judge a quarter of that is prevented among couples with an active listener, at the dose they got (most heard only some episodes). The anchors:
  - a randomised trial of short anti-violence videos in Ugandan villages found 4.9 points less violence from 21%, and about 60% less among women who attended;
  - NOVAH's own pilot, with couples who heard the whole season, found 40% less, without a confidence interval.

  We judge the effect lasts a year.
- **Health per year of violence**: the Global Burden of Disease 2021 puts the burden of partner violence among women 15-49 in Rwanda's region at about {{row:dalys_per_ipv_year}} healthy years per woman-year of violence. That counts the women suffering it in a year (the WHO-led estimate for the region, Sardinha et al.), and includes deaths, mostly from HIV and homicide. We judge Rwanda's burden at three quarters of the region's, as its HIV burden is lower. The deaths are taken out and valued by age, as in every model. GBD counts harm from ever having been abused, so we judge a year averted removes three quarters of it.
- **Adjustments**:
  - internal validity 0.7 (self-reported violence, the Uganda trial's measure not pre-registered, and a pilot that wasn't randomised);
  - external validity 0.85 (videos at village screenings against radio at home);
  - NOVAH's share of the resources 0.95;
  - the shared missing-data discount, because the effect is a judgment until NOVAH's own trial reports.

  Treatment saved (the site's share for prevention) and the judged 30% for children's exposure, the fear and pain of the violence itself, the pilot's other gains and what NOVAH's studies teach others come on top.

### What drives the result

- **Whether the drama reduces violence**: the judged fall runs from 5% to 50%.
- **How many couples one season reaches**: one regional station in 2025. Reach at a national broadcast hasn't been measured.
- **The health lost per year of violence**: GBD's uncertainty interval, Rwanda against its region, and how much of a lifetime's burden one year carries.
- **How long the change lasts**: half a year to two years.

### Biggest uncertainties

- No randomised result for this drama is published. NOVAH's 2026 trial will report on violence in the past four months and the past month, with results expected by the end of 2026.
- The listener count rests on 31 active listeners in a survey of 500.
- GBD's burden of partner violence leaves out the fear and pain of the violence itself.

### What isn't modelled

Beyond the judged share above, Season 2's 2026 audiences and any later broadcasts of either season are counted against the years whose spending reaches them, not here.

### How this model was checked

The mechanical audit (`scripts/audit-model.ts`) runs on the model. Independent auditors, a fresh agent each round using the audit-cea skill, checked it; the rounds are in `audits/novah-charityevals/`.

- **Round 1**: four high findings. The effect is a judgment anchored mostly on a trial of other delivery, so the missing-data discount now applies. The broadcast audience's partial listening was cut twice, in the effect and again as delivery: the effect is now for the audience at the dose it got, and delivery is 1. Treatment saved now takes the site's share for prevention. The fourth, retiring Ambitious Impact's idea-stage estimate, is left to the site's owner. Mediums fixed: the region's ever-partnered share (72%, not Rwanda's 59.6%) turns the regional prevalence into a share of women; a step puts Rwanda's burden at three quarters of the region's (less HIV); the share of the burden a year averted removes is re-anchored (0.75) and counts health only, with the fear and pain of the violence counted once among the unmodelled effects; the listener count has the survey's binomial range. Lows fixed: the counterfactual is 1, the Uganda trial's caveats are stated, and sources and wording are corrected. The result went from 0.108 to 0.063.
- **Round 2** (verification): pass, with one low left open: the region's ever-partnered share is a judgment in this model, not yet a shared figure.

### Sources

- NOVAH, [Annual Activity Report 2024-2025](https://8b2a6c3d-700b-46e2-968b-5550d195f236.usrfiles.com/ugd/8b2a6c_4f5a5e6b54ad4991ae302b84d4b13c6e.pdf).
- Stichting NOVAH, [Jaarrekening 2025](https://8b2a6c3d-700b-46e2-968b-5550d195f236.usrfiles.com/ugd/8b2a6c_99d0c5239e284594aceaee998d8ce34e.pdf) (annual accounts, compiled).
- NOVAH, [Twubakane's evaluation (season 1)](https://0c52f319-0514-43e8-9c46-37f7357ba322.usrfiles.com/ugd/0c52f3_eaa203ac7b8a44239bfb981afb1b9b93.pdf).
- Green, Wilke and Cooper, [Countering Violence Against Women by Encouraging Disclosure: A Mass Media Experiment in Rural Uganda](https://poverty-action.org/sites/default/files/2023-09/green-et-al-2020-countering-violence-against-women-by-encouraging-disclosure-a-mass-media-experiment-in-rural-uganda_0.pdf), Comparative Political Studies 2020.
- Sardinha et al., [Global, regional, and national prevalence estimates of physical or sexual, or both, intimate partner violence against women in 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC8885817/), The Lancet 2022.
- [Persistent burden and health inequalities of disease in women of childbearing age attributable to Intimate Partner Violence, 1990-2021](https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2025.1515828/full), Frontiers in Psychiatry 2025 (GBD 2021).
- National Institute of Statistics of Rwanda and ICF, [Rwanda Demographic and Health Survey 2019-20](https://dhsprogram.com/pubs/pdf/FR370/FR370.pdf).
