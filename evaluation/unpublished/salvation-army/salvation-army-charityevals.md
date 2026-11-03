### Summary

The Salvation Army is a church that runs the largest network of social services in the United States: food, shelter, housing placements, help with bills, holiday gifts, disaster relief, residential addiction recovery and community centres. Our model of all of it, for fiscal 2025, comes to **<span data-figure="headline" data-model="salvation-army-charityevals">0.03</span> years of healthy life per $1,000**.

That is far below the global-health charities on the site, and the reason is the scale, not the charity. The site values money and goods on one log-income scale. About $30 of help a person in a year, against a poor US household's consumption of about $17,500 a person, is a gain of under 0.2%; the same share of the consumption of a family living on two dollars a day is about a dollar a year. The US work alone comes to about 0.007; of that, about half comes from food, goods, bills paid and services, a sixth each from shelter and housing placements, an eighth from the recovery programme and the rest from community programmes and worship.

For the same reason, the 1.4% of the spending that goes overseas (the World Service Office and the territories' support for the international Salvation Army) carries about four-fifths of the result. It publishes no outcome data the model can use, so it is valued at the median of the site's cash, humanitarian and livelihood models, discounted by the shared slider for programmes estimated from similar ones; a dollar there does hundreds of times more on the log scale than in the US. The biggest uncertainties are what families would have got elsewhere, how well the charity's own counts reflect help delivered, and how much the recovery centres and placements change.

### What the charity does

In the year to 30 September 2025 the four US territories and the national headquarters spent $4.31 billion, $3.55 billion of it on programmes. The report counts 184 million meals, 15 million items of clothing, furniture and gifts, 1.4 million households helped with rent, utilities or medical bills, 10.3 million nights of shelter, 56,000 people placed in permanent housing, 155,000 people in substance-abuse and rehabilitation services, 4.8 million participants in community and Kroc centres and 208,000 church members, besides smaller counts for employment help, case management, veterans, prisons, clinics, anti-trafficking and disasters. It ran on 45,000 employees, 5,200 officers (its ordained ministers) and 1.55 million volunteers, most of them ringing bells at the red kettles.

The Adult Rehabilitation Centers, a six-month residential work-therapy programme for addiction, are paid for by the Salvation Army's thrift stores. The stores' sales ($553 million) pay their own running costs, and what is left funds the centres.

### How the impact happens

1. **Food, goods, money and services**: families get food, clothes, gifts, care and bills paid that they would otherwise have to buy or go without, and some earn more after job help or case management. We count this at what it would cost them, on the site's log-income scale at their own low consumption.
2. **Shelter and housing**: a bed or a home is worth a cheap room's rent to someone who would otherwise sleep rough. People sleeping rough die at almost three times the rate of people in shelters (Boston, 2000-2009), and homeless people at several times the rate of housed people; part of each gap is the roof itself.
3. **Recovery**: some residents stay sober who otherwise wouldn't, for a few years: less illness from alcohol or drug dependence and fewer deaths.
4. **Community and worship**: youth clubs, camps, seniors' groups and the congregation raise their regulars' life satisfaction a little.

### How the model works

The [model](/salvation-army/salvation-army-charityevals) follows the site's template for social services in rich countries, with six branches, each adjusted for its own evidence and for what would have happened anyway, then bridged into healthy years by the site's shared conversions:

- **Cost**: all four programme lines, less the thrift stores' own running costs (we judge about three-quarters of the rehabilitation line is the stores, cross-checked three ways) and less day-care fees (day care is valued net of them), plus management and fundraising spread over them. Donated food and goods are in the cost at their value, as the help they are; the volunteers' hours, at the US volunteer wage, lower the charity's share of the credit.
- **Food, goods, money and services**: every meal at the grocery cost of USDA's Thrifty Food Plan (about $2.70), items, day care and services at their cash-equivalent value, bills paid at face value (about $73 a household, from the Western Territory's audited cash assistance; veterans' temporary help at $500), job help and case management at the earnings they add, all spread over the households served and valued against their consumption, about 30% of the US average per person. Half of it, we judge, families wouldn't have got from SNAP, another pantry or another agency.
- **Shelter**: a year in shelter is worth $20 a night against consumption of 15% of the average; the deaths it averts are the gap between sleeping rough and sheltered death rates, of which we credit 30% to the shelter, for the half of nights that would otherwise have been spent without a roof (most shelters are full, so a person without this bed mostly sleeps rough or doubles up).
- **Housing placements**: each placement adds about half a year housed against usual care (a Housing First trial for supportive housing, the Family Options Study for rapid re-housing and diversion), valued against the person's own alternative (a roof only for those who would otherwise sleep rough, plus the premium of an own home, less the rent they pay), plus a fifth of a homeless adult's death rate removed, for the Salvation Army's share (70%) of the resources behind the placement.
- **Recovery**: about 3 extra lasting remissions per 100 people counted, dropouts included, for three years each, at the shared disability weight of moderate alcohol use disorder, and the excess deaths of continued heavy use they avoid.
- **Community and worship**: small life-satisfaction gains for participants and members, mostly discounted for what they would have found elsewhere.
- **Overseas work**: the World Service Office's fiscal-2025 expenses ($21.1M) and about $20M of the territories' other support for the international Salvation Army, valued at the median of GiveDirectly (GiveWell), the International Rescue Committee and Village Enterprise (Founders Pledge), read live, times the shared missing-data discount.

### What drives the result

- **How much we count a programme estimated from similar ones**, a shared slider (10-100%): the overseas proxy carries most of the result, so it moves almost one for one with it, and the **size of the territories' overseas support** ($5-45M) moves it by up to half.
- **The exchange rate between healthy years and income**, a shared slider: almost everything is income, so the result moves nearly in inverse proportion.
- For the US work: **how well the counts reflect help delivered** (60-100%), **what families would have got anyway** (30-80%), **how poor the clients are**, the recovery programme's effect and what shelter replaces, each moving the US part by up to a quarter.

### Biggest uncertainties

- No study measures what Salvation Army clients would have got without it; US families in need use SNAP and several pantries and agencies.
- The recovery centres and the housing placements have no controlled evaluation of their own; the anchors are completion rates, a 1978 follow-up without a control group, the residential-treatment literature, a Housing First trial and the Family Options Study.
- The split of the rehabilitation line between the stores and the programme isn't published; three cross-checks put the programme at 12-34%.
- The overseas work's size and results: SAWSO's expenses are on its Form 990, but the territories' other overseas support is scaled from one territory, and neither publishes outcomes we could model.
- The service counts are touchpoints, not unique people, and the national summary is a combination of audited statements that is not itself audited.

### What isn't modelled

Wellbeing beyond the money value of help for survivors, prisoners and disaster victims, spiritual care and community ties are left out (+), as are the overdose risk after relapse and funging inside the organisation (-); we judge they roughly cancel. Every US programme the report counts is on a chain; only the overseas work is valued from comparable programmes.

### How this model was checked

The mechanical audit (lint, invariants, shared figures) passes. Building it showed that the engine's discounted-years function counted a whole first year for effects shorter than a year; it now counts the fraction (with a test), which changed only this model at the defaults.

Round 1 of the independent audit found 1 high, 7 medium and 11 low issues. The high one: permanent housing placements were modelled nowhere; they are now a branch. The medium ones: programmes with counts (employment, Pathway of Hope, veterans, clinics, prisons, anti-trafficking, disasters) sat in a lump-sum adjustment and are now on the chain; meals were priced at all food spending, restaurants included, and are now at grocery cost; the counterfactual and the bill help got anchors; count quality is now asked in one row only; an age split was relabelled a judgment; the summary says concretely why the result is low. Of the lows we fixed the thrift-store cross-check, clients' fees (netted out of the cost), recovery residents' nights, the staff share (from rows, without the stores), the missing sources and the write-up; the World Bank's 2025 price index isn't out yet, so 2024 and 2025 prices still sit side by side (about 3%), and the canonical adjustments stay simple averages, since outcome weights would need an exchange rate inside the model.

Round 2 found 1 high, 3 medium and 6 low issues. The high one: the placement branch discounted for usual care twice (the trial's difference between arms and a separate counterfactual); the counterfactual is now only for help beyond usual care, and the years housed are re-anchored by kind of placement (supportive housing against rapid re-housing and diversion). The medium ones: a placed person's year was valued as a roof against no roof, now against their own alternative and net of the rent they pay; bill help per household is now derived from the Western Territory's audited cash assistance ($90 rather than a $150 guess); the food counterfactual now cites Hunger in America 2014 itself and states its step. Of the lows we fixed the summary's comparison, the residences counted both as shelter nights and as placements (a share row), and named where holiday assistance and institutional care sit; fees on outcomes valued gross and the 2024 prices stay, said in the explainers.

Round 3 found 1 high, 1 medium and 8 low issues. The high one: the overseas work paid through the US accounts (the World Service Office and the territories' world-services support) was valued as US help; it is now in the proxy rows at the median of the site's cash, humanitarian and livelihood models, which raises the result about fivefold. The medium one: the shelter counterfactual read another shelter's bed as a full substitute while the food branch didn't; both now follow the same displacement logic (shelter 35% → 50%). Of the lows we fixed: housing authorities' and host families' share of placements (a credit row), rapid re-housing's extra years (0.3 → 0.15), discounting of the placement years, bill help (transport no longer counted twice, government food taken out, veterans valued on their own), only day-care fees netted out of the cost, the staff-pay source figure and the write-up wording. The 2024 prices remain until the World Bank publishes 2025. Round 3 was the last round the skill allows: these fixes follow the auditor's own prescriptions but have not been re-audited.

### Sources

- The Salvation Army USA, [2026 National Annual Report](https://dam.redshieldtoolkit.org/asset/3f64b200-2662-4124-b458-e21cb70e49cc/2026-National-Annual-Report.pdf) (fiscal 2025): combined financial summary and service statistics, pp. 20-23.
- The Salvation Army USA, Western Territory, [audited combined financial statements, 2023 and 2022](https://docs.candid.org/edoc/10680020/document.pdf): functional expenses by natural class.
- Roncarati et al. (2018), [Mortality among unsheltered homeless adults in Boston, 2000-2009](https://pmc.ncbi.nlm.nih.gov/articles/PMC6142967), *JAMA Internal Medicine*.
- Baggett et al. (2013), [Mortality among homeless adults in Boston](https://pmc.ncbi.nlm.nih.gov/articles/PMC3713619), *JAMA Internal Medicine*.
- USDA's Thrifty Food Plan for fiscal 2026, as summarised by [No Kid Hungry](https://bestpractices.nokidhungry.org/sites/default/files/2025-08/FY%202026%20Thrifty%20Food%20Plan.pdf).
- Feeding America, [Hunger in America 2014: National Report](https://www.gbfb.org/wp-content/uploads/2016/08/hunger-in-america-2014-full-report.pdf).
- ProPublica Nonprofit Explorer, [The Salvation Army World Service Office, Form 990](https://projects.propublica.org/nonprofits/organizations/132923701) (fiscal 2025).
- Independent Sector, [Value of Volunteer Time](https://independentsector.org/research/value-of-volunteer-time/) (2025).
- IHME, [GBD 2019 disability weights](https://ghdx.healthdata.org/record/ihme-data/gbd-2019-disability-weights).
