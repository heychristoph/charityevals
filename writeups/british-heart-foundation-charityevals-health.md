### Summary

This is the British Heart Foundation's health and support work in the UK, in the year to 31 March 2026. It covers CPR training, the national defibrillator network, health information, the Heart Helpline and the Heart Matters magazine. BHF's research and policy work is the [main model](/british-heart-foundation-charityevals).

We estimate **<span data-figure="headline" data-model="british-heart-foundation-charityevals-health">0.05</span> years of healthy life per $1,000** you give to this work. Most of that figure comes from information and support. That part publishes no outcomes, so it is valued at comparable work elsewhere on the site and discounted for missing data. CPR training and defibrillators, which we model from evidence, come to under 0.01.

### What the charity does

BHF's health spending was £54.2m. The accounts don't split it by activity, so the shares below are our estimates:

- **CPR and defibrillators, about 15%.** The free RevivR app teaches CPR in about 15 minutes, and 190,000 people completed it in the year. The Circuit is the defibrillator map every UK ambulance service uses to send 999 callers to the nearest device. It lists 118,800 defibrillators.
- **Policy, about 6%.** This is modelled in the main model.
- **Information and support, the rest.** This covers the health information pages, the magazine, the nurse-led helpline, online peer support, awareness campaigns, and pilots run through the Healthcare Implementation Fund.

### How the model works

**RevivR:**
- A trainee is at a cardiac arrest about once in 1,200 years. That comes from 54 arrests per 100,000 people a year, with 1.5 people present at each.
- Over the 3 years the training lasts, a trained bystander is 15 percentage points likelier to give CPR. In England, bystanders already give CPR at 73% of arrests.
- Bystander CPR adds about 4 points to survival. This is the adjusted figure from a Swedish registry of 30,000 arrests.
- A fifth of trainees would have learned CPR elsewhere in those years.

**The Circuit:**
- Bystanders use a public defibrillator in 9% of the UK's 43,000 attempted resuscitations.
- We judge that a fifth of those uses happen because the network sent someone to a device.
- Each use adds about 8 points to survival.
- BHF gets a tenth of the credit, because others bought the devices and look after them.

Deaths averted are valued at the site's value of a death by age.

**Information and support:** valued at the median of two ranked best guesses for similar UK work, SoGive's for Breast Cancer Now and Founders Pledge's for Action for Happiness (wellbeing information and courses), times the shared "How much we count a programme we could only estimate from similar ones" (50% by default).

### Biggest uncertainties

- **The proxy.** No model on the site measures patient information or a helpline in a rich country, so the peers are the nearest ranked best guesses. SoGive's upper bounds for the MND Association and Versus Arthritis are left out, since the site never ranks an upper bound. The helpline reports contacts and satisfaction, and the year's implementation grants are new pilots, so neither has outcomes to model.
- **The spending split** inside health is our judgment.
- **The survival gains** come from registries, not trials. No study measures what The Circuit adds.

### How this model was checked

Mechanical checks: lint, the normalization invariants and the reference class (`scripts/audit-model.ts`). Independent audit rounds are recorded in the main model's write-up.

### Sources

- [BHF Annual Report and Accounts 2025-26](https://www.bhf.org.uk/what-we-do/-/media/files/annual_report_and_accounts_2025-26.pdf)
- [Resuscitation Council UK, epidemiology of cardiac arrest (2025 guidelines)](https://www.resus.org.uk/library/2025-resuscitation-guidelines/epidemiology-cardiac-arrest-guidelines)
- Hasselqvist-Ax et al., NEJM 2015; Pollack et al., Circulation 2018 (abstracts via Europe PMC)
