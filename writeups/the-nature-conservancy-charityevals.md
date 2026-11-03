### Summary

The Nature Conservancy (TNC) buys and protects land and water, brokers debt-for-nature deals with governments, and works on clean energy, food systems and fresh water in the US and about 80 other countries. Our model of its fiscal year 2025 comes to **<span data-figure="headline" data-model="the-nature-conservancy-charityevals">0.04</span> years of healthy life per $1,000**.

Almost all of that comes from the work we could only value by comparison. About three-quarters of TNC's conservation spending goes to programmes that publish no outcome data for the programme as a whole: stewardship of its own preserves, restoration, fresh water, fisheries, adaptation, food systems and clean energy. Each counts at the median result of the same kind of work on the site, discounted for the missing data.

The land TNC bought and its big government deals, which we could model from its own reports, add under 1%. That isn't because protection does nothing. TNC is a small share of the money behind its biggest deal, and keeping forest carbon out of the air is worth little in healthy years on the site's scale.

### What the charity does

TNC is the world's largest conservation charity by spending: $1.69 billion in its fiscal year 2025 (July 2024 to June 2025), counting $206 million of land and easement purchases. Its audited statements list nine pathways under three priorities for 2030:

- **Tackling climate change:** clean energy, natural climate solutions, adaptation.
- **Protecting ocean, land and fresh water:** transformative protection, Nature Bonds, Enduring Earth.
- **Providing food and water:** fresh water, regenerative food, fisheries.

Its biggest deal of the year was Ecuador's debt conversion for the Amazon, in December 2024. It is expected to raise about $460 million over 17 years to protect 1.8 million new hectares of forest and wetland and to manage 4.6 million hectares of existing protected areas better.

### How the impact happens

1. **Protection slows forest loss.** A deal or purchase protects forest that would otherwise be lost at the region's rate, about 0.15% a year in the Ecuadorian Amazon. Protected areas lose forest 41% more slowly than similar unprotected land.
2. **Forest kept holds carbon.** Each hectare kept holds about 650 tonnes of CO₂, the tropics' average. The site's shared harm of a tonne of CO₂ turns the avoided tonnes into healthy years.
3. **Local incomes may change.** People living in and around the protected areas may earn a little more, or lose access to land and fish. Our best guess is a small gain, with a range that runs to a loss.
4. **Pandemic risk may fall slightly.** Less tropical forest clearing may lower the chance of a new pandemic spilling over from wildlife. This is the least grounded branch.
5. **The rest is valued by comparison.** The unmeasured programmes count at the results of comparable programmes, discounted.

### How the model works

The [model](/the-nature-conservancy/the-nature-conservancy-charityevals) follows the site's conservation template.

**Cost.** TNC's conservation spending was $1,276 million: $1,070 million of activities plus $206 million of land purchases. Administration and fundraising add 33%. TNC publishes no split by programme. We model in the chain the land purchases plus our guess at the deal work (Nature Bonds and Enduring Earth), 10% of the activities (4–20%).

**Reach.** The year's new protections we can count are:

- the Ecuador deal, with its improved-management hectares at a quarter of a new protection;
- about 40,000 hectares of land bought.

The year's ocean deals (The Bahamas, the Seychelles marine plan) store no counted carbon, so they enter only through local livelihoods.

**Years.** A deal is a win that might have come later through someone else. So it counts the site's shared years a win counts (5 by default), discounted. It doesn't count its 17 years of funding, and an easement doesn't count in perpetuity.

**Credit.** Several parties pay for the Ecuador deal: Ecuador's debt savings, an Inter-American Development Bank guarantee, US Development Finance Corporation insurance and Bank of America's financing. TNC designed the deal and provides technical support, which we put at about 5% of the resources (2–15%). Agencies and other buyers pay back part of what TNC spends on land, about 44% in FY2025 (sales over purchases). Weighted by the CO₂ each part avoids, TNC's share is about 6%.

**Programmes with no outcome data.** The other seven pathways' activities are split equally by our guess, then valued at live medians:

- **Clean energy:** Clean Air Task Force, Industrious Labs, Evergreen Collaborative and Future Cleantech Architects.
- **Food and supply chains:** the Good Food Institute and the Coalition for Rainforest Nations.
- **Land policy and finance** (natural climate solutions, transformative protection; 40% of the land part by our guess): the Coalition for Rainforest Nations and the Woodland Trust.
- **Hands-on land and water management** (fresh water, fisheries, adaptation): the Woodland Trust.

The shared missing-data discount applies to all of them.

**The next dollar.** The cost per outcome is a year's spending over deals that were years in the making. So the result reads the shared next-dollar slider, like other past averages.

