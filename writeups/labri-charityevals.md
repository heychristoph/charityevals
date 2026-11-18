### Summary

LABRI, the Lead-Acid Battery Recycling Initiative, works with governments to stop used car and motorbike batteries being melted down in backyards, which spreads lead into the air and soil around them. Our model counts what it spent from its start in April 2025 to October 2026 against the expected value of its main work, a policy in the Philippines. It comes to **{{result}} years of healthy life per 1,000 dollars**. The figure is very uncertain: nothing has been adopted yet, the charity publishes no accounts, and nobody has measured how much of children's blood lead comes from battery recycling.

### What the charity does

LABRI was started in April 2025 with a {{row:seed_grant}} seed grant and now has five staff, in the UK and the Philippines. It studied the used-battery market in six countries. In the Philippines it priced batteries at 17 buyers in Manila and found that unlicensed buyers pay over 50% more than licensed ones. In a project with the environmental regulator it estimated that about 40% of used batteries go to unlicensed recyclers. It proposed extending the country's producer-responsibility law, which already covers plastic packaging, to lead-acid batteries, so that makers and importers must have them recycled in licensed plants. A key industry stakeholder has endorsed the proposal, and LABRI is now designing the policy with government and industry. It dropped Malawi and Tanzania after scoping them, also scoped Georgia and Togo, and is studying Cambodia.

### How the impact happens

Smelting batteries in the open puts lead into the air, soil and dust nearby, where children breathe and swallow it. Lead in a child's blood lowers IQ, and a lower IQ means lower earnings as an adult. The lead stays in the soil for years, so each year without such smelting spares children years of exposure. Adults nearby are exposed too, which raises heart disease.

### How the model works

- **Cost:** about {{row:spend_total}} spent from April 2025 to October 2026: the seed grant and our judgment of what came after it, from the team's growth. {{row:lag_share}} is left out, because it paid for the Cambodia study and a development-bank project whose results come later.
- **Children protected:** the Philippines' births, about {{row:births_phl}} a year. Each year the smelting is stopped spares about one birth cohort's childhood exposure to it.
- **What a child gains:** children in these countries average about {{row:child_bll}} µg/dL of blood lead. We judge that {{row:source_share}} of it comes from unlicensed battery recycling in the Philippines ({{range:source_share}}): a 2026 estimate puts battery recycling at about a third of exposure in poorer countries and LABRI's own at a quarter for the Philippines, while estimates counting only exposure near the sites are far lower. A child loses {{row:iq_per_ug}} IQ points per µg/dL, and each point raises earnings by {{row:iq_wage_gain}} over a working life, shared in the household. The lead stays in reach for about {{row:exposure_life_years}} years, and earnings start {{row:years_to_working_age}} years after a child's exposure.
- **Chance of adoption:** {{row:p_success}}, the shared chance that a contested policy issue changes within a few years. An existing law to extend and industry backing weigh against weak enforcement and the unlicensed buyers' higher prices.
- **Delivered:** the rule stops {{row:implementation_adj}} of unlicensed smelting in the years counted, as the unlicensed buyers' price edge remains and enforcement against illegal smelters has been weak.
- **Credit:** LABRI gets {{row:attribution_share_shared}} of the credit among those pressing for the rule (an industry body asked for one in 2024), times the site's share for work that others carry out (here, the government and battery makers).
- **Work done:** {{row:past_work_share}} of the work towards the policy is done. Designing it, its adoption and enforcement are still to come, so only that share of the value is charged to the period's spending.
- **Side effects:** adults' heart-disease deaths averted, scaled to the Philippines' younger population, and LABRI's guidance used in other countries.
- **The missing-data discount** applies throughout.
- **The next dollar** is valued at {{row:marginal_vs_past_average}} of the average, the neutral figure, as nothing is published about the charity's money.

### What drives the result

The site's share for work others carry out, the years a won reform counts and the discount rate move the result most. Next come battery recycling's share of blood lead, the missing-data slider, how much of the lead the rule removes and the next dollar's value.

### Biggest uncertainties

- **Exposure:** no study has measured how much of Philippine children's blood lead comes from battery recycling. Estimates range from under a tenth to a third.
- **Adoption and enforcement:** no draft rule is published, and unlicensed smelters already break existing rules.
- **Cost:** no accounts are published, so the spending is our judgment around the one published figure, the seed grant.

### What isn't modelled

The Cambodia study and the development-bank project count only through the next dollar, as their cost is left out. Battery makers' costs of the scheme aren't counted: no impact analysis exists. Nor is the premium that sellers of used batteries would lose, money the unlicensed buyers save by skipping pollution control: at most a few percent of the benefit.

### How this model was checked

Audit rounds are listed in audits/labri-charityevals/. Round 1 passed with three medium findings. Two were fixed: the rule's delivery no longer also discounts lead already in the soil, which the model never counts as removed, and battery recycling's share of blood lead now weighs the two whole-population estimates for its best guess. The third, a shared figure for how long the lead stays in reach and for adults' exposure, was answered: no other model values battery smelting, so the figures are this model's own, now with their reference classes. Round 2 passed. That took the result from 1.1 to about {{result}}.

### Sources

- LABRI, Q2 & Q3 2026 Newsletter: https://www.labrecyclinginitiative.com/post/q2-q3-2026-newsletter
- LABRI, Q1 2026 Newsletter: https://www.labrecyclinginitiative.com/post/q1-2026-newsletter
- LABRI, Why LABRI is working in the Philippines: https://www.labrecyclinginitiative.com/post/why-labri-is-working-in-the-philippines
- Ambitious Impact, track record: LABRI (archived): https://web.archive.org/web/20251211084755/https://www.charityentrepreneurship.com/track-record-charities/labri
- Crawfurd, Hu and Mitchell (2026), Estimating Population Lead Exposure from Battery Recycling, Center for Global Development: https://www.cgdev.org/publication/estimating-population-lead-exposure-battery-recycling
- Lead Battery Notes, How Brazil solved its lead-acid battery problem: https://leadbatteries.substack.com/p/how-brazil-solved-its-lead-acid-battery
- LABRI, Q4 2025 Newsletter: https://www.labrecyclinginitiative.com/post/q4-2025-newsletter
- Ericson et al. (2016), The global burden of lead toxicity attributable to informal used lead-acid battery sites: https://pubmed.ncbi.nlm.nih.gov/28283119/
- WHO, Lead poisoning and health (fact sheet): https://www.who.int/news-room/fact-sheets/detail/lead-poisoning-and-health
- Lanphear et al. (2005), Low-level environmental lead exposure and children's intellectual function: https://europepmc.org/article/MED/16002379
- Baumgartner et al. (2009), Lobbying and Policy Change: https://fbaum.unc.edu/books/lobby/lobbying-synopsis.htm
- UN World Population Prospects 2024, births per year: https://ourworldindata.org/grapher/number-of-births-per-year
