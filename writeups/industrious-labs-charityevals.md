### Summary

Industrious Labs campaigns to cut emissions from US heavy industry: steel, aluminium, cement, industrial heat and landfills. Our model counts the rules it helped win in 2023 and 2024, against what it spent in those years. It comes to **<span data-figure="headline" data-model="industrious-labs-charityevals">-0.002</span> years of healthy life per 1,000 dollars**: a small net harm. The rules' compliance costs outweigh their tonnes and the deaths and illness their cleaner air avoids.

### What the charity does

Industrious Labs launched in 2022 (12 staff, a $3 million budget, Axios). Its operating company, Climate Strategies Lab LLC in Cincinnati, publishes no accounts. Donors paid it through a fund at Tides Foundation: $2.34 million in 2023 and $3.12 million in 2024 (Tides Foundation's tax returns). Its new 501(c)(3), Industrious Education Fund, where the donate page now sends gifts, spent $38,667 in 2024 on start-up costs and began programmes in 2025.

Its campaigns:

- **Steel and aluminium:** pressing steelmakers to build clean iron and steel instead of relining coal blast furnaces, federal clean-steel funding, and air-toxics rules for coke ovens and steel mills.
- **Clean industrial heat:** zero-emission rules for boilers, water heaters and ovens in Southern California, and state laws on industrial heat.
- **Cement and landfills:** procurement standards, and landfill methane rules in Colorado and California.
- **Field building:** training for steel communities and research.

### How the impact happens

A won rule cuts emissions or air pollution once it takes effect. The model counts four rules won in the period:

- **South Coast AQMD's Rule 1146.2 (June 2024).** About 1.07 million gas-fired pool heaters, large and tankless water heaters, small boilers and process heaters in the Los Angeles basin switch to heat pumps as they wear out. That cuts about 2.2 million tonnes of CO₂ a year once complete, and 5.6 tons a day of smog-forming NOx. Industrious Labs counts it among two "landmark victories" it secured, and helped defend it in court.
- **South Coast AQMD's Rule 1153.1 (August 2023).** Bakery and cooking ovens go electric once they are 22 years old: 0.11 tons a day of NOx. The tonnes are about 16,000 a year, and could be negative while the grid still runs on gas.
- **EPA's 2024 rule for integrated steel mills.** It removes 473 tons a year of fine particles. EPA's two benefit cases imply about 16 to 35 early deaths a year avoided. A 2025 exemption delayed it.
- **EPA's 2024 coke-oven rules.** These are mostly fenceline monitoring, and EPA quantified no benefit. They were exempted in 2025 and restored that October.

The campaigns that lost or stayed open in the period count at zero against the same spending. These are DOE's clean-steel and aluminium awards (mostly withdrawn), U.S. Steel's Gary blast-furnace reline, Cleveland-Cliffs' delayed Burns Harbor reline, and the landfill rules.

### How the model works

For each rule, the model multiplies:

- its effect a year (tonnes, and early deaths from cleaner local air);
- the share of a won policy that is advocacy's doing (shared, 30%);
- the years a won reform counts (the shared 5, discounted, after each rule's own wait: about 16 years to the middle of Rule 1146.2's phase-in);
- the share that wouldn't have happened anyway;
- Industrious Labs' share of all the groups' work behind it (15% and 20% for the South Coast rules, about 5% for EPA's);
- the share delivered;
- the missing-data step.

The deaths from cleaner air in the basin use the district's own modelling of its 2022 air plan: 3,031 deaths avoided in 2037 for 124 tons a day of NOx, about 24 a year per ton a day. They are valued at the ages US air-pollution deaths come at, and illness avoided adds 3.6% (the district's own valuation).

Each rule's compliance costs are the regulator's own figures (docs/normalization.md 2.21). For Rule 1146.2, the district's analysis gives the heat pumps' extra price, amortized at the site's discount rate, plus owners' fuel savings. The tonnes, the fuel savings and the NOx cut all rest on the same per-unit energy use, so all three take the same evidence adjustment (0.8). The costs are valued as money lost by owners and consumers, and pass through the same chain as the benefits. The cost is a typical year of 2023–2024: Tides Foundation's grants over the share of the budget they paid (our judgment, 75%). The next dollar counts 42% of the past average.

### What drives the result

- **Rule 1146.2** is about two-thirds of the net harm. Its costs exceed its tonnes and health benefits by about a third.
- **Rule 1153.1** is most of the rest: electric ovens cost more to run than gas ones, and the higher bills are several times the value of their small NOx cut.
- **EPA's steel-mill rule** adds a little good. The coke-oven rules add a small cost.

Benefits and costs are of similar size, so the sign is fragile:

- **The discount rate.** At a lower rate the late tonnes and the cleaner air count for more than the up-front cost of the heat pumps.
- **The heat pumps' real cost.** At 0.75 of the quotes the result turns positive.
- **The district's per-unit energy use** (the evidence adjustment). At 1.1 it turns positive.

Deaths per ton of NOx in the basin (12 to 30) move the size, not the sign.

### Biggest uncertainties

- The discount rate and the years a won reform counts (shared).
- What a dollar lost by Southern California's owners is worth on the site's scale (the shared payer multiple).
- Deaths per ton of NOx: the district's plan-wide average stands in for these rules.
- Industrious Labs' share of each coalition, and what share of its budget Tides paid (45% to 100%).

### What isn't modelled

California's industrial-heat laws (AB 2083 in 2024; AB 1280 came in 2025, after the period) fund studies and grants rather than rules. They are left out, as is work after 2024. The air-toxics metals' cancer benefits, which EPA could not quantify, count nothing.

### How this model was checked

Two independent audits. The first found that the costs and benefits were treated unequally, and that Rule 1153.1 and EPA's two steel rules were missing as wins. It also found that the smoke per tonne was a guess, and that the cost range came from a discount rate. Each won rule now has its own branch, the deaths come from the district's NOx modelling, and the costs move with the discount rate. The second audit found that the NOx deaths lacked the evidence adjustment on per-unit use, and that the EPA branches asked the advocacy question twice. It also found that illness, a US age mix and EPA's two benefit cases were missing. All were fixed. A third, scoped check verified the changes.

### Sources

- Tides Foundation, Form 990s for 2023 and 2024, Schedule I: https://projects.propublica.org/nonprofits/organizations/510198509
- Industrious Education Fund, Form 990 for 2024: https://projects.propublica.org/nonprofits/organizations/992396851
- South Coast AQMD (2024), Draft Socioeconomic Impact Assessment and Draft Staff Report for Rule 1146.2: https://www.aqmd.gov/docs/default-source/rule-book/Proposed-Rules/rule-1146-1146.1-and-1146.2/draft-par-1146-2-socioeconomic-impact-assessment.pdf
- South Coast AQMD (2023), Draft Socioeconomic Impact Assessment for Rule 1153.1: https://www.aqmd.gov/docs/default-source/clean-air-plans/socioeconomic-analysis/first-draft-of-par-1153-1socioeconomic-impact-assessment_june30_2023.pdf
- South Coast AQMD, 2022 AQMP socioeconomic analysis (REMI conference slides, 2023): https://wp.remi.com/wp-content/uploads/2023/10/Tony-Tian-presentaiton.pdf
- US EPA (2024), Integrated Iron and Steel NESHAP fact sheet: https://www.epa.gov/system/files/documents/2024-03/final-iis-fact-sheet_0.pdf; GAO B-336203: https://www.gao.gov/products/b-336203
- US EPA (2024), Coke Ovens NESHAP Economic Impact Analysis: https://www.epa.gov/system/files/documents/2024-05/coke-ovens-rtr-eia-final-2024-05.pdf
- Industrious Labs, news archive: https://www.industriouslabs.org/archive
