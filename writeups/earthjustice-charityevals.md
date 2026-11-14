### Summary

Earthjustice is the largest US non-profit environmental law firm. It represents community, health and environmental groups and tribes for free, in court, before federal agencies and before state utility commissions. We model its three focus areas separately, each against what it spent on that area over its fiscal years 2022 to 2025:

- **Climate and clean energy:** **<span data-figure="headline" data-model="earthjustice-charityevals">0.0024</span> years of healthy life per $1,000**, about $180 a tonne of CO₂e averted.
- **Healthy communities:** **<span data-figure="headline" data-model="earthjustice-charityevals-health">0.0084</span> years of healthy life per $1,000**, from cleaner air and drinking water.
- **Biodiversity:** **<span data-figure="headline" data-model="earthjustice-charityevals-biodiversity">0.0000007</span> years of healthy life per $1,000**, from the Tongass forest's carbon.

All three are low for the same reasons. Earthjustice is one of many groups behind each rule. Advocacy is only one cause of a rule. And the federal rules it won are now being weakened or repealed.

### What the charity does

In the year to June 2025 Earthjustice spent $183.7 million (audited accounts). That includes $16.8 million of donated legal work and advertising space, which we count as other people's resources, not its spending. Of the $166.9 million it spent itself, $137.4 million went on programmes.

The accounts split programmes into litigation and public information only. Public information publicises the same cases. The accounts name three focus areas but give no spending for each, so the split is our judgment, shared by the three models:

- **Climate and clean energy: 45%.** Federal climate rules, coal and gas plants before state utility commissions, fossil-fuel leasing, and coal and gas cases abroad.
- **Healthy communities: 25%.** National air standards, chemical plants and refineries, drinking water, pesticides and coal ash.
- **Biodiversity: 30%.** Endangered species, public lands and forests, and oceans.

### How the impact happens

Earthjustice sues agencies to make them act, defends their rules against industry and states, and argues before state utility commissions. A rule or ruling it helps win cuts pollution once it takes effect. The models count the wins of the period that can be put on the site's scale:

- **EPA's 2023 oil and gas methane rule and its 2024 power-plant carbon standards.** We use the same tonnes, status and steps as our model of Clean Air Task Force, which worked on the same rules. Earthjustice is credited with 8% and 10% of the advocacy behind them; Clean Air Task Force with 10% each.
- **US coal plants that closed in 2022 to 2025: 28.9 GW (EIA).** Most closed for economic reasons. Advocacy is credited with 15% of the closings and Earthjustice with a tenth of that advocacy. Sierra Club's Beyond Coal campaign leads that field.
- **EPA's 2024 fine-particle (PM2.5) air standard.** EPA's two estimates for 2032 are 2,100 and 4,500 deaths a year avoided; we take 3,000. Earthjustice's clients pressed for it and defended it in court, where it was upheld in June 2026. Earthjustice is credited with 25% of the advocacy.
- **EPA's 2024 PFAS drinking-water standards.** EPA estimates 9,600 deaths prevented over its 82-year analysis. Earthjustice represents community groups defending the standards and is credited with 15%.
- **The Tongass National Forest's roadless protection, restored in January 2023 on 9.37 million acres.** Earthjustice represented the tribes and groups that sued over the 2020 exemption. It is counted for the old-growth carbon that logging would have released.

### How the model works

For each win: the tonnes or deaths a year once it takes effect, × the share of a won policy due to advocacy (the site's shared 30%) × the shared 5 years a won reform counts, discounted after the wait until it takes effect. That is then multiplied by the share that wouldn't have happened anyway, Earthjustice's share of all the groups' work, and the share actually delivered.

The wins are added up and spread over the four years. Then come the shared evidence and missing-data steps, and a share for other wins of the period too small to model one by one (+50% for climate and health, +20% for biodiversity). The total is divided by a typical year's spending on that area.

Deaths are valued by age, like every death on the site: PM2.5 and PFAS heart deaths at the ages of US heart deaths, PFAS kidney-cancer deaths at the ages of US cancer deaths (infants for the birth-weight deaths). Illness averted comes from the site’s shared figures for each kind of death. Tonnes go through the site's climate conversion. The methane rule's tonnes count for methane's own, earlier warming and the ozone it forms. The coal tonnes also count the air pollution of US coal plants.

The next dollar is valued at 35% of the period's average. Earthjustice holds about four months of spending in liquid assets plus a $201 million board-designated fund, and more of its next dollar goes to defending rules in less favourable courts.

### What drives the result

In the climate model, the methane rule and the coal closings each give about half the value; the power-plant standards, mostly repealed, give little. In the health model, the PM2.5 standard gives nearly all of it. The shared value judgments move all three models most: the years a won reform counts, the discount rate and the missing-data step. Then come the share of a policy due to advocacy and Earthjustice's own shares.

The biodiversity model is far below other conservation models. The Forest Service expected the 2020 exemption to change overall logging little, so the restored protection spares about a hundred hectares a year. Much of that timber is cut elsewhere instead, and the protection is under threat again.

### Biggest uncertainties

- **Earthjustice's share of each win.** It is one of many groups, and every share is our judgment.
- **Whether the rules survive.** EPA has delayed the methane rule, repealed most of the power-plant standards, asked the court to vacate the PM2.5 standard and proposed cutting back the PFAS standards. The national Roadless Rule is being rescinded.
- **The coal closings.** How much of them advocacy caused, and how much the closed plants ran, are both judgments.
- **The Tongass logging.** The Forest Service expected overall harvest to change little; how much moves into roadless old growth is a wide judgment.

### What isn't modelled

Wins before July 2021 aren't counted, and neither is their cost. Smaller wins of the period count only through the share for other wins. These include vehicle standards, gas plants blocked, building electrification and efficiency programmes, offshore lease sales, chemical-plant and coal-ash rules, community enforcement. Gray wolves and other species count nothing: their welfare effect is unknown.

Compliance costs to industry and water systems aren't counted, as in the site's other policy models. For the PFAS standards EPA puts them near the benefits' dollar value. Species and wild animals count only where a welfare effect is known: we don't know whether more wild animals alive is good or bad for them, so they count nothing.

### How this model was checked

Independent audits are in audits/earthjustice-charityevals/, audits/earthjustice-charityevals-health/ and audits/earthjustice-charityevals-biodiversity/. Round 1 passed the climate model and asked for fixes to the other two. Health: illness now comes from the site's shared figures, each rule has its own wait, US-like ages value the deaths and infant deaths count as infants (−15%). Biodiversity: the logging spared was re-anchored on the Forest Service's own expectation that overall harvest would change little, and leakage on a timber-market study (÷8). Climate: the methane rule's local smog deaths moved into the conversion, and coal closings wait 3 years (−4%). Round 2 verified the changes; all three pass. Later, the PM2.5 standard's figures became shared with our Environmental Defense Fund model and deaths over 70 took GiveWell's five-year weights; a full round 3 audit and a round 4 check passed the health model (−45%).

### Sources

- Earthjustice, audited financial statements for the years to June 2025, 2024, 2023 and 2022; Annual Report, fiscal year 2025.
- US EPA: the methane rule (2023), the power-plant standards (2024), the PM NAAQS overview (2024) and the PFAS drinking-water costs and benefits (2024); GAO-25-107897; Harvard's Environmental and Energy Law Program regulatory tracker.
- US EIA, Today in Energy (coal retirements 2022-2025) and CO₂ per kWh by fuel.
- KTOO (2023), the Tongass Roadless Rule restored; Congressional Research Service R46505 (2020); Wear & Murray (2004), timber leakage; Leighty et al. (2006), Tongass carbon.
