### Summary

Médecins Sans Frontières (MSF, Doctors Without Borders) runs hospitals, clinics, feeding centres, vaccination campaigns and outbreak responses in about 70 countries, mostly in war zones and epidemics. Counting what its whole 2025 medical budget did, service by service, we estimate **<span data-figure="headline" data-model="doctors-without-borders-charityevals">1.2</span> years of healthy life per $1,000**.

That is well below the site's top health charities, which buy one cheap intervention against one big killer, and in line with what careful studies have found for crisis hospital care (about $170-220 per healthy year at two MSF trauma centres, before overhead and counterfactuals). Nearly all of the uncertainty is judgment: MSF publishes how many patients it treats, but not how many would have died without it, nor how many would have been treated by someone else. Its relief distributions and search and rescue at sea are a separate, smaller model ([relief](/doctors-without-borders/doctors-without-borders-charityevals-relief), <span data-figure="headline" data-model="doctors-without-borders-charityevals-relief">1.1</span>).

### What the charity does

In 2025 MSF's 51 entities together spent 2.5 billion euros, 79% of it on its social mission: 1.58 billion on field programmes (the DRC, Sudan, Palestine, South Sudan, Nigeria, Yemen, Chad, CAR, Afghanistan and Niger the largest), 316 million on programme support, 63 million on awareness-raising and MSF Access. 98% of its income is private. Its teams gave 17 million outpatient consultations, treated 3.6 million malaria cases, admitted 1.8 million inpatients, vaccinated 2.1 million people in measles outbreaks, treated 829,000 malnourished children, 149,000 cholera patients, 30,000 new TB patients and 39,000 people on HIV treatment, assisted 405,000 births and performed 146,500 operations.

### How the impact happens

Most of the good is deaths averted: a child with severe malaria or complicated malnutrition, a cholera patient, a mother with an obstructed labour, a wounded man needing surgery would often die without care. The rest is illness averted (shorter, milder disease, disability averted by surgery, mental-health care and care after sexual violence).

### How the model works

Each service MSF counts is a branch: patients × the chance they would have died without care × the share of that risk MSF's care removes × the share who wouldn't have been treated elsewhere. The risks come from case-fatality studies (malaria: the Lives Saved Tool's review; TB: pre-treatment cohorts; measles: Portnoy et al.; cholera: WHO; malnutrition: the site's figure for the excess mortality of untreated severe wasting), each a ranged judgment where no study fits. Malaria, measles and cholera also carry the indirect deaths GiveWell counts per direct death of a young child (the site's figures), of which treatment averts an estimated 70% (measles vaccination all of them). Overlaps are taken out (malaria cases from consultations, malnutrition, birth and cholera admissions from all admissions, caesareans from surgery). Every branch then shares the same adjustments: trust in the evidence (0.86), MSF's share of the resources where it supports government facilities or works remotely (85%), how faithfully episode counts describe care (90%), and the wait until care (a gift waits about as long as MSF's six months of liquid reserves). Deaths are valued at the site's weights by age band. All branches are counted against the whole medical budget, with fundraising and administration spread over it, since MSF doesn't report costs by service. Work the activity figures don't count (seasonal malaria chemoprevention, other outbreak vaccinations, drug-resistant TB, water and sanitation) is in a +9% supplementary share.

Awareness-raising, MSF Access and MSF's contribution to DNDi (3.5% of the spending) publish no outcome data. They are valued by the proxy step: awareness-raising at the site's model of health mass media (Development Media International), MSF Access and DNDi at the median of the site's global-health policy advocacy models (LEEP, Innovation in Government Initiative, Pure Earth), both counted at half by the shared missing-data slider. Together they add about 8% to the result.

### What drives the result

- **Severe malnutrition and malaria**: about two-thirds of the deaths averted. How often a child with malaria would have died untreated is the biggest single question (it moves the result from about 1.0 to 1.9).
- **The counterfactuals**: on average just over half of MSF's patients are counted as people nobody else would have treated. Halve every counterfactual and the medical part halves (the result falls about 45%).
- **MSF's share of the resources** where it supports government facilities (60-100%: 0.9 to 1.4).
- The shared sliders (healthy year vs income, value of a life, discount rate) move it as they move every health model.

### Biggest uncertainties

- No trial measures MSF's care against no care; every risk is a case-fatality figure or our judgment, ranged widely.
- MSF reports outputs for the movement as a whole; the split between conflict trauma care, epidemics and routine care in neglected places isn't costed, so a dollar's value is the average of all of them.
- The general branches (other admissions, other consultations) are the least evidenced and together carry about a sixth of the deaths averted.

### What isn't modelled

Long-term income effects are not counted (no evidence for treatment of these episodes). The value of MSF's independence and witnessing in places others can't reach is counted only through the advocacy proxy. Uncounted services are a supplementary share, not branches.

### How this model was checked

Built with charityevals' direct-health template; the mechanical audit (scripts/audit-model.ts) and the site's invariants pass. Independent audit, round 1 (1 high, 3 medium, 6 low): indirect deaths of malaria, measles and cholera were missing (added from the site's shared figures); the advocacy proxy valued public communications as policy advocacy (split, awareness-raising now at the mass-media peer); outpatient malnutrition was calibrated to a figure already net of GiveWell's adjustments (rebuilt from the shared mortality ratio); uncounted services were under-counted (supplementary share raised from +5% to +10%, kept out of the proxy because they belong to programmes that report outcomes); and the reserves wait, funging, surgery's illness counted twice, the measles range, remote support and the write-up's figures were corrected. Round 2 (1 high, 1 medium, 6 low): the mental-health branch converted depression into DALYs its own way (now the site's PHQ-9 conversion); two value formulas hid an age choice in a literal (now ranged rows); indirect deaths now apply to under-fives only and in full for measles vaccination; surgery taken out of other admissions; child mortality and the supplementary share corrected. Round 3 (no high, 1 medium, 6 low): the age splits that follow a disease's deaths (malaria, measles, TB, HIV) now read GBD 2023 shares for sub-Saharan Africa added to the site's facts; the supplementary share's arithmetic was corrected (+9%).

### Sources

- [MSF International Financial Report 2025](https://www.msf.org/sites/default/files/2026-07/MSF_International_Financial_Report_2025.pdf) (combined audited accounts)
- [MSF International Activity Report 2025: 2025 figures](https://www.msf.org/international-activity-report-2025/2025-figures)
- [Thwing et al. 2011, malaria case management](https://pmc.ncbi.nlm.nih.gov/articles/PMC3231887); [Tiemersma et al. 2011, untreated TB](https://pmc.ncbi.nlm.nih.gov/articles/PMC3070694/); [Portnoy et al. 2019, measles case fatality](https://researchonline.lshtm.ac.uk/id/eprint/4652389); [Grais et al. 2008, measles outbreak response](https://pubmed.ncbi.nlm.nih.gov/17504737); [WHO cholera fact sheet](https://www.who.int/news-room/fact-sheets/detail/cholera); [Gosselin et al. 2010, MSF trauma centres](https://scienceportal.msf.org/assets/comparative-cost-effectiveness-analysis-two-msf-surgical-trauma-centers)
