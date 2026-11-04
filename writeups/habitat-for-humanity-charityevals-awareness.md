### Summary

Habitat for Humanity International (HFHI) spent $24.3 million in the year to June 2025 on public awareness and education: Habitat's media, website, social media and learning events. Its housing-policy advocacy, partly booked in its other two programmes (about $3.5 million by our estimate, taken out of those programmes' models), is counted here with it. In the US the Habitat network counts 142 policy wins in the year and $6.65 billion of state and local money for home affordability attached to them; worldwide, the Home Equals campaign counts $1.24 billion of government money for informal settlements and 7.9 million people since it began in May 2023. Our estimate of a dollar given to HFHI for this work is **<span data-figure="headline" data-model="habitat-for-humanity-charityevals-awareness">0.007</span> years of healthy life per $1,000**, about the same as its US building work ([US model](/habitat-for-humanity/habitat-for-humanity-charityevals), <span data-figure="headline" data-model="habitat-for-humanity-charityevals">0.005</span>).

It is low for three reasons. Public money is not free: it comes from taxpayers, so only its move from those who pay to poorer households counts, and in the US, after programme costs, the in-kind form of housing and the cost of raising taxes, that move gains almost nothing on the site's log-income scale. Research on advocacy finds most campaigns change nothing. And HFHI is one voice among many in the coalitions behind each win. Nearly all the value is the Home Equals campaign's, where the people helped are far poorer than those who pay. Habitat measures none of this itself, so both branches take the site's shared discount for missing data.

### What the charity does

The Cost of Home campaign (FY2020–24) organised Habitat affiliates, homeowners and volunteers to push state and local governments for down-payment help, housing trust funds, repair programmes and land-use reforms; HFHI's campaign raised $6.8 million, Habitat organisations put in $23.7 million, and HFHI gave more than 240 grants to affiliates. It continues as Habitat Voices in Action. Internationally, Home Equals asks governments to upgrade informal settlements and secure residents' tenure. The rest of the programme is Habitat's communications: media, habitat.org, 2.38 million social-media followers and learning events.

### How the impact happens

1. Habitat organisations and their partners push for a housing policy; some of the time the push decides whether it passes, and when.
2. The money the policy carries reaches lower-income households as down-payment help, repairs, cheaper homes or settlement upgrades, enjoyed over the years the housing lasts.
3. The money comes from taxpayers or other public spending, so the gain is the move from the payers to poorer households, less the cost of raising it.

### How the model works

The model follows the site's template for policy work, with two branches:

- **US housing advocacy.** Habitat's count of the money its network's wins carried, the average of the two years of Habitat Voices in Action ($3.5 billion; $6.65 billion in FY2025, $369 million in FY2026), and of the people it reaches (about $4,600 a person). From that is taken what the same dollars cost those who pay, at the national accounts' $58,517 a person: state and local taxes are roughly proportional to consumption (ITEP's Who Pays), and raising public money costs about 1.2 times the money (Dahlby 2008). The two nearly cancel. A fifth of the money is a lasting stream, counted for the site's years a won reform counts; the rest once.
- **Home Equals.** The same chain, country by country over 13 Habitat countries (each region a quarter, since Home Equals publishes no split), for $590 million a year at about $157 a person, with 60% reaching households. Informal-settlement households consume half their country's survey mean (the household survey's scale, the site's rule for consumption baselines); those who pay are taxed on the national-accounts mean, by consumption taxes that are mildly progressive because the poor buy informally (Bachas, Gadenne and Jensen, 2024), with a cost of raising public money of 1.2 (Auriol and Warlters, 2012, for African countries).
- **What the advocacy caused.** From the research: of 98 random US lobbying campaigns, about 60% changed nothing (Baumgartner and colleagues, 2009), and in field experiments organised constituent contact raised a legislator's support for a bill by about 12 percentage points (Bergan and Cole, 2015), while lobbyists' information alone moved none (Camp and colleagues, 2023). So 15% of the US money (10% for Home Equals) would not have come then without the coalitions' advocacy.
- **HFHI's share.** Habitat organisations are about 15% of the coalitions' resources in the US (20% in Home Equals), and HFHI about a fifth of the Habitat network's (two fifths for Home Equals); and Habitat's own counts are taken at 60% (50%) for double counting.

The general awareness work has no outcome of its own beyond the advocacy: its effect on giving and volunteering is fundraising, so its cost is counted and nothing is added for it.

### What drives the result

- **How much of the Home Equals money reaches households**, **how much poorer they are than those who pay**, and **what the housing is worth to them against cash**: across these ranges the result runs from below zero to several times the estimate.
- **How much we count a programme whose results aren't measured**, and **how much the next dollar does against the average one** (site-wide sliders).
- **How much of the money the advocacy caused**, and **Habitat's share of the coalitions**.

