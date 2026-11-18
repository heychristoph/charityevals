### Summary

Kaya Guides runs WHO's guided self-help course for depression on WhatsApp, in Hindi, for young adults in India. Our model of its 2025 work comes to **{{result}} years of healthy life per $1,000** (plausible range {{range}}).

About 2,800 people started the course in 2025, at about {{row:cost_per_person}} each. The effect comes from three randomised trials of the same course: they found about half a standard deviation less depression at the end of treatment. The model expects that to fade over about a year and a half, and cuts it for how far the trials carry to young Indians on WhatsApp.

### What the charity does

- **Finding people**: young adults, mostly 18 to 29 and in Hindi-speaking states, find its WhatsApp bot through Instagram ads, often late at night. The bot screens them for depression; most start at moderate or severe (a PHQ-9 score of 17.8 on average).
- **The course**: eight weeks of short video lessons in coping and emotional regulation, adapted from WHO's Step-by-Step.
- **Guide calls**: weekly 15-minute calls with lay counsellors, who help people apply the lessons to their own problems.

Kaya Guides began with a pilot in August 2023. It treated 681 people in 2024 and 2,776 in 2025, and its cost per person fell as numbers grew. It is a project of Development Consortium in India and is fiscally sponsored in the US.

### How the model works

**Cost.** Kaya Guides publishes no accounts of its own. Its website gives its total cost per participant each month, overhead and partnerships included, and its count of new participants each day. Multiplying the two for each month of 2025 gives about {{row:program_spend}} for the year.

**Effect.** The model pools the three randomised trials of guided Step-by-Step by precision: Syrian refugees in Lebanon (0.48 SD), Lebanese residents (0.71 SD) and Chinese university students (0.35 SD). Each compared the course with enhanced care as usual, which makes {{row:initial_effect_sd}} SD. The effect is taken to fade in a straight line over {{row:effect_duration_years}} years: three months after the course the trials together kept about four fifths of it (it held in Lebanon but had mostly faded in China). It becomes WELLBYs at the site's shared rate, with the site's shared spillover to the rest of the household.

**Adjustments.**
- Trust in the trials and how far they carry: {{row:evidence_adj}}. The trials were run by the programme's developers and lost many participants. Their populations and app differ from Kaya Guides' participants and WhatsApp.
- Participants who never take a first call: {{row:implementation_adj}} of starters count.
- Kaya Guides' share of the credit: {{row:attribution_share}}.

**Suicides.** A small number of suicides averted are added, at the site's shared value of a death.

Kaya Guides' own before-and-after data is a check, not an input: a fall of 5.9 PHQ-9 points among those who answered its 8-week survey. It has no comparison group, and about a quarter of participants answered.

### What drives the result

- How long the effect lasts.
- How much of the trials' effect carries to Kaya Guides' participants.
- The site's value of a WELLBY in healthy years, the reader's slider.

### Biggest uncertainties

- **Duration.** The trials followed people for only three months.
- **Population.** No trial has tested Step-by-Step on WhatsApp in India, or in a population like Kaya Guides' young, Instagram-recruited participants. Kaya Guides is running its own randomised trial in 2026, which should settle both.
- **Cost.** It is derived from the charity's own monthly chart, not audited accounts.

### What isn't modelled

Effects on anxiety, functioning and life outside the depression score are counted as a small share, as is a small risk that self-help delays more intensive care.

### How this model was checked

Before the independent audit rounds in audits/kaya-guides-charityevals/, the model passed the site's mechanical checks (preflight: lint, invariants, simulation, sources). Round 1, a full audit, found two highs, three mediums and three lows. The effect's duration was too short for the trials' own 3-month follow-ups and is now pooled from them. The trials' ranges are now symmetric. The cut for engagement double-counted the trials' own dropout and was mostly removed. The suicide rate is now WHO's for ages 20 to 29. The trust adjustment is anchored on the trials' attrition bounds and the young-adult trial. A verification round passed.

### Sources

- [Kaya Guides](https://kayaguides.com): home page, its monthly [cost per participant](https://kayaguides.com/_file/data/cost-effectiveness.e2238115.csv), [participants per day](https://kayaguides.com/_file/data/participants-per-day.e7029d7a.parquet) and [outcome statistics](https://kayaguides.com/_file/data/statistics.a21bd68b.parquet).
- [Cuijpers et al. (2022)](https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1004025), Step-by-Step for Syrian refugees in Lebanon, PLOS Medicine.
- [Cuijpers et al. (2022)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9811068/), Step-by-Step in Lebanon, Evidence-Based Mental Health.
- [Li et al. (2024)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10879210/), Step-by-Step for young Chinese adults, Translational Psychiatry.
- [WHO Global Health Observatory](https://www.who.int/data/gho/data/indicators/indicator-details/GHO/crude-suicide-rates-(per-100-000-population)), crude suicide rates, India.
