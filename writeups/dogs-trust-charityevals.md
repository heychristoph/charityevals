### Summary

Dogs Trust rehomes dogs across the UK and Ireland, helps owners with problem behaviour, fosters the dogs of people escaping domestic abuse, campaigns for dog welfare laws and, through its sister charity Worldwide Veterinary Service (WVS), treats, neuters and vaccinates dogs overseas. Our model of everything but rabies control comes to **<span data-figure="headline" data-model="dogs-trust-charityevals">0.00005</span> years of healthy life per $1,000**, far below other animal charities on the site: care for one dog at a time reaches few animals per dollar. Its rabies vaccination, modelled separately, comes to **<span data-figure="headline" data-model="dogs-trust-charityevals-rabies">0.5</span> years of healthy life per $1,000**, by preventing human deaths.

### What the charity does

In 2025 Dogs Trust spent £162.8m: £64.4m on rehoming (about 10,000 dogs rehomed, 3,546 fostered), £20.0m on prevention (a behaviour support line for 15,639 dogs, Dog School until August, one-to-one coaching), £6.5m on publicity and campaigns, £26.1m on international work and £45.9m on raising funds. Overseas, WVS vaccinated 2.2 million dogs against rabies, treated 158,647 animals and sterilised 43,444; Dogs Trust Ireland rehomed 859 dogs and Dogs Trust Bosnia is winding down a neutering programme of more than a decade.

### How the impact happens

Each branch counts the days of a dog's disabling pain it spares, on Ambitious Impact's pain scale, then converts dogs (and the cats and other animals WVS treats) into chicken-equivalent pain days with the shared welfare ranges. Rehoming and behaviour support spare dogs distress for the years they live in a better home; Freedom and the homelessness vet scheme do the same for a few months; treatment overseas spares weeks of pain, and the vets WVS trains treat better for years; neutering spares the short, hard lives of free-roaming pups that are never born; the 2025 import law, which Dogs Trust campaigned for over ten years, spares smuggled puppies. Owners given behaviour advice, survivors of domestic abuse who could leave because Freedom kept their dog (and their children, a side effect), and homeless owners helped to keep their dogs gain life satisfaction, counted in WELLBYs; fewer free-roaming dogs also means fewer people bitten, a side effect counted in healthy years. Rabies vaccination prevents human deaths and is a direct-health model of its own.

### How the model works

Costs are the 2025 accounts with fundraising spread over the programmes. Reach is Dogs Trust's and WVS's own counts, with our judgments for the sterilisations its overseas grants pay for and for Bosnia. The effects per dog are our judgments: no study measures how much less a rehomed, coached or treated dog suffers. Each branch has its own adjustments for evidence, what would have happened anyway, Dogs Trust's share of the resources (volunteers, foster carers and partners), delivery and missing data. The rabies model takes deaths averted per dose from Mission Rabies' programme in Goa, India (Gibson et al. 2022: 80 deaths averted with 426,119 doses, human rabies down to zero), adjusted for WVS's other campaigns.

### What drives the result

At the site's default weight on animal suffering, the people the behaviour line, Freedom and the homelessness scheme help count for most of the dog-welfare model's result, and fewer dog bites overseas for much of the rest; among the dogs, neutering and treatment overseas give most of the days spared, and rehoming, which takes most of the money, a few percent. The rabies model is driven by how often rabid dogs kill people where WVS vaccinated in 2025 against Goa, how well its campaigns keep coverage up, and the share of international spending that goes on rabies.

### Biggest uncertainties

- How much a rehomed, coached or neutered-against dog's suffering changes, all our judgment.
- Freedom's effect on survivors' wellbeing and how much of their leaving is owed to the dog's foster care.
- Whether WVS's often one-off vaccination campaigns protect people as Goa's sustained one did.
- The split of international spending between rabies and other work, which the accounts don't give.

### What isn't modelled

Adopters' own wellbeing is counted as zero (studies of pet ownership find no consistent effect). Dogs saved from euthanasia count only through the suffering they are spared, as in every animal model. Publicity spending has no result of its own and counts only as cost. WVS's education of 5 million people is not counted separately.

### How this model was checked

Mechanical checks (scripts/audit-model.ts, scripts/check.ts, simulation-check, normalization-audit) and independent audit rounds with the audit-cea skill, kept in audits/. Round 1 (dog welfare: 4 high, 4 medium, 6 low) led to rows for owners' wellbeing in prevention, the survivors' children, how long the survivors' gain lasts, and Freedom's counterfactual and credit as separate rows; then to births averted per neutering built from measured litter size and pup survival (Paul et al. 2016), the sterilised animals' own surgery and pregnancies, a branch for the vets WVS trains, the other laws Dogs Trust campaigned for, and the people's gains counted as aims rather than side effects. Round 1 (rabies: 1 high, 4 medium, 8 low) moved the age split of rabies deaths into the shared facts, set the delivery adjustment to 1, tied the credit to the full cost of a dose, split external validity into incidence and coverage, and re-anchored the rabies share of international spending (now 20%). Round 3 (a verification round each) passed the rabies model and left one high on the dog-welfare model, the owners' gain, now split into the share of owners whose problem eases and the gain for them, with a named reference class; round 4 verified it. Round 2 (dog welfare 4 high; rabies 2 high) led to the owners' count from the report (9,500), owners' and survivors' gains discounted over their years with one counterfactual each, homeless owners' wellbeing, fewer dog bites from neutering, the rabies credit as Dogs Trust's spending per dose over the full cost (vaccine included), and WHO's age split of rabies deaths. Later rounds are in audits/.

### Sources

- [Dogs Trust Annual Report 2025](https://docs.dogstrust.org.uk/Annual-Report-2025.pdf)
- [Gibson et al. 2022, Elimination of human rabies in Goa, India](https://pmc.ncbi.nlm.nih.gov/articles/PMC9120018)
- [Teng et al. 2022, Life tables for companion dogs in the UK](https://pmc.ncbi.nlm.nih.gov/articles/PMC9050668)
- [Paul et al. 2016, early life mortality in free-ranging dogs](https://pmc.ncbi.nlm.nih.gov/articles/PMC4726281)
- [Mission Rabies, 2025: a year of impact](https://missionrabies.com/en/news/2025-a-year-of-impact)
- [Pawłowska-Muc et al. 2023, life satisfaction of women experiencing domestic violence](https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2023.1073612/full)
- [WHO rabies fact sheet](https://www.who.int/news-room/fact-sheets/detail/rabies)
- [GOV.UK: pet smuggling crackdown with new law](https://www.gov.uk/government/news/pet-smuggling-crackdown-with-new-law)
