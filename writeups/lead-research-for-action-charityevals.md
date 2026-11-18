### Summary

Lead Research for Action tests everyday products sold in markets in low- and middle-income countries for lead, so that governments and others know which sources to act on. Our model counts what it spent from its start in October 2024 to October 2026 against the expected value of its first finished study, in Malawi. It comes to **{{result}} years of healthy life per 1,000 dollars**. The figure is very uncertain: no one has acted on the study yet, the charity publishes no accounts, and nobody has measured how much blood lead the products it found cause.

### What the charity does

The charity was started in October 2024 with a {{row:seed_grant}} seed grant and now has five staff. In 2025 it bought 747 products in 27 markets in three districts of Malawi, tested them for lead with a handheld analyser (about 9% checked in a US laboratory) and interviewed 225 consumers and 122 vendors. It found lead in metal pots and pans (over half above 100 ppm, some imported non-stick pans far higher), in plastic plates and cups (442 ppm on average), in one hair dye (1.4% lead) and in soils some women eat in pregnancy. In March 2026 it published recommended limits: 100 ppm for plastics and cookware, a ban on the worst imported pans and on lead in hair dye, and a blood-lead study of the soils before any campaign against them. It has also sampled products in Kenya and won a grant for a study in another country; those findings are not out yet.

### How the impact happens

If Malawi sets and enforces limits on these products, children take in less lead from their food and from a parent's hair dye. If a health programme cuts the eating of contaminated soils in pregnancy, babies are born with less lead. Lead in a child's blood lowers IQ, and a lower IQ means lower earnings as an adult. Adults eating from the same pots take in less lead too, which lowers heart disease.

### How the model works

- **Cost:** about {{row:spend_total}} spent from October 2024 to October 2026: the seed grant and our judgment of what came after it, from the team's growth and a further grant. {{row:lag_share}} of it is left out, because it paid for studies in other countries whose findings come later.
- **Children protected:** Malawi's births, about {{row:births_mwi}} a year. Each year the products are kept lead-free spares about one birth cohort's childhood exposure to them.
- **Products, what a child gains:** children in these countries average about {{row:child_bll}} µg/dL of blood lead. We judge that {{row:source_share}} of it comes from the products flagged for limits, built from each product's judged share: metal pots most, plastics and the hair dye little. A child loses {{row:iq_per_ug}} IQ points per µg/dL, and each point raises earnings by {{row:iq_wage_gain}} over a working life, shared in the household. The pots and plastics keep exposing children for some years after they are sold, and earnings start {{row:years_to_working_age}} years after a child's exposure.
- **Products, chance of action:** {{row:p_success}}. That is the shared chance that a contested policy issue changes within a few years, times {{row:issue_record_adj}} for Malawi's case: no meeting with a ministry and no draft limit has been reported in the ten months since the report.
- **Products, delivered:** a limit is likely to cover the easier products first (plastics, imported pans, the hair dye) and removes part of their lead, together {{row:implementation_adj}} of the products' exposure.
- **Soils eaten in pregnancy:** about {{row:gps_use_share}} of pregnant women eat them, raising the baby's blood lead by about {{row:gps_fetal_bll}} µg/dL for the pregnancy. The chance of a programme against it is lower ({{row:gps_p_success}}), since a blood-lead study comes first, and a programme would cut the habit only partly.
- **Credit:** the charity gets {{row:attribution_share_shared}} of the credit among those who research and campaign for an action, times the site's share for work that others carry out (here, the government, manufacturers and health programmes).
- **Work done:** the charity's own work towards a limit is {{row:past_work_share}} done (leaching tests and support to the government are still to come), and towards a soils programme {{row:gps_past_work_share}}. Only that share of the value is charged to the period's spending.
- **Side effects:** adults' heart-disease deaths averted, scaled to Malawi's young population. The findings' use beyond Malawi adds {{row:unmodelled_benefits_adj}}.
- **The missing-data discount** applies throughout.
- **The next dollar** is valued at {{row:marginal_vs_past_average}} of the average, the neutral figure, as nothing is published about the charity's money.

### What drives the result

The site's share for work others carry out, the discount rate and the years a won reform counts move the result most. Next come the missing-data slider, the blood lead from metal pots, the chance that Malawi acts and how much of the lead a limit removes.

### Biggest uncertainties

- **Exposure:** lead in a pot is not lead in a child until it leaches. The charity's leaching tests aren't out, and no blood was tested.
- **Action:** nothing has followed the study yet, and the charity doesn't campaign itself.
- **Cost:** no accounts are published, so the spending is our judgment around the one published figure, the seed grant.

### What isn't modelled

The Kenya study and the new country study count only through the next dollar, as their cost is left out. Makers' costs of switching aren't counted: no impact analysis of such limits exists, and lead-free plastics are widely sold.

### How this model was checked

Audit rounds are listed in audits/lead-research-for-action-charityevals/. Round 1 found one high and five medium issues. The high one, taking Ambitious Impact's idea-stage estimate of this charity off the site, is a separate step outside this model. The others were fixed: the next dollar takes the neutral figure for want of evidence on the charity's money; the products' share of blood lead is built product by product; the soils eaten in pregnancy got their own branch; the work still to come counts only the charity's own part; and a limit's delivery is split into the products it covers and how well it is enforced. Round 2 corrected the share of pregnancies in which the soils are eaten (half of those who ever ate them did so while pregnant) and anchored a programme's effect on a Malawian trial of iron therapy. Round 3 passed. That took the result from 0.15 to about {{result}}.

### Sources

- Lead Research for Action, Assessing Lead Exposure Risks from Commonly Used Consumer Products in Malawi (January 2026): https://drive.google.com/file/d/1pqRUeejiRCX2bXekeZnL0zGi34zbK23w/view
- Lead Research for Action, Key Recommendations and Next Steps (March 2026): https://drive.google.com/file/d/1bsAqzTHTPh1-K4n1LGYehyvnccpGh2OH/view
- Ambitious Impact, track record: Lead Research for Action (archived): https://web.archive.org/web/20260612133826/https://www.charityentrepreneurship.com/track-record-charities/lead-research-for-action
- LEEP, Announcing LEEP's Opportunity Fund Grantees (August 2026): https://leadelimination.org/news/opportunity-fund-grantees
- Forsyth et al. (2023), Food safety policy enforcement and associated actions reduce lead chromate adulteration in turmeric across Bangladesh: https://europepmc.org/article/MED/37286126
- Lanphear et al. (2005), Low-level environmental lead exposure and children's intellectual function: https://europepmc.org/article/MED/16002379
- WHO, Lead poisoning and health (fact sheet): https://www.who.int/news-room/fact-sheets/detail/lead-poisoning-and-health
- Baumgartner et al. (2009), Lobbying and Policy Change: https://fbaum.unc.edu/books/lobby/lobbying-synopsis.htm
- UN World Population Prospects 2024, births per year: https://ourworldindata.org/grapher/number-of-births-per-year