### What drives the result

The shared sliders matter most, because the comparison programmes are valued in tonnes of CO₂:

- the discount rate;
- the harm of a tonne of CO₂ and how long its heat deaths take to come;
- the missing-data discount;
- the next-dollar slider.

TNC's own inputs matter less. The split between energy work and the rest matters most among them, since the energy-policy peers do far more per dollar than the land peers. The deal work's share comes next. The modelled branch's own inputs (credit share, loss rate, livelihood gains) barely move the result.

### Where we differ

There is no evaluator model of TNC to differ from. TNC's own goals count hectares "conserved" and tonnes "avoided or sequestered" without a counterfactual or shared credit. We count only the forest loss protection prevents, for the shared years a win counts, at TNC's share of the resources.

### Biggest uncertainties

- **How TNC splits its spending.** No breakdown is published, and the split decides how much of the spending goes to each comparison.
- **What the unmeasured programmes achieve.** The energy-policy peers are evaluators' recommended charities, so they likely flatter TNC's average programme. The missing-data discount takes back only part of that.
- **Pandemic risk.** We assume the risk falls in proportion to tropical forest kept. No study has measured that.

### What isn't modelled

- **Biodiversity for its own sake.** Species and habitats have no value on the site's scale, except through what they do for people and animals.
- **Wild animals' welfare.** TNC claims no effect on it, and the sign is unknown.
- **The year's gifts of land** ($48 million) and the Ecuador deal's river protections. These are a small positive share beside leakage, the clearing pushed elsewhere, in the unmodelled-effects adjustment.
- **Room for more funding**, and how TNC would spend an extra dollar across its priorities.

### How this model was checked

Built with the build-cea skill. The mechanical audit (audit-model) and the site's invariants found nothing.

The first independent audit found 2 high, 2 medium and 6 low findings, and every one was fixed:

- **Scope.** The whole protection budget had been set against one deal's outcomes. Now only the deal work and land purchases are, and the rest of the protection spending is valued by comparison.
- **Peers.** The comparison had used climate-policy charities for all unmeasured work. Now each pathway is valued at peers of its own kind.
- **Smaller fixes:**
  - the pathway count, corrected to nine;
  - the livelihood gain, refiled as a judgment;
  - a two-year loss rate in place of the record year;
  - the delivery shortfall, applied to the Ecuador deal only;
  - pandemic risk, counted from tropical forest only;
  - wording.

The second audit found no high findings, 1 medium and 4 low, and these were fixed too. Fresh water, fisheries and adaptation had been valued with the land-policy peers; they now take the Woodland Trust alone, the hands-on land manager among the peers, which lowered the result by about 30%. Explainers and the summary were clarified.

### Sources

- The Nature Conservancy, [Consolidated Audited Financial Statements FY2025](https://www.nature.org/content/dam/tnc/nature/en/documents/f/y/FY25_TNC_ConsolidatedAuditedFS-Final.pdf) and [Annual Report 2025](https://www.nature.org/content/dam/tnc/nature/en/documents/t/n/TNC_2025AnnualReport-d1.pdf).
- The Nature Conservancy, [Ecuador announces debt conversion for Amazon conservation](https://www.nature.org/en-us/newsroom/ecuador-announces-debt-conversion-for-amazon-conservation-tnc-nature-bonds) (December 2024) and [Protect Oceans, Lands and Waters: 2024 Year-in-Review](https://www.nature.org/content/dam/tnc/nature/en/documents/2/0/2025-03-18-ProtectAnnualReportFINAL.pdf).
- Wolf et al. (2021), [A forest loss report card for the world's protected areas](https://doi.org/10.1038/s41559-021-01389-0), *Nature Ecology & Evolution*.
- Naidoo et al. (2019), [Evaluating the impacts of protected areas on human well-being across the developing world](https://doi.org/10.1126/sciadv.aav3006), *Science Advances*.
- World Resources Institute, [Global Forest Review: tree cover loss in 2023](https://gfr.wri.org/global-tree-cover-loss-data-2023); MAAP, [State of the Amazon in 2023](https://www.maapprogram.org/?p=24979).
- Marani et al. (2021), via [Duke Global Health Institute](https://globalhealth.duke.edu/news/statistics-say-large-pandemics-are-more-likely-we-thought); IPBES (2020), via [Future Earth](https://futureearth.org/new-ipbes-report-on-escaping-the-pandemic-era/); WHO, [14.9 million excess deaths](https://www.who.int/news/item/05-05-2022-14.9-million-excess-deaths-were-associated-with-the-COVID-19-pandemic-in-2020-and-2021).
