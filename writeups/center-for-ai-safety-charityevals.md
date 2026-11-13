### Summary

The Center for AI Safety (CAIS) works to lower the chance that AI causes a global catastrophe. It does research and builds benchmarks, runs a free compute cluster for outside safety researchers, advocates and trains newcomers. Our model of all its programmes in 2024 comes to **<span data-figure="headline" data-model="center-for-ai-safety-charityevals">1.4</span> years of healthy life per $1,000**. That figure rests on a forecast of how likely an AI catastrophe is and on an estimate of what a typical dollar of AI safety work does to that risk. Both are deeply uncertain, so the plausible range runs from about 0.03 to about 61.

### What the charity does

CAIS spent $7.2 million in 2024. Of its $6.3 million of programme spending:

- **Compute cluster: $2.9 million.** 256 A100 GPUs that academic researchers use for free. By 2024 over 400 researchers had used the cluster, for 121 papers.
- **Research: $1.2 million.** This includes the WMDP benchmark of AI models' hazardous knowledge, which appears in Google DeepMind's Gemini model card; circuit breakers, a defence against harmful outputs; and Humanity's Last Exam, built with Scale AI and about 1,000 experts, which Google reported for its Gemini 2.5 Pro launch.
- **Advocacy: $0.8 million.** A newsletter with 24,000 subscribers, over 100 media stories, and briefings for policymakers. CAIS's own lobbying was $97,000.
- **Field-building: $0.5 million.** A textbook with an online course that enrolled 240 students, conference workshops, and the SafeBench competition.
- **A further $0.9 million** is a programme line the tax return leaves undescribed. We spread it over the others in proportion to their spending.

The **CAIS Action Fund** is a separate 501(c)(4) lobbying organisation, and gifts to it are not tax-deductible. It co-sponsored California's SB 1047, which was vetoed in 2024. It files its own return and is not in this model.

### How the impact happens

AI carries a yearly chance of catastrophe: the site's shared 3% by 2100 that AI ends humanity's future, and three times that again for a catastrophe the world survives. Both are spread evenly over the years to 2100. You can move the 3% with a slider.

CAIS's spending cuts that yearly risk by the share a typical AI project does per dollar. That share comes from Rethink Priorities' cross-cause model, including its chance that a project backfires. Rethink has two kinds of AI project. Work against misuse, such as tests of dangerous knowledge and defences against attacks, cuts the misuse part of the risk. Other work cuts the misalignment part. In Rethink's model misuse is 10% of the risk that AI ends humanity's future, but about two thirds of the deaths in catastrophes the world survives, because misuse mostly kills part of humanity. We take about a quarter of CAIS's AI spending as misuse work: WMDP, circuit breakers and some of the cluster's projects. Rethink's misuse projects cut far more risk per dollar, so this quarter gives most of the result. The cut counts for the years such progress would otherwise have taken to come (5 by default), with each year discounted.

The deaths averted are valued like every death on the site, across the world's age groups. An AI catastrophe the world survives is taken to kill 25% of people. A catastrophe that ends humanity's future also takes the lives of everyone not yet born. Those future lives count only through the discount rate.

### How the model works

The research, compute cluster and advocacy are one branch, valued as typical AI safety work. The course is a training branch. It counts the students who go on to work on AI risk (5%, as a judgment), the years they stay in the work, and the course's share of the credit for that work (4%, its cost against theirs). A policy-win branch is set to zero, because CAIS itself won no law or standard in 2024.

The adjustments apply to all branches:

| Adjustment | Value | Reason |
|---|---|---|
| How far a typical project's effect applies to CAIS's work | 1.2 | Labs use its benchmarks; the cluster's projects vary in relevance |
| Work no one else would have done now | 0.65 | 70% of cluster users said their projects needed it; others also build benchmarks |
| CAIS's share of the resources behind its outputs | 0.61 | Outside researchers write the cluster's papers; benchmarks were made with Scale AI |
| Funging by large funders | 0.85 | Large AI safety funders fill gaps |
| Missing data | slider | Nothing about CAIS's effect on the risk is measured |

Side effects: other benefits +10% (workshops, competitions, readers of the textbook) and −5% for speeding up AI capabilities (Humanity's Last Exam is also a target labs race on).

CAIS holds about a year and a half of spending in reserve after two years of surpluses, so the next dollar counts at 40% of the past average.

### What drives the result

The result is far below the Nuclear Threat Initiative's 21. That is because Rethink's typical AI project cuts much less expected harm per dollar than its nuclear or pandemic projects; nothing particular to CAIS causes it. Deaths among people alive now account for most of the result, because at the default 4% discount rate the future counts for about 8 years of the long-run population. At a 0.1% discount rate the result rises to about 2.8. The course adds under a tenth.

### Biggest uncertainties

- **How likely an AI catastrophe is.** The slider runs from 0.4% to 20% by 2100, which moves the result from 0.2 to 9.
- **How much a dollar of this work cuts the risk.** Rethink's figures are placeholders, and the range runs ten times either way. For misuse work this moves the result from 0.2 to 13, the largest swing.
- **How much of CAIS's work targets misuse.** CAIS publishes no split of its projects; our quarter runs from 10% to 40% (0.6 to 2.1).
- **The discount rate and the years a cut counts.** Each moves the result several-fold.
- **How CAIS's work compares with a typical project.** Its benchmarks are widely used, but use isn't the same as lower risk.

### What isn't modelled

- Smaller AI disasters, such as an AI-assisted attack killing far fewer than 10% of people, have no shared forecast; a share is in the 10% of other benefits.
- Losses beyond deaths, such as survivors' lost income and health, are a shared figure set to 0.
- The 2023 Statement on AI Risk falls outside the year, which is 2024.

### How this model was checked

The model was built from the catastrophic-risk template, with the Nuclear Threat Initiative's model as the worked example. The independent audit rounds are in audits/center-for-ai-safety-charityevals/.

### Sources

- CAIS Form 990 for 2024 and 2023 (IRS e-file copies; ProPublica Nonprofit Explorer).
- Karger et al., Forecasting Existential Risks (Forecasting Research Institute, 2023).
- Rethink Priorities, Cross-Cause Cost-Effectiveness Model.
- Epoch AI, Do the biorisk evaluations of AI labs actually measure the risk of developing bioweapons? (2025).
- Humanity's Last Exam (lastexam.ai).
- Google, Gemini 2.5: Our most intelligent AI model (25 March 2025).
