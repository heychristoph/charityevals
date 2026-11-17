### Summary

CEPI funds vaccines against epidemics and pandemics, aiming to have a vaccine ready within 100 days of a new threat. Our model of all its work in 2025 comes to **{{result}} years of healthy life per $1,000**. The figure rests on forecasts of how likely catastrophic pandemics are, on what a typical dollar of pandemic work does to that risk, and on how much less a dollar does at CEPI's size. All three are deeply uncertain, so the plausible range runs from {{low}} to {{high}}.

### What the charity does

CEPI was launched in 2017 by Norway, India, the Gates Foundation, Wellcome and the World Economic Forum. It is a Norwegian non-profit association with offices in Oslo, London and Washington, DC. It spent $449 million in 2025 (audited accounts), mostly as grants to vaccine developers and manufacturers:

- **Priority pathogens** ($197M). Coronaviruses ($74M: MERS, vaccines against many coronaviruses at once, COVID-19), mpox ($41M), Lassa fever ($37M), Nipah ($14M), Rift Valley fever ($12M), Ebola-type viruses ($10M) and chikungunya ($9M). CEPI funded the first licensed chikungunya vaccine and the first Lassa, MERS and Nipah vaccines to reach phase 2 trials.
- **Disease X** ($61M). Vaccine platforms that can be adapted quickly to a new virus, and vaccine libraries for whole viral families.
- **Manufacturing** ($58M). A network of vaccine makers in Africa, Asia and Latin America that can fill and finish doses during an outbreak.
- **Enablers** ($37M). Lab and animal-model networks, tests, trial readiness and faster regulatory approval.
- **Global South partnerships** ($11M) and **biosecurity** ($1M).
- **Programme support** ($63M). CEPI's own staff running the programmes.

About 86% of its money comes from governments. The rest comes from the Gates Foundation, Wellcome and smaller private donors, some giving through donor-advised funds such as Fidelity Charitable.

### How the impact happens

Pandemics carry a yearly chance of catastrophe, spread evenly to 2100. The figures come from the experts in a forecasting tournament: about 1% that a pandemic ends humanity's future, and about 4% that one kills more than a tenth of people. A pandemic as deadly as COVID-19 is also counted, at a 2% chance each year.

A typical pandemic project cuts those risks by a share per dollar, taken from Rethink Priorities' cross-cause model, its chance of backfiring included. Each cut counts for the years such progress would otherwise have taken to come (5 by default), and each year is discounted. Deaths are valued like every death on the site. Deaths in a COVID-scale pandemic are valued at COVID's ages, mostly older people. The future lost counts only through the discount rate.

CEPI's vaccines against Lassa, mpox, chikungunya and the other priority pathogens would also be used against today's outbreaks, which kill thousands of people a year. That is counted too: a Lassa vaccine campaign would save about 330 lives a year (a CEPI-funded study), smaller shares of the deaths from mpox, Ebola-type viruses, Nipah and Rift Valley fever would be averted, and so would some of chikungunya's long-term illness. Each is weighted by the chance the vaccines are licensed and used (higher for the mpox and chikungunya vaccines, which already are) and by this year's share of what CEPI puts into them.

### How the model works

All of CEPI's spending is pandemic work. The model's AI, nuclear, policy-win and training branches are zero.

| Adjustment | Value | Reason |
|---|---|---|
| CEPI's outputs against a typical project | 1 | Concrete and used: licensed vaccines, phase 2 trials, an outbreak technology transfer |
| A typical project's rate at CEPI's size | 0.07 | Worked out from the 100 Days Mission (below) |
| Work no one else would have done now | 0.7 | CEPI is nearly the only funder for Lassa or Nipah; others also fund coronavirus, mpox and platform vaccines |
| CEPI's share of the resources behind its work | 0.75 | Its awardees, mostly companies, add their own money and staff |
| Outbreak vaccines: trust in the modelled impact | 0.8 | One modelling study for Lassa, judgment for the rest |
| Outbreak vaccines: CEPI's share of their funding | 0.55 | Vaccine makers, the EU and the US paid for the chikungunya and mpox vaccines too |
| Funging | 1 | Counted once, in the next-dollar figure |
| Missing data | slider | Nothing about CEPI's effect on the risk is measured |

