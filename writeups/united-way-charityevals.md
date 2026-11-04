### Summary

United Way is a network of about 1,100 local United Ways in the US, led by United Way Worldwide, that raises money mostly through workplace giving campaigns and spends it on grants to local social-service agencies, the 211 helplines, free tax filing and programmes of its own. Our estimate for the whole network's programme spending is **<span data-figure="headline" data-model="united-way-charityevals">0.010</span> years of healthy life per $1,000** (from about 0.0007 to 0.14 with every range combined).

That is far below the global-health charities on the site, mainly because the help goes to people in the US, who consume around $41,000 a year each (the poorest fifth about $39,000): on the site's one log-income scale a dollar of food or rent help does about a sixtieth of what it does for a household living on about $2 a day, and the services are bought at US prices. United Way measures none of its outcomes itself, so every branch is built from the research on its kind of work and counts at the site's missing-data slider (default 50%). Most of the result is children's and youth programmes: the US trials of tutoring, mentoring and early learning imply a small but lifelong gain in earnings.

### What the charity does

Each local United Way is a separate charity with its own board and accounts; United Way Worldwide, the national office ($77 million spent in 2024), is funded by the locals' dues and runs the brand, network support and donor-advised giving. Across the network (Forbes's compilation, fiscal year to June 2025) $3.5 billion was spent, $2.9 billion of it on programmes. No network-wide split is published; we split it from two large local United Ways' audited accounts (Greater Houston, Greater Twin Cities) and United Way's own counts:

