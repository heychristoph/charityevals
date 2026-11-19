### Summary

The Johns Hopkins Center for Health Security works to prevent pandemics and other biological catastrophes and to prepare for them. It does this through policy research and advocacy, pandemic exercises, outbreak analytics for health departments and training. Our model of all its work in 2025 comes to **{{result}} years of healthy life per $1,000**. That figure rests on forecasts of how likely catastrophic pandemics are and on an estimate of what a typical dollar of such work does to the risk. Both are deeply uncertain, so the plausible range runs from {{low}} to {{high}}.

### What the charity does

The Center is part of Johns Hopkins University, so a gift goes through the university's form for the Center. It publishes no accounts or budget of its own. We built its 2025 budget, about $13.8 million, from the grants its funders publish, each spread over its term:

| Funder | Grant | In 2025 |
|---|---|---|
| Coefficient Giving (formerly Open Philanthropy), general support | $10 million over three years, from March 2023 | $3.3 million |
| CDC, the Center for Outbreak Response Innovation (CORI) | $23.5 million over five years, from 2023 | $4.7 million |
| Coefficient Giving, doctoral programme | $3.9 million over three years, from September 2022 | $0.9 million (to about September) |
| Sentinel Bio, general support | $1.1 million, November 2024, term not stated | $0.7 million (over a judged 1.5 years) |

That is about $9.7 million in 2025. We judge these grants to be 70% of the budget (45% to 95%); the rest comes from funders who publish no amounts. The university keeps 4% of every gift, and the School of Public Health takes a further share it doesn't publish (we take 4%), so about 92% of a gift reaches the Center.

The money pays for three kinds of work:

- **Biosecurity and pandemic policy.** Research and advocacy on DNA synthesis screening and on AI that could help design biological weapons. In December 2025 a senior scholar, Jassi Pannu, testified to Congress for gene synthesis legislation. The Center also runs pandemic exercises and publishes the journal Health Security.
- **CORI: about a third of the budget.** It builds outbreak risk assessments (for example measles and mpox), forecasting tools and a network of health departments testing outbreak response.
- **Training: about 10%.** The Emerging Leaders in Biosecurity fellowship took 31 mid-career professionals in 2025, and a Coefficient Giving grant pays doctoral scholarships.

### How the impact happens

Pandemics carry a yearly chance of catastrophe, from the domain experts' forecasts in the 2022 Existential Risk Persuasion Tournament (its post-tournament survey), spread evenly to 2100: 3.85% by 2100 of killing over 10% of people, 1.01% of ending humanity's future. There is also a 2% yearly chance of a pandemic as deadly as COVID-19. The superforecasters' lower figures are the low end of each range.

The Center's spending cuts that yearly risk by the share a typical biosecurity project does per dollar. That share comes from Rethink Priorities' cross-cause model, including its chance that a project backfires. The cut counts for the years such progress would otherwise have taken to come (5 by default), with each year discounted.

The deaths averted are valued like every death on the site, by age. A COVID-scale pandemic kills mostly older people, so its deaths take COVID's age mix. A catastrophe that kills a share of the world takes the world's age mix. A pandemic the world survives is taken to kill 15% of people. One that ends humanity's future also takes the lives of everyone not yet born, counted only where you count lives that never start (0% by default).

### How the model works

- **Pandemic work.** Everything except training, valued at a typical project's cut per dollar.
- **Training.** The fellows and doctoral students who go on to work on these risks because of it: 10% of the fellows, who mostly work in the field already, and 30% of the students. Their added work-years are valued at the cost of a year of such work. The training gets the full credit for those work-years, since no other programme trained the same people (down to half if another fellowship shares them). The employers who pay for the work are not a co-funder: the site's setting for resources committed only because of the charity applies to them.
- **A policy-win branch, set to zero.** No law or institution was won in 2025; the gene synthesis bills are still pending.

The adjustments, each applied to its own branch:

| Adjustment | Value | Reason |
|---|---|---|
| How far a typical project's effect applies | 0.9 for policy work and training, 0.4 for CORI (about 0.73 overall) | The Center's research is taken up widely. CORI is aimed at ordinary outbreaks, a thinner path to a catastrophe |
| Work no one else would have done now | 0.7 | Other groups also work on biosecurity policy and outbreak analytics |
| The Center's share of the resources | 0.9 | Exercises and meetings bring partners' staff time. CDC and the health departments use CORI's work: they are the adopters, under the site's setting for resources committed because of the charity |
| Funging by large funders | 0.9 | Coefficient Giving dominates its unrestricted money |
| Missing data | slider | Nothing about the Center's effect on the risk is measured |

Side effects: other benefits +5%, mainly CORI's help to health departments in ordinary outbreaks. Harm −2%: the Center's 2019 coronavirus exercise, Event 201, became a focus of conspiracy theories about COVID-19, and published pathogen analyses carry some risk of misuse.

The Center's main funder halved its general support in 2023, and that grant ends in 2026, so money is likelier than usual to be the constraint. CORI is paid by a restricted CDC grant, so a gift buys the policy research and training, which the model values more highly. The next dollar counts at {{row:marginal_vs_past_average}} of the past average.

### What drives the result

Pandemics that end humanity's future bring about half the result, mostly through the deaths of everyone then alive: by default the future of people not yet born does not count (lives that never start: 0%). Catastrophes the world survives bring about 37% and COVID-scale pandemics the rest. With the Long-run value set (a 0.1% discount rate, lives that never start in full) the result rises to about 45.

### Biggest uncertainties

- **How much a dollar of this work cuts the risk.** Rethink's figures are placeholders and the range runs ten times either way: 1.6 to 16.
- **How many years a cut counts before it would have come anyway.** The shared slider runs from 1 to 20 years: 0.62 to 8.8.
- **The Center's budget.** We built it from its grants. The result barely moves with it, because the cut is counted per dollar.
- **How likely catastrophic pandemics are.** The superforecasters put an extinction-level pandemic at about a hundredth of the experts' chance.

### What isn't modelled

- The good CORI and the Center's preparedness research do in ordinary outbreaks is a 5% share of the benefits, not a branch of its own.
- The Center's work on AI and biological weapons is valued with the pandemic area, not as AI risk.
- Losses beyond deaths, such as survivors' lost income and health, are a shared figure set to 0.

### How this model was checked

The model was built from the catastrophic-risk template. Round 1 of the independent audit found no high issues and two medium ones. The first was the next-dollar figure: a gift cannot buy CORI, which a restricted CDC grant pays for, so it now buys the higher-valued policy work and the figure rose from 53% to 64%. The second was the other benefits, now 5% with an anchor instead of 15%. The low findings were fixed too: the university's and the School's assessments on gifts, funging at 0.9, and the grant terms. A verification round checked those changes. Later the evidence multiplier was applied to each branch's own value instead of blended by spending, checked in a further round. The rounds are in audits/johns-hopkins-center-for-health-security-charityevals/.

### Sources

- Coefficient Giving's grant records for the Center (2022, 2023), via Longterm Wiki.
- Wikipedia and Longterm Wiki on the CDC award for CORI (2023).
- Sentinel Bio's grant record (2024).
- The Center's announcement of the 2025 fellowship class.
- Jassi Pannu's testimony to Congress, 17 December 2025.
- Karger et al., Forecasting Existential Risks (Forecasting Research Institute, 2023).
- Rethink Priorities, Cross-Cause Cost-Effectiveness Model.
