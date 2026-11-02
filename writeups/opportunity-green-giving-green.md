### Summary

Opportunity Green is a UK nonprofit that uses law, policy and economics to cut emissions from aviation and shipping. Giving Green estimates that its work at the International Maritime Organization (IMO), helping climate-vulnerable countries take part in negotiations and backing their case at the law of the sea tribunal, keeps a tonne of CO₂-equivalent out of the air for about 76 cents. On our scale that is **<span data-figure="headline" data-model="opportunity-green-giving-green">3.5</span> years of healthy life per $1,000**: these tonnes come from ships burning cleaner fuel or less of it, so they avoid deaths from ship smoke straight away as well as heat deaths decades from now. How much smoke goes with each tonne is our judgment over a wide range, and it sets most of the result (see below).

The model reproduces all 8 of Giving Green's calculated figures in its spreadsheet.

### What the charity does

Opportunity Green supports delegates from small island and other climate-vulnerable states at the IMO, brings legal cases and complaints against greenwashing (the cruise industry's claims for liquefied gas, for example), works on EU and UK rules for aviation and shipping fuels, and on cutting the warming from aircraft contrails.

### How the impact happens

Giving Green's chain:

1. In 2023 the IMO set a goal of net-zero shipping by 2050 with interim targets; the regulations to meet them were then being negotiated.
2. Cumulative shipping emissions from 2025 to 2050 if strong regulations pass: about 17.3 billion tonnes (between the IMO's minimum and "striving" targets).
3. Without them, weaker rules catch up within about 5 years; the difference is 1.3% of emissions, about 223 million tonnes.
4. More participation by climate-vulnerable countries raises the chance of strong rules by 3%, and Opportunity Green is credited with 10% of that; its submission to the tribunal adds a much smaller term.
5. The $577,000 Opportunity Green spent on this work divided by its expected 760,000 tonnes.

### How the model works

Giving Green's rows come first, ending at its bottom line in dollars per tonne, followed by its comparisons with an offset price and with its $1-a-tonne benchmark. Giving Green's fuel-standards tab, which turns emissions-intensity paths into the 1.3%, is taken as a figure with its cell cited. Our steps follow:

- **Tonnes per dollar:** one over the cost per tonne, discounted for the years until the tonnes are avoided.
- **Tonnes from burning less fuel:** the shared climate rate, "Deaths caused by one more tonne of CO₂", counts deaths from heat and from the fine particles that come with burning fossil fuels, at the world average. Ship smoke per tonne of CO₂ is about that average: 2.1 times it by Sofiev et al. (2018: about 266,000 deaths a year after the 2020 sulphur limit, from about 870 million tonnes of CO₂), 0.42 times it by Zhang et al. (2021: about 94,000 deaths in 2015, less about 30,000 the sulphur limit avoids, from about a billion tonnes); the model takes 0.94, their middle on a log scale. The IMO's standard lowers the greenhouse-gas intensity of ship fuel more than how much is burned, so only part of that smoke goes with each tonne: fuel burned less cuts all of it; ammonia, methanol and biofuels cut the sulphur and particles but not the NOx, which Zhang et al. find drives about half of ship smoke deaths after 2020; liquefied gas cuts most smoke while cutting well-to-wake emissions only 15–20%; and part of each tonne is upstream fuel supply. Our judgment is half (0.2–1). So the model's row "Air pollution these tonnes cut, relative to an average fossil-fuel tonne" is 0.5 × 0.94 = 0.47.
- **Staff pay:** with credit by share of resources on, staff's forgone pay counts as part of the cost.

The site turns these tonnes into years of healthy life through the deaths they avoid: the air-pollution part of "Deaths caused by one more tonne of CO₂" at once, and its heat part (23%) discounted at "Next year's good counts less by" over "Years until the heat deaths from a tonne of CO₂".

### What drives the result

- **Change in the chance of strong regulations from more participation** (3%; 1% to 10%) and **Opportunity Green's share of that** (10%; 3% to 30%), Giving Green's guesses.
- **How quickly weaker rules catch up** (5 years; 10 in Giving Green's high-impact case), which sets the 1.3%.
- **How much smoke goes with each tonne**: our judgment, 0.2 to 1 of ship smoke, and ship smoke per tonne itself spans 0.42 to 2.1 of the world average; together they move the result from under 1 to about 15.
- **Deaths caused by one more tonne of CO₂**, a value you set, and the result moves in proportion.

### Where we differ from Giving Green

- **Deaths valued by age.** Each death a tonne avoids is valued at GiveWell's moral weight for the age it comes at, over the ages of today's heat and air-pollution deaths (GBD 2023: most are of people over 50), about 30 and 24 healthy years, where the site used GiveWell's all-ages adult value (36.6) until late October 2026: the same rule as every death on the site.
- **A marginal dollar, not the past average.** Giving Green's figure is Opportunity Green's past IMO and ITLOS spending over its expected effect: an average. The next dollar does less; our view counts it at the share set under Your values, "How much the next dollar does compared with the average dollar so far" (50% by default, our judgment; 18% to 100%), one slider for every model on the site built on a past average (The Life You Can Save's leverage ratio, the other retrospective climate models). The evaluator view keeps 100%.
- **Tonnes become healthy years** through the shared climate rate. Giving Green stops at dollars per tonne.
- **Shipping tonnes count their own air pollution**: about 0.47 of an average fossil-fuel tonne's, a sourced share and per-fuel figure that replace the earlier choice between the full world average (7.3) and heat only (0.2), which rested on an unsourced 40% guess. Every climate model now sets this row from its own evidence.
- **Future heat deaths are discounted.** Like every model on the site, ours discounts future good at the shared rate.
- **The wait for the tonnes is discounted.** Giving Green counts a tonne the same whenever it is avoided; the gap between ambitious and business-as-usual shipping rules runs from 2025 until the latter catch up, about 4 years after the 2023–25 spending (2 to 8, our judgment from Giving Green's dates). Like every future benefit on the site, the tonnes are discounted for that wait at the shared rate, in both of the site's views, since Giving Green takes no view on discounting.
- **Staff pay:** with credit by share of resources, staff's forgone pay (our judgment for policy work) counts as an in-kind contribution.

### Biggest uncertainties

- Giving Green says some elements of this 2024 analysis are outdated after the 2025 setbacks in IMO negotiations, when adoption of the net-zero framework was postponed, and plans to update it. If strong rules are delayed further, the result falls.
- The chances and shares are Giving Green's guesses, and it has low confidence in the estimate; its range runs from $0.03 to $7.70 a tonne.
- How much ship smoke goes with these tonnes: a judgment from Zhang et al.'s NOx split, not a measurement of the IMO measure's fuel mix; at no smoke at all the result would be about 0.2. Ammonia brings its own NOx, nitrous oxide and ammonia slip, liquefied gas leaks methane, and moving off sulphur-bearing fuel removes aerosols that cool the planet; none of these is counted.

### What isn't modelled

Opportunity Green's aviation work (fuel rules, contrails), its legal work against greenwashing, and its EU and UK policy work; Giving Green models only the IMO work.

### Sources

- Giving Green, [Opportunity Green: Top Climate Nonprofit Evaluation](https://www.givinggreen.earth/research/opportunity-green-top-climate-nonprofit-evaluation-2026) (2026; first [published 2024](https://www.givinggreen.earth/research/opportunity-green-top-climate-nonprofit-evaluation)) and its [Opportunity Green cost-effectiveness spreadsheet](https://docs.google.com/spreadsheets/d/152za3tW6tPWXhtl0uDtCDCpICiiQJ-og58sIRkGLeHQ/edit). © Giving Green Research Group; all rights reserved.
- Sofiev et al. (2018), [Cleaner fuels for ships provide public health benefits with climate tradeoffs](https://www.nature.com/articles/s41467-017-02774-9), Nature Communications: deaths from ship smoke.
- Zhang et al. (2021), [Mortality reduction relative to implementing new shipping emissions policy](https://doi.org/10.1088/1748-9326/ac146b), Environmental Research Letters: ship smoke deaths before and after the sulphur limit, and how much of them NOx drives.
- Clare and Vargas (2026), [Cross-cause cost-effectiveness: climate change versus global health and development interventions](https://rethinkpriorities.org/research-area/climate-change-versus-ghd-interventions/), Rethink Priorities: the deaths per tonne behind the shared climate rate.
