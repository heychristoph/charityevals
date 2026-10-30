### Summary

Industrious Labs campaigns to cut emissions from heavy industry in North America (aluminium, steel, cement and landfills), mostly by pressing companies to commit to cleaner production and purchasing. Giving Green estimated in 2022 that its aluminium campaign averts a tonne of CO₂e for about 52 cents; on our scale that is **<span data-figure="headline" data-model="industrious-labs-giving-green">1.1</span> years of healthy life per $1,000**.

Giving Green doesn't publish the spreadsheet behind this estimate, and the web page says only "highly cost-effective". The figures are in its downloadable deep dive; the model is built from them, each quoted on its row, and reproduces Giving Green's $0.52.

### What the charity does

Industrious Labs runs campaigns aimed at the makers and buyers of heavy-industry materials, and at the rules they work under: low-carbon aluminium and steel for car makers, cleaner cement, landfill methane and industrial heat. It is a fiscally sponsored project of the Tides Foundation, a US nonprofit. Giving Green lists it as a top climate nonprofit.

### How the impact happens

Giving Green modelled one campaign, to get a major automaker to commit to low-carbon aluminium for its US production, for a cost of about $2 million. It guessed how much Industrious Labs raises the chance of each commitment and how many years sooner it comes, assuming low-carbon aluminium cuts emissions by about 80%:

1. **The automaker's own operations** alone: $3 a tonne.
2. **Plus the rest of the car industry following:** $1.50 a tonne.
3. **Plus a small effect on half the global aluminium industry** (a 0.1 percentage point higher chance, 10 years sooner): $0.52 a tonne, Giving Green's best guess, with a range of $0.03 to $12.30.

The model turns these into tonnes for each step: about two thirds of the best guess comes from the third.

### How the model works

Giving Green's figures come first, ending at its cost per tonne. Our steps follow:

- **Tonnes per dollar:** one over the cost per tonne.
- **Air pollution:** most of primary aluminium's emissions come from the electricity smelters use (about 62%). The first two steps cut emissions at North American smelters, where coal and gas plants cause little smoke per tonne (about 0.06 of the world fossil-fuel average); the third, two thirds of the tonnes, is mostly Chinese coal power: China's power-plant coal caused about 86,500 deaths in 2013 (GBD MAPS 2016) over roughly 4,000 TWh, about 0.17 of the average per tonne (0.1 to 0.35). Weighted by tonnes, the model's row "Air pollution these tonnes cut, relative to an average fossil-fuel tonne" is about 0.08.
- **Staff pay:** with credit by share of resources on, staff's forgone pay counts as part of the cost.

The site turns these tonnes into years of healthy life through the deaths they avoid: the heat deaths of every tonne, discounted over the decades until they come, and the air-pollution deaths at once.

### What drives the result

- **The effect on the wider aluminium industry**, a guess Giving Green itself says "should not be taken literally"; without it the cost is $1.50 a tonne.
- **Deaths caused by one more tonne of CO₂**, a value you set.
- **The coal smoke per tonne** at the smelters that switch, especially in China.

### Where we differ from Giving Green

- **Tonnes become healthy years** through the shared climate rate; Giving Green stops at dollars per tonne.
- **Air pollution:** the share of these tonnes that is coal power not burned also counts for its smoke.
- **Future deaths are discounted.** Like every model on the site, ours discounts future good at the shared rate.
- **Staff pay:** with credit by share of resources, staff's forgone pay counts as an in-kind contribution.

### Biggest uncertainties

Giving Green has "low confidence" in this analysis, made in 2022 and not updated in 2024. It covers one campaign, which Giving Green says is likely not generalisable to Industrious Labs as a whole.

### What isn't modelled

Industrious Labs' steel, cement, landfill and industrial heat campaigns, and its work building a movement of people living near heavy industry.

### Sources

- Giving Green, [Industrious Labs: Top Climate Nonprofit Evaluation](https://www.givinggreen.earth/research/industrious-labs-top-climate-nonprofit-evaluation) and its [deep dive](https://cdn.prod.website-files.com/686d65ad3e40d1dc7eb801b4/68ae6c9a9a0b7aff042cd2b0_311d34_6ea44d810f19495f9038c821c64faa09.pdf) (updated November 2024; the cost-effectiveness analysis is from 2022). © Giving Green Research Group; all rights reserved.
- GBD MAPS Working Group (2016), [Burden of disease attributable to coal-burning and other major sources of air pollution in China](https://www.healtheffects.org/system/files/GBDMAPS-ReportEnglishFinal1.pdf), HEI Special Report 20 (deaths from China's power-plant coal).
- ING Think, [Greening aluminium](https://think.ing.com/downloads/pdf/bundle/greening-aluminium-its-less-than-shiny-net-zero-reputation) (electricity's share of aluminium emissions); Markandya and Wilkinson (2007), [Electricity generation and health](https://doi.org/10.1016/S0140-6736(07)61253-7) (coal power's deaths per TWh).
- Clare and Vargas (2026), [Cross-cause cost-effectiveness: climate change versus global health and development interventions](https://rethinkpriorities.org/research-area/climate-change-versus-ghd-interventions/), Rethink Priorities: the deaths per tonne behind the shared climate rate.
