### Summary

Clean Air Task Force (CATF) is a US-based research and advocacy group that pushes for rules and technology to cut greenhouse gases and air pollution. Founders Pledge estimated in 2018 that its past work kept a tonne of CO₂-equivalent out of the air for about $1.26. On our scale that is **<span data-figure="headline" data-model="clean-air-task-force-founders-pledge">0.19</span> years of healthy life per $1,000**, counting the heat deaths those tonnes would cause, which come decades from now and are discounted like any future good, and the air pollution the coal retirements among them cut. Founders Pledge also credits CATF with US air-pollution deaths avoided, which this figure leaves out; counted at the site's value of an adult's death they would add about 6.5 (see "Where we differ").

The model reproduces all 22 of Founders Pledge's calculated figures in its spreadsheet.

### What the charity does

CATF works on power-plant pollution rules, methane leaks from oil and gas, carbon capture, advanced nuclear and other low-carbon power. It doesn't run projects that cut emissions directly: it does research, lobbies and litigates for regulation and subsidies, so its impact is the share of policy changes Founders Pledge credits to it.

### How the impact happens

Founders Pledge looks back at three of CATF's campaigns and asks how many years earlier each policy came because of CATF:

1. **Coal plants closed (2010–15):** regulations CATF supported retired about 4 GW of coal capacity a year; if CATF brought them forward by 1.5 years, and gas replaced the coal, about 10 million tonnes were avoided.
2. **Methane rules for oil and gas (2012 and 2016):** CATF is credited with bringing the EPA's rules forward by about one and three years: about 41 million tonnes.
3. **Carbon capture tax credit:** CATF's research and advocacy is credited with bringing the credit forward by 1.5 years: about 30 million tonnes.

It then divides CATF's whole budget since 1996 ($147 million) by these tonnes, scaled up because the three campaigns are taken to be 70% of CATF's impact.

### How the model works

Founders Pledge's rows come first, as in its spreadsheet, ending at its bottom line in dollars per tonne. Our steps follow, each in its own section:

- **Tonnes per dollar:** one over Founders Pledge's cost per tonne, discounted for the years until the tonnes are avoided.
- **Heat share:** the shared climate rate, "Deaths caused by one more tonne of CO₂", counts the deaths from heat and from the fine particles that come with burning fossil fuels, at the world average. The methane and carbon-capture tonnes don't come with fewer particles. The coal retirements do: they are 13% of Founders Pledge's tonnes, and per net tonne of US coal power switched to gas they cut about 0.13 (0.09–0.24) of the world-average smoke (CATF's Toll from Coal, 7.1 deaths per TWh in 2010, less a gas plant's, about a ninth of coal's per Markandya and Wilkinson 2007, over 0.33 million net tonnes per TWh). So the model's row "Air pollution these tonnes cut, relative to an average fossil-fuel tonne" is 13% × 0.13 = 0.017.
- **Staff pay:** with credit by share of resources on, the pay CATF's staff give up counts as part of the cost.

The site then turns these tonnes into years of healthy life through the heat deaths they avoid: 23% of "Deaths caused by one more tonne of CO₂" (0.43 per 10,000 tonnes at the defaults), each valued like any adult's death, discounted at "Next year's good counts less by" over "Years until the heat deaths from a tonne of CO₂" (60 by default; at 4% a year such a death counts about a tenth of one today).

### What drives the result

- **Deaths caused by one more tonne of CO₂**, a value you set: the result moves in proportion to it.
- **How many years earlier each policy came because of CATF** (1.5 years for the coal rules, about 1 and 3 for the methane rules, 1.5 for carbon capture): Founders Pledge's judgments, with its own pessimistic and optimistic cases.
- **The share of CATF's impact the three campaigns cover** (70%, between 50% and 90%).

### Where we differ from Founders Pledge

- **Tonnes become healthy years** through the shared climate rate. Founders Pledge stops at dollars per tonne.
- **Every tonne counts for its heat deaths**, discounted over the decades until they come, and **the coal tonnes for their own smoke**, from US evidence rather than the world average: about 1.6 times what heat alone gives (0.12 before October 2026). Methane and carbon capture don't cut fuel smoke. The coal retirements overlap a little with the mercury rule's US deaths below.
- **Future deaths are discounted.** Rethink Priorities counts the heat deaths to 2300 without discounting; like every model on the site, ours discounts future good at the shared rate. At 0% the result would be about 1.3.
- **The wait for the tonnes is discounted.** Founders Pledge counts a tonne the same whenever it is avoided; the tonnes (coal retirements 2010–15, methane rules 2012–25, carbon capture 2020–25) come about 12 years after the average dollar of 1996–2017 spending (8 to 16, our judgment from Founders Pledge's dates). Like every future benefit on the site, the tonnes are discounted for that wait at the shared rate, in both of the site's views, since Founders Pledge takes no view on discounting.
- **US air-pollution deaths are left out.** Founders Pledge also credits CATF with about 18,000 deaths avoided from earlier rules on sulphur dioxide, nitrogen oxides and mercury (about $5,650 per death, after the same scaling), as a separate result. The site's model has one unit, tonnes, and turning deaths into tonnes would need the climate rate inside the model, which our rules don't allow. Counted with GiveWell's value of an adult's death (0.18 deaths per $1,000, 36.6 healthy years each) they would add about 6.5 years of healthy life per $1,000 (they happened within a few years of the rules), for about 6.6 in all, so treat the headline as a floor for CATF's past work.
- **Staff pay:** with credit by share of resources, CATF's staff's forgone pay (our judgment for policy work: 60% of cost is staff, paid 30% below market) counts as an in-kind contribution.

### Biggest uncertainties

- The years-brought-forward figures are Founders Pledge's subjective judgments and multiply straight into the result.
- The model looks back at 1996–2017. What a donation buys now depends on CATF's current work, which Founders Pledge estimated separately in 2018 for an advanced-nuclear project (about $0.29 a tonne, very uncertain) and no longer updates in this form.
- The shared climate rate is itself uncertain several times over, and counts only deaths; harvests, income and tail risks are left out.
- Methane forms ozone, which also kills. By the UN Environment Programme's Global Methane Assessment (2021), cutting methane avoids about 1,400 deaths a year per million tonnes, roughly 40% of the air-pollution deaths the heat share drops for these tonnes. Against that, a tonne of CO₂-equivalent of methane, a short-lived gas, causes fewer heat deaths over the long run than a tonne of CO₂. The net is uncertain, perhaps ±30% on the methane half of the tonnes; we haven't added a methane figure yet.

### What isn't modelled

CATF's other work (advanced nuclear, international methane policy, recent US legislation) beyond Founders Pledge's scale-up for "other impact", and Founders Pledge's newer qualitative assessments of CATF, which don't publish a cost per tonne.

### Sources

- Founders Pledge, [Climate Change cause area report](https://www.founderspledge.com/research/fp-climate-change) (2018) and its [CATF cost-effectiveness spreadsheet](https://docs.google.com/spreadsheets/d/1q6srpmt5VkdXLGfYzqHqkU3hvGUwPKjA67uxqYI0Upw/edit). © Founders Pledge; no licence published.
- Founders Pledge, [Clean Air Task Force](https://www.founderspledge.com/research/clean-air-task-force) recommendation page.
- Clare and Vargas (2026), [Cross-cause cost-effectiveness: climate change versus global health and development interventions](https://rethinkpriorities.org/research-area/climate-change-versus-ghd-interventions/), Rethink Priorities: the deaths per tonne behind the shared climate rate.
