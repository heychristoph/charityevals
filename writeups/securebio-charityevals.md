### Summary

SecureBio works to stop catastrophic pandemics: it builds early warning from sewage and airplane waste, tests how far AI models help with dangerous biology, and paid for SecureDNA's free DNA synthesis screening. Our model of all its work in 2024 comes to **{{result}} years of healthy life per $1,000**. That figure rests on forecasts of how likely catastrophic pandemics and AI disasters are, and on an estimate of what a typical dollar of such work does to the risk. Both are deeply uncertain, so the plausible range runs from {{low}} to {{high}}.

### What the charity does

SecureBio is a nonprofit in Cambridge, Massachusetts, formed in 2022. In 2024 it spent $4.25 million (its Form 990, the latest filed), $3.39 million of it on four programmes:

| Programme | 2024 spending | What it is |
|---|---|---|
| Detection (the Nucleic Acid Observatory) | $1.45 million | Untargeted sequencing of city sewage and airplane waste, to spot a new pandemic before it spreads widely. Partners include CDC's traveller surveillance programme and Ginkgo Biosecurity. |
| SecureDNA | $1.14 million | Free software that screens DNA synthesis orders against a secret hazard database, tested with major manufacturers in 2024. It is now run by an independent Swiss foundation. |
| AI and biotechnology risks | $0.75 million | Tests of how far AI models help with dangerous biology, run for AI developers before release, and ways to remove that help. Its evaluations are cited in system cards of models from Anthropic, OpenAI and Google. |
| Protective equipment | $0.05 million | Work on stockpiles of pandemic-proof masks and suits, since wound down. |

Management cost $0.87 million, including a $175,000 legal settlement. The audited statements also record $1.04 million of donated services and use of facilities, which were others' resources.

### How the impact happens

Pandemics carry a yearly chance of catastrophe, from the domain experts' forecasts in the 2022 Existential Risk Persuasion Tournament, spread evenly to 2100. There is also a 2% yearly chance of a pandemic as deadly as COVID-19. AI's chance of disaster is the site's slider.

SecureBio's spending cuts that yearly risk by the share a typical project in the area does per dollar. That share comes from Rethink Priorities' cross-cause model, including its chance that a project backfires. The cut counts for the years such progress would otherwise have taken to come (5 by default), with each year discounted.

The deaths averted are valued like every death on the site, by age. A COVID-scale pandemic kills mostly older people, so its deaths take COVID's age mix. A catastrophe that kills a share of the world takes the world's age mix. One that ends humanity's future also takes the lives of everyone not yet born, counted only where you count lives that never start (0% by default).

### How the model works

- **Pandemic work.** Detection, SecureDNA and protective equipment, 78% of the spending, valued at a typical biosecurity project's cut per dollar.
- **AI evaluations.** 22% of the spending, valued as work against the misuse of AI. These are tests and safeguards on AI models themselves, the kind of work the site counts as AI misuse work.
- **No policy win and no training.** No law or institution was won in 2024, and SecureBio runs no training programme.

The adjustments, each applied to its own branch:

| Adjustment | Value | Reason |
|---|---|---|
| How far a typical project's effect applies | 1.2 for the AI evaluations, 0.75 for the pandemic work (about 0.84 overall) | AI developers use its evaluations. Neither the early-warning system nor SecureDNA was in routine use yet |
| Work no one else would have done now | 0.7 | Others also screen DNA orders, test AI models and sequence wastewater |
| SecureBio's share of the resources | 0.72 | Donated services, plus partners' work on samples, testing and model access |
| Missing data | slider | Nothing about SecureBio's effect on the risk is measured |

Side effects: other benefits +5%, from the Observatory's open data for tracking ordinary viruses. The Virology Capabilities Test is a benchmark AI developers could tune toward, at −2%. Published findings about where AI helps attackers cost −3%.

SecureBio held about a year of unrestricted reserves at the end of 2024, and its main funder renewed its support. A gift can no longer buy SecureDNA, so it buys detection and AI evaluations. The next dollar counts at {{row:marginal_vs_past_average}} of the past average.

### What drives the result

Pandemics that end humanity's future bring about half the pandemic work's share of the result, mostly through the deaths of everyone then alive: by default the future of people not yet born does not count (lives that never start: 0%). Catastrophes the world survives bring a little over a third and COVID-scale pandemics the rest. With the Long-run value set (a 0.1% discount rate, lives that never start in full) the result rises to about 21. The pandemic work gives most of the result; a dollar of the AI evaluations averts about as many deaths as a dollar of pandemic work, but little of the future, because the misuse disasters it guards against are mostly ones the world survives.

### Biggest uncertainties

- **How many years a cut counts before it would have come anyway.** The shared slider runs from 1 to 20 years: 0.47 to 6.7.
- **How much a dollar of this work cuts the risk.** Rethink's figures are placeholders and the range runs ten times either way: about 1.6 to 7.9 for the pandemic figure.
- **How much the next dollar does.** 17% to 85% of the past average: 0.76 to 3.8.
- **How likely catastrophic pandemics are.** The superforecasters put an extinction-level pandemic at about a hundredth of the experts' chance.

### What isn't modelled

- The good the Observatory's data and methods do in ordinary outbreaks, and safeguards against misuse far below a catastrophe, are a 5% share of the benefits, not a branch of their own.
- Losses beyond deaths, such as survivors' lost income and health, are a shared figure set to 0.

### How this model was checked

The model was built from the catastrophic-risk template. Round 1 of the independent audit checked every figure against the Form 990 and found no high issues and three medium ones. First, the reserves: much of the net assets was a multi-year grant booked in 2024, so the room factor is now neutral. Second, the use factor was above neutral without support; it is now neutral too, and the next dollar went from 48% to 49%. Third, one multiplier hid a blend, so the AI evaluations and the pandemic work now have their own. The low findings were fixed too: the system-card wording and the other benefits' explanation. A verification round checked those changes and asked for the next-dollar range to be the product of its factors' ranges (now 17% to 85%); a last round checked that. Later the multipliers were applied to each branch's own value instead of blended by spending, checked in a further round. The rounds are in audits/securebio-charityevals/.

### Sources

- SecureBio's Form 990 for 2024 (IRS e-file).
- SecureBio, "SecureBio's AI team: an overview of our work" (June 2025).
- Nucleic Acid Observatory updates, January and April 2025.
- Coefficient Giving's grant records for SecureBio (2024, 2025), via Longterm Wiki and Good Ventures.
- Karger et al., Forecasting Existential Risks (Forecasting Research Institute, 2023).
- Rethink Priorities, Cross-Cause Cost-Effectiveness Model.
