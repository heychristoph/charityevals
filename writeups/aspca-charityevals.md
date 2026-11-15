### Summary

The ASPCA runs an animal hospital, adoption centre and low-cost clinics, moves animals from crowded shelters to places with more adopters, neuters, answers poison calls, rescues animals from disasters and cruelty, funds other shelters and lobbies for animal laws across the United States. Our model of its work for dogs, cats and horses comes to **<span data-figure="headline" data-model="aspca-charityevals">0.0001</span> years of healthy life per $1,000**: care for one animal at a time reaches few animals per dollar. Its farm-animal work, modelled separately, comes to **<span data-figure="headline" data-model="aspca-charityevals-farm-animals">−0.001</span> years of healthy life per $1,000**: the laws it defends cost shoppers more, at the site's values, than the hens' and sows' gain.

### What the charity does

In 2025 the ASPCA spent $421.8m: $158.3m on shelter and veterinary services (including $22.1m of grants), $90.0m on public education and communications, $67.5m on policy, response and engagement (including $7.1m of grants and the farm animal welfare team) and $105.9m on fundraising and management. It placed about 70,900 animals in homes (nearly 29,000 of them relocated from crowded shelters), treated 109,700 animals, supported 129,200 spay/neuter surgeries (nearly 80,000 in its own clinics), took 334,500 poison-control cases, helped 20,700 animals in disasters and 1,300 in cruelty cases, distributed 2 million pet meals, gave $29.1m to 1,085 organisations, trained 700 vets in person and 14,400 shelter staff online, and backed three California puppy-mill laws while New York's pet-shop ban, which it led, took effect. Its farm work fought federal and state rollbacks of cage and crate laws and promoted higher-welfare products.

### How the impact happens

Each branch counts the days of an animal's disabling pain it spares, on Ambitious Impact's pain scale, then converts dogs and cats (and the few horses) into chicken-equivalent pain days with the shared welfare ranges. Placements spare animals years in worse conditions; treatment, poison control and disaster response spare days to weeks of pain; cruelty cases end months to years of neglect and, through prosecutions and training, deter some more; neutering spares the short, hard lives of unowned kittens and puppies never born; grants buy shelters extra placements; trained vets and staff treat better for years; the puppy-mill laws spare dogs commercial breeding and transport; adoption campaigns add adoptions. Owners whose pets the low-cost clinics treat, who get pet food, whose pets are rescued in disasters, who call poison control or whom grants help keep their pets gain life satisfaction, counted in WELLBYs. The farm model counts hens and sows kept out of cages and crates, less the laws' compliance costs from the regulator's analysis of California's Proposition 12.

### How the model works

Costs are the 2025 audited accounts with fundraising and management spread over the programmes; fees for poison control ($26.9m, which roughly pays its way) and for the clinics, hospital, spay/neuter and adoptions ($2.6m) come off the cost and lower those branches' credit, since donors didn't pay for that part. The farm share of the policy and education lines is our judgment, one shared figure both models read; the farm model's spending on defending state laws starts from the ASPCA's reported lobbying ($1.85m on every issue). Reach is the ASPCA's own counts from its Form 990; grants' extra placements, the dogs the laws cover and the campaigns' extra adoptions are our judgments. The effects per animal are our judgments, anchored where they can be on the Dogs Trust model and on studies of dog lifespan and kitten survival. Each branch has its own adjustments for evidence, what would have happened anyway, the ASPCA's share of the resources, delivery and missing data.

### What drives the result

At the site's default weight on animal suffering, the owners' life satisfaction counts for nearly all of the companion-animal result: several hundred WELLBYs a year (most from the clinics, then pet food) outweigh the days of pain spared to some hundreds of thousands of animals. Their gain, the share of owners it eases and whether the care would have happened anyway drive it. Among the animals, neutering and placements give most of the days spared. The farm model is driven by the laws' compliance costs, the chance that a federal override of state cage and crate laws passes without the coalition's opposition and the share of it the opposition removed, how many hens and sows would go back into cages if the laws fell, and the ASPCA's share of the coalition's spending.

### Biggest uncertainties

- How much life satisfaction owners gain when the clinics treat their pets, and how many of them are eased, all our judgment.
- How much suffering each kind of care spares an animal: no study measures it.
- The share of the ASPCA's policy and education spending that goes on farm animals, which the accounts don't give.
- Whether the 2025 opposition changed the chance of a federal override of state farm-animal laws.

### What isn't modelled

Animals saved from euthanasia count only through the suffering they are spared, as in every animal model. Adopters' own wellbeing is counted as zero (studies of pet ownership find no consistent effect). Much of the public education spending is mail and television that also raises money; we count it all as programme cost, as the accounts do.

### How this model was checked

Mechanical checks (scripts/audit-model.ts, scripts/check.ts, simulation-check, normalization-audit) and independent audit rounds with the audit-cea skill, kept in audits/. Round 1 (companion animals: 2 high, 3 medium, 5 low) limited the owners' gain to owned animals, added owners helped by pet food, disaster response, poison control and surrender-prevention grants, split the fees between poison control and the clinics, anchored the owners' gain and the care's counterfactual on studies of caregiver burden and access to veterinary care, and removed overlaps between the counts. Round 1 (farm animals: 1 high, 6 medium, 4 low) rebuilt the ASPCA's spending on the defence from its reported lobbying, set the coalition's total to the one our model of The Humane League implies, drew the override as the same single event as in that model, and corrected two quotes and the state repeal fights' weight. Round 2 (companion animals: 1 high, 3 medium, 1 low) built the owners' gain from a wellbeing gap in standard deviations at the site's shared rate, re-anchored the share of owners eased on the clinics' case mix, took the fees off the cost as well as the credit's base, and counted one owner per household of about 1.6 pets, with disaster meals taken off the food count; round 2 passed the farm model (0 high, 2 medium), whose override chance and the opposition's part are now drawn together. Round 3 passed both (companion animals 0 high, 2 medium; farm animals 0 high, 1 medium); after it the share of owners eased applies to the clinics only (the other kinds of help come when owners are already in trouble), the fees come off the cost after overhead, and two sources gained links, checked by a verification round. A later verification round checked the defended laws' compliance costs (the site's rule for won rules) and the figures shared with our models of The Humane League, which took the farm result below zero.

### Sources

- [ASPCA audited financial statements 2025](https://www.aspca.org/sites/default/files/2025-aspca-final-issued-audited-financials.pdf)
- [ASPCA Form 990 for 2025](https://www.aspca.org/sites/default/files/2025-aspca-form-990-pdc.pdf)
- [ASPCA 2025 annual report](https://www.aspca.org/2025-annual-report)
- [ASPCA, What lawmakers did for farm animals in 2025](https://www.aspca.org/news/what-lawmakers-did-farm-animals-2025)
- [Teng et al. 2022, Life tables for companion dogs in the UK](https://pmc.ncbi.nlm.nih.gov/articles/PMC9050668)
- [Nutter et al. 2004, Reproductive capacity of free-roaming cats and kitten survival](https://doi.org/10.2460/javma.2004.225.1399)
- [USDA, Chickens and Eggs (December 2025)](https://esmis.nal.usda.gov/sites/default/release-files/795695/ckeg1225.pdf)
