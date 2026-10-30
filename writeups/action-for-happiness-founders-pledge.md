### Summary

Action for Happiness runs "Exploring What Matters", an eight-week course on wellbeing led by volunteers in their own communities, mostly in the UK. Founders Pledge's 2020 analysis of funding its scale-up, which we rebuilt row by row, comes to **<span data-figure="headline" data-model="action-for-happiness-founders-pledge">0.29</span> years of healthy life per $1,000**.

Founders Pledge's own figure in that sheet is $2,770 per DALY-equivalent of depression averted. It also gives $188 per point of life satisfaction for a year, but that row reads the happiness result (the sheet swaps the two labels); life satisfaction comes to $197. The model reproduces all 16 of its calculated figures. Founders Pledge's 2022 summary page gives a different figure, $137 per point of life satisfaction for a year, from a later estimate with no published model; we reproduce the 2020 sheet.

### What the charity does

Action for Happiness is a UK charity that promotes evidence-based ways to wellbeing. Its main program is a course of eight weekly group sessions, run by trained volunteers. In 2019 it asked for £1 million to grow the course from about 2,000 participants a year to about 10,000.

### How the impact happens

1. Participants learn and practise habits linked to wellbeing.
2. In a controlled study (Krekel, De Neve, Fancourt and Layard), participants' depression scores fell and their life satisfaction rose.
3. The benefit fades: Founders Pledge assumes half of it is left a year later.
4. The scale-up money brings in extra participants each year, compared with the charity's growth without it.

### How the model works

The [model](/action-for-happiness/action-for-happiness-founders-pledge) follows Founders Pledge's sheet. Founders Pledge first shrinks the study's measured effect towards a sceptical prior (a Bayesian update; we copy its results). It values the fall in depression score through the disability weight of severe depression, sums the fading benefit over the years, and counts the extra participants the money brings in, discounting later years for the chance the projection is wrong and the chance another funder would have paid. Dividing the $1.29 million budget by the DALY-equivalents gives the cost per DALY-equivalent.

### What drives the result

- **How long the benefit lasts** (a yearly retention of 30% to 72.5%, Founders Pledge's judgment): from about 0.6 to 1.9 times the central figure.
- **How much of the planned growth happens**, and **how likely another funder would have paid**: Founders Pledge's judgments.
- **The size of the effect after the Bayesian update**, which Founders Pledge's range puts between about half and nearly three times the central value.

The plausible range spans about 200 times, from Founders Pledge's conservative to its optimistic case.

### Where we differ from Founders Pledge

- **Discounting:** Founders Pledge discounts future participants for uncertainty and for other funders, not for time, and counts later years of benefit in full. In our view, both count less at the discount rate under Your values; Founders Pledge's view sets it to 0.
- **Staff pay:** with credit by share of resources on, staff's pay below what they could earn elsewhere counts as part of the cost (our guess: half the cost is staff, paid 15% below market). Off by default. Founders Pledge's discount for the chance another funder would have paid the scale-up is a funging step, so it is dropped when that switch is on. The ongoing cost of running the extra courses, and volunteers' unpaid time, would then belong in the cost too; neither is counted, so the result with the switch on is too high.

### Biggest uncertainties

- The study measured effects shortly after the course; how long they last is a guess.
- Participants volunteer for a wellbeing course, so they may differ from the people a depression treatment reaches; the sheet measures depression in DALY-equivalents of severe depression, spread evenly over the score.
- Founders Pledge's own "comparable to StrongMinds" column ($373 per DALY-equivalent: severity spread over the whole 27-point scale, slower fading and the optimistic effect) shows how much the method choices matter: they explain most of the gap to [its StrongMinds analysis](/strongminds/strongminds-founders-pledge).
- The growth projections were the charity's own, made in 2019, before the pandemic moved courses online.

### What isn't modelled

Effects on people around participants, and anything beyond depression in the bottom line (the life satisfaction and happiness results are shown but don't feed it).

### Sources

- Founders Pledge, [Action for Happiness full report](https://www.founderspledge.com/research/fp-action-for-happiness) (January 2020), [summary page](https://www.founderspledge.com/research/action-for-happiness-summary) (updated November 2022) and [cost-effectiveness spreadsheet](https://docs.google.com/spreadsheets/d/1AVbQ4uV18A8DbFQACCI6vkqWBNYlKWpIIMyZDzKLkcM/edit). No licence published.
- Krekel, De Neve, Fancourt and Layard (2021), [A local community course that raises wellbeing and pro-sociality](https://cep.lse.ac.uk/_NEW/PUBLICATIONS/abstract.asp?index=7579), CEP discussion paper.
