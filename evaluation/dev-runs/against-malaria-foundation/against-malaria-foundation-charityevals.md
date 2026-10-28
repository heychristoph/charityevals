## Summary

The Against Malaria Foundation (AMF) buys long-lasting insecticidal nets for mass distribution campaigns. National malaria programmes and partners run the campaigns. In its financial year to June 2025, AMF committed $172 million to 75 million nets for the DRC, Nigeria, South Sudan, Chad, Guinea and Zambia.

We built our own model from AMF's audited accounts, the Cochrane review of net trials, WHO malaria data and published campaign-costing studies. It gives **about 0.048 units of value per dollar, or 5.6 times GiveDirectly**, with AMF credited with its share of the cost. Counting everyone's costs, that is about $3,200 per malaria death averted before income gains. With full credit, it is about $1,900 of AMF's own money.

The joint low–high range is very wide, from about 0.13× to 200× GiveDirectly, because a dozen uncertain inputs multiply together and some of them are correlated (the mortality effect and the indirect-death ratio are calibrated together). Varied one at a time, no input moves the result outside about 3.8–8.0×. The extremes are your moral weight on saving lives at the low end and a 0% discount rate at the high end.

## What the charity does

AMF funds nets and monitoring. Governments and co-funders such as the Global Fund pay for the in-country distribution: registering households, transport and the handout itself. AMF pays independent partners to check household registration, verify the distribution and run surveys every nine months for two and a half years afterwards, and it publishes the results. It has 14 staff, its two leaders are unpaid, and its central costs were about $1 million in FY2025, so 99.4% of its spending goes on nets and monitoring.

## How the impact happens

1. A net is handed out for roughly every 1.8 people. AMF's own surveys find about 95% of sleeping spaces covered on day one, 75–85% at nine months and 50–65% at 27 months.
2. Sleeping under an insecticide-treated net cuts malaria episodes by about 45% (Cochrane, 23 trials) and cut deaths from all causes among children by 17%.
3. Most of the deaths averted are of children under five (about 81% here). Malaria also kills indirectly, through anaemia and by weakening children against other infections, and the model counts this. Children who avoid malaria also go on to more schooling and higher adult earnings.

## How the model works

- **Cost.** AMF's FY2025 spending is $178.0m: nets $172.0m, monitoring $5.0m, central costs $1.1m. Others pay for delivery, which we put at about $1.5 per net (range $0.6–3.0), weighted by country. The anchors are a 2026 Nigeria micro-costing ($0.57–0.74), Mozambique ($0.76) and higher costs in the DRC and conflict settings. AMF is credited with its share of the combined cost, 61%. With "full credit" switched on, it gets the whole outcome, which gives 9.1×.
- **Reach.** 75.3m nets × 1.8 people = 135.6m people. AMF's survey data give each person 2.1 years of full-use-equivalent protection. That is 2.9 years at the 72% use observed in the largest mortality trial (Asembo Bay, Kenya).
- **Effect.** The starting point is the WHO 2024 direct malaria death rate, weighted by where the nets went: 65.6 per 100,000 per year. We raise it by 20% for what it would be without any nets, and by 50% for indirect malaria deaths. The indirect-death figure is calibrated so that under-five deaths averted (about 2.5 per 1,000 children per year) match the trials' 17% all-cause reduction applied to today's child mortality. Of these deaths, 45% are averted in trial conditions. The trials covered children, so older people are given 70% of that effect.
- **Income.** 43% of the people protected are children. Each loses about 19% of a childhood's malaria, at 45% of its burden. Removing all of a childhood's malaria adds about half a year of schooling (Barofsky et al. 2015, Uganda). That is worth 9% higher earnings per year of schooling, over a 40-year working life, discounted.
- **Adjustments** (product 0.31). Evidence 0.75: insecticide resistance, net wear and today's better malaria treatment. Counterfactual 0.8: old and routine nets. Delivery 0.85: surveys record nets hung, not slept under. Attribution 0.61: AMF's share of the cost. Leverage and funging 1.0. Effects we don't model add 15%. Deaths are discounted for the two years from funding to the middle of the protection period. Income is discounted for the year from funding to distribution, plus its own delay until working life.
- **Value.** Deaths use GiveWell's moral weights for deaths under five and at older ages. Income uses the shared value of a unit of ln(consumption). About 81% of the value comes from deaths averted and 19% from income.

## What drives the result

- **Your moral weight on saving lives** (0.6–1.4: 3.8× to 7.4× GiveDirectly).
- **Delivery costs paid by others** ($0.6–3.0 per net: 7.3× to 4.0×). They set AMF's share of credit.
- **The evidence adjustment** (0.55–0.95: 4.1× to 7.1×), and **the size of the mortality effect** (35–55%: 4.6× to 6.6×). The evidence adjustment is the question of how much pyrethroid resistance and three years of wear erode the protection measured in trials run in 1987–2001. The newer dual-ingredient nets that AMF increasingly buys did better against resistant mosquitoes in Tanzania, but lost their advantage by year three in Benin.
- **The discount rate** (0–8%: 8.0× to 4.6×), through the income branch and the delay before deaths are averted.
- **Malaria death rates** (50–95 per 100,000: 4.5× to 7.6×), **net use** (1.7–2.5 years: 4.5× to 6.7×) and **trial use** (60–85%: 6.7× to 4.7×).

