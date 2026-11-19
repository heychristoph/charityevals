### Summary

METR (Model Evaluation and Threat Research) measures what frontier AI agents can do on their own, and whether the companies that build them could lose control of them. Our model of its work in 2024 comes to **{{result}} years of healthy life per $1,000**. That figure rests on forecasts of how likely an AI catastrophe is and on an estimate of what a typical dollar of AI safety work does to that risk. Both are deeply uncertain, so the plausible range runs from {{low}} to {{high}}.

### What the charity does

METR began as ARC Evals, a team inside the Alignment Research Center, and became a charity of its own in 2024. Its first Form 990 covers May to December 2024: it spent $8.2 million in those eight months (its statements were audited). Its one programme cost $6.9 million:

- **Evaluations before release.** With OpenAI and Anthropic, it tested GPT-4o, o1-preview and Claude 3.5 Sonnet for autonomous abilities before or soon after release.
- **Measurement research.** It built task suites timed against human experts and RE-Bench, which compares AI agents with people on AI research tasks. It pays contractors to build tasks and to set the human baselines ($1.1 million).
- **Policy analysis.** It compared the frontier safety policies AI companies publish, and it advises companies and governments, among them the UK AI Security Institute and the European AI Office.

METR takes no money from AI companies, though they give it access to their models and free tokens.

### How the impact happens

AI carries a yearly chance of catastrophe, spread evenly to 2100. By default there is a 3% chance by 2100 that AI ends humanity's future; this is a slider. The forecasting tournament's experts expect three AI catastrophes the world survives for every one that ends it. A catastrophe the world survives is taken to kill a quarter of people.

METR's spending cuts that yearly risk by the share a typical AI project does per dollar. That share comes from Rethink Priorities' cross-cause model, including its chance that a project backfires. Rethink has one typical project for work against misuse and one for work against AI that doesn't do what its makers intend. The cut counts for the years such progress would otherwise have taken to come (5 by default), and each year is discounted.

The deaths averted are valued like every death on the site, across the world's age groups. A catastrophe that ends humanity's future also takes the lives of everyone not yet born. Those future lives count only where you count lives that never start (0% by default).

### How the model works

All of METR's spending is on AI. The model's pandemic and nuclear areas are set to zero, and so are its policy-win and training branches. The companies' pledges at the Seoul summit in May 2024 to publish safety policies built on policies first published in 2023, before METR's own spending, so they aren't counted as its win.

All the work counts as work against AI escaping control. Some of its tasks are cybersecurity tasks, but they measure an agent's general autonomy, not help to an attacker, and work aimed at both counts as misalignment.

| Adjustment | Value | Reason |
|---|---|---|
| How far a typical project's effect applies to METR's work | 1.2 | Labs run its evaluations on their models before release; the family's upper bound |
| Work no one else would have done now | 0.65 | Government AI safety institutes and lab teams also test models before release |
| METR's share of the resources behind its work | 0.8 | The companies give model access and free tokens |
| Funging by its main funders | 1 | Counted once, in the next-dollar figure |
| Missing data | slider | Nothing about METR's effect on the risk is measured |

Side effects: other benefits add 10% (its measures inform governments and the public about AI progress). Two harms subtract 10% and 2%. A report that finds nothing dangerous can make a release look safe, and its benchmarks give developers targets and feed the race. Its published methods show a little about building autonomous agents.

METR ended 2024 with net assets of $5.4 million, about five months of spending. But The Audacious Project committed about $17 million in October 2024, and METR raised commitments of about $71 million in the six months to August 2026. Money is not its main constraint, so the next dollar counts at {{row:marginal_vs_past_average}} of the past average.

### What drives the result

All of METR's work is against AI escaping control. For catastrophes the world survives, Rethink's typical misalignment project cuts deaths far less per dollar than its typical misuse project. Here, deaths of people alive now carry most of the value.

### Biggest uncertainties

- **How likely an AI catastrophe is.** The setting's range runs from 0.38% (the superforecasters) to 50%. Across it the result moves from 0.0021 to 0.27.
- **How much a dollar of misalignment work cuts the risk.** Rethink's figures are placeholders, and the range runs ten times either way: from 0.0080 to 0.22.
- **Whether any of the work counts as misuse work.** If the cybersecurity tasks counted as misuse work (about 10% of the work), the result would be 0.29.
- **The discount rate and the years a cut counts.** These are shared sliders. With the Long-run value set (a 0.1% discount rate, lives that never start in full) the result is about 0.65.

### What isn't modelled

- METR's work before 2024, inside the Alignment Research Center, and after it is not valued here. That includes its measure of the length of tasks AI agents can complete (March 2025) and its study of developers' productivity with AI tools (July 2025).
- Losses beyond deaths, such as survivors' lost income and health, are a shared figure set to 0.
- The forecasts are spread evenly over the century, though forecasters put much of the AI risk later.

### How this model was checked

The model was built from the catastrophic-risk template. Round 1 of the independent audit passed with two medium findings, both fixed: the tax return covers only May to December 2024, and the funging adjustment asked again whether money is the constraint, which the next-dollar figure already asks. Funging is now 1 here and in every catastrophic-risk model, raising this result from 0.048 to 0.057. Independent audits are in audits/metr-charityevals/.

### Sources

- Model Evaluation and Threat Research Inc, Form 990 for 2024 (IRS e-file).
- METR, about page, risk-assessment page, and its posts on The Audacious Project (2024) and funding (2026).
- Rein et al., HCAST (2025); Wijk et al., RE-Bench (2024).
- Karger et al., Forecasting Existential Risks (Forecasting Research Institute, 2023).
- Rethink Priorities, Cross-Cause Cost-Effectiveness Model.
