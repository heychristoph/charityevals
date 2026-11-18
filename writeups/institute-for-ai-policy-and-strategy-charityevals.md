### Summary

The Institute for AI Policy and Strategy (IAPS) is a think tank in Washington. It researches policy on advanced AI and national security, briefs officials and runs an AI Policy Fellowship. Our model of all its work in 2025 comes to **{{result}} years of healthy life per $1,000**. That figure rests on a forecast of how likely an AI catastrophe is and on an estimate of what a typical dollar of AI safety work does to that risk. Both are deeply uncertain: the plausible range runs from {{low}} to {{high}}.

### What the charity does

In 2025 IAPS was a project of Rethink Priorities, its fiscal sponsor. Rethink Priorities' tax return lists it as its own programme, $3.9 million, inside its audited accounts. With its share of the sponsor's central costs (finance, HR, fundraising) it cost about $4.2 million. In 2026 IAPS became its own charity. Its money is counted here, not in Rethink Priorities' cost, so it is counted once.

- **Research and policy engagement: about 70%.** About 20 researchers in three teams. Frontier Security works on AI-enabled cyber attacks, AI agents, AI security in government and data centre security. Compute Policy works on export controls, chip smuggling and location verification for AI chips. International Strategy works on the US and China. It published 8 major reports in 2025. Its recommendations are reflected in America's AI Action Plan, and two bills on chip security draw on its research (location verification for chips, a whistleblower programme for export controls).
- **The AI Policy Fellowship: about 30%.** 28 fellows spent three months on AI policy, chosen from over 5,600 applicants, on stipends of $15,000 to $22,000. The split is our estimate.

### How the impact happens

AI carries a yearly chance of catastrophe: the site's shared 3% by 2100 that AI ends humanity's future, and three times that again for a catastrophe the world survives. You can move the 3% with a slider.

IAPS's research cuts that yearly risk by the share a typical AI project does per dollar, from Rethink Priorities' cross-cause model (its chance that a project backfires included). Rethink has two kinds of AI project. Work against misuse cuts the misuse part of the risk, which is most of the deaths in catastrophes the world survives. Other work cuts the misalignment part. We count 20% of IAPS's catastrophe work as misuse work, mainly its cyber research. The cut counts for the years such progress would otherwise have taken to come, each year discounted.

The deaths averted are valued like every death on the site, across the world's age groups. A catastrophe that ends humanity's future also takes the lives of everyone not yet born, counted only where you count lives that never start (0% by default).

### How the model works

The model has two branches.

- **Research and policy engagement**, valued as typical AI safety work. About a fifth of it is about US competitiveness and ordinary national security rather than catastrophes; it counts as a share of other benefits. None of the measures it worked on had become law or rule by the end of 2025, so there is no policy-win branch.
- **The fellowship.** It counts the fellows who go on to work on AI risk because of it (20%), the years they stay (5), and the fellowship's share among those who trained the same people (all of it at the default: no other programme is known to have trained the same fellows). The employers who pay for the alumni's work are not in that share: their work is mobilised, and the site's one mobiliser setting covers it.

The fellowship gives most of the result (about 85% at the defaults), the research and policy work the rest. Each adjustment is set branch by branch and weighted by the healthy years each branch gives:

| Adjustment | Research | Fellowship |
|---|---|---|
| How far a typical project's effect applies | 0.8 × 1 (catastrophe share × uptake) | 1 |
| Work no one else would have done now | 0.6 | 0.9 |
| IAPS's share of the resources | 0.75 | 0.95 |

Funging by large funders is 1, counted once in the next-dollar figure. The missing-data slider applies to both branches, because nothing about IAPS's effect on the risk is measured and it publishes no survey of its alumni.

Side effects: other benefits +10% (national-security work short of catastrophe, fellows' own research, media), −5% for speeding up AI (much of the work is framed as helping the US win the AI contest with China) and −1% for published analyses of AI cyber attacks.

At the end of 2025 about two years of spending was set aside for IAPS, and it has grown since. The next dollar counts at 38.5% of the past average.

### What drives the result

### Biggest uncertainties

- **How likely an AI catastrophe is.** The slider moves the result many-fold.
- **How much a dollar of misuse work cuts the risk.** Rethink's figure runs ten times either way, and the share of IAPS's work counted as misuse moves the result almost in proportion.
- **The discount rate and the years a cut counts.** Each moves the result several-fold.
- **The fellowship's effect.** It gives most of the result, and IAPS publishes no data on where its fellows went: the share who work on AI risk because of it (20%, 5% to 40%) moves the result more than any other judgment about the fellowship.

### What isn't modelled

- Smaller AI disasters, such as an AI cyber attack killing far fewer than 10% of people, have no shared forecast; a share is in other benefits.
- Losses beyond deaths are a shared figure set to 0.

### How this model was checked

The model was built from the catastrophic-risk template. The first audit round found no high-severity problem. It raised the share of work counted as misuse from 15% to 20%, since two of the year's eight major items are cyber work. It also corrected the fellowship's source and narrowed the range of the sponsor's central costs so none are counted twice. Two verification rounds checked the changes. A later round (credit rule 2.24) took the employers out of the fellowship's pro-rata share and re-checked the branch shares. The audit rounds are in audits/institute-for-ai-policy-and-strategy-charityevals/.

### Sources

- Rethink Priorities, Form 990 for 2025 and audited consolidated financial statements for 2025.
- IAPS, 2025 Year in Review; Governance, history, independence and funding; Our Team; AI Policy Fellowship.
- Karger et al., Forecasting Existential Risks (Forecasting Research Institute, 2023).
- Rethink Priorities, Cross-Cause Cost-Effectiveness Model.