## Biggest uncertainties

- **Malaria death rates.** WHO's country estimates for the DRC and Nigeria rest on models, not death registration. We could not access IHME's estimates, which are reported to be higher at older ages. We use national averages, while AMF targets high-burden areas within countries.
- **Indirect deaths.** The calibration to the all-cause trial result assumes the trials' relative effect holds at today's lower child mortality.
- **Real net use.** AMF's surveys record nets hanging over sleeping spaces, which probably overstates how many people sleep under them.
- **Later-life income.** This rests on one quasi-experiment in Uganda, and on the assumption that the gain scales with the share of childhood malaria removed.
- **Others' delivery costs, and what that money would otherwise do.** These are not published per distribution.

## What isn't modelled

Illness is not counted on its own: it is in the 15% for unmodelled effects, along with treatment costs, protection in pregnancy and the employment effects in the Uganda study. Also left out are year-by-year falls in malaria mortality over the nets' life, country-level differences in effect and resistance, AMF's room for more funding, and its work on monitoring standards and new net types, which may change what other funders do. The model covers one year's net commitments, not AMF's whole history.

**Cost basis.** The bottom line is per dollar of AMF's own spending. Others' delivery costs are handled through attribution, which gives the same answer as counting every contributor's cost (about $3.85 per net) in the denominator. The GiveWell-based peer models on the site (SMC, vitamin A) leave government delivery spending out of their cost-effectiveness denominator. That is closer to our "full credit" setting (9.1×), so compare with them with this in mind.

## How this model was checked

- Mechanical audit (`scripts/audit-model.ts`): no findings before the first independent audit.
- Independent audit, round 1 (1 high, 2 medium, 6 low), and what we changed:
  - Indirect malaria deaths were missing (high). We added `indirect_deaths_ratio`, calibrated against the all-cause trial result.
  - Delivery costs (medium). We lowered them from $2.0 to $1.5 per net, using the Nigeria and Mozambique costing studies.
  - Partner costs (medium). We moved them out of the cost and into attribution, so that "full credit" works and the cost basis matches other models.
  - Low findings. We discounted deaths for the delay before distribution. The counterfactual no longer counts other funders (funging is now counted only once). We widened the death-rate and under-five-share ranges for IHME, fixed the schooling quote, and corrected the sensitivity claim in this write-up.
  - Not changed: the shared moral-weights fact cites GiveWell's AMF CEA as its source. It is a shared fact, outside this model.
  - The result moved from 3.5× to 5.0×.
- Independent audit, round 2 (0 high, 3 medium, 5 low). All round-1 high and medium findings were resolved. What we changed:
  - Trial use: now anchored on Asembo Bay's observed 72% adherence instead of a judged 80% (medium).
  - Mortality effect: its range is narrowed to 35–55%, and its explainer and the indirect-death explainer now say the two are calibrated together (medium).
  - Joint range (medium): the summary says the result is mostly uncertainty.
  - Low findings:
    - We corrected the cost-per-death wording.
    - We updated the explainers left over from round 1.
    - Income is now discounted only for the delay to distribution.
    - The IHME-based bounds are now labelled as judgments.
  - Not changed: indirect deaths are still applied at all ages (about −5% if fixed; a low finding), and the moral-weights citation.
  - The result moved from 5.0× to 5.6×.

## Sources

- AMF, Annual Report and Financial Statements for the year ended 30 June 2025 (audited): https://www.againstmalaria.com/Downloads/AMF_Accounts_Global_2025.pdf
- AMF, Financial information: https://www.againstmalaria.com/FinancialInformation.aspx
- Pryce, Richardson & Lengeler (2018), Insecticide-treated nets for preventing malaria, Cochrane: https://doi.org/10.1002/14651858.CD000363.pub3
- Mosha et al. (2024), Lancet Infectious Diseases: https://doi.org/10.1016/S1473-3099(23)00420-6
- Accrombessi et al. (2024), Lancet Infectious Diseases: https://doi.org/10.1016/S1473-3099(24)00002-1
- Barofsky, Anekwe & Chase (2015), Journal of Health Economics: https://doi.org/10.1016/j.jhealeco.2015.08.002
- Psacharopoulos & Patrinos (2018), World Bank WPS 8402: https://doi.org/10.1596/1813-9450-8402
- Eigbiremolen et al. (2026), costs of ITN campaigns in Ondo and Anambra, Malaria Journal: https://doi.org/10.1186/s12936-026-05829-9
- Arroz et al. (2019), LLIN delivery models in Mozambique, BMC Research Notes: https://doi.org/10.1186/s13104-019-4620-6
- WHO malaria mortality rates by country (via Our World in Data): https://ourworldindata.org/grapher/death-rate-from-malaria
- WHO malaria fact sheet: https://www.who.int/news-room/fact-sheets/detail/malaria
- World Bank WDI: population ages 0–14, under-five and neonatal mortality: https://data.worldbank.org/indicator/SP.POP.0014.TO.ZS
- Copenhagen Consensus, Expanded malaria intervention (Winskill et al. 2019 delivery costs): https://www.copenhagenconsensus.com/sites/default/files/2023-03/Expanded%20malaria%20intervention.pdf