| Branch | Spending | How it is valued | Share of the result |
|---|---|---|---|
| Grants for basic needs (food, shelter, rent and utility help) | about $420 million (15%) | near cash, at what the help is worth to the household | 6% |
| Other grants (education, child care, youth, health, financial stability) | about $1.26 billion (43%) | from the US research on programmes of each kind | 59% |
| United Way's own programmes (early learning, reading, the 988 line, coaching, and the staff who run the grantmaking) | about $1.05 billion (36%) | the 50% that is services, as the other grants; the rest is the cost of running the grants and convening | 32% |
| 211 helplines (United Way's share) | about $125 million (4%) | help callers find that they wouldn't have found otherwise | 2% |
| Free tax filing (VITA, MyFreeTaxes) | about $40 million (1%) | fees saved and credits that would have gone unclaimed | 2% |

All five branches are *thin*: United Way publishes who it reaches only as one network-wide count, and no outcomes with a comparison group, so each counts at the missing-data slider.

### How the model works

Every branch counts as income to the people helped, on the site's log scale at the clients' consumption (70% of the US average per person: the poorest fifth of households consume 67% of the average person's), valued at the shared value of a doubled income and converted to healthy years by the site's rate.

- **Basic-needs grants**: a grantee spends about 82% of a dollar on services; the help is worth about 90% of its cost to the household; 80% of it wouldn't have come from government or family, and 85% wouldn't have been given anyway with other donors' money (emergency help is rationed: in Chicago, people who asked for rent help after the funds ran out entered shelters far more often than those helped; Evans, Sullivan and Wallskog, Science 2016).
- **Other grants and own services**, split into three kinds of service (40% children and youth, 30% financial stability, 30% health and other, a judgment anchored on local United Ways' impact areas), each valued from its research, at the full cost of a participant's place in the programmes the trials test:
  - *Children and youth* (about 88% of this branch's value): a programme year at scale raises outcomes by about 0.16 standard deviations (a quarter each: tutoring and reading at scale 0.19, Kraft and others 2026; mentoring 0.21, Raposa and others 2019; early learning 0.15, the Head Start Impact Study; after-school programmes 0.09, between the 21st Century Community Learning Centers evaluation's null and Durlak, Weissberg and Pachan's meta-analysis), each SD worth about 10% higher adult earnings (a better teacher's 0.1 SD test gain raises earnings at 28 by 1.3%: Chetty, Friedman and Rockoff 2014; below their 13% because much of the youth programmes' gain is social-emotional), for the site's shared 40 working years, shared with the household (the site's shared factor of 2), starting about 13 years later and discounted at the shared rate. A place costs about $3,000 a year (mentoring $1,500 to $4,400, tutoring $3,000 to $4,000, pre-K more).
  - *Financial stability* (9%): about $500 a year more earnings or savings for 3 years per $2,000 participant, from the job-training meta-analysis (Card, Kluve and Weber 2018), the WIA Gold Standard RCT and the financial-coaching trials, whose financial effects are mostly small and mixed (systematic review, Birkenmaier and others 2026).
  - *Health and other* (4%): worth 30 cents a dollar to the people who get it, the Oregon Medicaid experiment's $0.20 to $0.40 (Finkelstein, Hendren and Luttmer 2019), which is already net of the free care they would get anyway.
  - The trials' effects are net of what their control groups got elsewhere, so nothing is taken off for what would have come anyway; what is left is funging, whether the agency would have run the service without United Way's money: 85% wouldn't (90% for United Way's own programmes; agencies do adjust their fundraising to the grants they get, Andreoni and Payne 2011). The chain counts at 85% for publication bias and self-reported mentoring outcomes. United Way's own programme spending is grossed up to the trialled programmes' full-cost basis, since its own overhead is already in the cost.
- **Volunteers and co-funders**: where the value is what United Way's own dollars buy (the grants and its own services), nobody else's resources are in it. Where it is an outcome several contributors produce, United Way gets its share of the resources: for tax help, prepared by volunteers with IRS grants, about 30%; for 211, about a tenth.
- **211**: 16.8 million requests in 2024; about half end with the caller getting help worth about $300, of which 211 added 30%; United Way is credited only its share of the cost of finding that help (the agency that gives the help is credited the rest).
- **Tax help**: about 950,000 returns a year; half the filers would have paid a preparer (about $200), and 7% of the $1.8 billion in refunds would have gone unclaimed.
- **Missing data**: every branch × the shared slider (50%, from 10% to 100%), the same step every site model takes where the charity doesn't measure its own outcomes.

A share for effects not modelled (+5%) and the overhead (management and fundraising, 16%) follow.

**Why not money moved?** United Way raises money for other charities, but a gift to United Way is itself passed on: the donor's dollar is the cost, and what it buys is the agencies' services, so the grants count as what the agencies do (the site's rule for grants to other organisations). Its fundraising is overhead, as for every charity, and isn't credited with the gifts it brings in from others.

### What drives the result

- **The missing-data slider**: from 10% to 100% the result runs from 0.002 to 0.020.
- **The discount rate**: the children's earnings gains come 13 to 53 years after the programme (0.005 at 8%, 0.027 at 0.1%).
- **What a child's place costs and how much it does**: $1,200 to $8,000 a year (0.022 to 0.005); 0.05 to 0.3 SD (0.005 to 0.017); 5% to 13% earnings per SD (0.006 to 0.012).
- **The rate between healthy years and income** (your values), as for every income result.

### Biggest uncertainties

- What United Way's grants achieve: the agencies range from food banks to arts programmes, United Way publishes no outcomes for the money as a whole, nor a national split of it by activity (the basic-needs share, 14% to 45%, and the children's, financial and health shares are our judgments).
- Whether the grantees' programmes are like the trialled ones: many youth programmes are lighter-touch than the tutoring and mentoring trials, which the cost per place only partly captures.
- The split between grants, United Way's own services and the cost of running the grants comes from two local United Ways.
- The network figures are Forbes's compilation from local reports, not audited consolidated accounts (there are none).

### What isn't modelled

Homelessness averted by rent help beyond the money itself, youth programmes' effects on crime and teen births beyond earnings, United Way's public-policy work, and the national office's role as fiscal agent for FEMA's Emergency Food and Shelter Program are in the share for effects not modelled, with grants that keep weak agencies going on the other side. Health and deaths aren't counted separately: clinics and shelters among the grants are valued at what recipients would pay for them.

### How this model was checked

The first build (2026-11-03) had three rounds of independent audit (a fresh reviewer each round, with the audit-cea checklist): round 1 (3 high, 7 medium, 8 low) split the model into its five branches and corrected the clients' consumption share; round 2 (1 high, 3 medium, 7 low) replaced a misapplied missing-data step with ranged evidence judgments and fixed attribution; round 3 (0 high, 1 medium, 6 low) passed.

Rebuild (2026-11-04), to the site's current rules: no programme is valued at another model's result, and every branch whose outcome isn't measured carries the missing-data slider. The other grants and own services, valued before at their cost with a judged 60% evidence factor, are now built from the US research on tutoring, mentoring, early learning, job training, financial coaching and Medicaid; every branch takes the missing-data slider; the tax branch's evidence factor no longer discounts the judgments the slider now counts; the unmodelled share no longer includes the youth programmes' lasting gains, which are now modelled. Before the audit below the result had moved from 0.004 to 0.008.

- **Round 1** (1 high, 1 medium, 10 low): the children's chain was shaded for the same doubts in three rows; the evidence factor now covers only publication bias and self-report (0.85), the social-emotional doubt sits only in earnings per SD, and the effect size is the stated average of its anchors (0.18). Funging moved out of the counterfactual rows into each branch's leverage-and-funging row, with a reference class; United Way's own overhead is no longer counted twice on its own services; the own-services share is anchored on Greater Twin Cities' note 15; sources and wording fixed. The result moved from 0.008 to 0.012.

- **Round 2** (1 high, 2 medium, 3 low): the tutoring quote is now cited to the published article whose abstract carries it (the working paper's wording differs and is given too); the after-school quarter of the effect is anchored on after-school evidence (0.09, so 0.16 in all); the funging anchor states how crowd-out bounds it; the own-services share leaves convening out (50%, Greater Twin Cities' note 15); sources added. The result moved from 0.012 to 0.010.

- **Round 3** (0 high, 0 medium, 3 low): passed. Citations given checkable locations (Education Next, Durlak and others' Table 3, the Crossref record of the tutoring article), the funging floor's wording corrected, and shares rounded as the engine gives them; the result is unchanged at 0.010.

### Sources

- United Way Worldwide and Subsidiaries, consolidated financial statements 2024 (Grant Thornton): https://www.unitedway.org/sites/default/files/2025-09/2024%20United%20Way%20Worldwide%20FS%20%281%29.pdf
- Forbes, United Way Worldwide (fiscal year to June 2025): https://www.forbes.com/companies/united-way-worldwide/?list=top-charities
- United Way of Greater Houston, financial statements FY to March 2024: https://unitedwayhouston.org/wp-content/uploads/2022/09/United-Way-of-Greater-Houston-2024-FS-SA.pdf
- Greater Twin Cities United Way, financial statements 2024: https://www.gtcuw.org/wp-content/uploads/2025/10/GTCUW-Financial-Statements-2024.pdf
- United Way of Abilene, 2025 annual report (impact areas): https://unitedwayabilene.org/wp-content/uploads/2025/09/13913_UW_2025_Annual_Report_FNL.pdf
- United Way, 211 requests in 2024: https://www.unitedway.org/news/calls-for-help-jumped-14m-during-2024
- 211 national network, 2022 Annual Impact Survey: https://nj211.org/sites/default/files/documents/2023-02/Impact%20Survey%202022.pdf
- United Way, MyFreeTaxes and VITA fact sheet: https://uwcf.org/wp-content/uploads/2025/01/MFT_and_VITA_One-Pager_1.pdf
- Independent Sector, value of volunteer time: https://independentsector.org/resource/value-of-volunteer-time/
- Kraft and others, "What Impacts Should We Expect From Tutoring at Scale?", Review of Educational Research 2026: https://doi.org/10.3102/00346543261446660
- Raposa and others, "The Effects of Youth Mentoring Programs: A Meta-analysis of Outcome Studies", Journal of Youth and Adolescence 2019: https://doi.org/10.1007/s10964-019-00982-8
- DuBois and others, Big Brothers Big Sisters community-based mentoring RCT, four-year report (June 2025): https://youthrex.com/wp-content/uploads/2025/10/YRS-4-Year-Report_062025.pdf
- Puma and others, Head Start Impact Study final report (US Department of Health and Human Services, 2010)
- James-Burdumy and others, national evaluation of the 21st Century Community Learning Centers program (Mathematica for the US Department of Education, 2005)
- Chetty, Friedman and Rockoff, "Great Teaching: Measuring Its Effects on Students' Future Earnings", Education Next 2012: https://www.educationnext.org/great-teaching/
- Durlak, Weissberg and Pachan, after-school programmes meta-analysis, American Journal of Community Psychology 2010: https://doi.org/10.1007/s10464-010-9300-6
- Herrera and others, Big Brothers Big Sisters community-based mentoring RCT, Children and Youth Services Review 2023: https://doi.org/10.1016/j.childyouth.2022.106742
- Chetty, Friedman and Rockoff, "Measuring the Impacts of Teachers II", American Economic Review 2014: https://www.nber.org/system/files/working_papers/w19424/revisions/w19424.rev2.pdf
- Card, Kluve and Weber, "What Works? A Meta Analysis of Recent Active Labor Market Program Evaluations", JEEA 2018: https://doi.org/10.1093/jeea/jvx028
- Fortson and others, WIA Adult and Dislocated Worker Programs 30-month impacts (Mathematica, 2017): https://www.dol.gov/agencies/eta/research/publications/providing-public-workforce-services-job-seekers-30-month-impact
- Theodos and others, financial coaching RCT, Journal of Economic Behavior & Organization 2018: https://doi.org/10.1016/j.jebo.2018.08.019
- Andreoni and Payne, "Is crowding out due entirely to fundraising?", Journal of Public Economics 2011: https://doi.org/10.1016/j.jpubeco.2011.01.002
- Birkenmaier and others, financial coaching systematic review, Research on Social Work Practice 2026: https://doi.org/10.1177/10497315261445119
- Finkelstein, Hendren and Luttmer, "The Value of Medicaid", Journal of Political Economy 2019: https://www.nber.org/papers/w21308
- Evans, Sullivan and Wallskog, "The impact of homelessness prevention programs on homelessness", Science 2016.
