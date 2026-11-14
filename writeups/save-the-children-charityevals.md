### Summary

Save the Children UK spent £234 million on charitable work in 2025. Most of it went as grants to Save the Children International, which runs the country programmes. We model the £209 million that paid for programmes: education in crises, emergency response, health and immunisation, livelihoods, child protection, nutrition and a little UK child-poverty work. We estimate **<span data-figure="headline" data-model="save-the-children-charityevals">0.22</span> years of healthy life per $1,000**. That is about twice the site's global-health median. Save the Children UK counts reach for some projects but not for each line's spending, and publishes no controlled evaluation of its own. Each branch is therefore built from its spending and the research on its kind of work, with wide ranges, and counted at half by the site's shared missing-data slider. Its advocacy and Elrha's humanitarian research are in a second model, [here](/save-the-children/save-the-children-charityevals-advocacy). We use Save the Children UK's accounts because Save the Children US's are behind a bot check. Either is a route to the same movement's work.

### How the model works

**Education** (£80m, about a third of the result). The programmes are learning clubs, temporary classrooms and teacher training for out-of-school children, mostly funded by the Global Partnership for Education in Afghanistan, Myanmar and Yemen, plus Nigeria and the DRC. We put the cost at $130 a child-year, from the Global Partnership for Education's grants per child. We take the median learning gain of randomised education evaluations in poor countries, 0.1 standard deviations (Evans & Yuan 2022). Of that, 40% lasts into adult life, where each standard deviation is worth 20% more earnings. The gain is valued on the site's log-income scale over a working life, after a ten-year wait.

**Nutrition** (£14m, about a third). Half of it treats severe acute malnutrition, at about $200 a child. Without treatment about 10% of these children die, and treatment averts 60% of those deaths. Prevention (infant feeding, cash with nutrition) counts at a fifth of treatment's value per dollar. Therapeutic food from UNICEF and government clinics share the credit.

**Emergencies** (£38m, Elrha's research taken out). This covers Gaza, Sudan, Myanmar's earthquake and Ukraine, plus the Start Network's pooled fund. We put the cost at $40 a person reached. In half a year of crisis, mortality averages 0.02 a year against a normal 0.007, and the response removes 4% of the extra deaths. Cash, food and goods are valued as consumption over the months they cover, at their cost (no evidence step), less a small loss from local price effects (a side effect).

**Health** (£40m). Immunisation (Gavi-funded work in Sudan, and the BOOST programme for unvaccinated children in Ethiopia and Nigeria) and community health. It costs $30 a child covered for a year and removes 4% of a child's yearly mortality of 0.014. Vaccines and government staff share the credit (50%).

**Livelihoods** (£20m less a UK share), **protection** (£17m) and **the UK work**. Livelihoods add a 3% consumption gain for two years, at $200 a household, plus the child deaths higher incomes avert (a fifth of the gain's value, the cash-income ratio). Protection is psychosocial support and services for survivors of violence. It improves the mental health of the 22% of children in conflict settings with a disorder by 0.3 standard deviations for a year, counted in WELLBYs. The UK work (Family Grants, baby banks, community programmes) is valued as goods worth a third of the money spent.

Every branch has the same delivery adjustment (85%) and the missing-data discount. Each shares credit with the governments, partners and volunteers whose resources it uses (80-90%; health 50% and nutrition 60%, for the vaccines and therapeutic food others pay for).

### What drives the result

The missing-data slider, the discount rate and the cost of a child-year of education come first. Then how much learning programmes add and how long it lasts, the value of a healthy year in units of value, and the death rate of severely malnourished children without treatment. The combined range runs from 0.04 to 1.1.

### What isn't modelled

Gains for children reached by protection work who have no disorder, fewer child marriages, maternal deaths averted, and the training of local responders by the Humanitarian Leadership Academy (+). Funging inside the movement, aid diverted in conflict zones and safeguarding failures (-). Together these are a judged +5%.

### How this model was checked

Built with charityevals' humanitarian-relief template on 13 November 2026, as a portfolio of branches over Save the Children UK's grants to Save the Children International (Convention 4); the mechanical audit passes. Round 1 of the independent audit passed with five medium findings; four were fixed and the emergency deaths' age shares kept as ranged judgments (the shared splits have none for crises, and they move the result by about 2%): the cost of a child-year of education rose from $80 to $130 (GPE's grants per child), every branch now shares credit with the resources others put in, the health cost is anchored on the children the report counts, and the education evidence adjustment on the paper's small-study gap. The result fell from 0.29 to 0.21. Round 2 checked the changes and passed. A later site-wide pass counted the emergency goods over the months they cover, at cost without an evidence step, and added livelihoods' mortality step, moving the result to 0.22; round 4 verified it (no high or medium finding).

### Sources

- [Save the Children UK, Annual Report and Financial Statements 2025](https://i.stci.uk/dam/annual-report-2025-tsp-ch11594965.pdf/fr56uvecp24bdm232q2y3e478dl8a82e.pdf)
- [Save the Children UK, Grants paid 2025](https://i.stci.uk/dam/scuk-grants-paid-2025-ch11588498.pdf/fb4i2xt1e7x6w1twjd70i6138gj2tegt.pdf)
- [Evans & Yuan (2022), How Big Are Effect Sizes in International Education Studies?](https://doi.org/10.3102/01623737221079646)
- [Charlson et al. (2019), New WHO prevalence estimates of mental disorders in conflict settings](https://doi.org/10.1016/S0140-6736(19)30934-1)
