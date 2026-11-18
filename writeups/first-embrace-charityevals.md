### Summary

First Embrace runs kangaroo care for small and premature newborns on public hospital wards in Kano State, Nigeria. Kangaroo care means continuous skin-to-skin contact with the mother, with support for breastfeeding. Our model of its first year comes to **{{result}} years of healthy life per $1,000** (plausible range {{range}}).

The model covers 2026, its first year, at its two hospitals. The year costs about {{row:program_spend}} and enrols about {{row:people_reached}} newborns. Before the programme began, about {{row:baseline_mortality_rate}} of such newborns died in their first month at the pilot hospital. Kangaroo care cuts those deaths by about {{row:mortality_reduction}} in the latest Cochrane review. The model counts that only for the {{row:implementation_adj}} of newborns who get at least two hours of skin-to-skin a day.

### What the charity does

- **Nurses**: First Embrace recruits, trains and pays nurses who run a kangaroo care ward inside the hospital. They find small newborns in the hospital's registers and by weighing them.
- **Care**: the nurses help mothers start skin-to-skin contact as early as the baby's condition allows, support breastfeeding and teach danger signs. They escalate unstable newborns to intensive care.
- **Follow-up**: every newborn is followed up to day 28.
- **Government**: it shares all its data with the Kano State Ministry of Health and works with the ministry towards Nigeria's target of 95% coverage by 2030.

First Embrace began in February 2026 at one public tertiary hospital and added a second later in the year. Its dashboard counts the newborns cared for since then.

### How the model works

**Cost and reach.** First Embrace has no accounts yet. The model takes 2026's spending from its own reports: the seed grant that paid for set-up and February to August, and its monthly spending since then at both hospitals. Each hospital's one-time set-up is spread over the years it serves. The newborns are its dashboard's count since February, plus the rest of the year at the current pace.

**Effect.**
- The baseline is First Embrace's own count at the hospital before the programme: 12 known deaths among 71 small newborns who lived long enough to be enrolled, plus the deaths expected among the 25 it lost to follow-up. Because the sample is small, it is weighted with an estimate for small newborns across Kano State.
- The effect is the 2026 Cochrane review's relative risk across the skin-to-skin durations hospitals deliver, {{row:kmc_rr}}.
- Each death averted is valued at the site's shared value of a neonatal death.
- Illness averted and survivors' later development are added as shares of that value, at the site's shared figures for kangaroo care.

**Adjustments.**
- Trust in the trials and how far they carry: {{row:evidence_adj}}. First Embrace's newborns get less skin-to-skin than most trials', but many start immediately.
- Newborns who would have got kangaroo care anyway: {{row:counterfactual_adj}}.
- First Embrace's share next to the hospital's own contribution: {{row:attribution_share}}.
- The share of newborns with enough daily skin-to-skin: {{row:implementation_adj}}.

First Embrace's own before-and-after data is a check, not an input: about 9% died after the programme began. That would be a much larger fall, but the case mix differs and there is no comparison group.

### What drives the result

- The size of the effect at First Embrace's low daily dose: the review's interval runs from almost no effect to a third fewer deaths.
- The baseline mortality, from a small sample.
- The share of newborns who get enough skin-to-skin.

### Biggest uncertainties

- **The effect at this dose.** Only a minority of the review's trials met the WHO standard of 8 or more hours a day. First Embrace's newborns averaged about 3.6 hours early in the pilot, though the dose has been rising.
- **Baseline.** It comes from a month at one hospital, with a third of newborns lost to follow-up.
- **Testing it.** First Embrace plans a randomised rollout across new hospitals, which would measure its own effect.

### What isn't modelled

These are counted as small shares of the value rather than modelled in full:

- the nurses' escalation of sick newborns to intensive care;
- better records;
- the work with the state government, which could bring kangaroo care to hospitals First Embrace never runs;
- longer hospital stays for mothers.

### How this model was checked

Before the independent audit rounds in audits/first-embrace-charityevals/, the model passed the site's mechanical checks (preflight: lint, invariants, simulation, sources). Round 1, a full audit, found two highs, one medium and ten lows. The baseline had sat at the hospital cohort's lower bound, counting the newborns lost to follow-up as survivors; it now adds their expected deaths and weights that with an estimate for Kano. The idea-stage estimate of First Embrace by Ambitious Impact is to be retired. The model moved from one hospital's annualised pilot to calendar 2026 at both hospitals, spreading each hospital's set-up over the years it serves. The lows were fixed too: the share with enough skin-to-skin, staff pay, reserves, and the unmodelled effects split into their own rows. A verification round passed.

### Sources

- [First Embrace, pilot results (July 2026)](https://forum.effectivealtruism.org/posts/wGXCuedzsubqNDAca/introducing-first-embrace-an-ambitious-impact-incubated): costs, enrolment, effective-dose share.
- [First Embrace, impact dashboard](https://firstembrace.org.uk/impact) and [pilot baseline report](https://firstembrace.org.uk/updates/pilotbaseline).
- [First Embrace, 2027 funding gap](https://forum.effectivealtruism.org/posts/JPfJXoyzubfuoSttE/first-embrace-s-2027-funding-gap).
- [Cochrane review of kangaroo mother care (2026 update)](https://doi.org/10.1002/14651858.CD002771.pub5).
- [WHO Immediate KMC Study Group (2021)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8108485/), immediate kangaroo mother care, NEJM.
- [GiveWell, Ansh kangaroo care analysis (2024)](https://www.givewell.org/research/grants/ansh-kangaroo-care-scaling-grant-rajasthan-india-december-2024): the shared illness and development shares.
