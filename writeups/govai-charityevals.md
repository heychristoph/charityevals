### Summary

The Centre for the Governance of AI (GovAI) researches how governments and AI companies can manage the risks of advanced AI, advises them, and trains people for the field. Our model of all its work in 2025 comes to **<span data-figure="headline" data-model="govai-charityevals">2.9</span> years of healthy life per $1,000**. That figure rests on a forecast of how likely an AI catastrophe is, on an estimate of what a typical dollar of AI safety work does to that risk, and on our judgment of what the EU's Code of Practice for general-purpose AI does and how much of it is GovAI's. All are deeply uncertain: on the model's own ranges the result runs from about 0.07 to about 48, and wider with the shared assumptions.

### What the charity does

GovAI spent $11.9 million in 2025, its first full year as an independent charity: a US nonprofit with a UK subsidiary that runs its London office. The annual report gives only the total, so the split below is our estimate.

- **Research and policy engagement: about three quarters.** Some 17 researchers and 15 year-long Research Scholars worked on frontier AI companies' safety frameworks, regulation of frontier AI, AI agents, threat modelling of AI-enabled attacks (bioterrorism, the power grid, cybercrime) and AI's economic effects. Others were seconded to the UK government and the OECD, and two were writers of the International AI Safety Report.
- **The EU Code of Practice: about 2%.** GovAI's director of policy was one of the 13 chairs and vice-chairs who drafted it. It was published in July 2025 and signed by most frontier developers.
- **Talent development: about a quarter.** 81 Seasonal Fellows spent three months in London or Washington, chosen from 18,000 applications. About 60% of alumni hold an AI governance role a year later. The Research Scholars' year counts half here, and 16 people completed a part-time Policy Program.

The only audited accounts are the US entity's short first return for 2024 ($0.9 million). Most of that year's work ran elsewhere, so we use 2025, which the annual report covers in full.

### How the impact happens

AI carries a yearly chance of catastrophe: the site's shared 3% by 2100 that AI ends humanity's future, and three times that again for a catastrophe the world survives. You can move the 3% with a slider.

GovAI's research cuts that yearly risk by the share a typical AI project does per dollar, from Rethink Priorities' cross-cause model (its chance that a project backfires included). Rethink has two kinds of AI project. Work against misuse cuts the misuse part of the risk, which is most of the deaths in catastrophes the world survives. Other work cuts the misalignment part. We take a fifth of GovAI's catastrophe research as misuse work, mainly its Threat Modelling Team, and Rethink's misuse projects cut far more risk per dollar. The cut counts for the years such progress would otherwise have taken to come, each year discounted.

The deaths averted are valued like every death on the site, across the world's age groups. A catastrophe that ends humanity's future also takes the lives of everyone not yet born, counted through the discount rate.

### How the model works

The model has three branches.

- **Research and policy engagement**, valued as typical AI safety work. About a fifth of the research is on AI's economic effects and US competitiveness rather than catastrophes; it counts as a share of other benefits, not through the catastrophe chances.
- **The Code of Practice**, a policy win. We judge that its safety chapter removes 0.1% of the AI catastrophe risk while in force, beyond what the AI Act already requires; most signatories already had safety frameworks. GovAI's director of policy was one of the 9 people who drafted that chapter, and about half of his part another expert would have written. This branch gives about half the result.
- **Training.** It counts the fellows and scholars who go on to work on AI risk because of it (22%), the years they stay (5), and the training's share of the credit for that work (12%, its cost against theirs).

Each adjustment is set branch by branch and weighted by the deaths each branch averts:

| Adjustment | Research | Code | Training |
|---|---|---|---|
| How far a typical project's effect applies | 0.8 × 1 (catastrophe share × uptake) | 1 (the cut is judged directly) | 1 |
| Work no one else would have done now | 0.6 | 0.5 | 0.9 |
| GovAI's share of the resources | 0.75 | 0.11 (1 of 9 drafters) | 0.95 |

Funging by large funders is 1, counted once in the next-dollar figure. The missing-data slider applies to every branch, because nothing about GovAI's effect on the risk is measured.

Side effects: other benefits +15% (the economics work, smaller attacks, events, the Policy Program), −2% for speeding up AI (its US competitiveness work) and −3% for published threat models that could draw attackers' attention.

GovAI doubled its spending in 2025 and plans more growth; the UK office alone held about eight months of spending in cash at the year's end. The next dollar counts at 42% of the past average.

### What drives the result

The result is above the Center for AI Safety's and far above METR's, MIRI's and Redwood Research's. Two things cause this: the Code of Practice, and the fifth of GovAI's catastrophe research aimed at misuse, which Rethink's typical project values far above misalignment work. It is far below the Nuclear Threat Initiative's, because Rethink's typical AI project cuts much less expected harm per dollar than a nuclear one.

### Biggest uncertainties

- **How likely an AI catastrophe is.** The slider moves the result many-fold.
- **What the Code does and how much of it is GovAI's.** Both are our judgments; each moves the result several-fold.
- **How much a dollar of misuse work cuts the risk.** Rethink's figure runs ten times either way.
- **The discount rate and the years a cut counts.** Each moves the result several-fold.
- **The 2025 figures.** No audited statement for 2025 is public yet, and the split between research and training is our estimate.

### What isn't modelled

- Smaller AI disasters, such as an AI-assisted attack killing far fewer than 10% of people, have no shared forecast; a share is in other benefits.
- Losses beyond deaths are a shared figure set to 0.

### How this model was checked

The model was built from the catastrophic-risk template, with the Center for AI Safety's model as the worked example. The first audit round moved the Code of Practice into the policy branch, split the counterfactual by branch so the training's is not counted twice, and lowered the research's uptake factor to 1. The second round put GovAI's part of the Code into the counterfactual and credit rows, counted it over its safety chapter's 9 drafters, anchored the Code's cut on the AI Act and Rethink's rate (0.1%), and chained the adjustments so each branch keeps its own product. The audit rounds are in audits/govai-charityevals/.

### Sources

- GovAI, Annual Report 2025.
- Centre for the Governance of AI Inc, Form 990 for 2024 (IRS e-file).
- Centre for the Governance of AI (UK), accounts to 31 December 2025 (Companies House).
- GovAI, UK Summer Fellowship 2027 page (fellows' salary).
- European Commission, The General-Purpose AI Code of Practice; Meet the Chairs leading the development of the first General-Purpose AI Code of Practice.
- Karger et al., Forecasting Existential Risks (Forecasting Research Institute, 2023).
- Rethink Priorities, Cross-Cause Cost-Effectiveness Model.
