### Summary

MATS (ML Alignment & Theory Scholars) trains researchers for AI safety in Berkeley and London. Our model of all its work in 2024 comes to **{{result}} years of healthy life per $1,000**. That figure rests on a forecast of how likely an AI catastrophe is, on an estimate of what a typical dollar of AI safety work does to that risk, and on how many scholars MATS brings into the field. All three are deeply uncertain: the plausible range runs from {{low}} to {{high}}.

### What the charity does

Scholars spend ten weeks on a research project with a mentor from an AI lab or safety research group: interpretability, oversight and control, evaluations of dangerous capabilities, governance. Many then continue for four months or longer in an extension phase, mostly in London. In 2024 MATS became its own US charity, MATS Research, Inc. Its 2024 tax return, its first full one, shows $2.2 million of programme spending and $2.9 million in all.

- **The research programme: 54%.** About 153 scholars in 2024: 63 in the winter cohort and about 90 in the summer one, with 23 and 40 mentors.
- **Programmes for alumni: 46%.** The extension phase and alumni events.

MATS doesn't pay the scholars. AI Safety Support, an Australian charity, paid each a $12,000 stipend, and mentors mostly give their time. Those resources are other funders', so they lower MATS's share of the credit rather than adding to its cost.

### How the impact happens

AI carries a yearly chance of catastrophe: the site's shared 3% by 2100 that AI ends humanity's future, and three times that again for a catastrophe the world survives. You can move the 3% with a slider.

A typical dollar of AI safety work cuts that yearly risk by a small share, from Rethink Priorities' cross-cause model (its chance that a project backfires included). Rethink has two kinds of AI project. Work against misuse cuts the misuse part of the risk, which is most of the deaths in catastrophes the world survives. Other work cuts the misalignment part. We count 10% of MATS's research as misuse work: about half of its evaluations stream. The cut counts for the years such progress would otherwise have taken to come, each year discounted.

The deaths averted are valued like every death on the site, across the world's age groups. A catastrophe that ends humanity's future also takes the lives of everyone not yet born, counted through the discount rate.

### How the model works

The model has two branches.

- **Training.** It counts the scholars who go on to work on AI risk because of MATS: 25%. MATS says 75% of its alumni work in AI safety, and many would have got there anyway. Each stays five years, and the work is valued at a typical dollar of AI safety work. MATS gets credit as the training's share among those who paid for it: its own cost against the stipends, mentors' time and donated compute, about 42%. The alumni's employers, who pay for the work itself, count only through the site's setting for work others commit because of a charity, {{row:mobiliser_share}} by default. The scholars' own research during the ten weeks counts here too, at a quarter of a typical work-year's value.
- **Extension research**, valued as typical AI safety research at 0.8 of a typical project, because it is early-career work.

Training gives nearly all of the result, about 98%. Each adjustment is set branch by branch and weighted by the healthy years each branch gives:

| Adjustment | Extension research | Training |
|---|---|---|
| How far a typical project's effect applies | 0.9 × 0.8 (catastrophe share × uptake) | 1 |
| Work no one else would have done now | 0.6 | 0.85 |
| MATS's share of the resources | 0.5 | 0.42 |

Funging by large funders is 1, counted once in the next-dollar figure. The missing-data slider applies to both branches: nothing about MATS's effect on the risk is measured, and its alumni survey has no comparison group.

Side effects: other benefits +5% (organisations alumni founded, smaller AI harms, the community), −7% for speeding up AI (MATS adds researchers to frontier labs, where safety work also helps them build more capable systems) and −1% for published evaluations and attacks.

MATS ended 2024 with about a year of spending in reserve, and its main funder paid for a much larger 2025. The next dollar counts at 31.5% of the past average.

### What drives the result

Most of the result comes from the scholars who go on to work on AI risk because of MATS, and the years they work. Only 10% of MATS's research is aimed at misuse, and stipends paid by AI Safety Support and mentors' time lower its share of the credit.

### Biggest uncertainties

- **How likely an AI catastrophe is.** The slider moves the result many-fold.
- **How much a dollar of misuse work cuts the risk.** Rethink's figure runs ten times either way.
- **The discount rate and the years a cut counts.** Each moves the result several-fold.
- **How many scholars MATS brings into the field.** The alumni data are self-reported, and many scholars were already headed there.

### What isn't modelled

- Smaller AI disasters have no shared forecast; a share is in other benefits.
- Losses beyond deaths are a shared figure set to 0.
- MATS grew fast in 2025; this model is the 2024 year, its latest return.

### How this model was checked

The model was built from the catastrophic-risk template. No audit round found a high-severity problem. The first showed that the scholars' own research during the ten weeks was undervalued by the model's own arithmetic, and corrected several sources: the stipends, the research tracks and the next-dollar quote. The second moved that research out of other benefits into the training branch, where the branch's own adjustments apply. A later round checked the changes. The audit rounds are in audits/mats-charityevals/.

### Sources

- MATS Research, Inc., Form 990 for 2024 (IRS e-file).
- MATS, Winter 2023-24 Retrospective; Alumni Impact Analysis; Apply to MATS 7.0; mentor selection (LessWrong).
- MATS, home page, Summer 2024 programme page and transparency page.
- Karger et al., Forecasting Existential Risks (Forecasting Research Institute, 2023).
- Rethink Priorities, Cross-Cause Cost-Effectiveness Model.
