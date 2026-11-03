### Summary

United Way is a network of about 1,100 local United Ways in the US, led by United Way Worldwide, that raises money mostly through workplace giving campaigns and spends it on grants to local social-service agencies, the 211 helplines, free tax filing and programmes of its own. Our estimate for the whole network's programme spending is **<span data-figure="headline" data-model="united-way-charityevals">0.004</span> years of healthy life per $1,000**.

That is far below the global-health charities on the site, mainly because the help goes to people in the US, who consume around $41,000 a year each (the poorest fifth about $39,000): on the site's one log-income scale a dollar of food or rent help does about a sixtieth of what it does for a household living on about $2 a day, and the services are bought at US prices. Most of United Way's grants and its own programmes also publish no outcome data, so they are valued at what they cost with a wide discount for thin evidence.

### What the charity does

Each local United Way is a separate charity with its own board and accounts; United Way Worldwide, the national office ($77 million spent in 2024), is funded by the locals' dues and runs the brand, network support and donor-advised giving. Across the network (Forbes's compilation, fiscal year to June 2025) $3.5 billion was spent, $2.9 billion of it on programmes. No network-wide split is published; we split it from two large local United Ways' audited accounts (Greater Houston, Greater Twin Cities) and United Way's own counts:

| Branch | Spending | How it is valued |
|---|---|---|
| Grants for basic needs (food, shelter, rent and utility help) | about $420 million (15%) | near cash, at what the help is worth to the household |
| Other grants (education, child care, youth, health, financial stability) | about $1.26 billion (43%) | at what the services are worth to the people who get them, with a wide evidence discount (no outcome data for the grants; mixed evidence for their kind of work) |
| United Way's own programmes (early learning, reading, coaching, and the staff who run the grantmaking) | about $1.05 billion (36%) | the 60% that is services, as the other grants; the rest is the cost of running the grants |
| 211 helplines (United Way's share) | about $125 million (4%) | help callers find that they wouldn't have found otherwise |
| Free tax filing (VITA, MyFreeTaxes) | about $40 million (1%) | fees saved and credits that would have gone unclaimed |

### How the model works

Every branch counts as income to the people helped, on the site's log scale at the clients' consumption (70% of the US average per person: the poorest fifth of households consume 67% of the average person's), valued at the shared value of a doubled income and converted to healthy years by the site's rate.

- **Grants**: a grantee spends about 82% of a dollar on services; basic-needs help is worth about 90% of its cost to the household, other services about 70% (low-income recipients value Medicaid at well under its cost; child care or tax help can be worth its full cost).
- **What would have happened anyway**: 70% of the basic-needs help, and 60% of the other services (which have more public substitutes, such as public pre-K), wouldn't have come from government, other charities or family. Emergency help is rationed: in Chicago, people who asked for rent help after the funds ran out entered shelters far more often than those helped (Evans, Sullivan and Wallskog, Science 2016).
- **Volunteers and co-funders**: where the value is what United Way's own dollars buy (the grants and its own services), nobody else's resources are in it. Where it is an outcome several contributors produce, United Way gets its share of the resources: for tax help, prepared by volunteers with IRS grants, about 30%; for 211, about a tenth.
- **Thin evidence**: the other grants and United Way's own services count at 60% (from 30% to 90%): their kind of work has trials with real effects and many null results, and the grantees' quality is unmeasured. The site's slider for programmes with no data at all (default 50%) is the reference; it isn't applied, since these programmes have outputs and an evidence base, and the site's proxy rows would need comparable models of US social services, which it doesn't have yet.
- **211**: 16.8 million requests in 2024; about half end with the caller getting help worth about $300, of which 211 added 30%; United Way is credited only its share of the cost of finding that help (the agency that gives the help is credited the rest), about a tenth.
- **Tax help**: about 950,000 returns a year; half the filers would have paid a preparer (about $200), and 7% of the $1.8 billion in refunds would have gone unclaimed.

A share for effects not modelled (+10%) and the overhead (management and fundraising, 16%) follow. Basic-needs grants give about 29% of the result, the other grants 35%, United Way's own services 21%, 211 8% and tax help 7%.

**Why not money moved?** United Way raises money for other charities, but a gift to United Way is itself passed on: the donor's dollar is the cost, and what it buys is the agencies' services, so the grants count as what the agencies do (the site's rule for grants to other organisations). Its fundraising is overhead, as for every charity, and isn't credited with the gifts it brings in from others.

### What drives the result

- **The rate between healthy years and income** (your values), as for every income result.
- **What the other services are worth** against cash (30 to 100 cents a dollar) and how far they would have come anyway.
- **How poor the clients are** (55% to 85% of average US consumption per person): the poorer, the more a dollar does.
- **The evidence discount** on the other grants and own services.

### Biggest uncertainties

- What United Way's grants achieve: the agencies range from food banks to arts programmes, and United Way publishes no outcomes for the money as a whole, nor a national split of it by activity (the basic-needs share, 14% to 45%, is our judgment).
- The split between grants, United Way's own services and the cost of running the grants comes from two local United Ways.
- The network figures are Forbes's compilation from local reports, not audited consolidated accounts (there are none).

### What isn't modelled

Homelessness averted by rent help beyond the money itself, lasting benefits of early-learning and youth programmes, United Way's public-policy work, and the national office's role as fiscal agent for FEMA's Emergency Food and Shelter Program are in the share for effects not modelled, with grants that keep weak agencies going on the other side. Health and deaths aren't counted separately: clinics and shelters among the grants are valued with the other services.

### How this model was checked

Three rounds of independent audit (a fresh reviewer each round, with the audit-cea checklist), plus the site's mechanical checks (lint and invariants: no violations).

- **Round 1** (3 high, 7 medium, 8 low): free tax help, which publishes returns and refunds, had been discounted as if it had no data; the grants weren't split by activity; and the clients' consumption share was below its own anchor (the poorest fifth's spending is per household, and their households are smaller). The model was rebuilt in five branches (basic-needs grants, other grants, own services, 211, tax help), with a new shared fact for the poorest fifth's household size, funging counted once, the cost of running the grants counted as cost rather than value, and 211's cost from the national network's revenue.
- **Round 2** (1 high, 3 medium, 7 low): the site's missing-data slider was being applied inside the chain to programmes that do have an evidence base; it was replaced by wide ranged evidence judgments. Volunteers no longer take a share of value that only United Way's dollars bought; the other services got their own counterfactual; the basic-needs share was lowered to its anchors; IRS grants were added to the resources behind tax help.
- **Round 3** (0 high, 1 medium, 6 low): passed. The basic-needs share was re-anchored (25%, from Tulsa's 14% to 45%) and the remaining wording, citations and ranges fixed.

### Sources

- United Way Worldwide and Subsidiaries, consolidated financial statements 2024 (Grant Thornton): https://www.unitedway.org/sites/default/files/2025-09/2024%20United%20Way%20Worldwide%20FS%20%281%29.pdf
- Forbes, United Way Worldwide (fiscal year to June 2025): https://www.forbes.com/companies/united-way-worldwide/?list=top-charities
- United Way of Greater Houston, financial statements FY to March 2024: https://unitedwayhouston.org/wp-content/uploads/2022/09/United-Way-of-Greater-Houston-2024-FS-SA.pdf
- Greater Twin Cities United Way, financial statements 2024: https://www.gtcuw.org/wp-content/uploads/2025/10/GTCUW-Financial-Statements-2024.pdf
- United Way, 211 requests in 2024: https://www.unitedway.org/news/calls-for-help-jumped-14m-during-2024
- 211 national network, 2022 Annual Impact Survey: https://nj211.org/sites/default/files/documents/2023-02/Impact%20Survey%202022.pdf
- United Way, MyFreeTaxes and VITA fact sheet: https://uwcf.org/wp-content/uploads/2025/01/MFT_and_VITA_One-Pager_1.pdf
- Independent Sector, value of volunteer time: https://independentsector.org/resource/value-of-volunteer-time/
- Evans, Sullivan and Wallskog, "The impact of homelessness prevention programs on homelessness", Science 2016.
