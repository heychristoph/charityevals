### Summary

Oxygen Access Project helps state hospitals in Gombe State, Nigeria, find children whose blood oxygen is dangerously low and treat them with oxygen. Our model counts the children's deaths averted in its first financial year, 2025, against what it spent, and comes to **{{result}} years of healthy life per 1,000 dollars**. The figure is very uncertain: the studies of oxygen systems are mostly before-after comparisons, the one randomised trial in Nigeria is mixed, and the charity hasn't yet reported who got oxygen or who died.

### What the charity does

The charity was incubated by Ambitious Impact in 2024 and registered in England and Wales in February 2025. From April 2025 it ran weekly in 23 secondary facilities in Gombe State, with the state hospitals board and the Nigerian NGO Taimaka, its implementing partner. Staff measure admitted children's blood oxygen with pulse oximeters, record the ones below 90% and give them oxygen. The charity provides training, tools and maintenance, and runs the weekly reporting. About {{row:oap_hypoxaemic_recorded}} children were recorded below 90% from April to December 2025.

It spent £85,293 in its first period (14 February to 31 December 2025, independently examined accounts). That includes a £23,622 grant to Taimaka and the founder's salary, which Ambitious Impact paid.

### How the impact happens

Low blood oxygen (hypoxaemia) is common in children admitted with pneumonia and other serious illnesses, and it makes death several times likelier. You can't reliably see it without a pulse oximeter. Once it is found, oxygen keeps the child alive while the illness is treated. Many Nigerian secondary hospitals had no working oximeters or concentrators.

### How the model works

- **Cost:** the 2025 accounts in full, at the year's average exchange rate, with the founder's donated salary counted.
- **Children:** the {{row:oap_hypoxaemic_recorded}} hypoxaemic children recorded. The model works back to the children screened, using the share found hypoxaemic in a study of Nigerian secondary hospitals, but the deaths averted depend only on the children recorded. We judge {{row:neonatal_share}} of them to be newborns, as in that study.
- **Death risk:** in that study, about {{row:child_cfr_hypoxaemic}} of hypoxaemic children and {{row:neonatal_cfr_hypoxaemic}} of hypoxaemic newborns died in hospital.
- **Effect:** in a review of four studies, oxygen systems cut children's pneumonia deaths by about half. Over the hypoxaemic children's deaths alone, where oxygen acts, that is about {{row:child_mortality_reduction}}. For newborns the evidence is mixed, so we take a {{row:neonatal_mortality_reduction}} fall, with a range that includes harm.
- **After discharge:** children saved from a severe illness die more often in the following months, so each death averted counts at {{row:survivor_remaining_life_ratio}} of a child's remaining life.
- **Adjustments:**
  - we trust {{row:internal_validity_adj}} of the studies' effect, because they are before-after comparisons;
  - {{row:external_validity_adj}} carries over to children whose low oxygen comes from illnesses other than pneumonia;
  - oxygen reached the recorded children at {{row:implementation_adj}} of the studies' coverage, as the charity bought no equipment of its own in 2025;
  - {{row:counterfactual_adj}} of the improvement wouldn't have come from others that year;
  - the charity's share of the resources is {{row:attribution_share_shared}}, beside the hospitals' staff and oxygen.
- **Missing data:** the missing-data discount applies, because the charity hasn't measured deaths or treatment.

### What drives the result

The missing-data discount, how far the before-after studies can be trusted, the value of a child's life, the share of newborns and the fall in children's death risk move the result most.

### Biggest uncertainties

- **The effect:** the randomised Nigerian trial found no further fall in children's deaths once the full oxygen system was added to pulse oximetry. Introducing pulse oximetry itself went with far fewer deaths among children with pneumonia. Oxygen Access Project's work includes both.
- **Delivery:** the charity reports the children recorded, not those treated or how they fared. It plans a published external evaluation of impact and cost.
- **Newborns:** the trial found higher odds of newborn deaths after the full system came in than with pulse oximetry alone, which its authors put down to sicker newborns being admitted; against care before the trial, newborn deaths didn't change.

### What isn't modelled

Spending before registration (from late 2024, when the charity ran a proof of concept in one facility) and 2026's expansion aren't counted. Training and reporting habits that last beyond the year are counted only as a small share, net of misrecorded readings.

### How this model was checked

Audit rounds are listed in audits/oxygen-access-project-charityevals/. Round 1 found six medium issues, all fixed: the death risks now use the study's crude odds ratios; the adjustments for what would have happened anyway, delivery and how well the studies carry over each ask only their own question; newborns are half of the children, as in the study; and saved children's higher risk after discharge is counted. That took the result from 2.4 to {{result}}. Round 2 passed.

### Sources

- Oxygen Access Project, Trustees' Annual Report and Financial Statements, 14 February to 31 December 2025 (Charity Commission register, charity 1212160): https://register-of-charities.charitycommission.gov.uk/en/charity-search/-/charity-details/5253128/accounts-and-annual-returns
- Oxygen Access Project, website: https://www.oxygenaccessproject.org
- Lam et al. (2021), Oxygen systems strengthening to prevent childhood pneumonia deaths: systematic review and meta-analysis, BMJ Global Health: https://pmc.ncbi.nlm.nih.gov/articles/PMC8689120/
- Graham et al. (2019), Improving oxygen therapy for children and neonates in secondary hospitals in Nigeria: stepped-wedge cluster randomised trial, PLoS Medicine: https://pmc.ncbi.nlm.nih.gov/articles/PMC6844455/
- Graham et al. (2019), Hypoxaemia in hospitalised children and neonates in Nigerian secondary-level hospitals, EClinicalMedicine: https://pmc.ncbi.nlm.nih.gov/articles/PMC6890969/
- Nemetchek et al. (2018), Paediatric postdischarge mortality in developing countries: a systematic review, BMJ Open: https://pmc.ncbi.nlm.nih.gov/articles/PMC6318528/
