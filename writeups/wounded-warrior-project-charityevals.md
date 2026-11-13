### Summary

Wounded Warrior Project (WWP) serves US veterans injured in service since 2001 and their families. Our two models of its fiscal 2025 (October 2024 to September 2025) cover every programme. The mental health programmes ($98.7M of $274.6M programme spending) come to **<span data-figure="headline" data-model="wounded-warrior-project-charityevals-mental-health">0.002</span> years of healthy life per $1,000** ([mental health](/wounded-warrior-project/wounded-warrior-project-charityevals-mental-health)); the other six programmes ($175.9M) come to **<span data-figure="headline" data-model="wounded-warrior-project-charityevals">0.01</span>**.

The help reaches US households that already consume about $27,000 a person, so on the site's one log-income scale even large sums are small gains, and most of it competes with free help from the VA and other veteran groups. Over four-fifths of the second model is the benefits service: WWP's representatives win VA disability awards it values at $263.7M (about a year of the added payments plus some back pay).

### What the charity does

- **Mental health** ($98.7M): grants of $35.4M to Warrior Care Network, four academic medical centres (Emory, Massachusetts General Hospital's Home Base, UCLA's Operation Mend and Rush's Road Home) that ran two- and three-week intensive PTSD programmes for 1,286 veterans, outpatient therapy for 2,623 more and treatment for 565 family members. WWP also runs triage and paid counselling (4,204 people), Project Odyssey retreats (1,993), WWP Talk weekly calls (2,254) and complex case coordination (428).
- **Independence Program** ($47.4M): in-home care, therapies and case management for 971 warriors with severe brain or spinal injuries, about $29,000 of outside services each.
- **Connection** ($42.8M): alumni events for 91,214 warriors and family members and peer support groups for 12,705.
- **Financial wellness** ($38.8M): the benefits service, Warriors to Work (1,279 placed in jobs), financial readiness (4,653) and emergency grants ($3.7M to 4,859 warriors).
- **Physical health** ($21.2M): a 90-day coaching programme (1,606), adaptive sports and Soldier Ride (11,593 in all).
- **Community partnerships** ($19.6M, $11.1M of it grants to 39 veteran charities) and **government relations** ($6.1M, chiefly the Major Richard Star Act).

### How the impact happens

Veterans with PTSD who finish trauma-focused therapy have fewer symptoms and less depression for a year or more. Benefits awards, jobs, grants and paid care raise the household's consumption. Events and peer groups ease isolation for a while. Lobbying raises the chance that Congress pays combat-injured retirees in full.

### How the models work

**Mental health** (wellbeing template). The intensive programmes' effect is the trials of trauma-focused CBT in military personnel against waitlist or usual care (Kitchiner et al. 2019: 1.22 SD on PTSD symptoms), put on the depression scale at Warrior Care Network's own ratio (depression falls about 0.7 as much as PTSD, Held et al. 2024), fading over about four years (Warrior Care Network's veterans kept 78% of the gain at a year), and then adjusted for trust in the trials (0.75: the one trial of the two-week format, Foa et al. 2018, found about half the pooled effect), for therapy veterans would have got anyway (0.7), for WWP's share of the resources (0.8, and less for the donated public service announcements that recruit veterans) and for completion (0.9). The centres' outpatient therapy gets 0.6 of that effect and WWP-paid counselling (about 3,700 people, from 22,149 sessions) 0.45; Project Odyssey, WWP Talk and coordination a small one from the literature on light-touch support. The intensive branch is measured (WWP's count meets trials of the same therapies, including Foa et al. 2018's of the daily format); the other two are discounted for missing data. Suicides averted (the rate of veterans without PTSD × PTSD's excess risk × the share removed, in every branch at its own effect) are valued the site's way.

**Other programmes** (domestic-services template). Each branch is on the site's log-income or life-satisfaction scale:
- Benefits: WWP's $263.7M over the years it stands for (about 1.2), spread over about 17,000 veterans' households, lasting about 10 years on average over the awards WWP's help changes, of which 40% wouldn't have come at the same time through another free representative; less the taxpayers' cost (the same dollars at the marginal cost of public funds, 1.2, spread over richer payers) and the delay to other claimants, with credit shared with the VA's cost of deciding the claims (WWP's share about 0.8).
- Jobs: the placements' pay, net of taxes and what the household had before, for about a year, a quarter of it due to WWP.
- Emergency grants (measured: cash paid), financial readiness, the Independence Program's services at their value to the household, and the community partnerships' grants as services to veterans' households.
- Connection and physical health: small life-satisfaction gains for months, and a small number of suicides averted by peer groups; caregivers' respite in the Independence Program.
- Advocacy: the chance the Star Act becomes law by January 2029 (8%; it was left out of both chambers' 2027 defence bills), half of it due to the veterans' groups and 4% of that to WWP's fiscal-2025 work, times $10,000 a person a year for 54,000 retirees' households, net of taxpayers, over the site's years for a won law, and half as much again for the rest of WWP's agenda.

### What drives the result

The benefits service is over four-fifths of the second model; in the mental-health model the intensive programmes and the therapy branch are about 90%. The swings: how many years of payments an award adds, the veterans' consumption, the counterfactual for awards, the missing-data discount and the site's value of a WELLBY.

### Biggest uncertainties

- What WWP's "economic impact" of benefits means (a year of the added payments, plus back pay?) and how many veterans it covers; neither is published.
- How many of those awards free representatives (DAV, the VFW, the American Legion, county officers) would have won as soon.
- Whether the intensive programmes beat the PTSD care the VA offers free; Warrior Care Network has no controlled trial.
- Whether the Star Act passes, and how much of that is WWP's doing.

### What isn't modelled

The resource centre's 64,188 contacts, the backpacks for newly wounded service members, and the stigma some veterans feel at WWP's fundraising images, sized in the unmodelled shares. Donated public service announcements ($63.8M at rate card) are left out of cost but lower WWP's share of the credit.

### How this model was checked

The models passed the site's mechanical checks (audit-model, check, simulation-check, normalization-audit) before the independent audit rounds recorded in audits/wounded-warrior-project-charityevals/ and audits/wounded-warrior-project-charityevals-mental-health/; what each round found and what changed is listed there. Round 1 (both models: fix needed) led to: the unmodelled shares replaced by estimated rows (suicides averted by peer groups and support programmes, caregivers' respite, delay to other VA claimants) with small sized remainders; the effect's duration re-anchored on Held et al. 2024 (4.2 years, not 3); the massed-therapy trial blended into the effect; counselling reached through its sessions rather than everyone referred; the waitlist discount kept in the counterfactual only; donated announcements and the VA's adjudication counted in WWP's share of the credit; the Star Act's chance re-dated after its omission from the 2027 defence bills and WWP's share spread over the years that can influence it; no implementation discount on dollars already discounted for trust. Round 2 passed the second model (0 high) and failed the mental-health model on one high (an own life-satisfaction mapping stacked on the site's conversion, now removed); its other findings led to: the massed-therapy trial no longer blended in twice (it is inside the review's pool), a counselling dose anchored on the review's direct comparison, Home Base's own funders in WWP's share, the VA's cost per claim re-anchored on its whole operating account over 3 million claims, and the donated announcements compared with full cost.

### Sources

- [WWP Form 990, year to 30 September 2025](https://www.woundedwarriorproject.org/media/fbopl3fq/fy2025-wounded-warrior-project-form-990.pdf): programme spending and the year's counts (Schedule O).
- [WWP audited consolidated financial statements, fiscal 2025](https://www.woundedwarriorproject.org/media/ba0hoqdy/2025-wounded-warrior-project-consolidated-financial-statements.pdf).
- [WWP 2025 Annual Report](https://www.woundedwarriorproject.org/media/fznl5s34/wwp-fy25-annual-report.pdf).
- [Kitchiner et al. (2019)](https://europepmc.org/article/MED/31762951), [Held et al. (2024)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11110869/), [Held et al. (2021)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8364877/).
- [MOAA on CBO's Star Act estimates (2026)](https://www.moaa.org/content/publications-and-media/news-articles/2026-news-articles/benefits/what-will-it-cost-to-help-combat-injured-veterans-inside-the-latest-cbo-figures/).
