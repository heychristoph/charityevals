### Summary

Clean Air Task Force (CATF) is a US-based research and advocacy group that pushes for rules and technology to cut greenhouse gases and air pollution. Founders Pledge estimated in 2018 that its past work kept a tonne of CO₂-equivalent out of the air for about $1.26. It also credits CATF with about 26,000 US deaths from coal-plant air pollution avoided. On our scale that is **<span data-figure="headline" data-model="clean-air-task-force-founders-pledge">4.2</span> years of healthy life per $1,000**, counting both: the heat deaths the tonnes would cause, which come decades from now and are discounted like any future good, and Founders Pledge's own count of air-pollution deaths, each valued by the age it comes at. The deaths are most of it. Each rule counts for the site's shared number of years a won reform counts (5 by default), and a marginal dollar at half of what CATF's past average dollar achieved (by default, under Your values; see "Where we differ").

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
- **Heat share:** the shared climate rate, "Deaths caused by one more tonne of CO₂", counts the deaths from heat and from the fine particles that come with burning fossil fuels, at the world average. The methane and carbon-capture tonnes don't come with fewer particles. The coal retirements (13% of the tonnes) do, but that smoke is already in Founders Pledge's own count of US deaths below, so the model's row "Air pollution these tonnes cut, relative to an average fossil-fuel tonne" is 0 here, so as not to count it twice.
- **US air-pollution deaths:** Founders Pledge's count, about 26,000 deaths from fine particles, sulphur dioxide and mercury avoided by rules CATF brought forward, goes in per tonne (row "US air-pollution deaths averted per tonne") and the site's climate conversion values each death like every air-pollution death on the site: by the ages air pollution kills at (nine in ten over 50), times the value of a life. They share the tonnes' wait and credit steps.
- **A marginal dollar:** Founders Pledge divides CATF's whole 1996–2017 budget by what that work won, an average; the next dollar does less, counted at the share set under Your values, "How much the next dollar does compared with the average dollar so far" (50% by default, our judgment; 18% to 100%), one slider for every model built on a past average.
- **Staff pay:** with credit by share of resources on, the pay CATF's staff give up counts as part of the cost.

The site then turns these tonnes into years of healthy life through the heat deaths they avoid: 23% of "Deaths caused by one more tonne of CO₂" (0.43 per 10,000 tonnes at the defaults), each valued by the age it comes at like every death on the site, discounted at "Next year's good counts less by" over "Years until the heat deaths from a tonne of CO₂" (60 by default; at 4% a year such a death counts about a tenth of one today).

### What drives the result

- **Founders Pledge's count of US air-pollution deaths** and the value of a life (Your values): most of the result.
- **How much less a marginal dollar does than CATF's past average** (Your values: "How much the next dollar does compared with the average dollar so far"; 50% by default, from 18% to 100%).
- **Deaths caused by one more tonne of CO₂**, a value you set: it moves the tonnes' part.
- **How many years each won rule counts** ("Years a won reform counts", 5 by default, 1 to 20, Your values): Founders Pledge's own were 1.5 years for the coal rules, about 1 and 3 for the methane rules, 1.5 for carbon capture.
- **The share of CATF's impact the three campaigns cover** (70%, between 50% and 90%).

### Where we differ from Founders Pledge

- **Years a won reform counts.** Founders Pledge credits each policy for the years CATF brought it forward (1.5 for the power-plant rules and carbon capture, about 1 and 3 for the methane rules). Our view reads the shared "Years a won reform counts before it would have come anyway" (5 by default, 1 to 20), like every model that credits a won reform (docs/normalization.md 2.9), each year after the first discounted at the shared rate; the deaths and the tonnes both scale with it. Founders Pledge's years stay in the evaluator view.
- **Tonnes become healthy years** through the shared climate rate. Founders Pledge stops at dollars per tonne.
- **Every tonne counts for its heat deaths**, discounted over the decades until they come. Methane and carbon capture don't cut fuel smoke; the coal retirements' smoke is in Founders Pledge's death count, which we add.
- **Future deaths are discounted.** Rethink Priorities counts the heat deaths to 2300 without discounting; like every model on the site, ours discounts future good at the shared rate. At 0% the result would be about 1.3.
- **The wait for the tonnes is discounted.** Founders Pledge counts a tonne the same whenever it is avoided; the tonnes (coal retirements 2010–15, methane rules 2012–25, carbon capture 2020–25) come about 12 years after the average dollar of 1996–2017 spending (8 to 16, our judgment from Founders Pledge's dates). Like every future benefit on the site, the tonnes are discounted for that wait at the shared rate, in both of the site's views, since Founders Pledge takes no view on discounting.
- **US air-pollution deaths are counted.** Founders Pledge credits CATF with about 18,000 deaths avoided from rules on sulphur dioxide, nitrogen oxides and mercury, 26,000 after the same scaling (about $5,650 per death), as a separate result. Until October 2026 the site left them out, since a climate model had one outcome, tonnes, and the headline was a floor (0.12). The climate conversion now takes deaths an evaluator counts itself, per tonne, beside the tonnes' own deaths (docs/normalization.md 2.5): they don't move with "Deaths caused by one more tonne of CO₂", which is about tonnes, but do with the value of a life. Each is valued by the age it comes at (GiveWell's moral weights by age over GBD's ages of air-pollution deaths, 24 healthy years on average, not the 36.6 of GiveWell's all-ages adult value).
- **Deaths valued by age.** Heat deaths too: about 30 healthy years each over GBD's ages of heat deaths, not 36.6.
- **A marginal dollar, not the past average.** Founders Pledge's figure is CATF's 1996–2017 budget over the wins it brought forward. The next dollar does less than that average; our view counts it at the share set under Your values, "How much the next dollar does compared with the average dollar so far" (50% by default, our judgment; 18% to 100%), one slider for every model on the site built on a past average (The Life You Can Save's leverage ratio, the other retrospective climate models). The evaluator view keeps 100%.
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
