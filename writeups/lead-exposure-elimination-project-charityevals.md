### Summary

The Lead Exposure Elimination Project (LEEP) works to get lead out of the paint sold in low- and middle-income countries. Our model counts what it spent from its founding in September 2020 to the end of 2025 against what it won in that time: lead paint rules in seven countries and measured switches to lead-free paint in seven more. It comes to **{{result}} years of healthy life per 1,000 dollars**. The figure is very uncertain. Nobody has measured how much of children's blood lead in these countries comes from paint, and the benefits come decades later, so the discount rate moves the result a lot.

### What the charity does

LEEP was founded in 2020 and is based in the US. It buys paint in local shops and tests it for lead. It takes the results to the national standards bureau and environment ministry, helps them draft and enforce a limit (usually 90 ppm), and gives manufacturers free technical help to switch to lead-free pigments. It also gives small grants to government agencies and local NGOs: $870,000 in 2025. By the end of 2025 it ran paint programmes in 40 countries.

It spent $3.44 million in its year to August 2025 (Form 990), and $4.9 million in calendar 2025, three times 2024. Since 2025 it also studies lead in spices, traditional eyeliner and plastic foodware.

### How the impact happens

Lead paint on walls flakes and wears into dust, and young children swallow it. Lead in a child's blood lowers IQ, and a lower IQ means lower earnings as an adult. Paint stays on walls for decades, so each year a market sells no lead paint spares children years of exposure to come. Adults in the same homes are exposed too, which raises heart disease.

### How the model works

- **Cost:** LEEP's average yearly spending from September 2020 to December 2025, in 2025 prices. Three quarters of 2025's spending is left out, because its wins come after the count (40% to all of it): LEEP's own wins came months to three years after the work.
- **Wins counted:**
  - lead paint rules adopted with LEEP's support in Madagascar, Nigeria, Burundi, Liberia, Niger, Peru and Sierra Leone. Nigeria's counts at half credit, because its regulator had drafted the rule in 2020 and a local group had campaigned since 2009, before LEEP's grant;
  - manufacturers switching to lead-free paint, shown by LEEP's follow-up testing, in Pakistan, Malawi, Zimbabwe, Ghana, Colombia, Senegal and South Africa;
  - spices, eyeliner and plastics: no change won yet, so this work counts as cost only. Drafted rules aren't counted either.
- **Children protected:** each year a market stays free of lead paint spares about one birth cohort its childhood lead from paint, so a win counts each year's births in that country.
- **What a child gains:** children in these countries average about 5 µg/dL of blood lead. We judge that {{row:paint_share}} of it comes from paint (4% to 40%), and a child loses half an IQ point per µg/dL. That is about 0.4 IQ points per child. Each point raises earnings by {{row:iq_wage_gain}} over a 40-year working life, shared in the household. The paint's exposure fades over about 25 years, and earnings start 17 years after a child's exposure.
- **Delivered:** the rules take 40% of the lead paint off the market over the years counted, as most are new. For the switches each country takes its own share: in Pakistan the lead paint brands' share fell from 88% to 41% in three years (53% gone), in Malawi lead raw materials fell from 89% of the market to 4% (90%), and we take a fifth in the five countries without a measured share.
- **Adjustments:** LEEP gets half the credit (the regulators, partner NGOs and UN agencies do the rest), and trust in the chain is 70%. A tenth of the wins would have come in the same years anyway. Each win counts for the years a won reform counts on the site.
- **Side effect:** adults in the same homes die less of lead's heart disease. Lead caused over 3.5 million deaths in 2023; we count paint's share of adults' blood lead as a quarter of its share of children's, and value the deaths at the site's value of a death by age.
- **The missing-data discount** applies throughout. LEEP measures the lead in paint on sale, not children's blood lead.
- **The next dollar** is valued at {{row:marginal_vs_past_average}} of the average. LEEP holds over three years of 2025's spending, mostly earmarked, and its next programmes are in new countries and newer lead sources.

### What drives the result

The discount rate, the years a won reform counts, the share of blood lead that comes from paint, the missing-data slider and the IQ loss per µg/dL move the result most. Next come the next dollar's value, the birth cohorts spared per year, LEEP's share of the credit and the household sharing of earnings.

### Biggest uncertainties

- **How much paint adds to blood lead:** LEEP's own Malawi analysis found no study and used 20%. Ours is 15%, as many rural homes in these countries are unpainted.
- **Delivery:** five of the seven rules are from 2025 and enforcement is just starting. Only Pakistan and Malawi have measured market shares.
- **Timing:** the earnings gain comes decades after the win, so at a lower discount rate the result is several times higher.

### What isn't modelled

Wins after 2025 (LEEP's goal is rules in 14 countries by the end of 2026) and the drafts under way count only through the next dollar. The reformulation steps manufacturers reported in 13 more countries aren't counted, because no testing backs them yet. Manufacturers' costs of switching aren't counted: no impact analysis of these rules exists, and lead-free pigments sold at similar prices in Malawi.

### How this model was checked

Audit rounds are listed in audits/lead-exposure-elimination-project-charityevals/. Round 1 passed with four medium findings, all fixed: more of 2025's spending is left out for wins still to come, the paint's exposure fades over its life rather than coming at one date, the delivery shares use LEEP's latest testing, and lead's other harms got an anchor. That took the result from 13 to 14. Round 2 found one high issue: those harms, mostly adults' heart-disease deaths, were a fixed share and didn't move with the value of a life. They are now valued as deaths. Each switch country also takes its own measured delivery share, and Liberia's ungazetted rule lengthens the wait. That took the result to 15.

### Sources

- Lead Exposure Elimination Project Inc, Form 990 for the year to August 2025: https://projects.propublica.org/nonprofits/organizations/873016729/202631969349301838/full
- LEEP, 2025 in Review: https://leadelimination.org/news/2025-in-review-advancing-lead-elimination-at-scale
- LEEP, 2024 in Review: https://leadelimination.org/news/2024-in-review
- LEEP, 2023 Annual Review: https://leadelimination.org/news/2023-annual-review
- LEEP, Annual reviews 2020-21 and 2021-22: https://leadelimination.org/news/annual-review-2020-21, https://leadelimination.org/news/annual-review-2021-2022
- LEEP, cost-effectiveness analysis - Malawi (2021): https://docs.google.com/document/d/1JPvvwa5n06dJSbTyehjMsD_hGpaFnjN2N0kkWxGCx0M/edit
- Ericson et al. (2021), Blood lead levels in low-income and middle-income countries: a systematic review, The Lancet Planetary Health: https://researchers.mq.edu.au/en/publications/blood-lead-levels-in-low-income-and-middle-income-countries-a-sys/
- Lanphear et al. (2005), Low-level environmental lead exposure and children's intellectual function: https://europepmc.org/article/MED/16002379
- UN World Population Prospects 2024, births per year: https://ourworldindata.org/grapher/number-of-births-per-year