The size step matters most. Rethink's typical projects cost $0.5–30 million; CEPI spends $449 million a year. At a typical project's rate, one year of CEPI's spending would remove about a tenth of a catastrophic pandemic's yearly risk. So we measure a dollar at CEPI's size by the 100 Days Mission instead. A study by Imperial College for CEPI finds that vaccines within 100 days would have saved 8.3 million of COVID-19's 15 million deaths. We put the chance the mission is achieved before the next pandemic at 30%, and funders' spending on it at about $1 billion a year for ten years (CEPI plans $720 million a year for 2027–2031). That cuts a pandemic's deaths by about 17%, where the typical rate implies about 240%. So a dollar at CEPI's size counts about 7% of a typical project's dollar. The vaccine developers' own money is left out here, because CEPI's share of the resources counts it.

Side effects: other benefits add 5%, because the manufacturing and regulatory networks also serve routine vaccines. Information hazards subtract 1%: vaccine libraries and AI-aided vaccine design add knowledge about dangerous viruses, which CEPI's biosecurity policy limits.

CEPI is asking for $2.5 billion more for its 2027–2031 strategy, and aid budgets fell in 2025. But its income ran well above its spending in 2024 and 2025, and it held $1.1 billion at the end of 2025, most of it already promised to vaccine developers. The next dollar counts at {{row:marginal_vs_past_average}} of the past average.

### What drives the result

Those charities spend $3–14 million a year, so the typical-project rate applies to them. CEPI spends 30 to 150 times as much, and our size step puts it below them. Before that step it would be around 2.4. Deaths of people alive now are about 90% of the value and the future lost about 10%. The outbreak vaccines add under 1%.

### Biggest uncertainties

- **The discount rate.** At 0.1% the result is about 2.5; at 8% it is about 0.13.
- **The years a cut counts.** At one year the result is 0.037; at twenty it is 0.51.
- **How much a typical dollar cuts the risk.** Rethink's figures run ten times either way. The size step replaces their level with the mission's estimate but keeps the ratio of the extinction cut to the catastrophe cut, which moves the result from 0.086 to 0.98.
- **Whether the 100 Days Mission is achieved.** At a 10% chance the result is 0.056; at 60% it is 0.33. The mission's cost moves it from 0.084 to 0.33.
- **How much the next dollar does.** From 22.5% to 89% of the past average, the result moves from 0.077 to 0.30.

### What isn't modelled

- Survivors' lost income and health in a pandemic, a shared figure set to 0.
- Deaths from chikungunya, which are few; only its illness is counted.
- CEPI's role in COVAX during COVID-19, which ended in 2023, and its 2026 work.
- The forecasts are spread evenly over the century.

### How this model was checked

The model was built from the catastrophic-risk template. Round 1 of the independent audit found one high, two medium and three low problems. The size step had been a typed 0.08; it is now worked out from the 100 Days Mission's figures, which lowered it to about 0.07. The next-dollar figure now weighs CEPI's surpluses in 2024 and 2025 and fell from 56% to 49%. Together these took the result from 0.69 to 0.52. Round 2 passed with four low findings: the mpox range, a shorter wait for vaccines already licensed, the other funders' share of the mission, and shorter text. All were fixed, and two verification rounds checked them. Independent audits are in audits/cepi-charityevals/.

### Sources

- CEPI, Board of Directors' Annual Report and Financial Statements 2025 (audited), and its 2025 Annual Progress Report.
- CEPI, The 100 Days Mission, and its Lassa fever and Investors pages.
- Smith et al., Health and economic impacts of Lassa vaccination campaigns in West Africa (Nature Medicine, 2024).
- de Roo et al., The global health and economic burden of chikungunya from 2011 to 2020 (BMJ Global Health, 2024).
- WHO, Multi-country outbreak of mpox, external situation report 67 (June 2026).
- Karger et al., Forecasting Existential Risk (Forecasting Research Institute, 2023).
- Rethink Priorities, Cross-Cause Cost-Effectiveness Model.