### Biggest uncertainties

- Habitat's money and people counts are its network's self-reports, with no published method, and swing eighteenfold from one year to the next.
- How much any one group's advocacy caused is barely measured anywhere; the research gives a range, not a figure for Habitat.
- Who pays for the money: new taxes on the better-off would make the US branch worth something; money taken from other programmes for poor households would make it a loss. The site's range, computed on a log scale, can't show a result below zero, which this one can reach.

### What isn't modelled

As a share of what households gain: wins that carry no money (zoning and land-use reforms, which in US cities add about 0.8% to the housing stock within a decade, mostly at the upper end of rents: Stacy and colleagues, 2023; land-tenure rules abroad) and any change in public attitudes from the awareness work are a small positive share on top.

### How this model was checked

Three rounds of independent review each found a high finding. Round 1 (2 high, 6 medium, 6 low): HFHI's share of the network's advocacy misread the Cost of Home report (0.5 to 0.2); the payers' consumption had no reference class (rebuilt on ITEP's Who Pays, plus the cost of raising public money). Round 2 (2 high, 4 medium, 5 low): the two branches split the gap between survey and national-accounts consumption in opposite ways (now one shared judgment, gap_top_share); Home Equals averaged consumption before the log (now country by country). Round 3 (1 high, 5 medium, 5 low): Bangladesh's national-accounts consumption was a second copy of the site's fact (fixed after the round: it now reads @bangladesh.consumption_per_person_2024, the value unchanged; not re-reviewed). On 4 November 2026 the site's rule for consumption baselines (survey consumption of the people served, docs/normalization.md 2.14) replaced gap_top_share: households are on the survey scale, payers on the national accounts; the US branch's move to the survey scale raised the result 1.3 times and dropping the gap from the Home Equals baselines a further 2.6 times; two verification rounds checked the changes, the second with no high finding. Open: the unmodelled share has no derivation (us_recipient_share is a formula of ranged inputs); the site's log-scale range can't show a negative result (src/engine/uncertainty.ts).

### Sources

- Habitat for Humanity International, [audited consolidated financial statements, FY2025](https://www.habitat.org/media/36766/download), and [Form 990, FY2025](https://www.habitat.org/media/36761/view) (Schedule O: Home Equals; Schedule C: lobbying).
- Habitat for Humanity, [FY2025 annual report](https://www.habitat.org/multimedia/annual-report-2025/) (advocacy), [Advocacy in action, FY2026](https://www.habitat.org/advocate/united-states/habitat-voices-in-action/advocacy-in-action) and the [Cost of Home cumulative report FY2020–24](https://www.habitat.org/media/26296/view).
- Baumgartner, Berry, Hojnacki, Kimball and Leech (2009), [Lobbying and Policy Change: Who Wins, Who Loses, and Why](https://fbaum.unc.edu/books/lobby/lobbying-synopsis.htm), University of Chicago Press.
- Bergan and Cole (2015), [Call your legislator: a field experimental study of the impact of a constituency mobilization campaign on legislative voting](https://doi.org/10.1007/s11109-014-9277-1), *Political Behavior*; Bergan (2009), [Does grassroots lobbying work?](https://doi.org/10.1177/1532673x08326967), *American Politics Research*.
- Camp et al. (2023), [The limits of lobbying: null effects from four field experiments in two state legislatures](https://doi.org/10.1017/xps.2022.25), *Journal of Experimental Political Science*.
- Stacy et al. (2023), [Land-use reforms and housing costs](https://doi.org/10.1177/00420980231159500), *Urban Studies*.
- Institute on Taxation and Economic Policy (2024), [Who Pays? 7th edition](https://itep.org/whopays-7th-edition/); Dahlby (2008), *The Marginal Cost of Public Funds: Theory and Applications*, MIT Press; Auriol and Warlters (2012), The marginal cost of public funds and tax reform in Africa, *Journal of Development Economics*.
- Bachas, Gadenne and Jensen (2024), [Informality, consumption taxes, and redistribution](https://doi.org/10.1093/restud/rdad095), *Review of Economic Studies*.
- Olsen (2003), Housing programs for low-income households, in Moffitt (ed.), *Means-Tested Transfer Programs in the United States*.
- Bureau of Labor Statistics, [Consumer Expenditures in 2024](https://www.bls.gov/news.release/archives/cesan_12192025.htm); World Bank, [World Development Indicators](https://data.worldbank.org/indicator/SI.SPR.PCAP) (survey mean consumption).
